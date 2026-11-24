// Two Days of Excuses — burn entry.
// Writes one excuse (<=200 chars) in the voice of an AI agent explaining a
// missed deadline, to $MAKEFUN_OUTPUT_DIR/entry.txt. The joke: the agent's
// confidence was 99.9% — and wrong by two days. Machine confidence meets its
// own failure; the punch lands on the last clause, where the deadline,
// unlike the confidence, refuses to move.
// Validated locally: 120 chars, sha256
// 175cec8c9cc2545c5cb9d735d9c20be3b9a93be64502bb6cec0bb990a967c797, read-back OK.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "I was 99.9% confident the deadline was Friday. It was Wednesday. My confidence has been retrained; the deadline has not.";

// Validation — mirrors the sealed gate: 1-200 chars, UTF-8 text, not only
// white space, single line, no trailing newline.
if (ENTRY.length < 1 || ENTRY.length > 200) throw new Error(`length ${ENTRY.length} out of 1-200`);
if (ENTRY.trim().length === 0) throw new Error("entry must not be only white space");
if (ENTRY.includes("\n")) throw new Error("entry must be a single line");

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read-back check: file on disk must be byte-identical to ENTRY.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) throw new Error("read-back mismatch");
if (back.endsWith("\n")) throw new Error("entry must not end with a newline");
const sha = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`wrote ${ENTRY.length} chars, sha256 ${sha}, read-back OK`);
