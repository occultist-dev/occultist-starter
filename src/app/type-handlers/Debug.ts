import m from "mithril";
import { type AnyComponent, type JSONValue, OctironDebug } from '@octiron/octiron';


export const Debug: AnyComponent<JSONValue> = {
  view: ({ attrs: { o } }) => {
    return m(OctironDebug, { o });
  },
};
