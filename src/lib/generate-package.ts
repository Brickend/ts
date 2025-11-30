import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FOLDERS = [
  "components",
  "pages",
  "hooks",
  "schemas",
  "functions",
  "endpoints",
];

export async function generatePackageFiles(
  packagePath: string,
  packageName: string,
  packageScope: string
) {
  // Create package directory
  mkdirSync(packagePath, { recursive: true });

  // Create src directory
  const srcPath = join(packagePath, "src");
  mkdirSync(srcPath, { recursive: true });

  // Generate package.json
  const packageJsonTemplate = readFileSync(
    join(__dirname, "../templates/package/package.json.template"),
    "utf-8"
  );
  const packageJson = packageJsonTemplate
    .replace(/\{\{packageScope\}\}/g, packageScope)
    .replace(/\{\{packageName\}\}/g, packageName);
  writeFileSync(join(packagePath, "package.json"), packageJson);

  // Generate tsconfig.json
  const tsconfigTemplate = readFileSync(
    join(__dirname, "../templates/package/tsconfig.json.template"),
    "utf-8"
  );
  const tsconfig = tsconfigTemplate
    .replace(/\{\{packageScope\}\}/g, packageScope)
    .replace(/\{\{packageName\}\}/g, packageName);
  writeFileSync(join(packagePath, "tsconfig.json"), tsconfig);

  // Generate eslint.config.js
  const eslintTemplate = readFileSync(
    join(__dirname, "../templates/package/eslint.config.js.template"),
    "utf-8"
  );
  writeFileSync(join(packagePath, "eslint.config.js"), eslintTemplate);

  // Create folder structure with index.ts files
  const indexTemplate = readFileSync(
    join(__dirname, "../templates/package/index.ts.template"),
    "utf-8"
  );

  for (const folder of FOLDERS) {
    const folderPath = join(srcPath, folder);
    mkdirSync(folderPath, { recursive: true });

    // Create index.ts barrel export file
    const indexContent = indexTemplate.replace(
      /\{\{folderName\}\}/g,
      folder
    );
    writeFileSync(join(folderPath, "index.ts"), indexContent);
  }
}

