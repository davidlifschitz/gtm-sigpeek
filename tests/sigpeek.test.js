import { describe, it, expect } from "vitest";
import { load } from "./load.js";
import { pick } from "./helpers.js";


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
