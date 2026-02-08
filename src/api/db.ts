import Database from 'better-sqlite3';
import {randomUUID} from 'node:crypto';


export const db = new Database('dev.db');

db.pragma("journal_mode = WAL");


const statements = [
  db.prepare(`
    create table if not exists users (
        id integer primary key autoincrement
      , uuid text not null
      , create_time int not null default (unixepoch())
      , update_time int
    )
  `),
  db.prepare(`
    create table if not exists todos (
        id integer primary key autoincrement
      , uuid text not null
      , create_time int not null default (unixepoch())
      , update_time int
      , complete_time int
      , title text not null
      , description text
      , status text not null default 'planned'
    )
  `),
];

  for (let i = 0, length = statements.length; i < length; i++) {
    statements[i].run();
  }
//db.prepare(`
//  insert into todos (
//      uuid
//    , title
//    , description
//  ) values (
//      ?
//    , 'My Todo'
//    , 'Getting a bunch of things done'
//  )
//`).run(randomUUID());
