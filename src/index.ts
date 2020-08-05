// Global Imports
import { EditorState, ContentBlock } from "draft-js";
import { EditorPlugin } from "draft-js-plugins-editor";
import katex from "katex";

// Local Imports
import removeTeXBlock from "./modifiers/removeTeXBlock";
import { getPluginContext } from "./PluginContext";

// Style and Types Imports
import "./styles.css";
import * as types from "./types";

const KateXPlugin = (config: types.IKatexPluginConfig = {}): EditorPlugin => {
  const store: types.ExtendedPluginFunctions = {} as any;
  const liveTeXEdits = new Map<string, boolean>();
  const draftRef = config.draftRef;
  const pluginContext = {
    store,
    draftRef,
    katex,
  };

  /**
   * HOC definition for custom rendering ContentBlock objects of type atomic
   * handling KateX entities with a custom component
   *
   * @param {ContentBlock} block
   *
   * @return {any}
   */
  const blockRendererFn = (block: ContentBlock): any => {
    if (block.getType() === "atomic") {
      const entity = store
        .getEditorState()
        .getCurrentContent()
        .getEntity(block.getEntityAt(0));
      const type = entity.getType();

      // When the entity is of type KateX render a custom component with the specified callback props
      if (type === "KateX") {
        return {
          component: getPluginContext(pluginContext),
          editable: false, // Recommended value as our component is not going to render plain text (https://draftjs.org/docs/advanced-topics-block-components/#custom-block-components)
          props: {
            onStartEdit: (blockKey: string) => {
              liveTeXEdits.set(blockKey, true);
              store.setReadOnly(liveTeXEdits.size > 0);
            },

            onFinishEdit: (blockKey: string, newEditorState: EditorState) => {
              liveTeXEdits.delete(blockKey);
              store.setReadOnly(liveTeXEdits.size > 0);
              store.setEditorState(
                EditorState.forceSelection(
                  newEditorState,
                  newEditorState.getSelection()
                )
              );
            },

            onRemove: (blockKey: string) => {
              liveTeXEdits.delete(blockKey);
              store.setReadOnly(liveTeXEdits.size > 0);

              const editorState = store.getEditorState();
              const newEditorState = removeTeXBlock(editorState, blockKey);
              store.setEditorState(newEditorState);
            },
          },
        };
      }
    }
    return null;
  };

  return {
    initialize: (initialStore: types.ExtendedPluginFunctions) => {
      Object.assign(store, { ...initialStore, texToUpdate: {} });
    },
    blockRendererFn,
  };
};

export default KateXPlugin;
