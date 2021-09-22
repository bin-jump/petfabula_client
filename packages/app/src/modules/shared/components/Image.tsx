import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  ImageStyle,
  Image as RNImage,
} from "react-native";
import { Image as CacheImage, ImageProps } from "./imagecache";
import { emptyImage } from "../../../constants";

export type Props = Omit<ImageProps, "uri" | "onError"> & {
  uri: string;
  sz?: "LG" | "MD" | "SM";
  animated?: boolean;
  animatedStyle?: StyleProp<ImageStyle>;
};

const Image = (props: Props) => {
  const { uri } = props;

  return (
    <CacheImage
      //source={{ uri: image }}
      onError={(e) => {
        console.log("[CacheImage onError]", e);
      }}
      {...props}
      // defaultSource={{ uri: RNImage.resolveAssetSource(emptyImage).uri }}
      transitionDuration={500}
      // PlaceholderContent={<ActivityIndicator />}
    />
  );
};

export default Image;
