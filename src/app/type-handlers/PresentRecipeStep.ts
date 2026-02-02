import type {JSONObject, PresentComponent} from '@octiron/octiron';
import m from 'mithril';


export const PresentRecipeStep: PresentComponent<JSONObject> = {
  view: ({ attrs: { o }}) => {
    return [
      o.select('position', o => [
        m('strong', 'Step ', o.default()),
      ]),

      m('dl', [
        o.select('ingredients', o => [
          m('dt', [
            o.select('scm:name'),
          ]),
          m('dd', [
            o.select('scm:quantity'),
          ]),
        ]),
      ]),

      o.select('instructions'),
    ];
  }
}
