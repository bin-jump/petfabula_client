import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { AnswerWithQuestion } from "@petfabula/common";
import { Image, IconCount, AvatarField } from "../../shared";

const AnswerWithQuestionItem = ({
  answer,
  onPress,
}: {
  answer: AnswerWithQuestion;
  onPress?: (question: AnswerWithQuestion) => void;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const renderContent = () => {
    if (answer.images.length == 0) {
      return (
        <Text style={{ fontSize: 18, marginTop: 8 }}>{answer.content}</Text>
      );
    }
    if (answer.content.length == 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginTop: 8,
            marginRight: 6,
          }}
        >
          {answer.images.map((item, index) => (
            <Image
              key={index}
              style={{ width: 80, height: 80, marginRight: 8 }}
              uri={item.url}
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
          >{`${answer.content}`}</Text>
        </View>

        <Image
          uri={answer.images[0].url}
          style={{ width: 80, height: 80, marginRight: 8 }}
        />
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // navigation.navigate("SecondaryStack", {
        //   screen: "QuestionDetailView",
        //   params: {
        //     id: question.id,
        //   },
        // });
        if (onPress) {
          onPress(answer);
        }
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
        <Text h3>{answer.questionTitle}</Text>
        <AvatarField
          style={{ marginBottom: 3, marginTop: 12 }}
          name={answer.participator.name}
          photo={answer.participator.photo}
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
          {/* <IconCount
            type="material-community"
            name="comment-text-multiple"
            count={answer.answerCount}
            size={22}
            style={{ marginRight: 18 }}
          />
          <IconCount
            type="material-community"
            name="heart"
            count={question.upvoteCount}
            size={22}
            style={{ marginRight: 12 }}
          /> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AnswerWithQuestionItem;
