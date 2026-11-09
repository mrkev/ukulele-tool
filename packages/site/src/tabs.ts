import { Library, LayoutGrid } from "lucide-react";

/** The page's two views. */
export type Tab = "all" | "sets";

export const TABS: { value: Tab; label: string; Icon: typeof LayoutGrid }[] = [
  { value: "all", label: "Ukulele Chords", Icon: LayoutGrid },
  { value: "sets", label: "Sets", Icon: Library },
];
