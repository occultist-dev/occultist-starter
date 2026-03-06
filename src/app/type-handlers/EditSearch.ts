import m, {type Attributes} from 'mithril';
import type {AnyComponent} from '@octiron/octiron';

export type EditSearchAttrs = {
  form?: string;
  searchText?: string;
} & Attributes;

export const EditSearch: AnyComponent<string, EditSearchAttrs> = {
  view: ({ attrs: { o, attrs: { form, searchText, ...childAttrs }, ...attrs }}) => {
    if (attrs.renderType === 'present') {
      return m('.control-group.tight',
        m('input', {
          placeholder: childAttrs.placeholder ?? 'Search',
          ...childAttrs,
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
        placeholder: childAttrs.placeholder ?? 'Search',
        ...childAttrs.attrs,
        type: 'search',
        id: o.id,
        name: childAttrs.name,
        value: attrs.value,
        oninput: (evt: KeyboardEvent) => {
          attrs.onChange((evt.target as HTMLInputElement).value);
        },
      }),
      !attrs.spec.required && (
        m('.input-controls',
          m('button.small.minimal.button', {
            onclick: (evt: Event) => {
              evt.preventDefault();
              attrs.onchange(null, { submit: true });
            },
          }, '🗙'),
        )
      ),
      m('button.button', {
        form: form,
        onclick: (evt: Event) => {
          evt.preventDefault();
          attrs.onChange(childAttrs.value, { submit: true });
        },
      }, searchText ?? 'Search'),
    ]);
  },
};
