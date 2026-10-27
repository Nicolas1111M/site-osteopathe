import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Site from "./Site.jsx";
import Blog from "./Blog.jsx";
import OsteopatheParis7 from "./OsteopatheParis7.jsx";
import LocalSpecPage from "./LocalSpecPage.jsx";
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
        <Route path="/osteopathe-paris-7" element={<OsteopatheParis7 />} />
        <Route path="/douleurs-dos-lombalgie-paris-7" element={<LocalSpecPage />} />
        <Route path="/cervicalgie-torticolis-paris-7" element={<LocalSpecPage />} />
        <Route path="/nourrisson-plagiocephalie-paris-7" element={<LocalSpecPage />} />
        <Route path="/femme-enceinte-osteopathe-paris-7" element={<LocalSpecPage />} />
        <Route path="/bruxisme-atm-paris-7" element={<LocalSpecPage />} />
        <Route path="/urgence-osteopathe-paris-7" element={<LocalSpecPage />} />
        <Route path="/osteopathe-sans-craquement-paris-7" element={<LocalSpecPage />} />
        <Route path="/blog" element={<BlogWrapper />} />
        <Route path="/blog/:slug" element={<BlogWrapper />} />
      </Routes>
    </>
  );
}
