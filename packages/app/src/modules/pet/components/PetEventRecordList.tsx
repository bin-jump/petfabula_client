import React, { useRef, useMemo, useCallback } from "react";
import { View, ListRenderItem, TouchableWithoutFeedback } from "react-native";
import { useTheme, Text, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import {
  PetEventRecord,
  useLoadPetEventRecords,
  useRemovePetEventRecord,
} from "@petfabula/common";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import {
  useFirstFocusEffect,
  toDateText,
  OverlayImage,
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
  TimeItem,
} from "./RecordListComponents";

type RecordItemType = PetEventRecord & RecordBaseType;

const Item = ({ record }: { record: RecordItemType }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { removePetEventRecord } = useRemovePetEventRecord();

  const eventType = t(`pet.record.${record.eventType}`);

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
        // height: 100,
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
                    screen: "CreatePetEventRecord",
                    params: { record: record, type: record.eventType },
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
                    removePetEventRecord(record.id);
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
        <TimeItem mili={record.dateTime} />

        <View
          style={{
            marginTop: 3,
          }}
        >
          <Text style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{`${t(
              "pet.record.eventTypeLabel"
            )}: `}</Text>

            <Text style={{ fontSize: 20 }}>{`${eventType}`}</Text>
          </Text>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{`${t(
              "pet.record.eventContentLabel"
            )} `}</Text>

            <Text
              style={{ marginTop: 6, fontSize: 18, color: theme.colors?.grey0 }}
            >{`${record.content}`}</Text>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", marginBottom: 8, flexWrap: "wrap" }}
        >
          {record.images.map((item, index) => {
            return (
              <OverlayImage
                key={index}
                image={item}
                height={80}
                width={80}
                style={{ marginRight: 6, marginTop: 6 }}
                imageStyle={{ borderRadius: 3 }}
              />
            );
          })}
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

const DisorderRecordList = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();

  const {
    petId: recordPetId,
    pending,
    initializing,
    loadRecords,
    records,
    hasMore,
    nextCursor,
    error,
  } = useLoadPetEventRecords();
  const { pending: removePending } = useRemovePetEventRecord();

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

export default DisorderRecordList;
