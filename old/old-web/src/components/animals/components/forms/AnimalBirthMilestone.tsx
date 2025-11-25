/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Col, DatePicker, Form, Input, Row, Radio, InputNumber, Segmented,
} from 'antd';
import '../AnimalsAddModal.less';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import MilestoneDatePickerCustom from 'src/shared/components/Inputs/MilestoneDatePickerCustom';
import DateInput from 'src/shared/components/Inputs/DateInput';
import { isMobileOnly } from 'react-device-detect';

interface AnimalBirthMilestoneProps {
  form: any;
  firstError: any;
  animalMilestoneList: any;
  editRecord: any;
  setIsFormTouched?: any;
}

export const BirthMilestoneForm = (props: AnimalBirthMilestoneProps) => {
  // eslint-disable-next-line no-empty-pattern
  const {
    form, animalMilestoneList, editRecord, setIsFormTouched,
  } = props;

  return (
    <div className="">
      <Row justify="space-between" align="top">
        <Col span={24}>
          <Row justify="start">
            <Col xs={24} sm={12} style={{ padding: '0px 10px' }}>
              <Form.Item
                name="isApproxDOB"
                style={{ marginBottom: 0 }}
              >
                <Segmented
                  key="milestone-edit-segmented"
                  size="middle"
                  style={{
                    margin: '0px', marginTop: '0px', padding: '3px',
                  }}
                  onChange={(value: any) => { form.setFieldValue('isApproxDOB', value); setIsFormTouched(true); }}
                  options={[{ label: 'Approximate Birth Date', value: 'computedAge' }, { label: 'Actual Birth Date', value: 'actualAge' }]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} style={isMobileOnly ? { padding: '10px 10px 0px 0px' } : {}}>
              <MilestoneDatePickerCustom
                key={editRecord?.id}
                // value={moment(form.getFieldValue('birthDate')) as any}
                form={form}
                onChange={(value: any) => { setIsFormTouched(true); }}
                name="birthDate"
                format="M/D/YYYY"
                label="Birth Date"
                milestoneList={animalMilestoneList}
                milestoneType={editRecord?.milestoneType?.toLowerCase()}
              />
            </Col>
          </Row>
          {/* <DateInput
            name="birthDate"
            style={{ marginBottom: 0 }}
            className="hide-label"
            key="actual-birth-key"
            label="Birth Date"
            placeholder="Birth Date"
            rules={[
              ({ getFieldValue }: any) => ({
                required: !getFieldValue('isApproxDOB'),
                validator() {
                  // const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                  const [flag, date] = [getFieldValue('isApproxDOB'), getFieldValue('birthDate')];
                  if ((flag && date) || !flag) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Birth Date must be specified'));
                },
              }),
            ]}
            disabledDate={disabledDate}
          /> */}
          {/* <Row justify="start">
            <Col style={{ padding: '0px 10px' }} sm={form.getFieldValue('isApproxDOB') ? 24 : 15} xs={24}>
              {(!form.getFieldValue('isApproxDOB')) ? (
                <DateInput
                  name="birthDate"
                  style={{ marginBottom: 0 }}
                  className="hide-label"
                  key="actual-birth-key"
                  rules={[
                    ({ getFieldValue }: any) => ({
                      required: !getFieldValue('isApproxDOB'),
                      validator() {
                        // const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                        const [flag, date] = [getFieldValue('isApproxDOB'), getFieldValue('birthDate')];
                        if ((flag && date) || !flag) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Birth Date must be specified'));
                      },
                    }),
                  ]}
                  disabledDate={disabledDate}
                />
              ) : (
                <>
                  <Form.Item
                    name="approxAge"
                    label="Approximate Age"
                    className="hide-label"
                    style={{ marginBottom: 10 }}
                    key={form.getFieldValue('isApproxDOB')}
                    rules={[
                      ({ getFieldValue }) => ({
                        required: getFieldValue('isApproxDOB'),
                        validator() {
                          const actualDataflag = !getFieldValue('isApproxDOB');
                          if (actualDataflag) {
                            return Promise.resolve();
                          }
                          const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                          const birthDate = moment().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
                          if (!birthDate) {
                            return Promise.reject(new Error('At least fill any one input'));
                          }
                          const [flag] = [!getFieldValue('isApproxDOB')];
                          if (flag || (!flag && (yrs > 0 || mos > 0 || days > 0))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Approximate Age must be specified'));
                        },
                      }),
                    ]}
                  >
                    <Row>
                      <Col style={{ paddingRight: '4px', width: '30%' }}>
                        <Form.Item name="yrs" style={{ marginBottom: '0px' }}>
                          <InputNumber
                            addonAfter="yrs"
                            defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col style={{ padding: '0px 2px', width: '34%' }}>
                        <Form.Item name="mos" style={{ marginBottom: '0px' }}>
                          <InputNumber
                            addonAfter="mos"
                            defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col style={{ paddingLeft: '4px', width: '36%' }}>
                        <Form.Item name="days" style={{ marginBottom: '0px' }}>
                          <InputNumber
                            addonAfter="days"
                            defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                  <p style={{ color: '#F57D33', fontSize: '12px' }}>Note: If you enter an approximate age TYR will compute an approximate birthdate.</p>
                </>
              )}
            </Col>
          </Row> */}
        </Col>
        <Col xs={24} sm={12}>
          <AreaInput
            form={form}
            name="birthNote"
            label="Birth Notes"
            placeholder="Birth notes"
            onChange={() => setIsFormTouched(true)}
            rows={4}
          />
        </Col>
      </Row>
    </div>
  );
};
