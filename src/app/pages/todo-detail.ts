import m from 'mithril';
import {type SSRView} from "@occultist/extensions"
import {renderLongform} from '#utils/renderLongform.ts';


export const head: SSRView = ({ o, location }) => {
  return o.enter(location, o => [
    m('title', o.get<string>('oct:title')),
    o.select('oct:description', o => m('meta', {
      name: 'description',
      content: o.value,
    })),
  ]);
}

export const body: SSRView = ({ o, location }) => {
  let messageEl: m.Children;
  const message = location.searchParams.get('message');

  if (message != null) {
    messageEl = m('aside.callout.success', message);
  }

  return o.enter(location, {
    mainEntity: true,
    fallback: m('h1', 'Not found'),
    loading: m('h1', 'Loading'),
  }, o => [
    m('header', [
      m('h1', o.get<string>('oct:title')),

      m('nav',
        m('li', m('a[href=/]', 'Home')),
        m('li', m('a[href=/todos]', 'Todos')),
      ),
    ]),

    messageEl,

    m('main', 
      o.select('oct:description', o =>
        m('p.lede', o.value as string),
      ),
    ),
  ]);
}

//export const footer = renderLongform('footer');
