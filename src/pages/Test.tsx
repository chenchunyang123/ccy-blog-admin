import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';

const Welcome: React.FC = () => {
  const [value, setValue] = useState('');

  console.log('value', value);

  return (
    <PageContainer>

    </PageContainer>
  );
};

export default Welcome;
