import m from "mithril";
import type {AnyComponent} from '@octiron/octiron';

export const EditText: AnyComponent<string> = {
  view: ({ attrs }) => {
    if (attrs.renderType === 'present') {
      return m("input", {
        id: attrs.o.id,
        ...attrs.attrs,
        value: attrs.value || '',
        disabled: true,
      });
    }

    return [m("input", {
      id: attrs.o.id,
      ...attrs.spec,
      ...attrs.attrs,
      name: attrs.o.inputName,
      value: attrs.value || '',
      oninput: (evt: KeyboardEvent) => {
        attrs.onChange((evt.target as HTMLInputElement).value);
      },
    }),
  ];
  },
};
