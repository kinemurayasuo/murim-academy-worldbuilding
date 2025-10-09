// Test glob pattern
const modules = import.meta.glob("./설정/**/*.md", { query: "?raw", import: "default" });
console.log("Test glob found:", Object.keys(modules).length, "files");
console.log("Sample paths:", Object.keys(modules).slice(0, 10));
