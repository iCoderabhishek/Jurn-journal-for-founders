// import axios from "axios";
// import { BASE_URL } from "./constants";

// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000,
//     headers: {
//         "Content-Type": "application/json"
//     },
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("token");
//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // 🔹 Helper function to generate embeddings
// export const generateEmbedding = async (text) => {
//     try {

//         const response = await axios.post(
//             "https://generativelanguage.googleapis.com/v1/models/embedding-001:embedContent",
//             {
//                 content: { parts: [{ text }] }
//             },
//             {
//                 params: {
//                     key: import.meta.env.VITE_GEMINI_API_KEY, // ✅ Correct way
//                 },
//             }
//         );

//         console.log("Embedding response:", response.data); // Debugging log

//         return response.data?.embedding?.values || null;
//     } catch (error) {
//         console.error("Error generating embedding:", error.response?.data || error.message);
//         return null;
//     }
// };


// export default axiosInstance;
