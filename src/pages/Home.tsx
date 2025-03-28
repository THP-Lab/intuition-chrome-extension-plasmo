import React, { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useTheme } from "~/src/components/ThemeProvider"
import TabSystem from '../components/TabSystem';
import { useStorage } from "@plasmohq/storage/dist/hook"
import {  useGetClaimsByUriQuery } from "~src/graphql/src"
import ClaimRowLite from "~src/components/ui/ClaimRowLite";
import AtomCard from "~src/components/AtomCard";

function Home() {
  const { theme } = useTheme()
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [walletAddress] = useStorage<string>("metamask-account")
  useQueryClient() // Sets the client for gql queries

  const getCurrentUrl = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    })
    console.log(tab.url)
    return tab.url
  }
  const refreshUrl = () => {
    getCurrentUrl().then((url) => setCurrentUrl(url || ""))
  }
  useEffect(() => {
    console.log("current wallet address:", walletAddress);
    refreshUrl()
    chrome.tabs.onUpdated.addListener(() => {
      refreshUrl()
    })

    chrome.tabs.onActivated.addListener(() => {
      refreshUrl()
    })
  }, [])

  const { data, isLoading, error } = useGetClaimsByUriQuery({uri: currentUrl})
  const atoms = data?.atoms ?? []

  const claims = Array.from(
    new Map(
      atoms?.flatMap(atom => [...atom.as_object_claims_aggregate.nodes, ...atom.as_subject_claims_aggregate.nodes])
        .map(claim => [claim.triple_id, claim])

    ).values()
  )
 
  console.log(claims);

  const tabs = [
    {
      label: 'Claims',
      content: 
      <div>        
        {isLoading ? "Chargement..." : (typeof data !== "undefined" && claims.length !== 0)? 
        ( claims.map((claim, index) => (
        
        
        <ClaimRowLite
              key={claim.id} 
              subjectLabel={claim.subject.label ?? "No subject"}
              subjectImage={claim.subject?.image ?? undefined}
              predicateLabel={claim.predicate?.label ?? "No predicate"}
              predicateImage={claim.predicate?.image ?? undefined}
              objectLabel={claim.object?.label ?? "No object"}
              objectImage={claim.object?.image ?? undefined}
              numPositionsFor={claim.vault.positions_aggregate.aggregate?.count ?? 0}
              numPositionsAgainst={claim.counter_vault.positions_aggregate.aggregate?.count ?? 0}
              userStake={Number(claim.shares ?? 0)}
              userCounterStake={Number(claim.counter_shares ?? 0)}
              isFirst={index === 0}
              isLast={index === claims.length - 1}
              vaultId={claim.vault_id}
              counterVaultId={claim.counter_vault_id}
            />
          
            ))
        ) : (
          <p>Aucun claim trouvé pour cette URL.</p>
        )}
      </div>
    },
    {
      label: 'Atoms',
      content: 
      <div>
        {isLoading ? "Chargement...": (typeof data !== "undefined" &&  atoms.length != 0)?
          (atoms.map((atom) => {
            return (
              <AtomCard atom={atom} />
            );
          })):
          (
          <p>Aucun atom trouvé pour cet URL</p>
          )

        }
        
      </div>
      
    },
    {
      label: 'Onglet 3',
      content: <div>Contenu de l'onglet 3</div>
    }
  ];


  return (
    <div className="space-y-6">
      <div className="space-y-2">
      <h1 className="light-sweep-heading">Bienvenue sur Intuition</h1>
        <p className="text-muted-foreground">
          Cette application vous permet de gérer vos insights et vos recherches.
        </p>
      </div>


        <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Home Page - Atoms</h1>
        {error && <p className="text-red-500">Une erreur est survenue lors de la requête pour cette page.</p>}

        <TabSystem tabs={tabs} />


        
      </div>
    </div>
  )
}

export default Home
