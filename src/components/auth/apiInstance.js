import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../shared/apiEndPointURL";

const handleRedirect = () => {
  window.location.href = "/"; // Redirect to the login page
};

/* axios Instance */
const axiosApiInstance = axios.create({
  baseURL: `${API_URL.BaseURL}`,
  headers: {
    "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`
  },
});

axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Assuming 401 status code indicates JWT expiration
      const originalRequest = error.config;

      // Option 1: Handle token refresh (if applicable)
      try {
        const { data } = await axios.post(API_URL.refreshToken, null, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        localStorage.setItem('auth_token', data.token);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        return axiosApiInstance(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        // If refreshing fails, redirect to login
        toast.error('Session expired. Please Logout and log in again.');
        handleRedirect(); // Call handleRedirect to navigate to the login page
      }
    } else {
      // Handle other errors
      // toast.error(error.response?.data?.message || 'An error occurred');
    }

    return Promise.reject(error);
    // return error;
  }
);

export default axiosApiInstance;
