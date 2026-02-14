import {renderLongform} from '#utils/renderLongform.ts';
import type {SSRView} from '@occultist/extensions';
import {OctironForm, OctironSubmitButton} from '@octiron/octiron';
import m from 'mithril';

export const main: SSRView = (args) => {
  const o = args.o;
  const l = renderLongform(args);

  return [
    l('header'),
    m('main',
      o.perform('oct:actions CreateTodosAction', {
        mainEntity: true,
      }, o => [
        m(OctironForm, { o }, [
          m('fieldset',
            m('legend', 'Todo'),

            o.select('oct:title', o =>
              m('label', 'Title', o.edit()),
            ),

            o.select('oct:description', o =>
              m('label', 'Description', o.edit()),
            ),
          ),
          
          m(OctironSubmitButton, { o }, 'Submit'),
        ]),
      ]),
    ),
  ];
};

