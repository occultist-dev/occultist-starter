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
      oninput: (evt) => {
        console.log('CHANGED', evt);
        attrs.onChange(evt.target.value);
      },
      onselect: (evt) => {
        console.log('EVT', evt);
      },
    },
      m('option[value=planned]', 'Planned'),
      m('option[value=in-progress]', 'In progress'),
      m('option[value=complete]', 'Complete'),
    );
  }

};
