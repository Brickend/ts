import { input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { existsSync } from "fs";
import { join } from "path";
import { validateMonorepo } from "./validate-monorepo.js";
import { generatePackageFiles } from "./generate-package.js";
import { addSchema } from "./add-schema.js";

export async function addPackage(packageName?: string) {
  const spinner = ora("Validating monorepo structure").start();

  try {
    // Validate we're in a monorepo
    const monorepoInfo = await validateMonorepo();
    spinner.succeed("Monorepo structure validated");

    // Get package name
    if (!packageName) {
      spinner.stop();
      packageName = await input({
        message: `Enter package name (without ${monorepoInfo.workspaceName} scope):`,
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return "Package name is required";
          }
          if (!/^[a-z0-9-]+$/.test(value)) {
            return "Package name must be lowercase alphanumeric with hyphens only";
          }
          return true;
        },
      });
    }

    // Validate package name format
    if (!/^[a-z0-9-]+$/.test(packageName)) {
      spinner.fail(
        chalk.red(
          "Invalid package name. Must be lowercase alphanumeric with hyphens only."
        )
      );
      process.exit(1);
    }

    const packagePath = join(monorepoInfo.root, "packages", packageName);
    const packageScope = monorepoInfo.workspaceName;

    // Check if package already exists
    if (existsSync(packagePath)) {
      spinner.fail(chalk.red(`Package ${packageName} already exists`));
      process.exit(1);
    }

    const createSpinner = ora(`Creating package ${chalk.cyan(packageName)}`).start();

    // Generate package files
    await generatePackageFiles(packagePath, packageName, packageScope);

    createSpinner.succeed(
      chalk.green(`Package ${chalk.cyan(packageName)} created successfully!`)
    );

    console.log(chalk.dim(`\nPackage location: ${packagePath}`));
    console.log(
      chalk.dim(
        `Import as: ${chalk.cyan(`${packageScope}/${packageName}`)}\n`
      )
    );

    // Ask if user wants to add an initial schema
    spinner.stop();
    const wantsSchema = await confirm({
      message: "Would you like to add an initial schema?",
      default: false,
    });

    if (wantsSchema) {
      await addSchema(packageName, undefined, {
        root: monorepoInfo.root,
        workspaceName: packageScope,
      });
    }
  } catch (error) {
    spinner.fail(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}

