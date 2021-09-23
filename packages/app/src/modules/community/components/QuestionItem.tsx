import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Question } from "@petfabula/common";
import { Image, IconCount, AvatarField } from "../../shared";

const QuestionItem = ({
  question,
  onPress,
}: {
  question: Question;
  onPress?: (question: Question) => void;
}) => {
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
              key={index}
              style={{ width: 80, height: 80, marginRight: 8 }}
              uri={item.url}
              sz="SM"
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
          uri={question.images[0].url}
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
          onPress(question);
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

export default QuestionItem;
