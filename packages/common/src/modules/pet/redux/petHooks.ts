import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, PetForm, PetDetail } from './types';
import {
  LoadMyPetsActionType,
  LoadFeederPetsActionType,
  CreatePetsActionType,
  LoadPetBreedsActionType,
  LoadPetActionType,
  UpdatePetActionType,
  RemovePetActionType,
} from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

export const useCreatePet = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.createPet.data,
      pending: state.pet.createPet.pending,
      error: state.pet.createPet.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (petForm: PetForm, image: UploadImage | null) => {
      const d = new FormData();
      d.append('pet', JSON.stringify(petForm));
      if (image) {
        d.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as any);
      }

      dispatch({
        type: CreatePetsActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createPet: boundAction,
    result,
    pending,
    error,
  };
};

export const useUpdatePet = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.editPet.data,
      pending: state.pet.editPet.pending,
      error: state.pet.editPet.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (pet: PetDetail, image: UploadImage | null) => {
      const d = new FormData();
      d.append('pet', JSON.stringify(pet));
      if (image) {
        d.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as any);
      }

      dispatch({
        type: UpdatePetActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updatePet: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemovePet = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.removePet.data,
      pending: state.pet.removePet.pending,
      error: state.pet.removePet.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (petId: number) => {
      dispatch({
        type: RemovePetActionType.BEGIN,
        payload: { petId },
      });
    },
    [dispatch],
  );

  return {
    removePet: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadMyPets = () => {
  const dispatch = useDispatch();
  const { pets, pending, error } = useSelector(
    (state: AppState) => ({
      pets: state.pet.myPets.data,
      pending: state.pet.myPets.pending,
      error: state.pet.myPets.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadMyPetsActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadPets: boundAction,
    pets,
    pending,
    error,
  };
};

export const useLoadUserPets = () => {
  const dispatch = useDispatch();
  const { pets, feederId, pending, error } = useSelector(
    (state: AppState) => ({
      feederId: state.pet.feederPets.feederId,
      pets: state.pet.feederPets.data,
      pending: state.pet.feederPets.pending,
      error: state.pet.feederPets.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (feederId: number) => {
      dispatch({
        type: LoadFeederPetsActionType.BEGIN,
        payload: { feederId },
      });
    },
    [dispatch],
  );

  return {
    feederId,
    loadPets: boundAction,
    pets,
    pending,
    error,
  };
};

export const useLoadPetBreeds = () => {
  const dispatch = useDispatch();
  const { petBreeds, pending, error } = useSelector(
    (state: AppState) => ({
      petBreeds: state.pet.petBreeds.data,
      pending: state.pet.petBreeds.pending,
      error: state.pet.petBreeds.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch({
      type: LoadPetBreedsActionType.BEGIN,
    });
  }, [dispatch]);

  return {
    loadPetBreeds: boundAction,
    petBreeds,
    pending,
    error,
  };
};

export const useLoadPet = () => {
  const dispatch = useDispatch();
  const { pet, pending, error } = useSelector(
    (state: AppState) => ({
      pet: state.pet.pet.data,
      pending: state.pet.pet.pending,
      error: state.pet.pet.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (petId: number) => {
      dispatch({
        type: LoadPetActionType.BEGIN,
        payload: { petId },
      });
    },
    [dispatch],
  );

  return {
    loadPet: boundAction,
    pet,
    pending,
    error,
  };
};

export const petReducer = {
  // create pet
  [CreatePetsActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createPet: {
        ...state.createPet,
        pending: true,
        error: null,
      },
    };
  },
  [CreatePetsActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createPet: {
        ...state.createPet,
        data: action.payload,
        pending: false,
      },
      myPets: {
        ...state.myPets,
        data: [...state.myPets.data, action.payload],
      },
    };
  },
  [CreatePetsActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createPet: {
        ...state.createPet,
        pending: false,
        error: action.error,
      },
    };
  },

  // update pet
  [UpdatePetActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      editPet: {
        ...state.editPet,
        pending: true,
        error: null,
      },
    };
  },
  [UpdatePetActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const myPets = state.myPets.data;
    const pet = action.payload as PetDetail;
    const fetchedPet = state.pet.data;
    return {
      ...state,
      editPet: {
        ...state.editPet,
        data: action.payload,
        pending: false,
      },
      myPets: {
        ...state.myPets,
        data: myPets.map((item) => {
          if (item.id == pet.id) {
            return { ...item, ...pet };
          }
          return item;
        }),
      },
      pet: {
        ...state.pet,
        data: fetchedPet?.id == pet.id ? pet : fetchedPet,
      },
    };
  },
  [UpdatePetActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      editPet: {
        ...state.editPet,
        pending: false,
        error: action.error,
      },
    };
  },

  // remove pet
  [RemovePetActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removePet: {
        ...state.removePet,
        pending: true,
        error: null,
      },
    };
  },
  [RemovePetActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removePet: {
        ...state.removePet,
        data: action.payload,
        pending: false,
      },
      myPets: {
        ...state.myPets,
        data: state.myPets.data.filter((item) => item.id != action.payload.id),
      },
    };
  },
  [RemovePetActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removePet: {
        ...state.removePet,
        pending: false,
        error: action.error,
      },
    };
  },

  // my pets
  [LoadMyPetsActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      myPets: {
        ...state.myPets,
        pending: true,
        error: null,
      },
    };
  },
  [LoadMyPetsActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      myPets: {
        ...state.myPets,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadMyPetsActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      myPets: {
        ...state.myPets,
        pending: false,
        error: action.error,
      },
    };
  },

  // feeder pets
  [LoadFeederPetsActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      feederPets: {
        ...state.feederPets,
        pending: true,
        error: null,
      },
    };
  },
  [LoadFeederPetsActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      feederPets: {
        ...state.feederPets,
        feederId: action.extra.feederId,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadFeederPetsActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      feederPets: {
        ...state.feederPets,
        pending: false,
        error: action.error,
      },
    };
  },

  // pet breeds
  [LoadPetBreedsActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petBreeds: {
        ...state.petBreeds,
        pending: true,
        error: null,
      },
    };
  },
  [LoadPetBreedsActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petBreeds: {
        ...state.petBreeds,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadPetBreedsActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petBreeds: {
        ...state.petBreeds,
        pending: false,
        error: action.error,
      },
    };
  },

  // pet
  [LoadPetActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      pet: {
        ...state.pet,
        pending: true,
        error: null,
      },
    };
  },
  [LoadPetActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      pet: {
        ...state.pet,
        data: action.payload,
        pending: false,
      },
    };
  },
  [LoadPetActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      pet: {
        ...state.pet,
        pending: false,
        error: action.error,
      },
    };
  },
};
