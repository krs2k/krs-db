import { parse } from "pgsql-ast-parser";
import * as level from "level";
import * as fs from "fs";
import { operationDefinitions } from "./operations";

const TABLE_SCHEMA_DIR = "./data/table-schema";
const TABLE_DIR = "./data/table";
const tablesSchemas: Record<string, any> = {};
let dbs: Record<string, any> = {};

export async function execute(sql: string) {
  const results: any[] = [];
  for (const ast of parse(sql)) {
    const operationDefinition = operationDefinitions.get(ast.type);
    if (!operationDefinition) {
      throw new Error(`Undefined operation: ${ast.type}`);
    }
    results.push(await operationDefinition(ast));
  }
  return results;
}

export async function init() {
  await execute(`
    create table if not exists krs_table (
       name string primary key
    );
  `);
}

function select(ast: any) {
  const schemaName = ast.from[0].name;
  const schema = getTableSchema(schemaName);
  const entities: any[] = [];
  return new Promise((resolve, reject) => {
    getDb(schemaName)
      .createValueStream()
      .on("data", function (data) {
        const entity = schema.avro.fromBuffer(Buffer.from(data));
        if (ast.where && checkCondition(entity, ast.where)) {
          entities.push(entity);
        }
      })
      .on("end", () => {
        resolve(entities);
      });
  });
}

function checkCondition(entity: any, condition: any) {
  switch (condition.op) {
    case "=":
      return entity[condition.left.name] === condition.right.value;
  }
}
async function insert(ast: any) {
  const schemaName = ast.into.name;
  for (const values of ast.values) {
    const entity: any = {};
    let index = 0;
    for (const value of values) {
      entity[ast.columns[index]] = value.value;
      index++;
    }
    await put(schemaName, entity);
  }
}

function getTableSchema(name: string) {
  const schema = tablesSchemas[name];
  if (!schema) throw new Error(`table ${name} not exist`);
  return schema;
}

function registerSchema(schema: any) {
  // tablesSchemas[schema.schema.name] = {
  //   schema: schema,
  //   avro: avro.parse(schema.schema),
  // };
  // fs.writeFileSync(
  //   `${TABLE_SCHEMA_DIR}/${schema.name}.json`,
  //   JSON.stringify(schema, null, 2)
  // );
}

// function loadTableSchema(name: string) {
//   const schema = JSON.parse(
//     fs.readFileSync(TABLE_SCHEMA_DIR + `/${name}`, "ascii")
//   );
//   tablesSchemas[schema.schema.name] = {
//     schema: schema,
//     avro: avro.parse(schema.schema),
//   };
// }

function getDb(tableName: string) {
  if (dbs[tableName]) {
    return dbs[tableName];
  }
  dbs[tableName] = level(`${TABLE_DIR}/${tableName}`);
  return dbs[tableName];
}

async function put(tableName, data) {
  const schema = getTableSchema(tableName);
  const key = createKey(schema, data);
  const db = getDb(tableName);
  let exist;
  try {
    exist = await db.get(key);
  } catch (e) {}
  if (exist) throw new Error(`entity ${tableName} ${key} already exist`);
  return getDb(tableName).put(key, schema.avro.toBuffer(data));
}

function createKey(schema, data) {
  let key = "";
  for (const primaryKey of schema.schema.primaryKeys) {
    key += data[primaryKey];
  }
  return key;
}
