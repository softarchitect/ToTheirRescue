/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  message,
} from 'antd';
import { useState, useEffect, FC } from 'react';
import Cookies from 'universal-cookie';
import './Attachments.less';
import { setUploadImageLoading } from 'src/redux/common/action';
import { AttachmentList } from '../../../../shared/components/AttachmentList';
import alertConstant from '../../../../shared/constants/alert.json';
import { apiCall } from '../../../../shared/api/apiWrapper';

export const Attachments: FC<any> = (props) => {
  const [changeData, setChangeData] = useState(false);
  const {
    uploadImageLoading, permissions, selectedAnimal, setUploadImageLoading,
  } = props;
  const [artifacts, setArtifacts] = useState<any>();
  const animalId = selectedAnimal?.ids?.[0];
  const cookies = new Cookies();
  const { tenantId } = cookies.get('loginDetails');

  useEffect(() => {
    setUploadImageLoading(false);
  }, []);

  useEffect(() => {
    if (uploadImageLoading) {
      return;
    }
    const data = {};
    apiCall(`artifact-attachment/get-allartifact-by-animalid/${animalId}?tenantId=${tenantId}`, 'GET', data)
      .then((resp: any) => {
        setChangeData(false);
        if (resp?.status === 200) {
          setArtifacts(resp?.data?.data?.artifactAttachments);
        }
      });
  }, [uploadImageLoading, changeData]);

  const onDeleteAttachment = (id: string): void => {
    const data = '';
    apiCall(`artifact-attachment/delete-artifactattachment/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.animal_artifact_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  if (!permissions?.animals?.actions?.attachment) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <AttachmentList
        uploadImageLoading={uploadImageLoading}
        selectedAnimal={selectedAnimal}
        tyrType="Animal"
        artifacts={artifacts}
        onDeleteAttachment={onDeleteAttachment}
        pcoId={0}
        animalId={animalId}
        tenantId={tenantId}
        selectedPco={undefined}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  getArtifactAttachmentSuccess: state.common.getArtifactAttachmentSuccess,
  uploadImageLoading: state.common.uploadImageLoading,
  selectedAnimal: state.common.selectedAnimal,
});

const mapDispatchToProps = (dispatch: any) => ({
  setUploadImageLoading: (data: any) => dispatch(setUploadImageLoading(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Attachments);
