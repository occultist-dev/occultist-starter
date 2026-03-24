import m from 'mithril';
import {type SSRView} from "@occultist/extensions"
import {OctironForm, OctironSubmitButton} from '@octiron/octiron';
import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
import {EditTextAsTextArea} from '#type-handlers/EditTextAsTextArea.ts';
import {renderLongform} from '#utils/renderLongform.ts';


export const head: SSRView = (page) => {
  return page.o.enter(page.location, {
    loading: m('title', '...'),
    fallback: m('title', 'Not found'),
  }, o => [
    o.select('oct:title', o => m('title', o.value as string)),
    o.select('oct:description', o => m('meta[name=description]', { content: o.value })),
  ]);
}

export const main: SSRView = (page) => {
  const l = renderLongform(page);

  return page.o.enter(page.location, {
    mainEntity: true,
    fallback: m('h1', 'Not found'),
    loading: m('h1', 'Loading'),
  }, o => [
    m('main.list', 
      o.perform('oct:actions UpdateTodosAction', {
        initialValue: {
          'oct:uuid': o.get('oct:uuid'),
          'oct:title': o.get('oct:title'),
          'oct:description': o.get('oct:description'),
        },
      }, o =>
        m(OctironForm, { o },
          o.problem.detail && 
            m('.error.card', o.problem.detail),
          
          o.select('oct:title', {
            component: EditFormGroup,
            attrs: { label: l.text('title') },
          }),

          o.select('oct:description', {
            component: EditFormGroup,
            attrs: {
              label: l.text('description'),
              args: {
                component: EditTextAsTextArea,
                attrs: {
                  rows: 8,
                },
              },
            },
          }),

          m('.action-row',
            m('.end',
              m(OctironSubmitButton, { o }, l('update-todo')),
            ),
          ),
        ),
      ),
    ),

    m('p', 
      o.select('oct:title'),
    ),

    m('p',
      o.select('oct:description'),
    ),
  ]);
};

