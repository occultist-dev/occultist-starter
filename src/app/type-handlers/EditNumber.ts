import m from "mithril";
import type {EditComponent} from '@octiron/octiron';

export const EditNumber: EditComponent<number> = {
  view: ({ attrs }) => {
    return m("input", {
      ...attrs.attrs,
      type: 'text',
      inputmode: 'numeric',
      pattern: '[0-9|\\.]*',
      ...attrs.spec,
      id: attrs.o.id,
      name: attrs.o.name,
      value: attrs.value,
      onchange: (evt: KeyboardEvent) => {
        attrs.onChange(Number((evt.target as HTMLInputElement).value));
      },
    });
  },
};
