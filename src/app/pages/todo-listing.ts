import {Debug} from '#type-handlers/Debug.ts';
import {renderLongform} from '#utils/renderLongform.ts';
import type {SSRView} from '@occultist/extensions';
import m from 'mithril';

export const head = renderLongform('head');

export const body: SSRView = (args) => {
  const { o, location } = args;
  const l = renderLongform(args);

  return [
    l('header'),

    o.enter(location, { mainEntity: true }, o => [
      o.select('oct:members', o => 
        m('.card',
          o.select('oct:title', o => m('.start', o.present())),
          o.select('@id', o => m('.end', o.present({
            attrs: { text: 'View todo' },
          }))),
        ),
      ),

      o.present({ component: Debug }),
    ]),
  ];
}

export const footer = renderLongform('footer');
