// Single CommonJS file with "type": "commonjs" in package.json.
// Chosen over a dual ESM/CJS setup because the placeholder only needs to
// print a message and expose a version constant — modern Node can `import`
// a CJS module's default export, so a second .mjs file would be dead weight.

console.log("ColServe is launching soon. Visit https://colserve.dev to get early access.");

module.exports = { version: "0.0.1" };
