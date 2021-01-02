import React from 'react';
import { UserOutlined } from '@ant-design/icons';

function ProfilePic() {
  return (
    <>
      <div className="profile-img-container">
        <div className="profile-img">
          <UserOutlined style={{ fontSize: 100 }} />
        </div>
      </div>
      <style jsx>{`
        .profile-img-container {
          width: 100%;
          text-align: center;
          padding: 16px;
          border-bottom: 1px solid #eeeeee;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .profile-img {
          width: 156px;
          height: 156px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          border-radius: 200px;
        }
      `}</style>
    </>
  );
}

export default ProfilePic;
