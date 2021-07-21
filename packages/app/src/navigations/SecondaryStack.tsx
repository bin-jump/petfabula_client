import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../modules/shared";
import {
  CommunityMain,
  Search,
  SearchResult,
  PostDetailView,
  CreateComment,
  CreateCommentReply,
  QuestionDetailView,
  CreateAnswerComment,
  UserProfile,
} from "../modules/community/screens";

const SecondaryStackStack = createStackNavigator();

const SecondaryStack = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <SecondaryStackStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <SecondaryStackStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="CommunityMain"
        component={CommunityMain}
      />
      <SecondaryStackStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="Search"
        component={Search}
      />
      <SecondaryStackStack.Screen
        options={(navigation) => {
          return {
            cardOverlayEnabled: true,
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="SearchResult"
        component={SearchResult}
      />
      <SecondaryStackStack.Screen
        // options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        options={(navigation) => {
          return {
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureDirection: "horizontal",
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="PostDetailView"
        component={PostDetailView}
      />
      <SecondaryStackStack.Screen
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: "clamp",
              }),
            },
          }),
        }}
        name="CreateComment"
        component={CreateComment}
      />
      <SecondaryStackStack.Screen
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.1, 0.3, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0.5],
                extrapolate: "clamp",
              }),
            },
          }),
        }}
        name="CreateCommentReply"
        component={CreateCommentReply}
      />

      {/* question */}
      <SecondaryStackStack.Screen
        // options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        options={(navigation) => {
          return {
            cardOverlayEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureDirection: "horizontal",
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="QuestionDetailView"
        component={QuestionDetailView}
      />

      <SecondaryStackStack.Screen
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: "clamp",
              }),
            },
          }),
        }}
        name="CreateAnswerComment"
        component={CreateAnswerComment}
      />
      <SecondaryStackStack.Screen
        options={(navigation) => plainGoBackHeaderOption({ navigation, theme })}
        name="UserProfile"
        component={UserProfile}
      />
    </SecondaryStackStack.Navigator>
  );
};

export default SecondaryStack;
