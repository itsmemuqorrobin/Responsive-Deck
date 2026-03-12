import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    name: "Responsive Deck",
    description:
      "Frontend Responsive Tools for Security Paranoid and Prominent User Experience",
    permissions: ["activeTab", "tabs"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
