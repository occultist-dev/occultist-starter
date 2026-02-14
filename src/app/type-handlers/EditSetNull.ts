import m from 'mithril';
import type {EditComponent} from '@octiron/octiron';


export type EditSetNullAttrs = {
  targetName?: string;
} & m.Attributes;

export const EditSetNull: EditComponent<EditSetNullAttrs> = {
  view({ attrs: { value, onchange, spec, attrs: { targetName, ...attrs }}}) {
    return m('button.button', {
      ...attrs,
      type: 'button',
      'aria-label': targetName != null ? `Clear ${targetName}` : `Clear value`,
      disabled: value == null || spec?.readonly,
      onclick: () => onchange(null),
    }, 'Clear');
  },
};
