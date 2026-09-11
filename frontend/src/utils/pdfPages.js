// Best-effort client-side page count for instant feedback while the student
// is still on the upload screen. Counts "/Type /Page" object occurrences in
// the raw PDF bytes - works for the vast majority of non-encrypted PDFs
// without pulling in a full PDF parser. The backend (pdf-lib) recomputes the
// authoritative count on submit, so a miss here is only a UX nicety, not a
// correctness issue.
export async function estimatePdfPages(file) {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let text = '';
    for (let i = 0; i < bytes.length; i++) text += String.fromCharCode(bytes[i]);

    const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
    if (pageMatches && pageMatches.length > 0) return pageMatches.length;

    const countMatch = text.match(/\/Count\s+(\d+)/);
    if (countMatch) return Number(countMatch[1]);

    return null;
  } catch {
    return null;
  }
}
