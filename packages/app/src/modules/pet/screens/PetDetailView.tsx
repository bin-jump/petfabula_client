import React, { useCallback } from "react";
import { View, TouchableOpacity, FlatList, ListRenderItem } from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedRef,
  interpolate,
} from "react-native-reanimated";
import { Pet, useLoadPet, useLoadPetPosts, Post } from "@petfabula/common";
import {
  Image,
  Avatar,
  LoadingMoreIndicator,
  daysTillNow,
  toAge,
  toAgeMonth,
  useRefocusEffect,
} from "../../shared";
import ParamTypes from "./ParamTypes";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as typeof FlatList;

type ListProps = { userId: number };

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

const PetContent = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();
  const petId = params.petId;
  const { pet, loadPet, pending } = useLoadPet();

  useFocusEffect(
    useCallback(() => {
      if (!pending && petId != pet?.id) {
        loadPet(petId);
      }
    }, [petId, loadPet, pet])
  );

  return (
    <View>
      {pet && pet.id == petId ? (
        <View
          style={{
            paddingHorizontal: 26,
            // height: 150,
            backgroundColor: theme.colors?.white,
            paddingBottom: 16,
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
              marginTop: 12,
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

  let isDateItem = (item as any).isDateItem;
  if (isDateItem) {
    const dateItem = item as DateItem;
    return (
      <View
        style={{
          flexDirection: "row",
          height: 30,
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
        <Text style={{ color: theme.colors?.grey1 }}>
          {toDate(dateItem.date.getTime())}
        </Text>
      </View>
    );
  }

  const postItem = item as Post;

  return (
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
  );
};

const PetDetailView = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();
  const petId = params.petId;
  const {
    petId: postPetId,
    posts,
    loadPetPosts,
    pending: petPostPending,
  } = useLoadPetPosts();

  useRefocusEffect(() => {
    loadPetPosts(petId, null);
  }, [petId, loadPetPosts]);

  const keyExtractor = (item: PostOrDate) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<PostOrDate>>(({ item }) => {
    return <PostListItem item={item} />;
  }, []);

  return (
    <View style={{}}>
      <AnimatedFlatList
        contentContainerStyle={{
          minHeight: "100%",
          // backgroundColor: theme.colors?.white,
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
      />
    </View>
  );
};

export default PetDetailView;
