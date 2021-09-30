import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useCurrentUser,
  PostCommentReply,
  PostComment,
  useLoadPostComment,
  useLoadPostCommentReply,
  useRemovePostComment,
  useRemovePostCommentReply,
} from "@petfabula/common";
import {
  milisecToAgo,
  AvatarField,
  ActivityIndicator,
  BottomSheet,
  AlertAction,
  PendingOverlay,
  useLoginIntercept,
} from "../../shared";

type WithReplyTo = PostCommentReply & { replyToName: string | null };

const ItemBottomSheetContent = ({
  handleRemove,
  content,
}: {
  handleRemove: () => void;
  content: string;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ paddingHorizontal: 24 }}>
      <Text
        style={{
          marginVertical: 12,
          fontSize: 16,
          color: theme.colors?.grey0,
          textAlign: "center",
        }}
      >
        {content}
      </Text>
      <Divider />
      <View style={{ paddingTop: 16 }}>
        <TouchableOpacity onPress={handleRemove}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: theme.colors?.black,
              marginBottom: 12,
            }}
          >
            {t("common.delete")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { removeCommentReply, pending: removePending } =
    useRemovePostCommentReply();
  const { currentUser } = useCurrentUser();
  const { assertLogin } = useLoginIntercept();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

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
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <ItemBottomSheetContent
          content={`${reply.content.substr(0, 30)}...`}
          handleRemove={() => {
            AlertAction.AlertDelele(t, () => {
              removeCommentReply(reply.id);
              handleClose();
            });
          }}
        />
      </BottomSheet>

      <PendingOverlay pending={removePending} />
      <AvatarField
        nameStyle={{
          fontSize: 16,
          // fontWeight: "bold",
          color: theme.colors?.grey1,
          marginBottom: 12,
          marginLeft: 6,
        }}
        photo={reply.participator.photo}
        name={reply.participator.name}
        size={24}
        fieldRight={() => (
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "center",
              width: 36,
            }}
          >
            {currentUser?.id == reply.participator.id ? (
              <Icon
                onPress={() => {
                  handlePresentModalPress();
                }}
                type="feather"
                name="more-vertical"
                color={theme.colors?.grey1}
                size={18}
              />
            ) : null}
          </View>
        )}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          if (!assertLogin()) {
            return;
          }
          navigation.navigate("CreateCommentReply", {
            replyTarget: reply,
            toComment: false,
            commentId: reply.commentId,
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
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { loadCommentReply } = useLoadPostCommentReply();
  const { removeComment, pending: removePending } = useRemovePostComment();
  const { currentUser } = useCurrentUser();
  const { assertLogin } = useLoginIntercept();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

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
                fontSize: 16,
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
  }, [comment, theme]);

  return (
    <View>
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <ItemBottomSheetContent
          content={`${comment.participator.name}: ${comment.content.substr(
            0,
            30
          )}...`}
          handleRemove={() => {
            AlertAction.AlertDelele(t, () => {
              removeComment(comment.id);
              handleClose();
            });
          }}
        />
      </BottomSheet>

      <PendingOverlay pending={removePending} />
      <View style={{ marginTop: 12, marginBottom: 16 }}>
        <AvatarField
          onAvatarClick={() => {
            navigation.push("UserProfile", { id: comment.participator.id });
          }}
          nameStyle={{
            // fontWeight: "bold",
            fontSize: 18,
            color: theme.colors?.grey1,
            marginBottom: 12,
            marginLeft: 8,
          }}
          photo={comment.participator.photo}
          name={comment.participator.name}
          size={36}
          fieldRight={() => (
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "center",
                width: 36,
              }}
            >
              {currentUser?.id == comment.participator.id ? (
                <Icon
                  onPress={() => {
                    handlePresentModalPress();
                  }}
                  type="feather"
                  name="more-vertical"
                  color={theme.colors?.grey1}
                  size={20}
                />
              ) : null}
            </View>
          )}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
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
                  if (!assertLogin()) {
                    return;
                  }

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
                {`  ${milisecToAgo(comment.createdDate)}`}
              </Text>
            </Text>

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
        </View>
      </View>
      {index < totalCount - 1 ? <Divider style={{ marginLeft: 42 }} /> : null}
    </View>
  );
};

const PostCommentList = ({
  currentPostId,
  commentCount,
}: {
  currentPostId: number;
  commentCount: number;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { assertLogin } = useLoginIntercept();

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

  const renderLoadMore = () => {
    if (commentCount == 0) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            if (!assertLogin()) {
              return;
            }
            navigation.navigate("CreateComment", { postId: currentPostId });
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
      );
    }

    return nextCursor ? (
      <View style={{ width: "100%" }}>
        <Button
          onPress={() => {
            loadComment(currentPostId, nextCursor);
          }}
          loadingProps={{ color: theme.colors?.grey1 }}
          type="clear"
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors?.secondary,
          }}
          title={t("common.loadMore")}
          loading={pending}
        />
      </View>
    ) : (
      <View style={{ width: "100%" }}>
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
    );
  };

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
        )} ${commentCount}`}</Text>
      </View>
      {initializing ? (
        <ActivityIndicator color={theme.colors?.grey1} />
      ) : (
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
            {renderLoadMore()}
          </View>
        </View>
      )}
    </View>
  );
};

export default PostCommentList;
