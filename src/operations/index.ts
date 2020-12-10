import { createTable } from "./create-table";
import { OperationDefinition } from "../interfaces";
import { insert } from "./insert";

export const operationDefinitions = new Map<string, OperationDefinition>();

operationDefinitions.set("create table", createTable);
operationDefinitions.set("insert", insert);
