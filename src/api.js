import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getArticles = () => api.get("/api/articles?page=0&size=10");

// Thêm API để lấy bài viết cho trang chủ
export const getHomeArticles = (page = 0, size = 10, sort = 'createdAt,desc') => 
  api.get(`/api/articles/home?page=${page}&size=${size}&sort=${sort}`);

export const getArticleById = (id) => {
  console.log(`Calling API to get article with ID: ${id}`);
  return api.get(`/api/articles/${id}`)
    .then(response => {
      console.log(`API response for article ${id}:`, response.data);
      return response;
    })
    .catch(error => {
      console.error(`Error fetching article ${id}:`, error);
      throw error;
    });
};

export const getArticlesByCategory = async (categoryId, page = 0, size = 10, sort = "title") => {
  try {
    const response = await api.get(`/api/articles/category/${categoryId}`, {
      params: {
        page,
        size,
        sort
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    throw error;
  }
};

export const createArticle = (article) => api.post("/api/articles", article);
export const updateArticle = (id, article) => api.put(`/api/articles/${id}`, article);
export const deleteArticle = (id) => api.delete(`/api/articles/${id}`);
export const addTagsToArticle = (id, tagNames) =>
  api.post(`/api/articles/${id}/tags`, tagNames);
export const createTag = (name) =>
  api.post("/api/tags", { name });
export const getTags = () => api.get("/api/tags");
export const login = (email, password) => api.post("/api/auth/login", { email, password });
export const register = (userData) => api.post("/api/auth/register", userData);
export const loginWithGoogle = (googleData) => 
  api.post('/api/auth/google', googleData);
export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const publishArticle = (articleId) => api.put(`/api/admin/articles/${articleId}/publish`);
export const unpublishArticle = (articleId) => api.put(`/api/admin/articles/${articleId}/unpublish`);

export const getAdminArticles = (page = 0, size = 10, sort = 'title') => 
  api.get(`/api/admin/articles?page=${page}&size=${size}&sort=${sort}`);

export const uploadImage = (imageData) => {
  console.log("Calling upload image API...");
  
  // Convert base64 string to a blob
  const base64Response = fetch(imageData);
  return base64Response.then(res => res.blob()).then(blob => {
    // Create FormData and append file
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');
    
    // Send as multipart/form-data
    return api.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  })
  .then(response => {
    console.log("Image upload successful, response:", response);
    return response;
  })
  .catch(error => {
    console.error("Error in uploadImage API call:", error);
    throw error;
  });
};

// Category API calls
export const getParentCategories = async () => {
  try {
    const response = await api.get("/api/categories/parent");
    return response.data;
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    throw error;
  }
};

export const getChildCategories = async (parentId) => {
  try {
    const response = await api.get(`/api/categories/children/${parentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching child categories:", error);
    throw error;
  }
};

export const getCategoriesTree = async () => {
  try {
    const response = await api.get("/api/categories/tree");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories tree:", error);
    throw error;
  }
};

// Category management API calls
export const createParentCategory = (categoryData) => api.post("/api/categories/parent", categoryData);
export const createChildCategory = (categoryData) => api.post("/api/categories/child", categoryData);
export const updateCategory = (categoryId, categoryData) => api.put(`/api/categories/${categoryId}`, categoryData);
export const deleteCategory = (categoryId) => api.delete(`/api/categories/${categoryId}`);

// User management API calls
export const requestEditorRole = () => api.post("/api/users/request-editor");
export const getUsers = () => api.get("/api/admin/users");
export const approveEditorRequest = (googleId) => api.put(`/api/admin/users/${googleId}/approve-editor`);
export const changeUserRole = (googleId, roleName) => api.put(`/api/admin/users/${googleId}/role`, { roleName });

// Author articles API
export const getArticlesByAuthor = (authorId, page = 0, size = 10, sort = 'title') => 
  api.get(`/api/articles/author/${authorId}?page=${page}&size=${size}&sort=${sort}`);

// Comments API
export const getCommentsByArticleId = (articleId) => 
  api.get(`/api/comments/article/${articleId}`);

export const createComment = async (articleId, content, parentCommentId = null) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  try {
    const response = await api.post(
      "/api/comments",
      {
        articleId: Number(articleId),
        content,
        parentCommentId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const updateComment = (commentId, content) => 
  api.put(`/api/comments/${commentId}?content=${encodeURIComponent(content)}`);

export const deleteComment = (commentId) => 
  api.delete(`/api/comments/${commentId}`);

// Reading history API
export const getReadingHistory = (userId) => 
  api.get(`/api/reading-history/user/${userId}`);

// Favorites API
export const checkFavoriteStatus = (articleId, googleId) =>
  api.get(`/api/favorites/article/${articleId}/user/${googleId}`);

export const toggleFavorite = (googleId, articleId) =>
  api.post("/api/favorites", { googleId, articleId });

// eslint-disable-next-line no-unused-vars
export const getFavorites = (googleId) =>
  api.get("/api/favorites");

export const getStats = async () => {
  try {
    const response = await api.get("/api/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export default api;