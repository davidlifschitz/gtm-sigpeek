import { load } from "./load.js";

// Tiny hand-rolled PDFs: enough structure for SigPeek's regex checks.
export function pdf({ producer = "Word", text = ["Hello world"], sig = false, extraSave = false, created = "D:20260101", mod = "D:20260101" } = {}) {
  let s = "%PDF-1.7\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n";
  s += "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n3 0 obj << /Type /Page >> endobj\n";
  s += `4 0 obj << /Producer (${producer}) /CreationDate (${created}) /ModDate (${mod}) >> endobj\n`;
  s += `5 0 obj << >> stream\nBT ${text.map((t) => `(${t}) Tj`).join(" ")} ET\nendstream endobj\n`;
  if (sig) s += "6 0 obj << /Type /Sig /ByteRange [0 10 20 30] >> endobj\n";
  s += "startxref\n100\n%%EOF\n";
  if (extraSave) s += "7 0 obj << >> endobj\ntrailer << /Prev 100 >>\nstartxref\n200\n%%EOF\n";
  return s;
}

export function pick(w, which, name, body, type = "application/pdf") {
  const f = new w.File([body], name, { type });
  const input = w.document.getElementById("file" + which);
  Object.defineProperty(input, "files", { value: [f], configurable: true });
  input.dispatchEvent(new w.Event("change"));
}

export async function compare(a, b, names = ["a.pdf", "b.pdf"]) {
  const w = load();
  pick(w, "A", names[0], a);
  pick(w, "B", names[1], b);
  await w.document.getElementById("run").onclick();
  return w;
}
