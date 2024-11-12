import api from "./api";

export const getFetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export const postFetcher = async (url, data) => {
  const response = await api.post(url, data);
  return response.data;
};

export const putFetcher = async (url, data) => {
  const response = await api.put(url, data);
  return response.data;
};

export const patchFetcher = async (url, data) => {
  const response = await api.patch(url, data);
  return response.data;
};

export const deleteFetcher = async (url) => {
  const response = await api.delete(url);
  return response.data;
};
