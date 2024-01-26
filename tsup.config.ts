import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "es2017",
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  treeshake: true,
  sourcemap: true,
  minify: true,
});