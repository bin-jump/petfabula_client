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
  Platform,
} from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
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
  useRemoveQuestion,
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
  ParsedTextContent,
  OverlayImage,
  useRefocusEffect,
  BottomSheet,
  BottomSheetButton,
  AlertAction,
  useDidUpdateEffect,
  PendingOverlay,
  useFirstFocusEffect,
  useLoginIntercept,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import RelatePetItem from "../components/RelatePetItem";
import AnswerList from "../components/AnswerList";
import { QuestionDetailSkeleton } from "../components/Skeletons";

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
  const { assertLogin } = useLoginIntercept();

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
          if (!assertLogin()) {
            return;
          }
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
              if (!assertLogin()) {
                return;
              }
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
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { removeQuestion, pending: removePending } = useRemoveQuestion();
  const { followUser, pending: followPending } = useFollowUser();
  const { unfollowUser, pending: unfollowPending } = useUnfollowUser();
  const { assertLogin } = useLoginIntercept();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

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
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />
          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row" }}>
              {currentUser?.id == question?.participator.id ? (
                <BottomSheetButton
                  label={t("common.edit")}
                  type="antdesign"
                  name="edit"
                  onPress={() => {
                    navigation.navigate("CreateNew", {
                      screen: "CreateQuestion",
                      params: { question: question },
                    });
                    handleClose();
                  }}
                />
              ) : null}

              {currentUser?.id == question?.participator.id ? (
                <BottomSheetButton
                  label={t("common.delete")}
                  type="antdesign"
                  name="delete"
                  onPress={() => {
                    AlertAction.AlertDelele(t, () => {
                      if (question) {
                        removeQuestion(question.id);
                      }
                    });
                    handleClose();
                  }}
                />
              ) : null}

              {question && currentUser?.id != question?.participator.id ? (
                <BottomSheetButton
                  label={t("common.report")}
                  type="antdesign"
                  name="warning"
                  onPress={() => {
                    handleClose();
                    if (!assertLogin()) {
                      return;
                    }
                    navigation.navigate("CreateNew", {
                      screen: "CreateReport",
                      params: { entityId: question.id, entityType: "QUESTION" },
                    });
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </BottomSheet>

      <Animated.View style={[slideStyle, { flex: 1 }]}>
        {question && question.id == currentQuestionId ? (
          <AvatarField
            onAvatarClick={() => {
              navigation.push("UserProfile", {
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
            fieldRightWidth={210}
            fieldRight={() => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  justifyContent: "flex-end",
                  paddingRight: 16,
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

const QuestionDetailView = () => {
  const { params } = useRoute<RouteProp<ParamTypes, "PostDetailView">>();
  const { id } = params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();

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
  const { pending: removePending, result } = useRemoveQuestion();

  const { height: screenHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const headerHeight = 66;
  const footerHeight = 56 + (bottom * 1) / 2;

  useRefocusEffect(() => {
    if (id != question?.id) {
      loadQuestionDetail(id);
    }
  }, [id, question, loadQuestionDetail]);

  useFirstFocusEffect(() => {
    loadQuestionDetail(id);
  }, [loadQuestionDetail]);

  useDidUpdateEffect(() => {
    if (result && result.id == id) {
      navigation.goBack();
    }
  }, [result]);

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
      <PendingOverlay pending={removePending} />

      {question && question.id == id ? (
        <View
          style={{
            // paddingBottom: top + footerHeight + headerHeight,
            paddingBottom: footerHeight,
            flex: 1,
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
                minHeight: 140,
                paddingVertical: 18,
                paddingHorizontal: 16,
                backgroundColor: theme.colors?.white,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text selectable={true} h3>
                  {question.title}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 3,
                    flexWrap: "wrap",
                  }}
                >
                  {question.images.map((item, index) => {
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

                {question.content ? (
                  <ParsedTextContent
                    selectable={true}
                    style={{ fontSize: 18, marginTop: 12 }}
                  >
                    {question.content}
                  </ParsedTextContent>
                ) : null}

                {question.relatePet ? (
                  <RelatePetItem
                    onPress={() => {
                      navigation.push("PetDetailView", {
                        petId: question.relatePetId,
                      });
                    }}
                    pet={question.relatePet}
                  />
                ) : null}
              </View>

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

              <AnswerList questionId={id} question={question} />
            </View>
          </Animated.ScrollView>

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
            <Footer question={question} />
          </View>
        </View>
      ) : (
        questionPending && <QuestionDetailSkeleton />
      )}
    </View>
  );
};

export default QuestionDetailView;
