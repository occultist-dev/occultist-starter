import m from 'mithril';
import type {EditComponent} from '@octiron/octiron';


function getTarget(evt: KeyboardEvent) {
  const target = evt.target as HTMLInputElement;

  return target;
}


export type EditFileAttrs = {
  accept?: string[];
  capture?: boolean;
};

export const EditFile: EditComponent<string, EditFileAttrs> = ({ attrs }) => {
  let currentAttrs = attrs;
  const reader = new FileReader();

  function handler() {
    currentAttrs.onChange(reader.result as string);
  }

  reader.addEventListener("load", handler, false);

  return {
    onbeforeupdate({ attrs }) {
      currentAttrs = attrs;
    },
    onbeforeremove() {
      reader.removeEventListener('load', handler);
    },
    view({ attrs }) {
      return m("input", {
        accept: attrs.attrs.accept?.join(','),
        type: 'file',
        ...attrs.spec,
        id: attrs.o.id,
        name: attrs.o.name,
        value: attrs.value,
        onchange: (evt: KeyboardEvent) => {
          const target = getTarget(evt);
          const file = target?.files?.[0] as File;

          reader.readAsDataURL(file);
        }
      });
    },
  }
}
