/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {
  Button, Dropdown, Menu,
  message,
} from 'antd';
import { connect } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-use-before-define
import React, {
  useState, ReactElement, ReactHTMLElement,
} from 'react';
import { kebabCase } from 'lodash';
import {
  setAnimalActionModalState,
  setSelectedAnimal,
} from 'src/redux/common/action';
import modalConstant from 'src/shared/constants/modalsConstant.json';
import alertConstant from 'src/shared/constants/alert.json';

const AnimalActionDropdown = (props: any) => {
  const { selectedAnimal, setActionModal, permissions } = props;

  const [confirmModal, setConfirmModal] = useState(false);
  const [navigateUrl, setNavigateUrl] = useState('');
  const navigate = useNavigate();

  const actionsMenu1 = () => {
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
            setActionModal(modalConstant?.ADD_MILESTONE);
            return;
          }
          navigate('/animals/milestone');
        },
      },
      // {
      //   key: 'behaviors',
      //   value: 'Behaviors',
      //   isShow: permissions?.animals?.actions?.behaviour,
      //   actionFunction: () => {
      //     if (selectedAnimalId.length < 1) {
      //       message.warning({
      //         content: 'Please select at least one animal',
      //         style: {
      //           marginTop: '2vh',
      //         },
      //         key: 'deletedable',
      //       });
      //       return;
      //     }
      //     const animalType = animalDetails[0]?.animalType;
      //     let isAnimalTypeSame = true;
      //     animalDetails?.forEach((data: any) => {
      //       isAnimalTypeSame = animalType === data?.animalType;
      //     });
      //     if (!isAnimalTypeSame) {
      //       message.error({
      //         content: alertConstant.different_animal_type,
      //         style: {
      //           marginTop: '2vh',
      //         },
      //         key: 'updatable',
      //       });
      //       return;
      //     }
      //     if (selectedAnimalId.length > 1) {
      //       setConfirmModal(true);
      //       setNavigateUrl('');
      //     }
      //     // navigate('/animals/behavior');
      //     setActionModal(modalConstant?.ADD_BEHAVIOUR);
      //   },
      // },
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
            // setActionModal(modalConstant?.ATTACHMENTS);
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
            setActionModal(modalConstant?.DIARY);
            return;
          }
          navigate('/animals/diary');
        },
      },
    ]);
  };

  const actionsMenu2 = () => {
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
              setActionModal(modalConstant?.VACCINATION);
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
            setActionModal(modalConstant?.PROCEDURE_TEST_TREATMENTS);
            return;
          }
          navigate('/animals/procedures-test-treatments');
        },
      },
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
            setActionModal(modalConstant?.PRESCRIPTION);
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
            setActionModal(modalConstant?.MEDS);
            return;
          }
          navigate('/animals/meds');
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
            setActionModal(modalConstant?.SOAPS);
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
            setActionModal(modalConstant?.NOTES);
            return;
          }
          navigate('/animals/notes');
        },
      },
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

  // const onRelocateBtnClicked = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.NEW_LOCATION : '');
  // };
  // const onBehaviorBtnClicked = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.ADD_BEHAVIOUR : '');
  // };
  // const onAttachmentsBtnClicked = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.ATTACHMENTS : '');
  // };
  // const setProceduresModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.PROCEDURE_TEST_TREATMENTS : '');
  // };
  // const setMilestoneModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.ADD_MILESTONE : '');
  // };
  // const setNotesModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.NOTES : '');
  // };
  // const setDiaryModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.DIARY : '');
  // };
  // const onSetReminderBtnClicked = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.SET_REMINDER : '');
  // };
  // const setPublicityBlurbModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.PUBLICITY_BLURB : '');
  // };
  // const setPrescriptionModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.PRESCRIPTION : '');
  // };
  // const setVaccinationModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.VACCINATION : '');
  // };

  // const setMedsModalVisibility = (flag: boolean): void => {
  //   setActionModal(flag ? modalConstant?.MEDS : '');
  // };

  const actionsMenu = (
    <Menu className="custom-scrollbar" style={{ height: '45vh', overflowY: 'scroll' }}>
      {actionsMenu1().map(({
        key, value, isShow, actionFunction,
      }: any) => {
        if (isShow) {
          return (<Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>);
        }
        return '';
      })}
      <Menu.Divider />
      {actionsMenu2().map(({
        key, value, isShow, actionFunction,
      }: any) => {
        if (isShow) {
          return (<Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>);
        }
        return '';
      })}
    </Menu>
  );

  const isMobile = window.innerWidth <= 768;

  return (
    <Dropdown overlay={actionsMenu}>
      <Button
        className="ftr-button-primary"
        style={{ width: '100%' }}
      >
        Actions
        {' '}
        <DownOutlined rev={undefined} />
      </Button>
    </Dropdown>
  );
};

const mapStateToProps = (state: any) => ({
  selectedAnimal: state.common.selectedAnimal,
  permissions: state.auth.permissions,
});

const mapDispatchToProps = (dispatch: any) => ({
  setSelectedAnimal: (data: any) => dispatch(setSelectedAnimal(data)),
  setActionModal: (data: any, callbackFunction: () => void) => dispatch(setAnimalActionModalState(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnimalActionDropdown);
