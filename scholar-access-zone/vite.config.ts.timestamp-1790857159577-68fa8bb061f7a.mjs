// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/hiran/IdeaProjects/nextlvlict-final/scholar-access-zone/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/hiran/IdeaProjects/nextlvlict-final/scholar-access-zone/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/hiran/IdeaProjects/nextlvlict-final/scholar-access-zone/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\hiran\\IdeaProjects\\nextlvlict-final\\scholar-access-zone";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      // Tomcat runs on 8080 locally. Use Vite's normal development port so
      // `/nextlvlict_war` is proxied to Tomcat instead of pointing back at Vite.
      port: 5173,
      proxy: {
        // Proxy the actual local Tomcat context path. This keeps JSESSIONID on
        // the Vite origin (5173) and avoids cross-origin cookie/CORS issues.
        "/nextlvlict_war": {
          target: env.VITE_BACKEND_PROXY_TARGET,
          // target: 'https://648e-2402-d000-a400-47b5-452e-3866-e6cc-45d3.ngrok-free.app',
          changeOrigin: true,
          secure: false,
          ws: false,
          // Keep Tomcat's session cookie usable by the Vite origin even if the
          // backend emits a host-specific cookie domain.
          cookieDomainRewrite: "",
          // Scope cookies forwarded by Tomcat to the same path used by every
          // browser-facing API request. This makes JSESSIONID available to the
          // proxied servlet URLs even when Tomcat returns a differently encoded
          // or normalized context path in Set-Cookie.
          cookiePathRewrite: "/nextlvlict_war",
          configure: (proxy, _options) => {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              const setCookie = proxyRes.headers["set-cookie"];
              if (setCookie) {
                proxyRes.headers["set-cookie"] = setCookie.map((cookie) => {
                  return cookie.replace(/SameSite=None/gi, "SameSite=Lax").replace(/;?\s*Secure/gi, "");
                });
              }
            });
          }
        }
      }
    },
    plugins: [
      react(),
      mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxoaXJhblxcXFxJZGVhUHJvamVjdHNcXFxcbmV4dGx2bGljdC1maW5hbFxcXFxzY2hvbGFyLWFjY2Vzcy16b25lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxoaXJhblxcXFxJZGVhUHJvamVjdHNcXFxcbmV4dGx2bGljdC1maW5hbFxcXFxzY2hvbGFyLWFjY2Vzcy16b25lXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9oaXJhbi9JZGVhUHJvamVjdHMvbmV4dGx2bGljdC1maW5hbC9zY2hvbGFyLWFjY2Vzcy16b25lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XHJcbiAgcmV0dXJuICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICAvLyBUb21jYXQgcnVucyBvbiA4MDgwIGxvY2FsbHkuIFVzZSBWaXRlJ3Mgbm9ybWFsIGRldmVsb3BtZW50IHBvcnQgc29cclxuICAgIC8vIGAvbmV4dGx2bGljdF93YXJgIGlzIHByb3hpZWQgdG8gVG9tY2F0IGluc3RlYWQgb2YgcG9pbnRpbmcgYmFjayBhdCBWaXRlLlxyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vIFByb3h5IHRoZSBhY3R1YWwgbG9jYWwgVG9tY2F0IGNvbnRleHQgcGF0aC4gVGhpcyBrZWVwcyBKU0VTU0lPTklEIG9uXHJcbiAgICAgIC8vIHRoZSBWaXRlIG9yaWdpbiAoNTE3MykgYW5kIGF2b2lkcyBjcm9zcy1vcmlnaW4gY29va2llL0NPUlMgaXNzdWVzLlxyXG4gICAgICAnL25leHRsdmxpY3Rfd2FyJzoge1xyXG4gICAgICAgIHRhcmdldDogZW52LlZJVEVfQkFDS0VORF9QUk9YWV9UQVJHRVQsXHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cHM6Ly82NDhlLTI0MDItZDAwMC1hNDAwLTQ3YjUtNDUyZS0zODY2LWU2Y2MtNDVkMy5uZ3Jvay1mcmVlLmFwcCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgd3M6IGZhbHNlLFxyXG4gICAgICAgIC8vIEtlZXAgVG9tY2F0J3Mgc2Vzc2lvbiBjb29raWUgdXNhYmxlIGJ5IHRoZSBWaXRlIG9yaWdpbiBldmVuIGlmIHRoZVxyXG4gICAgICAgIC8vIGJhY2tlbmQgZW1pdHMgYSBob3N0LXNwZWNpZmljIGNvb2tpZSBkb21haW4uXHJcbiAgICAgICAgY29va2llRG9tYWluUmV3cml0ZTogJycsXHJcbiAgICAgICAgLy8gU2NvcGUgY29va2llcyBmb3J3YXJkZWQgYnkgVG9tY2F0IHRvIHRoZSBzYW1lIHBhdGggdXNlZCBieSBldmVyeVxyXG4gICAgICAgIC8vIGJyb3dzZXItZmFjaW5nIEFQSSByZXF1ZXN0LiBUaGlzIG1ha2VzIEpTRVNTSU9OSUQgYXZhaWxhYmxlIHRvIHRoZVxyXG4gICAgICAgIC8vIHByb3hpZWQgc2VydmxldCBVUkxzIGV2ZW4gd2hlbiBUb21jYXQgcmV0dXJucyBhIGRpZmZlcmVudGx5IGVuY29kZWRcclxuICAgICAgICAvLyBvciBub3JtYWxpemVkIGNvbnRleHQgcGF0aCBpbiBTZXQtQ29va2llLlxyXG4gICAgICAgIGNvb2tpZVBhdGhSZXdyaXRlOiAnL25leHRsdmxpY3Rfd2FyJyxcclxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCByZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2V0Q29va2llID0gcHJveHlSZXMuaGVhZGVyc1snc2V0LWNvb2tpZSddO1xyXG4gICAgICAgICAgICBpZiAoc2V0Q29va2llKSB7XHJcbiAgICAgICAgICAgICAgcHJveHlSZXMuaGVhZGVyc1snc2V0LWNvb2tpZSddID0gc2V0Q29va2llLm1hcChjb29raWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb2tpZVxyXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvU2FtZVNpdGU9Tm9uZS9naSwgJ1NhbWVTaXRlPUxheCcpXHJcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC87P1xccypTZWN1cmUvZ2ksICcnKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxyXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4WCxTQUFTLGNBQWMsZUFBZTtBQUNwYSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBLE1BR04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUE7QUFBQSxRQUdMLG1CQUFtQjtBQUFBLFVBQ2pCLFFBQVEsSUFBSTtBQUFBO0FBQUEsVUFFWixjQUFjO0FBQUEsVUFDZCxRQUFRO0FBQUEsVUFDUixJQUFJO0FBQUE7QUFBQTtBQUFBLFVBR0oscUJBQXFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUtyQixtQkFBbUI7QUFBQSxVQUNuQixXQUFXLENBQUMsT0FBTyxhQUFhO0FBQzlCLGtCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxRQUFRO0FBQzNDLG9CQUFNLFlBQVksU0FBUyxRQUFRLFlBQVk7QUFDL0Msa0JBQUksV0FBVztBQUNiLHlCQUFTLFFBQVEsWUFBWSxJQUFJLFVBQVUsSUFBSSxZQUFVO0FBQ3ZELHlCQUFPLE9BQ0osUUFBUSxtQkFBbUIsY0FBYyxFQUN6QyxRQUFRLGlCQUFpQixFQUFFO0FBQUEsZ0JBQ2hDLENBQUM7QUFBQSxjQUNIO0FBQUEsWUFDRixDQUFDO0FBQUEsVUFDSDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxJQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLElBQ2hCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0EsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
