import { Avatar, Card } from "antd";
import React from "react";
import { defaultProfileImage } from "../../common/common";

export default function NotificationCard() {
  return (
    <Card title="Notifications" className="mb-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <Avatar className="mr-4" 
            src={defaultProfileImage}
          />
          <div>
            <p className="font-bold">StreamQueen</p>
            <p className="text-gray-600">Liked your post</p>
          </div>
        </div>
        <div className="flex items-center">
          <Avatar className="mr-4" 
           src={defaultProfileImage}
          />
          <div>
            <p className="font-bold">GamerPro99</p>
            <p className="text-gray-600">Commented on your post</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
