// Global Imports
import React, { useState, useEffect, useRef } from "react";
import { EditorState } from "draft-js";
import { addStyles, EditableMathField } from "react-mathquill";
import { useOnClickOutside } from "use-hooks";
import rawKatex from "katex";

// Local Imports
import KatexOutput from "../katexOutput";

// Style and Types Imports
import styles from "./styles";
import * as types from "./types";
import { Katex } from "../../types";

// Load default MathQuill styles
addStyles();

const katex = rawKatex as Katex;

const TexBlock: types.FC = (props) => {
  /**
   * Get from the DraftJS content state the LateX current value
   *
   * @param {void}
   *
   * @return {BlockEntityData}
   */
  const getValue = (): types.BlockEntityData => {
    const contentState = props.store.getEditorState().getCurrentContent();
    return contentState.getEntity(props.block.getEntityAt(0)).getData();
  };

  // Local State
  const [editMode, setEditMode] = useState<boolean>(false);
  const [invalidTex, setInvalidTex] = useState<boolean>(false);
  const [texValue, setTexValue] = useState<string>(getValue().value);
  const [inputValue, setInputValue] = useState<string>("");

  // Refs
  const keyPressHandlerRef = useRef((_ev: any) => null);
  const texBlockRef = useRef<HTMLDivElement>();

  // Hooks
  useOnClickOutside(texBlockRef, () => {
    if (editMode) {
      save();
    }
  });

  /**
   * Edit mode should be activated when the Latex content is clicked
   *
   * @param {void}
   *
   * @return {void}
   */
  const onClick = (): void => {
    if (editMode || props.store.getReadOnly()) {
      return;
    }

    setEditMode(true);
    setInputValue(getValue().inputValue);
    startEdit();
    props.draftRef.current.focus();
  };

  /**
   * Handler for when the Latex input has changed
   *
   * @param {string} value
   *
   * @return {void}
   */
  const onValueChange = (value: string): void => {
    onMathInputChange(value);
  };

  /**
   * Parse Latex Content and update the states properly
   * with content received from the Latex input change event
   *
   * @param {string} content
   *
   * @return {void}
   */
  const onMathInputChange = (content: string): void => {
    let invalidTex = false;

    try {
      katex.__parse(content);
    } catch (e) {
      invalidTex = true;
    } finally {
      setTexValue(content);
      setInputValue(content);
      setInvalidTex(invalidTex);
    }
  };

  /**
   * Handler for when the LateX edition starts
   *
   * @param {void}
   *
   * @return {void}
   */
  const startEdit = (): void => {
    const { block, blockProps } = props;

    blockProps.onStartEdit(block.getKey());
  };

  /**
   * Handler for when the LateX edition has finished
   *
   * @param {EditorState} newContentState
   *
   * @return {void}
   */
  const finishEdit = (newContentState: EditorState): void => {
    const { block, blockProps } = props;
    blockProps.onFinishEdit(block.getKey(), newContentState);
  };

  /**
   * Handler for the update the content to be rendered
   *
   * @param {void}
   *
   * @return {void}
   */
  const save = (): void => {
    const { block, store } = props;

    const entityKey = block.getEntityAt(0);
    const editorState = store.getEditorState();

    const contentState = editorState.getCurrentContent();

    contentState.mergeEntityData(entityKey, {
      value: texValue,
      inputValue,
    });

    setInvalidTex(false);
    setEditMode(false);
    setTexValue(getValue().value);
    finishEdit(editorState);
  };

  /**
   * Get the LateX content to display depending on
   * the editing state
   *
   * @param {void}
   *
   * @return {string}
   */
  const getTeXContentToDisplay = (): string => {
    let texContent: string = "";

    if (editMode) {
      if (invalidTex) {
        texContent = "";
      } else {
        texContent = texValue;
      }
    } else {
      texContent = getValue().value;
    }

    return texContent;
  };

  /**
   * Render the edit panel section when the edit mode is true
   * or the rendered LateX content otherwise
   *
   * @param {void}
   *
   * @return {JSX.Element}
   */
  const renderEditPanel = (): JSX.Element => {
    if (editMode) {
      return (
        <styles.InputWrapper>
          <EditableMathField
            mathquillDidMount={(mathField) => {
              mathField.focus();
            }}
            latex={inputValue}
            onChange={(mathField) => onValueChange(mathField.latex())}
          />
        </styles.InputWrapper>
      );
    }

    return (
      <KatexOutput
        value={getTeXContentToDisplay()}
        onClick={onClick}
        displayMode={getValue().displayMode}
      />
    );
  };

  useEffect(() => {
    /**
     * Handler for when a keyboard key is pressed
     *
     * @param {KeyboardEvent} ev
     *
     * @return {void}
     */
    const keyPressHandler = (ev: KeyboardEvent): void => {
      // When enter is pressed exit the edit state
      if (ev.keyCode === 13) {
        save();
      }
    };

    keyPressHandlerRef.current = keyPressHandler;
  }, [inputValue]);

  useEffect(() => {
    if (editMode) {
      window.addEventListener("keydown", (ev) =>
        keyPressHandlerRef.current(ev)
      );

      return () => {
        window.removeEventListener("keydown", (ev) =>
          keyPressHandlerRef.current(ev)
        );
      };
    }
  }, [editMode]);

  return (
    <styles.EditorPanelWrapper ref={texBlockRef}>
      {renderEditPanel()}
    </styles.EditorPanelWrapper>
  );
};

export default TexBlock as React.FC<types.TexBlockProps>;
