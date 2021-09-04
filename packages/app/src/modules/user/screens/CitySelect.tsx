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
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useLoadCities, City } from "@petfabula/common";

const cityComparator = (x: City, y: City) => {
  if (x.prefectureName != y.prefectureName) {
    return x.prefectureName.localeCompare(y.prefectureName, "ja");
  }
  return x.name.localeCompare(y.name, "ja");
};

const prefectureKeyComparator = (x: string, y: string) => {
  return x.localeCompare(y, "ja");
};

const makeBreedLists = (cities: City[], filterWord: string) => {
  const res: { [key: string]: City[] } = {};
  for (let c of cities) {
    if (
      filterWord &&
      !c.name.toLowerCase().startsWith(filterWord.toLowerCase())
    ) {
      continue;
    }

    if (!res[c.prefectureName]) {
      res[c.prefectureName] = [];
    }

    res[c.prefectureName].push(c);
  }

  const keys = Object.keys(res);
  for (let k of keys) {
    res[k] = res[k].sort(cityComparator);
  }

  return res;
};

const sortedKey = (cityMap: { [key: string]: City[] }) => {
  let res = Object.keys(cityMap).sort(prefectureKeyComparator);

  return res;
};

const CityItem = ({ city }: { city: City }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("EditAccount", { city });
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
        <Text style={{ fontWeight: "bold" }}>{city.name}</Text>
      </View>
      <Divider />
    </TouchableOpacity>
  );
};

const CitySelect = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { loadCities, cities } = useLoadCities();
  const [prefecture, setPrefecture] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const renderItem = useCallback<ListRenderItem<City>>(({ item }) => {
    return <CityItem city={item} />;
  }, []);

  useEffect(() => {
    loadCities();
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

  const cityMap = makeBreedLists(cities, search);

  const prefectures = sortedKey(cityMap);
  const cityList = cityMap[prefecture] ? cityMap[prefecture] : [];

  useEffect(() => {
    if (prefecture.length == 0 && prefectures.length > 0) {
      setPrefecture(prefectures[0]);
    }
  }, [prefectures]);

  useEffect(() => {
    if (
      search &&
      prefectures.length > 0 &&
      prefectures.indexOf(prefecture) < 0
    ) {
      setPrefecture(prefectures[0]);
    }
  }, [search, prefectures]);

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
          {prefectures.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setPrefecture(item);
              }}
              style={{ paddingHorizontal: 12 }}
            >
              <Text
                style={{
                  fontWeight: prefecture == item ? "bold" : "normal",
                  fontSize: prefecture == item ? 20 : 18,
                  color:
                    prefecture == item
                      ? theme.colors?.black
                      : theme.colors?.grey1,
                }}
              >
                {t(`${item}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Divider />

      <FlatList
        style={{ backgroundColor: theme.colors?.white }}
        contentContainerStyle={{ paddingBottom: 30 }}
        data={cityList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CitySelect;
