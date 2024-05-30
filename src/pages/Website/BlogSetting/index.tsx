import { getWebsiteSetting } from '@/services/ant-design-pro/api';
import { PageContainer, ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';

const BlogSetting: React.FC = () => {
  const { data = {} } = useRequest(getWebsiteSetting);

  console.log('data', data);

  const initialValues = {
    avatar: [
      {
        uid: '1',
        name: 'avatar.png',
        status: 'done',
        url: data?.avatar_url,
      },
    ],
  };

  const onSubmit = async (values: any) => {
    console.log('values', values);
  };

  return (
    <PageContainer>
      <ProForm
        initialValues={initialValues}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
        onFinish={onSubmit}
      >
        <ProFormUploadButton
          title="单击替换"
          name="avatar"
          label="头像"
          getValueFromEvent={(e) => {
            return [e?.file];
          }}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            maxCount:1,
          }}
          required
        >
          3434
        </ProFormUploadButton>
      </ProForm>
    </PageContainer>
  );
};

export default BlogSetting;
