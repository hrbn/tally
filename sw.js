if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const l=e=>i(e,r),c={module:{uri:r},exports:o,require:l};s[r]=Promise.all(n.map((e=>c[e]||l(e)))).then((e=>(t(...e),o)))}}define(["./workbox-4e01a4be"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-a0ecd367.js",revision:null},{url:"assets/index-bb1d9714.css",revision:null},{url:"index.html",revision:"0dd8bfc6522fa76aa5583f664a14f210"},{url:"registerSW.js",revision:"5774d2f608f660169cdad26f1753c22e"},{url:"stats.html",revision:"d5beef88476d88708aa2c33b90ba5971"},{url:"manifest.webmanifest",revision:"70ba9b2e4978c5c55b57ecbcc7950351"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
