import {Debug} from '#type-handlers/Debug.ts';
import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
import {renderLongform} from '#utils/renderLongform.ts';
import type {SSRView} from '@occultist/extensions';
import {OctironForm, OctironSubmitButton} from '@octiron/octiron';
import m from 'mithril';


export const head = renderLongform('head');

export const main: SSRView = (args) => {
  const { o, location } = args;
  const l = renderLongform(args);

  return o.perform('oct:actions ListTodosAction', {
    mainEntity: true,
    submitOnInit: true,
    submitOnChange: true,
    loading: 'Loading',
    initialValue: {
      'oct:search': location.searchParams.get('search'),
    },
  }, o => [
    m('header.page-header',
      m('title', 'Todo listing'),
    ),

    m('main.block-list',

      // actions bar
      m('.block.action-row',
        o.select('oct:search', o =>
          m('.start',
            o.edit({
              attrs: { label: 'Search' },
              component: EditFormGroup,
            }),
          ),
        ),
        m('.end',
          m('button.button', {
            command: 'show-modal',
            commandfor: 'add-todo-dialog',
          }, 'Add todo'),
        ),
      ),

      m('.block.card-list', 
        // todo cards
        o.success('oct:members', o =>
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
              o.present({ component: Debug }),
            ),
          ),
        ),
      ),
    ),

    // create todos dialog
    o.root(o =>
      o.perform('oct:actions CreateTodosAction', {
        onSubmitSuccess: () => {
          const dialog = document.getElementById('add-todo-dialog') as HTMLDialogElement;

          o.store.fetch(location).finally(() => dialog.close());
        },
      }, o =>
        m('dialog#add-todo-dialog',
          m(OctironForm, { o },
            m('.dialog-header',
              m('.start',
                m('h2', 'Add todo'),
              ),
              m('.end',
                m('button.button', {
                  command: 'close',
                  commandfor: 'add-todo-dialog',
                }, 'Close'),
              ),
            ),

            m('.dialog-body',
              o.select('oct:title', {
                component: EditFormGroup,
                attrs: { label: 'Title', autofocus: true },
              }),

              o.select('oct:description', {
                component: EditFormGroup,
                attrs: { label: 'Description' },
              }),
            ),

            m('.dialog-footer',
              m('.end',
                m(OctironSubmitButton, {
                  o,
                  class: 'button',
                }, 'Add todo'),
              ),
            ),
          ),
        ),
      ),
    ),
  ]);
}

