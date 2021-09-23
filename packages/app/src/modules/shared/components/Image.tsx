import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  ImageStyle,
  Image as RNImage,
} from "react-native";
import { Image as CacheImage, ImageProps } from "./imagecache";
import { emptyImage } from "../../../constants";

type Size = "LG" | "MD" | "SM";

const sizedUri = (uri: string, sz?: Size) => {
  if (!sz || uri.length <= 3) {
    return uri;
  }
  if (uri.charAt(uri.length - 3) == "!") {
    return uri;
  }

  return `${uri}!${sz.toLowerCase()}`;
};

export type Props = Omit<ImageProps, "uri" | "onError"> & {
  uri: string;
  sz?: Size;
  animated?: boolean;
  animatedStyle?: StyleProp<ImageStyle>;
};

const Image = (props: Props) => {
  const { uri, sz } = props;
  const sizeUri = sizedUri(uri, sz);

  return (
    <CacheImage
      //source={{ uri: image }}
      onError={(e) => {
        console.log("[CacheImage onError]", e);
      }}
      {...props}
      // defaultSource={{ uri: RNImage.resolveAssetSource(emptyImage).uri }}
      transitionDuration={500}
      uri={sizeUri}
      // PlaceholderContent={<ActivityIndicator />}
    />
  );
};

export default Image;
