#!/usr/bin/env bun

import { Command } from "commander";
import { addPackageCommand } from "./commands/add-package.js";
import { addSchemaCommand } from "./commands/add-schema.js";

const program = new Command();

program
  .name("brickend")
  .description("CLI tool for scaffolding Brickend packages in monorepos")
  .version("0.1.0");

program
  .command("add")
  .description("Add a new package or schema to the monorepo")
  .addCommand(addPackageCommand())
  .addCommand(addSchemaCommand());

program.parse();

