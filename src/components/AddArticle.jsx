import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createArticle, updateArticle, getArticleById, addTagsToArticle, getTags } from "../api";

function EditArticle() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getArticleById(id)
        .then((response) => {
          const article = response.data;
          setTitle(article.title);
          setSummary(article.summary || "");
          setContent(article.content || "");
          setTags(article.tags.map((t) => t.name));
        })
        .catch((err) => setError("Failed to load article."));
    }
    getTags()
      .then((response) => setAvailableTags(response.data))
      .catch((err) => setError("Failed to load tags."));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { state: { from: id ? `/edit-article/${id}` : "/add-article" } });
      return;
    }

    const article = { title, summary, content };
    try {
      let savedArticle;
      if (id) {
        savedArticle = await updateArticle(id, article);
      } else {
        savedArticle = await createArticle(article);
      }
      if (tags.length > 0) {
        await addTagsToArticle(savedArticle.data.articleId, tags);
      }
      setSuccess(id ? "Article updated successfully!" : "Article added successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("Failed to save article.");
    }
  };

  const handleTagChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setTags(selected);
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{id ? "Edit Article" : "Add New Article"}</h2>
        {error && <div className="bg-red-100 p-4 rounded mb-6 text-red-700">{error}</div>}
        {success && <div className="bg-green-100 p-4 rounded mb-6 text-green-700">{success}</div>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">Summary</label>
            <input
              type="text"
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
            <textarea
              id="content"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
            <select
              id="tags"
              multiple
              value={tags}
              onChange={handleTagChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableTags.map((tag) => (
                <option key={tag.tagId} value={tag.name}>{tag.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              {id ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditArticle;