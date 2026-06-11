import { useState } from "react";
import Site from "./Site.jsx";
import Blog from "./Blog.jsx";

export default function App() {
  const [page, setPage] = useState("site");
  const [postId, setPostId] = useState(null);

  if (page === "blog") {
    return <Blog onBack={() => { setPage("site"); setPostId(null); }} initialPost={postId} />;
  }

  return <Site onBlog={(id) => { setPostId(id || null); setPage("blog"); }} />;
}
