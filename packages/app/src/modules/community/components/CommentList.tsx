import React, { useCallback, useRef, useMemo } from "react";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated, {
  interpolate,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { useCurrentUser, Participator } from "@petfabula/common";
import { milisecToAgo, AvatarField, ActivityIndicator } from "../../shared";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 12,
    opacity: interpolate(animatedIndex.value, [0, 1], [0.3, 0.9]),
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#ffffff"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

type ReplyItemBase = {
  id: number;
  content: string;
  createdDate: number;
  participator: Participator;
  replyToId: number | null;
};

type CommentItemBase = {
  id: number;
  content: string;
  createdDate: number;
  participator: Participator;
  replyCount: number;
  replyCursor: object | null;
  replies: ReplyItemBase[];
  loadingReply: boolean;
};

type WithReplyTo = ReplyItemBase & { replyToName: string | null };

const ReplyItem = ({
  reply,
  index,
  totalCount,
  onReplyContentClick,
}: {
  reply: WithReplyTo;
  index: number;
  totalCount: number;
  onReplyContentClick: (reply: ReplyItemBase) => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  //   const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  //   const snapPoints = useMemo(() => [160], []);
  //   const handlePresentModalPress = useCallback(() => {
  //     bottomSheetModalRef.current?.present();
  //   }, []);

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
        photo={reply.participator.photo}
        name={reply.participator.name}
        size={24}
        // fieldRight={() => (
        //   <View
        //     style={{
        //       justifyContent: "flex-end",
        //       alignItems: "center",
        //       width: 36,
        //     }}
        //   >
        //     <Icon
        //       onPress={() => {
        //         handlePresentModalPress();
        //       }}
        //       type="aaterialicons"
        //       name="expand-more"
        //       color={theme.colors?.black}
        //       size={18}
        //     />
        //   </View>
        // )}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          onReplyContentClick(reply);
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

const formatReplies = (replies: ReplyItemBase[]): WithReplyTo[] => {
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
  onCommentContentClick,
  onReplyContentClick,
  loadReply,
}: {
  comment: CommentItemBase;
  index: number;
  totalCount: number;
  onCommentContentClick: (comment: CommentItemBase) => void;
  onReplyContentClick: (reply: ReplyItemBase) => void;
  loadReply: (id: number, cursor: object | null) => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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
                loadReply(comment.id, null);
              } else {
                loadReply(comment.id, comment.replyCursor);
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
      <BottomSheetModal
        backdropComponent={BottomSheetBackdrop}
        ref={bottomSheetModalRef}
        backgroundComponent={CustomBackground}
        // index={1}
        snapPoints={snapPoints}
        style={{
          shadowColor: theme.colors?.grey1,
          shadowOffset: { width: 2, height: 1 },
          shadowOpacity: 0.8,
          elevation: 2,
        }}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Text
            style={{
              marginVertical: 12,
              fontSize: 16,
              color: theme.colors?.grey0,
              textAlign: "center",
            }}
          >{`${comment.participator.name}: ${comment.content.substr(
            0,
            30
          )}...`}</Text>
          <Divider />
          <View style={{ paddingTop: 16 }}>
            <TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => {
                bottomSheetModalRef.current?.close();
              }}
              style={{
                marginTop: 12,
                backgroundColor: theme.colors?.grey4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  color: theme.colors?.black,
                  paddingVertical: 14,
                }}
              >
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>

      <View style={{ marginTop: 12, marginBottom: 16 }}>
        <AvatarField
          onAvatarClick={() => {
            navigation.navigate("UserProfile", { id: comment.participator.id });
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
                  onCommentContentClick(comment);
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
                onReplyContentClick={onReplyContentClick}
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
            <Icon
              onPress={() => {
                handlePresentModalPress();
              }}
              type="feather"
              name="more-vertical"
              color={theme.colors?.black}
              size={20}
            />
          </View>
        </View>
      </View>
      {index < totalCount - 1 ? <Divider style={{ marginLeft: 42 }} /> : null}
    </View>
  );
};

const CommentList = ({
  commentCount,
  comments,
  initializing,
  nextCursor,
  pending,
  onReplyContentClick,
  onCommentContentClick,
  loadReply,
  createComment,
  loadMore,
}: {
  commentCount: number;
  comments: CommentItemBase[];
  initializing: boolean;
  nextCursor: object | null;
  pending: boolean;
  onReplyContentClick: (reply: ReplyItemBase) => void;
  onCommentContentClick: (comment: CommentItemBase) => void;
  loadReply: (id: number, cursor: object | null) => void;
  createComment: () => void;
  loadMore: () => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const renderLoadMore = () => {
    if (commentCount == 0) {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            createComment();
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
            loadMore();
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
              onCommentContentClick={onCommentContentClick}
              onReplyContentClick={onReplyContentClick}
              loadReply={loadReply}
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

export default CommentList;
