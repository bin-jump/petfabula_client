import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ListRenderItem,
} from "react-native";
import { Text, useTheme, Icon, Divider, Button } from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useLoadPetBreeds, PetBreed } from "@petfabula/common";
import { ActivityIndicator } from "../../shared";

const breedComparator = (x: PetBreed, y: PetBreed) => {
  if (x.name == "その他") {
    return 1;
  }
  if (y.name == "その他") {
    return -1;
  }
  return x.name.localeCompare(y.name, "ja");
};

const makeBreedLists = (breeds: PetBreed[], filterWord: string) => {
  const res: { [key: string]: PetBreed[] } = {};
  for (let b of breeds) {
    if (
      filterWord &&
      !b.name.toLowerCase().startsWith(filterWord.toLowerCase())
    ) {
      continue;
    }

    if (!res[b.category]) {
      res[b.category] = [];
    }

    res[b.category].push(b);
  }

  const keys = Object.keys(res);
  for (let k of keys) {
    res[k] = res[k].sort(breedComparator);
  }

  return res;
};

const sortedKey = (breedMap: { [key: string]: PetBreed[] }) => {
  let categories = Object.keys(breedMap).sort((a, b) =>
    breedMap[a].length > breedMap[b].length ? -1 : 1
  );
  categories = categories.filter((item) => item != "DOG" && item != "CAT");
  if (breedMap["CAT"]) {
    categories.unshift("CAT");
  }
  if (breedMap["DOG"]) {
    categories.unshift("DOG");
  }
  return categories;
};

const PetBreedItem = ({ breed }: { breed: PetBreed }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CreatePet", { breed });
      }}
      style={{
        minHeight: 50,
        justifyContent: "center",
        backgroundColor: theme.colors?.white,
      }}
    >
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{breed.name}</Text>
      </View>
      <Divider />
    </TouchableOpacity>
  );
};

const PetBreedSelect = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { loadPetBreeds, petBreeds, pending } = useLoadPetBreeds();
  const [category, setCategory] = useState<string>("DOG");
  const [search, setSearch] = useState<string>("");

  const renderItem = useCallback<ListRenderItem<PetBreed>>(({ item }) => {
    return <PetBreedItem breed={item} />;
  }, []);

  useEffect(() => {
    loadPetBreeds();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            marginRight: 24,
            minWidth: "100%",
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.colors?.grey3,
              borderRadius: 6,
              height: 30,
              paddingHorizontal: 8,
            }}
            onChangeText={(value) => {
              setSearch(value);
            }}
          />
        </View>
      ),
    });
  }, [search, setSearch, theme]);

  const breeds = petBreeds;
  const breedMap = makeBreedLists(breeds, search);

  // const breedMap = makeBreedLists(breeds);
  const categories = sortedKey(breedMap);
  const breedList = breedMap[category] ? breedMap[category] : [];

  useEffect(() => {
    if (search && categories.length > 0 && categories.indexOf(category) < 0) {
      setCategory(categories[0]);
    }
  }, [search, categories]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors?.white,
      }}
    >
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          style={{
            backgroundColor: theme.colors?.white,
          }}
          contentContainerStyle={{ height: 50, alignItems: "center" }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setCategory(item);
              }}
              style={{ paddingHorizontal: 18 }}
            >
              <Text
                style={{
                  fontWeight: category == item ? "bold" : "normal",
                  fontSize: category == item ? 22 : 20,
                  color:
                    category == item
                      ? theme.colors?.black
                      : theme.colors?.grey1,
                }}
              >
                {t(`pet.petCategory.${item}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Divider />

      <FlatList
        ListHeaderComponent={pending ? <ActivityIndicator /> : null}
        style={{ backgroundColor: theme.colors?.white }}
        contentContainerStyle={{ paddingBottom: 30 }}
        data={breedList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PetBreedSelect;
