import { useState } from "react";
import Site from "./Site.jsx";
import Blog from "./Blog.jsx";

export default function App() {
  const [page, setPage] = useState("site");

  if (page === "blog") {
    return <Blog onBack={() => setPage("site")} />;
  }

  return <Site onBlog={() => setPage("blog")} />;
}
