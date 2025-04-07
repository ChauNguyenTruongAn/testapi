import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api";
import ArticleImage from "./ArticleImage";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Fetching articles...");
        const response = await getArticles();
        console.log("Articles API response:", response.data);

        // Check if the response has a content field (pagination format)
        if (response.data && response.data.content) {
          setArticles(response.data.content);
        } else if (Array.isArray(response.data)) {
          setArticles(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setArticles([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Không thể tải danh sách bài viết");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (articles.length === 0)
    return <div className="text-center py-8">Chưa có bài viết nào</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Link
          to="/add-article"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm bài viết mới
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.articleId}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {article.imageUrl && (
              <div className="relative w-full h-48">
                <ArticleImage
                  imageUrl={article.imageUrl}
                  thumbnailUrl={article.thumbnailUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  to={`/article/${article.articleId}`}
                  className="hover:text-blue-600"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{article.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <Link
                    to={`/edit-article/${article.articleId}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Chỉnh sửa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
