import React, {
  forwardRef,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  View,
  ListRenderItem,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  useLoadUnansweredQuestions,
  Question,
  useLoadRecommendsQuestions,
} from "@petfabula/common";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import {
  useFirstFocusEffect,
  AvatarField,
  Image,
  IconCount,
  LoadingMoreIndicator,
} from "../../shared";
import { useEffect } from "react";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

export type Props = Omit<FlatListProps<Question>, "renderItem" | "data">;

const QuestionItem = ({ question }: { question: Question }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const renderContent = () => {
    if (question.images.length == 0) {
      return (
        <Text style={{ fontSize: 18, marginTop: 8 }}>{question.content}</Text>
      );
    }
    if (question.content.length == 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginTop: 8,
            marginRight: 6,
          }}
        >
          {question.images.map((item, index) => (
            <Image
              resizeMode="cover"
              key={index}
              style={{ width: 80, height: 80, marginRight: 8 }}
              source={{ uri: item.url }}
            />
          ))}
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 3,
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text
            numberOfLines={3}
            style={{ fontSize: 18, marginTop: 8, lineHeight: 20 }}
          >{`${question.content}`}</Text>
        </View>

        <Image
          resizeMode="cover"
          source={{ uri: question.images[0].url }}
          style={{ width: 80, height: 80, marginRight: 8 }}
        />
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("QuestionDetailView", { id: question.id });
      }}
    >
      <View
        style={{
          marginTop: 8,
          minHeight: 160,
          backgroundColor: theme.colors?.white,
          padding: 16,
          justifyContent: "flex-start",
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          elevation: 2,
        }}
      >
        <Text h3>{question.title}</Text>
        <AvatarField
          style={{ marginBottom: 3, marginTop: 12 }}
          name={question.participator.name}
          photo={question.participator.photo}
          nameStyle={{
            marginLeft: 6,
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors?.grey0,
          }}
          size={26}
        />
        {renderContent()}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 6,
          }}
        >
          <IconCount
            type="material-community"
            name="comment-text-multiple"
            count={question.answerCount}
            size={22}
            style={{ marginRight: 18 }}
          />
          <IconCount
            type="material-community"
            name="heart"
            count={question.upvoteCount}
            size={22}
            style={{ marginRight: 12 }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Questions = forwardRef<FlatList, Props>((props, ref) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    loadQuestions: loadUnansweredQuestions,
    questions: unansweredQuestions,
    pending: unansweredPending,
    nextCursor: unansweredCursor,
    initializing: unansweredInitializing,
  } = useLoadUnansweredQuestions();
  const {
    loadQuestions: loadRecommendQuestion,
    questions: recommendQuestions,
    pending: recommendPending,
    nextCursor: recommendCursor,
    initializing: recommendInitializing,
  } = useLoadRecommendsQuestions();
  const [loaded, setLoaded] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const recommendInitialized = useRef(false);
  const unansweredInitialized = useRef(false);

  const sectionNames = [t("question.recommends"), t("question.unanswered")];

  const refresh = () => {
    if (sectionIndex == 0) {
      loadRecommendQuestion(null);
    } else {
      loadUnansweredQuestions(null);
    }
  };

  const loadMore = () => {
    if (sectionIndex == 0) {
      if (recommendCursor && !recommendPending) {
        loadRecommendQuestion(recommendCursor);
      }
    } else {
      if (unansweredCursor && !unansweredPending) {
        loadUnansweredQuestions(unansweredCursor);
      }
    }
  };

  const getQuestions = () => {
    if (sectionIndex == 0) {
      return recommendQuestions;
    } else {
      return unansweredQuestions;
    }
  };

  const isRefreshing = () => {
    if (sectionIndex == 0) {
      return recommendInitializing;
    } else {
      return unansweredInitializing;
    }
  };

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (sectionIndex == 0) {
      if (!recommendInitialized.current) {
        loadRecommendQuestion(null);
        recommendInitialized.current = true;
      }
    } else {
      if (!unansweredInitialized.current) {
        loadUnansweredQuestions(null);
        unansweredInitialized.current = true;
      }
    }
  }, [sectionIndex, loaded]);

  useFirstFocusEffect(() => {
    setLoaded(true);
  }, []);

  const extractKey = useCallback<any>((item: Question) => {
    return item.id.toString();
  }, []);

  const renderItem = useCallback<ListRenderItem<Question>>(({ item }) => {
    return <QuestionItem question={item} />;
  }, []);

  const renderHeader = () => {
    return (
      <View
        style={{
          height: 40,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: theme.colors?.white,
        }}
      >
        {sectionNames.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              setSectionIndex(index);
            }}
            key={item}
            style={{
              marginHorizontal: 16,
              height: 40,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: sectionIndex == index ? "bold" : "normal",
                color:
                  sectionIndex == index
                    ? theme.colors?.black
                    : theme.colors?.grey1,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFooter = () => {
    if (
      (sectionIndex == 0 && recommendCursor) ||
      (sectionIndex == 1 && unansweredCursor)
    ) {
      return <LoadingMoreIndicator />;
    }
    return null;
  };

  return (
    <AnimatedFlatList
      ref={ref}
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          // refreshing={unansweredInitializing || recommendInitializing}
          refreshing={isRefreshing()}
          onRefresh={() => {
            refresh();
          }}
        />
      }
      ListFooterComponent={renderFooter()}
      ListHeaderComponent={renderHeader()}
      keyExtractor={extractKey}
      data={getQuestions()}
      renderItem={renderItem}
      onEndReached={() => {
        loadMore();
      }}
      onEndReachedThreshold={0.2}
      {...props}
    />
  );
});

export default Questions;
