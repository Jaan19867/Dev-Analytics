// src/VedAnalytics.tsx
import { useEffect } from "react";
var VedAnalytics = ({ project, apiKey }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.vedanalytics.in/bundle.js";
    script.dataset.project = project;
    script.dataset.apiKey = apiKey;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [project, apiKey]);
  return null;
};
var VedAnalytics_default = VedAnalytics;
export {
  VedAnalytics_default as VedAnalytics
};
