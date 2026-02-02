import type {PresentComponent} from '@octiron/octiron';

export const PresentText: PresentComponent<string> = {
  view: ({ attrs: { value } }) => {
    return value;
  },
}
