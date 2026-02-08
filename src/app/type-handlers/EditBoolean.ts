import type {AnyComponent} from '@octiron/octiron';
import m from 'mithril';


export const EditBoolean: AnyComponent<boolean> = {
  view: ({ attrs }) => {
    if (attrs.renderType === 'present') {
      return m('input', {
        type: 'checkbox',
        readonly: true,
        disabled: true,
        checked: attrs.value || false,
      });
    }
    
    return m('input', {
      type: 'checkbox',
      checked: attrs.value,
      value: attrs.value,
      oninput: (evt: InputEvent) => attrs.onChange((evt?.target as HTMLInputElement)?.checked),
    });
  },
}
