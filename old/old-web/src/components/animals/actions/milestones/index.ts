/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import { setSelectedPco } from '../../../../redux/pco/action';
import {
  getAnimalMilestoneListCall,
  updateAnimalMilestoneListCall,
  addAnimalMilestoneListCall,
  getAnimalListCall,
  deleteAnimalMilestoneListCall,
} from '../../../../redux/animal/action';
import { AnimalMilestone } from './AnimalMilestone';

const mapStateToProps = (state: any) => ({
  getAnimalListLoading: state.animal.getAnimalListLoading,
  getAnimalMilestoneListLoading: state.animal.getAnimalMilestoneListLoading,
  updateAnimalMilestoneLoading: state.animal.updateAnimalMilestoneLoading,
  animalMilestoneList: state.animal.animalMilestoneList,
  addAnimalMilestoneLoading: state.animal.addAnimalMilestoneLoading,
  selectedAnimal: state.common.selectedAnimal,
  animalList: state.animal.animalList,
  selectedPcoId: state.pco.selectedId,
  permissions: state.auth.permissions,
  role: state.auth.userType,
  pcoList: state.pco.pcoList,
});

const mapDispatchToProps = (dispatch: any) => ({
  getAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalMilestoneListCall(data, callbackFunction)),
  updateAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(updateAnimalMilestoneListCall(data, callbackFunction)),
  setSelectedPco: (data: any) => dispatch(setSelectedPco(data)),
  addAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(addAnimalMilestoneListCall(data, callbackFunction)),
  getAnimalListCall: (data: any, callbackFunction: () => void) => dispatch(getAnimalListCall(data, callbackFunction)),
  deleteAnimalMilestoneListCall: (data: any, callbackFunction: () => void) => dispatch(deleteAnimalMilestoneListCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalMilestone);
