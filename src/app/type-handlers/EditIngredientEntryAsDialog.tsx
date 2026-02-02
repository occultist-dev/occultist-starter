import m from 'mithril';
import { JSONObject } from '../../common/types.ts';
import { Dialog } from '../components/Dialog.ts';
import { EditComponent } from '@octiron/octiron';
import { Grid } from '../components/Grid.ts';
import { Debug } from './Debug.ts';


export type EditIngredientEntryAsDialogAttrs = {
  title?: m.Children;
  buttonContent?: m.Children;
};

export const EditIngredientEntryAsDialog: EditComponent<JSONObject, EditIngredientEntryAsDialogAttrs> = () => {
  return {
    view: ({ attrs: { o, attrs: { title, buttonContent } }}) => {
      return [
        m(Dialog, {
          wide: true,
          title: title ?? m('p', 'Add ingredient'),
          buttonClass: 'button',
          buttonContent: buttonContent ?? 'Add ingredient',
        }, [
          // o.root('actions', o => [
          //   o.present({ component: Debug }),
          //   o.select('ListIngredientsAction', { loading: 'Loading', fallback: 'Fallback' }, o => [
          //     m('p', 'In action'),
          //   ]),
          // ]),
          o.root('actions', o => o.perform('ListIngredientsAction', {
            submitOnInit: true,
            submitOnChange: true,
          }, o => [
            m('p', 'In action'),

            o.success({ component: Debug }),

            o.success({
              component: Grid,
              attrs: {
                selector: 'members',
                columms: [
                  {
                    title: 'Name',
                    selector: 'scm:name',
                  },
                ],
              },
            }),
          ])),
        ]),
      ];
    }
  };
}
