import { PetBreed } from "@petfabula/common";

type ParamTypes = {
  CreatePet: {
    feederId: number;
    breed: PetBreed | undefined | null;
  };
};

export default ParamTypes;
