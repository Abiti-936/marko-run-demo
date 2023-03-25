import { NotesRecord, xataWorker } from "./xata";
import urlSlug from "url-slug";
import { marked } from "marked";
import { z } from "zod";
import xss from "xss";

export async function getNotes(uid: string) {
  const query = xataWorker("getNotes", async ({ xata }, uid: string) => {
    return await xata.db.notes.filter("author.id", uid).getAll({
      cache: 86400 * 15,
    });
  });

  return await query(uid);
}

export async function getNote(slug: string, uid: string) {
  const query = xataWorker(
    "getNote",
    async ({ xata }, slug: string, uid: string) => {
      return await xata.db.notes
        .filter("author.id", uid)
        .filter("slug", slug)
        .getFirst({
          cache: 86400 * 15,
          columns: ["*", "author.*"],
        });
    }
  );

  return await query(slug, uid);
}

export function filterNotes(data: NotesRecord, author: string) {
  const schema = z.object({
    title: z.string().min(10),
    description: z.string().min(10),
    markdown: z.string(),
  });

  try {
    const created_at = new Date().toUTCString();
    const { title, description, markdown } = schema.parse(data);
    const slug = urlSlug(title);

    const html = marked(markdown);
    const body = xss(html, {
      stripIgnoreTagBody: true,
      stripBlankChar: true,
      stripIgnoreTag: true,
      escapeHtml: (html: string) =>
        html.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    });

    return {
      title,
      description,
      created_at,
      markdown,
      body,
      author,
      slug,
    };
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function createNote(data: NotesRecord) {
  const query = xataWorker(
    "createNote",
    async ({ xata }, data: NotesRecord) => {
      return await xata.db.notes.create(data);
    }
  );

  return await query(data);
}
