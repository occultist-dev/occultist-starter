import m, {type Attributes} from 'mithril';
import type {AnyComponent} from '@octiron/octiron';

export type EditSearchAttrs = {
  form?: string;
  searchText?: string;
} & Attributes;

export const EditSearch: AnyComponent<string, EditSearchAttrs> = {
  view: ({ attrs: { o, attrs: { form, searchText, ...attrs }, ...mode }}) => {
    if (mode.renderType === 'present') {
      return m('.control-group.tight',
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

    return m('.control-group.tight', [
      m('input.input.rounded', {
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
      !mode.spec.required && (
        m('.input-controls',
          m('button.small.minimal.button', {
            onclick: (evt) => {
              evt.preventDefault();
              mode.onChange(null, { submit: true });
            },
          }, '🗙'),
        )
      ),
      m('button.button', {
        form: form,
        onclick: (evt) => {
          evt.preventDefault();
          mode.onChange(attrs.value, { submit: true });
        },
      }, searchText ?? 'Search'),
    ]);
  },
};
