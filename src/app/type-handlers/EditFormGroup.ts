import type {EditComponent, JSONValue} from '@octiron/octiron';
import m from 'mithril';
import { EditSetNull } from './EditSetNull.ts';


export type AnyFormGroupAttrs = {
  label?: m.Children;
  headerEnd?: m.Children;
  footerStart?: m.Children;
  footerEnd?: m.Children;
  clearable?: boolean;
} & m.Attributes;

export const EditFormGroup: EditComponent<JSONValue, AnyFormGroupAttrs> = () => {
  return {
    view: ({ attrs: { o, attrs: {
      label,
      headerEnd,
      footerStart,
      footerEnd,
      clearable,
      ...componentAttrs
    }, ...attrs} }) => {
      return m('.form-group', componentAttrs, [
        m('.form-group__header', {
          for: o.id,
        }, [
          label != null ? m('label.form-group__header-start', { for: o.id }, label) : null,
          headerEnd != null ? m('.form-group__header-end', headerEnd) : null,
        ]),
        m('.form-group__input', [
          o.default(),
          clearable ?? !attrs.spec.required
            ? o.edit({
              component: EditSetNull,
              attrs: {
                targetName: label,
              },
            }) : null,
        ]),
        m('.form-group__footer', [
          footerStart != null ? m('.form-group__footer-start', footerStart) : null,
          footerEnd != null ? m('.form-group__footer-end', footerEnd) : null,
        ]),
      ]);
    },
  };
}
