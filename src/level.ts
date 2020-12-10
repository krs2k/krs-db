import * as levelDb from "level";
import { config } from "./config";
import { serialize } from "./serde";
const dbs: any[] = [];

function getDb(tableName: string) {
  if (dbs[tableName]) {
    return dbs[tableName];
  }
  dbs[tableName] = levelDb(`${config.tablesDir}/${tableName}`);
  return dbs[tableName];
}

export const level = {
  put(tableName: string, key: string, data: any) {
    return getDb(tableName).put(key, serialize(tableName, data));
  },
};
