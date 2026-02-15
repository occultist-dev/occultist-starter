import {Debug} from '#type-handlers/Debug.ts';
import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
import {EditPage} from '#type-handlers/EditPage.ts';
import {renderLongform} from '#utils/renderLongform.ts';
import type {SSRView} from '@occultist/extensions';
import {OctironForm, OctironSubmitButton} from '@octiron/octiron';
import m from 'mithril';

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
            o.edit({
              attrs: { label: l.text('search') },
              //component: EditFormGroup,
            }),
          ),
        ),
        
        m('.end',
          m('button.button', {
            type: 'button',
            command: 'show-modal',
            commandFor: 'add-todo-dialog',
          }, l.text('add-todo')),
        ),
      ),

      m('.narrow.list', 
        x.success('oct:members', o =>
          m('article.thin.inline.card',
            m('header.start',
              o.perform('oct:actions[SetTodoStatusAction]', {
                fallback: o.select('todoStatus'),
                initialValue: {
                  todoStatus: o.get('todoStatus'),
                },
              }, o =>
                m(OctironForm, { o },
                  o.select('todoStatus'),
                ),
              ),

              m('h2', o.get<string>('oct:title')),
            ),

            o.select('@id', o => 
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
          m('.end',
            o.default({ component: EditPage }),
          ),
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

