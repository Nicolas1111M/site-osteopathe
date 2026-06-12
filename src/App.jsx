import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Site from "./Site.jsx";
import Blog from "./Blog.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

function BlogWrapper() {
  const navigate = useNavigate();
  const { slug } = useParams();
  return (
    <Blog
      onBack={() => navigate("/")}
      initialPost={slug || null}
    />
  );
}

function SiteWrapper() {
  const navigate = useNavigate();
  return <Site onBlog={(id) => id ? navigate(`/blog/${id}`) : navigate("/blog")} />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SiteWrapper />} />
        <Route path="/blog" element={<BlogWrapper />} />
        <Route path="/blog/:slug" element={<BlogWrapper />} />
      </Routes>
    </>
  );
}
