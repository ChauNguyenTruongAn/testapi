import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, deleteArticle } from "../api";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    getArticles()
      .then((response) => setArticles(response.data.content || []))
      .catch((err) => setError("Failed to fetch articles."));
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      deleteArticle(id)
        .then(() => setArticles(articles.filter((a) => a.articleId !== id)))
        .catch((err) => setError("Failed to delete article."));
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">
          {role === "admin" && window.location.pathname === "/dashboard" ? "Admin Dashboard" : "Latest News"}
        </h2>
        {!isAuthenticated && (
          <div className="bg-blue-100 p-4 rounded mb-6">
            Please{" "}
            <button
              onClick={() => navigate("/login", { state: { from: window.location.pathname } })}
              className="text-blue-600 underline"
            >
              login
            </button>{" "}
            to access more features.
          </div>
        )}
        {error && <div className="bg-red-100 p-4 rounded mb-6 text-red-700">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.articleId}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition mb-4"
                >
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <p className="text-gray-600">{article.summary || "No summary available."}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => navigate(`/article/${article.articleId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Read More
                    </button>
                    {isAuthenticated && role === "admin" && (
                      <>
                        <button
                          onClick={() => navigate(`/edit-article/${article.articleId}`)}
                          className="text-green-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.articleId)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No articles available.</p>
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Featured Articles</h4>
            {articles.slice(0, 3).map((article) => (
              <div key={article.articleId} className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h5 className="text-md font-medium">{article.title}</h5>
                <button
                  onClick={() => navigate(`/article/${article.articleId}`)}
                  className="text-blue-600 hover:underline"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;