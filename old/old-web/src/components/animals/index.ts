import { connect } from 'react-redux';
import { Animals } from './FtrAnimals';
import {
  addAnimalCall, setRecentlyAddedAnimal, getAnimalListCall, updateAnimalCall, deleteAnimalCall, getAnimalMilestoneListCall, addAnimalMilestoneListCall,
} from '../../redux/animal/action';
import {
  uploadImageCall,
  deleteImageCall,
  setAnimalActionModalState,
  setSelectedAnimal,
  getVaccinationTypeCall,
  getHospitalClinicCall,
  getProcedureTestTreatmentCall,
  getMedicineCall,
} from '../../redux/common/action';
import {
  setSelectedPco,
} from '../../redux/pco/action';

const mapStateToProps = (state: any) => ({
  getAnimalListLoading: state.animal.getAnimalListLoading,
  getAnimalListSuccess: state.animal.getAnimalListSuccess,
  animalList: state.animal.animalList,
  selectedAnimal: state.common.selectedAnimal,
  selectedPcoId: state.pco.selectedId,
  addAnimalLoading: state.animal.addAnimalLoading,
  addAnimalSuccess: state.animal.addAnimalSuccess,
  updateAnimalLoading: state.animal.updateAnimalLoading,
  updateAnimalSuccess: state.animal.updateAnimalSuccess,
  totalNumber: state.animal.allAnimalCount,
  currentPage: state.animal.currentPage,
  pcoList: state.pco.pcoList,
  actionModalOpen: state.common.actionModalOpen,
  animalMilestoneList: state.animal.animalMilestoneList,
  permissions: state.auth.permissions,
  role: state.auth.permissions,
  roleType: state.auth.userType,
  vaccinationTypeList: state.common.vaccinationTypeList,
  procedureList: state.common.procedureList,
  hospitalClinicList: state.common.hospitalClinicList,
  medicineList: state.common.medicineList,
});

const mapDispatchToProps = (dispatch: any) => ({
  addAnimalCall: (data: any, callbackFunction: () => void) => dispatch(addAnimalCall(data, callbackFunction)),
  setRecentlyAddedAnimal: (data: any, callbackFunction: () => void) => dispatch(setRecentlyAddedAnimal(data, callbackFunction)),
  setSelectedPcoId: (data: any) => dispatch(setSelectedPco(data)),
  setSelectedAnimal: (data: any) => dispatch(setSelectedAnimal(data)),
  getAnimalListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalListCall(data, callbackFunction)),
  getAnimalListSuggestionCall: (data: any, callbackFunction: () => void) => dispatch(addAnimalCall(data, callbackFunction)),
  updateAnimalCall: (data: any, callbackFunction: () => void) => dispatch(updateAnimalCall(data, callbackFunction)),
  deleteAnimalCall: (data: any, callbackFunction: () => void) => dispatch(deleteAnimalCall(data, callbackFunction)),
  getAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalMilestoneListCall(data, callbackFunction)),
  uploadImageCall: (data: any, callbackFunction: () => void) => dispatch(uploadImageCall(data, callbackFunction)),
  deleteImageCall: (data: any, callbackFunction: () => void) => dispatch(deleteImageCall(data, callbackFunction)),
  setActionModal: (data: any, callbackFunction: () => void) => dispatch(setAnimalActionModalState(data, callbackFunction)),
  addAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(addAnimalMilestoneListCall(data, callbackFunction)),
  getVaccinationTypeCall: (data: any, callbackFunction: () => void) => dispatch(getVaccinationTypeCall(data, callbackFunction)),
  getHospitalClinicCall: (data: any, callbackFunction: () => void) => dispatch(getHospitalClinicCall(data, callbackFunction)),
  getProcedureTestTreatmentCall: (data: any, callbackFunction: () => void) => dispatch(getProcedureTestTreatmentCall(data, callbackFunction)),
  getMedicineListCall: (data: any, callbackFunction: () => void) => dispatch(getMedicineCall(data, callbackFunction)),
  getVaccinationTypeListCall: (data: any, callbackFunction: () => void) => dispatch(getVaccinationTypeCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Animals);
