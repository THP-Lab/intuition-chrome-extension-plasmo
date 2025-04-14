import React from "react"
import { cn } from "~src/lib/utils"
import VoteButtons from "~src/components/VoteButtons"
import { PopupAtom } from "./PopupAtom"
import { useStorage } from "@plasmohq/storage/hook"

interface ClaimRowLiteProps {
  claim: any
}

export const ClaimRowLite = ({ claim }: ClaimRowLiteProps) => {
  const [walletAddress] = useStorage<string>("metamask-account")
  const { vault = {}, counter_vault: counterVault = {} } = claim

  const numPositionsFor = vault.positions_aggregate?.aggregate?.count ?? claim.vault?.positions?.length ?? 0
  const numPositionsAgainst = counterVault.positions_aggregate?.aggregate?.count ?? claim.counter_vault?.positions?.length ?? 0
  const userStake = vault.positions?.find((pos) => pos.account?.id === walletAddress)?.shares ?? 0
  const userCounterStake = counterVault.positions?.find((pos) => pos.account?.id === walletAddress)?.shares ?? 0


  const vaultId = vault.id ?? claim.vault_id
  const counterVaultId = counterVault.id ?? claim.counter_vault_id

  return (
    <div
      className={cn(
        'flex justify-between items-center p-3 border border-border/10 bg-[oklch(var(--container-background))] rounded-xl mt-3 claims-hover-effect'
      )}
    >
      <div className="flex gap-1 items-center flex-wrap flex-1 min-w-0">
        <PopupAtom
          key={claim.id.toString()}
          atom={claim.subject}
        />
        <PopupAtom
          key={claim.id.toString()}
          atom={claim.predicate}
        />
        <PopupAtom
          key={claim.id.toString()}
          atom={claim.object}
        />
      </div>

      {vaultId && counterVaultId ? (
        <div className="flex flex-col items-end gap-1">
          <VoteButtons
            vaultId={BigInt(vaultId)}
            counterVaultId={BigInt(counterVaultId)}
            numPositionsFor={numPositionsFor}
            numPositionsAgainst={numPositionsAgainst}
          />
          {userStake > 0 ? (
            <div className="text-sm text-green-600">You have voting FOR</div>
          ) : userCounterStake > 0 ? (
            <div className="text-sm text-red-600">You have voting AGAINST</div>
          ) : null}
        </div>
      ) : (
        <div className="text-xs text-gray-500">Missing ID</div>
      )}
    </div>
  )
}

export default ClaimRowLite

