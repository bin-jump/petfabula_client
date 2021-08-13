import { RouteProp } from "@react-navigation/native";
import { ImageFile } from "../../shared";
import { PostTopic, ParticiptorPet, Pet } from "@petfabula/common";

type ParamTypes = {
  ImageSelect: {
    fromScreen: string;
  };

  CreatePost: {
    images: ImageFile[] | undefined;
    topic: PostTopic | undefined;
    pet: Pet | null;
  };

  CreateQuestion: {
    images: ImageFile[] | undefined;
    pet: Pet | null;
  };
  CreateAnswer: {
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
