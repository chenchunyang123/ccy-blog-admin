import { getWebsiteSetting, updateWebsiteSetting, uploadImg } from '@/services/ant-design-pro/api';
import { PageContainer, ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { UploadFile, message } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { useState } from 'react';

const BlogSetting: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([]);

  const { data = {} } = useRequest(getWebsiteSetting, {
    onSuccess: (res: any) => {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: res?.avatar_url,
        },
      ]);
      setCoverFileList([
        {
          uid: '-1',
          name: 'cover.png',
          status: 'done',
          url: res?.cover_url,
        },
      ]);
    },
  });

  const onSubmit = async (values: any) => {
    const { avatar, cover } = values;
    let avatarUrl = data?.avatar_url;
    let coverUrl = data?.cover_url;
    if (avatar) {
      // 头像修改
      const file = avatar[0]?.originFileObj;
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImg(formData);
      if (res?.success) {
        avatarUrl = res?.data?.smmsUrl;
      } else {
        message.error(`头像上传失败: ${res?.errorMessage}`);
        return;
      }
    }
    if (cover) {
      // 封面修改
      const file = cover[0]?.originFileObj;
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImg(formData);
      if (res?.success) {
        coverUrl = res?.data?.smmsUrl;
      } else {
        message.error(`封面上传失败: ${res?.errorMessage}`);
        return;
      }
    }
    const submitRes = await updateWebsiteSetting({
      avatar_url: avatarUrl,
      cover_url: coverUrl,
    });
    if (submitRes?.success) {
      message.success('更新成功');
    } else {
      message.error(`更新失败: ${submitRes?.errorMessage}`);
    }
  };

  const onAvatarChange: (info: UploadChangeParam<UploadFile<any>>) => void = (newFileList) => {
    if (newFileList?.fileList?.length) {
      setFileList([newFileList.file]);
    } else {
      setFileList([]);
    }
  };

  const onCoverChange: (info: UploadChangeParam<UploadFile<any>>) => void = (newFileList) => {
    if (newFileList?.fileList?.length) {
      setCoverFileList([newFileList.file]);
    } else {
      setCoverFileList([]);
    }
  };

  return (
    <PageContainer>
      <ProForm
        submitter={{
          searchConfig: {
            submitText: '保存',
          },
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
          fileList={fileList}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
          }}
          onChange={onAvatarChange}
        />
        <ProFormUploadButton
          title="单击替换"
          name="cover"
          label="默认封面"
          getValueFromEvent={(e) => {
            return [e?.file];
          }}
          fileList={coverFileList}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
          }}
          onChange={onCoverChange}
        />
      </ProForm>
    </PageContainer>
  );
};

export default BlogSetting;
