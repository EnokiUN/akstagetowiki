import * as esbuild from "https://deno.land/x/esbuild@v0.20.0/mod.js";
import { copy } from "https://deno.land/std@0.220.0/fs/copy.ts";

try {
  await Deno.remove("./dist", { recursive: true });
} catch {}
copy("./static", "./dist");

await esbuild.build({
  entryPoints: ["./src/main.ts"],
  bundle: true,
  outfile: "./dist/index.js",
  format: "esm",
  minify: true,
});

esbuild.stop();
