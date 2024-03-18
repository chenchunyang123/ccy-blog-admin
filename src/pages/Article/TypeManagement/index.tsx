import {
  createArticleCategory,
  deleteArticleCategory,
  getArticleCategoryList,
  updateArticleCategory,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

type TypeManagementItem = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

const TypeManagement: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState<'create' | 'update'>('create');

  const selectedRowValue = useRef<TypeManagementItem>();

  const modalIsCreate = modalStatus === 'create';

  const columns: ProColumns<TypeManagementItem>[] = [
    {
      title: '分类名称',
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
            const res = await deleteArticleCategory(record.id);
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
      <ProTable<TypeManagementItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        loading={listLoading}
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          setListLoading(true);
          const res = await getArticleCategoryList({
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
              setModalStatus('update');
              setModalVisible(true);
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
          title={modalIsCreate ? '添加分类' : '编辑分类'}
          formRef={modalFormRef}
          open={modalVisible}
          onFinish={async (values) => {
            const { category } = values;
            const res = modalIsCreate
              ? await createArticleCategory({
                  name: category,
                })
              : await updateArticleCategory(selectedRowValue?.current?.id as number, {
                  name: category,
                });
            if (res?.success) {
              message.success(modalIsCreate ? '添加成功' : '编辑成功');
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
            category: modalIsCreate ? '' : selectedRowValue.current?.name,
          }}
        >
          <ProFormText
            name="category"
            label="分类名称"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default TypeManagement;
