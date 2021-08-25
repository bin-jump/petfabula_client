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
  photo: string;
  birthday: number;
  gender: PetGender;
  category: string;
  breed: string;
  breedId: number;
  bio: string;
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
  dateTime: number;
  disorderType: string | null;
  content: string;
  images: DisplayImage[];
  //   createDate: number;
}

export interface FeedRecord {
  id: number;
  petId: number;
  dateTime: number;
  amount: number;
  foodContent: string;
  note: string;
  //   createDate: number;
}

export interface MedicalRecord {
  id: number;
  petId: number;
  dateTime: number;
  hospitalName: string;
  diagnosis: string;
  symptom: string;
  treatment: string;
  note: string;
  images: DisplayImage[];
  // createDate: number;
}

export interface PetEventRecord {
  id: number;
  petId: number;
  dateTime: number;
  eventType: string;
  content: string;
  images: DisplayImage[];
  // createDate: number;
}

export interface WeightRecord {
  id: number;
  petId: number;
  dateTime: number;
  weight: number;
}

export interface PetForm {
  name: string;
  birthday: number | null;
  arrivalDay: number | null;
  gender: PetGender | null;
  breedId: number | null;
  bio: string;
}

export interface FeedRecordForm {
  petId: number;
  amount: number;
  foodContent: string;
  dateTime: number;
  note: string;
}

export interface WeightRecordForm {
  petId: number;
  weight: number;
  dateTime: number;
}

export interface DisorderRecordForm {
  petId: number;
  disorderType: string | null;
  dateTime: number;
  content: string;
}

export interface PetEventRecordForm {
  petId: number;
  eventType: string;
  dateTime: number;
  content: string;
}

export interface MedicalRecordForm {
  petId: number;
  dateTime: number;
  hospitalName: string;
  symptom: string;
  diagnosis: string;
  treatment: string;
  note: string;
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

  pet: AsyncDataBase<Pet>;

  petDisorderRecords: AsyncCursorPageListBase<DisorderRecord> & {
    petId: number | null;
  };
  petFeedRecords: AsyncCursorPageListBase<FeedRecord> & {
    petId: number | null;
  };
  petMedicalRecords: AsyncCursorPageListBase<MedicalRecord> & {
    petId: number | null;
  };
  petPetEventRecords: AsyncCursorPageListBase<PetEventRecord> & {
    petId: number | null;
  };
  petWeightRecords: AsyncCursorPageListBase<WeightRecord> & {
    petId: number | null;
  };
}