import axiosApiInstance from "../components/auth/apiInstance";
import { API_URL } from "../shared/apiEndPointURL";

export const segmentationProcessApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.segmentationProcess, payload, {
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

export const UpdateProgressionRuleApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.updateProgressionRule, payload, {
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

export const SegmentationDataApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.segmentationFirstPage, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    .then((response) => response)
    .catch((err) => err?.response);
  return res;
};