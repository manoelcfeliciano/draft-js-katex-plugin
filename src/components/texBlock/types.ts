import * as textTypes from "../../types";

export type FC = textTypes.FC<TexBlockProps>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TexBlockProps {
  // empty
}

export type BlockEntityData = {
  /**
   * The processed LateX value
   */
  value: string;

  /**
   * The unprocessed LateX value (raw from the input)
   */
  inputValue: string;

  /**
   * Whether it should display the block or not
   */
  displayMode: boolean;
};
