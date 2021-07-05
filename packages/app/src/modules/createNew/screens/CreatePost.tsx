import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import {
  Text,
  ThemeContext,
  Icon,
  Image,
  useTheme,
  Divider,
} from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
  ImageFile,
} from "../../shared";
import {
  PostForm,
  validPostSchema,
  useCreatePost,
  PostTopic,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";
import MultipleImageSelect from "../components/MultipleImageSelect";

const CreatePost = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<ParamTypes, "CreatePost">>();
  const { t } = useTranslation();
  const { createPost } = useCreatePost();
  const images = params?.images ? params.images : [];
  const topic = params?.topic;
  const [img, setImg] = useState<ImageFile[]>([]);

  useEffect(() => {
    if (!(JSON.stringify(images) == JSON.stringify(img))) {
      setImg(images);
    }
  }, [images]);

  const handleRemove = (index: number) => {
    img.splice(index, 1);
    setImg([...img]);
  };

  const initial: PostForm = {
    content: "",
    relatedPetId: null,
    topicId: topic ? topic.id : null,
  };
  // console.log("initial", initial);
  const handleSubmit = (data: PostForm) => {
    Keyboard.dismiss();
    const d = { ...data, topicId: topic ? topic.id : null };
    createPost(d, img);
  };

  return (
    <DismissKeyboardView>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Formik
            initialValues={initial}
            onSubmit={handleSubmit}
            validationSchema={validPostSchema}
          >
            {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
              <PostFormContent
                {...{
                  values,
                  setErrors,
                  handleSubmit,
                  handleBlur,
                  setValues,
                  topic,
                }}
              />
            )}
          </Formik>
          <Divider
            style={{
              width: "100%",
              marginTop: 12,
              borderWidth: 0.5,
              borderColor: theme.colors?.grey4,
            }}
          />

          <TouchableOpacity
            style={{
              marginTop: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.colors?.grey5,
              height: 42,
              borderRadius: 10,
              width: "100%",
              paddingHorizontal: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
              {t("createNew.petSelect")}
            </Text>
            <Icon type="antdesign" name="right" color={theme.colors?.grey0} />
          </TouchableOpacity>

          {/* <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ImageSelect", { fromScreen: "CreatePost" })
              }
              style={{
                width: 92,
                height: 92,
                borderStyle: "dashed",
                justifyContent: "center",
                borderWidth: 3,
                borderRadius: 3,
                borderColor: theme.colors?.grey3,
                margin: 3,
              }}
            >
              <Icon
                size={40}
                color={theme.colors?.grey3}
                type="Ionicons"
                name="add"
              />
            </TouchableOpacity>
            {images.map((item) => (
              <Image
                key={item.name}
                source={{ uri: item.uri }}
                style={{ width: 92, height: 92, margin: 3 }}
              />
            ))}
          </View> */}
        </View>
        <MultipleImageSelect
          images={img}
          fromScreen="CreatePost"
          onRemove={handleRemove}
        />
      </View>
    </DismissKeyboardView>
  );
};

const PostFormContent = ({
  values,
  handleSubmit,
  setErrors,
  handleBlur,
  setValues,
  topic,
}: {
  values: PostForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: PostForm) => void;
  topic?: PostTopic;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreatePost();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 24 }}>
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={{ fontSize: 20 }}>{t("common.send")}</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.navigate("TabScreen");
    }
  }, [result]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <PendingOverlay pending={pending} />
      <Field
        name="content"
        placeholder={t("createNew.input.postcontent")}
        component={BlankInput}
        autoFocus
        multiline
      />

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PostTopics");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            type="fontisto"
            name="hashtag"
            color={topic ? theme.colors?.secondary : theme.colors?.grey1}
            size={16}
          />
          {topic ? (
            <Text
              numberOfLines={1}
              style={{
                paddingHorizontal: 3,
                color: theme.colors?.black,
                textAlign: "center",
                marginLeft: 2,
                fontSize: 16,
                maxWidth: 300,
              }}
            >
              {topic.title}
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              style={{
                // fontWeight: "bold",
                color: theme.colors?.grey1,
                textAlign: "center",
                marginLeft: 2,
                paddingBottom: 3,
                fontSize: 16,
                maxWidth: 300,
              }}
            >
              {t("createNew.topicSelect")}
            </Text>
          )}
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontSize: 16,
              color:
                values.content?.length <= 3000
                  ? theme.colors?.grey1
                  : theme.colors?.error,
            }}
          >{`${values.content?.length}/3000`}</Text>
        </View>
      </View>
    </View>
  );
};

export default CreatePost;
