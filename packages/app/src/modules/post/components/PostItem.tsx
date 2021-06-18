import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { useTheme, Icon, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Post } from "@petfabula/common";
import { Image, IconCount, AvatarField, milisecToAgo } from "../../shared";

const PostItemFull = ({ post }: { post: Post }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        // borderRadius: 6,
        minHeight: 160,
        backgroundColor: theme.colors?.white,
        marginTop: 12,
        // marginHorizontal: 12,
        padding: 18,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
      }}
    >
      <AvatarField
        style={{ marginBottom: 12 }}
        name={post.participator.name}
        photo={post.participator.photo}
        subContent={milisecToAgo(post.createdDate)}
      />
      <Text
        ellipsizeMode="tail"
        numberOfLines={post.images.length > 0 ? 3 : 9}
        style={{ fontSize: 18, marginBottom: post.images.length > 0 ? 12 : 0 }}
      >
        {post.content}
      </Text>
      {post.images.length > 0 ? (
        <Image
          containerStyle={{ width: "100%", borderRadius: 6 }}
          resizeMode="cover"
          style={{ height: 200 }}
          source={{ uri: post.images[0] }}
        />
      ) : null}

      <View
        style={{
          flexDirection: "row",
          marginTop: 14,
          justifyContent: "flex-end",
          alignItems: "center",
          marginRight: 12,
          marginBottom: 6,
        }}
      >
        <IconCount
          type="antdesign"
          name="eye"
          count={post.likeCount}
          size={22}
          style={{ marginRight: 26 }}
        />
        <IconCount
          type="entypo"
          name="thumbs-up"
          count={post.likeCount}
          size={22}
          style={{ marginRight: 26 }}
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

export default PostItemFull;
