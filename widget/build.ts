import * as esbuild from "esbuild";
import * as path from "path";

async function build() {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "src/widget.ts")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    outfile: path.join(__dirname, "../public/widget/app-switcher.js"),
  });
  console.log("Widget built to public/widget/app-switcher.js");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
