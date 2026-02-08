import { makeTypeHandler } from '@octiron/octiron';
import {PresentText} from '#type-handlers/PresentText.ts';
import {EditText} from '#type-handlers/EditText.ts';
import {EditTextAsTextArea} from '#type-handlers/EditTextAsTextArea.ts';
import {PresentURL} from '#type-handlers/PresentURL.ts';
import {EditTodoStatus} from '#type-handlers/EditTodoStatus.ts';

export const typeHandlers = [
  makeTypeHandler({
    type: '@id',
    present: PresentURL,
  }),
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
    type: 'todoStatus',
    present: EditTodoStatus,
    edit: EditTodoStatus,
  }),
] as const;

