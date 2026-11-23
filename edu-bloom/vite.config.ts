// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        // Proxy all /nextlvlict_war/* requests to the local Tomcat instance during development.
        // In production the frontend is deployed on the same Tomcat, so no proxy is needed.
        "/nextlvlict_war": {
          target: process.env["VITE_BACKEND_PROXY_TARGET"] ?? "http://localhost:8080",
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes) => {
              // Rewrite Tomcat's JSESSIONID cookie so the browser accepts it over http://localhost:
              //   SameSite=None → SameSite=Lax  (None requires Secure which we strip next)
              //   Secure flag removed           (http:// doesn't satisfy Secure)
              const setCookie = proxyRes.headers["set-cookie"];
              if (setCookie) {
                proxyRes.headers["set-cookie"] = setCookie.map((cookie) =>
                  cookie
                    .replace(/SameSite=None/gi, "SameSite=Lax")
                    .replace(/;?\s*Secure/gi, ""),
                );
              }
            });
          },
        },
      },
    },
  },
});
