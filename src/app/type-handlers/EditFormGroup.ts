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

export const EditFormGroup: EditComponent<JSONValue, AnyFormGroupAttrs> = {
  view: (vnode) => {
    return m('.form-group', vnode.attrs.attrs, [
      m('.header.row',
        vnode.attrs.attrs.label != null &&
          m('label.start', { for: vnode.attrs.o.id }, vnode.attrs.attrs.label),
        vnode.attrs.attrs.headerEnd != null &&
          m('.end', vnode.attrs.attrs.headerEnd),
      ),
      m('.body.row',
        vnode.attrs.o.default(vnode.attrs.attrs.args),
        (vnode.attrs.attrs.clearable ?? !vnode.attrs.spec.required) && vnode.attrs.o.edit({
          component: EditSetNull,
          attrs: {
            targetName: vnode.attrs.attrs.label,
          },
        })
      ),
      m('.footer.row',
        vnode.attrs.o.problem.detail &&
          m('span.problem', vnode.attrs.o.problem.detail),
      ),
    ]);
  },
};
