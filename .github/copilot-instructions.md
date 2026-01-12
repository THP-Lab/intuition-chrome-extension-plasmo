# Intuition Chrome Extension - AI Coding Guide

## Architecture Overview

This is a **Plasmo-based Chrome extension** (MV3) for Web3 interactions with the Intuition protocol on testnet. The extension provides:
- **Popup UI** ([src/popup/index.tsx](src/popup/index.tsx)) - Main 600x600px interface
- **Sidepanel** ([src/sidepanel/index.tsx](src/sidepanel/index.tsx)) - Extended panel for detailed interactions
- **Content Script** ([src/contents/plasmo-inline.tsx](src/contents/plasmo-inline.tsx)) - Draggable floating button on web pages
- **Background Service** ([src/background.ts](src/background.ts)) - Message routing and sidepanel navigation

## Critical Development Setup

```bash
pnpm dev  # Development server with HMR on custom ports (1815, 1012)
pnpm build  # Production build for chrome-mv3
pnpm build:firefox  # Firefox-specific build (mv2)
```

Load the extension from `build/chrome-mv3-dev/` in Chrome during development.

## Web3 & Blockchain Integration

### Network Configuration
- **Current Network**: Intuition Testnet (configured in [src/lib/config.ts](src/lib/config.ts))
- **MultiVault Contract**: `0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91`
- Uses **viem** (not ethers) with MetaMask extension provider

### Term ID Convention (`Hex32`)
The protocol uses **32-byte hex strings** (`type Hex32 = \`0x${string}\``) for term identifiers:
```typescript
// Convert various formats to Hex32 - see src/lib/utils.ts
toBytes32("123")        // BigInt to hex
toBytes32("0xabc...")   // Pad hex to 32 bytes
```

All atom/triple identifiers use `term_id` (not `id` or `termId`) in data structures.

### Smart Contract Interactions
Key hooks pattern (see [src/hooks/](src/hooks/)):
- `useCreateTriples.ts` - Batch triple creation with deposit calculation
- `useDepositTerm.ts` - Deposit into vaults with slippage protection
- `useAtomPosition.ts` - Query/manage vault positions

Always use `getClients()` from [src/lib/viemClient.ts](src/lib/viemClient.ts) to get wallet/public clients with automatic chain switching.

## GraphQL Data Layer

**Dual GraphQL setup**:
1. **@0xintuition/graphql** - Official SDK queries for protocol data
2. **@warzieram/graphql** - Custom queries (e.g., `useGetTriplesByUriQuery`)

Apollo Client configured in [src/lib/apolo-client.ts](src/lib/apolo-client.ts) with:
- HTTP endpoint: `https://testnet.intuition.sh/v1/graphql`
- WebSocket endpoint: `wss://testnet.intuition.sh/v1/graphql`

Use `@tanstack/react-query` for non-GraphQL async state (see [src/queryclient.ts](src/queryclient.ts)).

## Chrome Extension Patterns

### Inter-Component Communication
```typescript
// Open sidepanel from content script
chrome.runtime.sendMessage({ type: "open_sidepanel", route: "/profile" })

// Listen in background.ts for routing
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel-nav") { /* handle navigation */ }
})
```

### Storage
- `chrome.storage.local` - Navigation state, theme preferences
- `chrome.storage.sync` - MetaMask account address (`"metamask-account"`)

### Content Script Injection
Plasmo config pattern in [src/contents/plasmo-inline.tsx](src/contents/plasmo-inline.tsx):
```typescript
export const config: PlasmoCSConfig = { matches: ["https://*/*"] }
export const getInlineAnchor: PlasmoGetInlineAnchor = () => document.querySelector("body")
export const getShadowHostId = () => "plasmo-inline-example-unique-id"
export const getStyle: PlasmoGetStyle = () => { /* inject Tailwind CSS */ }
```

## Component Architecture

### Form Patterns
See [src/components/TripleForm.tsx](src/components/TripleForm.tsx) for canonical patterns:
- **Batch operations**: Accumulate triples before blockchain submission
- **Vote tracking**: Each triple has `"for" | "against" | null` vote state
- **Error handling**: Display user-friendly messages from viem errors
- **Progress indicators**: Show loading states during transaction processing

### Autocomplete Inputs
[src/components/AtomAutocompleteInput.tsx](src/components/AtomAutocompleteInput.tsx) demonstrates:
- Debounced GraphQL queries (300ms delay)
- Fuzzy search with `_ilike` operator
- Sorting by `position_count` (vault activity)
- Inline atom creation with modal forms

### 3D Assets
Three.js components in [src/components/3D/](src/components/3D/) use GLB models from `assets/` accessed via:
```typescript
chrome.runtime.getURL("assets/Eye-1K.glb")
```

## Styling & UI

- **Tailwind CSS** with custom HSL variables (see [tailwind.config.js](tailwind.config.js))
- **Dark mode only** - `defaultTheme="dark"` in ThemeProvider
- **Radix UI** primitives for dropdowns, hover cards, collapsibles
- Path alias: `~src/*` resolves to `./src/*` (tsconfig.json)

## Analytics & Tracking

Umami analytics via [src/lib/umami.ts](src/lib/umami.ts):
```typescript
umami("Event Name")  // Track user actions
```

Loaded from `assets/umami.js` as web-accessible resource.

## Common Pitfalls

1. **Don't mix ethers and viem** - This codebase uses viem exclusively
2. **Always validate Hex32 format** - Use `toBytes32()` utility before contract calls
3. **Check chain before transactions** - `getClients()` auto-switches but handle errors
4. **Plasmo auto-reloads** - File changes trigger HMR, but manifest changes need manual reload
5. **Shadow DOM styling** - Content scripts use `getStyle` export for CSS injection

## Testing & Debugging

- Use Chrome DevTools for extension debugging (popup/sidepanel/background)
- Content script console available in page context
- Check `chrome://extensions` for manifest errors
- Network tab shows GraphQL queries to testnet.intuition.sh

## Package Management

Uses **pnpm** exclusively - lock file is `pnpm-lock.yaml`, not npm/yarn.

## Protocol-Specific Concepts

**Triples**: `[Subject, Predicate, Object]` tuples where each component is an atom (Hex32 term_id)
**Atoms**: Entities with labels, can be deposited into vaults
**Vaults**: Bonding curve-based liquidity pools for atoms/triples
**Claims**: Triples with "for"/"against" positions representing attestations

See [@0xintuition/protocol](https://github.com/0xintuition/protocol) for deeper protocol documentation.
