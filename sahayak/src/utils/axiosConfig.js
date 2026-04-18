// import axios from "axios";
// import { toast, Bounce } from "react-toastify";

// /**
//  * Sahayak API Instance
//  * Centralized configuration for all backend communication.
//  */
// const api = axios.create({
//   // Pointing to your Node.js backend environment variable
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",

//   timeout: 15000, // Increased to 15s for handling potential file uploads/processing
//   withCredentials: true,

//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // ==============================
// // REQUEST INTERCEPTOR
// // ==============================
// api.interceptors.request.use(
//   (config) => {
//     // Dynamically retrieve token (Best for Sahayak's security flow)
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ==============================
// // RESPONSE INTERCEPTOR
// // ==============================
// api.interceptors.response.use(
//   (response) => response, 
//   (error) => {
//     // If no response is received, it's likely a network issue
//     if (!error.response) {
//       toast.error("Internet connection ki samasya hai. Kripya thodi der mein koshish karein.", { transition: Bounce });
//       return Promise.reject(error);
//     }

//     // Extract message from backend if available
//     const backendMessage = error.response?.data?.message;
//     const status = error.response?.status;

//     // Handle specific status codes with human-first Hinglish Toasts
//     switch (status) {
//       case 400:
//         toast.error(backendMessage || "Jankari galat hai, kripya dobara check karein.", { transition: Bounce });
//         break;
//       case 401:
//         toast.error("Aapka login samapt ho gaya hai. Kripya phirse login karein.", { transition: Bounce });
//         // Optional: window.location.href = "/";
//         break;
//       case 403:
//         toast.error("Aapko iski anumati nahi hai.", { transition: Bounce });
//         break;
//       case 404:
//         toast.error("Yeh jankari nahi mil saki.", { transition: Bounce });
//         break;
//       case 500:
//       case 502:
//       case 503:
//       case 504:
//         toast.error("Server par kuch samasya hai. Kripya thodi der baad koshish karein.", { transition: Bounce });
//         break;
//       default:
//         toast.error(backendMessage || "Kuch galat ho gaya. Kripya dobara koshish karein.", { transition: Bounce });
//     }

//     return Promise.reject(error);
//   }
// );

// // Exporting as 'api' for better semantic naming in services
// export default api;
import axios from "axios";
import { toast, Bounce } from "react-toastify";

/**
 * Sahayak API Instance
 * Centralized configuration for all backend communication.
 */
const api = axios.create({
  // Pointing to your Node.js backend environment variable
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",

  timeout: 15000, // Increased to 15s for handling potential file uploads/processing
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use(
  (config) => {
    // Dynamically retrieve token (Best for Sahayak's security flow)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // If no response is received, it's likely a network issue
    if (!error.response) {
      toast.error("Internet connection ki samasya hai. Kripya thodi der mein koshish karein.", { transition: Bounce });
      return Promise.reject(error);
    }

    // Extract message from backend if available
    const backendMessage = error.response?.data?.message;
    const status = error.response?.status;

    // Handle specific status codes with human-first Hinglish Toasts
    switch (status) {
      case 400:
        toast.error(backendMessage || "Jankari galat hai, kripya dobara check karein.", { transition: Bounce });
        break;
      case 401:
        toast.error("Aapka login samapt ho gaya hai. Kripya phirse login karein.", { transition: Bounce });
        // Optional: window.location.href = "/";
        break;
      case 403:
        toast.error("Aapko iski anumati nahi hai.", { transition: Bounce });
        break;
      case 404:
        toast.error("Yeh jankari nahi mil saki.", { transition: Bounce });
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        toast.error("Server par kuch samasya hai. Kripya thodi der baad koshish karein.", { transition: Bounce });
        break;
      default:
        toast.error(backendMessage || "Kuch galat ho gaya. Kripya dobara koshish karein.", { transition: Bounce });
    }

    return Promise.reject(error);
  }
);

// Exporting as 'api' for better semantic naming in services
export default api;