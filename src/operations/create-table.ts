import { CreateTableStatement } from "pgsql-ast-parser/src/syntax/ast";
import { TableSchema } from "../interfaces";
import { level } from "../level";
import { composeKey } from "../composeKey";

export async function createTable(ast: CreateTableStatement) {
  const primaryKeys: string[] = [];
  const tableSchema: TableSchema = {
    name: ast.name,
    primaryKeys,
    columns: ast.columns.map((column) => {
      let isNullable = true;
      for (const constraint of column.constraints) {
        switch (constraint.type) {
          case "not null":
            isNullable = false;
            break;
          case "null":
            isNullable = true;
            break;
          case "primary key":
            primaryKeys.push(column.name);
            break;
        }
      }
      return {
        name: column.name,
        type: column.dataType.type,
        isNullable,
      };
    }),
  };

  const tableItem = { name: tableSchema.name };
  await level.put(
    "krs_table",
    composeKey(tableSchema.name, tableItem),
    tableItem
  );
  console.log(tableSchema);

  // registerSchema(tableSchema);
}
