import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
import {renderLongform} from '#utils/renderLongform.ts';
import type {SSRView} from '@occultist/extensions';
import {OctironForm, OctironPerformArgs, OctironSubmitButton, type Predicate} from '@octiron/octiron';
import m from 'mithril';


const isPopulated = (termOrType: string): Predicate => (o) => {
  let value = o.get(termOrType);

  if (value == null) return false;
  if (Array.isArray(value) && value.length === 0) return false;

  return true;
}

const interceptor: OctironPerformArgs['interceptor'] = ({ o, prev, next }) => {
  const url = new URL(document.location.toString());

  const search = next[o.expand('oct:search')] as string;
  let page = next[o.expand('oct:page')] as number;

  if (search !== prev[o.expand('oct:search')]) {
    page = 1;
    next[o.expand('oct:page')] = page;
  }

  if (search == null || search === '') {
    url.searchParams.delete('search');
  } else {
    url.searchParams.set('search', search);
  }

  if (page == null || page <= 1) {
    url.searchParams.delete('page');
  } else {
    url.searchParams.set('page', page.toString());
  }

  history.pushState(null, null, url);

  return next;
}

export const main: SSRView = (args) => {
  const { o, location } = args;

  const l = renderLongform(args);

  return o.perform('oct:actions ListTodosAction', {
    mainEntity: true,
    submitOnInit: true,
    submitOnChange: true,
    interceptor,
    initialValue: {
      'oct:search': location.searchParams.get('search'),
      'oct:page': Number(location.searchParams.get('page') ?? 1),
    },
  }, x => [
    m(OctironForm, { o: x },
      m('.action-bar',
        x.select('oct:search', o =>
          m('.start',
            o.edit({ attrs: { placeholder: l.text('search') } }),
          ),
        ),
        
        m('.end',
          m('button.button', {
            type: 'button',
            command: 'show-modal',
            commandFor: 'add-todo-dialog',
          }, l('add-todo')),
        ),
      ),

      m('.narrow.list', 
        x.failure(
          m('.card', 'Something went wrong'),
        ),

        x.success(o => o.not(isPopulated('oct:members'),
          m('.card', 'No results')
        )),

        x.success('oct:members', y =>
          m('.thin.inline.card',
            m('.start',
              y.perform('oct:actions SetTodoStatusAction', {
                submitOnChange: true,
                onSubmitSuccess: () => x.submit(),
                fallback: y.select('todoStatus'),
                initialValue: {
                  todoUUID: y.get('oct:uuid'),
                  todoStatus: y.get('todoStatus'),
                },
              }, o =>
                m(OctironForm, { o },
                  o.select('todoStatus'),
                ),
              ),

              m('h2', y.get<string>('oct:title')),
            ),

            y.select('@id', o => 
              m('.end',
                o.present({
                  attrs: {
                    class: 'small anchor button',
                    text: l.text('view-todo'),
                  },
                }),
              ),
            ),
          ),
        ),
      ),

      x.select('oct:page', o =>
        m('.control-bar',
          m('.end', o.edit()),
        ),
      ),
    ),

    x.root(o =>
      o.perform('oct:actions CreateTodosAction', {
        onSubmitSuccess: o => {
          const dialog = document.getElementById('add-todo-dialog') as HTMLDialogElement;

          x.submit().finally(() => {
            o.update({}, { submitOnChange: false });
            dialog.close()
          });
        },
      }, o =>
        m('dialog#add-todo-dialog',
          m(OctironForm, { o },
            l('add-todo-dialog-header'),

            m('.dialog-body',
              o.select('oct:title', {
                component: EditFormGroup,
                attrs: { label: l.text('title'), autofocus: true },
              }),

              o.select('oct:description', {
                component: EditFormGroup,
                attrs: { label: l.text('description'), clearable: false },
              }),
            ),

            m('.dialog-footer',
              m('.end.action-row',
                l('cancel-adding-todo-button'),
                m(OctironSubmitButton, {
                  o,
                  class: 'button',
                }, l.text('add-todo')),
              ),
            ),
          ),
        ),
      ),
    ),
  ]);
}

