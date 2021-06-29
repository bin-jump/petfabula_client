import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Platform,
  Modal,
} from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  useLoadPostDetail,
  PostDetail,
  useLikePost,
  useUnlikePost,
  useCollectPost,
  useRemoveCollectPost,
  useCurrentUser,
  useFollowUser,
  useUnfollowUser,
  useLoadPostComment,
  useLoadPostCommentReply,
  PostComment,
  PostCommentReply,
} from "@petfabula/common";
import { ImageGallery, milisecToAgo, AvatarField } from "../../shared";
import ParamTypes from "./ParamTypes";

const Footer = ({ post }: { post: PostDetail }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { likePost } = useLikePost();
  const { unlikePost } = useUnlikePost();
  const { collectPost } = useCollectPost();
  const { removeCollectPost } = useRemoveCollectPost();

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
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { followUser, pending: followPending } = useFollowUser();
  const { unfollowUser, pending: unfollowPending } = useUnfollowUser();

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

      {post && post.id == currentPostId ? (
        <AvatarField
          nameStyle={{ marginLeft: 8, marginBottom: 6, fontWeight: "bold" }}
          name={post.participator.name}
          photo={post.participator.photo}
          style={{ marginRight: 16, marginLeft: 12 }}
          fieldRight={() => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                type="feather"
                name="more-vertical"
                color={theme.colors?.black}
              />
            </View>
          )}
        />
      ) : null}
    </View>
  );
};

type WithReplyTo = PostCommentReply & { replyToName: string | null };

const ReplyItem = ({
  reply,
  index,
  totalCount,
}: {
  reply: WithReplyTo;
  index: number;
  totalCount: number;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const replyTargetComponent = () => {
    if (reply.replyToId == null) {
      return null;
    }
    if (reply.replyToName) {
      return (
        <Text>
          <Text
            style={{
              fontSize: 16,
            }}
          >{`${t("common.reply")} `}</Text>
          <Text
            style={{
              color: theme.colors?.grey0,
              fontSize: 16,
            }}
          >{`@${reply.replyToName}: `}</Text>
        </Text>
      );
    }

    return (
      <Text>
        <Text
          style={{
            fontSize: 16,
          }}
        >{` ${t("common.reply")}`}</Text>
        <Text
          style={{
            color: theme.colors?.grey0,
            textDecorationLine: "line-through",
            fontSize: 16,
          }}
        >{`@${t("common.deleted")}: `}</Text>
      </Text>
    );
  };

  return (
    <View style={{ marginTop: 12 }}>
      <AvatarField
        nameStyle={{
          fontSize: 16,
          // fontWeight: "bold",
          color: theme.colors?.grey1,
          marginBottom: 12,
          marginLeft: 6,
        }}
        // subContent={}
        photo={reply.participator.photo}
        name={reply.participator.name}
        size={24}
        // fieldRight={() => (
        //   <Text
        //     style={{
        //       color: theme.colors?.grey1,
        //       marginBottom: 12,
        //       fontSize: 14,
        //       marginRight: 12,
        //     }}
        //   >
        //     {milisecToAgo(reply.createdDate)}
        //   </Text>
        // )}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("CreateCommentReply", {
            replyTarget: reply,
            toComment: false,
            commentId: reply.postCommentId,
          });
        }}
      >
        <Text style={{ marginTop: -6, marginLeft: 30 }}>
          {replyTargetComponent()}
          <Text style={{ fontSize: 16, lineHeight: 20 }}>{reply.content}</Text>

          <Text
            style={{
              color: theme.colors?.grey1,
              marginBottom: 12,
              fontSize: 14,
              marginRight: 12,
            }}
          >
            {`  ` + milisecToAgo(reply.createdDate)}
          </Text>
        </Text>
      </TouchableWithoutFeedback>
      {/* <Text
        style={{
          color: theme.colors?.grey1,
          marginTop: 6,
          fontSize: 14,
          marginLeft: 30,
        }}
      >
        {milisecToAgo(reply.createdDate)}
      </Text> */}
    </View>
  );
};

const formatReplies = (replies: PostCommentReply[]): WithReplyTo[] => {
  const mp: { [key: number]: string } = {};
  replies.forEach((item) => {
    mp[item.id] = item.participator.name;
  });

  return replies.map((item) => {
    if (item.replyToId && mp[item.replyToId]) {
      return { ...item, replyToName: mp[item.replyToId] };
    }
    return { ...item, replyToName: null };
  });
};

const CommentItem = ({
  comment,
  index,
  totalCount,
}: {
  comment: PostComment;
  index: number;
  totalCount: number;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { loadCommentReply } = useLoadPostCommentReply();

  const renderLoadMore = useCallback(() => {
    if (
      comment.replyCount == 0 ||
      comment.replyCount == comment.replies.length
    ) {
      return null;
    }
    return (
      <View
        style={{
          alignItems: "flex-start",
          marginTop: 8,
          marginLeft: comment.replyCursor ? 30 : 3,
        }}
      >
        {comment.loadingReply ? (
          <ActivityIndicator color={theme.colors?.grey1} />
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              if (!comment.replyCursor) {
                loadCommentReply(comment.id, null);
              } else {
                loadCommentReply(comment.id, comment.replyCursor);
              }
            }}
          >
            <Text
              style={{
                color: theme.colors?.secondary,
                fontSize: comment.replyCursor ? 16 : 18,
                fontWeight: "bold",
              }}
            >
              {!comment.replyCursor
                ? `${comment.replyCount}${t("common.checkReplyByCount")}`
                : `${t("common.loadMore")}`}
            </Text>
          </TouchableWithoutFeedback>
        )}
      </View>
    );

    // return (
    //   <Text
    //     style={{
    //       marginTop: 8,
    //       color: theme.colors?.secondary,
    //       fontSize: 16,
    //       fontWeight: "bold",
    //     }}
    //   >{`${t("common.loadMore")}`}</Text>
    // );
  }, [comment, theme]);

  return (
    <View>
      <View style={{ marginTop: 12, marginBottom: 16 }}>
        <AvatarField
          nameStyle={{
            // fontWeight: "bold",
            fontSize: 18,
            color: theme.colors?.grey1,
            marginBottom: 12,
            marginLeft: 8,
          }}
          // subContent={}
          photo={comment.participator.photo}
          name={comment.participator.name}
          size={36}
          // fieldRight={() => (
          //   <Text
          //     style={{
          //       color: theme.colors?.grey1,
          //       marginBottom: 12,
          //       fontSize: 16,
          //     }}
          //   >
          //     {milisecToAgo(comment.createdDate)}
          //   </Text>
          // )}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flex: 1,
              marginLeft: 40,
              marginTop: -6,
            }}
          >
            <Text>
              <Text
                onPress={() => {
                  navigation.navigate("CreateCommentReply", {
                    replyTarget: comment,
                    toComment: true,
                    commentId: comment.id,
                  });
                }}
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                }}
              >
                {comment.content}
              </Text>
              <Text
                style={{
                  color: theme.colors?.grey1,
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                {`  ` + milisecToAgo(comment.createdDate)}
              </Text>
            </Text>
            {/* <Text
              style={{
                marginTop: 6,
                color: theme.colors?.grey1,
                fontSize: 14,
              }}
            >
              {milisecToAgo(comment.createdDate)}
            </Text> */}
            {formatReplies(comment.replies).map((item, index) => (
              <ReplyItem
                key={item.id}
                reply={item}
                index={index}
                totalCount={comment.replyCount}
              />
            ))}
            {renderLoadMore()}
          </View>

          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              width: 36,
            }}
          >
            {/* <Icon
              type="font-awesome"
              name="comment-o"
              color={theme.colors?.grey1}
              size={24}
            /> */}
          </View>
        </View>
      </View>
      {index < totalCount - 1 ? <Divider style={{ marginLeft: 42 }} /> : null}
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
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const {
    initializing,
    comments,
    loadComment,
    nextCursor,
    pending,
    postId: commentPostId,
  } = useLoadPostComment();

  useEffect(() => {
    loadComment(currentPostId, null);
  }, [currentPostId]);

  return (
    <View
      style={{
        width: "100%",
        minHeight: 120,
        backgroundColor: theme.colors?.white,
        paddingHorizontal: 12,
        paddingBottom: 16,
      }}
    >
      <Divider />
      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 16, color: theme.colors?.grey0 }}>{`${t(
          "common.commentCount"
        )} ${post.commentCount}`}</Text>
      </View>
      {initializing ? <ActivityIndicator color={theme.colors?.grey1} /> : null}
      {commentPostId == currentPostId ? (
        <View>
          {comments.map((item, index) => (
            <CommentItem
              key={item.id}
              comment={item}
              index={index}
              totalCount={comments.length}
            />
          ))}

          <View
            style={{
              alignItems: "center",
            }}
          >
            {nextCursor ? (
              <View style={{ width: "100%" }}>
                {/* <Divider /> */}
                <Button
                  onPress={() => {
                    loadComment(currentPostId, nextCursor);
                  }}
                  loadingProps={{ color: theme.colors?.grey1 }}
                  type="clear"
                  titleStyle={{ fontSize: 18, fontWeight: "bold" }}
                  title={t("common.loadMore")}
                  loading={pending}
                />
              </View>
            ) : post.commentCount > 0 ? (
              <View style={{ width: "100%" }}>
                {/* <Divider /> */}
                <Text
                  style={{
                    fontSize: 16,
                    color: theme.colors?.grey1,
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  {`- ${t("common.end")} -`}
                </Text>
              </View>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("CreateComment", { postId: post.id });
                }}
              >
                <View style={{ marginBottom: 12 }}>
                  <Icon
                    type="font-awesome"
                    name="comments-o"
                    size={40}
                    color={theme.colors?.grey2}
                  />

                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: theme.colors?.grey1,
                    }}
                  >
                    {`${t("common.clickToComment")}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const PostDetailView = () => {
  const { loadPostDetail, post, pending, error } = useLoadPostDetail();
  const { theme } = useTheme();
  const { params } = useRoute<RouteProp<ParamTypes, "PostDetailView">>();
  const { id } = params;
  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const headerHeight = 66;
  const footerHeight = 72;
  const extraTopMargin = Platform.OS == "android" ? -20 : 0;

  useEffect(() => {
    loadPostDetail(id);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ height: top, backgroundColor: theme.colors?.white }}
      ></View>
      <Header currentPostId={id} height={headerHeight} post={post} />
      <Divider />
      {post && post.id == id ? (
        <View
          style={{
            paddingBottom: top + footerHeight + headerHeight,
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
            {post.images.length ? (
              <ImageGallery
                images={post.images}
                containerStyle={{
                  backgroundColor: theme.colors?.white,
                }}
              />
            ) : null}
            <View
              style={{
                backgroundColor: theme.colors?.white,
                paddingHorizontal: 16,
                paddingTop: post.images.length ? 6 : 16,
                paddingBottom: 18,
              }}
            >
              <Text style={{ fontSize: 17, lineHeight: 26 }}>
                {post.content}
              </Text>

              <Text
                style={{
                  paddingTop: 16,
                  fontSize: 16,
                  color: theme.colors?.grey1,
                }}
              >
                {milisecToAgo(post.createdDate)}
              </Text>
            </View>

            <Comments post={post} currentPostId={id} />
          </ScrollView>
          <View
            style={{
              position: "absolute",
              marginTop:
                screenHeight -
                headerHeight -
                top -
                footerHeight -
                extraTopMargin,
              height: footerHeight,
              width: "100%",
              backgroundColor: theme.colors?.white,
            }}
          >
            <Divider style={{ backgroundColor: theme.colors?.grey3 }} />
            <Footer post={post} />
          </View>
        </View>
      ) : (
        <ActivityIndicator color={theme.colors?.grey0} />
      )}
    </View>
  );
};

export default PostDetailView;
