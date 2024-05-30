// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/auth/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    page_size?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export async function createArticle(data: Record<string, any>) {
  return request<Record<string, any>>('/article', {
    method: 'POST',
    data,
  });
}

export async function updateArticle(id: string, data: Record<string, any>) {
  return request<Record<string, any>>(`/article/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function getArticleList(params: {
  page_num?: number;
  page_size?: number;
  title: string;
  created_at_from: string;
  created_at_to: string;
}) {
  return request<Record<string, any>>('/article', {
    method: 'GET',
    params,
  });
}

export async function getArticleById(id: string) {
  return request<Record<string, any>>(`/article/${id}`, {
    method: 'GET',
  });
}

export async function deleteArticle(id: number) {
  return request<Record<string, any>>(`/article/${id}`, {
    method: 'DELETE',
  });
}

export async function getArticleCategoryList(params: {
  page_num?: number;
  page_size?: number;
  name?: string;
  created_at_from?: string;
  created_at_to?: string;
}) {
  return request<Record<string, any>>('/category', {
    method: 'GET',
    params,
  });
}

export async function getAllArticleCategory() {
  return request<Record<string, any>>('/category/all', {
    method: 'GET',
  });
}

export async function createArticleCategory(data: Record<string, any>) {
  return request<Record<string, any>>('/category', {
    method: 'POST',
    data,
  });
}

export async function updateArticleCategory(id: number, data: Record<string, any>) {
  return request<Record<string, any>>(`/category/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteArticleCategory(id: number) {
  return request<Record<string, any>>(`/category/${id}`, {
    method: 'DELETE',
  });
}

export async function getArticleTagList(params: {
  page_num?: number;
  page_size?: number;
  name?: string;
  created_at_from?: string;
  created_at_to?: string;
}) {
  return request<Record<string, any>>('/tag', {
    method: 'GET',
    params,
  });
}

export async function getAllArticleTag() {
  return request<Record<string, any>>('/tag/all', {
    method: 'GET',
  });
}

export async function createArticleTag(data: Record<string, any>) {
  return request<Record<string, any>>('/tag', {
    method: 'POST',
    data,
  });
}

export async function deleteArticleTag(id: number) {
  return request<Record<string, any>>(`/tag/${id}`, {
    method: 'DELETE',
  });
}

export async function updateArticleTag(id: number, data: Record<string, any>) {
  return request<Record<string, any>>(`/tag/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function getWebsiteSetting() {
  return request<Record<string, any>>(`/site/setting`, {
    method: 'GET',
  });
}

export async function updateWebsiteSetting(data: Record<string, any>) {
  return request<Record<string, any>>(`/site/setting`, {
    method: 'POST',
    data,
  });
}