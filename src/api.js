import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await api.post("/api/auth/refresh");
    const newAccessToken = response.data.access_token;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getArticles = () => api.get("/api/articles?page=0&size=10");
export const getArticleById = (id) => api.get(`/api/articles/${id}`);
export const createArticle = (article) =>
  api.post("/api/articles", article, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });
export const updateArticle = (id, article) =>
  api.put(`/api/articles/${id}`, article, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });
export const deleteArticle = (id) =>
  api.delete(`/api/articles/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });
export const addTagsToArticle = (id, tagNames) =>
  api.post(`/api/articles/${id}/tags`, tagNames, {
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
  });
export const addComment = (articleId, content, parentCommentId) =>
  api.post(
    "/api/comments",
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      params: { articleId, content, parentCommentId },
    }
  );
export const createTag = (name) =>
  api.post("/api/tags", { name });
export const getTags = () => api.get("/api/tags");

export default api;