import { connect } from 'react-redux';
import {
  message,
} from 'antd';
import { useState, useEffect, FC } from 'react';
import Cookies from 'universal-cookie';

import './PcoAttachments.less';
import { apiCall } from '../../../../shared/api/apiWrapper';
import { AttachmentList } from '../../../../shared/components/AttachmentList';
import alertConstant from '../../../../shared/constants/alert.json';

export const PcoAttachments: FC<any> = (props) => {
  const {
    permissions, selectedAnimal, uploadImageLoading, selectedPco,
  } = props;
  const [changeData, setChangeData] = useState(false);
  const [artifacts, setArtifacts] = useState<any>();
  const cookies = new Cookies();
  const { tenantId } = cookies.get('loginDetails');

  const pcoId = selectedPco?.id;

  useEffect(() => {
    const data = {};
    apiCall(`artifact-attachment/get-allartifact-by-pcoid/${pcoId}?tenantId=${tenantId}`, 'GET', data)
      .then((resp: any) => {
        setChangeData(false);
        if (resp?.status === 200) {
          setArtifacts(resp?.data?.data?.artifactAttachments);
        }
      });
  }, [changeData, uploadImageLoading]);

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

  if (!permissions?.pco?.actions?.attachment) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <AttachmentList
        selectedAnimal={selectedAnimal}
        selectedPco={selectedPco}
        tyrType="People"
        artifacts={artifacts}
        onDeleteAttachment={onDeleteAttachment}
        pcoId={pcoId}
        animalId={0}
        tenantId={tenantId}
        uploadImageLoading={uploadImageLoading}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  getArtifactAttachmentSuccess: state.common.getArtifactAttachmentSuccess,
  getArtifactAttachmentLoading: state.common.getArtifactAttachmentLoading,
  uploadImageLoading: state.common.uploadImageLoading,
  selectedPco: state.common.selectedPco,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PcoAttachments);
