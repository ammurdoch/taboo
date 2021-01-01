import React from 'react';
import { Button, notification } from 'antd';
import firebase from 'firebase/app';

const SignOut = () => {
  return (
    <>
      <Button
        className="sign-out-btn"
        onClick={() => {
          firebase
            .auth()
            .signOut()
            .then(function () {
              notification.open({
                message: 'Success',
                description: `Successfully signed out!`,
              });
            })
            .catch(function (error) {
              notification.open({
                message: 'Sign Out Error',
                description: error.message,
              });
            });
        }}
      >
        Sign Out
      </Button>
      <style jsx global>{`
        .sign-out-btn {
          position: absolute;
          top: 16px;
          right: 16px;
        }
      `}</style>
    </>
  );
};

export default SignOut;
