import { PetBreed, Pet } from "@petfabula/common";

type ParamTypes = {
  CreatePet: {
    feederId: number;
    breed: PetBreed | undefined | null;
  };

  PetDetailView: {
    petId: number;
  };

  PetRecords: {
    pet: Pet;
  };
};

export default ParamTypes;
