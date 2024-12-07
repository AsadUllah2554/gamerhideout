import React, { useState } from 'react';
import { Modal, Result, Button } from 'antd';
import { 
  BuildOutlined, 
 
} from '@ant-design/icons';

const FeatureUnderDevelopmentModal = ({ 
  isOpen, 
  onClose, 
  featureName = "This Feature", 
  additionalDetails 
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closeIcon={null}
    >
      <Result
        icon={<BuildOutlined style={{ color: '#1890ff' }} />}
        title={`${featureName} is Coming Soon!`}
        subTitle={
          additionalDetails || 
          "We're working hard to bring you an awesome new feature. Stay tuned!"
        }
        extra={[
          <Button 
            key="understand" 
            type="primary" 
            onClick={onClose}
          >
            I Understand
          </Button>
        ]}
      />
    </Modal>
  );
};

// Hook to manage feature under development modal
const useFeatureModal = () => {
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [featureDetails, setFeatureDetails] = useState({
    featureName: "This Feature",
    additionalDetails: ""
  });

  const openFeatureModal = (
    featureName = "This Feature", 
    additionalDetails = ""
  ) => {
    setFeatureDetails({ featureName, additionalDetails });
    setIsFeatureModalOpen(true);
  };

  const closeFeatureModal = () => {
    setIsFeatureModalOpen(false);
  };

  const FeatureModal = () => (
    <FeatureUnderDevelopmentModal
      isOpen={isFeatureModalOpen}
      onClose={closeFeatureModal}
      featureName={featureDetails.featureName}
      additionalDetails={featureDetails.additionalDetails}
    />
  );

  return {
    openFeatureModal,
    closeFeatureModal,
    FeatureModal
  };
};

export { FeatureUnderDevelopmentModal, useFeatureModal };