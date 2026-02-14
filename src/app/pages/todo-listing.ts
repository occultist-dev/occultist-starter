import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
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
  }, a => [
    // actions bar
    m('.block.action-row',
      a.select('oct:search', o =>
        m('.start',
          o.edit({
            attrs: { label: l.text('search') },
            component: EditFormGroup,
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

    m('.block.card-list', 
      // todo cards
      a.success('oct:members', o =>
        m('article.card',
          m('header.card-header',
            m('.start',
              o.perform('oct:potentialAction', {
                fallback: o.select('todoStatus'),
                initialValue: {
                  todoStatus: o.get('todoStatus'),
                },
              }, o =>
                m(OctironForm, { o },
                  o.select('todoStatus'),
                ),
              ),
            ),
            m('h2.end', o.get<string>('oct:title')),
          ),

          m('.card-body',
            o.select('oct:description', o =>
              m('p', o.present()),
            ),
          ),
        ),
      ),
    ),

    a.root(o =>
      o.perform('oct:actions CreateTodosAction', {
        onSubmitSuccess: o => {
          const dialog = document.getElementById('add-todo-dialog') as HTMLDialogElement;

          a.submit().finally(() => {
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

