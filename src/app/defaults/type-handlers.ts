import { makeTypeHandler } from '@octiron/octiron';
import {PresentText} from '#type-handlers/PresentText.ts';
import {EditText} from '#type-handlers/EditText.ts';
import {EditTextAsTextArea} from '#type-handlers/EditTextAsTextArea.ts';
import {PresentURL} from '#type-handlers/PresentURL.ts';
import {EditTodoStatus} from '#type-handlers/EditTodoStatus.ts';
import {PresentNumber} from '#type-handlers/PresentNumber.ts';
import {EditPage} from '#type-handlers/EditPage.ts';
import {EditSearch} from '#type-handlers/EditSearch.ts';

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
    type: 'oct:search',
    present: PresentText,
    edit: EditSearch,
  }),
  makeTypeHandler({
    type: 'oct:page',
    present: PresentNumber,
    edit: EditPage,
  }),
  makeTypeHandler({
    type: 'todoStatus',
    present: EditTodoStatus,
    edit: EditTodoStatus,
  }),
] as const;

