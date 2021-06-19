import React from "react";
import { ActivityIndicator } from "react-native";
import { Image as RNEImage, ImageProps } from "react-native-elements";

const Image = (props: ImageProps & { sz?: "LG" | "MD" | "SM" }) => {
  return (
    <RNEImage
      //source={{ uri: image }}
      {...props}
      PlaceholderContent={<ActivityIndicator />}
    />
  );
};

export default Image;
