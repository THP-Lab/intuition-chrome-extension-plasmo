import { useCallback } from "react";
import { useDepositTerm } from "./useDepositTerm";

type Hex32 = `0x${string}`;

/**
 * Hook wrapper qui appelle depositTerm et rafraîchit automatiquement
 * les données du content script après un dépôt réussi
 */
export function useDepositWithRefresh() {
  const depositTermHook = useDepositTerm();

  const depositTerm = useCallback(
    async (termId: Hex32 | string | bigint | { vaultId: Hex32 | string | bigint }, opts?: any) => {
      try {
        console.log("[useDepositWithRefresh] Début du dépôt...");
        const result = await depositTermHook.depositTerm(termId as any, opts);
        console.log("[useDepositWithRefresh] ✅ Dépôt réussi, envoi du message de rafraîchissement");
        
        // Envoyer un message au background qui le relayera au content script
        // Le background script envoie déjà REFRESH_CLAIMS lors de onUpdated et onActivated
        // Mais on peut aussi déclencher manuellement
        chrome.runtime.sendMessage({ 
          type: "REFRESH_CONTENT_SCRIPT"
        }).catch(err => {
          console.log("[useDepositWithRefresh] Runtime message error (normal si pas de listener):", err);
        });
        
        return result;
      } catch (error) {
        console.error("[useDepositWithRefresh] ❌ Erreur lors du dépôt:", error);
        throw error;
      }
    },
    [depositTermHook.depositTerm]
  );

  return {
    depositTerm,
    isSubmitting: depositTermHook.isSubmitting,
    isDepositing: depositTermHook.isSubmitting, // Alias pour compatibilité
    txHash: depositTermHook.txHash,
    error: depositTermHook.error,
    reset: depositTermHook.reset,
  };
}
