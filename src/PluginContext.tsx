// Global Imports
import React from "react";
import DraftEditor from "draft-js-plugins-editor";

// Local Imports
import TexBlock from "./components/texBlock";

// Style and Types Imports
import * as textTypes from "./types";

export interface PluginContext {
  store: textTypes.ExtendedPluginFunctions;
  draftRef: React.MutableRefObject<DraftEditor>;
  katex: textTypes.Katex;
}

/**
 * Returns a Function Component that passes the Context to the child components.
 *
 * our textTypes.Katex and katex's types modules does not match, this Omit was necessary to make it work
 * without type errors.
 */
export const getPluginContext = (ctx: Omit<PluginContext, "katex">) => (
  props: any
) => {
  return <TexBlock {...props} {...ctx} />;
};
