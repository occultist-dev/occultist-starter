import type {JSONObject, PresentComponent} from '@octiron/octiron';
import m from 'mithril';


export type PresentRecipeAttrs = { headerLevel?: 1 | 2 | 3 | 4 | 5 | 6 };

export const PresentRecipe: PresentComponent<JSONObject, PresentRecipeAttrs> = {
  view: ({ attrs: { o, attrs: { headerLevel = 1 } }}) => {
    return [
      o.select('scm:name', o => [
        m(`h${Math.min(headerLevel, 6)}`, o.default()),
      ]),

      m(`h${Math.min(headerLevel + 1, 6)}`, 'Ingredients'),

      m('dl', [
        o.select('ingredients', o => [
          m('dt', o.select('scm:name')),
          m('dd', o.select('scm:quantity')),
        ]),
      ]),

      m(`h${Math.min(headerLevel + 1, 6)}`, 'Instructions'),

      m('ol', [
        o.select('steps', o => [
          m('li', [
            o.select('instructions', o => [
              m('p', o.default()),
            ]),

            m(`h${Math.min(headerLevel + 2, 6)}`, 'Ingredients'),
            m('dl', [
              o.select('ingredients', o => [
                m('dt', o.select('scm:name')),
                m('dd', o.select('scm:quantity')),
              ]),
            ]),
          ]),
        ]),
      ]),
    ];
  }
}
