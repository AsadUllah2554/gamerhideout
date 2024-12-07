import React from 'react';
import { Card, Skeleton, Avatar } from 'antd';

const PostSkeleton = () => {
  return (
    <Card className="mb-4">
      <div className="flex items-center mb-4">
        <Skeleton.Avatar 
          active 
          size="large" 
          className="mr-4" 
        />
        <div className="flex-grow">
          <Skeleton 
            title={{ width: '50%' }} 
            paragraph={{ rows: 1, width: '30%' }} 
            active 
          />
        </div>
      </div>
      
      <Skeleton 
        title={false}
        paragraph={{ rows: 2 }}
        active 
        className="mb-4"
      />
      
      <Skeleton.Image 
        active 
        className="w-full h-64 mb-4" 
      />
      
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton.Button 
            active 
            size="small" 
            shape="circle" 
          />
          <Skeleton.Button 
            active 
            size="small" 
            shape="round" 
            className="w-12" 
          />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton.Button 
            active 
            size="small" 
            shape="circle" 
          />
          <Skeleton.Button 
            active 
            size="small" 
            shape="round" 
            className="w-12" 
          />
        </div>
        <Skeleton.Button 
          active 
          size="small" 
          shape="circle" 
        />
      </div>
    </Card>
  );
};


const PostSkeletonList = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </>
  );
};

export { PostSkeleton, PostSkeletonList };