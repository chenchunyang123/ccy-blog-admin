import { PageContainer } from '@ant-design/pro-components';
import { Button, Flex, Input, Modal } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useState } from 'react';

const Welcome: React.FC = () => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(true);

  console.log(value);
  const articleModal = (
    <Modal open={open} title='发布文章' okText='确定' cancelText='取消'>
      <p>文章标题：标题</p>
      <p>文章内容：{value}</p>
    </Modal>
  );

  const onClickBtn = () => {
    setOpen(true);
  }

  return (
    <PageContainer>
      <Flex vertical gap={24}>
        <Flex gap={12}>
          <Input placeholder="请输入文章标题..." />
          <Button type="primary" onClick={onClickBtn}>发布文章</Button>
        </Flex>
        <MdEditor modelValue={value} onChange={setValue} />
      </Flex>
      {articleModal}
    </PageContainer>
  );
};

export default Welcome;
