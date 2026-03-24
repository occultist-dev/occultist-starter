import type {AnyComponent} from '@octiron/octiron';
import m from 'mithril';


type TodoStatus =
  | 'planned'
  | 'in-progress'
  | 'complete'
;

export const EditTodoStatus: AnyComponent<TodoStatus, { updated: boolean }> = {
  view(vnode) {
    if (vnode.attrs.renderType === 'present') {
      switch (vnode.attrs.value) {
        case 'in-progress': return 'In progress';
        case 'complete': return 'Complete';
      }
      return 'Planned';
    }

    return m('select', {
      ...vnode.attrs.attrs,
      value: vnode.attrs.value,
      disabled: vnode.attrs.spec.readonly,
      multiple: vnode.attrs.spec.multiple,
      oninput: (evt) => {
        vnode.attrs.onChange(evt.target.value);
      },
    },
      m('option[value=planned]', { selected: vnode.attrs.value === 'planned' }, 'Planned'),
      m('option[value=in-progress]', { selected: vnode.attrs.value === 'in-progress' }, 'In progress'),
      m('option[value=complete]', { selected: vnode.attrs.value === 'complete' }, 'Complete'),
    );
  },
};
