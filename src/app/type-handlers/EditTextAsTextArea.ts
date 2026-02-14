import m from "mithril";
import type { AnyComponent } from '@octiron/octiron';


export type EditTextAsTextAreaAttrs = {
  rows?: number;
} & m.Attributes;

export const EditTextAsTextArea: AnyComponent<string, EditTextAsTextAreaAttrs> = () => {
  return {
    view: ({ attrs }) => {
      if (attrs.renderType === 'present' ||
          attrs.o.octironType !== 'action-selection') {
        return m("textarea", {
          id: attrs.o.id,
          ...attrs.attrs,
          readonly: true,
        }, attrs.value);
      }

      return m("textarea", {
        id: attrs.o.id,
        ...attrs.spec,
        ...attrs.attrs,
        value: attrs.value,
        name: attrs.o.inputName,
        oninput: (evt: KeyboardEvent) => {
          attrs.onChange((evt.target as HTMLInputElement).value);
        },
      }, attrs.value);
    },
  };
};
