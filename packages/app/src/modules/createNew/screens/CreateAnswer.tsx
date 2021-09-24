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
  useUpdateAnswer,
  validAnswerSchema,
  DisplayImage,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";
import MultipleImageSelect from "../components/MultipleImageSelect";

const CreateAnswer = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateAnswer">>();
  const { questionId, questionTitle } = params;
  const answer = params?.answer;
  const { createAnswer } = useCreateAnswer();
  const { updateAnswer } = useUpdateAnswer();
  const images = params?.images ? params.images : [];
  const [img, setImg] = useState(images);
  const [existImages, setExistImages] = useState<DisplayImage[]>(
    answer ? answer.images : []
  );

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

  const initial: AnswerForm = answer
    ? { questionId: questionId, content: answer.content }
    : {
        questionId: questionId,
        content: "",
      };

  const handleUpdate = (data: AnswerForm) => {
    if (answer) {
      const d = {
        ...answer,
        ...data,
        images: existImages,
      };
      updateAnswer(d, img);
    }
  };

  const handleCreate = (data: AnswerForm) => {
    createAnswer(data, img);
  };

  const handleSubmit = (data: AnswerForm) => {
    Keyboard.dismiss();
    if (answer) {
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
          existImages={existImages}
          handleExistImageRemove={handleRemoveExistImage}
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
  const { pending: updatePending, result: updateResult } = useUpdateAnswer();

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
