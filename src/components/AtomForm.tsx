import React, {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";

import { usePinThingMutation } from "@0xintuition/graphql";
import { createAtomFromThing, getMultiVaultAddressFromChainId } from "@0xintuition/sdk";
import { getClients } from "../lib/viemClient";
import { LinkTypeSelector } from "./LinkTypeSelector";
import { umami } from "~src/lib/umami";

export interface AtomFormHandle {
  resetForm(): void;
}

type Hex32 = `0x${string}`;

interface CreatedAtomPayload {
  id: Hex32;       
  term_id: Hex32;   
  label: string;
  emoji: string | null;
  tx_hash: Hex32;
}

interface AtomFormProps {
  onCreated?: (atom: CreatedAtomPayload) => void;
  initialName?: string;
  initialDescription?: string;
  initialImage?: string;
  initialUrl?: string;
}

const AtomForm = forwardRef<AtomFormHandle, AtomFormProps>(function AtomForm(
  { onCreated, initialName = "", initialDescription = "", initialImage = "", initialUrl = "" },
  ref
) {
  const { mutateAsync: pinThing } = usePinThingMutation();

  const [name, setName] = useState(initialName ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [image, setImage] = useState(initialImage ?? "");

  const [rawUrl, setRawUrl] = useState(initialUrl ?? "");
  const [url, setUrl] = useState(initialUrl ?? "");

  const [created, setCreated] = useState<{ termIdHex: Hex32; txHash: Hex32 } | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkType, setLinkType] = useState<"url" | "domain">("url");
  const [explorerBase, setExplorerBase] = useState<string>("");

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const shortHash = (h: string, head = 6, tail = 4) =>
    h.length > head + tail ? `${h.slice(0, head)}…${h.slice(-tail)}` : h;

  useImperativeHandle(ref, () => ({
    resetForm() {
      setName("");
      setDescription("");
      setImage("");
      setRawUrl("");
      setUrl("");
      setProgressMessage(null);
      setErrorMessage(null);
      setIsSubmitting(false);
      setCreated(null);
      descriptionRef.current?.style.setProperty("height", "auto");
    },
  }));

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [description]);

  // Normalisation de l'URL depuis rawUrl
  useEffect(() => {
    if (!rawUrl) return;

    try {
      const input = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
      const parsed = new URL(input);
      const hostnameWhithoutWWW = parsed.hostname.replace(/^www\./i, "");

      let candidate: string;
      if (linkType === "domain") {
        candidate = `${parsed.protocol}//${hostnameWhithoutWWW}`;
      } else {
        candidate =
          `${parsed.protocol}//${hostnameWhithoutWWW}` +
          `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      if (candidate.endsWith("/") && !/^https?:\/\/[^/]+\/$/.test(candidate)) {
        candidate = candidate.slice(0, -1);
      }
      setUrl(candidate);
    } catch {
      const fallback = rawUrl
        .replace(/^https?:\/\/www\./i, (m) => m.replace(/www\./i, ""))
        .replace(/\/$/, "");
      setUrl(fallback);
    }
  }, [rawUrl, linkType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setProgressMessage("Pinning Atom metadata...");
    setErrorMessage(null);

    try {
      const { walletClient, publicClient } = await getClients();
      if (!walletClient || !publicClient) throw new Error("Wallet not connected");

      // explorer dynamique
      const explorer = publicClient.chain?.blockExplorers?.default?.url ?? "";
      setExplorerBase(explorer);

      // 1) Pin off-chain (inchangé)
      const result = await pinThing({ name, description, image, url });
      const ipfsUri = result.pinThing?.uri;
      if (!ipfsUri) throw new Error("Failed to pin atom metadata.");
      setProgressMessage(`Atom pinned! URI: ${ipfsUri}`);

      // 2) Adresse MultiVault selon la chain active
      const chainId = publicClient.chain?.id;
      if (!chainId) throw new Error("Unknown chain id");
      const address = getMultiVaultAddressFromChainId(chainId);

      // 3) Création on-chain via SDK v2
      setProgressMessage("Submitting on-chain transaction...");
      const data = await createAtomFromThing(
        { walletClient, publicClient, address },
        {
          url,         // version normalisée
          name,
          description,
          image,
          // (optionnels: tags, twitter, github…)
        }
      );

      // SDK v2 → { uri, transactionHash, state: { termId, atomWallet, creator, atomData } }
      const termIdHex = data.state.termId as Hex32;
      const txHash = data.transactionHash as Hex32;

      setProgressMessage("Atom created!");
      setCreated({ termIdHex, txHash });

      onCreated?.({
        id: termIdHex,
        term_id: termIdHex,
        label: name,
        emoji: null,
        tx_hash: txHash,
      });

      umami("atom_created", { termId: termIdHex, txHash });
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4 p-4 bg-background rounded">
      <div>
        <label htmlFor="name" className="font-bold mb-1">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 relative z-10"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-bold mb-1">Description</label>
        <textarea
          ref={descriptionRef}
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 resize-none overflow-hidden relative z-10"
          rows={1}
        />
      </div>

      <div>
        <label htmlFor="image" className="block font-bold mb-1">Image URL</label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 relative z-10"
        />
        {image && (
          <div className="mt-2">
            <img src={image} alt="Favicon preview" className="w-10 h-10 rounded shadow" />
          </div>
        )}
      </div>

      <LinkTypeSelector linkType={linkType} setLinkType={setLinkType} />

      {/* Input piloté par rawUrl */}
      <input
        id="url"
        type="text"
        value={rawUrl}
        onChange={(e) => setRawUrl(e.target.value)}
        className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 relative z-10"
      />
      {rawUrl && url && rawUrl !== url && (
        <p className="text-xs text-muted-foreground">Normalisé : {url}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full px-4 py-2 text-foreground btn-atom-form-hover-effect rounded bg-[hsl(var(--btn-atom-form-bg))]">
        {isSubmitting ? "Submitting..." : "Create Atom"}
      </button>

      {progressMessage && <p className="text-sm text-green-600">{progressMessage}</p>}

      {created && (
        <p className="text-sm text-green-600">
          Atom:&nbsp;
          <Link to={`/atoms/${created.termIdHex}`} className="ml-0 font-semibold underline">
            {created.termIdHex}
          </Link>
          {" | TX: "}
          <a
            href={explorerBase ? `${explorerBase}/tx/${created.txHash}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {shortHash(created.txHash)}
          </a>
        </p>
      )}

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  );
});

export default AtomForm;
