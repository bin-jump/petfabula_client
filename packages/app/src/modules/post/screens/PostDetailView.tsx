import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useTheme, Text, Icon, Divider, Button } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useLoadPostDetail } from "@petfabula/common";
import { ImageGallery, AvatarField, milisecToAgo } from "../../shared";
import ParamTypes from "./ParamTypes";

const PostDetailView = () => {
  const { loadPostDetail, post, pending, error } = useLoadPostDetail();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "PostDetailView">>();
  const { id } = params;
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    loadPostDetail(id);
  }, []);

  return (
    <View style={{ backgroundColor: theme.colors?.white }}>
      <View
        style={{ height: top, backgroundColor: theme.colors?.white }}
      ></View>
      <View
        style={{
          flexDirection: "row",
          height: 66,
          backgroundColor: theme.colors?.white,
          alignItems: "center",
          paddingLeft: 16,
        }}
      >
        <Icon
          type="entypo"
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={24}
          color={theme.colors?.black}
        />
        {post ? (
          <AvatarField
            name={post.participator.name}
            style={{ marginRight: 20, marginLeft: 12 }}
            subContent={milisecToAgo(post.createdDate)}
            actionComp={() => (
              <Button
                title={t("post.followed.tabLabel")}
                titleStyle={{ fontSize: 18, fontWeight: "bold" }}
                buttonStyle={{ height: 40, paddingHorizontal: 12 }}
                containerStyle={{ height: 40 }}
              />
            )}
          />
        ) : null}
      </View>
      {post ? (
        <View>
          <Divider style={{ backgroundColor: theme.colors?.grey3 }} />
          <ImageGallery
            images={post.images}
            containerStyle={{ backgroundColor: theme.colors?.white }}
          />
        </View>
      ) : (
        <ActivityIndicator color={theme.colors?.grey0} />
      )}
    </View>
  );
};

export default PostDetailView;
