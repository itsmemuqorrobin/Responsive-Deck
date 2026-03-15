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
    permissions: ["activeTab", "tabs", "declarativeNetRequest"],
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
