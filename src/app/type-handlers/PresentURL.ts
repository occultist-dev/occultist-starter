import type {PresentComponent} from '@octiron/octiron';
import m, {type Attributes} from 'mithril';


export type PresentURLAttrs = {
  text: string;
} & Attributes;

export const PresentURL: PresentComponent<string, Attributes> = {
  view({ attrs: { value, attrs: { text, ...attrs } }}) {
    return m('a', {
      ...attrs,
      href: value,
    }, text);
  },
};
