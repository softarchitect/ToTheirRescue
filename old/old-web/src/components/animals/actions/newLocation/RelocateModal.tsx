import {
  Form, Modal,
} from 'antd';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { useEffect, SetStateAction, useState } from 'react';
import AnimalDetailCard from 'src/shared/components/AnimalDetailCard';
import TextInput from 'src/shared/components/Inputs/TextInput';
import { updateAnimalLocationCall } from '../../../../redux/animal/action';

export interface RelocateModalProps {
  visible: boolean;
  // eslint-disable-next-line no-unused-vars
  onCancelClicked: any,
  animalList: any;
  selectedAnimal: any;
  getAnimalListCall: any,
  getAnimalFilter: any,
  updateAnimalLocationAction: any,
  updateAnimalLoading: any,
}

const RelocateModal = (props: RelocateModalProps) => {
  const {
    animalList, selectedAnimal, updateAnimalLocationAction,
  } = props;

  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [isFormTouched, setIsFormTouched] = useState(false);

  useEffect(() => {
    if ((selectedAnimal?.ids?.length >= 1) && animalList) {
      const temp: SetStateAction<any[]> = [];
      animalList.forEach((animal: { id: any; }) => {
        if (animal) {
          if (selectedAnimal?.ids?.includes(animal.id)) {
            temp.push(animal);
          }
        }
      });
      // setSelectedAnimals(temp);
    }
  }, [selectedAnimal, animalList]);

  // eslint-disable-next-line no-unused-vars
  const cancelModal = () => {
    props.onCancelClicked(!props.visible);
    form.resetFields();
    setIsFormTouched(false);
  };

  const handleSubmit = () => {
    const newLocation = form.getFieldValue('location');
    if (newLocation.length > 15) {
      return;
    }
    updateAnimalLocationAction({ selectedAnimalId: selectedAnimal?.ids, newLocation }, () => {
      cancelModal();
    });
  };

  const handleCancel = () => {
    if (!isFormTouched) {
      cancelModal();
      return;
    }

    confirm({
      title: 'Do you want to save your changes?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleSubmit();
      },
      onCancel() {
        cancelModal();
      },
    });
  };

  useEffect(() => {
    setIsFormTouched(true);
  }, [form.getFieldValue('location')]);

  return (
    <div>
      <Modal
        key={`new-location-${props.visible}`}
        open={props.visible}
        title="New Location"
        onCancel={handleCancel}
        okText="Save"
        onOk={form.submit}
      // confirmLoading={updateAnimalLoading}
      >
        <div>
          <AnimalDetailCard isModal animalDetails={selectedAnimal?.animalDetails} />
          {/* <p>Enter the new location for the animal(s). This could be a kennel, cage, pasture, pet store, pool, tank, etc.</p> */}
          <Form id="animal-relocate-form" style={{ padding: isMobile ? '0px' : '40px', paddingBottom: '0px' }} form={form} onFinish={handleSubmit}>
            <TextInput
              isRequired
              rules={[{ required: true, message: 'New Location is required' }, { max: 50, message: 'Should be less than 50 characters' }]}
              placeholder="New Location"
              key="location"
              label="New Location"
              name="location"
              highlightInput
            />
          </Form>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  updateAnimalLoading: state.animal.updateAnimalLoading,
  updateAnimalSuccess: state.animal.updateAnimalSuccess,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateAnimalLocationAction: (data: any, callbackFunction: () => void) => dispatch(updateAnimalLocationCall(data, callbackFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RelocateModal);
