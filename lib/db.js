import postgres from 'postgres';
let sql;
function client(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL||process.env.STORAGE_POSTGRES_URL;if(!url)throw new Error('DATABASE_URL is not configured');return globalThis.__sosSql||(globalThis.__sosSql=postgres(url,{ssl:'require',max:5}));}
let ready;
export async function db(){sql=sql||client();if(!ready) ready=(async()=>{
 await sql`create table if not exists call_outs(id bigserial primary key,submitter_type text not null,name text not null,request_type text not null,event_date date not null,reason text,submitted_at timestamptz not null default now())`;
 await sql`create index if not exists call_outs_event_date_idx on call_outs(event_date)`;
 await sql`create table if not exists calendar_notes(id bigserial primary key,event_date date not null,title text not null,note_type text not null default 'Special note',details text,created_at timestamptz not null default now(),updated_at timestamptz not null default now())`;
 await sql`create index if not exists calendar_notes_event_date_idx on calendar_notes(event_date)`;
 })();await ready;return sql;}
