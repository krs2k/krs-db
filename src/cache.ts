import { TableSchema } from "./interfaces";

const tableSchemas = new Map<string, TableSchema>();
tableSchemas.set("krs_table", {
  name: "krs_table",
  primaryKeys: ["name"],
  columns: [{ name: "name", type: "string", isNullable: false }],
});
export function setTableSchema(name: string, tableSchema: TableSchema) {
  tableSchemas.set(name, tableSchema);
}

export function getTableSchema(name: string) {
  if (!tableSchemas.has(name)) throw new Error(`table ${name} not exist`);
  return tableSchemas.get(name);
}
