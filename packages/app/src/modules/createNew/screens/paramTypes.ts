import { RouteProp } from "@react-navigation/native";
import { ImageFile, EmptySelect } from "../../shared";
import {
  PostTopic,
  ParticiptorPet,
  Pet,
  PostDetail,
  QuestionDetail,
  Answer,
} from "@petfabula/common";

type ParamTypes = {
  ImageSelect: {
    fromScreen: string;
    limit: number | undefined;
  };

  CreatePost: {
    post: PostDetail | undefined;
    images: ImageFile[] | undefined;
    topic: PostTopic | undefined;
    pet: Pet | null | EmptySelect;
  };

  CreateQuestion: {
    question: QuestionDetail | undefined;
    images: ImageFile[] | undefined;
    pet: Pet | null;
  };
  CreateAnswer: {
    answer: Answer | undefined;
    images: ImageFile[] | undefined;
    questionId: number;
    questionTitle: string;
  };

  CreateFeedRecord: {
    pet: Pet | null;
  };

  CreateWeightRecord: {
    pet: Pet | null;
  };

  PetSelect: {
    backScreen: string;
  };

  CreateDisorderRecord: {
    pet: Pet | null;
  };

  SelectPetEventType: {
    pet: Pet | null;
    dismiss: boolean | undefined;
  };

  CreatePetEventRecord: {
    pet: Pet | null;
    type: string;
  };
};

export default ParamTypes;
