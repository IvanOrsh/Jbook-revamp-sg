import * as esbuild from "esbuild-wasm";

import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugins";
import { getErrorMessage } from "../utils/get-error-message";

export const bundle = async (rawCode: string) => {
  try {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        // it's not going to fix itself
        // "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      // TODO: fix this
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err) {
    return {
      code: "",
      err: getErrorMessage(err),
    };
  }
};
