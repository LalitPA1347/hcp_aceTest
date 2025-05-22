import axiosApiInstance from "../../components/auth/apiInstance";
import { API_URL } from "../../shared/apiEndPointURL";

export const fetchDescriptiveInsightsApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.descriptiveInsightsFetchData, payload, {
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

export const DIGraphGenerateApi = async (payload) => {
  const res = await axiosApiInstance
    .post(API_URL.descriptiveInsightsPhysicianAnalyticsGraph, payload, {
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
