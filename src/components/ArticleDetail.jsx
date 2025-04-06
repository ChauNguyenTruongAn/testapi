import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById, addComment } from "../api";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState(null);
  const isAuthenticated = !!localStorage.getItem("access_token");

  useEffect(() => {
    getArticleById(id)
      .then((response) => setArticle(response.data))
      .catch((err) => setError("Failed to fetch article details."));
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/article/${id}` } });
      return;
    }
    try {
      await addComment(id, comment, replyTo);
      setComment("");
      setReplyTo(null);
      getArticleById(id).then((response) => setArticle(response.data));
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  const renderComments = (comments, level = 0) => {
    return comments.map((c) => (
      <div key={c.commentId} className={`ml-${level * 4} mb-4`}>
        <div className="bg-gray-100 p-3 rounded">
          <p>{c.content}</p>
          <p className="text-sm text-gray-600">By {c.author.name} on {new Date(c.createdAt).toLocaleString()}</p>
          <button
            onClick={() => setReplyTo(c.commentId)}
            className="text-blue-600 hover:underline"
          >
            Reply
          </button>
        </div>
        {c.replies && c.replies.length > 0 && renderComments(c.replies, level + 1)}
      </div>
    ));
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Article Detail</h2>
        {error && <div className="bg-red-100 p-4 rounded mb-6 text-red-700">{error}</div>}
        {article ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{article.title}</h3>
            <p className="text-gray-700 mb-4">{article.content || "No content available."}</p>
            <div className="mb-4">
              <span className="font-medium">Tags: </span>
              {article.tags.map((tag) => (
                <span key={tag.tagId} className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-2">
                  {tag.name}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Back
            </button>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Comments</h4>
              {article.comments && renderComments(article.comments.filter((c) => !c.parentComment))}
              {isAuthenticated && (
                <form onSubmit={handleCommentSubmit} className="mt-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Write a comment..."
                    required
                  />
                  {replyTo && (
                    <p className="text-sm text-gray-600">Replying to comment #{replyTo}</p>
                  )}
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                      Submit Comment
                    </button>
                    {replyTo && (
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="ml-2 text-gray-600 hover:underline"
                      >
                        Cancel Reply
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          !error && <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;