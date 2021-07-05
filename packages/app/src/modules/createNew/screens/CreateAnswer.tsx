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
} from "../../shared";
import {
  AnswerForm,
  useCreateAnswer,
  validAnswerSchema,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";
import MultipleImageSelect from "../components/MultipleImageSelect";

const CreateAnswer = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateAnswer">>();
  const { questionId, questionTitle } = params;
  const { createAnswer } = useCreateAnswer();
  const images = params?.images ? params.images : [];
  const [img, setImg] = useState(images);

  useEffect(() => {
    if (!(JSON.stringify(images) == JSON.stringify(img))) {
      setImg(images);
    }
  }, [images]);

  const handleRemove = (index: number) => {
    img.splice(index, 1);
    setImg([...img]);
  };

  const initial: AnswerForm = {
    questionId: questionId,
    content: "",
  };

  const handleSubmit = (data: AnswerForm) => {
    Keyboard.dismiss();
    // console.log("data", data);
    createAnswer(data, img);
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
          validationSchema={validAnswerSchema}
        >
          {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
            <QuestionFormContent
              {...{
                values,
                setErrors,
                handleSubmit,
                handleBlur,
                setValues,
                questionTitle,
              }}
            />
          )}
        </Formik>
        <MultipleImageSelect
          images={img}
          fromScreen="CreateAnswer"
          onRemove={handleRemove}
        />
        {/* <MultipleImageSelect images={img} fromScreen="CreateQuestion" /> */}
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
  questionTitle,
}: {
  values: AnswerForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: AnswerForm) => void;
  questionTitle: string;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreateAnswer();

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
        placeholder={`${t(
          "createNew.input.answerContentPlaceholder"
        )}@ ${questionTitle.substr(0, 10)}...`}
        component={BlankInput}
        autoFocus
        multiline
      />
    </View>
  );
};

export default CreateAnswer;
