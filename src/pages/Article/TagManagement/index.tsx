import {
  createArticleTag,
  deleteArticleTag,
  getArticleTagList,
  updateArticleTag,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

type TagManagementItem = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

const TagManagement: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create');

  const selectedRowValue = useRef<TagManagementItem>();

  const modalIsCreate = modalStatus === 'create';

  const columns: ProColumns<TagManagementItem>[] = [
    {
      title: '标签名称',
      dataIndex: 'name',
    },
    {
      title: '文章数量',
      dataIndex: 'article_count',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      key: 'created_at_1',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      key: 'created_at_2',
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
            setModalVisible(true);
            setModalStatus('update');
            selectedRowValue.current = record;
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除？"
          okText="确认"
          cancelText="取消"
          onConfirm={async () => {
            const res = await deleteArticleTag(record.id);
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
      <ProTable<TagManagementItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        loading={listLoading}
        request={async (params, sort) => {
          setListLoading(true);
          const res = await getArticleTagList({
            page_num: params.current,
            page_size: params.pageSize,
            name: params.name,
            created_at_from: params.created_at_from,
            created_at_to: params.created_at_to,
            ...sort
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
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
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
          page_size: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="分类列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalStatus('create');
              setModalVisible(true);
              selectedRowValue.current = undefined;
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      {/* 分类编辑弹框 */}
      {modalVisible && (
        <ModalForm
          width={600}
          title={modalIsCreate ? '添加标签' : '编辑标签'}
          formRef={modalFormRef}
          open={modalVisible}
          onFinish={async (values) => {
            const { tag } = values;
            const res = modalIsCreate
              ? await createArticleTag({
                  name: tag,
                })
              : await updateArticleTag(selectedRowValue?.current?.id as number, {
                  name: tag,
                });
            if (res?.success) {
              message.success(modalIsCreate ? '添加成功' : '更新成功');
              modalFormRef?.current?.resetFields?.();
              actionRef.current?.reload?.();
              return true;
            }
          }}
          onOpenChange={(v) => {
            setModalVisible(v);
            if (!v) {
              selectedRowValue.current = undefined;
            }
          }}
          modalProps={{
            destroyOnClose: true,
          }}
          initialValues={{
            tag: modalIsCreate ? '' : selectedRowValue.current?.name,
          }}
        >
          <ProFormText
            name="tag"
            label="标签名称"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default TagManagement;
