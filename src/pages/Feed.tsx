import React, { useState, useMemo, useEffect } from "react";
import ClaimRowLite from "~src/components/ui/ClaimRowLite";
import { useGetTriplesWithPositionsQuery, useGetEventsFeedQuery } from "@warzieram/graphql";
import { getAddress } from "viem"
import { useInfiniteScroll } from "~src/hooks/useInfiniteScroll";
import { useWalletAddress } from "~src/hooks/useWalletAddress";

// IDs du protocole Intuition pour les triples "follows"
const I_SUBJECT_ID = "0x7ab197b346d386cd5926dbfeeb85dade42f113c7ed99ff2046a5123bb5cd016b"
const FOLLOWS_PREDICATE_ID = "0xffd07650dc7ab341184362461ebf52144bf8bcac5a19ef714571de15f1319260"

const default_img =
  "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000";

function shortAddress(addr?: string) {
  if (!addr) return "";
  if (addr.length < 25) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function Feed() {
  const walletAddress = useWalletAddress();
  const [checksumAddress, setChecksumAddress] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const PAGE_SIZE = 100;

  useEffect(() => {
    if (!walletAddress) {
      setChecksumAddress(null);
      return;
    }
    try {
      setChecksumAddress(getAddress(walletAddress));
    } catch (err) {
      console.error("Adresse invalide :", err);
      setChecksumAddress(null);
    }
  }, [walletAddress]);

  // Récupérer les triples ("I" follows <object>) pour obtenir les followings
  const { data, loading, error } = useGetTriplesWithPositionsQuery({
    variables: {
      where: {
        _and: [
          { subject_id: { _eq: I_SUBJECT_ID } },
          { predicate_id: { _eq: FOLLOWS_PREDICATE_ID } }
        ]
      },
      address: walletAddress || ""
    },
    skip: !walletAddress
  });

  console.log("Feed - Raw triples data:", data);
  console.log("Feed - Loading:", loading);
  console.log("Feed - Error:", error);
  
  // Log détaillé de la structure complète d'un triple
  if (data?.triples?.[0]) {
    console.log("Feed - Full triple structure:", JSON.stringify(data.triples[0], null, 2));
  }

  // Extraire les addresses/ENS des objets (personnes suivies)
  const followings = data?.triples?.map(triple => triple.object).filter(Boolean) ?? [];
  console.log("Feed - Followings extracted:", followings);
  console.log("Feed - First following structure:", followings[0]);
  
  const addresses = useMemo(
    () =>
      followings
        .map((u) => {
          if (!u?.label) return null;
          
          console.log("Feed - Processing user:", {
            term_id: u.term_id,
            label: u.label,
          });
          
          // Le label contient l'adresse ou l'ENS du wallet suivi
          const label = u.label;
          
          // Si c'est une adresse 0x, on normalise avec getAddress
          if (label.startsWith("0x") && label.length === 42) {
            try {
              const addr = getAddress(label);
              console.log("Feed - Using address:", label, "->", addr);
              return addr;
            } catch (err) {
              console.log("Feed - Invalid address:", label, err);
              return null;
            }
          }
          
          // Si c'est un ENS ou autre format, on le retourne tel quel
          console.log("Feed - Using label (ENS or other):", label);
          return label;
        })
        .filter((addr): addr is string => addr !== null && addr !== undefined),
    [followings]
  );

  console.log("Feed - Final addresses array:", addresses);

  const {
    data: eventsData,
    loading: eventsLoading,
    error: eventsError,
  } = useGetEventsFeedQuery({
    skip: addresses.length === 0,
    variables: {
      limit: PAGE_SIZE,
      offset,
      addresses,
      address: checksumAddress!
    },
  });

  console.log("Feed - Events data:", eventsData);
  console.log("Feed - Events loading:", eventsLoading);
  console.log("Feed - Events error:", eventsError);
  console.log("Feed - Events skip:", addresses.length === 0);

  // Ajout/concaténation des events 
  useEffect(() => {
    if (eventsData?.events) {
      console.log("Feed - Events received:", eventsData.events.length, "events");
      setItems((prev) =>
        offset === 0 ? eventsData.events : [...prev, ...eventsData.events]
      );
      setHasMore(eventsData.events.length === PAGE_SIZE);
    }
  }, [eventsData, offset]);

  console.log("Feed - Final items count:", items.length);

  useInfiniteScroll({
    loading: eventsLoading,
    hasMore,
    onLoadMore: () => setOffset((prev) => prev + PAGE_SIZE),
  });

  if (!walletAddress) return <p>Connect your wallet</p>;
  if (error) return <p>Error loading followings: {error.message}</p>;
  if (eventsError) return <p>Error loading events: {eventsError.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Feed followings</h1>
      {items.length === 0 && !eventsLoading ? (
        <p>No activity found.</p>
      ) : (
        items
          .slice()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((e) => {
            if (!e.triple) return null;
            const isDeposit = e.type === "Deposited";
            const sender = isDeposit ? e.deposit?.sender : e.redemption?.sender;
            const senderImg = sender?.image ?? default_img;
            const senderLabel = sender?.label;
            return (
              <div key={e.id} className="pt-2 pb-3 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={senderImg}
                    alt={senderLabel}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">
                    <a
                      href={`https://portal.intuition.systems/app/atom/${senderLabel}?tab=portfolio`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                    >
                      {shortAddress(senderLabel)}
                    </a>
                    <strong> {isDeposit ? "deposit" : "redeem"}</strong>
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(e.created_at).toLocaleString()}
                  </span>
                </div>
                <ClaimRowLite claim={e.triple} />
                <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-4">
                  <div>
                    <span className="font-semibold">Tx :</span>{" "}
                    <a
                      href={`https://basescan.org/tx/${e.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {e.transaction_hash.slice(0, 10)}…
                    </a>
                  </div>
                </div>
              </div>
            );
          })
      )}
      {eventsLoading && hasMore && (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      )}
      {!hasMore && (
        <p className="text-center text-sm text-gray-500">No more activity.</p>
      )}
    </div>
  );
}

export default Feed;
