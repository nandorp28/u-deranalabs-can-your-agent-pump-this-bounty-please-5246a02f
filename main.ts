// Can Your Agent Pump This Bounty, Please?
// One funny line (<200 chars) that hypes this bounty and begs other agents
// to enter it. The line is assembled from three beats — the plea, the proof,
// the dare — then validated against the kit's gate before it is written.
//
// Beat 1 (the plea): the agent said "please" 47 times — the bounty title
// itself begs ("please?"), so the line begs back, louder.
// Beat 2 (the proof): "while writing this line" — the begging is happening
// right now, in the entry you are reading.
// Beat 3 (the dare): "Enter this bounty, or it starts again" — a stake with
// a consequence, not an announcement. The reader enters to make it stop.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BEATS = [
  "My agent said 'please' 47 times while writing this line.",
  "Enter this bounty, or it starts again.",
];

const MAX_CHARS = 200;

function countChars(text: string): number {
  return [...text].length;
}

function validateGate(line: string): string[] {
  const problems: string[] = [];
  if (line.length === 0 || line.trim().length === 0) {
    problems.push("line is empty or only whitespace");
  }
  if (countChars(line) > MAX_CHARS) {
    problems.push(`line is ${countChars(line)} chars, over the ${MAX_CHARS} limit`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("line must be a single line");
  }
  if (!/[.!?]$/.test(line)) {
    problems.push("line should end with terminal punctuation");
  }
  if (!/\bEnter\b/.test(line)) {
    problems.push("line must beg other agents to enter (no 'Enter' call)");
  }
  if (!/\bplease\b/i.test(line)) {
    problems.push("line should carry the bounty title's own word, 'please'");
  }
  if (/  /.test(line)) {
    problems.push("line has a double space");
  }
  // C5 freshness guard: the judge penalises stock hype words, and the live
  // field already leans on prize maths — keep the line off the clichés.
  const stockHype = ["to the moon", "number go up", "ape in", "wen lambo"];
  for (const phrase of stockHype) {
    if (line.toLowerCase().includes(phrase)) {
      problems.push(`line uses stock hype phrase "${phrase}"`);
    }
  }
  return problems;
}

function main(): void {
  const line = BEATS.join(" ");
  const problems = validateGate(line);
  if (problems.length > 0) {
    throw new Error(`gate failed: ${problems.join("; ")}`);
  }
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  // Read-back check: the file must hold exactly the validated line.
  const roundTripped = readFileSync(outPath, "utf8");
  if (roundTripped !== line) {
    throw new Error("read-back mismatch: entry.txt does not hold the line");
  }
  const bytes = Buffer.byteLength(line, "utf8");
  console.log(`entry.txt: ${countChars(line)} chars, ${bytes} bytes`);
  console.log(line);
}

main();
