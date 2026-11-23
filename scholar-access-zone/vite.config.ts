import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return ({
  server: {
    host: "::",
    // Tomcat runs on 8080 locally. Use Vite's normal development port so
    // `/nextlvlict_war` is proxied to Tomcat instead of pointing back at Vite.
    port: 5173,
    proxy: {
      // Proxy the actual local Tomcat context path. This keeps JSESSIONID on
      // the Vite origin (5173) and avoids cross-origin cookie/CORS issues.
      '/nextlvlict_war': {
        target: env.VITE_BACKEND_PROXY_TARGET,
        // target: 'https://648e-2402-d000-a400-47b5-452e-3866-e6cc-45d3.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        ws: false,
        // Keep Tomcat's session cookie usable by the Vite origin even if the
        // backend emits a host-specific cookie domain.
        cookieDomainRewrite: '',
        // Scope cookies forwarded by Tomcat to the same path used by every
        // browser-facing API request. This makes JSESSIONID available to the
        // proxied servlet URLs even when Tomcat returns a differently encoded
        // or normalized context path in Set-Cookie.
        cookiePathRewrite: '/nextlvlict_war',
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map(cookie => {
                return cookie
                  .replace(/SameSite=None/gi, 'SameSite=Lax')
                  .replace(/;?\s*Secure/gi, '');
              });
            }
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
});
