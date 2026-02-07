/**
 * SILENCE SENTINEL — Diff Analyzer
 *
 * Parses git diff output to extract added lines, changed files,
 * and structured diff information for guard consumption.
 */

import { execSync } from "node:child_process";

export interface DiffLine {
  file: string;
  lineNumber: number;
  content: string;
}

export interface ChangedFile {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
}

/**
 * Get added lines from the git diff.
 * Tries staged diff first (--cached), falls back to HEAD~1 comparison.
 */
export function getAddedLines(): DiffLine[] {
  let diffOutput = "";

  try {
    // Try staged changes first (pre-commit hook scenario)
    diffOutput = execSync("git diff --cached --diff-filter=AM -U0", {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    // Ignore — no staged changes
  }

  if (!diffOutput.trim()) {
    try {
      // Fall back to comparing against HEAD~1 (CI scenario)
      diffOutput = execSync("git diff HEAD~1 --diff-filter=AM -U0", {
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
      });
    } catch {
      // Ignore — possibly initial commit or shallow clone
    }
  }

  if (!diffOutput.trim()) {
    return [];
  }

  return parseDiffOutput(diffOutput);
}

/**
 * Get the list of changed files from the diff.
 */
export function getChangedFiles(): ChangedFile[] {
  let nameStatusOutput = "";

  try {
    nameStatusOutput = execSync("git diff --cached --name-status", {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    // Ignore
  }

  if (!nameStatusOutput.trim()) {
    try {
      nameStatusOutput = execSync("git diff HEAD~1 --name-status", {
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
      });
    } catch {
      // Ignore
    }
  }

  if (!nameStatusOutput.trim()) {
    return [];
  }

  return parseNameStatus(nameStatusOutput);
}

/**
 * Get raw diff output for a specific path pattern.
 */
export function getDiffForPath(pathPattern: string): string {
  try {
    const staged = execSync(`git diff --cached -- "${pathPattern}"`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
    if (staged.trim()) return staged;
  } catch {
    // Ignore
  }

  try {
    return execSync(`git diff HEAD~1 -- "${pathPattern}"`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return "";
  }
}

/**
 * Check if a specific file has changed in the diff.
 */
export function hasFileChanged(filePath: string): boolean {
  const changed = getChangedFiles();
  return changed.some((f) => f.path === filePath || f.path.startsWith(filePath));
}

/**
 * Parse unified diff output to extract added lines with file + line number.
 */
function parseDiffOutput(diffOutput: string): DiffLine[] {
  const lines = diffOutput.split("\n");
  const result: DiffLine[] = [];
  let currentFile = "";
  let currentLineNumber = 0;

  for (const line of lines) {
    // Match file header: +++ b/path/to/file
    const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }

    // Match hunk header: @@ -old,count +new,count @@
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      currentLineNumber = parseInt(hunkMatch[1], 10);
      continue;
    }

    // Added line (starts with +, not +++)
    if (line.startsWith("+") && !line.startsWith("+++")) {
      if (currentFile) {
        result.push({
          file: currentFile,
          lineNumber: currentLineNumber,
          content: line.slice(1), // Remove the leading +
        });
      }
      currentLineNumber++;
      continue;
    }

    // Context line (no prefix) — these don't appear with -U0 but handle gracefully
    if (!line.startsWith("-") && !line.startsWith("\\") && line.length > 0) {
      currentLineNumber++;
    }
  }

  return result;
}

/**
 * Parse `git diff --name-status` output.
 */
function parseNameStatus(output: string): ChangedFile[] {
  const results: ChangedFile[] = [];
  const lines = output.trim().split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = line.split("\t");
    if (parts.length < 2) continue;

    const statusCode = parts[0].charAt(0);
    const path = parts[parts.length - 1]; // For renames, take the new path

    let status: ChangedFile["status"];
    switch (statusCode) {
      case "A":
        status = "added";
        break;
      case "M":
        status = "modified";
        break;
      case "D":
        status = "deleted";
        break;
      case "R":
        status = "renamed";
        break;
      default:
        status = "modified";
    }

    results.push({ path, status });
  }

  return results;
}
