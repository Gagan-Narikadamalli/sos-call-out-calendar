const MIGRATION_KEY='parsippany_client_roster_2026_10_05_v1';

const CLIENTS=[
  ['Karter','Harris','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Sultan','Abdulrazak','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Amaira','Oza','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Eva','Zayas','8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00'],
  ['Max','Zayas','8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00'],
  ['Thiago','Enamorado','8:30-4:00','8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00'],
  ['Lucas','Generale','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Evie','Napoli','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30'],
  ['Mathew','Vargos','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Meilin','Tyinsle','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Kian','Sellers','9:30-4:30','9:30-4:30','9:30-4:30','9:30-4:30','9:30-4:30'],
  ['Jude','Jamhour','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Erik','Zambrano','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Noah','Boria','9:00-5:00','--','9:00-5:00','--','9:00-5:00'],
  ['Matthew','Garcia','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Elijah','Garcia','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Lorenzo','Galuchie','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30'],
  ['Nicholas','Pariaros','8:15-4:15','8:15-4:15','8:15-4:15','8:15-4:15','8:15-4:15'],
  ['Yasin','Bashjawish','9:00 - 5:00','9:00 - 5:00','9:00 - 5:00','9:00 - 5:00','9:00 - 5:00'],
  ['William','Luo','9:00 - 5:00','11:00 - 5:00','9:00 - 5:00','9:00 - 5:00','11:00 - 5:00'],
  ['Harlee','Baltimore','8:00 -4:30','8:00 -4:30','8:00 -4:30','8:00 -4:30','8:00 -4:30'],
  ['Solimon','Solimon','','--','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Akshar','Rele','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30'],
  ['Jayden','Vasquez','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','---'],
  ['Nia','Kumar','2:00-5:00','2:00-5:00','2:00-5:00','2:00-5:00','2:00-4:30'],
  ['Olivier','Lecona','3:00-5:00','3:00-5:00','3:00-5:00','','3:00-5:00'],
  ['Neel','Arora','4:30-6:30','4:30-6:30','4:30-6:30','4:30-6:30','--'],
  ['Zion','Cherian','3:30-5:5:30','--','3:30-5:5:30','3:30-5:5:30','--'],
];

export async function applyParsippanyClientRosterMigration(sql){
  await sql`create table if not exists app_data_migrations(migration_key text primary key,applied_at timestamptz default now())`;
  const done=await sql`select 1 from app_data_migrations where migration_key=${MIGRATION_KEY} limit 1`;
  if(done.length)return;

  await sql.begin(async tx=>{
    await tx`select pg_advisory_xact_lock(734682904)`;
    const again=await tx`select 1 from app_data_migrations where migration_key=${MIGRATION_KEY} limit 1`;
    if(again.length)return;

    await tx`update weekly_schedules set schedule_kind='client_archive_2026_10_05' where schedule_kind='client'`;
    for(let i=0;i<CLIENTS.length;i++){
      const [firstName,lastName,monday,tuesday,wednesday,thursday,friday]=CLIENTS[i];
      await tx`
        insert into weekly_schedules(
          schedule_kind,category,first_name,last_name,assigned_to,
          monday,tuesday,wednesday,thursday,friday,notes,display_order
        ) values(
          'client','Client/Kid',${firstName},${lastName},'',
          ${monday},${tuesday},${wednesday},${thursday},${friday},'',${i}
        )
      `;
    }
    await tx`insert into app_data_migrations(migration_key) values(${MIGRATION_KEY})`;
  });
}
