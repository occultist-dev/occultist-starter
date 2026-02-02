import m from 'mithril';
import { JSONObject, PresentComponent } from '@octiron/octiron';
import { Tag } from '../components/Tag.ts';
import { PresentText } from './PresentText.ts';

// deno-lint-ignore ban-types
export type PresentIngredientEntryAsTagAttrs = {};

export const PresentIngredientEntryAsTag: PresentComponent<JSONObject, PresentIngredientEntryAsTagAttrs> = {
  view({ attrs: { o }}) {
    return m(Tag, [
      o.select('ingredient scm:name', { component: PresentText }),
      o.select('scm:quantity', { component: PresentText }),
      o.select('unit', { component: PresentText }),
    ]);
  },
};

