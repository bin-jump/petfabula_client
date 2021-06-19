import React, { memo } from "react";
import {
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Post } from "@petfabula/common";
import { IconCount, AvatarField, Image, imageSizeUrl } from "../../shared";

const LINE_HEIGHT = 20;
const INFO_HEIGHT = 70;

export const usePostWidth = () => {
  const { width: screenWidth } = useWindowDimensions();
  const marginHorizontal = 3;
  const marginVertical = 4;
  const width = (screenWidth - marginHorizontal * 4) / 2;

  return {
    marginHorizontal,
    marginVertical,
    width,
  };
};

export const resolvePostImageHeightRatio = (post: Post) => {
  const imgs = post.images;
  // if no image
  if (imgs.length == 0) {
    return 3 / 2;
  }
  const w = imgs[0]?.width || 0;
  const h = imgs[0]?.height || 0;
  const r = (w + 1) / (h + 1);
  if (r >= 4 / 3) {
    return 3 / 2;
  }
  if (r <= 3 / 4) {
    return 10 / 9;
  }

  return 4 / 3;
};

export const resovePostItemHeight = (contentWidth: number, post: Post) => {
  const r = resolvePostImageHeightRatio(post);

  const extra =
    post.images.length > 0 ? INFO_HEIGHT + LINE_HEIGHT * 2 : INFO_HEIGHT;
  return contentWidth / r + extra;
};

const PostItemNarrow = ({
  post,
  height,
  marginTop,
}: {
  post: Post;
  height: number;
  marginTop: number;
}) => {
  // const { width: screenWidth } = useWindowDimensions();
  // const itemMargin = 3;
  // const w = (screenWidth - itemMargin * 4) / 2;

  const { marginHorizontal, marginVertical, width } = usePostWidth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        // flex: 1, // last will expand when odd
        marginTop: marginTop,
        height: height - 8,
        marginVertical: marginVertical,
        width: width,
        borderRadius: 6,
        // minHeight: 100,
        backgroundColor: theme.colors?.white,
        marginHorizontal: marginHorizontal,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        justifyContent: "space-between",
      }}
    >
      <View>
        {post.images.length > 0 ? (
          <Image
            containerStyle={{
              paddingHorizontal: 2,
              borderRadius: 6,
            }}
            resizeMode="cover"
            style={{
              borderRadius: 6,
              width: width,
              height: width / resolvePostImageHeightRatio(post) - 2,
            }}
            source={{ uri: imageSizeUrl(post.images[0]?.url, "MD") }}
          />
        ) : null}

        <Text
          ellipsizeMode="tail"
          numberOfLines={
            post.images.length > 0
              ? 2
              : Math.round(
                  width / resolvePostImageHeightRatio(post) / LINE_HEIGHT
                ) - 1
          }
          style={{
            fontWeight: "bold",
            fontSize: 16,
            lineHeight: LINE_HEIGHT,
            marginTop: post.images.length > 0 ? 8 : 12,
            marginBottom: 8,
            paddingHorizontal: 8,
            width: width,
          }}
        >
          {post.content}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 6,
          marginBottom: 16,
        }}
      >
        <AvatarField
          //   containerStyle={{ width: 100 }}
          small
          name={post.participator.name}
          photo={post.participator.photo}
          size={26}
        />

        <IconCount
          type="font-awesome"
          name="commenting"
          count={post.commentCount}
          size={22}
        />
      </View>
    </View>
  );
};

export default memo(PostItemNarrow);
