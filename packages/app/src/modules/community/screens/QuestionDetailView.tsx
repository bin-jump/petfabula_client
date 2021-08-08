import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
  interpolate,
  Easing,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";
import {
  Answer,
  AnswerComment,
  QuestionDetail,
  useCurrentUser,
  useFollowUser,
  useUnfollowUser,
  useLoadQuestionAnswers,
  useLoadQuestionDetail,
  useLoadAnswerComments,
  useUpvoteQuestion,
  useUnvoteQuestion,
  useUpvoteAnswer,
  useUnvoteAnswer,
} from "@petfabula/common";
import {
  ImageGallery,
  milisecToAgo,
  AvatarField,
  ActivityIndicator,
  IconCount,
  Image,
  OverlayImage,
} from "../../shared";
import ParamTypes from "./ParamTypes";

const Footer = ({ question }: { question: QuestionDetail }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { upvoteQuestion } = useUpvoteQuestion();
  const { unvoteQuestion } = useUnvoteQuestion();
  const [upvoted, setUpvoted] = useState({
    upvoted: question.upvoted,
    count: question.upvoteCount,
  });

  const voteSharedValue = useSharedValue(1);
  const voteStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: voteSharedValue.value,
        },
      ],
      // opacity: voteSharedValue.value ** 2,
    };
  });

  const isOthers: boolean =
    currentUser != null && currentUser.id != question.participator.id;

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 24,
        paddingVertical: 8,
        justifyContent: "space-between",
        backgroundColor: theme.colors?.white,
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          // navigation.navigate("CreateAnswer", { postId: question.id });
          navigation.navigate("CreateNew", {
            screen: "CreateAnswer",
            params: { questionId: question.id, questionTitle: question.title },
          });
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors?.grey4,
            marginLeft: 6,
            borderRadius: 20,
            flexDirection: "row",
            paddingLeft: 16,
            flex: 1,
            height: 32,
            marginRight: 12,
            alignItems: "center",
          }}
        >
          <Icon
            color={theme.colors?.grey1}
            type="font-awesome"
            name="pencil"
            size={22}
          />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 18,
              color: theme.colors?.grey0,
            }}
          >
            {`${t("question.writeAnswer")}...   `}
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback
            style={{ padding: 6 }}
            onPress={() => {
              voteSharedValue.value = withSequence(
                withTiming(0.7, {
                  duration: 200,
                  easing: Easing.quad,
                }),
                withTiming(1, {
                  duration: 500,
                  easing: Easing.sin,
                })
              );
              if (!upvoted.upvoted) {
                upvoteQuestion(question.id);
              } else {
                unvoteQuestion(question.id);
              }
              setUpvoted({
                upvoted: !upvoted.upvoted,
                count: upvoted.upvoted ? upvoted.count - 1 : upvoted.count + 1,
              });
            }}
          >
            <Animated.View style={voteStyle}>
              <Icon
                color={
                  upvoted.upvoted ? theme.colors?.primary : theme.colors?.black
                }
                type="antdesign"
                name={upvoted.upvoted ? "heart" : "hearto"}
                size={28}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <Text
            style={{ color: theme.colors?.black, fontSize: 20, marginLeft: 6 }}
          >
            {upvoted.count}
          </Text>
        </View>
      </View>
    </View>
  );
};

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 12,
    opacity: interpolate(animatedIndex.value, [0, 1], [0.3, 0.8]),
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#eaeaea"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const Header = ({
  question,
  height,
  currentQuestionId,
  slideSharedValue,
}: {
  question: QuestionDetail | null;
  height: number;
  currentQuestionId: number;
  slideSharedValue: Animated.SharedValue<number>;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { followUser, pending: followPending } = useFollowUser();
  const { unfollowUser, pending: unfollowPending } = useUnfollowUser();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const slideDerived = useDerivedValue(() => {
    return withTiming(slideSharedValue.value > 100 ? 70 : 0, {
      duration: 300,
      easing: Easing.quad,
    });
  });

  const slideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -slideDerived.value,
        },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(slideDerived.value, [0, 50, 70], [0, 0, 1]),
    };
  });

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
          <Divider />
          <View style={{ paddingTop: 16 }}>
            <View style={{ width: 60 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 60,
                  shadowColor: theme.colors?.grey2,
                  shadowOffset: { width: 2, height: 1 },
                  shadowOpacity: 0.8,
                  elevation: 2,
                  backgroundColor: theme.colors?.white,
                  padding: 12,
                  justifyContent: "center",
                }}
              >
                <Icon
                  type="antdesign"
                  name="delete"
                  size={32}
                  color={theme.colors?.black}
                />
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 6,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.colors?.black,
                }}
              >
                {t("common.delete")}
              </Text>
            </View>

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

      <Animated.View style={[slideStyle, { flex: 1 }]}>
        {question && question.id == currentQuestionId ? (
          <AvatarField
            onAvatarClick={() => {
              navigation.navigate("UserProfile", {
                id: question.participator.id,
              });
            }}
            nameStyle={{ marginLeft: 8, marginBottom: 6, fontWeight: "bold" }}
            name={question.participator.name}
            photo={question.participator.photo}
            style={{
              marginRight: 16,
              marginLeft: 12,
            }}
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
                {currentUser && currentUser.id != question.participator.id ? (
                  <Button
                    loading={followPending || unfollowPending}
                    onPress={() => {
                      if (!question.participator.followed) {
                        followUser(question.participator.id);
                      } else {
                        unfollowUser(question.participator.id);
                      }
                    }}
                    title={
                      !question.participator.followed
                        ? t("user.followAction")
                        : t("user.unfollowAction")
                    }
                    titleStyle={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: question.participator.followed
                        ? theme.colors?.black
                        : theme.colors?.white,
                    }}
                    buttonStyle={{
                      height: 40,
                      paddingHorizontal: 12,
                      backgroundColor: question.participator.followed
                        ? theme.colors?.grey4
                        : theme.colors?.primary,
                    }}
                    containerStyle={{ height: 40, width: 126 }}
                    icon={
                      question.participator.followed ? (
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
        <Animated.View
          style={[
            titleStyle,
            {
              marginHorizontal: 12,
              marginTop: -20,
              transform: [{ translateY: 60 }],
            },
          ]}
        >
          <Text numberOfLines={1} h3>
            {question?.title}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

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

const CommentItem = ({
  answerComment,
  answer,
}: {
  answerComment: WithReplyTo;
  answer: Answer;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

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
      <AvatarField
        name={answerComment.participator.name}
        size={24}
        nameStyle={{
          fontSize: 16,
          marginLeft: 3,
          fontWeight: "bold",
          color: theme.colors?.grey0,
        }}
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

const AnswerItem = ({ answer }: { answer: Answer }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { loadAnswerComments } = useLoadAnswerComments();
  const { upvoteAnswer } = useUpvoteAnswer();
  const { unvoteAnswer } = useUnvoteAnswer();
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
      <AvatarField
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
          <Text style={{ color: theme.colors?.grey1 }}>
            {milisecToAgo(answer.createdDate)}
          </Text>
        )}
      />
      <View style={{ flexDirection: "row", marginBottom: 8, flexWrap: "wrap" }}>
        {answer.images.map((item, index) => {
          return (
            // <Image
            //   key={index}
            //   source={{ uri: item.url }}
            //   style={{ width: 90, height: 90, marginRight: 6, marginTop: 6 }}
            // />
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

      <Text style={{ fontSize: 18 }}>{answer.content}</Text>
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
              size={20}
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
                size={22}
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
  answers,
  question,
}: {
  answers: Answer[];
  question: QuestionDetail;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View>
      {answers.length > 0 ? (
        answers.map((item) => {
          return <AnswerItem key={item.id} answer={item} />;
        })
      ) : (
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

const QuestionDetailView = () => {
  const { params } = useRoute<RouteProp<ParamTypes, "PostDetailView">>();
  const { id } = params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const slideSharedValue = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offset = event.contentOffset.y;
      slideSharedValue.value = Math.max(0, offset);
    },
  });

  const {
    loadQuestionAnswers,
    answers,
    initializing,
    pending: answerPending,
    nextCursor,
  } = useLoadQuestionAnswers();
  const {
    loadQuestionDetail,
    question,
    pending: questionPending,
    error,
  } = useLoadQuestionDetail();
  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const headerHeight = 66;
  const footerHeight = 56 + (bottom * 1) / 2;

  // useEffect(() => {
  //   loadQuestionDetail(id);
  //   loadQuestionAnswers(id, null);
  // }, [id]);

  // useFocusEffect(() => {
  //   if (!questionPending && id != question?.id) {
  //     loadQuestionDetail(id);
  //     loadQuestionAnswers(id, null);
  //   }
  // });

  useFocusEffect(
    useCallback(() => {
      if (!questionPending && id != question?.id) {
        loadQuestionDetail(id);
        loadQuestionAnswers(id, null);
      }
    }, [id, question])
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ height: top, backgroundColor: theme.colors?.white, zIndex: 3 }}
      ></View>
      <Header
        currentQuestionId={id}
        question={question}
        height={headerHeight}
        slideSharedValue={slideSharedValue}
      />
      <Divider />
      {question && question.id == id ? (
        <View
          style={{
            paddingBottom: top + footerHeight + headerHeight,
          }}
        >
          <Animated.ScrollView
            refreshControl={
              <RefreshControl
                // progressViewOffset={70}
                refreshing={initializing}
                onRefresh={() => {
                  loadQuestionDetail(id);
                  loadQuestionAnswers(id, null);
                }}
              />
            }
            onScroll={scrollHandler}
            scrollEventThrottle={5}
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: screenHeight - top - headerHeight - footerHeight,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                paddingVertical: 18,
                paddingHorizontal: 16,
                backgroundColor: theme.colors?.white,
              }}
            >
              <Text h3>{question.title}</Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 3,
                  flexWrap: "wrap",
                }}
              >
                {question.images.map((item, index) => {
                  return (
                    // <Image
                    //   key={index}
                    //   source={{ uri: item.url }}
                    //   style={{
                    //     width: 90,
                    //     height: 90,
                    //     marginRight: 6,
                    //     marginTop: 6,
                    //   }}
                    // />
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

              <Text style={{ fontSize: 18, marginTop: 18 }}>
                {question.content}
              </Text>

              <Text
                style={{
                  color: theme.colors?.grey1,
                  fontSize: 16,
                  marginTop: 16,
                }}
              >
                {milisecToAgo(question.createdDate)}
              </Text>
            </View>
            <View
              style={{
                marginTop: 18,
                minHeight: 180,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: theme.colors?.black,
                  fontWeight: "bold",
                  padding: 12,
                  backgroundColor: theme.colors?.white,
                }}
              >{`${t("question.answerCount")} ${question.answerCount}`}</Text>
              <Divider />
              <AnswerList answers={answers} question={question} />
            </View>
          </Animated.ScrollView>

          <View
            style={{
              position: "absolute",
              marginTop: screenHeight - headerHeight - top - footerHeight,
              height: footerHeight,
              width: "100%",
              backgroundColor: theme.colors?.white,
            }}
          >
            <Divider style={{ backgroundColor: theme.colors?.grey3 }} />
            <Footer question={question} />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default QuestionDetailView;
