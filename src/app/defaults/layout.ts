import m from 'mithril';
import {renderLongform} from "#utils/renderLongform.ts";
import type {SSRView} from "@occultist/extensions";
import {OctironSubmitButton} from '@octiron/octiron';
import {EditFormGroup} from '#type-handlers/EditFormGroup.ts';
import {PresentURL} from '#type-handlers/PresentURL.ts';


export const head = renderLongform('head');

export const hgroup = renderLongform('hgroup');

export const body: SSRView = (args) => {
  const l = renderLongform(args);

  return [
    m('header.header',
      m('hgroup.hgroup', args.page.hgroup?.() ?? hgroup(args)),
      m('nav.nav', args.page.nav?.() ?? nav(args)),
      m('.control-group',
        m('button.button.dashed', {
          type: 'button',
          command: 'show-modal',
          commandfor: 'site-search',
        }, l.text('search')),
      ),
    ),
    m('main.main', args.page.main?.()),
    m('footer.footer', args.page.footer?.() ?? footer(args)),
    m('dialog#site-search', search(args)),
  ];
}

export const nav: SSRView = (args) => {
  return m('menu.menu',
    m('li',
      m('a.button.dashed[href=/]', {
        'aria-current': args.location.pathname === '/' ? 'page' : null,
      }, 'Home'),
    ),
    m('li', 
      m('a.button.dashed[href=/todos]', {
        'aria-current': args.location.pathname === '/todos' ? 'page' : null,
      }, 'Todos'),
    ),
  );
}

export const search: SSRView = (args) => {
  const o = args.o;
  const l = renderLongform({
    o,
    location: new URL('./components/site-search', o.store.rootIRI),
  });

  return o.perform('oct:actions ListTodosAction', {
    submitOnChange: true,
  }, o => [
    l('dialog-header'),

    m('.dialog-body',
      m('.action-row',
        o.select('oct:search', {
          component: EditFormGroup,
          attrs: { label: l.text('search-text'), },
        }),
      ),

      o.success(o =>
        m('ol.search-results',
          o.select('oct:members', o =>

            m('.action-row',
              o.select('oct:title',
                m('h3.start', o.present()),
              ),

              o.select('@id', {
                component: PresentURL,
                attrs: {
                  class: 'end', text: l.text('view-todo'),
                  onclick: () => {
                    const dialog = document.getElementById('site-search-dialog') as HTMLDialogElement;
                    
                    dialog.close();
                  },
                },
              }),
            ),

          ),
        ),
      ),
    ),

    m('.dialog-footer',
      m('.end.control-group',
        l('cancel-button'),
        m(OctironSubmitButton, { o }, l('search-text')),
      ),
    ),
  ]);
}

export const footer = renderLongform('footer');
