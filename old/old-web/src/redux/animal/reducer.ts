import { animalActionTypes } from './types';

const initialState = {
  getAnimalListLoading: false,
  getAnimalListSuccess: false,
  animalList: [],
  currentPage: 0,
  allAnimalCount: 0,
  totalPage: 0,
  selectedId: [],
  addAnimalLoading: false,
  addAnimalSuccess: false,
  updateAnimalLoading: false,
  updateAnimalSuccess: false,
  getAnimalMilestoneListLoading: false,
  getAnimalMilestoneListSuccess: false,
  updateAnimalMilestoneListSuccess: false,
  animalMilestoneList: [],
  addAnimalMilestoneLoading: false,
  addAnimalMilestoneSuccess: false,
  deleteAnimalMilestoneLoading: false,
  deleteAnimalMilestoneSuccess: false,
};

interface ActionType {
  type: string,
  payload: any,
}

export const animalReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case animalActionTypes.SET_RECENTLY_ADDED_ANIMAL:
      return {
        ...state,
        getAnimalListLoading: false,
        getAnimalListSuccess: true,
        currentPage: 1,
        allAnimalCount: action.payload.length,
        totalPage: action.payload.length,
        animalList: action.payload,
      };
    case animalActionTypes.GET_ANIMAL_LIST_LOADING:
      return {
        ...state,
        getAnimalListLoading: action.payload,
        getAnimalListSuccess: false,
      };
    case animalActionTypes.GET_ANIMAL_LIST_SUCCESS:
      return {
        ...state,
        getAnimalListLoading: false,
        getAnimalListSuccess: true,
        currentPage: action.payload.currentPage,
        allAnimalCount: action.payload.totalItems,
        totalPage: action.payload.totalPage,
        animalList: (action.payload.currentPage === 1) ? action.payload.animalsList : [...state?.animalList, ...action.payload.animalsList],
      };
    case animalActionTypes.GET_ANIMAL_SUGGESTION_LIST_LOADING:
      return {
        ...state,
        getAnimalSuggestionListLoading: true,
        getAnimalSuggestionListSuccess: false,
      };
    case animalActionTypes.GET_ANIMAL_SUGGESTION_LIST_SUCCESS:
      return {
        ...state,
        getAnimalSuggestionListLoading: false,
        getAnimalSuggestionListSuccess: true,
        animalSuggestionList: action.payload.animalList,
      };
    case animalActionTypes.ADD_ANIMAL_LOADING:
      return {
        ...state,
        addAnimalLoading: true,
        addAnimalSuccess: false,
      };
    case animalActionTypes.ADD_ANIMAL_SUCCESS:
      return {
        ...state,
        addAnimalLoading: false,
        addAnimalSuccess: true,
        selectedId: action.payload,
      };
    case animalActionTypes.UPDATE_ANIMAL_LOADING:
      return {
        ...state,
        updateAnimalLoading: true,
        updateAnimalSuccess: false,
      };
    case animalActionTypes.UPDATE_ANIMAL_SUCCESS:
      return {
        ...state,
        updateAnimalLoading: false,
        updateAnimalSuccess: true,
        animalList: state?.animalList.map((data: any) => {
          if (action?.payload?.id === data?.id) {
            return action.payload;
          }
          return data;
        }),
      };
    case animalActionTypes.UPDATE_ANIMAL_LOCATION_SUCCESS:
      return {
        ...state,
        updateAnimalLoading: false,
        updateAnimalSuccess: true,
        animalList: state?.animalList.map((data: any) => {
          if (action?.payload?.ids.includes(data?.id)) {
            return { ...data, location: action.payload.location };
          }
          return data;
        }),
      };
    case animalActionTypes.DELETE_ANIMAL_LOADING:
      return {
        ...state,
        deleteAnimalLoading: true,
        deleteAnimalSuccess: false,
      };
    case animalActionTypes.DELETE_ANIMAL_SUCCESS:
      return {
        ...state,
        deleteAnimalLoading: false,
        deleteAnimalSuccess: true,
        allAnimalCount: state?.allAnimalCount - 1,
        totalPage: parseInt(((state?.allAnimalCount - 1) / 15) as any, 10) + (((state?.allAnimalCount - 1) % 15 === 0) ? 0 : 1),
        animalList: state?.animalList.filter((data: any) => (data?.id !== action?.payload)),
      };
    case animalActionTypes.GET_ANIMAL_MILESTONE_LIST_LOADING:
      return {
        ...state,
        getAnimalMilestoneListLoading: true,
        getAnimalMilestoneListSuccess: false,
      };
    case animalActionTypes.GET_ANIMAL_MILESTONE_LIST_SUCCESS:
      return {
        ...state,
        getAnimalMilestoneListLoading: false,
        getAnimalMilestoneListSuccess: true,
        animalMilestoneList: action.payload.animalMilestones,
      };
    case animalActionTypes.UPDATE_ANIMAL_MILESTONE_LOADING:
      return {
        ...state,
        updateAnimalMilestoneLoading: true,
        updateAnimalMilestoneSuccess: false,
      };
    case animalActionTypes.UPDATE_ANIMAL_MILESTONE_SUCCESS:
      return {
        ...state,
        updateAnimalMilestoneLoading: false,
        updateAnimalMilestoneSuccess: true,
      };
    case animalActionTypes.DELETE_ANIMAL_MILESTONE_LOADING:
      return {
        ...state,
        deleteAnimalMilestoneLoading: true,
        deleteAnimalMilestoneSuccess: false,
      };
    case animalActionTypes.DELETE_ANIMAL_MILESTONE_SUCCESS:
      return {
        ...state,
        deleteAnimalMilestoneLoading: false,
        deleteAnimalMilestoneSuccess: true,
      };
    case animalActionTypes.ADD_ANIMAL_MILESTONE_LOADING:
      return {
        ...state,
        addAnimalMilestoneLoading: true,
        addAnimalMilestoneSuccess: false,
      };
    case animalActionTypes.ADD_ANIMAL_MILESTONE_SUCCESS:
      return {
        ...state,
        addAnimalMilestoneLoading: false,
        addAnimalMilestoneSuccess: true,
      };
    default:
      return {
        ...state,
      };
  }
};
