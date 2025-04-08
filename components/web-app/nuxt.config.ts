// https://nuxt.com/docs/api/configuration/nuxt-config
import { process } from "std-env";

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxtjs/leaflet",
    "@kgierke/nuxt-basic-auth",
  ],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  basicAuth: {
    enabled: true,
    users: [
      {
        username: process.env.NUXT_USER ?? "",
        password: process.env.NUXT_PASSWORD ?? "",
      },
    ],
  },
});
