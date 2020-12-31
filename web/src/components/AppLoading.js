import React from 'react';
import { Spin } from 'antd';

const AppLoading = () => {
  return (
    <Spin loading tip="Loading ..." size="large">
      <div className="app-loading" />
      <style jsx>{`
        .app-loading {
          height: 100vh;
          width: 100vw;
        }
      `}</style>
    </Spin>
  );
};

export default AppLoading;
