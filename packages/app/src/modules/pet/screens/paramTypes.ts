import { PetBreed } from "@petfabula/common";

type ParamTypes = {
  CreatePet: {
    feederId: number;
    breed: PetBreed | undefined | null;
  };

  PetDetailView: {
    petId: number;
  };
};

export default ParamTypes;
