# Jbook-revamp-sg

jbook

---

## This app:

- we want to run something like 'jbook serve'
- this should start a server of localhost:4005
- user will write code into an editor
- we bundle in the browser
- we execute the users code in iframe localhost:4006

---

## esbuild NPM module

```txt

---------------
  JS Wrapper   |
---------------
   Go Code <----- thing that does the actual transpile + bundling
---------------

```

---

## ESBuild: esbuild-wasm NPM module

Small amount of JS ----> WASM <- Go Lang bundler compileed to work in the browser

---

**additional stuff**

- `npm view` -> example: `npm view react dist.tarball`
- we'r gonna use unpkg.com

---

#### ESBuild Bundling Process

1. Figure out where the `index.js` file is stored <- `onResolve` step
2. Attempt to load up the `index.js` file <- `onLoad` step
3. Parse the `index.js` file, find any `import / require / exports`
4. If there are any ` import / require / exports`, figure out where the requested file is <- `onResolve` step
5. Attempt to load that file up <- `onLoad` step

---

#### Example:

```ts
export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        return { path: args.path, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
          import message from './message';
          console.log(message);
        `,
          };
        } else {
          return {
            loader: "jsx",
            contents: 'export default "hi there!"',
          };
        }
      });
    },
  };
};
```

---

#### Some stuff for unpkg

**Fetching the main file of a package**:

- `https://unpkg.com/`
- package name

---

**Fetching ANY other file in that package**:

- `https://unpkg.com`
- directory the last file was found in
- the require statement for this file

---

#### Better version of `unpkgPathPlugin` (gonna be refactored)

```ts
import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }

        // ./utils, ../utils
        if (args.path.includes("./") || args.path.includes("../")) {
          return {
            namespace: "a",
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }

        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
            import React, { useState } from 'react@16.0.0';

            console.log(React, useState);
        `,
          };
        }

        const { data, request } = await axios.get(args.path);
        // console.log(request);
        return {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
      });
    },
  };
};
```

---

#### Implementing a caching layer

```txt

index.js -> onResolve, onLoad
  |
  V
`nested-test-pkg`
  |
  V
onResolve
  |
  V
onLoad -> Cache (have we already fetched this?) -> unpkg.com
  |
  V
`.helpers/utils`
  |
  V
onResolve
  |
  V
onLoad -> Cache (...) -> unpkg.com

```

---

#### Tricking ESBuild's CSS Handling

example:

index.js: 'import bulma/css/bulma.css'
bluma.css: 'body { background-color: 'red'};'

--> ESBuild emits:

- output.js
- output.css

our solution, inside our fetch-plugin.ts (no caching in this example)

```js
export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }

        const { data, request } = await axios.get(args.path);

        const fileyType = args.path.match(/.css$/) ? "css" : "jsx";

        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents =
          fileyType === "css"
            ? `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        return result;
      });
    },
  };
};
```

---

## IFrames

**Direct access between frames is allowed when...**

- The iframe elements does not have a `sandbox` property, or has a `sandbox=allow-same-origin` property
- We fetch the parent HTML doc and the frame HTML doc from **exact same** DOMAIN && PORT && PROTOCOL (http vs https)

---

**Consideration Around Code Execution**

- User-provided code might throw errors and cause our program to crash <- **Solved if we executing a user's code in an iframe**
- User-provided code might mutate the DOM, causing our program to crash <- **Solved if we executing a user's code in an iframe**
- A user might accidentally run code provided by another malicious user <- **Solved if we execute a user's code in an ifram with direct communication disabled**

---

**NOTE**: don't forget to reset our iframe (mb) before bundling.

```js
document.querySelector('iframe').srcdoc =
```

```js
const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // here we reset our iframe before bundling...
    iframe.current.srcdoc = html;

    const result = await esbuild.build({...});
    //...
};
```

---

## Open Source Browser-Based Editors:

- **CodeMirror** - easy to use, doesn't have may out-of-the-box features
- **Ace Editor** - moderately easy to use, widely used
- **Mocaco Editor** - hardest to setup, gives almost-perfect editing experience immediately

---

### Monaco Editor

`npm install @monaco-editor/react`

**note**: no monaco-jsx-highlighter yet, probably never

---

## Reasonable debouncing

### Adding debouncing logic for bundling

- we should only start (in-browser) bundling process only after 1 second without any updates to 'input' state (CodeCell component)

- useEffect solution:

```js
useEffect(() => {
  const timer = setTimeout(async () => {
    const output = await bundle(input);
    setCode(output);
  }, 1000);

  return () => {
    clearTimeout(timer);
  };
}, [input]);
```

- found on stackoverflow:

```js
export function useLazyEffect(effect: EffectCallback, deps: DependencyList = [], wait = 300) {
  const cleanUp = useRef<void | (() => void)>();
  const effectRef = useRef<EffectCallback>();
  const updatedEffect = useCallback(effect, deps);
  effectRef.current = updatedEffect;
  const lazyEffect = useCallback(
    _.debounce(() => {
      cleanUp.current = effectRef.current?.();
    }, wait),
    [],
  );
  useEffect(lazyEffect, deps);
  useEffect(() => {
    return () => {
      cleanUp.current instanceof Function ? cleanUp.current() : undefined;
    };
  }, []);
}
```
