import { RouteProp } from "@react-navigation/native";
import { ImageFile } from "../../shared";
import { PostTopic, ParticiptorPet } from "@petfabula/common";

type ParamTypes = {
  ImageSelect: {
    fromScreen: string;
  };

  CreatePost: {
    images: ImageFile[] | undefined;
    topic: PostTopic | undefined;
    pet: ParticiptorPet | undefined;
  };

  CreateQuestion: {
    images: ImageFile[] | undefined;
  };
  CreateAnswer: {
    images: ImageFile[] | undefined;
    questionId: number;
    questionTitle: string;
  };
};

export default ParamTypes;
