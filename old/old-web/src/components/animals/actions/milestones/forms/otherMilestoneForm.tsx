/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
import {
  useEffect, useState, useReducer, useRef,
} from 'react';
import {
  Button, Form, message, Modal, Row, Col, DatePicker, Input,
} from 'antd';
import { DollarTwoTone } from '@ant-design/icons';
import MilestoneDatePickerCustom from 'src/shared/components/Inputs/MilestoneDatePickerCustom';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import NumberInput from 'src/shared/components/Inputs/NumberInput';
import PCOMinifiedScreen from '../../../components/minifiedPcoScreen';
import RescueShelterMinified from '../../../components/minifiedRescueShelter';
import { BirthMilestoneForm } from '../../../components/forms/AnimalBirthMilestone';
import { AnimalIntakeMilestone } from '../../../components/forms/AnimalIntakeMilestone';

const cssPrefix = 'animals-add-modal';

export const EditForm = (editProps: any) => {
  // eslint-disable-next-line no-empty-pattern
  const {
    form, handleUpdate, animalMilestoneList, pcoList, visible, setFormUpdatedKey, selectedPcoId,
    firstError, setFirstError, editRecord, selectedRescueShelter, setSelectedRescueShelter, setIsFormTouched,
  } = editProps;

  const validateMessages = {
    required: '${label} is required',
    types: {
      email: '${label} is not a valid email',
      number: '${label} is not a valid number',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  return (
    <Form
      key={`edit-milestone-${visible}`}
      id="animal-other-form"
      className={`${cssPrefix}__form`}
      form={form}
      onFinish={() => handleUpdate()}
      onFieldsChange={() => setFormUpdatedKey(Date.now())}
      scrollToFirstError
      validateMessages={validateMessages}
      size={'middle' as any}
    >
      {(editRecord?.milestoneType?.toLowerCase() === 'intake') && (
        <AnimalIntakeMilestone
          animalMilestoneList={animalMilestoneList}
          setFirstError={setFirstError}
          form={form}
          firstError={firstError}
          setIsFormTouched={setIsFormTouched}
          selectedPcoId={selectedPcoId}
          pcoList={pcoList}
          visible={visible}
        />
      )}
      {
        (editRecord?.milestoneType?.toLowerCase() === 'birth') && (
          <BirthMilestoneForm
            animalMilestoneList={animalMilestoneList}
            form={form}
            firstError={firstError}
            editRecord={editRecord}
            setIsFormTouched={setIsFormTouched}
          />
        )
      }
      {
        (editRecord?.milestoneType?.toLowerCase() !== 'intake') && (editRecord?.milestoneType?.toLowerCase() !== 'birth') && (
          <div>
            {/* {(['adoption-return', 'foster-return'].includes(milestoneType)) && (
                <div>
                  Adopted By :
                  <PcoDetailCard isModal />
                  <br />
                </div>
              )} */}
            {(!['adoption-return', 'foster-return', 'lost', 'found', 'released', 'reintake', 'death', 'transfer'].includes(editRecord?.milestoneType)) && <PCOMinifiedScreen setFirstError={setFirstError} />}
            {(editRecord?.milestoneType === 'transfer') && <RescueShelterMinified selectedRow={selectedRescueShelter} setSelectedRow={setSelectedRescueShelter} />}
            <br />
            <Row>
              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Form.Item style={{ margin: '0px' }} className="hide-label" name="milestoneDate" required label="Milestone Date" rules={[{ required: true }]}>
                      <MilestoneDatePickerCustom
                        name="milestoneDate"
                        key={editRecord?.id}
                        label="Milestone Date"
                        // value={moment(form.getFieldValue('milestoneDate')) as any}
                        // onChange={(value: any) => { setIsFormTouched(true); }}
                        format="M/D/YYYY"
                        milestoneList={animalMilestoneList}
                        milestoneType={editRecord?.milestoneType?.toLowerCase()}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {(!['lost', 'found', 'released', 'reintake', 'death', 'foster', 'foster-return'].includes(editRecord?.milestoneType)) && (
                      <NumberInput
                        style={{ margin: '0px', width: '100%' }}
                        name="amountPaidFee"
                        // eslint-disable-next-line no-nested-ternary
                        label={`${(editRecord?.milestoneType === 'adoption-return') ? 'Refund Amount' : ((editRecord?.milestoneType === 'adoption') ? 'Adoption Fee' : 'Amount')} (if any)`}
                        // eslint-disable-next-line no-nested-ternary
                        placeholder={`${(editRecord?.milestoneType === 'adoption-return') ? 'Refund Amount' : ((editRecord?.milestoneType === 'adoption') ? 'Adoption Fee' : 'Amount')} (if any)`}
                        onChange={() => setIsFormTouched(true)}
                        type="number"
                        isRequired
                        prefix={(
                          <DollarTwoTone rev={undefined} />
                        )}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <AreaInput
                  form={form}
                  style={{ margin: '0px' }}
                  name="notes"
                  label="Notes"
                  placeholder="any notes"
                  onChange={() => setIsFormTouched(true)}
                  rows={3}
                />
              </Col>
            </Row>
          </div>
        )
      }
    </Form>
  );
};
