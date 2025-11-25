/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { message } from 'antd';
import alertConstant from '../../shared/constants/alert.json';
import ModalConstant from '../../shared/constants/modalsConstant.json';

export const FORMER = 'former';
export const CURRENT = 'current';

export const actionsMenu1 = ({
  navigate,
  selectedAnimal,
  onRelocateBtnClicked,
  onBehaviorBtnClicked,
  onAttachmentsBtnClicked,
  setConfirmModal,
  setNavigateUrl,
  setActionModal,
  permissions,
}: {
  navigate: any,
  selectedAnimal: any,
  onRelocateBtnClicked: any,
  onBehaviorBtnClicked: any,
  onAttachmentsBtnClicked: any,
  setConfirmModal: any,
  setNavigateUrl: any,
  setActionModal: any,
  permissions: any,
}) => {
  const selectedAnimalId = selectedAnimal?.ids;
  const animalDetails = selectedAnimal?.animalDetails;
  return ([
    {
      key: 'milestones',
      value: 'Milestones',
      isShow: permissions?.animals?.actions?.milestone,
      actionFunction: () => {
        setNavigateUrl('/animals/milestone');
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          const lastMilestone = animalDetails[0]?.lastMilestone;
          if (lastMilestone === 'death') {
            message.error({
              content: alertConstant.animal_is_dead,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          let isLastMilestoneSame = true;
          animalDetails?.forEach((data: any) => {
            isLastMilestoneSame = lastMilestone === data?.lastMilestone;
          });
          // const pcoId: any = tempAnimalDetailsJson[0]?.lastMilestone;
          if (!isLastMilestoneSame) {
            message.error({
              content: alertConstant.different_last_milestone,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          setConfirmModal(true);
          setActionModal(ModalConstant?.ADD_MILESTONE);
          return;
        }
        navigate('/animals/milestone');
      },
    },
    {
      key: 'behaviors',
      value: 'Behaviors',
      isShow: permissions?.animals?.actions?.behaviour,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        const animalType = animalDetails[0]?.animalType;
        let isAnimalTypeSame = true;
        animalDetails?.forEach((data: any) => {
          isAnimalTypeSame = animalType === data?.animalType;
        });
        if (!isAnimalTypeSame) {
          message.error({
            content: alertConstant.different_animal_type,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setNavigateUrl('');
        }
        // navigate('/animals/behavior');
        setActionModal(ModalConstant?.ADD_BEHAVIOUR);
      },
    },
    {
      key: 'newLocation',
      value: 'New Location',
      isShow: permissions?.animals?.actions?.location,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        let isLocationChangeAllowed = true;
        animalDetails?.forEach((data: any) => {
          isLocationChangeAllowed = isLocationChangeAllowed && ['intake', 'adoption-return', 'foster-return', 'found', 'reintake'].includes(data?.lastMilestone);
        });
        if (isLocationChangeAllowed) {
          if (selectedAnimalId.length > 1) {
            setConfirmModal(true);
          }
          setNavigateUrl('');
          onRelocateBtnClicked(true);
        } else {
          message.warning({
            content: (selectedAnimalId.length === 1) ? 'A location change for this animal requires a different Last Milestone.' : 'At least one animal requires a different last milestone.',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      },
    },
    {
      key: 'attachments',
      value: 'Photos, Videos, & Documents',
      isShow: permissions?.animals?.actions?.attachment,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          // setConfirmModal(true);
          // setActionModal(ModalConstant?.ATTACHMENTS);
          if (selectedAnimalId.length < 1 || selectedAnimalId.length > 1) {
            message.warning({
              content: (selectedAnimalId.length < 1) ? 'Please select at least one animal' : 'Please select only one animal',
              style: {
                marginTop: '2vh',
              },
              key: 'deletedable',
            });
            return;
          }
          return;
        }
        navigate('/animals/attachments');
        // onAttachmentsBtnClicked(true);
      },
    },
    {
      key: 'galleryView',
      value: 'Gallery View',
      isShow: permissions?.animals?.actions?.gallery_view,
      actionFunction: () => {
        // if (selectedAnimalId.length < 1) {
        //   message.warning({
        //     content: 'Please select at least one animal',
        //     style: {
        //       marginTop: '2vh',
        //     },
        //     key: 'deletedable',
        //   });
        //   return;
        // }
        // if (selectedAnimalId.length > 1) {
        //   // setConfirmModal(true);
        //   // setActionModal(ModalConstant?.ATTACHMENTS);
        //   if (selectedAnimalId.length < 1 || selectedAnimalId.length > 1) {
        //     message.warning({
        //       content: (selectedAnimalId.length < 1) ? 'Please select at least one animal' : 'Please select only one animal',
        //       style: {
        //         marginTop: '2vh',
        //       },
        //       key: 'deletedable',
        //     });
        //     return;
        //   }
        //   return;
        // }
        navigate('/animals/gallery-view');
      },
    },
    {
      key: 'diary',
      value: 'Diary',
      isShow: permissions?.animals?.actions?.diary,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setActionModal(ModalConstant?.DIARY);
          return;
        }
        navigate('/animals/diary');
      },
    },
  ]);
};

export const actionsMenu2 = ({
  navigate, selectedAnimal, setConfirmModal, setActionModal, permissions, setNavigateUrl, onSetReminderBtnClicked,
}: {
  navigate: any, selectedAnimal: any, setConfirmModal: any, setActionModal: any, permissions: any, setNavigateUrl: any, onSetReminderBtnClicked: any,
}) => {
  const selectedAnimalId = selectedAnimal?.ids;
  const animalDetails = selectedAnimal?.animalDetails;
  return [
    {
      key: 'vaccinations',
      value: 'Vaccinations',
      isShow: permissions?.animals?.actions?.vaccination,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          const animalType = animalDetails[0]?.animalType;
          let isAnimalTypeSame = true;
          animalDetails?.forEach((data: any) => {
            isAnimalTypeSame = isAnimalTypeSame && animalType === data?.animalType;
          });
          // const pcoId: any = tempAnimalDetailsJson[0]?.lastMilestone;
          if (!isAnimalTypeSame) {
            message.error({
              content: alertConstant.different_animal_type,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          if (selectedAnimalId.length > 1) {
            setConfirmModal(true);
            setActionModal(ModalConstant?.VACCINATION);
            return;
          }
        }
        navigate('/animals/vaccinations');
      },
    },
    {
      key: 'procedures, tests, & treatments',
      value: 'Procedures, Tests, & Treatments',
      isShow: permissions?.animals?.actions?.procedure,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          const animalType = animalDetails[0]?.animalType;
          let isAnimalTypeSame = true;
          animalDetails?.forEach((data: any) => {
            isAnimalTypeSame = isAnimalTypeSame && animalType === data?.animalType;
          });
          if (!isAnimalTypeSame) {
            message.error({
              content: alertConstant.different_animal_type,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            return;
          }
          setConfirmModal(true);
          setActionModal(ModalConstant?.PROCEDURE_TEST_TREATMENTS);
          return;
        }
        navigate('/animals/procedures-test-treatments');
      },
    },
    {
      key: 'setReminder',
      value: 'Set Reminders',
      isShow: permissions?.animals?.actions?.set_reminder,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        const animalType = animalDetails[0]?.animalType;
        let isAnimalTypeSame = true;
        animalDetails?.forEach((data: any) => {
          isAnimalTypeSame = animalType === data?.animalType;
        });
        if (!isAnimalTypeSame) {
          message.error({
            content: alertConstant.different_animal_type,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
        }
        setNavigateUrl('');
        onSetReminderBtnClicked(ModalConstant?.SET_REMINDER);
      },
    },
    // {
    //   key: 'procedures',
    //   value: 'Procedure & Tests',
    //   actionFunction: () => {
    //     if (selectedAnimalId.length < 1) {
    //       message.warning({
    //         content: 'Please select at least one animal',
    //       });
    //       return;
    //     }
    //     onProceduresBtnClicked(true);
    //   },
    // },
    {
      key: 'prescriptions',
      value: 'Prescriptions',
      isShow: permissions?.animals?.actions?.prescription && false,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setActionModal(ModalConstant?.PRESCRIPTION);
          return;
        }
        navigate('/animals/prescription');
      },
    },
    {
      key: 'meds',
      value: 'Meds',
      isShow: permissions?.animals?.actions?.meds,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setActionModal(ModalConstant?.MEDS);
          return;
        }
        navigate('/animals/meds');
      },
    },
    {
      key: 'diet',
      value: 'Diet',
      isShow: permissions?.animals?.actions?.diet,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setActionModal(ModalConstant?.DIET);
          return;
        }
        setActionModal(ModalConstant?.DIET);
      },
    },
    {
      key: 'soaps',
      value: 'SOAPs',
      isShow: permissions?.animals?.actions?.soaps,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setActionModal(ModalConstant?.SOAPS);
          return;
        }
        navigate('/animals/soaps');
      },
    },
    {
      key: 'notes',
      value: 'Health Notes',
      isShow: permissions?.animals?.actions?.notes,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          setConfirmModal(true);
          setActionModal(ModalConstant?.NOTES);
          return;
        }
        navigate('/animals/notes');
      },
    },
    // {
    //   key: 'reminders',
    //   value: 'Set Reminders',
    //   actionFunction: () => {
    //     if (selectedAnimalId.length < 1 || selectedAnimalId.lenght > 1) {
    //       message.warning({
    //         content: (selectedAnimalId.lenght < 1) ? 'Please select at least one animal' : 'Please select only one animal',
    //         style: {
    //           marginTop: '2vh',
    //         },
    //         key: 'deletedable',
    //       });
    //       return;
    //     }
    //     navigate('/animals/set-reminders');
    //   },
    // },
    {
      key: 'healthHistory',
      value: 'Health History',
      isShow: permissions?.animals?.actions?.health_history,
      actionFunction: () => {
        if (selectedAnimalId.length < 1 || selectedAnimalId.length > 1) {
          message.warning({
            content: (selectedAnimalId.length < 1) ? 'Please select at least one animal' : 'Please select only one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        navigate('/animals/health-history');
      },
    },
    {
      key: 'animalHealthReport',
      value: 'Animal Health Report',
      isShow: permissions?.animals?.actions?.animal_health_report,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        navigate('/animals/health-report');
      },
    },
  ];
};

export const actionsMenu3 = ({
  navigate, selectedAnimal, permissions, setConfirmModal, setActionModal,
}: {
  navigate: any, selectedAnimal: any, permissions: any, setConfirmModal: any, setActionModal: any,
}) => {
  const selectedAnimalId = selectedAnimal?.ids;
  return [
    {
      key: 'animalReport',
      value: 'Animal Report',
      isShow: permissions?.animals?.actions?.animal_report,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        navigate('/animals/reports');
      },
    },
    {
      key: 'publicityBlurb',
      value: 'Publicity Blurb',
      isShow: permissions?.animals?.actions?.publicity_blurb && false,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          message.warning({
            content: 'Please select only one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        setActionModal(ModalConstant?.PUBLICITY_BLURB);
      },
    },
    {
      key: 'wideExposure',
      value: 'Wide Exposure',
      isShow: permissions?.animals?.actions?.wide_exposure && false,
      actionFunction: () => {
        if (selectedAnimalId.length < 1) {
          message.warning({
            content: 'Please select at least one animal',
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
          return;
        }
        if (selectedAnimalId.length > 1) {
          alert('Feature is still in progress');
          return;
        }
        alert('Feature is still in progress');
      },
    },
  ];
};
// export const actionsMenu4 = ({
//   navigate, selectedAnimal, setConfirmModal, setActionModal, permissions, setNavigateUrl, onPublicityBlurbBtnClicked,
// }: {
//   navigate: any, selectedAnimal: any, setConfirmModal: any, setActionModal: any, permissions: any, setNavigateUrl: any, onPublicityBlurbBtnClicked: any,
// }) => {
//   const selectedAnimalId = selectedAnimal?.ids;
//   const animalDetails = selectedAnimal?.animalDetails;
//   return [
//     // { key: 'copySelection', value: 'Copy Selection*' },
//     {
//       key: 'healthReport',
//       value: 'Health Report',
//       isShow: permissions?.animals?.actions?.wide_exposure,
//       actionFunction: () => {
//         if (selectedAnimalId.length < 1) {
//           message.warning({
//             content: 'Please select at least one animal',
//             style: {
//               marginTop: '2vh',
//             },
//             key: 'deletedable',
//           });
//           return;
//         }
//         navigate('/animals');
//       },
//     },
//     {
//       key: 'publicityBlurb',
//       value: 'Publicity Blurb',
//       isShow: permissions?.animals?.actions?.publicity_blurb,
//       actionFunction: () => {
//         if (selectedAnimalId.length < 1 || selectedAnimalId.length > 1) {
//           message.warning({
//             content: (selectedAnimalId.length < 1) ? 'Please select at least one animal' : 'Please select only one animal',
//             style: {
//               marginTop: '2vh',
//             },
//             key: 'deletedable',
//           });
//           return;
//         }
//         if (selectedAnimalId.length > 1) {
//           setConfirmModal(true);
//         }
//         setNavigateUrl('');
//         onPublicityBlurbBtnClicked(ModalConstant?.PUBLICITY_BLURB);
//       },
//     },
//   ];
// };

export const RESPONSES = {
  network_error: 'Error while fetching data.',
  server_error: 'Internal Server error! Please try again.',
  animal_delete_success: 'Animal entry has been deleted.',
  animal_delete_error: 'Error occurred while deleting animal.',
};
