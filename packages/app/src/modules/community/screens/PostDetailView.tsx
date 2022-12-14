import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useLoadPostDetail,
  PostDetail,
  useLikePost,
  useUnlikePost,
  useCollectPost,
  useRemovePost,
  useRemoveCollectPost,
  useCurrentUser,
  useFollowUser,
  useUnfollowUser,
  PostTopic,
  resolveTargetNotFoundError,
} from "@petfabula/common";
import {
  ImageGallery,
  milisecToAgo,
  AvatarField,
  ActivityIndicator,
  useRefocusEffect,
  BottomSheet,
  BottomSheetButton,
  AlertAction,
  PendingOverlay,
  useDidUpdateEffect,
  ResourceNotFoundView,
  useLoginIntercept,
  ParsedTextContent,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import PostCommentList from "../components/PostCommentList";
import RelatePetItem from "../components/RelatePetItem";
import { PostDetailSkeleton } from "../components/Skeletons";

const Footer = ({ post }: { post: PostDetail }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { likePost } = useLikePost();
  const { unlikePost } = useUnlikePost();
  const { collectPost } = useCollectPost();
  const { removeCollectPost } = useRemoveCollectPost();
  const { assertLogin } = useLoginIntercept();

  const [collect, setCollect] = useState(post.collected);
  const [like, setLike] = useState(post.liked);

  const collectSharedValue = useSharedValue(0);
  const likeSharedValue = useSharedValue(1);

  const collectStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: collectSharedValue.value + "deg",
        },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: likeSharedValue.value,
        },
      ],
      opacity: (1 / likeSharedValue.value) ** 2,
    };
  });

  const isOthers: boolean =
    currentUser != null && currentUser.id != post.participator.id;

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 24,
        paddingVertical: 8,
        justifyContent: "space-between",
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (!assertLogin()) {
            return;
          }
          navigation.navigate("CreateComment", { postId: post.id });
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors?.grey4,
            marginLeft: 6,
            borderRadius: 20,
            // width: 160,
            paddingLeft: 16,
            flex: 1,
            height: 32,
            marginRight: 12,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: theme.colors?.grey0,
            }}
          >
            {`${t("common.comment")}...`}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          flexDirection: "row",
          width: isOthers ? 120 : 60,
          justifyContent: "space-around",
        }}
      >
        {isOthers ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableWithoutFeedback
              style={{ padding: 6 }}
              onPress={() => {
                if (!assertLogin) {
                  return;
                }

                collectSharedValue.value = withSequence(
                  withTiming(360, {
                    duration: 800,
                    easing: Easing.quad,
                  }),
                  withTiming(0, {
                    duration: 1,
                    easing: Easing.linear,
                  })
                );
                if (!collect) {
                  collectPost(post.id);
                } else {
                  removeCollectPost(post.id);
                }
                setCollect(!collect);
              }}
            >
              <Animated.View style={collectStyle}>
                <Icon
                  color={collect ? theme.colors?.primary : theme.colors?.black}
                  type="antdesign"
                  name={collect ? "star" : "staro"}
                />
              </Animated.View>
            </TouchableWithoutFeedback>

            <Text
              style={{
                color: theme.colors?.black,
                fontSize: 18,
                marginLeft: 6,
              }}
            >
              {post.collectCount}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback
            style={{ padding: 6 }}
            onPress={() => {
              if (!assertLogin()) {
                return;
              }
              likeSharedValue.value = withSequence(
                withTiming(1.5, {
                  duration: 200,
                  easing: Easing.quad,
                }),
                withTiming(1, {
                  duration: 500,
                  easing: Easing.sin,
                })
              );
              if (!like) {
                likePost(post.id);
              } else {
                unlikePost(post.id);
              }
              setLike(!like);
            }}
          >
            <Animated.View style={likeStyle}>
              <Icon
                color={like ? theme.colors?.primary : theme.colors?.black}
                type="antdesign"
                name={like ? "heart" : "hearto"}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <Text
            style={{ color: theme.colors?.black, fontSize: 18, marginLeft: 6 }}
          >
            {post.likeCount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Header = ({
  height,
  post,
  currentPostId,
}: {
  height: number;
  currentPostId: number;
  post: PostDetail | null;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { followUser, pending: followPending } = useFollowUser();
  const { unfollowUser, pending: unfollowPending } = useUnfollowUser();
  const { removePost } = useRemovePost();
  const { assertLogin } = useLoginIntercept();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  return (
    <View
      style={{
        flexDirection: "row",
        height: height,
        backgroundColor: theme.colors?.white,
        alignItems: "center",
        paddingLeft: 12,
      }}
    >
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <Icon
          type="entypo"
          name="chevron-thin-left"
          size={24}
          color={theme.colors?.black}
        />
      </TouchableWithoutFeedback>

      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />

          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row" }}>
              {currentUser?.id == post?.participator.id ? (
                <BottomSheetButton
                  label={t("common.edit")}
                  type="antdesign"
                  name="edit"
                  onPress={() => {
                    navigation.navigate("CreateNew", {
                      screen: "CreatePost",
                      params: { post: post },
                    });
                    bottomSheetModalRef.current?.close();
                  }}
                />
              ) : null}
              {currentUser?.id == post?.participator.id ? (
                <BottomSheetButton
                  label={t("common.delete")}
                  type="antdesign"
                  name="delete"
                  onPress={() => {
                    AlertAction.AlertDelele(t, () => {
                      if (post) {
                        removePost(post.id);
                      }
                    });
                    handleClose();
                  }}
                />
              ) : null}

              {post && currentUser?.id != post?.participator.id ? (
                <BottomSheetButton
                  label={t("common.report")}
                  type="antdesign"
                  name="warning"
                  onPress={() => {
                    bottomSheetModalRef.current?.close();
                    if (!assertLogin()) {
                      return;
                    }

                    navigation.navigate("CreateNew", {
                      screen: "CreateReport",
                      params: { entityId: post.id, entityType: "POST" },
                    });
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </BottomSheet>

      <View style={{ flex: 1 }}>
        {post && post.id == currentPostId ? (
          <AvatarField
            onAvatarClick={() => {
              navigation.push("UserProfile", { id: post.participator.id });
            }}
            nameStyle={{ marginLeft: 8, marginBottom: 6, fontWeight: "bold" }}
            name={post.participator.name}
            photo={post.participator.photo}
            style={{ marginRight: 16, marginLeft: 12 }}
            fieldRightWidth={210}
            fieldRight={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "flex-end",
                  paddingRight: 18,
                }}
              >
                {currentUser && currentUser.id != post.participator.id ? (
                  <Button
                    loading={followPending || unfollowPending}
                    onPress={() => {
                      if (!post.participator.followed) {
                        followUser(post.participator.id);
                      } else {
                        unfollowUser(post.participator.id);
                      }
                    }}
                    title={
                      !post.participator.followed
                        ? t("user.followAction")
                        : t("user.unfollowAction")
                    }
                    titleStyle={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: post.participator.followed
                        ? theme.colors?.black
                        : theme.colors?.white,
                    }}
                    buttonStyle={{
                      height: 40,
                      paddingHorizontal: 12,
                      backgroundColor: post.participator.followed
                        ? theme.colors?.grey4
                        : theme.colors?.primary,
                    }}
                    containerStyle={{ height: 40, width: 126 }}
                    icon={
                      post.participator.followed ? (
                        <Icon
                          type="antdesign"
                          name="check"
                          color={theme.colors?.black}
                          size={16}
                        />
                      ) : undefined
                    }
                  />
                ) : null}

                <Icon
                  containerStyle={{ marginLeft: 8 }}
                  onPress={() => {
                    handlePresentModalPress();
                  }}
                  type="feather"
                  name="more-vertical"
                  color={theme.colors?.black}
                />
              </View>
            )}
          />
        ) : null}
      </View>
    </View>
  );
};

const Comments = ({
  post,
  currentPostId,
}: {
  post: PostDetail;
  currentPostId: number;
}) => {
  return (
    <PostCommentList
      currentPostId={currentPostId}
      commentCount={post.commentCount}
    />
  );
};

const PostDetailView = () => {
  const { loadPostDetail, post, pending, error } = useLoadPostDetail();
  const { theme } = useTheme();
  const { params } = useRoute<RouteProp<ParamTypes, "PostDetailView">>();
  const { id } = params;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { pending: removePending, result } = useRemovePost();

  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const headerHeight = 66;
  const footerHeight = 56 + (bottom * 1) / 2;

  const postDetail = post;

  useRefocusEffect(() => {
    if (id != post?.id) {
      loadPostDetail(id);
    }
  }, [id, post, loadPostDetail]);

  useEffect(() => {
    loadPostDetail(id);
  }, [id, loadPostDetail]);

  useDidUpdateEffect(() => {
    if (result && result.id == id) {
      navigation.goBack();
    }
  }, [result]);

  const notFoundId = resolveTargetNotFoundError(error);

  const renderTopic = (topic: PostTopic | null) => {
    if (!topic) {
      return null;
    }

    return (
      <View
        style={{
          marginVertical: 8,
          backgroundColor: theme.colors?.grey4,
          paddingVertical: 6,
          paddingHorizontal: 8,
          borderRadius: 20,
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          containerStyle={{
            backgroundColor: theme.colors?.secondary,
            padding: 6,
            borderRadius: 12,
          }}
          type="fontisto"
          name="hashtag"
          size={12}
          color={theme.colors?.white}
        />
        <Text
          style={{
            marginLeft: 6,
            fontSize: 16,
            fontWeight: "bold",
            color: theme.colors?.secondary,
          }}
        >
          {topic.title}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{ height: top, backgroundColor: theme.colors?.white }}
      ></View>
      <Header currentPostId={id} height={headerHeight} post={postDetail} />
      <Divider />
      {!pending && notFoundId == id ? <ResourceNotFoundView /> : null}
      <PendingOverlay pending={removePending} />
      {postDetail?.id == id ? (
        <View
          style={{
            paddingBottom: footerHeight,
            flex: 1,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: theme.colors?.white,
              minHeight: screenHeight - top - headerHeight - footerHeight,
            }}
            showsVerticalScrollIndicator={false}
          >
            {postDetail.images.length ? (
              <ImageGallery
                images={postDetail.images}
                containerStyle={{
                  backgroundColor: theme.colors?.white,
                }}
              />
            ) : null}
            <View
              style={{
                backgroundColor: theme.colors?.white,
                paddingHorizontal: 16,
                // paddingTop: postDetail.images.length ? 6 : 6,
                paddingBottom: 18,
              }}
            >
              {postDetail.relatePet ? (
                <RelatePetItem
                  onPress={() => {
                    navigation.push("PetDetailView", {
                      petId: postDetail.relatePetId,
                    });
                  }}
                  pet={postDetail.relatePet}
                />
              ) : null}

              <ParsedTextContent
                selectable={true}
                style={{ fontSize: 16, lineHeight: 26, marginTop: 4 }}
              >
                {postDetail.content}
              </ParsedTextContent>

              <Text
                style={{
                  paddingTop: 16,
                  fontSize: 16,
                  color: theme.colors?.grey1,
                }}
              >
                {milisecToAgo(postDetail.createdDate)}
              </Text>
              {renderTopic(postDetail.postTopic)}
            </View>
            <Comments post={postDetail} currentPostId={id} />
          </ScrollView>
          <View
            style={{
              position: "absolute",
              // marginTop:
              //   screenHeight -
              //   headerHeight -
              //   top -
              //   footerHeight -
              //   (Platform.OS === "ios" ? 0 : 24),
              bottom: 0,
              height: footerHeight,
              width: "100%",
              backgroundColor: theme.colors?.white,
            }}
          >
            <Divider style={{ backgroundColor: theme.colors?.grey3 }} />
            <Footer post={postDetail} />
          </View>
        </View>
      ) : (
        pending && <PostDetailSkeleton />
      )}
      {/* {pending && !(postDetail?.id == id) ? (
       
      ) : null} */}
    </View>
  );
};

export default PostDetailView;
