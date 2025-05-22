import axiosApiInstance from "../components/auth/apiInstance";
import { API_URL } from "../shared/apiEndPointURL";

export const fetchDataApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.firstPageData, payload, {
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

export const addProductCodeApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.addProductCode, payload, {
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
export const startProcessApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.startProcess, payload, {
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

export const getIndverApi = async (payload) => {
  const res = await axiosApiInstance
    .get(API_URL.getIndver, payload, {
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
export const defaultChangeApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.defaultChange, payload, {
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

export const kpiFilterCountApi = async (payload) => {
  
  const res = await axiosApiInstance
    .post(API_URL.kpiFilterCount, payload, {
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
