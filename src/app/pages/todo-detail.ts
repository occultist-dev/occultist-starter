import m from 'mithril';
import {type SSRView} from "@occultist/extensions"
import {renderLongform} from '#utils/renderLongform.ts';


export const head: SSRView = ({ o, location }) => {
  return [
    o.enter(location.toString(), { mainEntity: true }, o => [
      o.select('oct:title', o => m('title', o.value as string)),
      o.select('oct:description', o => m('meta', {
        name: 'description',
        content: o.value as string,
      })),
    ]),
  ];
}

export const body: SSRView = ({ o, location }) => {
  let messageEl: m.Children;
  const message = location.searchParams.get('message');

  if (message != null)
    messageEl = m('aside.callout.success', message);


  return o.enter(location.toString(), { mainEntity: true }, o => [
    m('header', [
      o.select('oct:title', o => m('title', o.value as string)),
    ]),

    messageEl,

    m('main', 
      o.select('oct:description', o =>
        m('p.lede', o.value as string),
      ),
    ),
  ]);
}

export const footer = renderLongform('footer');
