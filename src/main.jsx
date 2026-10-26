import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { SsrData, readClientSsrData } from "./ssr-data.js";
import "./styles.css";

const container = document.getElementById("root");
const tree = (
  <React.StrictMode>
    <SsrData.Provider value={readClientSsrData()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SsrData.Provider>
  </React.StrictMode>
);

// La page a été pré-rendue pour cette adresse : React reprend le HTML existant
// sans le remplacer (aucun clignotement). Sinon (adresse inconnue), rendu complet.
const normalize = (p) => p.replace(/\/+$/, "") || "/";
const prerenderedFor = container.getAttribute("data-ssr-path");
if (prerenderedFor && normalize(prerenderedFor) === normalize(window.location.pathname)) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
