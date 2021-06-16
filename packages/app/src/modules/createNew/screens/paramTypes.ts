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
};

export default ParamTypes;
