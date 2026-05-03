import { defineConfig, type Plugin } from "vite"
import vue from "@vitejs/plugin-vue"
import { fxDtsPlugin } from "@fuxishi/svg-icon/vite"
import { fileURLToPath, URL } from "node:url"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

function demoDepsPlugin(): Plugin {
  const virtualId = "virtual:demo-deps"
  const resolvedId = "\0" + virtualId

  return {
    name: "demo-deps",
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id !== resolvedId) return
      const root = fileURLToPath(new URL(".", import.meta.url))
      const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf-8"))
      const deps: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies }
      const resolved: Record<string, string> = {}
      for (const [name, declared] of Object.entries(deps)) {
        const modPkgPath = resolve(root, "node_modules", name, "package.json")
        if (existsSync(modPkgPath)) {
          const modPkg = JSON.parse(readFileSync(modPkgPath, "utf-8"))
          resolved[name] = modPkg.version
        } else {
          resolved[name] = declared
        }
      }
      return `export const dependencies = ${JSON.stringify(resolved, null, 2)}`
    },
  }
}

export default defineConfig({
  base: "/fx-svg-icons/demos/naive/",
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
    demoDepsPlugin(),
  ],
})
