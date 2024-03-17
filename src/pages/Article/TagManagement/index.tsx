import { createArticleTag, getArticleTagList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';

type TagManagementItem = {
  id: number;
  title: string;
  content: string;
  word_count: number;
  reading_duration_minutes: number;
  created_at: string;
  updated_at: string;
  tags: any[];
  category: string;
};

const columns: ProColumns<TagManagementItem>[] = [
  {
    title: '标签名称',
    dataIndex: 'name',
  },
  {
    title: '文章数量',
    dataIndex: 'name',
    hideInSearch: true,
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '更新时间',
    key: 'showTime',
    dataIndex: 'updated_at',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record) => [
      <a
        key="editable"
        onClick={() => {
          history.push(`/article/update/${record.id}`);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        删除
      </a>,
    ],
  },
];

const TagManagement: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  return (
    <PageContainer>
      <ProTable<TagManagementItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        loading={listLoading}
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          setListLoading(true);
          const res = await getArticleTagList({
            pageNum: params.current,
            pageSize: params.pageSize,
          });
          setListLoading(false);
          return {
            data: res?.data?.list,
            success: res?.success,
            total: res?.data?.total,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'articleList',
          persistenceType: 'sessionStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="分类列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalVisible(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      {/* 分类编辑弹框 */}
      <ModalForm
        width={600}
        title="添加标签"
        formRef={modalFormRef}
        open={modalVisible}
        onFinish={async (values) => {
          const { tag } = values;
          const res = await createArticleTag({
            name: tag,
          });
          if (res?.success) {
            message.success('创建成功');
            modalFormRef?.current?.resetFields?.();
            actionRef.current?.reload?.();
            return true;
          }
        }}
        onOpenChange={(v) => {
          setModalVisible(v);
          if (v) {
            modalFormRef?.current?.resetFields?.();
          }
        }}
      >
        <ProFormText
          name="tag"
          label="标签名称"
          placeholder="请输入"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TagManagement;
