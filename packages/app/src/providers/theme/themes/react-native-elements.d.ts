import { colors } from "react-native-elements";

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };
type OriginColorType = typeof colors;

declare module "react-native-elements" {
  export interface TextProps {
    p1Style: StyleProp<TextStyle>;
  }

  export interface Colors extends OriginColorType {
    background: string;
    border: string;
    text: string;
    altText: string;
    danger: string;
  }

  export interface FullTheme {
    colors: RecursivePartial<Colors>;
    Text: Partial<TextProps>;
  }
}
