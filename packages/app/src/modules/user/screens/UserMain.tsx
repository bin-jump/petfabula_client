import * as React from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { Text, Button, Icon, useTheme, Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCurrentUser,
  useLoadMyAccount,
  useLoadMyProfile,
  useLoadMyPets,
  PetDetail,
} from "@petfabula/common";
import {
  Avatar,
  toAge,
  toAgeMonth,
  daysTillNow,
  useFirstFocusEffect,
  ActivityIndicator,
} from "../../shared";
import SettingContent from "../components/SettingContent";
import UserLoginPlease from "../components/UserLoginPlease";
import { UseContentSkeleton } from "../components/Skeletons";

const PetAgeItem = ({ mili }: { mili: number | null }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!mili) {
    return <View />;
  }

  const age = toAge(mili);
  const month = toAgeMonth(mili);
  return (
    <View
      style={{
        flexDirection: "row",
        // paddingHorizontal: 6,
        // backgroundColor: theme.colors?.grey4,
        paddingVertical: 3,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: theme.colors?.grey0, fontSize: 16 }}>
        {t("pet.age", {
          age,
        })}
      </Text>
      {month > 0 ? (
        <Text style={{ color: theme.colors?.grey0, fontSize: 16 }}>
          {t("pet.ageMonth", {
            month,
          })}
        </Text>
      ) : null}
    </View>
  );
};

const PetGenderItem = ({
  gender,
  size,
}: {
  gender: string | null;
  size: number;
}) => {
  const { theme } = useTheme();

  if (gender == "MALE") {
    return (
      <Icon
        containerStyle={{
          borderRadius: 20,
          backgroundColor: "#edf1ff",
          width: size + 6,
          height: size + 6,
          padding: 2,
        }}
        type="ionicon"
        name="male"
        size={size}
        color="#73abfc"
      />
    );
  }

  if (gender == "FEMALE") {
    return (
      <Icon
        containerStyle={{
          borderRadius: 20,
          backgroundColor: "#fceaea",
          width: size + 6,
          height: size + 6,
          padding: 2,
        }}
        type="ionicon"
        name="female"
        size={size}
        color="#e93235"
      />
    );
  }

  return null;
};

const GenderItem = ({
  gender,
  size,
}: {
  gender: string | null;
  size: number;
}) => {
  const { theme } = useTheme();

  if (gender == "MALE") {
    return <Icon type="ionicon" name="male" size={size} color="#73abfc" />;
  }

  if (gender == "FEMALE") {
    return <Icon type="ionicon" name="female" size={size} color="#e93235" />;
  }

  return null;
};

const TextNumber = ({ text, count }: { count: number; text: string }) => {
  const { theme } = useTheme();

  return (
    <View style={{}}>
      <Text
        style={{
          textAlign: "center",
          marginRight: 3,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {count}
      </Text>
      <Text style={{ fontSize: 14, color: theme.colors?.grey0 }}>{text}</Text>
    </View>
  );
};

const UserContent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { currentUser } = useCurrentUser();
  const { loadMyProfile, profile } = useLoadMyProfile();
  const { loadAccount, account } = useLoadMyAccount();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  useFirstFocusEffect(() => {
    if (currentUser) {
      loadMyProfile();
      loadAccount();
    }
  }, [loadMyProfile, JSON.stringify(currentUser)]);

  return (
    <View
      style={{
        paddingTop: 8,
        backgroundColor: theme.colors?.white,
        shadowColor: theme.colors?.grey3,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        shadowRadius: 6,
      }}
    >
      {profile && account ? (
        <View style={{ paddingBottom: 20 }}>
          <View
            style={{
              height: 40,
              justifyContent: "center",
              alignItems: "flex-end",
              backgroundColor: theme.colors?.white,
              paddingHorizontal: 16,
            }}
          >
            <Icon
              onPress={() => {
                // navigation.navigate("EditAccount", { account });
                navigation.navigate("SecondaryStack", {
                  screen: "EditAccount",
                  params: { account },
                });
              }}
              name="playlist-edit"
              type="material-community"
              color={theme.colors?.black}
              size={32}
            />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ flexDirection: "row" }}>
              <Avatar source={{ uri: account.photo }} size={80} />
              <View style={{ marginLeft: 20, justifyContent: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text h1 style={{ marginRight: 6 }}>
                    {account.name}
                  </Text>
                  <GenderItem gender={account.gender} size={22} />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: theme.colors?.grey1,
                      width: width - 150,
                      fontSize: 16,
                    }}
                  >
                    {account.bio}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SecondaryStack", {
                    screen: "FollowList",
                    params: { user: profile, initialTab: "Followed" },
                  });
                }}
              >
                <TextNumber
                  count={profile.followedCount}
                  text={t("user.followCount")}
                />
              </TouchableOpacity>
              {/* <Divider style={{ height: "100%", width: 1 }} /> */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SecondaryStack", {
                    screen: "FollowList",
                    params: { user: profile, initialTab: "Follower" },
                  });
                }}
              >
                <TextNumber
                  count={profile.followerCount}
                  text={t("user.followerCount")}
                />
              </TouchableOpacity>
              <TextNumber
                count={profile.postCount}
                text={t("user.postCount")}
              />
              <TextNumber
                count={profile.questionCount}
                text={t("user.questionCount")}
              />
            </View>
          </View>
        </View>
      ) : (
        <UseContentSkeleton />
      )}
    </View>
  );
};

const PetItem = ({ pet }: { pet: PetDetail }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("SecondaryStack", {
          screen: "PetDetailView",
          params: {
            petId: pet.id,
          },
        });
      }}
    >
      <View
        style={{
          height: 130,
          width: 200,
          padding: 10,
          marginLeft: 16,
          backgroundColor: theme.colors?.white,
          borderRadius: 10,
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowRadius: 6,
          shadowOpacity: 0.5,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Avatar source={{ uri: pet.photo }} size={60} iconType="PET" />
          <View style={{ marginLeft: 10, justifyContent: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <Text h3 h3Style={{ marginRight: 6 }}>
                {pet.name}
              </Text>
              <PetGenderItem gender={pet.gender} size={16} />
            </View>
            <PetAgeItem mili={pet.birthday} />
          </View>
        </View>
        <Text
          style={{ marginTop: 6, color: theme.colors?.grey1, fontSize: 14 }}
        >
          {pet.breed.name}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const PetContent = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { loadPets, pets, pending } = useLoadMyPets();
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation();

  useFirstFocusEffect(() => {
    if (currentUser) {
      loadPets();
    }
  }, [loadPets, JSON.stringify(currentUser)]);

  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: theme.colors?.white,
        // justifyContent: "center",
        height: 180,
        shadowColor: theme.colors?.grey3,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        shadowRadius: 6,
      }}
    >
      <Text
        style={{
          paddingLeft: 16,
          marginTop: 6,
          fontSize: 18,
          color: theme.colors?.grey1,
        }}
      >{`${t("user.myPets")}`}</Text>
      {!pending ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // marginTop: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {pets.length > 0 ? (
            pets.map((item) => <PetItem key={item.id} pet={item} />)
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CreateNew", {
                  screen: "CreatePet",
                });
              }}
              style={{
                backgroundColor: theme.colors?.white,
                marginLeft: 16,
                // justifyContent: "center",
                height: 120,
                width: 120,
                borderRadius: 12,
                shadowColor: theme.colors?.grey3,
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.3,
                elevation: 2,
                shadowRadius: 6,
                paddingTop: 16,
              }}
            >
              <Icon
                size={36}
                color={theme.colors?.black}
                type="Ionicons"
                name="add-circle-outline"
              />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  fontWeight: "bold",
                }}
              >
                {t("createNew.createPet")}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const PostContentIconText = ({
  name,
  type,
  text,
  color,
  onPress,
  width,
}: {
  onPress: () => void;
  name: string;
  type: string;
  text: string;
  color: string;
  width: number;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: color,
          borderRadius: 100,
          width: 52,
          height: 52,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.6,
          elevation: 2,
          shadowRadius: 6,
        }}
      >
        <Icon
          containerStyle={{}}
          name={name}
          type={type}
          size={30}
          color="#fff"
        />
      </View>

      <Text style={{ marginTop: 8, textAlign: "center", fontSize: 16 }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const PostContent = () => {
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const PaddingHorizontal = 16;
  const ItemWidth = (width - PaddingHorizontal * 2) / 4;

  return (
    <View
      style={{
        marginTop: 12,
        backgroundColor: theme.colors?.white,
        // flex: 1,
        shadowColor: theme.colors?.grey3,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        shadowRadius: 6,
      }}
    >
      <View
        style={{
          paddingHorizontal: PaddingHorizontal,
          paddingVertical: 16,
          // justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        <PostContentIconText
          onPress={() => {
            // navigation.navigate("UserActivity", { initial: "UserPosts" });
            navigation.navigate("SecondaryStack", {
              screen: "UserActivity",
              params: { initial: "UserPosts" },
            });
          }}
          width={ItemWidth}
          name="ios-images"
          type="ionicon"
          text={t("user.userPost")}
          color="#7fc4f1"
        />
        <PostContentIconText
          onPress={() => {
            navigation.navigate("SecondaryStack", {
              screen: "UserActivity",
              params: { initial: "UserFavoritePosts" },
            });
          }}
          width={ItemWidth}
          name="star"
          type="ionicon"
          text={t("user.userfavouritePost")}
          color="#ffa181"
        />
        <PostContentIconText
          onPress={() => {
            navigation.navigate("SecondaryStack", {
              screen: "UserActivity",
              params: { initial: "UserQuestions" },
            });
          }}
          width={ItemWidth}
          name="chatbox-ellipses"
          type="ionicon"
          text={t("user.userQuestion")}
          color="#8fb3fe"
        />
        <PostContentIconText
          onPress={() => {
            navigation.navigate("SecondaryStack", {
              screen: "UserActivity",
              params: { initial: "UserAnswers" },
            });
          }}
          width={ItemWidth}
          name="chatbubble"
          type="ionicon"
          text={t("user.userAnswer")}
          color="#28d5bd"
        />
      </View>

      {/* <View
        style={{
          paddingHorizontal: PaddingHorizontal,
          paddingVertical: 16,
          flexDirection: "row",
        }}
      >
        <PostContentIconText
          onPress={() => {
            navigation.navigate("SecondaryStack", {
              screen: "FollowList",
              params: { user: currentUser, initialTab: "Followed" },
            });
          }}
          width={ItemWidth}
          name="person"
          type="ionicon"
          text={t("user.userFollowed")}
          color="#8fb3fe"
        />
        <PostContentIconText
          onPress={() => {
            navigation.navigate("SecondaryStack", {
              screen: "FollowList",
              params: { user: currentUser, initialTab: "Follower" },
            });
          }}
          width={ItemWidth}
          name="people"
          type="ionicon"
          text={t("user.userFollower")}
          color="#28d5bd"
        />
        
      </View> */}
    </View>
  );
};

const UserMain = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();
  const {
    loadMyProfile,
    profile,
    pending: profilePending,
  } = useLoadMyProfile();
  const { loadAccount, account, pending: accountPending } = useLoadMyAccount();
  const { loadPets, pending: petPending } = useLoadMyPets();

  const refreshing =
    (profilePending || accountPending || petPending) &&
    profile != null &&
    account != null;

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <View style={{ height: top, backgroundColor: theme.colors?.white }} />
      {currentUser ? (
        <ScrollView
          // bounces={false}
          refreshControl={
            <RefreshControl
              // progressViewOffset={70}
              refreshing={refreshing}
              onRefresh={() => {
                loadMyProfile();
                loadAccount();
                loadPets();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <UserContent />
          <PetContent />
          <PostContent />
          <SettingContent />
        </ScrollView>
      ) : (
        <UserLoginPlease />
      )}
    </View>
  );
};

export default UserMain;

const styles = StyleSheet.create({
  settingItem: {
    height: 50,
    justifyContent: "center",
  },
});
