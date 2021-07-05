import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import Posts from "./screens/Posts";
import Search from "./screens/Search";
import SearchResult from "./screens/SearchResult";
import PostDetailView from "./screens/PostDetailView";
import CreateComment from "./screens/CreateComment";
import CreateCommentReply from "./screens/CreateCommentReply";
import QuestionDetailView from "./screens/QuestionDetailView";
import CreateAnswerComment from "./screens/CreateAnswerComment";

const PostsStack = createStackNavigator();

const PostScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <PostsStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <PostsStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
          };
        }}
        name="Posts"
        component={Posts}
      />
      <PostsStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="Search"
        component={Search}
      />
      <PostsStack.Screen
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
      <PostsStack.Screen
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
      <PostsStack.Screen
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
      <PostsStack.Screen
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
      <PostsStack.Screen
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

      <PostsStack.Screen
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
    </PostsStack.Navigator>
  );
};

export default PostScreens;
