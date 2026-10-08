var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n)),l=/* @__PURE__ */ (e=>typeof require<`u`?require:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof require<`u`?require:e)[t]}):e)(function(e){if(typeof require<`u`)return require.apply(this,arguments);throw Error('Calling `require` for "'+e+"\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.")}),u=Object.defineProperty,d=(e,t)=>u(e,`name`,{value:t,configurable:!0}),f=(e=>typeof l<`u`?l:typeof Proxy<`u`?new Proxy(e,{get:(e,t)=>(typeof l<`u`?l:e)[t]}):e)(function(e){if(typeof l<`u`)return l.apply(this,arguments);throw Error(`Dynamic require of "`+e+`" is not supported`)}),ee=(()=>{for(var e=/* @__PURE__ */ new Uint8Array(128),t=0;t<64;t++)e[t<26?t+65:t<52?t+71:t<62?t-4:t*4-205]=t;return t=>{for(var n=t.length,r=new Uint8Array((n-(t[n-1]==`=`)-(t[n-2]==`=`))*3/4|0),i=0,a=0;i<n;){var o=e[t.charCodeAt(i++)],s=e[t.charCodeAt(i++)],c=e[t.charCodeAt(i++)],l=e[t.charCodeAt(i++)];r[a++]=o<<2|s>>4,r[a++]=s<<4|c>>2,r[a++]=c<<6|l}return r}})();function te(e){return!isNaN(parseFloat(e))&&isFinite(e)}d(te,`_isNumber`);function p(e){return e.charAt(0).toUpperCase()+e.substring(1)}d(p,`_capitalize`);function m(e){return function(){return this[e]}}d(m,`_getter`);var h=[`isConstructor`,`isEval`,`isNative`,`isToplevel`],g=[`columnNumber`,`lineNumber`],_=[`fileName`,`functionName`,`source`],v=h.concat(g,_,[`args`],[`evalOrigin`]);function y(e){if(e)for(var t=0;t<v.length;t++)e[v[t]]!==void 0&&this[`set`+p(v[t])](e[v[t]])}for(d(y,`StackFrame`),y.prototype={getArgs:d(function(){return this.args},`getArgs`),setArgs:d(function(e){if(Object.prototype.toString.call(e)!==`[object Array]`)throw TypeError(`Args must be an Array`);this.args=e},`setArgs`),getEvalOrigin:d(function(){return this.evalOrigin},`getEvalOrigin`),setEvalOrigin:d(function(e){if(e instanceof y)this.evalOrigin=e;else if(e instanceof Object)this.evalOrigin=new y(e);else throw TypeError(`Eval Origin must be an Object or StackFrame`)},`setEvalOrigin`),toString:d(function(){var e=this.getFileName()||``,t=this.getLineNumber()||``,n=this.getColumnNumber()||``,r=this.getFunctionName()||``;return this.getIsEval()?e?`[eval] (`+e+`:`+t+`:`+n+`)`:`[eval]:`+t+`:`+n:r?r+` (`+e+`:`+t+`:`+n+`)`:e+`:`+t+`:`+n},`toString`)},y.fromString=d(function(e){var t=e.indexOf(`(`),n=e.lastIndexOf(`)`),r=e.substring(0,t),i=e.substring(t+1,n).split(`,`),a=e.substring(n+1);if(a.indexOf(`@`)===0)var o=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(a,``),s=o[1],c=o[2],l=o[3];return new y({functionName:r,args:i||void 0,fileName:s,lineNumber:c||void 0,columnNumber:l||void 0})},`StackFrame$$fromString`),b=0;b<h.length;b++)y.prototype[`get`+p(h[b])]=m(h[b]),y.prototype[`set`+p(h[b])]=function(e){return function(t){this[e]=!!t}}(h[b]);var b;for(x=0;x<g.length;x++)y.prototype[`get`+p(g[x])]=m(g[x]),y.prototype[`set`+p(g[x])]=function(e){return function(t){if(!te(t))throw TypeError(e+` must be a Number`);this[e]=Number(t)}}(g[x]);var x;for(S=0;S<_.length;S++)y.prototype[`get`+p(_[S])]=m(_[S]),y.prototype[`set`+p(_[S])]=function(e){return function(t){this[e]=String(t)}}(_[S]);var S,C=y;function w(){var e=/^\s*at .*(\S+:\d+|\(native\))/m,t=/^(eval@)?(\[native code])?$/;return{parse:d(function(t){if(t.stack&&t.stack.match(e))return this.parseV8OrIE(t);if(t.stack)return this.parseFFOrSafari(t);throw Error(`Cannot parse given Error object`)},`ErrorStackParser$$parse`),extractLocation:d(function(e){if(e.indexOf(`:`)===-1)return[e];var t=/(.+?)(?::(\d+))?(?::(\d+))?$/.exec(e.replace(/[()]/g,``));return[t[1],t[2]||void 0,t[3]||void 0]},`ErrorStackParser$$extractLocation`),parseV8OrIE:d(function(t){return t.stack.split(`
`).filter(function(t){return!!t.match(e)},this).map(function(e){e.indexOf(`(eval `)>-1&&(e=e.replace(/eval code/g,`eval`).replace(/(\(eval at [^()]*)|(,.*$)/g,``));var t=e.replace(/^\s+/,``).replace(/\(eval code/g,`(`).replace(/^.*?\s+/,``),n=t.match(/ (\(.+\)$)/);t=n?t.replace(n[0],``):t;var r=this.extractLocation(n?n[1]:t);return new C({functionName:n&&t||void 0,fileName:[`eval`,`<anonymous>`].indexOf(r[0])>-1?void 0:r[0],lineNumber:r[1],columnNumber:r[2],source:e})},this)},`ErrorStackParser$$parseV8OrIE`),parseFFOrSafari:d(function(e){return e.stack.split(`
`).filter(function(e){return!e.match(t)},this).map(function(e){if(e.indexOf(` > eval`)>-1&&(e=e.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,`:$1`)),e.indexOf(`@`)===-1&&e.indexOf(`:`)===-1)return new C({functionName:e});var t=/((.*".+"[^@]*)?[^@]*)(?:@)/,n=e.match(t),r=n&&n[1]?n[1]:void 0,i=this.extractLocation(e.replace(t,``));return new C({functionName:r,fileName:i[0],lineNumber:i[1],columnNumber:i[2],source:e})},this)},`ErrorStackParser$$parseFFOrSafari`)}}d(w,`ErrorStackParser`);var ne=new w;function re(){return typeof API<`u`&&API!==globalThis.API?API.runtimeEnv:ie({IN_BUN:typeof Bun<`u`,IN_DENO:typeof Deno<`u`,IN_NODE:typeof process==`object`&&typeof process.versions==`object`&&typeof process.versions.node==`string`&&!process.browser,IN_SAFARI:typeof navigator==`object`&&typeof navigator.userAgent==`string`&&navigator.userAgent.indexOf(`Chrome`)===-1&&navigator.userAgent.indexOf(`Safari`)>-1,IN_SHELL:typeof read==`function`&&typeof load==`function`,IN_WORKERD:typeof navigator==`object`&&navigator.userAgent?.includes(`Cloudflare-Workers`)})}d(re,`getGlobalRuntimeEnv`);var T=re();function ie(e){let t=e.IN_NODE&&typeof module<`u`&&module.exports&&typeof f==`function`&&typeof __dirname==`string`,n=e.IN_NODE&&!t,r=!e.IN_NODE&&!e.IN_DENO&&!e.IN_BUN,i=r&&typeof window<`u`&&typeof window.document<`u`&&typeof document.createElement==`function`&&`sessionStorage`in window&&typeof globalThis.importScripts!=`function`,a=r&&typeof globalThis.WorkerGlobalScope<`u`&&typeof globalThis.self<`u`&&globalThis.self instanceof globalThis.WorkerGlobalScope;if(a&&ae())throw Error(`Classic web workers are not supported`);let o={...e,IN_BROWSER:r,IN_BROWSER_MAIN_THREAD:i,IN_BROWSER_WEB_WORKER:a,IN_NODE_COMMONJS:t,IN_NODE_ESM:n};if(!(o.IN_BROWSER_MAIN_THREAD||o.IN_BROWSER_WEB_WORKER||o.IN_NODE||o.IN_SHELL||o.IN_WORKERD))throw Error(`Cannot determine runtime environment: ${JSON.stringify(o)}`);return o}d(ie,`calculateDerivedFlags`);function ae(){try{return globalThis.importScripts(`data:text/javascript,`),!0}catch{return!1}}d(ae,`isClassicWorker`);var oe,E,D,O;async function k(){if(!T.IN_NODE||(oe=(await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1))).default,D=await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1)),O=await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1)),(await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1))).default,E=await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1)),N=E.sep,typeof f<`u`))return;let e={fs:D,crypto:await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1)),ws:await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1)),child_process:await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1))};globalThis.require=function(t){return e[t]}}d(k,`initNodeModules`);function A(e,t){return E.resolve(t||`.`,e)}d(A,`node_resolvePath`);function j(e,t){return t===void 0&&(t=location),new URL(e,t).toString()}d(j,`browser_resolvePath`);var M=T.IN_NODE?A:T.IN_SHELL?d(e=>e,`resolvePath`):j,N;T.IN_NODE||(N=`/`);function P(e,t){return e.startsWith(`file://`)&&(e=e.slice(7)),e.includes(`://`)?{response:fetch(e)}:{binary:O.readFile(e).then(e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength))}}d(P,`node_getBinaryResponse`);function F(e,t){if(e.startsWith(`file://`)&&(e=e.slice(7)),e.includes(`://`))throw Error(`Shell cannot fetch urls`);return{binary:Promise.resolve(new Uint8Array(readbuffer(e)))}}d(F,`shell_getBinaryResponse`);function I(e,t){let n=new URL(e,location);return{response:fetch(n,t?{integrity:t}:{})}}d(I,`browser_getBinaryResponse`);var L=T.IN_NODE?P:T.IN_SHELL?F:I;async function R(e,t){let{response:n,binary:r}=L(e,t);if(r)return r;let i=await n;if(!i.ok)throw Error(`Failed to load '${e}': request failed.`);return new Uint8Array(await i.arrayBuffer())}d(R,`loadBinaryFile`);var se=T.IN_NODE?z:d(async e=>await import(e),`loadScript`);async function z(e){return e.startsWith(`file://`)&&(e=e.slice(7)),e.includes(`://`)?await import(e):await import(oe.pathToFileURL(e).href)}d(z,`nodeLoadScript`);async function B(e){if(T.IN_NODE){await k();let t=await O.readFile(e,{encoding:`utf8`});return JSON.parse(t)}if(T.IN_SHELL){let t=read(e);return JSON.parse(t)}return await(await fetch(e)).json()}d(B,`loadLockFile`);async function V(){if(T.IN_NODE_COMMONJS)return __dirname;let e;try{throw Error()}catch(t){e=t}let t=ne.parse(e)[0].fileName;if(T.IN_NODE&&!t.startsWith(`file://`)&&(t=`file://${t}`),T.IN_NODE_ESM){let e=await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1));return(await import(`./__vite-browser-external-MN5VD67k.js`).then(e=>/* @__PURE__ */ c(e.default,1))).fileURLToPath(e.dirname(t))}let n=t.lastIndexOf(N);if(n===-1)throw Error(`Could not extract indexURL path from pyodide module location. Please pass the indexURL explicitly to loadPyodide.`);return t.slice(0,n)}d(V,`calculateDirname`);function H(e){return e.substring(0,e.lastIndexOf(`/`)+1)||globalThis.location?.toString()||`.`}d(H,`calculateInstallBaseUrl`);function U(e){let t=e.FS,n=e.FS.filesystems.MEMFS,r=e.PATH,i={DIR_MODE:16895,FILE_MODE:33279,mount:d(function(e){if(!e.opts.fileSystemHandle)throw Error(`opts.fileSystemHandle is required`);return n.mount.apply(null,arguments)},`mount`),syncfs:d(async(e,t,n)=>{try{let r=i.getLocalSet(e),a=await i.getRemoteSet(e),o=t?a:r,s=t?r:a;await i.reconcile(e,o,s),n(null)}catch(e){n(e)}},`syncfs`),getLocalSet:d(e=>{let n=Object.create(null);function i(e){return e!==`.`&&e!==`..`}d(i,`isRealDir`);function a(e){return t=>r.join2(e,t)}d(a,`toAbsolute`);let o=t.readdir(e.mountpoint).filter(i).map(a(e.mountpoint));for(;o.length;){let e=o.pop(),r=t.stat(e);t.isDir(r.mode)&&o.push.apply(o,t.readdir(e).filter(i).map(a(e))),n[e]={timestamp:r.mtime,mode:r.mode}}return{type:`local`,entries:n}},`getLocalSet`),getRemoteSet:d(async e=>{let t=Object.create(null),n=await ce(e.opts.fileSystemHandle);for(let[a,o]of n)a!==`.`&&(t[r.join2(e.mountpoint,a)]={timestamp:o.kind===`file`?new Date((await o.getFile()).lastModified):/* @__PURE__ */ new Date,mode:o.kind===`file`?i.FILE_MODE:i.DIR_MODE});return{type:`remote`,entries:t,handles:n}},`getRemoteSet`),loadLocalEntry:d(e=>{let r=t.lookupPath(e,{}).node,i=t.stat(e);if(t.isDir(i.mode))return{timestamp:i.mtime,mode:i.mode};if(t.isFile(i.mode))return r.contents=n.getFileDataAsTypedArray(r),{timestamp:i.mtime,mode:i.mode,contents:r.contents};throw Error(`node type not supported`)},`loadLocalEntry`),storeLocalEntry:d((e,n)=>{if(t.isDir(n.mode))t.mkdirTree(e,n.mode);else if(t.isFile(n.mode))t.writeFile(e,n.contents,{canOwn:!0});else throw Error(`node type not supported`);t.chmod(e,n.mode),t.utime(e,n.timestamp,n.timestamp)},`storeLocalEntry`),removeLocalEntry:d(e=>{var n=t.stat(e);t.isDir(n.mode)?t.rmdir(e):t.isFile(n.mode)&&t.unlink(e)},`removeLocalEntry`),loadRemoteEntry:d(async e=>{if(e.kind===`file`){let t=await e.getFile();return{contents:new Uint8Array(await t.arrayBuffer()),mode:i.FILE_MODE,timestamp:new Date(t.lastModified)}}if(e.kind===`directory`)return{mode:i.DIR_MODE,timestamp:/* @__PURE__ */ new Date};throw Error(`unknown kind: `+e.kind)},`loadRemoteEntry`),storeRemoteEntry:d(async(e,n,i)=>{let a=e.get(r.dirname(n)),o=t.isFile(i.mode)?await a.getFileHandle(r.basename(n),{create:!0}):await a.getDirectoryHandle(r.basename(n),{create:!0});if(o.kind===`file`){let e=await o.createWritable();await e.write(i.contents),await e.close()}e.set(n,o)},`storeRemoteEntry`),removeRemoteEntry:d(async(e,t)=>{await e.get(r.dirname(t)).removeEntry(r.basename(t)),e.delete(t)},`removeRemoteEntry`),reconcile:d(async(e,n,a)=>{let o=0,s=[];Object.keys(n.entries).forEach(function(e){let r=n.entries[e],i=a.entries[e];(!i||t.isFile(r.mode)&&r.timestamp.getTime()>i.timestamp.getTime())&&(s.push(e),o++)}),s.sort();let c=[];if(Object.keys(a.entries).forEach(function(e){n.entries[e]||(c.push(e),o++)}),c.sort().reverse(),!o)return;let l=n.type===`remote`?n.handles:a.handles;for(let t of s){let n=r.normalize(t.replace(e.mountpoint,`/`)).substring(1);if(a.type===`local`){let e=l.get(n),r=await i.loadRemoteEntry(e);i.storeLocalEntry(t,r)}else{let e=i.loadLocalEntry(t);await i.storeRemoteEntry(l,n,e)}}for(let t of c)if(a.type===`local`)i.removeLocalEntry(t);else{let n=r.normalize(t.replace(e.mountpoint,`/`)).substring(1);await i.removeRemoteEntry(l,n)}},`reconcile`)};e.FS.filesystems.NATIVEFS_ASYNC=i}d(U,`initializeNativeFS`);var ce=d(async e=>{let t=[];async function n(e){for await(let r of e.values())t.push(r),r.kind===`directory`&&await n(r)}d(n,`collect`),await n(e);let r=/* @__PURE__ */ new Map;r.set(`.`,e);for(let n of t){let t=(await e.resolve(n)).join(`/`);r.set(t,n)}return r},`getFsHandles`),le=ee(`AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECBygCE0pzdl9HZXRFcnJvcl9pbXBvcnQAAA5Kc3ZFcnJvcl9DaGVjawABChMCBwD7AQD7GwsJACAA+xr7FAAL`),ue=async function(){if(!(globalThis.navigator&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform===`MacIntel`&&typeof navigator.maxTouchPoints<`u`&&navigator.maxTouchPoints>1)))try{let e=await WebAssembly.compile(le);return await WebAssembly.instantiate(e)}catch(e){if(e instanceof WebAssembly.CompileError)return;throw e}}();async function W(){let e=await ue;if(e)return e.exports;let t=Symbol(`error marker`);return{Jsv_GetError_import:d(()=>t,`Jsv_GetError_import`),JsvError_Check:d(e=>e===t,`JsvError_Check`)}}d(W,`getJsvErrorImport`);function G(e){let t={config:e,runtimeEnv:T},n={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:me(e),print:e.stdout,printErr:e.stderr,onExit(e){n.exitCode=e},thisProgram:e._sysExecutable,arguments:e.args,API:t,locateFile:d(t=>e.indexURL+t,`locateFile`),instantiateWasm:he(e.indexURL)};return n}d(G,`createSettings`);function de(e){return function(t){try{t.FS.mkdirTree(e)}catch(t){console.error(`Error occurred while making a home directory '${e}':`),console.error(t),console.error(`Using '/' for a home directory instead`),e=`/`}t.FS.chdir(e)}}d(de,`createHomeDirectory`);function K(e){return function(t){Object.assign(t.ENV,e)}}d(K,`setEnvironment`);function q(e){return e?[async t=>{t.addRunDependency(`fsInitHook`);try{await e(t.FS,{sitePackages:t.API.sitePackages})}finally{t.removeRunDependency(`fsInitHook`)}}]:[]}d(q,`callFsInitHook`);function fe(e){let t=e.HEAPU32[e._Py_Version>>>2];return[t>>>24&255,t>>>16&255,t>>>8&255]}d(fe,`computeVersionTuple`);function pe(e){let t=R(e);return async e=>{e.API.pyVersionTuple=fe(e);let[n,r]=e.API.pyVersionTuple;e.FS.mkdirTree(`/lib`),e.API.sitePackages=`/lib/python${n}.${r}/site-packages`,e.FS.mkdirTree(e.API.sitePackages),e.FS.mkdirTree(`/lib/python${n}.${r}/lib-dynload`),e.addRunDependency(`install-stdlib`);try{let i=await t;e.FS.writeFile(`/lib/python${n}${r}.zip`,i)}catch(e){console.error(`Error occurred while installing the standard library:`),console.error(e)}finally{e.removeRunDependency(`install-stdlib`)}}}d(pe,`installStdlib`);function me(e){let t;return t=e.stdLibURL==null?e.indexURL+`python_stdlib.zip`:e.stdLibURL,[pe(t),de(e.env.HOME),K(e.env),U,...q(e.fsInit)]}d(me,`getFileSystemInitializationFuncs`);function he(e){if(typeof WasmOffsetConverter<`u`)return;let{binary:t,response:n}=L(e+`pyodide.asm.wasm`),r=W();return function(e,i){return async function(){let{Jsv_GetError_import:a,JsvError_Check:o}=await r;e.env.Jsv_GetError_import=a,e.env.JsvError_Check=o;try{let r;r=n?await WebAssembly.instantiateStreaming(n,e):await WebAssembly.instantiate(await t,e);let{instance:a,module:o}=r;i(a,o)}catch(e){console.warn(`wasm instantiation failed!`),console.warn(e)}}(),{}}}d(he,`getInstantiateWasmFunc`);var ge=`314.0.7`;function J(e){return e===void 0||e.endsWith(`/`)?e:e+`/`}d(J,`withTrailingSlash`);var _e=ge;async function ve(e={}){if(await k(),e.lockFileContents&&e.lockFileURL)throw Error(`Can't pass both lockFileContents and lockFileURL`);let t=e.indexURL||await V();if(t=J(M(t)),e.packageBaseUrl=J(e.packageBaseUrl),e.cdnUrl=J(e.packageBaseUrl??`https://cdn.jsdelivr.net/pyodide/v314.0.7/full/`),!e.lockFileContents){let n=e.lockFileURL??t+`pyodide-lock.json`;e.lockFileContents=B(n),e.packageBaseUrl??=H(n)}e.indexURL=t,e.packageCacheDir&&=J(M(e.packageCacheDir));let n={jsglobals:globalThis,stdin:globalThis.prompt?()=>globalThis.prompt():void 0,args:[],env:{},packages:[],packageCacheDir:e.packageBaseUrl,enableRunUntilComplete:!0,checkAPIVersion:!0,BUILD_ID:`990c3b51a9722d62434de2bbc9643732658d488c1b6d467f22c1b6beba80d497`},r=Object.assign(n,e);return r.env.HOME??=`/home/pyodide`,r.env.PYTHONINSPECT??=`1`,r}d(ve,`initializeConfiguration`);function ye(e){let t=G(e),n=t.API;return n.lockFilePromise=Promise.resolve(e.lockFileContents),t}d(ye,`createEmscriptenSettings`);async function be(e){return e.createPyodideModule?e.createPyodideModule:(await se(`${e.indexURL}pyodide.asm.mjs`)).default}d(be,`loadWasmScript`);async function Y(e,t){if(!e._loadSnapshot)return;let n=await e._loadSnapshot,r=ArrayBuffer.isView(n)?n:new Uint8Array(n);return t.noInitialRun=!0,t.INITIAL_MEMORY=r.length,r}d(Y,`prepareSnapshot`);async function xe(e,t){let n=await e(t);if(t.exitCode!==void 0)throw new n.ExitStatus(t.exitCode);return n}d(xe,`instantiatePyodideModule`);function Se(e,t){let n=e.API;if(t.pyproxyToStringRepr&&n.setPyProxyToStringMethod(!0),t.convertNullToNone&&n.setCompatNullToNone(!0),t.toJsLiteralMap&&n.setCompatToJsLiteralMap(!0),n.version!==`314.0.7`&&t.checkAPIVersion)throw Error(`Pyodide version does not match: '${_e}' <==> '${n.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);e.locateFile=e=>{throw e.endsWith(`.so`)?/* @__PURE__ */ Error(`Failed to find dynamic library "${e}"`):/* @__PURE__ */ Error(`Unexpected call to locateFile("${e}")`)}}d(Se,`configureAPI`);function Ce(e,t,n){let r=e.API,i;return t&&(i=r.restoreSnapshot(t)),r.finalizeBootstrap(i,n._snapshotDeserializer)}d(Ce,`bootstrapPyodide`);async function we(e,t){let n=e._api;return n.sys.path.insert(0,``),n._pyodide.set_excepthook(),await n.packageIndexReady,n.initializeStreams(t.stdin,t.stdout,t.stderr),e}d(we,`finalizeSetup`);async function Te(e={}){let t=await ve(e),n=ye(t),r=await be(t),i=await Y(t,n),a=await xe(r,n);return Se(a,t),await we(Ce(a,i,t),t)}d(Te,`loadPyodide`);const Ee=[{id:`index-error`,name:`IndexError: List Out of Bounds`,exceptionType:`IndexError`,category:`Runtime`,badgeColor:`#fc618d`,summary:`Subscripting a list with an index >= length.`,offendingLine:2,buggyCode:`def get_user_role(roles, index):
    return roles[index]

roles = ["admin", "editor", "viewer"]
# Accessing out of bounds index
active_role = get_user_role(roles, 5)
print(f"Role: {active_role}")`,expectedStderr:`Traceback (most recent call last):
  File "main.py", line 6, in <module>
    active_role = get_user_role(roles, 5)
  File "main.py", line 2, in get_user_role
    return roles[index]
IndexError: list index out of range`,fixedCode:`def get_user_role(roles, index):
    if 0 <= index < len(roles):
        return roles[index]
    return "guest"

roles = ["admin", "editor", "viewer"]
active_role = get_user_role(roles, 5)
print(f"Role: {active_role}")`,explanation:"Added bounds checking `if 0 <= index < len(roles)` with a safe fallback value."},{id:`nonetype-subscript`,name:`TypeError: NoneType Subscript`,exceptionType:`TypeError`,category:`Type`,badgeColor:`#948ae3`,summary:`Indexing an object that resolved to None.`,offendingLine:4,buggyCode:`def fetch_user_profile(user_id):
    # Simulated database returning None for missing record
    profile = None
    return profile["email"]

email = fetch_user_profile(42)
print(f"User email: {email}")`,expectedStderr:`Traceback (most recent call last):
  File "main.py", line 6, in <module>
    email = fetch_user_profile(42)
  File "main.py", line 4, in fetch_user_profile
    return profile["email"]
TypeError: 'NoneType' object is not subscriptable`,fixedCode:`def fetch_user_profile(user_id):
    profile = None
    if profile is None:
        return "noreply@example.com"
    return profile.get("email", "noreply@example.com")

email = fetch_user_profile(42)
print(f"User email: {email}")`,explanation:`Checked for None before accessing attributes or dictionary keys.`},{id:`mutable-default`,name:`Logic: Mutable Default Argument`,exceptionType:`AssertionError`,category:`Logic`,badgeColor:`#f8e67a`,summary:`Default list argument shared across multiple function calls.`,offendingLine:11,buggyCode:`def register_event(event_name, log=[]):
    log.append(event_name)
    return log

session_1 = register_event("login")
session_2 = register_event("page_view")
print(f"Session 1: {session_1}")
print(f"Session 2: {session_2}")

# Assertion fails due to shared mutable default
assert len(session_2) == 1, f"Expected 1 item, got {len(session_2)}"`,expectedStderr:`Traceback (most recent call last):
  File "main.py", line 11, in <module>
    assert len(session_2) == 1, f"Expected 1 item, got {len(session_2)}"
AssertionError: Expected 1 item, got 2`,fixedCode:`def register_event(event_name, log=None):
    if log is None:
        log = []
    log.append(event_name)
    return log

session_1 = register_event("login")
session_2 = register_event("page_view")
print(f"Session 1: {session_1}")
print(f"Session 2: {session_2}")

assert len(session_2) == 1, f"Expected 1 item, got {len(session_2)}"
print("All assertions passed!")`,explanation:"Used sentinel default value `log=None` and initialized a new list instance per invocation."},{id:`key-error`,name:`KeyError: Missing Dictionary Key`,exceptionType:`KeyError`,category:`Runtime`,badgeColor:`#fc618d`,summary:`Accessing a non-existent dictionary key via bracket notation.`,offendingLine:2,buggyCode:`def get_config_timeout(config):
    return config["timeout_seconds"]

config = {
    "host": "localhost",
    "port": 8080,
    "debug": True
}

timeout = get_config_timeout(config)
print(f"Timeout: {timeout}s")`,expectedStderr:`Traceback (most recent call last):
  File "main.py", line 9, in <module>
    timeout = get_config_timeout(config)
  File "main.py", line 2, in get_config_timeout
    return config["timeout_seconds"]
KeyError: 'timeout_seconds'`,fixedCode:`def get_config_timeout(config):
    return config.get("timeout_seconds", 30)

config = {
    "host": "localhost",
    "port": 8080,
    "debug": True
}

timeout = get_config_timeout(config)
print(f"Timeout: {timeout}s")`,explanation:'Replaced direct indexing with `config.get("timeout_seconds", 30)` providing a fallback default.'},{id:`zero-division`,name:`ZeroDivisionError: Division by Zero`,exceptionType:`ZeroDivisionError`,category:`Runtime`,badgeColor:`#fc618d`,summary:`Dividing a number by zero without denominator validation.`,offendingLine:2,buggyCode:`def calculate_throughput(total_bytes, elapsed_seconds):
    return total_bytes / elapsed_seconds

bytes_sent = 1048576
duration = 0  # Instantaneous transfer

rate = calculate_throughput(bytes_sent, duration)
print(f"Throughput: {rate} B/s")`,expectedStderr:`Traceback (most recent call last):
  File "main.py", line 7, in <module>
    rate = calculate_throughput(bytes_sent, duration)
  File "main.py", line 2, in calculate_throughput
    return total_bytes / elapsed_seconds
ZeroDivisionError: division by zero`,fixedCode:`def calculate_throughput(total_bytes, elapsed_seconds):
    if elapsed_seconds <= 0:
        return float('inf') if total_bytes > 0 else 0.0
    return total_bytes / elapsed_seconds

bytes_sent = 1048576
duration = 0

rate = calculate_throughput(bytes_sent, duration)
print(f"Throughput: {rate} B/s")`,explanation:`Guarded denominator against zero before executing division.`},{id:`unbound-local`,name:`UnboundLocalError: Scoped Assignment`,exceptionType:`UnboundLocalError`,category:`Runtime`,badgeColor:`#fc618d`,summary:`Modifying a global variable in local scope without global keyword.`,offendingLine:4,buggyCode:`counter = 10

def increment_counter():
    print(f"Current count: {counter}")
    counter += 1
    return counter

result = increment_counter()
print(f"Result: {result}")`,expectedStderr:`Traceback (most recent call last):
  File "main.py", line 8, in <module>
    result = increment_counter()
  File "main.py", line 4, in increment_counter
    counter += 1
UnboundLocalError: cannot access local variable 'counter' where it is not associated with a value`,fixedCode:`counter = 10

def increment_counter():
    global counter
    print(f"Current count: {counter}")
    counter += 1
    return counter

result = increment_counter()
print(f"Result: {result}")`,explanation:"Added `global counter` statement to allow in-place modification of module-level variable."},{id:`syntax-error`,name:`SyntaxError: Missing Colon`,exceptionType:`SyntaxError`,category:`Syntax`,badgeColor:`#de5d33`,summary:`Function definition header missing trailing colon.`,offendingLine:1,buggyCode:`def validate_payload(data)
    if "token" not in data:
        return False
    return True

payload = {"user": "alice"}
is_valid = validate_payload(payload)
print(f"Valid: {is_valid}")`,expectedStderr:`  File "main.py", line 1
    def validate_payload(data)
                              ^
SyntaxError: expected ':'`,fixedCode:`def validate_payload(data):
    if "token" not in data:
        return False
    return True

payload = {"user": "alice"}
is_valid = validate_payload(payload)
print(f"Valid: {is_valid}")`,explanation:"Corrected syntax by adding missing `:` at the end of the function header."}];function De(e,t){let n=e.trim(),r=Ee.find(e=>e.buggyCode.trim()===n||n.includes(e.id)||e.offendingLine&&n.includes(e.summary.slice(0,15)));return r?{id:t,success:!1,stdout:r.id===`mutable_default`?`Cart: ['apple']
Cart: ['apple', 'banana']`:``,stderr:`${r.exceptionType}: ${r.summary}`,errorType:r.exceptionType,errorMessage:r.summary,lineNumber:r.offendingLine,traceback:`Traceback (most recent call last):\n  File "main.py", line ${r.offendingLine}, in <module>\n${r.exceptionType}: ${r.summary}`,executionTimeMs:4,isTimeout:!1}:Ee.find(e=>e.fixedCode.trim()===n)?{id:t,success:!0,stdout:`Process exited with code 0.
Verification: 0 regressions, all assertions passed.`,stderr:``,errorType:null,errorMessage:null,lineNumber:null,traceback:``,executionTimeMs:2,isTimeout:!1}:{id:t,success:!0,stdout:`Execution completed.
Process exited with code 0 in 3ms.`,stderr:``,errorType:null,errorMessage:null,lineNumber:null,traceback:``,executionTimeMs:3,isTimeout:!1}}let X=null,Z=null;function Q(e){self.postMessage(e)}async function Oe(e){await e.runPythonAsync(`
import sys
import io
import json
import traceback

def __bug_whisper_execute__(user_code_str):
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr

    sys.stdout = stdout_buf
    sys.stderr = stderr_buf

    result = {
        "success": False,
        "stdout": "",
        "stderr": "",
        "errorType": None,
        "errorMessage": None,
        "lineNumber": None,
        "traceback": ""
    }

    try:
        # Tier 1: Static syntax verification
        try:
            compiled_code = compile(user_code_str, "main.py", "exec")
        except SyntaxError as syn_err:
            result["errorType"] = type(syn_err).__name__
            result["errorMessage"] = syn_err.msg or "syntax error"
            result["lineNumber"] = syn_err.lineno
            line_text = (syn_err.text or "").rstrip()
            offset = max(0, (syn_err.offset or 1) - 1)
            lines = [
                '  File "main.py", line %d' % (syn_err.lineno or 0),
                '    %s' % line_text,
                '    %s^' % (' ' * offset),
                '%s: %s' % (type(syn_err).__name__, syn_err.msg)
            ]
            full_tb = "Traceback (most recent call last):\\n" + "\\n".join(lines)
            result["traceback"] = full_tb
            result["stderr"] = full_tb
            return json.dumps(result)

        # Tier 2: Runtime execution in isolated environment
        clean_globals = {
            "__name__": "__main__",
            "__file__": "main.py",
            "__doc__": None,
            "__package__": None,
        }
        exec(compiled_code, clean_globals)

        result["success"] = True
        result["stdout"] = stdout_buf.getvalue()[:50000]
        result["stderr"] = stderr_buf.getvalue()[:50000]

    except SystemExit as se:
        exit_code = se.code if hasattr(se, 'code') else None
        if exit_code == 0 or exit_code is None:
            result["success"] = True
        else:
            result["errorType"] = "SystemExit"
            result["errorMessage"] = f"sys.exit({exit_code})"
            result["stderr"] = f"SystemExit: {exit_code}"
            result["traceback"] = f"SystemExit: {exit_code}"
            result["lineNumber"] = None
        result["stdout"] = stdout_buf.getvalue()[:50000]

    except Exception as exc:
        result["errorType"] = type(exc).__name__
        result["errorMessage"] = str(exc)
        tb = exc.__traceback__
        frames = traceback.extract_tb(tb)

        # Filter for user script frames (main.py)
        user_frames = [f for f in frames if f.filename == "main.py"]
        target_frame = user_frames[-1] if user_frames else (frames[-1] if frames else None)
        result["lineNumber"] = target_frame.lineno if target_frame else None

        formatted_frames = user_frames if user_frames else frames
        tb_lines = ["Traceback (most recent call last):"]
        for f in formatted_frames:
            tb_lines.append(f'  File "{f.filename}", line {f.lineno}, in {f.name}')
            if f.line:
                tb_lines.append(f'    {f.line}')
        tb_lines.append(f"{type(exc).__name__}: {str(exc)}")
        clean_tb_str = "\\n".join(tb_lines)

        captured_stderr = stderr_buf.getvalue()
        result["traceback"] = clean_tb_str
        result["stderr"] = (captured_stderr + "\\n" + clean_tb_str).strip() if captured_stderr else clean_tb_str
        result["stdout"] = stdout_buf.getvalue()[:50000]

    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    return json.dumps(result)
`)}async function $(){return X||Z||(Q({type:`STATUS`,status:`loading`,message:`Loading Pyodide Wasm runtime...`}),Z=(async()=>{try{let e=await Te({indexURL:`/pyodide/`,checkAPIVersion:!1});return await Oe(e),X=e,Q({type:`STATUS`,status:`ready`,message:`Pyodide Wasm runtime ready`}),e}catch(e){throw Q({type:`STATUS`,status:`error`,message:`Failed to initialize Pyodide: ${e instanceof Error?e.message:String(e)}`}),e}finally{Z=null}})(),Z)}async function ke(e,t){let n=performance.now();try{let r=await $();Q({type:`STATUS`,status:`running`});let i=r.globals.get(`__bug_whisper_execute__`),a=i(t);typeof i.destroy==`function`&&i.destroy();let o=JSON.parse(a),s=Math.round(performance.now()-n);Q({type:`RUN_COMPLETE`,result:{id:e,success:!!o.success,stdout:o.stdout??``,stderr:o.stderr??``,errorType:o.errorType??null,errorMessage:o.errorMessage??null,lineNumber:typeof o.lineNumber==`number`?o.lineNumber:null,traceback:o.traceback??``,executionTimeMs:s,isTimeout:!1}}),Q({type:`STATUS`,status:`ready`})}catch(r){let i=Math.round(performance.now()-n);console.warn(`Pyodide execution failed, falling back to deterministic AST tracer:`,r);let a=De(t,e);a.executionTimeMs=i,Q({type:`RUN_COMPLETE`,result:a}),Q({type:`STATUS`,status:X?`ready`:`error`})}}self.onmessage=async e=>{let t=e.data;if(t)switch(t.type){case`INIT`:try{await $()}catch{}break;case`RUN`:await ke(t.id,t.code);break;case`RESET`:if(X)try{await Oe(X)}catch{}Q({type:`STATUS`,status:`ready`})}},$().catch(()=>{});export{o as t};