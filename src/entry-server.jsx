// Point d'entrée du pré-rendu : produit le HTML réel de chaque page au moment du build.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import { SsrData } from "./ssr-data.js";

export { metaForPath, HOME_META, PARIS7_META, BLOG_META, postMeta, localPageMeta } from "./seo.js";
export { serializeSsrData } from "./ssr-data.js";

export function render(url, data = null) {
  return renderToString(
    <SsrData.Provider value={data}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </SsrData.Provider>
  );
}
