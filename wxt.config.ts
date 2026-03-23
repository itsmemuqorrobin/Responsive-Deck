import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import { EXTENSION_NAME } from "./src/utils/const";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    name: `${EXTENSION_NAME}`,
    description:
      "Frontend Responsive Tools for Security Paranoid and Prominent User Experience",
    permissions: ["activeTab", "tabs", "declarativeNetRequest", "storage"],
    action: {},
    host_permissions: ["http://*/*", "https://*/*"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      manifest.options_ui = {
        open_in_tab: true,
        page: "responsive-deck.html",
      };
    },
  },
});
