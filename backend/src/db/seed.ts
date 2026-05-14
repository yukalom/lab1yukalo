import { version } from "node:os";
import { get, run } from "./db.js";

type CountRow = {
  count: number | string;
};

const seedSoftware = [
    {
        name: "asd",
        version: 1,
        licenstype: "Free",
        date: "14.05.2026"
    }
];

const seedUser = [
    {
        name: "sjh",
        login: "shu",
        password:"qerrt12"
    }
];

const license = [
    {
        software_id: 1,
        license_key: "ddd"
    }
];

const request = [
    {
        software_id: 1,
        user_id: 1,
        request_date: "12.12.25" 
    }
];

export async function seedIfNeeded(): Promise<void> {
  let row = await get<CountRow>("SELECT COUNT(*) AS count FROM softwareProducts");
  let count = Number(row?.count ?? 0);

  if (count > 0) {
    console.log("Seed skipped: table softwareProducts is not empty");
    return;
  }
    
  row = await get<CountRow>("SELECT COUNT(*) AS count FROM user");
  count = Number(row?.count ?? 0);

  if (count > 0) {
    console.log("Seed skipped: table user is not empty");
    return;
  }

  row = await get<CountRow>("SELECT COUNT(*) AS count FROM license");
  count = Number(row?.count ?? 0);

  if (count > 0) {
    console.log("Seed skipped: table license is not empty");
    return;
  }

  row = await get<CountRow>("SELECT COUNT(*) AS count FROM request");
  count = Number(row?.count ?? 0);

  if (count > 0) {
    console.log("Seed skipped: table request is not empty");
    return;
  }


  for (const item of seedSoftware) {

    const sql = `
      INSERT INTO softwareProducts (name, version, licensetype, date)
      VALUES ('${item.name}', ${item.version}, '${item.licenstype}', '${item.date}')
    `;

    await run(sql);
  }

    for (const item of seedUser) {

    const sql = `
      INSERT INTO user (name, login, password)
      VALUES ('${item.name}', '${item.login}', '${item.password}')
    `;

    await run(sql);
  }

    for (const item of license) {

    const sql = `
      INSERT INTO license (software_id, license_key)
      VALUES (${item.software_id}, '${item.license_key}')
    `;

    await run(sql);
  }

      for (const item of request) {

    const sql = `
      INSERT INTO request (software_id, user_id, request_date)
      VALUES (${item.software_id}, ${item.user_id}, '${item.request_date}')
    `;

    await run(sql);
  }


  console.log(`Seed completed: inserted ${seedSoftware.length} items`);

  
}
