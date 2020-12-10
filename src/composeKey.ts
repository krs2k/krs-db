import { getTableSchema } from "./cache";

export function composeKey(tableName: string, data: any) {
  let key = "";
  const tableSchema = getTableSchema(tableName);
  for (const primaryKey of tableSchema.primaryKeys) {
    key += data[primaryKey];
  }
  return key;
}
