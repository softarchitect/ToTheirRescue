import { commonActionTypes } from './types';

const initialState = {
  counts: {},
  getCountLoading: false,
  getCountSuccess: false,
  actionModalOpen: '',
  getArtifactAttachmentSuccess: false,
  getArtifactAttachmentLoading: false,
  selectedAnimal: { ids: [], animalDetails: [] },
  vaccinationTypeList: [],
  procedureList: [],
  medicineList: [],
};

interface ActionType {
  type: string,
  payload: any,
}

export const commonReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case commonActionTypes.GET_COUNT_LOADING:
      return {
        ...state,
        getCountLoading: true,
        getCountSuccess: false,
      };
    case commonActionTypes.GET_COUNT_SUCCESS:
      return {
        ...state,
        getCountLoading: false,
        getCountSuccess: true,
        counts: action.payload,
      };
    case commonActionTypes.UPLOAD_IMAGE_LOADING:
      return {
        ...state,
        uploadImageLoading: action.payload,
        uploadImageSuccess: false,
      };
    case commonActionTypes.UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        uploadImageLoading: false,
        uploadImageSuccess: true,
      };
    case commonActionTypes.DELETE_IMAGE_LOADING:
      return {
        ...state,
        deleteImageLoading: false,
        deleteImageSuccess: true,
      };
    case commonActionTypes.DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        deleteImageLoading: false,
        deleteImageSuccess: true,
      };

    case commonActionTypes.SET_ANIMAL_ACTION_MODAL:
      return {
        ...state,
        actionModalOpen: action.payload,
      };

    case commonActionTypes.SET_SELECTED_ANIMAL:
      return {
        ...state,
        selectedAnimal: action.payload,
      };

    case commonActionTypes.SET_SELECTED_PCO:
      return {
        ...state,
        selectedPco: action.payload,
      };

    case commonActionTypes.GET_ARRTIFACT_ATTACHMENT_SUCCESS:
      return {
        ...state,
        getArtifactAttachmentSuccess: action.payload,
      };
    case commonActionTypes.GET_ARRTIFACT_ATTACHMENT_LOADING:
      return {
        ...state,
        getArtifactAttachmentLoading: action.payload,
      };

    case commonActionTypes.GET_VACCINATION_TYPE_SUCCESS:
      return {
        ...state,
        vaccinationTypeList: action.payload,
        vaccinationTypeSuccess: true,
        vaccinationTypeLoading: false,
      };
    case commonActionTypes.GET_VACCINATION_TYPE_LOADING:
      return {
        ...state,
        vaccinationTypeSuccess: false,
        vaccinationTypeLoading: true,
      };

    case commonActionTypes.GET_HOSPITAL_CLINIC_SUCCESS:
      return {
        ...state,
        hospitalClinicList: action.payload,
        hospitalClinicSuccess: true,
        hospitalClinicLoading: false,
      };
    case commonActionTypes.GET_HOSPITAL_CLINIC_LOADING:
      return {
        ...state,
        hospitalClinicSuccess: false,
        hospitalClinicLoading: true,
      };

    case commonActionTypes.GET_PROCEDURE_TEST_TREATMENT_SUCCESS:
      return {
        ...state,
        procedureList: action.payload,
        procedureSuccess: true,
        procedureLoading: false,
      };
    case commonActionTypes.GET_PROCEDURE_TEST_TREATMENT_LOADING:
      return {
        ...state,
        procedureSuccess: false,
        procedureLoading: true,
      };

    case commonActionTypes.GET_MEDICINE_LIST_SUCCESS:
      return {
        ...state,
        medicineList: action.payload,
        medicineSuccess: true,
        medicineLoading: false,
      };
    case commonActionTypes.GET_MEDICINE_LIST_LOADING:
      return {
        ...state,
        medicineSuccess: false,
        medicineLoading: true,
      };

    default:
      return state;
  }
};
