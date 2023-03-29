import { filterNotes, createNote } from "../../../lib/query";

export const POST: MarkoRun.Handler = async ({ request, url }) => {
  const form = await request.formData();

  const data = filterNotes(
    Object.fromEntries(form.entries()) as any,
    "57c4c847-8fc9-4777-a72a-666835aac5e8"
  );

  const result = await createNote(data as any);

  if (result?.title) {
    return Response.redirect(url.origin, 302);
  }

  return Response.redirect(url.href, 302);
};
