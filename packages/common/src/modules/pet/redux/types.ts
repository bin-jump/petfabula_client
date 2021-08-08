import {
  AsyncDataBase,
  AsyncListBase,
  AsyncCursorPageListBase,
  DisplayImage,
} from '../../shared';

// type PetType = 'DOG' | 'CAT' | 'RABBIT' | 'BIRD' | 'OTHER' ;
type PetGender = 'MALE' | 'FEMALE' | 'UNSET';

export interface PetBreed {
  id: number;
  categoryId: number;
  category: string;
  name: string;
}

export interface Pet {
  id: number;
  feederId: number;
  name: string;
  photo: string | null;
  birthday: number;
  gender: PetGender;
  category: string;
  breed: string;
  breedId: number;
}

export interface PetDetail extends Pet {
  weight: number | null;
  arrivalDay: number;
  feedRecordCount: number;
  disorderRecordCount: number;
  medicalRecordCount: number;
  weightRecordCount: number;
  eventRecordCount: number;
}

export interface DisorderRecord {
  id: number;
  petId: number;
  date: number;
  disorderType: string;
  note: string;
  images: DisplayImage[];
  //   createDate: number;
}

export interface FeedRecord {
  id: number;
  petId: number;
  date: number;
  amount: number;
  foodContent: string;
  note: string;
  //   createDate: number;
}

export interface MedicalRecord {
  id: number;
  petId: number;
  date: number;
  hospitalName: string;
  symptom: string;
  treatment: string;
  note: string;
  images: DisplayImage[];
  // createDate: number;
}

export interface PetEventRecord {
  id: number;
  petId: number;
  date: number;
  eventType: string;
  note: string;
  images: DisplayImage[];
  // createDate: number;
}

export interface WeightRecord {
  id: number;
  petId: number;
  date: number;
  weight: number;
}

export interface PetForm {
  name: string;
  weight: number | null;
  birthday: number | null;
  arrivalDay: number | null;
  gender: PetGender | null;
  breedId: number | null;
  bio: string;
}

export interface PetState {
  myPets: AsyncListBase<PetDetail>;
  feederPets: AsyncListBase<Pet> & {
    feederId: number | null;
  };

  petBreeds: AsyncListBase<PetBreed>;

  createPet: AsyncDataBase<PetDetail>;
  createDisorderRecord: AsyncDataBase<DisorderRecord>;
  createFeedRecord: AsyncDataBase<FeedRecord>;
  createMedicalRecord: AsyncDataBase<MedicalRecord>;
  createPetEventRecord: AsyncDataBase<PetEventRecord>;
  createWeightRecord: AsyncDataBase<WeightRecord>;

  myPetDisorderRecords: AsyncCursorPageListBase<DisorderRecord> & {
    petId: number | null;
  };
  myPetFeedRecords: AsyncCursorPageListBase<FeedRecord> & {
    petId: number | null;
  };
  myPetMedicalRecords: AsyncCursorPageListBase<MedicalRecord> & {
    petId: number | null;
  };
  myPetPetEventRecords: AsyncCursorPageListBase<PetEventRecord> & {
    petId: number | null;
  };
  myPetWeightRecords: AsyncCursorPageListBase<WeightRecord> & {
    petId: number | null;
  };
}
