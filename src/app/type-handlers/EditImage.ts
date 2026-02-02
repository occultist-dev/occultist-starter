import m from 'mithril';
import type {EditComponent} from '@octiron/octiron';
import {EditFile} from './EditFile.ts';


export type EditImageAttrs = {
  accept?: string[];
  capture?: boolean;
};

export const EditImage: EditComponent<string, EditImageAttrs> = () => {
  return {
    view({ attrs }) {
      return m(EditFile, {
        ...attrs,
        attrs: {
          accept: ['image/*'],
          ...attrs.attrs,
        }
      });
    },
  };
}
