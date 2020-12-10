import { InsertStatement } from "pgsql-ast-parser";
import { level } from "../level";

export async function insert(ast: InsertStatement) {
  const schemaName = ast.into.name;
  for (const values of ast.values) {
    const entity: any = {};
    let index = 0;
    for (const value of values) {
      // @ts-ignore
      entity[ast.columns[index]] = value.value;
      index++;
    }
    // await level.put(schemaName, entity);
  }
}
