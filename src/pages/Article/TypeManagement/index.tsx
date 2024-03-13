import { getArticleCategoryList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type TypeManagementItem = {
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

const columns: ProColumns<TypeManagementItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  // {
  //   title: '分类',
  //   dataIndex: 'category',
  //   ellipsis: true,
  //   formItemProps: {
  //     rules: [
  //       {
  //         required: true,
  //         message: '此项为必填项',
  //       },
  //     ],
  //   },
  // },
  // {
  //   disable: true,
  //   title: '标签',
  //   dataIndex: 'content',
  //   search: false,
  //   renderFormItem: (_, { defaultRender }) => {
  //     return defaultRender(_);
  //   },
  //   render: (_, record) => (
  //     <Space>
  //       {/* {record.map(({ name, color }) => (
  //         <Tag color={color} key={name}>
  //           {name}
  //         </Tag>
  //       ))} */}
  //     </Space>
  //   ),
  // },
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

const TypeManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <PageContainer>
      <ProTable<TypeManagementItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          const res = await getArticleCategoryList({
            pageNum: params.current,
            pageSize: params.pageSize,
          });
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
        title="添加分类"
        open={modalVisible}
        onFinish={async () => {
          message.success('提交成功');
          return true;
        }}
        onOpenChange={setModalVisible}
      >
          <ProFormText
            width="md"
            name="category"
            label="分类名称"
            placeholder="请输入分类名称"
          />
      </ModalForm>
    </PageContainer>
  );
};

export default TypeManagement;
