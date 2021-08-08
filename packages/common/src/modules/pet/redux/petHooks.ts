import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, PetForm } from './types';
import {
  LoadMyPetsActionType,
  LoadFeederPetsActionType,
  CreatePetsActionType,
  LoadPetBreedsActionType,
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
};
