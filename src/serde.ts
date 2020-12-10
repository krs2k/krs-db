import { Type } from "avsc";
import { getTableSchema } from "./cache";

const avroSchemas = new Map<string, Type>();

export function serialize(tableName: string, data: any): Buffer {
  return getAvro(tableName).toBuffer(data);
}

export function deserialize(tableName: string, buffer: any) {
  return getAvro(tableName).fromBuffer(buffer);
}

function getAvro(tableName: string): Type {
  if (!avroSchemas.has(tableName)) {
    const tableSchema = getTableSchema(tableName);
    avroSchemas.set(
      tableName,
      Type.forSchema({
        type: "record",
        fields: tableSchema.columns,
      })
    );
  }
  return avroSchemas.get(tableName);
}
