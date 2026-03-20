import "./i18n/index.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { FavouritesProvider } from "./context/FavouritesContext";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <FavouritesProvider>
        <App />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </FavouritesProvider>
    </HelmetProvider>
  </StrictMode>
);