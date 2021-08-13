import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import { Text, ThemeContext, useTheme } from "react-native-elements";
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
  QuestionForm,
  useCreateQuestion,
  validQuestionSchema,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";
import MultipleImageSelect from "../components/MultipleImageSelect";
import PostPetSelector from "../components/PostPetSelector";

const CreateQuestion = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateQuestion">>();
  const pet = params?.pet;
  const { createQuestion } = useCreateQuestion();
  const images = params?.images ? params.images : [];
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

  const initial: QuestionForm = {
    title: "",
    relatePetId: null,
    content: "",
  };

  const handleSubmit = (data: QuestionForm) => {
    Keyboard.dismiss();
    createQuestion(data, img);
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
        <Formik
          initialValues={initial}
          onSubmit={handleSubmit}
          validationSchema={validQuestionSchema}
        >
          {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
            <QuestionFormContent
              {...{
                values,
                setErrors,
                handleSubmit,
                handleBlur,
                setValues,
              }}
            />
          )}
        </Formik>
        <PostPetSelector
          pet={pet}
          onPress={() => {
            navigation.navigate("PetSelect", {
              backScreen: "CreateQuestion",
            });
          }}
        />
        <MultipleImageSelect
          images={img}
          fromScreen="CreateQuestion"
          onRemove={handleRemove}
        />
      </View>
    </DismissKeyboardView>
  );
};

const QuestionFormContent = ({
  values,
  handleSubmit,
  setErrors,
  handleBlur,
  setValues,
}: {
  values: QuestionForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: QuestionForm) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreateQuestion();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateQuestion">>();
  const pet = params?.pet;

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

  useEffect(() => {
    if (pet) {
      setValues({ ...values, relatePetId: pet.id });
    }
  }, [pet]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.navigate("TabScreen");
    }
  }, [result]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <PendingOverlay pending={pending} />
      <Field
        name="title"
        placeholder={`${t("createNew.input.questionTitlePlaceholder")}...`}
        component={BlankInput}
        autoFocus
      />

      <Field
        name="content"
        placeholder={`${t("createNew.input.questionContentPlaceholder")}...`}
        component={BlankInput}
        autoFocus
        multiline
      />
    </View>
  );
};

export default CreateQuestion;
