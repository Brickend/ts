import { Command } from "commander";
import { addPackage } from "../lib/add-package.js";

export function addPackageCommand() {
  const command = new Command("package");

  command
    .description("Scaffold a new package in the monorepo")
    .argument("[name]", "Package name (without @workspace scope)")
    .action(async (name?: string) => {
      await addPackage(name);
    });

  return command;
}

