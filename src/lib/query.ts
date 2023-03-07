import { xataWorker } from "./xata";

export async function getNotes() {
  const query = xataWorker("getNotes", async ({ xata }) => {
    return await xata.db.notes.getAll({
      cache: 86400 * 15,
    });
  });

  return await query();
}

export async function getNote(slug: string) {
  const query = xataWorker("getNote", async ({ xata }, slug: string) => {
    return await xata.db.notes.filter("slug", slug).getFirst({
      cache: 86400 * 15,
      columns: ["*", "author.*"],
    });
  });

  return await query(slug);
}
