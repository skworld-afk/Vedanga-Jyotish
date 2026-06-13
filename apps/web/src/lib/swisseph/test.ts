import koffi from "koffi";

const dll = koffi.load(
  "E:/app/astro-saas/cpp/swisseph/build/Release/swisseph.dll"
);

console.log("DLL loaded:", !!dll);