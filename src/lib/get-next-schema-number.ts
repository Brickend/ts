import { readdirSync, existsSync } from "fs";
import { join } from "path";

/**
 * Scans all packages/schemas directories to find the highest schema number
 * and returns the next available number (padded to 3 digits)
 */
export function getNextSchemaNumber(monorepoRoot: string): number {
  const packagesDir = join(monorepoRoot, "packages");
  
  if (!existsSync(packagesDir)) {
    return 1;
  }

  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const schemaNumbers: number[] = [];

  for (const packageName of packages) {
    const schemasDir = join(packagesDir, packageName, "src", "schemas");
    
    if (!existsSync(schemasDir)) {
      continue;
    }

    const schemaFiles = readdirSync(schemasDir)
      .filter((file) => file.endsWith(".sql"))
      .map((file) => {
        // Extract number from filename like "001_name.sql" or "123_table.sql"
        const match = file.match(/^(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num): num is number => num !== null);

    schemaNumbers.push(...schemaFiles);
  }

  if (schemaNumbers.length === 0) {
    return 1;
  }

  const maxNumber = Math.max(...schemaNumbers);
  return maxNumber + 1;
}

/**
 * Formats a number as a 3-digit zero-padded string (e.g., 1 -> "001", 42 -> "042")
 */
export function formatSchemaNumber(num: number): string {
  return num.toString().padStart(3, "0");
}

