/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WC_PROJECT_ID: string;
    readonly VITE_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }