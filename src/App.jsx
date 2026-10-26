import { Routes, Route, useParams } from "react-router-dom";
import Site from "./Site.jsx";
import Blog from "./Blog.jsx";
import OsteopatheParis7 from "./OsteopatheParis7.jsx";
import LocalSpecPage from "./LocalSpecPage.jsx";
import NotFound from "./NotFound.jsx";
import { SiteHeader, SiteFooter, CallBar, RouteEffects } from "./Layout.jsx";

function BlogRoute() {
  const { slug } = useParams();
  return <Blog initialPost={slug || null} />;
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/osteopathe-paris-7" element={<OsteopatheParis7 />} />
        <Route path="/douleurs-dos-lombalgie-paris-7" element={<LocalSpecPage />} />
        <Route path="/cervicalgie-torticolis-paris-7" element={<LocalSpecPage />} />
        <Route path="/nourrisson-plagiocephalie-paris-7" element={<LocalSpecPage />} />
        <Route path="/femme-enceinte-osteopathe-paris-7" element={<LocalSpecPage />} />
        <Route path="/bruxisme-atm-paris-7" element={<LocalSpecPage />} />
        <Route path="/urgence-osteopathe-paris-7" element={<LocalSpecPage />} />
        <Route path="/osteopathe-sans-craquement-paris-7" element={<LocalSpecPage />} />
        <Route path="/blog" element={<BlogRoute />} />
        <Route path="/blog/:slug" element={<BlogRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SiteFooter />
      <CallBar />
    </>
  );
}
