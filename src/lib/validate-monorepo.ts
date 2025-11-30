import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import chalk from "chalk";

export interface MonorepoInfo {
  root: string;
  workspaceName: string;
}

export async function validateMonorepo(): Promise<MonorepoInfo> {
  let currentDir = process.cwd();
  const root = resolve("/");

  // Walk up the directory tree to find monorepo root
  while (currentDir !== root) {
    const packageJsonPath = join(currentDir, "package.json");
    const turboJsonPath = join(currentDir, "turbo.json");
    const packagesDir = join(currentDir, "packages");

    // Check for monorepo indicators
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          readFileSync(packageJsonPath, "utf-8")
        );

        // Check for workspaces field
        if (
          packageJson.workspaces &&
          Array.isArray(packageJson.workspaces) &&
          packageJson.workspaces.some((w: string) => w.includes("packages"))
        ) {
          // Verify packages directory exists
          if (existsSync(packagesDir)) {
            // Extract workspace name from package.json name
            const workspaceName = getWorkspaceName(packageJson.name);
            return {
              root: currentDir,
              workspaceName,
            };
          }
        }
      } catch (error) {
        // Continue searching if package.json is invalid
      }
    }

    // Also check for turbo.json as a strong indicator
    if (existsSync(turboJsonPath) && existsSync(packagesDir)) {
      // Try to read package.json to get workspace name
      if (existsSync(join(currentDir, "package.json"))) {
        try {
          const packageJson = JSON.parse(
            readFileSync(join(currentDir, "package.json"), "utf-8")
          );
          const workspaceName = getWorkspaceName(packageJson.name);
          return {
            root: currentDir,
            workspaceName,
          };
        } catch (error) {
          // Fallback to @workspace if we can't read it
          return {
            root: currentDir,
            workspaceName: "@workspace",
          };
        }
      }
      return {
        root: currentDir,
        workspaceName: "@workspace",
      };
    }

    // Move up one directory
    currentDir = resolve(currentDir, "..");
  }

  throw new Error(
    chalk.red(
      "Not in a monorepo. Please run this command from within a monorepo root directory.\n" +
        "A monorepo should have:\n" +
        "  - package.json with 'workspaces' field including 'packages/*'\n" +
        "  - packages/ directory"
    )
  );
}

function getWorkspaceName(packageName: string | undefined): string {
  if (!packageName) {
    return "@workspace";
  }

  // If it already starts with @, use it as-is
  if (packageName.startsWith("@")) {
    return packageName;
  }

  // Otherwise, prepend @ to make it a scope
  return `@${packageName}`;
}

