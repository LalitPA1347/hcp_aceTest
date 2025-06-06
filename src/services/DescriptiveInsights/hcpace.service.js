import axiosApiInstance from "../../components/auth/apiInstance";
import { API_URL } from "../../shared/apiEndPointURL";

export const hcpAceApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.hcpOutputDataApi, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const decilingApi = async (payload) => {
  const res = axiosApiInstance
    .post(API_URL.decileOutputData, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const customFilterSaveDataApi = async (payload) => {
  const res = axiosApiInstance
    .post(API_URL.savedCustomFilter, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const customFilterDataApi = async () => {
  const res = await axiosApiInstance
    .get(API_URL.customFilterData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const customFilterDeleteDataApi = async (payload) => {
  const res = axiosApiInstance
    .post(API_URL.deleteCustomFilter, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const savedFlowChartDataApi = async () => {
  const res = await axiosApiInstance
    .get(API_URL.savedFlowChartData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const deleteFlowChartDataApi = async (payload) => {
  const res = axiosApiInstance
    .post(API_URL.deleteFlowChartData, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};

export const saveFlowChartDataApi = async (payload) => {
  const res = axiosApiInstance
    .post(API_URL.saveFlowChartData, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response?.data);
  return res;
};