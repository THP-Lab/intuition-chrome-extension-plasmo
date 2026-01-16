# Migration Mainnet - Documentation

## Vue d'ensemble

Cette branche `migration-mainnet` configure l'application pour fonctionner sur le réseau Mainnet par défaut, avec la possibilité de basculer en Testnet via une variable d'environnement.

## Configuration réseau

### Par défaut : Mainnet
L'application est configurée pour utiliser le réseau **Mainnet** en production.

### Passer en Testnet
Pour utiliser le testnet, définir la variable d'environnement :
```bash
PLASMO_PUBLIC_NETWORK=testnet pnpm dev
```

Ou créer un fichier `.env` :
```env
PLASMO_PUBLIC_NETWORK=testnet
```

## Fichiers ajoutés

### 1. `src/lib/atoms.ts`
Centralise tous les IDs d'atoms utilisés dans l'application :
- `I_SUBJECT` - Atom d'identité "I"
- `FOLLOWS_PREDICATE` - Prédicat "follows"
- `IS` - Prédicat "is"
- `SCAM` - Prédicat "scam"
- `TRUSTWORTHY` - Prédicat "trustworthy"
- `HASHTAG_PREDICATE` - Prédicat pour les hashtags/tags

**Important** : Les IDs mainnet sont actuellement des placeholders et doivent être mis à jour avec les vraies valeurs une fois le protocole déployé sur mainnet.

### 2. `src/hooks/useAtomIds.ts`
Hook pour obtenir les IDs d'atoms en fonction du réseau configuré.

### 3. `src/types/images.d.ts`
Déclarations TypeScript pour l'import d'images (jpg, png, svg, etc.)

### 4. `.env.example`
Template de configuration des variables d'environnement.

## Fichiers modifiés

### `src/lib/config.ts`
- Ajout de la définition du réseau `intuitionMainnet`
- Fonction `getSelectedNetwork()` basée sur `process.env.PLASMO_PUBLIC_NETWORK`
- `getChainByNetwork()` - Obtenir la configuration de chaîne
- `getGraphQLEndpoints()` - Obtenir les endpoints GraphQL
- `getMultiVaultAddress()` - Obtenir l'adresse du contrat MultiVault
- Variable `CURRENT_NETWORK` déterminée au démarrage

### `src/lib/apolo-client.ts`
- Client Apollo configuré statiquement selon `CURRENT_NETWORK`
- Endpoints GraphQL déterminés au build

### Fichiers utilisant les IDs d'atoms (avec `useAtomIds`)
- `src/pages/Feed.tsx`
- `src/pages/RecentActivity.tsx`
- `src/components/profile/FollowingTab.tsx`
- `src/contents/plasmo-inline.tsx`
- `src/components/SubjectTag.tsx`
- `src/pages/TagsPage.tsx`
- `src/pages/AtomDetailPage.tsx`

## Configuration réseau

### Mainnet (par défaut)
- **Chain ID** : 13378
- **RPC** : https://rpc.intuition.systems
- **GraphQL** : https://mainnet.intuition.sh/v1/graphql
- **Explorer** : https://explorer.intuition.systems
- **MultiVault** : ⚠️ **À CONFIGURER** dans `src/lib/config.ts`

### Testnet (via variable d'environnement)
- **Chain ID** : 13579
- **RPC** : https://testnet.rpc.intuition.systems
- **GraphQL** : https://testnet.intuition.sh/v1/graphql
- **Explorer** : https://testnet.explorer.intuition.systems
- **MultiVault** : 0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91

## TODO avant production

1. **⚠️ URGENT : Vérifier que le contrat MultiVault est déployé sur mainnet**
   - L'adresse actuelle `0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e` doit être validée
   - Vérifier sur https://explorer.intuition.systems

2. **Mettre à jour les IDs d'atoms mainnet** dans `src/lib/atoms.ts`
   - Remplacer les valeurs placeholders par les vrais IDs déployés sur mainnet

3. **Activer le mainnet par défaut** dans `src/lib/config.ts`
   - Ligne 52 : changer `return "testnet"` en `return "mainnet"`
   - Actuellement en testnet par sécurité

4. **Vérifier les endpoints GraphQL mainnet**
   - S'assurer que `https://mainnet.intuition.sh/v1/graphql` est accessible

5. **Tester sur mainnet**
   - Vérifier que toutes les queries/mutations fonctionnent
   - Tester les dépôts et créations de triples

## Utilisation

### Build pour production (Mainnet)
```bash
pnpm build
```

### Développement avec Testnet
```bash
PLASMO_PUBLIC_NETWORK=testnet pnpm dev
```

### Dans le code
```typescript
// Obtenir les IDs d'atoms en fonction du réseau
const atomIds = useAtomIds()

// Utiliser dans une query
const { data } = useQuery({
  variables: {
    predicate_id: atomIds.FOLLOWS_PREDICATE
  }
})

// Vérifier le réseau actuel
import { CURRENT_NETWORK } from '~src/lib/config'
console.log('Current network:', CURRENT_NETWORK) // "mainnet" ou "testnet"
```

## Sécurité

⚠️ **Important** : 
- L'application est en **mainnet par défaut** et utilise de vrais tokens TRUST
- Toujours vérifier le réseau avant les transactions financières
- Pour les tests, utiliser `PLASMO_PUBLIC_NETWORK=testnet`

