/* eslint-disable no-unused-vars */
import {
  message,
} from 'antd';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { apiCall } from '../../../shared/api/apiWrapper';
import { AttachmentList } from '../../../shared/components/AttachmentList';
import alertConstant from '../../../shared/constants/alert.json';

export const TenantAttachments = (props: any) => {
  const {
    selectedAnimal, minified, uploadImageLoading, selectedPco,
  } = props;
  const [changeData, setChangeData] = useState(false);
  const [artifacts, setArtifacts] = useState<any>();
  const cookies = new Cookies();
  const tenentId = cookies.get('loginDetails').tenantId;

  const pcoId = selectedPco?.id;

  useEffect(() => {
    const data = {};
    apiCall(`artifact-attachment/get-allartifact-by-tenantid/${tenentId}`, 'GET', data)
      .then((resp: any) => {
        if (resp?.status === 200) {
          setChangeData(false);
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

  return (
    <>
      <AttachmentList
        uploadImageLoading={false}
        selectedAnimal={selectedAnimal}
        selectedPco={selectedPco}
        tyrType="Tenant"
        artifacts={artifacts}
        onDeleteAttachment={onDeleteAttachment}
        pcoId={pcoId}
        animalId={0}
        tenantId={tenentId}
        minified={minified}
      />
    </>
  );
};
const mapStateToProps = (state: any) => ({
  getArtifactAttachmentSuccess: state.common.getArtifactAttachmentSuccess,
  getArtifactAttachmentLoading: state.common.getArtifactAttachmentLoading,
  uploadImageLoading: state.common.uploadImageLoading,
  selectedPco: state.common.selectedPco,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(TenantAttachments);
