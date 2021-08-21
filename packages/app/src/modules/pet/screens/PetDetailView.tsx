import React, { useCallback, useEffect, forwardRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  ListRenderItem,
} from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import Animated from "react-native-reanimated";
import { Pet, useLoadPet, useLoadPetPosts, Post } from "@petfabula/common";
import {
  Image,
  Avatar,
  LoadingMoreIndicator,
  daysTillNow,
  toAge,
  toAgeMonth,
  useRefocusEffect,
  useFirstFocusEffect,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import TabBar from "../components/TabBar";

const Tabs = createMaterialTopTabNavigator();

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

type ListProps = { petId: number };

type DateItem = { id: Date; date: Date; isDateItem: true };
type PostOrDate = Post | DateItem;

const toDate = (mili: number) => {
  var d = new Date(mili),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("/");
};

const getMonth = (mili: number) => {
  var d = new Date(mili),
    month = "" + (d.getMonth() + 1);
  if (month.length < 2) month = "0" + month;
  return month;
};

const getDay = (mili: number) => {
  var d = new Date(mili),
    day = "" + d.getDate();
  if (day.length < 2) day = "0" + day;
  return day;
};

const makeListData = (posts: Post[]) => {
  const res: PostOrDate[] = [];
  if (posts.length == 0) {
    return res;
  }

  let date = "";
  let lastDate = new Date();
  // let i = 0;
  for (let p of posts) {
    let curDate = toDate(p.createdDate);
    if (curDate != date) {
      const d = new Date(p.createdDate);
      res.push({ id: d, date: d, isDateItem: true });
      date = curDate;
      lastDate = d;
    }
    res.push(p);
  }
  // res.push({ id: lastDate, date: lastDate, isDateItem: true });

  return res;
};

const AgeItem = ({ mili }: { mili: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const age = toAge(mili);
  const month = toAgeMonth(mili);
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
        {t("pet.age", {
          age,
        })}
      </Text>
      {month > 0 ? (
        <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
          {t("pet.ageMonth", {
            month,
          })}
        </Text>
      ) : null}
    </View>
  );
};

const GenderItem = ({ gender }: { gender: string | null }) => {
  const { theme } = useTheme();

  if (gender == "MALE") {
    return (
      <Icon
        containerStyle={
          {
            // backgroundColor: "#edf1ff",
          }
        }
        type="ionicon"
        name="male"
        size={20}
        color="#73abfc"
      />
    );
  }

  if (gender == "FEMALE") {
    return (
      <Icon
        containerStyle={
          {
            // backgroundColor: "#fceaea",
          }
        }
        type="ionicon"
        name="female"
        size={20}
        color="#e93235"
      />
    );
  }

  return null;
};

const PetContent = ({ pet, petId }: { pet: Pet | null; petId: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();

  return (
    <View style={{ height: 150 }}>
      {pet && pet.id == petId ? (
        <View
          style={{
            paddingHorizontal: 26,
            // height: 150,
            backgroundColor: theme.colors?.white,
            paddingBottom: 12,
          }}
        >
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <View
              style={{
                borderRadius: 90,
                padding: 6,
                backgroundColor: theme.colors?.white,
                shadowColor: theme.colors?.grey2,
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 2,
              }}
            >
              <Avatar source={{ uri: pet.photo }} size={80} iconType="PET" />
            </View>

            <View style={{ marginLeft: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    lineHeight: 30,
                    height: 30,
                    fontSize: 24,
                    fontWeight: "bold",
                    marginRight: 4,
                  }}
                >
                  {pet.name}
                </Text>
                <GenderItem gender={pet.gender} />
              </View>

              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <View
                  style={{
                    justifyContent: "center",
                    borderRadius: 6,
                    alignItems: "center",
                  }}
                >
                  <AgeItem mili={pet.birthday} />
                </View>
              </View>

              <View
                style={{
                  marginTop: 4,
                  // paddingHorizontal: 6,
                  // borderRadius: 6,

                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18, color: theme.colors?.grey1 }}>
                  {pet.breed}
                </Text>
              </View>
            </View>
          </View>

          <Text
            numberOfLines={2}
            style={{
              textAlign: "center",
              color: theme.colors?.grey1,
              marginTop: 8,
              paddingHorizontal: 6,
            }}
          >
            {pet.bio}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const PostListItem = ({ item }: { item: PostOrDate }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  let isDateItem = (item as any).isDateItem;
  if (isDateItem) {
    const dateItem = item as DateItem;
    return (
      <View
        style={{
          flexDirection: "row",
          height: 32,
          alignItems: "center",
        }}
      >
        <View
          style={{ width: 30, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              borderRadius: 20,
              height: 12,
              width: 12,
              backgroundColor: theme.colors?.white,
              borderWidth: 2,
              borderColor: theme.colors?.grey3,
            }}
          ></View>
        </View>
        <Text style={{ color: theme.colors?.grey1, fontWeight: "bold" }}>
          {`${
            dateItem.date.getMonth() + 1
          }/${dateItem.date.getDate()}, ${dateItem.date.getFullYear()}`}
        </Text>
      </View>
    );
  }

  const postItem = item as Post;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("PostDetailView", { id: postItem.id });
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: 120,
          paddingRight: 8,
          alignItems: "center",
        }}
      >
        <View style={{ width: 30, alignItems: "center" }}>
          <View
            style={{
              height: 130,
              width: 2,
              backgroundColor: theme.colors?.grey4,
            }}
          ></View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            // borderColor: theme.colors?.grey4,
            // borderWidth: 1,
            padding: 12,
            borderRadius: 8,
            height: 110,
            backgroundColor: theme.colors?.white,
            shadowColor: theme.colors?.grey2,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text
            numberOfLines={3}
            style={{
              fontSize: 18,
              flex: 1,
              marginRight: 8,
              color: theme.colors?.black,
            }}
          >
            {postItem.content}
          </Text>

          {postItem.images.length > 0 ? (
            <Image
              containerStyle={{ borderRadius: 6 }}
              style={{ width: 100, height: 100 }}
              source={{ uri: postItem.images[0].url }}
            />
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const PetPostList = forwardRef<FlatList, ListProps>((props, ref) => {
  const { theme } = useTheme();
  const { petId } = props;
  const {
    petId: postPetId,
    posts,
    loadPetPosts,
    pending: petPostPending,
  } = useLoadPetPosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const keyExtractor = (item: PostOrDate) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<PostOrDate>>(({ item }) => {
    return <PostListItem item={item} />;
  }, []);

  useFirstFocusEffect(() => {
    loadPetPosts(petId, null);
  }, []);

  useRefocusEffect(() => {
    if (petId != postPetId) {
      loadPetPosts(petId, null);
    }
  }, [petId, postPetId, loadPetPosts]);

  return (
    <AnimatedFlatList
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      // ListHeaderComponent={() => {
      //   return (
      //     <View style={{ flexDirection: "row", alignItems: "center" }}>
      //       <Text
      //         style={{
      //           marginLeft: 16,
      //           fontWeight: "bold",
      //           fontSize: 20,
      //           color: theme.colors?.grey0,
      //         }}
      //       >{`成長`}</Text>
      //       <Icon
      //         type="material-community"
      //         name="shoe-print"
      //         color={theme.colors?.grey0}
      //       />
      //     </View>
      //   );
      // }}
      keyExtractor={keyExtractor}
      data={makeListData(posts)}
      renderItem={renderItem}
      // ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        // if (hasMore && !pending && !error) {
        //   loadUserPosts(userId, nextCursor);
        // }
      }}
      onEndReachedThreshold={0.2}
    />
  );
});

const PetDetailView = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();
  const petId = params.petId;
  const { pet, pending, loadPet } = useLoadPet();

  const renderPetPostList = useCallback(
    () => <PetPostList petId={petId} />,
    [petId]
  );

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >((props) => <TabBar {...props} />, []);

  useRefocusEffect(() => {
    if (petId != pet?.id) {
      loadPet(petId);
    }
  }, [petId, loadPet, pet]);

  useEffect(() => {
    loadPet(petId);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: theme.colors?.white, height: top }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 16,
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
      </View>
      <PetContent pet={pet} petId={petId} />

      <Tabs.Navigator tabBar={renderTabBar}>
        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.profile.petPostTitle"),
            tabBarIcon: () => (
              <Icon
                type="material-community"
                name="shoe-print"
                color={theme.colors?.grey0}
              />
            ),
          }}
          name="PetPosts"
        >
          {renderPetPostList}
        </Tabs.Screen>

        <Tabs.Screen
          options={{ tabBarLabel: t("pet.profile.petAlbumTitle") }}
          name="PetAlbum"
        >
          {renderPetPostList}
        </Tabs.Screen>
      </Tabs.Navigator>

      {/* <AnimatedFlatList
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 40,
        }}
        ListHeaderComponent={<PetContent />}
        keyExtractor={keyExtractor}
        data={makeListData(posts)}
        renderItem={renderItem}
        // ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
        onEndReached={() => {
          // if (hasMore && !pending && !error) {
          //   loadUserPosts(userId, nextCursor);
          // }
        }}
        onEndReachedThreshold={0.2}
      /> */}
    </View>
  );
};

export default PetDetailView;
