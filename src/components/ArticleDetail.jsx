import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getArticleById } from "../api";
import ArticleImage from "./ArticleImage";
import CommentSection from "./CommentSection";
import FavoriteButton from "./FavoriteButton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

function ArticleDetail() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!articleId) {
          setError("Không tìm thấy bài viết");
          setLoading(false);
          return;
        }

        const response = await getArticleById(articleId);
        console.log("Article data:", response.data);
        setArticle(response.data);
        setLoading(false);

        // Giả lập bài viết liên quan - trong thực tế nên có API riêng
        if (response.data && response.data.category) {
          // Giả sử có 3 bài viết liên quan
          setRelatedArticles([
            {
              articleId: "related1",
              title: "Bài viết liên quan 1",
              summary: "Tóm tắt bài viết liên quan 1",
              thumbnailUrl: "https://via.placeholder.com/300x200",
              createdAt: new Date().toISOString(),
            },
            {
              articleId: "related2",
              title: "Bài viết liên quan 2",
              summary: "Tóm tắt bài viết liên quan 2",
              thumbnailUrl: "https://via.placeholder.com/300x200",
              createdAt: new Date().toISOString(),
            },
            {
              articleId: "related3",
              title: "Bài viết liên quan 3",
              summary: "Tóm tắt bài viết liên quan 3",
              thumbnailUrl: "https://via.placeholder.com/300x200",
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Không thể tải bài viết");
        setLoading(false);
      }
    };

    fetchArticle();
    // Scroll to top when navigating to a new article
    window.scrollTo(0, 0);
  }, [articleId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
      locale: vi,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Không tìm thấy bài viết</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav
            className="flex mb-6 text-sm text-gray-500"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center space-x-1">
              <li>
                <Link to="/" className="hover:text-blue-600">
                  Trang chủ
                </Link>
              </li>
              <li>
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <Link
                  to={`/category/${article.category?.name?.toLowerCase()}`}
                  className="hover:text-blue-600"
                >
                  {article.category?.name || "Tin tức"}
                </Link>
              </li>
              <li>
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="truncate max-w-xs">
                <span className="text-gray-700">{article.title}</span>
              </li>
            </ol>
          </nav>

          {/* Article header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center text-gray-600 gap-6 mb-6">
              <div className="flex items-center">
                {article.authorAvatar ? (
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName || article.authorEmail}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs font-medium">
                      {article.authorName?.charAt(0) ||
                        article.authorEmail?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                )}
                <span className="font-medium">
                  {article.authorName || article.authorEmail || "Tác giả"}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={article.createdAt}>
                  {formatDate(article.createdAt)}
                </time>
              </div>

              {article.category && (
                <Link
                  to={`/category/${article.category.name?.toLowerCase()}`}
                  className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium hover:bg-blue-200"
                >
                  {article.category.name}
                </Link>
              )}
            </div>

            {/* Article summary */}
            <div className="text-xl text-gray-700 font-medium border-l-4 border-blue-600 pl-4 italic">
              {article.summary}
            </div>
          </header>

          {/* Main image */}
          {article.imageUrl && (
            <figure className="mb-8">
              <div className="relative w-full h-auto rounded-lg overflow-hidden mb-2">
                <ArticleImage
                  imageUrl={article.imageUrl}
                  thumbnailUrl={article.thumbnailUrl}
                  alt={article.title}
                  className="w-full max-h-[600px] object-contain"
                  uploadToCloud={true}
                />
              </div>
              {article.imageCaption && (
                <figcaption className="text-center text-sm text-gray-500 italic">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              className="text-gray-800"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.tagId}
                    to={`/tag/${tag.name.toLowerCase()}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share buttons */}
          <div className="mt-8 flex items-center space-x-4">
            <FavoriteButton articleId={article.articleId} />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Đã sao chép liên kết!");
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg
                className="-ml-1 mr-2 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Chia sẻ
            </button>
          </div>

          {/* Comments Section */}
          <CommentSection articleId={article.articleId} />

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <div
                    key={relatedArticle.articleId}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300"
                  >
                    {relatedArticle.thumbnailUrl && (
                      <Link to={`/article/${relatedArticle.articleId}`}>
                        <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
                          <ArticleImage
                            imageUrl={relatedArticle.thumbnailUrl}
                            thumbnailUrl={relatedArticle.thumbnailUrl}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="p-4">
                      <h3 className="text-md font-bold mb-1 text-gray-900 line-clamp-2">
                        <Link
                          to={`/article/${relatedArticle.articleId}`}
                          className="hover:text-blue-700"
                        >
                          {relatedArticle.title}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {formatDate(relatedArticle.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
