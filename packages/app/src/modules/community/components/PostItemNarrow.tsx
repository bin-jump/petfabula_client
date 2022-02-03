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
import { IconCount, AvatarField, Image } from "../../shared";

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
    return 4 / 3;
  }
  const w = imgs[0]?.width || 0;
  const h = imgs[0]?.height || 0;
  const r = (w + 1) / (h + 1);
  if (r >= 1.3) {
    return 4 / 3;
  }
  if (r <= 0.77) {
    return 3 / 4;
  }

  return 1;
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
  if (!post) {
    return <View style={{ height: 20, width: 100 }} />;
  }

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
      <TouchableWithoutFeedback
        onPress={() => {
          // navigation.navigate("PostDetailView", { id: post.id });

          navigation.navigate("SecondaryStack", {
            screen: "PostDetailView",
            params: {
              id: post.id,
            },
          });
        }}
      >
        <View>
          <View>
            {post.images.length > 0 ? (
              <Image
                style={{
                  paddingHorizontal: 2,
                  borderRadius: 6,
                  width: width,
                  height: width / resolvePostImageHeightRatio(post) - 2,
                }}
                uri={post.images[0].url}
                sz="MD"
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
              nameStyle={{ marginLeft: 3 }}
              small
              name={post.participator.name}
              photo={post.participator.photo}
              size={26}
              fieldRightWidth={width + 30}
            />

            <IconCount
              type="antdesign"
              name="hearto"
              count={post.likeCount}
              size={22}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(PostItemNarrow);
