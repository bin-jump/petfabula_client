import * as React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThemeContext, Icon } from "react-native-elements";
import { headerBaseOption, plainGoBackHeaderOption } from "../shared";
import CommunityMain from "./screens/CommunityMain";
import Search from "./screens/Search";
import SearchResult from "./screens/SearchResult";
import PostDetailView from "./screens/PostDetailView";
import CreateComment from "./screens/CreateComment";
import CreateCommentReply from "./screens/CreateCommentReply";
import QuestionDetailView from "./screens/QuestionDetailView";
import CreateAnswerComment from "./screens/CreateAnswerComment";

const CommunityStack = createStackNavigator();

const CommunityScreens = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <CommunityStack.Navigator
      screenOptions={{ headerStyle: { elevation: 0, borderWidth: 0 } }}
      mode="modal"
    >
      <CommunityStack.Screen
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
      {/* <CommunityStack.Screen
        options={(navigation) => {
          return {
            ...headerBaseOption({ theme }),
            headerShown: false,
          };
        }}
        name="Search"
        component={Search}
      />
      <CommunityStack.Screen
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
      <CommunityStack.Screen
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
      <CommunityStack.Screen
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
      <CommunityStack.Screen
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

      <CommunityStack.Screen
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

      <CommunityStack.Screen
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
      /> */}
    </CommunityStack.Navigator>
  );
};

export default CommunityScreens;
