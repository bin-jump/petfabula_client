import React, { memo } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Text,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Post } from "@petfabula/common";
import { Image, IconCount, AvatarField, milisecToAgo } from "../../shared";

const PostItemNarrow = ({
  post,
  height,
  marginTop,
}: {
  post: Post;
  height: number;
  marginTop: number;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const itemMargin = 3;
  const w = (screenWidth - itemMargin * 4) / 2;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        // flex: 1, // last will expand when odd

        marginTop: marginTop,
        height: height - 8,
        marginVertical: 4,
        width: w,
        borderRadius: 6,
        minHeight: 100,
        backgroundColor: theme.colors?.white,
        marginHorizontal: 3,
        padding: 18,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        justifyContent: "space-between",
      }}
    >
      {post.images.length > 0 ? (
        <Image
          containerStyle={{ borderRadius: 6 }}
          resizeMode="contain"
          // style={{ width: 160, height: 80 }}
          source={{ uri: post.images[0] }}
        />
      ) : null}

      <Text
        ellipsizeMode="tail"
        numberOfLines={post.images.length > 0 ? 3 : 3}
        style={{
          // width: 165,
          fontSize: 18,
          marginBottom: post.images.length > 0 ? 12 : 0,
          //   minWidth: 20,
        }}
      >
        {`${height} ` + post.content}
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 14,
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: 12,
          marginBottom: 6,
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
