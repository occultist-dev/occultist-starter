import { makeTypeHandler } from '@octiron/octiron';
import {PresentText} from '#type-handlers/PresentText.ts';
import {EditText} from '#type-handlers/EditText.ts';
import {EditTextAsTextArea} from '#type-handlers/EditTextAsTextArea.ts';
import {PresentURL} from '#type-handlers/PresentURL.ts';

export const typeHandlers = [
  makeTypeHandler({
    type: 'oct:title',
    present: PresentText,
    edit: EditText,
  }),
  makeTypeHandler({
    type: 'oct:description',
    present: PresentText,
    edit: EditTextAsTextArea,
  }),
  makeTypeHandler({
    type: 'oct:url',
    present: PresentURL,
  }),
] as const;

