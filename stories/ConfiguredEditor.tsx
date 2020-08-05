// Global Imports
import React, { Component } from "react";
import asciimath2latex from "asciimath-to-latex";
import { EditorState } from "draft-js";
import Editor from "draft-js-plugins-editor";

// Local Imports
import createKaTeXPlugin from "../src/index";
import "../src/styles.css";

const configuredEditor = (props: any) => {
  const kaTeXPlugin = createKaTeXPlugin({
    // the configs here are mainly to show you that it is possible. Feel free to use w/o config
    doneContent: { valid: "Close", invalid: "Invalid syntax" },
    removeContent: "Remove",
    translator: props.withAsciimath ? asciimath2latex : null,
  });

  const plugins = [kaTeXPlugin];

  const baseEditorProps = Object.assign({
    plugins,
  });

  return { baseEditorProps };
};

export default class ConfiguredEditor extends Component<any, any> {
  static propTypes = {};
  baseEditorProps: any;
  editor: any;

  constructor(props) {
    super(props);
    const { baseEditorProps } = configuredEditor(props);
    this.baseEditorProps = baseEditorProps;
    this.state = { editorState: EditorState.createEmpty() };
  }

  componentDidMount() {
    this.focus();
  }

  // use this when triggering a button that only changes editorstate
  onEditorStateChange = (editorState: EditorState) => {
    this.setState(() => ({ editorState }));
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <h1>DraftJS KaTeX Plugin</h1>
        <Editor
          plugins={this.baseEditorProps.plugins}
          ref={(element) => (this.editor = element)}
          editorState={this.state.editorState}
          onChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}
