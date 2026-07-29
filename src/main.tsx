import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import "./i18n";
import App from "./app/main/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <div>
          <div
            className="bg-brand-card fixed inset-0 pointer-events-none animate-pulseLiveAppBg"
            style={{
              background:
                "linear-gradient(5deg, rgba(20, 33, 68, 1) 40%, rgba(14, 42, 78, 1) 40%, transparent 100%)",

              filter: "blur(40px)",
              opacity: 0.25,
              zIndex: 0,
            }}
          ></div>

          <App />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
