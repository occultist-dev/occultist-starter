import m from 'mithril';
import type {SSRView} from "@occultist/extensions";


export const body: SSRView = () => {
  return m('h1', 'Next');
};
