import React, { useRef, useCallback, useState, useMemo } from "react";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  Answer,
  AnswerComment,
  QuestionDetail,
  useCurrentUser,
  useLoadQuestionAnswers,
  useLoadAnswerComments,
  useRemoveAnswer,
  useRemoveAnswerComment,
  useUpvoteAnswer,
  useUnvoteAnswer,
} from "@petfabula/common";
import {
  milisecToAgo,
  AvatarField,
  ActivityIndicator,
  OverlayImage,
  BottomSheet,
  BottomSheetButton,
  useFirstFocusEffect,
  AlertAction,
  PendingOverlay,
} from "../../shared";

type WithReplyTo = AnswerComment & { replyToName: string | null };

const formatComments = (replies: AnswerComment[]): WithReplyTo[] => {
  const mp: { [key: number]: string } = {};
  replies.forEach((item) => {
    mp[item.id] = item.participator.name;
  });

  return replies.map((item) => {
    if (item.replyTo && mp[item.replyTo]) {
      return { ...item, replyToName: mp[item.replyTo] };
    }
    return { ...item, replyToName: null };
  });
};

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

const CommentItem = ({
  answerComment,
  answer,
}: {
  answerComment: WithReplyTo;
  answer: Answer;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { t } = useTranslation();
  const { removeAnswerComment } = useRemoveAnswerComment();
  const { currentUser } = useCurrentUser();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  const replyTargetComponent = () => {
    if (answerComment.replyTo == null) {
      return null;
    }
    if (answerComment.replyToName) {
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
          >{`@${answerComment.replyToName}: `}</Text>
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
    <View style={{ marginVertical: 10 }}>
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <ItemBottomSheetContent
          content={`${answerComment.content.substr(0, 30)}...`}
          handleRemove={() => {
            AlertAction.AlertDelele(t, () => {
              removeAnswerComment(answerComment.id);
              handleClose();
            });
          }}
        />
      </BottomSheet>

      <AvatarField
        onAvatarClick={() => {
          navigation.push("UserProfile", {
            id: answerComment.participator.id,
          });
        }}
        name={answerComment.participator.name}
        size={24}
        nameStyle={{
          fontSize: 16,
          marginLeft: 3,
          fontWeight: "bold",
          color: theme.colors?.grey0,
        }}
        fieldRight={() =>
          currentUser ? (
            <Icon
              size={18}
              containerStyle={{ marginLeft: 8 }}
              onPress={() => {
                handlePresentModalPress();
              }}
              type="feather"
              name="more-vertical"
              color={theme.colors?.grey1}
            />
          ) : null
        }
      />
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("CreateAnswerComment", {
            answer: answer,
            replyTarget: answerComment,
          });
        }}
      >
        <Text style={{ marginLeft: 26 }}>
          {replyTargetComponent()}
          <Text>{answerComment.content}</Text>
          <Text style={{ fontSize: 14, color: theme.colors?.grey1 }}>
            {`  ${milisecToAgo(answerComment.createdDate)}`}
          </Text>
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const LINE_THRESHOLD = 6;

const AnswerItem = ({
  answer,
  question,
}: {
  answer: Answer;
  question: QuestionDetail;
}) => {
  const [showFull, setShowFull] = useState({ full: true, set: false });
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { loadAnswerComments } = useLoadAnswerComments();
  const { upvoteAnswer } = useUpvoteAnswer();
  const { unvoteAnswer } = useUnvoteAnswer();
  const { removeAnswer } = useRemoveAnswer();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  const [upvoted, setUpvoted] = useState({
    upvoted: answer.upvoted,
    count: answer.upvoteCount,
  });

  const voteSharedValue = useSharedValue(1);
  const voteStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: voteSharedValue.value,
        },
      ],
    };
  });

  const onTextLayout = useCallback(
    (e) => {
      if (!showFull.set) {
        setShowFull({
          full: e.nativeEvent.lines.length <= LINE_THRESHOLD,
          set: true,
        });
      }
    },
    [showFull]
  );

  const showFullAnswer = useCallback(() => {
    setShowFull({ ...showFull, full: true });
  }, [showFull]);

  const renderLoadMore = useCallback(() => {
    if (
      answer.commentCount == 0 ||
      answer.commentCount == answer.comments.length
    ) {
      return null;
    }
    return (
      <View
        style={{
          alignItems: "flex-start",
          marginTop: 3,
          marginLeft: answer.commentCursor ? 30 : 3,
        }}
      >
        {answer.loadCommentPending ? (
          <ActivityIndicator color={theme.colors?.grey1} />
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              loadAnswerComments(answer.id, answer.commentCursor);
            }}
          >
            <Text
              style={{
                color: theme.colors?.secondary,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {!answer.commentCursor
                ? `${answer.commentCount}${t("common.checkReplyByCount")}`
                : `${t("common.loadMore")}`}
            </Text>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }, [answer, theme]);

  return (
    <View
      style={{
        marginBottom: 12,
        backgroundColor: theme.colors?.white,
        padding: 16,
        paddingBottom: 20,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        elevation: 1,
      }}
    >
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />
          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row" }}>
              <BottomSheetButton
                label={t("common.edit")}
                type="antdesign"
                name="edit"
                onPress={() => {
                  navigation.navigate("CreateNew", {
                    screen: "CreateAnswer",
                    params: {
                      questionId: question.id,
                      questionTitle: question.title,
                      answer,
                    },
                  });
                  handleClose();
                }}
              />

              <BottomSheetButton
                label={t("common.delete")}
                type="antdesign"
                name="delete"
                onPress={() => {
                  AlertAction.AlertDelele(t, () => {
                    removeAnswer(answer.id);
                  });
                  handleClose();
                }}
              />
            </View>
          </View>
        </View>
      </BottomSheet>

      <AvatarField
        onAvatarClick={() => {
          navigation.push("UserProfile", {
            id: answer.participator.id,
          });
        }}
        style={{ marginBottom: 8 }}
        name={answer.participator.name}
        size={28}
        nameStyle={{
          fontSize: 16,
          marginLeft: 5,
          fontWeight: "bold",
          color: theme.colors?.grey0,
        }}
        fieldRight={() => (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: theme.colors?.grey1 }}>
              {milisecToAgo(answer.createdDate)}
            </Text>
            {currentUser?.id == answer.participator.id ? (
              <Icon
                containerStyle={{ marginLeft: 8 }}
                onPress={() => {
                  handlePresentModalPress();
                }}
                type="feather"
                name="more-vertical"
                color={theme.colors?.grey1}
              />
            ) : null}
          </View>
        )}
      />
      <View style={{ flexDirection: "row", marginBottom: 8, flexWrap: "wrap" }}>
        {answer.images.map((item, index) => {
          return (
            <OverlayImage
              key={index}
              image={item}
              height={90}
              width={90}
              style={{ marginRight: 6, marginTop: 6 }}
            />
          );
        })}
      </View>

      <Text
        numberOfLines={showFull.full ? undefined : LINE_THRESHOLD}
        onTextLayout={onTextLayout}
        style={{ fontSize: 18 }}
      >
        {answer.content}
      </Text>
      {!showFull.full && (
        <Text
          onPress={showFullAnswer}
          style={{
            marginTop: 3,
            color: theme.colors?.grey1,
            fontWeight: "bold",
          }}
        >{`[${t("question.showAll")}]`}</Text>
      )}

      <View
        style={{
          marginTop: 8,
          marginLeft: 20,
          paddingLeft: 6,
          marginRight: 12,
        }}
      >
        {formatComments(answer.comments).map((item) => {
          return (
            <CommentItem key={item.id} answerComment={item} answer={answer} />
          );
        })}
      </View>
      {renderLoadMore()}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <View
          style={{
            marginRight: 22,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CreateAnswerComment", {
                answer: answer,
              });
            }}
          >
            <Icon
              containerStyle={{ paddingBottom: 3 }}
              type="font-awesome"
              name="comment-o"
              color={theme.colors?.grey0}
              size={28}
            />
          </TouchableWithoutFeedback>
          <Text
            style={{
              marginLeft: 6,
              fontSize: 18,
              textAlignVertical: "center",
              color: theme.colors?.grey0,
            }}
          >
            {answer.commentCount}
          </Text>
        </View>
        <View
          style={{
            minWidth: 50,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              voteSharedValue.value = withSequence(
                withTiming(1.5, {
                  duration: 200,
                  easing: Easing.quad,
                }),
                withTiming(1, {
                  duration: 500,
                  easing: Easing.sin,
                })
              );

              if (!upvoted.upvoted) {
                upvoteAnswer(answer.id);
                setUpvoted({ upvoted: true, count: upvoted.count + 1 });
              } else {
                unvoteAnswer(answer.id);
                setUpvoted({ upvoted: false, count: upvoted.count - 1 });
              }
            }}
          >
            <Animated.View style={voteStyle}>
              <Icon
                color={
                  upvoted.upvoted ? theme.colors?.primary : theme.colors?.grey0
                }
                type="font-awesome"
                name={upvoted.upvoted ? "thumbs-up" : "thumbs-o-up"}
                size={28}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <Text
            style={{
              marginLeft: 6,
              fontSize: 18,
              textAlignVertical: "center",
              color: theme.colors?.grey0,
            }}
          >
            {upvoted.count}
          </Text>
        </View>
      </View>
    </View>
  );
};

const AnswerList = ({
  questionId,
  question,
}: {
  questionId: number;
  question: QuestionDetail;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    loadQuestionAnswers,
    questionId: answerQuestionId,
    answers,
    initializing,
    pending: answerPending,
    nextCursor,
  } = useLoadQuestionAnswers();
  const { pending: removeAnswerPending } = useRemoveAnswer();
  const { pending: removeAnswerCommentPending } = useRemoveAnswerComment();

  useFirstFocusEffect(() => {
    loadQuestionAnswers(questionId, null);
  }, [loadQuestionAnswers, questionId]);

  return (
    <View>
      <PendingOverlay
        pending={removeAnswerPending || removeAnswerCommentPending}
      />
      {answerQuestionId != questionId && (
        <View style={{ height: 180, backgroundColor: theme.colors?.white }}>
          <ActivityIndicator />
        </View>
      )}
      {answers.length > 0 &&
        answerQuestionId == questionId &&
        answers.map((item) => {
          return <AnswerItem key={item.id} answer={item} question={question} />;
        })}
      {answers.length == 0 && answerQuestionId == questionId && (
        <View
          style={{
            height: 180,
            backgroundColor: theme.colors?.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CreateNew", {
                screen: "CreateAnswer",
                params: {
                  questionId: question.id,
                  questionTitle: question.title,
                },
              });
            }}
          >
            <View>
              <Icon
                size={50}
                type="octicon"
                name="comment-discussion"
                color={theme.colors?.grey1}
              />
              <Text
                style={{
                  marginTop: 3,
                  color: theme.colors?.grey1,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {t("question.writeAnswer")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

export default AnswerList;
