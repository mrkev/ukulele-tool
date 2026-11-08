/** DOM id of a root's chord section, e.g. "Db" -> "db-chords". */
export function sectionId(root: string) {
  return `${root.toLowerCase()}-chords`;
}
