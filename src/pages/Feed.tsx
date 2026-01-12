import React, { useState, useMemo, useEffect } from "react";
import ClaimRowLite from "~src/components/ui/ClaimRowLite";
import { useGetFollowingsFromAddressQuery, useGetEventsFeedQuery } from "@warzieram/graphql";
import { getAddress } from "viem"
import { useInfiniteScroll } from "~src/hooks/useInfiniteScroll";
import { useWalletAddress } from "~src/hooks/useWalletAddress";

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

  const { data, loading, error } = useGetFollowingsFromAddressQuery({
    variables: { address: checksumAddress! },
    skip: !checksumAddress,
  });

  const followings = data?.following ?? [];
  const addresses = useMemo(
    () =>
      followings
        .map((u) => {
          try {
            return getAddress(u.id);
          } catch {
            return null;
          }
        })
        .filter((addr): addr is string => !!addr),
    [followings]
  );

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

  // Ajout/concaténation des events 
  useEffect(() => {
    if (eventsData?.events) {
      setItems((prev) =>
        offset === 0 ? eventsData.events : [...prev, ...eventsData.events]
      );
      setHasMore(eventsData.events.length === PAGE_SIZE);
    }
  }, [eventsData, offset]);

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
