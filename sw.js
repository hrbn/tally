if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let c={};const o=e=>i(e,r),l={module:{uri:r},exports:c,require:o};s[r]=Promise.all(n.map((e=>l[e]||o(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4e01a4be"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-429b2b16.js",revision:null},{url:"assets/index-bb1d9714.css",revision:null},{url:"index.html",revision:"2ac91abd2eccc762c91e7de0798c275a"},{url:"registerSW.js",revision:"5774d2f608f660169cdad26f1753c22e"},{url:"stats.html",revision:"ae3183daa3cfdaad537006b7173b9380"},{url:"manifest.webmanifest",revision:"70ba9b2e4978c5c55b57ecbcc7950351"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
