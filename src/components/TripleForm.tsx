import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  type ForwardRefRenderFunction,
} from "react";
import AtomAutocompleteInput from "./AtomAutocompleteInput";
import { useCreateTriples } from "~src/hooks/useCreateTriples";
import { umami } from "~src/lib/umami";
import type { Atom, Hex32 } from "~src/types/atoms";

type Triple = [Atom, Atom, Atom];

export type TripleFormRef = {
  resetForm: () => void;
};

const TripleForm: ForwardRefRenderFunction<TripleFormRef, {}> = (_, ref) => {
  const [subject, setSubject] = useState<Atom | null>(null);
  const [predicate, setPredicate] = useState<Atom | null>(null);
  const [object, setObject] = useState<Atom | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [labeledTriples, setLabeledTriples] = useState<Triple[]>([]);

  const {
    addTriple,
    clearTriples,
    removeTriple,
    triples,
    createTriples,
    isLoading,
    error,
    txHash,
    termIds,
  } = useCreateTriples();

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setSubject(null);
      setPredicate(null);
      setObject(null);
      setLabeledTriples([]);
      clearTriples();
      setErrorMessage(null);
      setProgressMessage(null);
    },
  }));

  const canSubmit = labeledTriples.length > 0;

  const handleRemoveTriple = (index: number) => {
    setLabeledTriples((prev) => prev.filter((_, i) => i !== index));
    removeTriple(index);
  };

  const handleAddTriple = () => {
    if (!subject || !predicate || !object) {
      setErrorMessage("All three atoms must be selected.");
      return;
    }

    if (!subject.term_id || !predicate.term_id || !object.term_id) {
      setErrorMessage("All atoms must have valid term IDs.");
      return;
    }

    try {
      // v2 : on pousse directement les Hex32 (pas de BigInt)
      addTriple([subject.term_id as Hex32, predicate.term_id as Hex32, object.term_id as Hex32]);

      setLabeledTriples((prev) => [
        ...prev,
        [subject, predicate, object],
      ]);

      setSubject(null);
      setPredicate(null);
      setObject(null);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Invalid term IDs or atoms.");
    }
  };

  const handleSubmitAll = async () => {
    setErrorMessage(null);

    try {
      if (triples.length === 0) {
        setErrorMessage("Please add at least one triple to submit.");
        return;
      }

      setProgressMessage("Creating triples...");
      const { termIds: createdTermIds = [] } = await createTriples();

      await umami("triples_created", {
        termIds: (createdTermIds ?? []).join(","),
      }).catch(console.error);

      if (!createdTermIds || createdTermIds.length !== labeledTriples.length) {
        throw new Error("Mismatch between created triples and local list");
      }

      setProgressMessage("✅ Triples created successfully!");
      
      // Reset form
      setLabeledTriples([]);
      clearTriples();
      setSubject(null);
      setPredicate(null);
      setObject(null);
    } catch (err: any) {
      setErrorMessage(err?.message || "An unknown error occurred.");
    }
  };

  // debug local de l'erreur du hook batch
  if (error) console.log(error);

  return (
    <div className="space-y-6">
      {labeledTriples.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Triples to create:</h3>
          <ul className="space-y-2">
            {labeledTriples.map((triple, i) => {
              const [s, p, o] = triple;

              if (!s || !p || !o) return null;

              return (
                <li key={i} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">
                    {s.label} → {p.label} → {o.label}
                  </span>
                  <button
                    onClick={() => handleRemoveTriple(i)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <form
        className="space-y-4 p-4 bg-background rounded"
        onSubmit={(e) => e.preventDefault()}
      >
        <AtomAutocompleteInput
          label="Subject"
          onSelect={setSubject}
          selected={subject}
        />
        <AtomAutocompleteInput
          label="Predicate"
          onSelect={setPredicate}
          selected={predicate}
        />
        <AtomAutocompleteInput
          label="Object"
          onSelect={setObject}
          selected={object}
        />

        <div className="flex gap-8 justify-center">
          <button
            type="button"
            onClick={handleAddTriple}
            className="w-20 px-4 py-2 btn-atom-form-hover-effect text-foreground bg-[hsl(var(--btn-atom-form-bg))] text-center rounded-xl"
          >
            Add
          </button>

          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={isLoading || !canSubmit}
            className={`
              w-20 px-4 py-2 text-foreground text-center rounded-xl
              btn-atom-form-hover-effect bg-[hsl(var(--btn-atom-form-bg))]
              ${!canSubmit || isLoading ? "cursor-not-allowed opacity-50" : ""}
            `}
          >
            {isLoading ? "Send..." : "Submit"}
          </button>
        </div>

        {txHash && <p className="text-green-600 text-sm">Tx: {txHash}</p>}
        {termIds && (
          <p className="text-green-600 text-sm">
            Terms: {termIds.join(", ")}
          </p>
        )}
        {progressMessage && (
          <p
            className={`text-sm ${
              progressMessage.startsWith("Transaction") ? "text-blue-500" : "text-green-600"
            }`}
          >
            {progressMessage}
          </p>
        )}
        {(errorMessage || error) && (
          <p className="text-red-600 text-sm">{errorMessage || error}</p>
        )}
      </form>
    </div>
  );
};

export default forwardRef(TripleForm);
