// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Project/scholar-access-zone/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Project/scholar-access-zone/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///D:/Project/scholar-access-zone/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Project\\scholar-access-zone";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
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
          cookieDomainRewrite: ""
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0XFxcXHNjaG9sYXItYWNjZXNzLXpvbmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFByb2plY3RcXFxcc2Nob2xhci1hY2Nlc3Mtem9uZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvamVjdC9zY2hvbGFyLWFjY2Vzcy16b25lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgcmV0dXJuICh7XG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vIFByb3h5IHRoZSBhY3R1YWwgbG9jYWwgVG9tY2F0IGNvbnRleHQgcGF0aC4gVGhpcyBrZWVwcyBKU0VTU0lPTklEIG9uXG4gICAgICAvLyB0aGUgVml0ZSBvcmlnaW4gKDUxNzMpIGFuZCBhdm9pZHMgY3Jvc3Mtb3JpZ2luIGNvb2tpZS9DT1JTIGlzc3Vlcy5cbiAgICAgICcvbmV4dGx2bGljdF93YXInOiB7XG4gICAgICAgIHRhcmdldDogZW52LlZJVEVfQkFDS0VORF9QUk9YWV9UQVJHRVQsXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHBzOi8vNjQ4ZS0yNDAyLWQwMDAtYTQwMC00N2I1LTQ1MmUtMzg2Ni1lNmNjLTQ1ZDMubmdyb2stZnJlZS5hcHAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgd3M6IGZhbHNlLFxuICAgICAgICAvLyBLZWVwIFRvbWNhdCdzIHNlc3Npb24gY29va2llIHVzYWJsZSBieSB0aGUgVml0ZSBvcmlnaW4gZXZlbiBpZiB0aGVcbiAgICAgICAgLy8gYmFja2VuZCBlbWl0cyBhIGhvc3Qtc3BlY2lmaWMgY29va2llIGRvbWFpbi5cbiAgICAgICAgY29va2llRG9tYWluUmV3cml0ZTogJycsXG4gICAgICB9LFxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxyXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtSLFNBQVMsY0FBYyxlQUFlO0FBQ3hULE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFNBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBO0FBQUEsUUFHTCxtQkFBbUI7QUFBQSxVQUNqQixRQUFRLElBQUk7QUFBQTtBQUFBLFVBRVosY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFVBQ1IsSUFBSTtBQUFBO0FBQUE7QUFBQSxVQUdKLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsSUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUNoQixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNBLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
