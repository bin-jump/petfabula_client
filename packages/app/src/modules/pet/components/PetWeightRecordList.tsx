import React, { useRef, useMemo, useCallback } from "react";
import { View, ListRenderItem, TouchableWithoutFeedback } from "react-native";
import { useTheme, Text, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  WeightRecord,
  useLoadWeightRecords,
  useRemoveWeightRecord,
} from "@petfabula/common";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useFirstFocusEffect,
  toDateText,
  LoadingMoreIndicator,
  BottomSheetButton,
  BottomSheet,
  AlertAction,
  PendingOverlay,
  ActivityIndicator,
  FlatList,
} from "../../shared";
import {
  RecordBaseType,
  makeListData,
  RecordItem,
  DateItem,
} from "./RecordListComponents";

type RecordItemType = WeightRecord & RecordBaseType;

const Item = ({ record }: { record: RecordItemType }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { removeWeightRecord } = useRemoveWeightRecord();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  return (
    <View
      style={{
        flex: 1,
        // minHeight: 100,
        padding: 12,
        backgroundColor: theme.colors?.white,
        borderRadius: 16,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
        elevation: 2,

        flexDirection: "row",
      }}
    >
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />

          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row" }}>
              <BottomSheetButton
                label={t("common.edit")}
                type="antdesign"
                name="edit"
                onPress={() => {
                  navigation.navigate("CreateNew", {
                    screen: "CreateWeightRecord",
                    params: { record: record },
                  });

                  bottomSheetModalRef.current?.close();
                }}
              />

              <BottomSheetButton
                label={t("common.delete")}
                type="antdesign"
                name="delete"
                onPress={() => {
                  AlertAction.AlertDelele(t, () => {
                    removeWeightRecord(record.id);
                  });
                  handleClose();
                }}
              />
            </View>
          </View>
        </View>
      </BottomSheet>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <DateItem mili={record.dateTime} />

          <TouchableWithoutFeedback onPress={handlePresentModalPress}>
            <Icon
              type="feather"
              name="more-vertical"
              size={20}
              color={theme.colors?.grey1}
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={{ marginTop: 3, lineHeight: 30 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, lineHeight: 30 }}
            >{`${t("pet.record.weightLabel")}:  `}</Text>
            <Text
              style={{
                lineHeight: 30,
                fontWeight: "bold",
                fontSize: 24,
                color: theme.colors?.primary,
              }}
            >
              {`${record.weight}`}
            </Text>
            <Text style={{ fontSize: 18, lineHeight: 30 }}>{` kg`}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const RecordListItem = ({ record }: { record: RecordItemType }) => {
  return (
    <RecordItem record={record}>
      <Item record={record} />
    </RecordItem>
  );
};

const PetWeightRecordList = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();

  const {
    petId: recordPetId,
    initializing,
    pending,
    loadRecords,
    records,
    hasMore,
    nextCursor,
    error,
  } = useLoadWeightRecords();
  const { pending: removePending } = useRemoveWeightRecord();

  useFirstFocusEffect(() => {
    loadRecords(petId, null);
  }, [petId, loadRecords]);

  const keyExtractor = (item: RecordItemType) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<RecordItemType>>(({ item }) => {
    return <RecordListItem record={item} />;
  }, []);

  if (recordPetId != petId) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <PendingOverlay pending={removePending} />
      <FlatList
        style={
          {
            // backgroundColor: theme.colors?.white,
          }
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        pending={initializing}
        keyExtractor={keyExtractor}
        data={makeListData(records)}
        renderItem={renderItem}
        ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
        onEndReached={() => {
          if (hasMore && !pending && !error) {
            loadRecords(petId, nextCursor);
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default PetWeightRecordList;
