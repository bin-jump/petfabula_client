import { RouteProp } from "@react-navigation/native";
import { ImageFile, EmptySelect } from "../../shared";
import {
  PostTopic,
  Pet,
  PostDetail,
  QuestionDetail,
  Answer,
  PetBreed,
  PetDetail,
  FeedRecord,
  DisorderRecord,
  MedicalRecord,
  PetEventRecord,
  WeightRecord,
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

  CreatePet: {
    pet: PetDetail;
    breed: PetBreed | undefined | null;
  };

  CreateFeedRecord: {
    pet: Pet | null;
    record: FeedRecord | undefined;
  };

  CreateWeightRecord: {
    pet: Pet | null;
    record: WeightRecord | undefined;
  };

  PetSelect: {
    backScreen: string;
  };

  CreateDisorderRecord: {
    pet: Pet | null;
    record: DisorderRecord | undefined;
  };

  CreateMedicalRecord: {
    pet: Pet | null;
    record: MedicalRecord | undefined;
  };

  SelectPetEventType: {
    pet: Pet | null;
    dismiss: boolean | undefined;
  };

  CreatePetEventRecord: {
    pet: Pet | null;
    record: PetEventRecord | undefined;
    type: string;
  };
};

export default ParamTypes;
