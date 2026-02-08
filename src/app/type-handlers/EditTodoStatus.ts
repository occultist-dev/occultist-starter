import type {AnyComponent} from '@octiron/octiron';
import m from 'mithril';

type TodoStatus =
  | 'planned'
  | 'in-progress'
  | 'complete'
;


export const EditTodoStatus: AnyComponent<TodoStatus> = {

  view({ attrs }) {
    if (attrs.renderType === 'present') {
      switch (attrs.value) {
        case 'in-progress': return 'In progress';
        case 'complete': return 'Complete';
      }
      return 'Planned';
    }

    return m('select', {
      ...attrs.attrs,
      value: attrs.value,
      disabled: attrs.spec.readonly,
      multiple: attrs.spec.multiple,
      onselect: (evt) => {
        console.log('EVT', evt);
        attrs.onChange(evt.target.value);
      },
    },
      m('option[value=planned]', 'Planned'),
      m('option[value=in-progress]', 'In progress'),
      m('option[value=complete]', 'Complete'),
    );
  }

};
