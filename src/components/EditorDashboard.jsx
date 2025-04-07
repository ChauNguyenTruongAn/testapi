import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticlesByAuthor } from "../api";

function EditorDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  //   const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const picture = localStorage.getItem("user_picture");
    const googleId = localStorage.getItem("google_id");
    setUserName(name || "");
    setUserPicture(picture || "");

    const fetchArticles = async () => {
      try {
        // Check if we have the Google ID
        if (!googleId) {
          console.error("Google ID not found in localStorage");
          setError(
            "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
          );
          setLoading(false);
          return;
        }

        console.log(`Fetching articles for author ID (Google ID): ${googleId}`);
        const response = await getArticlesByAuthor(
          googleId,
          page,
          size,
          "title"
        );

        console.log("API Response:", response.data);

        // Handle paginated response
        if (response.data && response.data.content) {
          setArticles(response.data.content);
          setTotalPages(response.data.totalPages);
        } else if (Array.isArray(response.data)) {
          setArticles(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setArticles([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching author articles:", err);
        setError("Không thể tải danh sách bài viết");
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, size]);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Trang Biên Tập Viên
          </h1>
          <div className="flex items-center">
            {userPicture && (
              <img
                src={userPicture}
                alt={userName}
                className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
              />
            )}
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý bài viết của tôi
          </h2>
          <Link
            to="/add-article"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Viết bài mới
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {articles.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <li
                    key={article.articleId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {article.title}
                          </p>
                          <span
                            className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              article.status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {article.status === "PUBLISHED"
                              ? "Đã xuất bản"
                              : "Chưa xuất bản"}
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <Link
                            to={`/edit-article/${article.articleId}`}
                            className="mr-2 text-blue-600 hover:text-blue-900"
                          >
                            Chỉnh sửa
                          </Link>
                          <Link
                            to={`/article/${article.articleId}`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Xem
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              {article.summary?.substring(0, 100) ||
                                "Không có tóm tắt"}
                              ...
                            </span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Tạo ngày:{" "}
                            {new Date(article.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 0}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        page === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Trang trước
                    </button>
                    <div className="text-sm text-gray-500">
                      Trang {page + 1} / {totalPages}
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages - 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        page >= totalPages - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Trang sau
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Bạn chưa có bài viết nào. Hãy bắt đầu viết bài mới!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EditorDashboard;
