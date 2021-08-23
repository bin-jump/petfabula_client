import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, MedicalRecordForm } from './types';
import {
  CreateMedicalRecordActionType,
  LoadPetMedicalRecordActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

export const useCreateMedicalRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.createMedicalRecord.data,
      pending: state.pet.createMedicalRecord.pending,
      error: state.pet.createMedicalRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: MedicalRecordForm, images: UploadImage[]) => {
      const d = new FormData();
      d.append('record', JSON.stringify(data));
      for (const image of images) {
        if (image) {
          d.append('images', {
            uri: image.uri,
            name: image.name,
            type: image.type,
          } as any);
        }
      }

      dispatch({
        type: CreateMedicalRecordActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createMedicalRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadMeidcalRecords = () => {
  const dispatch = useDispatch();
  const { petId, records, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        petId: state.pet.petMedicalRecords.petId,
        records: state.pet.petMedicalRecords.data,
        pending: state.pet.petMedicalRecords.pending,
        error: state.pet.petMedicalRecords.error,
        hasMore: state.pet.petMedicalRecords.hasMore,
        nextCursor: state.pet.petMedicalRecords.nextCursor,
        initializing: state.pet.petMedicalRecords.initializing,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (petId: number, cursor: object | null) => {
      dispatch({
        type: LoadPetMedicalRecordActionType.BEGIN,
        payload: { petId, cursor },
      });
    },
    [dispatch],
  );

  return {
    petId,
    loadRecords: boundAction,
    records,
    initializing,
    hasMore,
    nextCursor,
    pending,
    error,
  };
};

export const medicalRecordReducer = {
  [CreateMedicalRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createMedicalRecord: {
        ...state.createMedicalRecord,
        pending: true,
        error: null,
      },
    };
  },
  [CreateMedicalRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petPetEventRecords.data;
    return {
      ...state,
      createMedicalRecord: {
        ...state.createMedicalRecord,
        pending: false,
        data: action.payload,
      },
      petMedicalRecords: {
        ...state.petMedicalRecords,
        data:
          state.petMedicalRecords.petId == action.payload.petId
            ? [action.payload, ...records]
            : records,
      },
    };
  },
  [CreateMedicalRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createMedicalRecord: {
        ...state.createMedicalRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  // load
  [LoadPetMedicalRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petMedicalRecords: {
        ...state.petMedicalRecords,
        initializing: action.payload.cursor == null,
        pending: true,
        error: action.error,
      },
    };
  },
  [LoadPetMedicalRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petMedicalRecords: {
        petId: action.extra.petId,
        ...fillCursorResponseData(state.petMedicalRecords, action),
      },
    };
  },
  [LoadPetMedicalRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petMedicalRecords: {
        ...state.petMedicalRecords,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
