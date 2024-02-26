import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "build",
		lib: {
			entry: resolve(__dirname, "src/index.js"),
			formats: ["es"],
		},
		rollupOptions: {
			external: ["react", "react-dom", "tailwindcss"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				intro: 'import "./style.css";',
			},
		},
	},
});
