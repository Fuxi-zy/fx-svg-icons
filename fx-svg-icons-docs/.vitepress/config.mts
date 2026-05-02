import { defineConfig } from "vitepress"
import type { DefaultTheme } from "vitepress"
import fxConfig from "@fuxishi/vitepress-theme/config"
import type { FxThemeCustomConfig } from "@fuxishi/vitepress-theme/config"

type ThemeConfig = DefaultTheme.Config & FxThemeCustomConfig

export default defineConfig<ThemeConfig>({
  extends: fxConfig,

  base: "/fx-svg-icons/",

  head: [["link", { rel: "icon", href: "/fx-svg-icons/favicon.png" }]],

  vite: {},

  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      description: "@fuxishi/svg-icon — Vue 3 图标组件库",
      themeConfig: {
        nav: [
          { text: "指南", link: "/guide/getting-started" },
          { text: "组件", link: "/components/fx-icon" },
          { text: "组合式函数", link: "/composables/use-icon-select" },
          { text: "插件", link: "/plugins/vite-plugin" },
          { text: "示例", link: "/demos" },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "指南",
              items: [
                { text: "快速开始", link: "/guide/getting-started" },
                { text: "安装", link: "/guide/installation" },
                { text: "Iconify 图标集", link: "/guide/iconify" },
              ],
            },
          ],
          "/components/": [
            {
              text: "组件",
              items: [
                { text: "FxIcon", link: "/components/fx-icon" },
                { text: "FxIconSelect", link: "/components/fx-icon-select" },
              ],
            },
          ],
          "/composables/": [
            {
              text: "组合式函数",
              items: [
                { text: "useIconSelect", link: "/composables/use-icon-select" },
              ],
            },
          ],
          "/plugins/": [
            {
              text: "插件",
              items: [{ text: "Vite 插件", link: "/plugins/vite-plugin" }],
            },
          ],
        },
        outline: {
          label: "目录",
          level: [2, 3],
        },
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },
        lastUpdated: {
          text: "最后更新于",
        },
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "菜单",
        darkModeSwitchLabel: "主题",
        lightModeSwitchTitle: "切换到浅色模式",
        darkModeSwitchTitle: "切换到深色模式",
      },
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      description: "@fuxishi/svg-icon — Vue 3 Icon Component Library",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/en/guide/getting-started" },
          { text: "Components", link: "/en/components/fx-icon" },
          { text: "Composables", link: "/en/composables/use-icon-select" },
          { text: "Plugins", link: "/en/plugins/vite-plugin" },
          { text: "Demos", link: "/en/demos" },
        ],
        sidebar: {
          "/en/guide/": [
            {
              text: "Guide",
              items: [
                { text: "Getting Started", link: "/en/guide/getting-started" },
                { text: "Installation", link: "/en/guide/installation" },
                { text: "Iconify Icons", link: "/en/guide/iconify" },
              ],
            },
          ],
          "/en/components/": [
            {
              text: "Components",
              items: [
                { text: "FxIcon", link: "/en/components/fx-icon" },
                { text: "FxIconSelect", link: "/en/components/fx-icon-select" },
              ],
            },
          ],
          "/en/composables/": [
            {
              text: "Composables",
              items: [
                {
                  text: "useIconSelect",
                  link: "/en/composables/use-icon-select",
                },
              ],
            },
          ],
          "/en/plugins/": [
            {
              text: "Plugins",
              items: [{ text: "Vite Plugin", link: "/en/plugins/vite-plugin" }],
            },
          ],
        },
        outline: {
          label: "On This Page",
          level: [2, 3],
        },
      },
    },
  },

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "@fuxishi/svg-icon",
    socialLinks: [
      { icon: "github", link: "https://github.com/Fuxi-zjx/fx-svg-icons" },
    ],
    confetti: true,
    heroImageColor: true,
    smoothScroll: true,
    codeBlockFold: true,
    musicBall: {
      enable: true,
      autoplay: false,
      loop: true,
      list: [
        { name: "海阔天空", src: "/music/BEYOND - 海阔天空.mp3" },
        {
          name: "梦中的婚礼",
          src: "/music/Richard Clayderman - Matrimonio De Amor (梦中的婚礼).mp3",
        },
        { name: "岁月神偷", src: "/music/suiyinjiliang.mp3" },
      ],
    },
    search: {
      provider: "local",
    },
  },
})
