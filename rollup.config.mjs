// import { defineConfig } from 'rollup';
import { nodeResolve } from "@rollup/plugin-node-resolve";

import typescript from "@rollup/plugin-typescript";

function relay() {
  return {
    name: "relay",
    transform(code) {
      // console.log("code", code);
      // Use indexOf as its probably ;-) faster
      if (code.indexOf("graphql`") > -1 || code.indexOf("graphql `") > -1) {
        // console.log("code", code);
        // throw new Error("test");
        const re =
          /graphql\s*`[^`]+(?<type>query|fragment|mutation|subscription)\s+(?<name>[\w_-\d]+)[^`]+`/gm;

        let imports = [];

        let transformedCode = code.replace(
          re,
          (matchStr, _g1, _g2, _pos, _code, groups) => {
            const importName = `__graphql__${groups.name}__`;

            imports.push(
              `import ${importName} from './__generated__/${groups.name}.graphql.ts';`,
            );
            return importName;
          },
        );

        if (imports.length > 0) {
          transformedCode += `
            ${imports.join("\n")}
          `;
        }

        return { code: transformedCode };
      }

      return null;
    },
  };
}

function cjsCallableWrapper() {
  return {
    name: "cjs-callable-wrapper",
    generateBundle(options) {
      if (options.format !== "cjs") {
        return;
      }

      this.emitFile({
        type: "asset",
        fileName: "index.cjs",
        source: `'use strict';

const core = require('./index.named.cjs');

function StackMachine(apiKey, config) {
  return Reflect.construct(
    core.StackMachine,
    [apiKey, config],
    new.target || core.StackMachine,
  );
}

Object.setPrototypeOf(StackMachine, core.StackMachine);
StackMachine.prototype = core.StackMachine.prototype;
Object.defineProperties(StackMachine, Object.getOwnPropertyDescriptors(core));
Object.defineProperty(StackMachine, 'default', {
  enumerable: true,
  value: StackMachine,
});
Object.defineProperty(StackMachine, 'StackMachine', {
  enumerable: true,
  value: core.StackMachine,
});

module.exports = StackMachine;
`,
      });
    },
  };
}

export default {
  input: "src/index.ts",
  external: ["@zip.js/zip.js", "graphql-ws", "relay-runtime"],
  output: [
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].js",
    },
    {
      dir: "dist",
      format: "cjs",
      exports: "named",
      entryFileNames: "[name].named.cjs",
    },
  ],
  plugins: [
    typescript({
      compilerOptions: {
        noEmit: false,
        outDir: "./dist",
        declaration: true,
        declarationDir: "./dist",
      },
    }),
    relay(),
    cjsCallableWrapper(),
    // nodeResolve()
  ],
};
