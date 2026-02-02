import {randomUUID} from "node:crypto";
import {db} from "../db.ts";
import {registry} from "../registry.ts";
import {rootScope} from "../scopes.ts";
import {typeDefs} from "../typeDefs.ts";
import {getContext} from "./root.ts";
import {devExtension} from "../extensions.ts";
import {join} from "node:path";
import {appDir} from "../../config.ts";
import {readFile} from "node:fs/promises";


type PotentialAction = {
  '@id': string;
  '@type': string;
};

type Todo = {
  '@context'?: string;
  '@id': string;
  '@type': string;
  uuid: string;
  createTime: string;
  updateTime: string;
  title: string;
  description?: string;
  potentialAction?: PotentialAction[];
};

const listTodosStatement = db.prepare<{
  url: string;
  limit: number;
  offset: number;
}, Todo>(`
  select
      :url || '/' || t.uuid                 "@id"
    , 'Todo'                                "@type"
    , :url || '/' || uuid                   "url"
    , t.uuid                                "uuid"
    , datetime(t.create_time, 'unixepoch')  "createTime"
    , datetime(t.update_time, 'unixepoch')  "updateTime"
    , t.title                               "title"
    , t.description                         "description"
  from todos t
  limit :limit
  offset :offset
`);

export const todoListing = registry.http.get('/todos{?page,pageSize}')
  .public()
  .define({
    typeDef: typeDefs.ListTodosAction,
    spec: {
      page: {
        typeDef: typeDefs.page,
        dataType: 'number',
        minValue: 1,
        defaultValue: 1,
        valueRequired: false,
        valueName: 'page',
        internalTerm: 'offset',
        transformer: (page: number | undefined) => (page ?? 1) - 1,
      },
      pageSize: {
        typeDef: typeDefs.pageSize,
        dataType: 'number',
        minValue: 1,
        defaultValue: 10,
        valueRequired: false,
        valueName: 'pageSize',
        internalTerm: 'limit',
        transformer: (pageSize: number | undefined) => pageSize ?? 10,
      },
    },
  })
  .handle(devExtension.handlePage('todo-listing'))
  .handle('text/longform', async (ctx) => {
    ctx.body =  await readFile(join(appDir, 'pages/todo-listing.lf'));
  })
  .handle('application/ld+json', async ctx => {
    const members = listTodosStatement
      .all({
        url: ctx.url,
        limit: ctx.payload.limit ?? 10,
        offset: ctx.payload.offset ?? 0,
      });

    ctx.body = JSON.stringify({
      '@context': getContext.url(),
      '@id': ctx.url,
      members,
    });
  });

 const getTodoStatement = db.prepare<{
   ctx: string;
   url: string;
   todoUUID: string;
 }, Todo>(`
   select
       :ctx                                  "@context"
     , :url || '/' || t.uuid                 "@id"
     , 'Todo'                                "@type"
     , :url || '/' || uuid                   "url"
     , t.uuid                                "uuid"
     , datetime(t.create_time, 'unixepoch')  "createTime"
     , datetime(t.update_time, 'unixepoch')  "updateTime"
     , t.title                               "title"
     , t.description                         "description"
   from todos t
   where t.uuid = :todoUUID
 `);

registry.http.get('/todos/{todoUUID}{?action}')
  .public()
  .define({
    typeDef: typeDefs.GetTodosAction,
    spec: {
      todoUUID: {
        dataType: 'string',
        valueRequired: true,
        valueName: 'todoUUID',
      },
      action: {
        dataType: 'string',
        options: ['created', 'updated'],
        valueRequired: false,
        valueName: 'action',
      },
    },
  })
  .handle(devExtension.handlePage('todo-detail'))
  .handle('application/ld+json', async (ctx) => {
    const todo = getTodoStatement.get({
      url: getContext.url(),
      ctx: ctx.url,
      todoUUID: ctx.payload.todoUUID,
    });
  
    ctx.body = JSON.stringify(todo);
  });


const insertTodoStatement = db.prepare<{
  url: string;
  uuid: string;
  title: string;
  description?: string;
}, Todo>(`
  insert into todos (
      uuid
    , title
    , description
  ) values (
      :uuid
    , :title
    , :description
  )
  returning
      :url || '/' || uuid                   "@id"
    , 'Todo'                                "@type"
    , :url || '/' || uuid                   "url"
    , uuid                                  "uuid"
    , datetime(create_time, 'unixepoch')    "createTime"
    , datetime(update_time, 'unixepoch')    "updateTime"
    , title                                 "title"
    , description                           "description"
`);

rootScope.http.post('/todos', { name: 'create-todo' })
  .public()
  .define({
    typeDef: typeDefs.CreateTodosAction,
    spec: {
      title: {
        typeDef: typeDefs.title,
        dataType: 'string',
        valueRequired: true,
        valueMinLength: 3,
      },
      description: {
        typeDef: typeDefs.description,
        dataType: 'string',
        valueRequired: false,
      },
    },
  })
  .handle('text/html', async ctx => {
    const todo = insertTodoStatement.get({
      uuid: randomUUID(),
      url: ctx.url,
      title: ctx.payload.title,
      description: ctx.payload.description,
    });

    if (todo == null)
      throw new Error('Could not create todo');

    ctx.status = 302;
    ctx.headers.set('Location', `${ctx.url}/${todo.uuid}?action=created`);
  })
  .handle(['application/ld+json', 'application/json'], ctx => {
    const todo = insertTodoStatement.get({
      uuid: randomUUID(),
      url: ctx.url,
      title: ctx.payload.title,
      description: ctx.payload.description,
    });

    ctx.status = 201;
    ctx.body = JSON.stringify({
      '@context': getContext.url(),
      message: 'todo-created',
      status: 'success',
      result: todo,
    });
  });


const updateTodoStatement = db.prepare<{
  url: string;
  todoUUID: string;
  title: string;
  description?: string;
}, Todo>(`
  update todos set
      title = :title
    , description = :description
  where uuid = :todoUUID
  returning 
      :url || '/' || uuid                   "@id"
    , 'Todo'                                "@type"
    , :url || '/' || uuid                   "url"
    , uuid                                  "uuid"
    , datetime(create_time, 'unixepoch')    "createTime"
    , datetime(update_time, 'unixepoch')    "updateTime"
    , title                                 "title"
    , description                           "description"
`);
rootScope.http.post('/todos/:todoUUID')
  .public()
  .define({
    typeDef: typeDefs.UpdateTodosAction,
    spec: {
      todoUUID: {
        typeDef: typeDefs.todoUUID,
        dataType: 'string',
        valueRequired: true,
        valueMinLength: 36,
        valueMaxLength: 36,
      },
      title: {
        typeDef: typeDefs.title,
        dataType: 'string',
        valueRequired: true,
        valueMinLength: 3,
      },
      description: {
        typeDef: typeDefs.description,
        dataType: 'string',
        valueRequired: false,
      },
    },
  })
  .handle('text/html', async ctx => {
    const todo = updateTodoStatement
      .pluck()
      .get({
        url: ctx.url,
        ...ctx.payload,
      });

    if (todo == null)
      throw new Error('Could not update todo');

    ctx.status = 302;
    ctx.headers.set('Location', todo['@id'] + '?action=updated');
  })
  .handle('application/ld+json', () => {

  });

