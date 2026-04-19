/*
 * Shared JSON parsers for competitor-insight endpoints.
 * LLMs often return JSON wrapped in fences, with smart quotes, or with
 * trailing commas — these helpers normalize those shapes before parsing.
 */

export function sanitizeJson(text: string): string {
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

export function findArrayEnd(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "[") {
      depth += 1;
    } else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

export function parseJsonCandidate(text: string): any[] | null {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    const normalized = text
      .replace(/[\u201c\u201d\u2018\u2019\u300c\u300d\uff02]/g, '"')
      .replace(/\uff1a/g, ":")
      .replace(/\uff0c/g, ",")
      .replace(/,\s*([}\]])/g, "$1");

    try {
      const parsed = JSON.parse(normalized);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}

function findObjectEnd(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function parseObjectCandidate(text: string): Record<string, any> | null {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    const normalized = text
      .replace(/[\u201c\u201d\u2018\u2019\u300c\u300d\uff02]/g, '"')
      .replace(/\uff1a/g, ":")
      .replace(/\uff0c/g, ",")
      .replace(/,\s*([}\]])/g, "$1");
    try {
      const parsed = JSON.parse(normalized);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}

export function extractJsonObject(text: string): Record<string, any> {
  const s = sanitizeJson(text);

  for (let start = s.indexOf("{"); start !== -1; start = s.indexOf("{", start + 1)) {
    const end = findObjectEnd(s, start);
    if (end === -1) continue;
    const parsed = parseObjectCandidate(s.slice(start, end + 1));
    if (parsed) return parsed;
  }

  throw new Error(`No valid JSON object found. Raw: ${s.slice(0, 300)}`);
}

export function extractJsonArray(text: string): any[] {
  const s = sanitizeJson(text);

  for (let start = s.indexOf("["); start !== -1; start = s.indexOf("[", start + 1)) {
    const next = s.slice(start + 1).search(/\S/);
    if (next === -1 || s[start + 1 + next] !== "{") continue;

    const end = findArrayEnd(s, start);
    if (end === -1) continue;

    const parsed = parseJsonCandidate(s.slice(start, end + 1));
    if (parsed) return parsed;
  }

  throw new Error(`No valid JSON array found. Raw: ${s.slice(0, 300)}`);
}
