import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useTheme, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DismissKeyboardView, Storage } from "../../shared";

const Tab = createMaterialTopTabNavigator();

const Header = ({
  value,
  onTextChange,
  onFocus,
  onBlur,
  onSearchPress,
}: {
  value: string;
  onTextChange: (text: string) => void;
  onSearchPress?: (keyword: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        height: 70,
        width: "100%",
        paddingHorizontal: 16,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.colors?.grey4,
            height: 40,
            borderRadius: 10,
            paddingHorizontal: 12,
            alignItems: "center",
            flex: 1,
          }}
        >
          <Icon
            type="font-awesome"
            name="search"
            size={20}
            color={theme.colors?.grey0}
          />
          <TextInput
            autoFocus
            value={value}
            autoCorrect={false}
            blurOnSubmit={false}
            onChangeText={(text) => {
              onTextChange(text);
            }}
            onSubmitEditing={() => {
              if (onSearchPress) {
                onSearchPress(value);
              }
            }}
            returnKeyType="search"
            onFocus={onFocus}
            onBlur={onBlur}
            style={{ fontSize: 18, marginLeft: 8, marginRight: 8, flex: 1 }}
          />
          <Icon
            onPress={() => {
              onTextChange("");
            }}
            type="antdesign"
            name="closecircle"
            size={20}
            color={theme.colors?.grey1}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            marginLeft: 12,
            justifyContent: "center",
          }}
        >
          <Icon
            type="antdesign"
            name="close"
            size={24}
            color={theme.colors?.grey0}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HISTORY_KEY = "SEARCH_HISTORY";
const HISTORY_LIMIT = 12;

const getSearchHistory = async () => {
  return (await Storage.getItem(HISTORY_KEY)) as string[];
};

const setSearchHistory = async (arr: string[]) => {
  await Storage.setItem(HISTORY_KEY, arr);
};

const Search = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const updateHistory = useCallback(
    (w: string) => {
      w = w.trim();

      if (!history.includes(w)) {
        let arr = history;
        if (arr.length == HISTORY_LIMIT) {
          arr.splice(-1, 1);
        }

        setHistory([w, ...arr]);
      }
    },
    [history, setHistory]
  );

  const readHistory = useCallback(async () => {
    const arr = await getSearchHistory();
    const his = arr ? arr : [];
    setHistory(his);
  }, [setHistory]);

  const writeHistory = useCallback(async () => {
    setSearchHistory(history);
  }, [history]);

  useEffect(() => {
    readHistory();
  }, []);

  useEffect(() => {
    return () => {
      writeHistory();
    };
  }, [writeHistory]);

  return (
    <View>
      <View
        style={{
          height: top,
          backgroundColor: theme.colors?.white,
          zIndex: 2,
        }}
      ></View>
      <Header
        value={keyword}
        onTextChange={(text) => {
          setKeyword(text);
        }}
        onSearchPress={(keyword) => {
          if (keyword && keyword.trim()) {
            const w = keyword.trim();
            if (w.length > 32) {
              return;
            }
            updateHistory(keyword);
            navigation.navigate("SearchResult", { keyword });
          }
        }}
        // onFocus={() => {
        // }}
        // onBlur={() => {
        // }}
      />

      <DismissKeyboardView>
        <View
          style={{
            marginTop: 6,
            width: "100%",
            minHeight: 120,
            backgroundColor: theme.colors?.white,
            paddingHorizontal: 6,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: theme.colors?.grey1, fontSize: 18 }}>
              {t("search.history")}
            </Text>
            {history.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setHistory([]);
                }}
              >
                <Text style={{ color: theme.colors?.grey1, fontSize: 18 }}>
                  {t("search.clearHistory")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {history.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  setKeyword(item);
                  navigation.navigate("SearchResult", { keyword: item });
                }}
                key={item}
                style={{
                  borderRadius: 6,
                  padding: 10,
                  marginHorizontal: 10,
                  marginVertical: 8,
                  backgroundColor: theme.colors?.grey4,
                }}
              >
                <Text style={{ fontSize: 18, color: theme.colors?.black }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </DismissKeyboardView>
    </View>
  );
};

export default Search;
