import React from 'react';
import packageJson from '../../package.json';
import { Typography } from 'antd';

const { Text } = Typography;

const Version = () => {
  return (
    <div className="version">
      <Text>{`Version ${packageJson.version}`}</Text>
      <style jsx>{`
        .version {
          bottom: 16px;
          right: 16px;
        }
      `}</style>
    </div>
  );
};

export default Version;
