import React, { Children } from "react";
import insertTeXBlock from "../../modifiers/insertTeXBlock";

const InsertKatexButton: React.FC<any> = (props) => {
  const content = Children.count(props.children)
    ? props.children
    : props.defaultContent;

  /**
   * Update the editor state with the initial teX value
   *
   * @param {void}
   *
   * @return {void}
   */
  const onClick = (): void => {
    const editorState = props.store.getEditorState();
    props.store.setEditorState(
      insertTeXBlock(editorState, props.translator, props.initialValue)
    );
  };

  return (
    <button onClick={onClick} type="button">
      {content}
    </button>
  );
};

InsertKatexButton.defaultProps = {
  initialValue: null,
  tex: null,
  theme: null,
  children: null,
};

export default InsertKatexButton;
