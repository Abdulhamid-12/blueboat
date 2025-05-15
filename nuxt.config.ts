// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxtjs/leaflet",
    "@nuxtjs/supabase"
  ],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: [],
    },
  },
});
