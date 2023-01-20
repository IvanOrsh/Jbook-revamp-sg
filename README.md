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
