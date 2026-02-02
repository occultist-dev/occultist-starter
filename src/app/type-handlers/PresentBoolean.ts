import type {PresentComponent} from '@octiron/octiron';

export const PresentBoolean: PresentComponent<boolean> = {
  view: ({ attrs: { value } }) => {
    return value ? 'Yes' : 'No';
  },
};
