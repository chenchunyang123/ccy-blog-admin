import {
  createArticle,
  getAllArticleCategory,
  getAllArticleTag,
  getArticleById,
  updateArticle,
} from '@/services/ant-design-pro/api';
import { SendOutlined } from '@ant-design/icons';
import { ModalForm, PageContainer, ProFormSelect } from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, Flex, Form, Input, message } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import React, { useEffect, useState } from 'react';

interface IArticleEditProps {
  isUpdate?: boolean;
}

const ArticleEdit: React.FC<IArticleEditProps> = ({ isUpdate = false }) => {
  const urlParams = useParams();
  const articleId = urlParams.id!;

  const [form] = Form.useForm<{ categoryId: number; tagIds: string }>();

  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const { data, run } = useRequest(getArticleById, {
    manual: true,
  });

  const {
    data: data_allCategory,
    run: run_allCategory,
    loading: loading_allCategory,
  } = useRequest(getAllArticleCategory, {
    manual: true,
    formatResult: (res) => {
      if (res?.data) {
        return res?.data?.map((item: any) => ({ label: item.name, value: item.id }));
      }
    },
  });

  const {
    data: data_allTag,
    run: run_allTag,
    loading: loading_allTag,
  } = useRequest(getAllArticleTag, {
    manual: true,
    formatResult: (res) => {
      if (res?.data) {
        return res?.data?.map((item: any) => ({ label: item.name, value: item.id }));
      }
    },
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

  const onOk = async (values: any) => {
    console.log('values', values);
    setSubmitLoading(true);
    const reqData = {
      title: articleTitle,
      content: articleContent,
      category_id: values.categoryId,
      tag_ids: values.tagIds,
    };
    const res = isUpdate ? await updateArticle(articleId, reqData) : await createArticle(reqData);
    setSubmitLoading(false);
    if (res?.success) {
      const msg = isUpdate ? '更新成功' : '发布成功';
      message.success(msg);
      history.push('/article/list');
    }
  };

  const articleModal = (
    <ModalForm
      width={600}
      title={articleOperationTypeDesc}
      trigger={
        <Button type="primary">
          <SendOutlined />
          {articleOperationTypeDesc}
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await onOk(values);
        message.success('提交成功');
        return true;
      }}
      onOpenChange={(open) => {
        if (open) {
          run_allCategory();
          run_allTag();
        }
      }}
    >
      <ProFormSelect
        name="categoryId"
        label="文章分类"
        placeholder="可输入搜索"
        showSearch
        options={data_allCategory}
        fieldProps={{
          // @ts-ignore
          filterOption: (input: string, option?: { label: string; value: string }) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          loading: loading_allCategory,
        }}
      />
      <ProFormSelect
        name="tagIds"
        label="文章标签"
        placeholder="可输入搜索"
        showSearch
        options={data_allTag}
        fieldProps={{
          // @ts-ignore
          filterOption: (input: string, option?: { label: string; value: string }) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          loading: loading_allTag,
          mode: 'multiple',
        }}
      />
    </ModalForm>
  );

  return (
    <PageContainer>
      <Flex vertical gap={24}>
        <Flex gap={12}>
          <Input
            placeholder="请输入文章标题..."
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
          />
          {articleModal}
        </Flex>
        <MdEditor modelValue={articleContent} onChange={(v) => setArticleContent(v)} />
      </Flex>
    </PageContainer>
  );
};

export default ArticleEdit;
