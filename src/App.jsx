import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Dashboard from "./components/Dashboard";
import ArticleDetail from "./components/ArticleDetail";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mx-auto px-4 mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </div>
    </div>
  );
}



export default App;

/**
 * 
 * Anh muoson dudocjw cung xem afjlf ur sfsl
 * 
 */