import * as textTypes from "../../types";

export interface IKatexOutputProps {
  /**
   * The LateX string to be rendered
   */
  value: string;

  /**
   * Whether it should be displayed or not
   *
   * @default true
   */
  displayMode: boolean;

  /**
   * The action to take when the LateX string is clicked
   */
  onClick: VoidFunction;
}

export type FC = textTypes.FC<IKatexOutputProps>;
