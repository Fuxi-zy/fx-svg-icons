import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fxDtsPlugin } from "@fuxishi/svg-icon/vite"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  base: "/fx-svg-icons/demos/antdv-next/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    fxDtsPlugin({
      svgGlobPattern: "/src/assets/svgs/**/*.svg",
      dtsDir: "@/types",
      splitDts: true,
    }),
  ],
})
