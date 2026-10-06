const MIGRATION_KEY='parsippany_employee_roster_2026_10_05_v1';

const ROSTER=[
  ['Employee','adian','', '09:00 -5:00','09:00 -5:00','09:00 -5:00','09:00 -5:00','09:00 -5:00'],
  ['Employee','Aveona','', '09:00 -5:00','09:00 -5:00','09:00 -5:00','09:00 -5:00','09:00 -5:00'],
  ['Employee','Beatriz','', '8:00-1:00','8:00-1:00','8:00-1:00','8:00-1:00','8:00-1:00'],
  ['Employee','Bunorche','', '9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Employee','Denzel','', '8:30-2:30','8:30-12:30','8:30-2:30','8:30-12:30','8:30-3:00'],
  ['Employee','Emily','M', '8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Employee','Esmeralda','', '9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Employee','Gabriel','', '8:30-1:30','12:00 - 5:00','8:30-1:30','12:00 - 5:00','8:30-5:00'],
  ['Employee','Hadia','', '','8:00-4:00','8:00-4:00','8:00-4:00','8:12:00'],
  ['Employee','Jasmine','', '8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00','8:30-5:00'],
  ['Employee','Jenna','', '8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30'],
  ['Employee','Jorel','', '9:30 to 4:00','9:30 to 4:00','9:30 to 4:00','9:30 to 4:00','9:30 to 4:00'],
  ['Employee','Kaitlyn','', '09:00 -5:00','','09:00 -5:00','',''],
  ['Employee','Kaushik','', '8:00-5:00','8:00-5:00','8:00-5:00','8:00-5:00','8:00-5:00'],
  ['Employee','Kimberly','', '8:00-12:30','8:00-5:00','8:00-12:30','8:00-5:00','8:00-3:00'],
  ['Employee','Krystian','', '9:00-5:00','','9:00-5:00','8:00-4:00','9:00-5:00'],
  ['Employee','Meghan','', '8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Employee','Niddhi','', '8:00-5:00','8:00-5:00','8:00-5:00','8:00-5:00','8:00-5:00'],
  ['Employee','Nolan','', '9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Employee','Sasha','', '8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
  ['Employee','Shamika','', '8:30-4:00','8:30-4:00','8:30-4:00','8:30-4:00','8:30-4:00'],
  ['Employee','Shilpa','', '09:00 -5:00','09:00 -5:00','09:00 -5:00','09:00 -5:00','09:00 -5:00'],
  ['Employee','Sophia','', '8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30','8:30-4:30'],
  ['Employee','Stacy','', '8:00-4:30','8:00-4:30','8:00-4:30','8:00-4:30','8:00-4:30'],
  ['Employee','Sudarshana','', '9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Employee','Tyrejanae','', '9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00','9:00-5:00'],
  ['Employee','Vaishali','', '8:00-4:30','8:00-4:30','8:00-4:30','8:00-4:30','8:00-4:30'],
  ['Employee','Shreya','', '8:00-5:00','8:00-5:00','8:00-5:00','8:00-5:00','8:00-5:00'],
  ['Employee','Kenyetta','(Part Time)', '4:15-6:30','4:15-6:30','4:15-6:30','4:15-6:30','--'],
  ['Intern','Lizzy','', '8:00-4:00','09:00 -5:00','8:00-4:00','8:00-4:00','09:00 -5:00'],
  ['Intern','Patty','', '09:00 -5:00','8:00-4:00','09:00 -5:00','09:00 -5:00','8:00-4:00'],
  ['Intern','Radhikaa','', '08:30- 5:00','08:30- 5:00','08:30- 5:00','08:30- 5:00','08:30- 5:00'],
  ['Intern','Dorcas','', '8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00','8:00-4:00'],
];

export async function applyParsippanyRosterMigration(sql){
  await sql`create table if not exists app_data_migrations(migration_key text primary key,applied_at timestamptz default now())`;
  const done=await sql`select 1 from app_data_migrations where migration_key=${MIGRATION_KEY} limit 1`;
  if(done.length)return;

  await sql.begin(async tx=>{
    await tx`select pg_advisory_xact_lock(734682903)`;
    const again=await tx`select 1 from app_data_migrations where migration_key=${MIGRATION_KEY} limit 1`;
    if(again.length)return;

    await tx`update weekly_schedules set schedule_kind='employee_archive_2026_10_05' where schedule_kind='employee'`;
    for(let i=0;i<ROSTER.length;i++){
      const [category,firstName,lastName,monday,tuesday,wednesday,thursday,friday]=ROSTER[i];
      await tx`
        insert into weekly_schedules(
          schedule_kind,category,first_name,last_name,assigned_to,
          monday,tuesday,wednesday,thursday,friday,notes,display_order
        ) values(
          'employee',${category},${firstName},${lastName},'',
          ${monday},${tuesday},${wednesday},${thursday},${friday},'',${i}
        )
      `;
    }
    await tx`insert into app_data_migrations(migration_key) values(${MIGRATION_KEY})`;
  });
}
