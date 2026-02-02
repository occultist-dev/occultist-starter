import m, {type Attributes} from 'mithril';
import type {AnyComponent} from '@octiron/octiron';

export type EditSearchAttrs = {
  form?: string;
  searchText?: string;
} & Attributes;

export const EditSearch: AnyComponent<string, EditSearchAttrs> = {
  view: ({ attrs: { o, attrs: { form, searchText, ...attrs }, ...mode }}) => {
    if (mode.renderType === 'present') {
      return m('.inline-layout',
        m('input', {
          placeholder: attrs.placeholder ?? 'Search',
          ...attrs,
          id: null,
          name: null,
          value: null,
          type: 'search',
          disabled: true,
        }),
        m('button.button', {
          disabled: true,
        }, searchText ?? 'Search'),
      );
    }

    return m('.inline-layout', [
      m('input.search-input', {
        placeholder: attrs.placeholder ?? 'Search',
        ...attrs.attrs,
        type: 'search',
        id: o.id,
        name: attrs.name,
        value: attrs.value,
        onchange: (evt: KeyboardEvent) => {
          mode.onChange((evt.target as HTMLInputElement).value);
        },
      }),
      m('button.button', {
        type: 'submit',
        form: form,
      }, searchText ?? 'Search'),
    ]);
  },
};
