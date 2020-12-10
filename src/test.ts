import { execute, init } from "./index";

async function main() {
  await init();

  await execute(`
        CREATE TABLE product(
           id string PRIMARY KEY      NOT NULL,
           name           string NOT NULL,
           price         int     NOT NULL
        );
    `);
  // await execute(`INSERT INTO product (id, name, price) VALUES('3','Test', 132);`);

  // setInterval(async () => {
  //     const inset = Date.now();
  //     await execute(`INSERT INTO product (id, name, price) VALUES('${Date.now()}','Test', 132);`);
  //
  //     const select = Date.now();
  //     // await execute(`select * from product p join product p2 on p.id = p2.id where id = '3'`);
  //     console.log({
  //         insert: Date.now() - inset,
  //         select: Date.now() - select
  //     })
  // }, 1)
}

main().then(() => console.log("done"));
