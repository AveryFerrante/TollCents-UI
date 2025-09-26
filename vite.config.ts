import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       // Example manualChunks: split vendor code and common libs
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           if (id.includes("react")) return "vendor-react";
  //           return "vendor";
  //         }
  //         // if (id.includes("node_modules")) {
  //         //   if (id.includes("react")) return "vendor-react";
  //         //   // put large libs into their own chunk by package name
  //         //   const pkgMatch = id.toString().match(/node_modules\/(.*?)(\/|$)/);
  //         //   if (pkgMatch) return `vendor-${pkgMatch[1].replace("@", "")}`;
  //         //   return "vendor";
  //         // }
  //       },
  //     },
  //   },
  //   // Tweak chunk size warning if you like
  //   chunkSizeWarningLimit: 500,
  // },
});
