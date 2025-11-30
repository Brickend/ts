import { Command } from "commander";
import { addSchema } from "../lib/add-schema.js";

export function addSchemaCommand() {
  const command = new Command("schema");

  command
    .description("Create a new database schema in a package")
    .argument("[package]", "Package name")
    .argument("[table]", "Table name (snake_case)")
    .action(async (packageName?: string, tableName?: string) => {
      await addSchema(packageName, tableName);
    });

  return command;
}

