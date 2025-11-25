import { message } from 'antd';
import { TableFilterOptions } from './PCO.types';

export const PERSON = 'Person';
export const ORG = 'CorO';

export const pcoActionMenuList = (
  {
    navigate,
    selectedPcoId,
    permissions,
    setVolunteerActionModal,
  } : any,
) => [
  {
    key: 'attachments',
    value: 'Photos, Videos, and Documents',
    isShow: permissions?.pco?.actions?.attachments,
    actionFunction: () => {
      if (!selectedPcoId) {
        message.warning({
          content: 'Please select a PCO',
          style: {
            marginTop: '2vh',
          },
          key: 'deletedable',
        });
        return;
      }
      navigate('/pco/attachments');
    },
  },
  {
    key: 'history',
    value: 'History',
    isShow: permissions?.pco?.actions?.history,
    actionFunction: () => {
      if (!selectedPcoId) {
        message.warning({
          content: 'Please select a PCO',
          style: {
            marginTop: '2vh',
          },
          key: 'deletedable',
        });
        return;
      }
      navigate('/pco/history');
    },
  },
  {
    key: 'donate',
    value: 'Donate',
    isShow: permissions?.pco?.actions?.donate,
    actionFunction: () => {
      if (!selectedPcoId) {
        message.warning({
          content: 'Please select a PCO',
          style: {
            marginTop: '2vh',
          },
          key: 'deletedable',
        });
        return;
      }
      navigate('/pco/donation');
    },
  },
  // {
  //   key: 'email',
  //   value: 'Email',
  //   isShow: permissions?.pco?.actions?.email,
  //   actionFunction: () => {
  //     if (!selectedPcoId) {
  //       message.warning({
  //         content: 'Please select a PCO',
  //         style: {
  //           marginTop: '2vh',
  //         },
  //         key: 'deletedable',
  //       });
  //       return;
  //     }
  //     navigate('/pco/email');
  //   },
  // },
  // {
  //   key: 'mergePco',
  //   value: 'Merge PCO',
  //   isShow: permissions?.pco?.actions?.merge_pco,
  //   actionFunction: () => {
  //     if (!selectedPcoId) {
  //       message.warning({
  //         content: 'Please select a PCO',
  //         style: {
  //           marginTop: '2vh',
  //         },
  //         key: 'deletedable',
  //       });
  //       return;
  //     }
  //     navigate('/pco/mergePco');
  //   },
  // },
  // {
  //   key: 'mergePco',
  //   value: 'Merge PCO',
  //   isShow: permissions?.pco?.actions?.merge_pco,
  //   actionFunction: () => {
  //     if (!selectedPcoId) {
  //       message.warn({
  //         content: 'Please select a PCO',
  //         style: {
  //           marginTop: '2vh',
  //         },
  //         key: 'deletedable',
  //       });
  //       return;
  //     }
  //     navigate('/pco/mergePco');
  //   },
  // },
  {
    key: 'volunteer',
    value: 'Volunteer',
    isShow: permissions?.pco?.actions?.volunteer,
    actionFunction: () => {
      if (!selectedPcoId) {
        message.warning({
          content: 'Please select a PCO',
          style: {
            marginTop: '2vh',
          },
        });
        return;
      }
      setVolunteerActionModal(true);
      // navigate('/pco/volunteer');
    },
  },
];

export const filterOptions: TableFilterOptions[] = [
  { id: 'all', name: 'All' },
  { id: PERSON, name: 'People' },
  { id: ORG, name: 'Companies and Organizations' },
];

export const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
  },
  {
    title: 'Street',
    dataIndex: 'street',
  },
  {
    title: 'Street 2',
    dataIndex: 'street2',
  },
  {
    title: 'City',
    dataIndex: 'city',
    width: 100,
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 220,
  },
];
