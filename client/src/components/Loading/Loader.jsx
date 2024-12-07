import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {/* Overlay that prevents interactions */}
      <div 
        className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <Spin 
          indicator={
            <LoadingOutlined 
              style={{ 
                fontSize: 48, 
                color: 'white' 
              }} 
              spin 
            />
          }
          size="large"
        />
      </div>
      
      {/* Existing content becomes slightly opaque */}
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

// Alternate Loading Spinner Component for smaller contexts
const LoadingSpinner = ({ tip = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Spin 
        indicator={
          <LoadingOutlined 
            style={{ 
              fontSize: 36, 
              color: '#1890ff' 
            }} 
            spin 
          />
        }
        tip={tip}
      />
    </div>
  );
};

export { LoadingOverlay, LoadingSpinner };