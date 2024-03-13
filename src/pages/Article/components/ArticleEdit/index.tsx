import { createArticle, getArticleById, updateArticle } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, Flex, Input, Modal, message } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useEffect, useState } from 'react';

interface IArticleEditProps {
  isUpdate?: boolean;
}

const ArticleEdit: React.FC<IArticleEditProps> = ({ isUpdate = false }) => {
  const urlParams = useParams();
  const articleId = urlParams.id!;

  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [open, setOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { data, run } = useRequest(getArticleById, {
    manual: true,
  });

  const articleOperationTypeDesc = isUpdate ? '更新文章' : '发布文章';

  useEffect(() => {
    if (isUpdate) {
      run(articleId);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setArticleTitle(data.title);
      setArticleContent(data.content);
    }
  }, [data]);

  const onOk = async () => {
    setSubmitLoading(true);
    const res = isUpdate
      ? await updateArticle(articleId, { title: articleTitle, content: articleContent })
      : await createArticle({ title: articleTitle, content: articleContent });
    setSubmitLoading(false);
    if (res?.success) {
      const msg = isUpdate ? '更新成功' : '发布成功';
      message.success(msg);
      setOpen(false);
      history.push('/article/list');
    }
  };

  const onCancel = () => {
    setOpen(false);
  };

  const articleModal = (
    <Modal
      open={open}
      title={articleOperationTypeDesc}
      okText="确定"
      cancelText="取消"
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{
        loading: submitLoading,
      }}
    ></Modal>
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
            {articleOperationTypeDesc}
          </Button>
        </Flex>
        <MdEditor modelValue={articleContent} onChange={(v) => setArticleContent(v)} />
      </Flex>
      {articleModal}
    </PageContainer>
  );
};

export default ArticleEdit;
