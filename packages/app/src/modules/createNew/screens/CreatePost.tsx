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
  PostForm,
  validPostSchema,
  useCreatePost,
  useUpdatePost,
  PostTopic,
  PostDetail,
  DisplayImage,
  ParticiptorPet,
} from "@petfabula/common";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
  ImageFile,
  validSelect,
} from "../../shared";
import ParamTypes from "./paramTypes";
import ImageSelector from "../components/ImageSelector";
import MultipleImageSelect from "../components/MultipleImageSelect";
import PostPetSelector from "../components/PostPetSelector";

const CreatePost = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<ParamTypes, "CreatePost">>();
  const { t } = useTranslation();
  const { createPost } = useCreatePost();
  const { updatePost } = useUpdatePost();
  const post = params?.post;
  const images = params?.images ? params.images : [];
  const [img, setImg] = useState<ImageFile[]>([]);
  const [existImages, setExistImages] = useState<DisplayImage[]>(
    post ? post.images : []
  );

  const selectedTopic = params?.topic;
  const initialTopic = params?.post?.postTopic ? params?.post?.postTopic : null;
  const topic =
    selectedTopic && validSelect(selectedTopic)
      ? selectedTopic
      : selectedTopic
      ? null
      : initialTopic;

  const selectedPet = params?.pet;
  const initialPet = params?.post?.relatePet ? params?.post?.relatePet : null;
  const pet =
    selectedPet && validSelect(selectedPet)
      ? (selectedPet as ParticiptorPet)
      : selectedPet
      ? null
      : initialPet;

  useEffect(() => {
    if (!(JSON.stringify(images) == JSON.stringify(img))) {
      setImg(images);
    }
  }, [images]);

  const handleRemove = (index: number) => {
    img.splice(index, 1);
    setImg([...img]);
  };

  const handleRemoveExistImage = (id: number) => {
    const im = existImages.filter((item) => item.id != id);
    setExistImages(im);
  };

  // const postTopicId = post?.postTopic ? post.postTopic.id : null;

  const initial: PostForm = post
    ? {
        content: post.content,
        relatePetId: post.relatePetId,
        topicId: topic ? topic.id : null,
      }
    : {
        content: "",
        relatePetId: null,
        topicId: topic ? topic.id : null,
      };
  // console.log("initial", initial);

  const handleUpdate = (data: PostForm) => {
    if (post) {
      const d = {
        ...post,
        ...data,
        relatePetId: pet ? pet?.id : null,
        topicId: topic ? topic.id : null,
        images: existImages,
      };
      updatePost(d, img);
    }
  };

  const handleCreate = (data: PostForm) => {
    const d = {
      ...data,
      topicId: topic ? topic.id : null,
      relatePetId: pet ? pet?.id : null,
    };
    createPost(d, img);
  };

  const handleSubmit = (data: PostForm) => {
    Keyboard.dismiss();
    if (post) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
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
                  pet,
                }}
              />
            )}
          </Formik>

          {/* <TouchableOpacity
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
            onPress={() => {
              navigation.navigate("PetSelect", {
                backScreen: "CreatePost",
              });
            }}
          >
            <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
              {t("createNew.petSelect")}
            </Text>
            <Icon type="antdesign" name="right" color={theme.colors?.grey0} />
          </TouchableOpacity> */}
        </View>
        <MultipleImageSelect
          handleExistImageRemove={handleRemoveExistImage}
          existImages={existImages}
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
  pet,
}: {
  values: PostForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: PostForm) => void;
  topic?: PostTopic | null;
  pet: ParticiptorPet | null;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreatePost();
  const { pending: updatePending, result: updateResult } = useUpdatePost();
  // const { params } = useRoute<RouteProp<ParamTypes, "CreatePost">>();

  useEffect(() => {
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

  // useEffect(() => {
  //   if (pet) {
  //     if (validSelect(selectedPet)) {
  //       const sPet = selectedPet as ParticiptorPet;
  //       setValues({ ...values, relatePetId: sPet.id });
  //     } else {
  //       setValues({ ...values, relatePetId: null });
  //     }
  //   }
  // }, [pet]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  useDidUpdateEffect(() => {
    if (updateResult) {
      navigation.goBack();
    }
  }, [updateResult]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <PendingOverlay pending={pending || updatePending} />
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
            navigation.navigate("PostTopicSelect");
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

      <Divider
        style={{
          width: "100%",
          marginTop: 12,
          borderWidth: 0.5,
          borderColor: theme.colors?.grey4,
        }}
      />
      <PostPetSelector
        pet={pet}
        onPress={() => {
          navigation.navigate("PetSelect", {
            backScreen: "CreatePost",
          });
        }}
      />
    </View>
  );
};

export default CreatePost;
