import type {PresentComponent} from '@octiron/octiron';

export const PresentNumber: PresentComponent<number> = () => {
  return {
    view: ({ attrs: { value } }) => {
      return value;
    },
  };
};
