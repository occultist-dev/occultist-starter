import m from 'mithril';
import { EditComponent } from '@octiron/octiron';
import { Icon } from '../components/Icon.ts';


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
    }, m(Icon, { icon: 'close-small' }));
  },
};
