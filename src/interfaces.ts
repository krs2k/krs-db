import { Statement } from "pgsql-ast-parser";

export interface TableSchemaColumn {
  name: string;
  type: string;
  isNullable: boolean;
}
export interface TableSchema {
  name: string;
  primaryKeys: string[];
  columns: TableSchemaColumn[];
}

export type OperationDefinition = (ast: Statement) => Promise<any>;
