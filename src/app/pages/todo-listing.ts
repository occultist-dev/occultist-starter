import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
import {renderLongform} from '#utils/renderLongform.ts';
import type {SSRView} from '@occultist/extensions';
import {OctironForm, OctironSubmitButton, type Predicate} from '@octiron/octiron';
import m from 'mithril';


const isPopulated = (termOrType: string): Predicate => (o) => {
  let value = o.get(termOrType);

  if (value == null) return false;
  if (Array.isArray(value) && value.length === 0) return false;

  return true;
}

export const main: SSRView = (args) => {
  const { o, location } = args;
  const l = renderLongform(args);

  return o.perform('oct:actions ListTodosAction', {
    mainEntity: true,
    submitOnInit: true,
    submitOnChange: true,
    initialValue: {
      'oct:search': location.searchParams.get('search'),
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
        x.success(o => o.not(isPopulated('oct:members'),
          m('.card', 'No results')
        )),

        x.success('oct:members', y =>
          m('.thin.inline.card',
            m('header.start',

              y.perform('oct:actions SetTodoStatusAction', {
                submitOnChange: true,
                readonlyFallback: true,
                onSubmitSuccess: setTodoStatus => {
                  x.submit().then(() => {
                    setTodoStatus.update({
                      todoUUID: y.get('oct:uuid'),
                      todoStatus: y.get('todoStatus'),
                    }, { submit: false });
                  });
                },
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

