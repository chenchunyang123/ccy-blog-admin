import { createArticle } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Flex, Form, Input, Modal, message } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useState } from 'react';

const ArticleCreate: React.FC = () => {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onOk = async () => {
    setLoading(true);
    const res = await createArticle({ title: articleTitle, content: articleContent });
    setLoading(false);
    if (res?.success) {
      message.success('发布成功');
      setOpen(false);
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  const articleModal = (
    <Modal
      open={open}
      title="发布文章"
      okText="确定"
      cancelText="取消"
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{
        loading,
      }}
    >
      <Form>
        <Form.Item label="文章标题">
          <Input placeholder="请输入文章标题..." />
        </Form.Item>
      </Form>
    </Modal>
  );

  const onClickBtn = () => {
    setOpen(true);
  };

  return (
    <PageContainer>
      <Flex vertical gap={24}>
        <Flex gap={12}>
          <Input
            placeholder="请输入文章标题..."
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
          />
          <Button type="primary" onClick={onClickBtn}>
            发布文章
          </Button>
        </Flex>
        <MdEditor modelValue={articleContent} onChange={(v) => setArticleContent(v)} />
      </Flex>
      {articleModal}
    </PageContainer>
  );
};

export default ArticleCreate;
