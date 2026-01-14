// Types partagés pour les Atoms dans l'application

export type Hex32 = `0x${string}`;

export interface Atom {
  id?: string;
  label?: string | null;
  term_id?: string; // Peut être Hex32 mais GraphQL retourne string
  emoji?: string | null;
  image?: string | null;
  term?: {
    vaults?: {
      position_count: number;
    }[];
  };
}
