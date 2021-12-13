import React, { useCallback } from "react";
import { Linking, ViewProps } from "react-native";
import ParsedText, { ParsedTextProps } from "react-native-parsed-text";

type Props = {
  children: string;
};

const ParsedTextContent = (props: Props & ParsedTextProps) => {
  const { children, ...restProps } = props;

  const handleUrlClick = useCallback(async (url: string) => {
    await Linking.openURL(url);
  }, []);

  return (
    <ParsedText
      parse={[
        {
          type: "url",
          style: { color: "#1b90fa", textDecorationLine: "underline" },
          onPress: handleUrlClick,
        },
      ]}
      {...restProps}
    >
      {children}
    </ParsedText>
  );
};

export default ParsedTextContent;
