import { deleteArticle, getArticleList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
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

type ArticleListItem = {
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

const ArticleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [listLoading, setListLoading] = useState(false);

  const columns: ProColumns<ArticleListItem>[] = [
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
            created_at_from: value?.[0],
            created_at_to: value?.[1],
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
          查看
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除？"
          okText="确认"
          cancelText="取消"
          onConfirm={async () => {
            const res = await deleteArticle(record.id);
            if (res?.success) {
              message.success('删除成功');
              actionRef.current?.reload?.();
            }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ArticleListItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        loading={listLoading}
        request={async (params, sort, filter) => {
          console.log('params', params);
          console.log('sort', sort);
          console.log('filter', filter);
          setListLoading(true);
          const res = await getArticleList({
            pageNum: params.current,
            pageSize: params.pageSize,
            title: params.title,
            created_at_from: params.created_at_from,
            created_at_to: params.created_at_to,
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
          onChange(value) {},
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
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.created_at_from, values.created_at_to],
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
        headerTitle="文章列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              history.push('/article/create');
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default ArticleList;
