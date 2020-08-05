import DraftEditor, { PluginFunctions } from "draft-js-plugins-editor";
import katex from "katex";
import { DraftEditorCommand, EditorState, ContentBlock } from "draft-js";
import PluginEditor from "draft-js-plugins-editor";

export interface IKatexPluginConfig {
  theme?: Record<string, string>;
  insertContent?: string;
  doneContent?: {
    valid?: string;
    invalid?: string;
  };
  translator?: () => string;
  removeContent?: string;
  draftRef?: React.MutableRefObject<DraftEditor>;
  MathInput?: JSX.Element;
}

export type Katex = typeof katex & { __parse: (input: string) => string };

export type PossibleEditorCommands =
  | "insert-texblock"
  | "insert-inlinetex"
  | DraftEditorCommand;

export type ExtendedPluginFunctions = {
  texToUpdate: { key: string; dir: string };
} & PluginFunctions;

export interface IBlockPropsDeclarations {
  katex: {
    onStartEdit: (blockKey: string) => void;
    onFinishEdit: (blockKey: string, nextState: EditorState) => void;
    onRemove: (blockKey: string) => void;
  };
}

export interface IBlockContext<
  BlockPropsKey extends keyof IBlockPropsDeclarations = "katex"
> {
  draftRef: React.MutableRefObject<PluginEditor>;
  block: ContentBlock;
  blockProps: IBlockPropsDeclarations[BlockPropsKey];
  store: ExtendedPluginFunctions;
}

export type FC<
  Props = {},
  BlockPropsKey extends keyof IBlockPropsDeclarations = "katex"
> = React.FC<Props & IBlockContext<BlockPropsKey>>;
