/* eslint-disable no-unused-vars */
import { message } from 'antd';
import { apiCall } from '../../shared/api/apiWrapper';
import { commonActionTypes } from './types';

const getCountLoading = (data: any) => ({
  type: commonActionTypes.GET_COUNT_LOADING,
  payload: data,
});

const getCountSuccess = (data: any) => ({
  type: commonActionTypes.GET_COUNT_SUCCESS,
  payload: data,
});

const getArtifactSuccess = (data: any) => ({
  type: commonActionTypes.GET_ARRTIFACT_ATTACHMENT_SUCCESS,
  payload: data,
});

const getArtifactLoading = (data: any) => ({
  type: commonActionTypes.GET_ARRTIFACT_ATTACHMENT_LOADING,
  payload: data,
});

export const getCountCall = (data: any, callbackFunction: () => void) => {
  console.log(data);

  return (dispatch: any, getSate: any) => {
    dispatch(getCountLoading(true));
    apiCall('dashboard/get-count', 'GET', data)
      .then((resp: any) => {
        dispatch(getCountLoading(false));
        if (resp?.status !== 200) {
          getCountSuccess(false);
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        dispatch(getCountSuccess(resp?.data?.data));
        callbackFunction();
      });
  };
};

export const setUploadImageLoading = (data: any) => ({
  type: commonActionTypes.UPLOAD_IMAGE_LOADING,
  payload: data,
});

const uploadImageSuccess = (data: any) => ({
  type: commonActionTypes.UPLOAD_IMAGE_SUCCESS,
  payload: data,
});

export const uploadImageCall = (data: any, callbackFunction: (resp?: any) => void) => {
  const {
    imageState, animalId, pcoId, entity, publicityRank, attachmentType, notes = '',
    description = '', isEdit, attachmentId, tenantId, attachmentDate, notShowSuccessAlert = false,
  } = data;

  let url: string;

  return (dispatch: any, getSate: any) => {
    dispatch(setUploadImageLoading(true));
    const newFormData = new FormData();

    if (pcoId) {
      newFormData.set('pcoId', pcoId);
    }
    if (animalId) {
      if (animalId.length > 1) {
        url = 'artifact-attachment/create-maultiple-artifactattachment';
        // eslint-disable-next-line array-callback-return
        animalId.map((id: any) => {
          newFormData.append('ListAnimalId', id);
        });
      } else {
        newFormData.set('animalId', animalId);
      }
    }
    newFormData.set('Entity', entity);
    newFormData.set('PublicityRank', publicityRank);
    newFormData.set('AttachmentDate', attachmentDate?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
    newFormData.set('AttachmentType', attachmentType);
    newFormData.set('notes', notes);
    newFormData.set('description', description);
    if (tenantId) {
      newFormData.set('TenantId', tenantId);
    }
    if (isEdit) {
      url = `artifact-attachment/update-artifactattachment/${attachmentId}`;
      apiCall(url, 'PUT', newFormData)
        .then((resp: any) => {
          dispatch(setUploadImageLoading(false));
          if (resp.status !== 200) {
            resp?.data?.message && message.error({
              content: resp?.data?.message,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          callbackFunction(resp?.data);
          notShowSuccessAlert && resp?.data?.message && message.success({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        });
    } else {
      newFormData.set('Imagefiles', imageState);
      url = 'artifact-attachment/create-artifactattachment';
      apiCall(url, 'POST', newFormData)
        .then((resp: any) => {
          dispatch(setUploadImageLoading(false));
          if (resp.status !== 200) {
            resp?.data?.message && message.error({
              content: resp?.data?.message,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          callbackFunction(resp?.data);
          !notShowSuccessAlert && resp?.data?.message && message.success({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        });
    }
  };
};

const deleteImageLoading = (data: any) => ({
  type: commonActionTypes.DELETE_IMAGE_LOADING,
  payload: data,
});

const deleteImageSuccess = (data: any) => ({
  type: commonActionTypes.DELETE_IMAGE_SUCCESS,
  payload: data,
});

export const deleteImageCall = (data: any, callbackFunction: () => void) => {
  const {
    id,
  } = data;

  return (dispatch: any, getSate: any) => {
    if (!id) {
      return;
    }

    dispatch(deleteImageLoading(true));
    apiCall(`artifact-attachment/delete-artifactattachment/${id}`, 'PATCH', {})
      .then((resp: any) => {
        dispatch(deleteImageSuccess(resp?.data?.data?.id));
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction();
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };
};

const setAnimalActionModal = (data: any) => ({
  type: commonActionTypes.SET_ANIMAL_ACTION_MODAL,
  payload: data,
});

export const setSelectedAnimal = (data: any) => ({
  type: commonActionTypes.SET_SELECTED_ANIMAL,
  payload: data,
});

export const setSelectedPco = (data: any) => ({
  type: commonActionTypes.SET_SELECTED_PCO,
  payload: data,
});

// eslint-disable-next-line arrow-body-style
export const setAnimalActionModalState = (data: any, callbackFunction: () => void) => {
  return (dispatch: any, getSate: any) => {
    dispatch(setAnimalActionModal(data));
  };
};

const getVaccinationTypeSuccess = (data: any) => ({
  type: commonActionTypes.GET_VACCINATION_TYPE_SUCCESS,
  payload: data,
});

const getVaccinationTypeLoading = (data: any) => ({
  type: commonActionTypes.GET_VACCINATION_TYPE_LOADING,
  payload: data,
});

export const getVaccinationTypeCall = (animalTypeId: any, callbackFunction: () => void) => (dispatch: any, getSate: any) => {
  dispatch(getVaccinationTypeLoading(true));
  apiCall(`vaccination-type/get-vaccination-type-by-animalId?animalTypeId=${animalTypeId}`, 'GET', {})
    .then((resp: any) => {
      if (resp?.data?.success) {
        dispatch(getVaccinationTypeLoading(false));
        const currentResponse = resp?.data?.data?.vaccinationTypes;
        dispatch(getVaccinationTypeSuccess(currentResponse));
        callbackFunction();
      }
      if (resp?.status !== 200) {
        getVaccinationTypeSuccess(false);
        resp?.data?.message && message.error({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      }
    });
};

const getHospitalClinicSuccess = (data: any) => ({
  type: commonActionTypes.GET_HOSPITAL_CLINIC_SUCCESS,
  payload: data,
});

const getHospitalClinicLoading = (data: any) => ({
  type: commonActionTypes.GET_HOSPITAL_CLINIC_LOADING,
  payload: data,
});

export const getHospitalClinicCall = (data: any, callbackFunction: () => void) => (dispatch: any, getSate: any) => {
  dispatch(getHospitalClinicLoading(true));
  apiCall('PCO/get-pco-hospitals', 'GET', {})
    .then((resp: any) => {
      if (resp?.data?.success) {
        dispatch(getHospitalClinicLoading(false));
        const currentResponse = resp?.data?.data?.pcoHospitals;
        dispatch(getHospitalClinicSuccess(currentResponse));
        callbackFunction();
      }
      if (resp?.status !== 200) {
        getHospitalClinicSuccess(false);
        resp?.data?.message && message.error({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      }
    });
};

const getProcedureTestTreatmentSuccess = (data: any) => ({
  type: commonActionTypes.GET_PROCEDURE_TEST_TREATMENT_SUCCESS,
  payload: data,
});

const getProcedureTestTreatmentLoading = (data: any) => ({
  type: commonActionTypes.GET_PROCEDURE_TEST_TREATMENT_LOADING,
  payload: data,
});

export const getProcedureTestTreatmentCall = (animalTypeId: any, callbackFunction: () => void) => (dispatch: any, getSate: any) => {
  if (!animalTypeId) {
    return;
  }
  dispatch(getProcedureTestTreatmentLoading(true));
  apiCall(`health-procedure/get-health-procedure-by-animalId?animalTypeId=${animalTypeId}`, 'GET', {})
    .then((resp: any) => {
      if (resp?.data?.success) {
        dispatch(getProcedureTestTreatmentLoading(false));
        const currentResponse = resp?.data?.data?.healthProcedures;
        dispatch(getProcedureTestTreatmentSuccess(currentResponse));
        callbackFunction();
      }
      if (resp?.status !== 200) {
        getProcedureTestTreatmentSuccess(false);
        resp?.data?.message && message.error({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      }
    });
};

const getMedicineSuccess = (data: any) => ({
  type: commonActionTypes.GET_MEDICINE_LIST_SUCCESS,
  payload: data,
});

const getMedicineLoading = (data: any) => ({
  type: commonActionTypes.GET_MEDICINE_LIST_LOADING,
  payload: {},
});

export const getMedicineCall = (data: any, callbackFunction: () => void) => (dispatch: any, getSate: any) => {
  dispatch(getMedicineLoading(true));
  apiCall('medicine/get-medicine', 'GET', {})
    .then((resp: any) => {
      if (resp?.data?.success) {
        dispatch(getMedicineLoading(false));
        const currentResponse = resp?.data?.data?.medicines;
        dispatch(getMedicineSuccess(currentResponse));
        callbackFunction();
      }
      if (resp?.status !== 200) {
        getMedicineSuccess(false);
        resp?.data?.message && message.error({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      }
    });
};
