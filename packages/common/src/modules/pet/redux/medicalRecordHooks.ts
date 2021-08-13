import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, MedicalRecordForm } from './types';
import { CreateMedicalRecordActionType } from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

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
    const records = state.myPetPetEventRecords.data;
    return {
      ...state,
      createMedicalRecord: {
        ...state.createMedicalRecord,
        pending: false,
        data: action.payload,
      },
      myPetMedicalRecords: {
        ...state.myPetMedicalRecords,
        data: records ? [action.payload, ...records] : records,
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
};
