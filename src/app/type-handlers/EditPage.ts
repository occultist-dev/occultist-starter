import m from 'mithril';
import type {EditComponent} from '@octiron/octiron';


export type EditPageAttrs = {
  form?: string;
};

export const EditPage: EditComponent<number, EditPageAttrs> = {
  view: ({ attrs }) => {
    const value = (attrs.value ??= 1);

    return m('.page-controls', [
      m(
        'button',
        {
          type: 'submit',
          disabled: attrs.spec.readonly || value === 1,
          value: value - 1,
          name: attrs.name,
          onclick: () => {
            if (value === 2 || value === 1) {
              attrs.onChange(null);
            } else {
              attrs.onChange(value - 1);
            }
          },
        },
        'Prev'
      ),
      m(
        'button',
        {
          type: 'submit',
          disabled: attrs.spec.readonly,
          value: value + 1,
          name: attrs.name,
          onclick: () => {
            attrs.onChange(value + 1);
          },
        },
        'Next'
      ),
    ]);
  },
};
