/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * All types goes first
*/
export type EntityType = 'Person' | 'CorO';
export type TableFilterTypes = 'all' | EntityType;

/**
 * All interfaces goes next
 */
export interface PcoProps {
  getPcoListLoading: boolean,
  getPcoListSuccess: boolean,
  pcoList: [],
  totalNumber: number,
  currentPage: number,
  selectedId: string,
  selectedRowDetail: any,
  userCountryCode: string,
  addPcoLoading: boolean,
  updatePcoLoading: boolean,
  addPcoSuccess: boolean,
  setSelectedPco: any,
  getPcoListCall: any,
  getPcoListSuggestionCall: any,
  addPCOCall: any,
  updatePCOCall: any,
  deletePCOCall: (data: any, callbackFunction: any) => void,
  uploadImageCall: any,
  updatePCOAttachment: any,
  deleteImageCall: any,
  permissions: any,
}
export interface TableFilterOptions {
  id: TableFilterTypes;
  name: string;
}
export interface UserFormData {
  entityType: EntityType;
  lastName: string;
  firstName?: string;
  phone?: number;
  otherPhone?: number;
  street?: string;
  street2?: string;
  city?: string;
  state: string;
  zip?: number;
  email?: string;
  website?: string;
  flag?: boolean;
  flagReason?: string;
  contact?: string;
  rescue?: boolean;
  rescueContact?: number;
  hospital?: boolean;
  mailList?: boolean;
  notes?: string;
  countryCode?: string;
}
export interface AddFormData {
  upload: File | null;
  user: UserFormData;
}
