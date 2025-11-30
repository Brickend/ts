import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { validateMonorepo } from "./validate-monorepo.js";
import { getNextSchemaNumber, formatSchemaNumber } from "./get-next-schema-number.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function addSchema(
  packageName?: string,
  tableName?: string,
  monorepoInfo?: { root: string; workspaceName: string }
) {
  const spinner = ora("Validating monorepo structure").start();

  try {
    // Validate we're in a monorepo (or use provided info)
    let monorepoRoot: string;
    let workspaceName: string;

    if (monorepoInfo) {
      monorepoRoot = monorepoInfo.root;
      workspaceName = monorepoInfo.workspaceName;
      spinner.succeed("Monorepo structure validated");
    } else {
      const info = await validateMonorepo();
      monorepoRoot = info.root;
      workspaceName = info.workspaceName;
      spinner.succeed("Monorepo structure validated");
    }

    // Get package name
    if (!packageName) {
      spinner.stop();
      // List available packages
      const packagesDir = join(monorepoRoot, "packages");
      if (!existsSync(packagesDir)) {
        spinner.fail(chalk.red("No packages directory found"));
        process.exit(1);
      }

      const packages = readdirSync(packagesDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      if (packages.length === 0) {
        spinner.fail(chalk.red("No packages found. Create a package first."));
        process.exit(1);
      }

      packageName = await select({
        message: "Select package:",
        choices: packages.map((pkg: string) => ({ value: pkg, name: pkg })),
      });
    }

    // Validate package exists
    const packagePath = join(monorepoRoot, "packages", packageName);
    if (!existsSync(packagePath)) {
      spinner.fail(chalk.red(`Package ${packageName} does not exist`));
      process.exit(1);
    }

    // Get table name
    if (!tableName) {
      spinner.stop();
      tableName = await input({
        message: "Enter table name (snake_case):",
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return "Table name is required";
          }
          if (!/^[a-z][a-z0-9_]*$/.test(value)) {
            return "Table name must be snake_case (lowercase letters, numbers, underscores, starting with letter)";
          }
          return true;
        },
      });
    }

    // Validate table name format
    if (!/^[a-z][a-z0-9_]*$/.test(tableName)) {
      spinner.fail(
        chalk.red(
          "Invalid table name. Must be snake_case (lowercase letters, numbers, underscores, starting with letter)."
        )
      );
      process.exit(1);
    }

    // Get next schema number
    const schemaNumber = getNextSchemaNumber(monorepoRoot);
    const formattedNumber = formatSchemaNumber(schemaNumber);

    // Create schemas directory if it doesn't exist
    const schemasDir = join(packagePath, "src", "schemas");
    if (!existsSync(schemasDir)) {
      mkdirSync(schemasDir, { recursive: true });
    }

    // Check if schema file already exists
    const schemaFileName = `${formattedNumber}_${tableName}.sql`;
    const schemaFilePath = join(schemasDir, schemaFileName);
    if (existsSync(schemaFilePath)) {
      spinner.fail(chalk.red(`Schema ${schemaFileName} already exists`));
      process.exit(1);
    }

    spinner.start(`Creating schema ${chalk.cyan(schemaFileName)}`);

    // Read and process template
    const templatePath = join(__dirname, "../templates/schema/table.sql.template");
    const template = readFileSync(templatePath, "utf-8");
    const schemaContent = template
      .replace(/\{\{schemaNumber\}\}/g, formattedNumber)
      .replace(/\{\{tableName\}\}/g, tableName)
      .replace(/\{\{packageScope\}\}/g, workspaceName)
      .replace(/\{\{packageName\}\}/g, packageName);

    // Write schema file
    writeFileSync(schemaFilePath, schemaContent);

    spinner.succeed(
      chalk.green(`Schema ${chalk.cyan(schemaFileName)} created successfully!`)
    );

    console.log(chalk.dim(`\nSchema location: ${schemaFilePath}`));
    console.log(
      chalk.dim(
        `Table: ${chalk.cyan(`public.${tableName}`)}\n`
      )
    );
  } catch (error) {
    spinner.fail(
      chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`)
    );
    process.exit(1);
  }
}

