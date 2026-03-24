import {randomUUID} from "node:crypto";
import {db} from "../db.ts";
import {registry} from "../registry.ts";
import {rootScope} from "../scopes.ts";
import {typeDefs} from "../typeDefs.ts";
import {getContext} from "./root.ts";
import {dev} from "../extensions.ts";
import {join} from "node:path";
import {appDir, rootURL} from "../../config.ts";
import {readFile} from "node:fs/promises";
import {BadRequestError, InternalServerError, joinPaths, NotFoundError} from "@occultist/occultist";
import type {JSONValue, JSONObject} from "@occultist/mini-jsonld";


type PotentialAction = {
  '@id': string;
  '@type': string;
};

type TodoStatus =
  | 'planned'
  | 'in-progress'
  | 'complete'
;

type Todo = {
  '@context'?: string;
  '@id': string;
  '@type': string;
  uuid: string;
  createTime: string;
  updateTime: string;
  status: TodoStatus;
  title: string;
  description?: string;
  actions?: JSONObject;
};

function todoMapper(todo: Partial<Todo>): Todo {
  console.log('MAPPER', todo);
  todo.actions = {
    [updateTodoAction.type]: updateTodoAction.jsonldPartial(),
    [setTodoStatusAction.type]: setTodoStatusAction.jsonldPartial(),
  }

  return todo as Todo;
}

const todoStatuses = new Set<TodoStatus>(['planned', 'in-progress', 'complete']);

function isTodoStatus(value: JSONValue): value is TodoStatus {
  return todoStatuses.has(value as string);
}

const listTodosStatement = db.prepare(`
  select
      :url || '/' || t.uuid                     "@id"
    , 'Todo'                                    "@type"
    , t.uuid                                    "uuid"
    , datetime(t.create_time, 'unixepoch')      "createTime"
    , datetime(t.update_time, 'unixepoch')      "updateTime"
    , datetime(t.complete_time, 'unixepoch')    "completeTime"
    , t.status                                  "todoStatus"
    , t.title                                   "title"
    , t.description                             "description"
  from todos t
  where (
    -- I'm being lazy. Handling conditionals like this is
    -- probably not a great thing to copy.
       :search is null
    or :search = ''
    or instr(t.title, :search)
    or instr(t.description, :search)
  ) and (
      :todoStatus is null
    or t.status = :todoStatus
  )
  order by
      case
        when t.status = 'in-progress' THEN 0
        when t.status = 'planned' THEN 1
        else 2
      end
    , t.complete_time desc
    , t.update_time desc
  limit :limit
  offset :offset
`);

export const todoListing = rootScope.http.get('/todos{?todoStatus,search,page,pageSize}', {
  name: 'list-todos',
})
  .public()
  .define({
    typeDef: typeDefs.ListTodosAction,
    spec: {
      todoStatus: {
        typeDef: typeDefs.todoStatus,
        dataType: 'string',
        valueName: 'todoStatus',
        valueRequired: false,
        validator: isTodoStatus,
      },
      search: {
        typeDef: typeDefs.search,
        dataType: 'string',
        valueName: 'search',
      },
      page: {
        typeDef: typeDefs.page,
        dataType: 'number',
        minValue: 1,
        defaultValue: 1,
        valueRequired: false,
        valueName: 'page',
        internalTerm: 'offset',
        transformer: (page: number) => (page - 1) * 10,
      },
      pageSize: {
        typeDef: typeDefs.pageSize,
        dataType: 'number',
        minValue: 1,
        defaultValue: 10,
        valueRequired: false,
        valueName: 'pageSize',
        internalTerm: 'limit',
        transformer: (pageSize: number) => pageSize,
      },
    },
  })
  .handle(dev.html('todo-listing'))
  .handle('text/longform', async (ctx) => {
    ctx.body =  await readFile(join(appDir, 'pages/todo-listing.lf'));
  })
  .handle(dev.jsonld(ctx => {
    return {
      '@context': getContext.url(),
      members: listTodosStatement.all({
        url: joinPaths(rootURL, 'todos'),
        todoStatus: ctx.payload.todoStatus ?? null,
        search: ctx.payload.search ?? null,
        limit: ctx.payload.limit ?? 10,
        offset: ctx.payload.offset ?? 0,
      }).map(todoMapper),
    };
  }));

 const getTodoStatement = db.prepare(`
   select
       :ctx                                  "@context"
     , 'Todo'                                "@type"
     , :url || '/' || uuid                   "url"
     , t.uuid                                "uuid"
     , datetime(t.create_time, 'unixepoch')  "createTime"
     , datetime(t.update_time, 'unixepoch')  "updateTime"
     , datetime(t.complete_time, 'unixepoch')    "completeTime"
     , t.status                                  "todoStatus"
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
  .handle(dev.html('todo-detail'))
  .handle('text/longform', async (ctx) => {
    ctx.body = await readFile(join(appDir, 'pages/todo-detail.lf'));
  })
  .handle(dev.jsonld((ctx) => {
    console.log({
      url: ctx.url,
      ctx: getContext.url(),
      todoUUID: ctx.payload.todoUUID,
    });
    const todo = getTodoStatement.get({
      url: joinPaths(rootURL, 'todos'),
      ctx: getContext.url(),
      todoUUID: ctx.payload.todoUUID,
    });

    return todoMapper(todo);
  }));


const insertTodoStatement = db.prepare(`
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
    , datetime(complete_time, 'unixepoch')  "completeTime"
    , status                                "todoStatus"
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
      url: joinPaths(rootURL, 'todos'),
      title: ctx.payload.title,
      description: ctx.payload.description,
    });

    if (todo == null) {
      throw new BadRequestError('Could not create todo');
    }

    ctx.status = 302;
    ctx.headers.set('Location', `${ctx.url}/${todo.uuid}?action=created`);
  })
  .handle(['application/ld+json', 'application/json'], ctx => {
    const todo = insertTodoStatement.get({
      uuid: randomUUID(),
      url: joinPaths(rootURL, 'todos'),
      title: ctx.payload.title,
      description: ctx.payload.description,
    });

    ctx.status = 201;
    ctx.body = JSON.stringify({
      '@context': getContext.url(),
      message: 'todo-created',
      status: 'success',
      result: todoMapper(todo),
    });
  });


const updateTodoStatement = db.prepare(`
  update todos set
      title = :title
    , description = :description
  where uuid = :todoUUID
  returning 
      :url                                  "@id"
    , 'Todo'                                "@type"
    , :url                                  "url"
    , uuid                                  "uuid"
    , datetime(create_time, 'unixepoch')    "createTime"
    , datetime(update_time, 'unixepoch')    "updateTime"
    , datetime(complete_time, 'unixepoch')  "completeTime"
    , status                                "todoStatus"
    , title                                 "title"
    , description                           "description"
`);

const updateTodoAction = rootScope.http.post('/todos/{todoUUID}', {
  name: 'update-todo',
})
  .public()
  .define({
    typeDef: typeDefs.UpdateTodosAction,
    spec: {
      todoUUID: {
        typeDef: typeDefs.uuid,
        dataType: 'string',
        valueRequired: true,
        valueMinLength: 36,
        valueMaxLength: 36,
        valueName: 'todoUUID',
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
  .use<{ todo: Todo }>(async (ctx, next) => {
    const todo = updateTodoStatement
      .get({
        url: joinPaths(rootURL, 'todos'),
        ...ctx.payload,
      });

    if (todo == null)
      throw new Error('Could not update todo');

    ctx.state.todo = todoMapper(todo);

    await next();
  })
  .handle('text/html', ctx => {
    ctx.status = 302;
    ctx.headers.set('Location', ctx.state.todo['@id'] + '?action=updated');
  })
  .handle(dev.jsonld(ctx => {
    ctx.state.todo['@context'] = getContext.url();

    return ctx.state.todo as Todo
  }));


const setTodoStatusStatement = db.prepare(`
update todos set
  status = :todoStatus
where uuid = :todoUUID
`)

const setTodoStatusAction = rootScope.http.put('/todos/{todoUUID}/todo-status', { name: 'set-todo-status' })
  .public()
  .define({
    typeDef: typeDefs.SetTodoStatusAction,
    spec: {
      todoUUID: {
        typeDef: typeDefs.todoUUID,
        valueName: 'todoUUID',
        dataType: 'string',
        valueRequired: true,
        valueMinLength: 36,
        valueMaxLength: 36,
      },
      todoStatus: {
        typeDef: typeDefs.todoStatus,
        dataType: 'string',
        valueRequired: true,
        validator: isTodoStatus,
      },
    },
  })
  .use((ctx, next) => {
    const res = setTodoStatusStatement.run({
      todoUUID: ctx.payload.todoUUID,
      todoStatus: ctx.payload.todoStatus,
    });

    if (res.changes === 0) {
      throw new InternalServerError(`Failed to update todo`);
    }
    
    next();
  })
  .handle('text/html', (ctx) => {
    ctx.status = 302;
    ctx.headers.set('location', todoListing.url());
  })
  .handle(dev.jsonld((ctx) => {
    const todo = getTodoStatement.get({
      url: joinPaths(rootURL, 'todos'),
      ctx: getContext.url(),
      todoUUID: ctx.payload.todoUUID,
    });

    return todoMapper(todo);
  }));
