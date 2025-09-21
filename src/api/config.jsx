import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/";
export const publicAPI = axios.create({ baseURL: API_BASE_URL });

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to avoid infinite loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor → attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // ✅ Save new tokens in localStorage
        localStorage.setItem("authToken", newAccessToken);
        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }

        // Update Axios default headers
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Clear localStorage and redirect or handle logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;


// import axios from "axios";
// import { useAuthStore } from "../store/authStore"; // adjust path

// const API_BASE_URL = "http://localhost:8000/api/";
// export const publicAPI = axios.create({ baseURL: API_BASE_URL });

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor → attach token
// api.interceptors.request.use(
//   (config) => {
//     const { accessToken } = useAuthStore.getState();
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Flag to avoid infinite loops
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // Response interceptor → handle 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const authStore = useAuthStore.getState();

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = "Bearer " + token;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = authStore.refreshToken || localStorage.getItem("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token available");

//         const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
//           refresh: refreshToken,
//         });

//         const newAccessToken = response.data.access;

//         // update store + headers
//         useAuthStore.setState({ accessToken: newAccessToken });
//         api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

//         processQueue(null, newAccessToken);
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         authStore.logout(); // clear state + redirect
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
