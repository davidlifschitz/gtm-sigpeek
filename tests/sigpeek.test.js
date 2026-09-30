import { describe, it, expect } from "vitest";
import { load } from "./load.js";
import { pdf, pick, compare } from "./helpers.js";

const flags = (w) => [...w.document.querySelectorAll("#flags h2")].map((h) => h.textContent);
const fact = (w, key) => [...w.document.querySelectorAll("#facts tr")].find((tr) => tr.cells[0].textContent === key);


describe("helpers", () => {
  const w = load();
  it("extracts literal strings", () => {
    expect(w.extractText("BT (Hello there) Tj (x) Tj (a \\(b\\) c) Tj ET")).toEqual(["Hello there", "a (b) c"]);
  });
  it("diffs removed and added lines", () => {
    expect(w.lineDiff(["one", "two"], ["one", "three"]).map((r) => r.k + r.t)).toEqual(["deltwo", "addthree"]);
  });
});

describe("compare", () => {
  it("rejects non-PDFs and oversize files", () => {
    const w = load();
    pick(w, "A", "notes.txt", "hi", "text/plain");
    expect(w.document.getElementById("warn").textContent).toBe("Need a .pdf");
    expect(w.document.getElementById("run").disabled).toBe(true);
  });
});

describe("compare", () => {
  it("says identical files are identical", async () => {
    const w = await compare(pdf(), pdf());
    expect(flags(w)).toContain("Same bytes");
  });
  it("flags a signed file that got an incremental save", async () => {
    const w = await compare(pdf({ sig: true }), pdf({ sig: true, extraSave: true, mod: "D:20260202", text: ["Hello world", "New clause"] }));
    expect(flags(w)).toEqual(expect.arrayContaining(["Signature object", "Extra EOF", "/Prev grew", "Same birth, new ModDate"]));
    expect(fact(w, "%%EOF").cells[2].textContent).toBe("2");
    expect(w.document.getElementById("diff").textContent).toContain("+ New clause");
  });
  it("keeps high bytes one-to-one", () => {
    const w = load();
    expect(w.latin(new Uint8Array([0x25, 0xe2, 0x80, 0x9c, 0xff]).buffer)).toBe("%\u00e2\u0080\u009c\u00ff");
  });
});
