(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const I=(e,t)=>t.some(n=>e instanceof n);let j,O;function J(){return j||(j=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Y(){return O||(O=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const P=new WeakMap,E=new WeakMap,w=new WeakMap;function Q(e){const t=new Promise((n,a)=>{const o=()=>{e.removeEventListener("success",i),e.removeEventListener("error",r)},i=()=>{n(p(e.result)),o()},r=()=>{a(e.error),o()};e.addEventListener("success",i),e.addEventListener("error",r)});return w.set(t,e),t}function X(e){if(P.has(e))return;const t=new Promise((n,a)=>{const o=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",r),e.removeEventListener("abort",r)},i=()=>{n(),o()},r=()=>{a(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",i),e.addEventListener("error",r),e.addEventListener("abort",r)});P.set(e,t)}let T={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return P.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return p(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function R(e){T=e(T)}function Z(e){return Y().includes(e)?function(...t){return e.apply(C(this),t),p(this.request)}:function(...t){return p(e.apply(C(this),t))}}function ee(e){return typeof e=="function"?Z(e):(e instanceof IDBTransaction&&X(e),I(e,J())?new Proxy(e,T):e)}function p(e){if(e instanceof IDBRequest)return Q(e);if(E.has(e))return E.get(e);const t=ee(e);return t!==e&&(E.set(e,t),w.set(t,e)),t}const C=e=>w.get(e);function te(e,t,{blocked:n,upgrade:a,blocking:o,terminated:i}={}){const r=indexedDB.open(e,t),c=p(r);return a&&r.addEventListener("upgradeneeded",s=>{a(p(r.result),s.oldVersion,s.newVersion,p(r.transaction),s)}),n&&r.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),c.then(s=>{i&&s.addEventListener("close",()=>i()),o&&s.addEventListener("versionchange",l=>o(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const ne=["get","getKey","getAll","getAllKeys","count"],ae=["put","add","delete","clear"],S=new Map;function U(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(S.get(t))return S.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,o=ae.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(o||ne.includes(n)))return;const i=async function(r,...c){const s=this.transaction(r,o?"readwrite":"readonly");let l=s.store;return a&&(l=l.index(c.shift())),(await Promise.all([l[n](...c),o&&s.done]))[0]};return S.set(t,i),i}R(e=>({...e,get:(t,n,a)=>U(t,n)||e.get(t,n,a),has:(t,n)=>!!U(t,n)||e.has(t,n)}));const oe=["continue","continuePrimaryKey","advance"],N={},D=new WeakMap,V=new WeakMap,ie={get(e,t){if(!oe.includes(t))return e[t];let n=N[t];return n||(n=N[t]=function(...a){D.set(this,V.get(this)[t](...a))}),n}};async function*re(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,ie);for(V.set(n,t),w.set(n,C(t));t;)yield n,t=await(D.get(n)||t.continue()),D.delete(n)}function H(e,t){return t===Symbol.asyncIterator&&I(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&I(e,[IDBIndex,IDBObjectStore])}R(e=>({...e,get(t,n,a){return H(t,n)?re:e.get(t,n,a)},has(t,n){return H(t,n)||e.has(t,n)}}));const v=te("story-app",1,{upgrade(e){e.objectStoreNames.contains("stories")||e.createObjectStore("stories",{keyPath:"id"})}});async function z(e){return(await v).put("stories",e)}async function K(e){return(await v).get("stories",e)}async function W(e){return(await v).delete("stories",e)}async function se(){return(await(await v).getAll("stories")).filter(t=>t.isCached!==!0)}async function b(e){const t=await K(e);return t&&t.isCached!==!0}const f="https://story-api.dicoding.dev/v1";async function ce(){const e=localStorage.getItem("accessToken");if(!e)throw new Error("Anda belum login");const t=await fetch(`${f}/stories`,{headers:{Authorization:`Bearer ${e}`}}),n=await t.json();if(!t.ok)throw new Error(n.message);return n.listStory}async function le(e,t){const n=await fetch(`${f}/stories`,{method:"POST",headers:{Authorization:`Bearer ${t}`},body:e}),a=await n.json();if(!n.ok)throw new Error(a.message);return a}async function de(e,t){const n=await fetch(`${f}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),a=await n.json();if(!n.ok)throw new Error(a.message);return a.loginResult.token}async function ue(e,t,n){const a=await fetch(`${f}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:n})}),o=await a.json();if(!a.ok)throw new Error(o.message);return o}async function pe(e){const t=localStorage.getItem("accessToken"),n=`${f}/stories/${e}`;try{const a=await fetch(n,{headers:{Authorization:`Bearer ${t}`}}),o=await a.json();if(!a.ok)throw new Error(o.message);return await z({...o.story,isCached:!0}),o.story}catch{console.warn("Offline? Coba ambil dari IndexedDB...");const o=await K(e);if(o)return o;throw new Error("Gagal memuat cerita. Anda mungkin sedang offline.")}}class me{constructor(t){this.container=t}showLoading(){this.container.innerHTML="<p>Loading stories...</p>"}showError(t){this.container.innerHTML=`<p>Gagal memuat cerita: ${t}</p>`}showNotLoggedIn(){this.container.innerHTML=`
        <div class="login-banner-wrapper">
          <img src="assets/home.png" alt="Login Banner" />
          <p>Anda belum login.</p>
          <a href="#/login" class="btn-login-link">Klik di sini untuk login</a>
        </div>`}showStories(t,n,a,o,i){const r=t.map(c=>`
        <div class="story-card">
          <img src="${c.photoUrl}" alt="${c.name}" />
          <div class="story-content">
            <h3>${c.name}</h3>
            <p>${c.description}</p>
            <p class="story-date">📅 ${new Date().toLocaleDateString()}</p>
           <a class="story-button" href="#/detail/${c.id}">Selengkapnya ➔</a>
          </div>
        </div>
      `).join("");this.container.innerHTML=`
        <h2>Lihat Cerita</h2>
        <div id="story-list">${r}</div>
        
        <div class="pagination">
          <button id="prev-btn" ${n===1?"disabled":""}>← Sebelumnya</button>
          <span>Halaman ${n} dari ${a}</span>
          <button id="next-btn" ${n===a?"disabled":""}>Selanjutnya →</button>
        </div>
  
        <div id="map" style="height: 300px; margin-top:1rem; border:1px solid #ccc;"></div>
        <button id="fab">＋</button>
      `,document.getElementById("prev-btn").addEventListener("click",o),document.getElementById("next-btn").addEventListener("click",i),document.getElementById("fab").addEventListener("click",()=>{location.hash="#/tambah"})}}class he{constructor(t){this.view=new me(t),this.currentPage=1,this.pageSize=8,this.stories=[]}async init(){if(!localStorage.getItem("accessToken")){this.view.showNotLoggedIn();return}this.view.showLoading();try{this.stories=await ce(),this.renderPage(),this.initMap(this.stories)}catch(n){this.view.showError(n.message)}}renderPage(){const t=Math.ceil(this.stories.length/this.pageSize),n=(this.currentPage-1)*this.pageSize,a=n+this.pageSize,o=this.stories.slice(n,a);this.view.showStories(o,this.currentPage,t,()=>this.goPrev(),()=>this.goNext(t)),this.initMap(this.stories)}goPrev(){this.currentPage>1&&(this.currentPage--,this.renderPage())}goNext(t){this.currentPage<t&&(this.currentPage++,this.renderPage())}initMap(t){if(window.L)this.createMap(t);else{const n=document.createElement("script");n.src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js",n.onload=()=>this.createMap(t),document.body.appendChild(n)}}createMap(t){this.map&&(this.map.remove(),this.map=null);const n=document.getElementById("map");n&&n._leaflet_id&&(n._leaflet_id=null);const a=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"});this.map=L.map("map",{center:[-6.2,106.8],zoom:5,layers:[a]}),t.forEach(o=>{o.lat&&o.lon&&L.marker([o.lat,o.lon]).addTo(this.map).bindPopup(`<strong>${o.name}</strong><br>${o.description}`)})}}function ge(e){new he(e).init()}function fe(e){e.innerHTML=`
  <div class="form-wrapper">
    <h2>Tambah Cerita</h2>
    <form id="storyForm">
      <label for="description">Deskripsi</label>
      <textarea id="description" name="description" required></textarea>

      <label>📷 Foto (kamera)</label>
      <video id="cameraPreview" width="300" autoplay playsinline style="border:1px solid #ccc; display:none;"></video>
      <div>
        <button type="button" id="startCamera">Buka Kamera</button>
        <button type="button" id="capturePhoto" style="display:none;">Ambil Foto</button>
        <button type="button" id="stopCamera" style="display:none;">Tutup Kamera</button>
      </div>

      <p>atau</p>
      <input type="file" id="photo" name="photo" accept="image/*" />

      <div style="margin-top:1rem;">
        <img id="photoPreview" src="" alt="Preview Foto" style="max-width:300px; display:none; border:1px solid #ccc;" />
        <button type="button" id="deletePhoto" class="outline" style="display:none;">Hapus Foto</button>
      </div>

      <label for="map">Pilih Lokasi</label>
      <div id="map" style="height:300px; border:1px solid #ccc;"></div>

      <div class="coord-inputs">
        <input type="text" id="lat" name="lat" placeholder="Latitude" readonly />
        <input type="text" id="lon" name="lon" placeholder="Longitude" readonly />
      </div>

      <div class="form-buttons">
        <button type="submit" class="primary">Buat Laporan</button>
        <button type="button" class="outline" onclick="location.hash='#/'">Batal</button>
      </div>
    </form>
  </div>
`,ye();const t=document.getElementById("startCamera"),n=document.getElementById("capturePhoto"),a=document.getElementById("stopCamera"),o=document.getElementById("deletePhoto"),i=document.getElementById("cameraPreview"),r=document.createElement("canvas"),c=document.getElementById("photo"),s=document.getElementById("photoPreview");let l;t.addEventListener("click",async()=>{try{l=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),i.srcObject=l,i.style.display="block",n.style.display="inline-block",a.style.display="inline-block",t.style.display="none"}catch(d){alert("Kamera tidak bisa diakses: "+d.message)}}),n.addEventListener("click",()=>{r.width=i.videoWidth,r.height=i.videoHeight,r.getContext("2d").drawImage(i,0,0,r.width,r.height),r.toBlob(u=>{const m=new File([u],"camera-photo.jpg",{type:"image/jpeg"}),y=new DataTransfer;y.items.add(m),c.files=y.files;const k=URL.createObjectURL(u);s.src=k,s.style.display="block",o.style.display="inline-block",alert("Foto berhasil diambil!")},"image/jpeg")}),a.addEventListener("click",()=>{l&&(l.getTracks().forEach(d=>d.stop()),i.style.display="none",n.style.display="none",a.style.display="none",t.style.display="inline-block")}),c.addEventListener("change",()=>{const d=c.files[0];if(d){const u=URL.createObjectURL(d);s.src=u,s.style.display="block",o.style.display="inline-block"}}),o.addEventListener("click",()=>{c.value="",s.src="",s.style.display="none",o.style.display="none"}),document.getElementById("storyForm").addEventListener("submit",async d=>{d.preventDefault();const u=localStorage.getItem("accessToken");if(!u)return alert("Anda belum login!");const m=d.target,y=m.photo.files[0],k=m.description.value,x=m.lat.value,A=m.lon.value,g=new FormData;g.append("photo",y),g.append("description",k),x&&A&&(g.append("lat",x),g.append("lon",A));try{await le(g,u),alert("Cerita berhasil dikirim!"),location.hash="#/",setTimeout(()=>location.reload(),100)}catch(q){alert("Gagal mengirim cerita: "+q.message)}})}function ye(){const e=document.createElement("script");e.src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js",e.onload=()=>{const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}),n=L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=YOUR_MAPTILER_API_KEY",{attribution:'&copy; <a href="https://www.maptiler.com/">MapTiler</a>'}),a=L.map("map",{center:[-6.2,106.8],zoom:10,layers:[t]}),o={OpenStreetMap:t,"MapTiler Streets":n};L.control.layers(o).addTo(a);let i;a.on("click",function(r){const{lat:c,lng:s}=r.latlng;document.getElementById("lat").value=c,document.getElementById("lon").value=s,i?i.setLatLng(r.latlng):i=L.marker(r.latlng).addTo(a).bindPopup("Lokasi dipilih").openPopup()})},document.head.appendChild(e)}function be(e){e.innerHTML=`
    <div class="form-wrapper">
      <h2>Login</h2>
      <form id="loginForm">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  `;const t=document.getElementById("loginForm");t.addEventListener("submit",async n=>{n.preventDefault();const a=new FormData(t);try{const o=await de(a.get("email"),a.get("password"));localStorage.setItem("accessToken",o),alert("Login berhasil!"),location.hash="#/",h(),$()}catch(o){alert("Gagal login: "+o.message)}})}function we(e){e.innerHTML=`
  <div class="form-wrapper">
    <h2>Daftar</h2>
    <form id="registerForm">
      <label for="name">Nama</label>
      <input type="text" id="name" name="name" required />

      <label for="email">Email</label>
      <input type="email" id="email" name="email" required />

      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />

      <button type="submit">Daftar</button>
    </form>
    </div>
  `;const t=document.getElementById("registerForm");t.addEventListener("submit",async n=>{n.preventDefault();const a=new FormData(t);try{await ue(a.get("name"),a.get("email"),a.get("password")),alert("Registrasi berhasil, silakan login."),location.hash="#/login"}catch(o){alert("Gagal daftar: "+o.message)}})}async function ve(e,t){e.innerHTML="<p>Loading detail...</p>";try{const n=await pe(t),a=await b(n.id);e.innerHTML=`
      <div class="detail-container">
        <a href="#/" class="back-link">← Kembali ke Daftar Cerita</a>
        <h2>${n.name}</h2>
        <p>${new Date(n.createdAt).toLocaleDateString()}</p>
        <img src="${n.photoUrl}" alt="${n.name}" />
        <p>${n.description}</p>

        <h3>Lokasi</h3>
        <p>📍 Latitude: ${n.lat}, Longitude: ${n.lon}</p>
        <div id="map" style="height:300px; margin-top:1rem;"></div>

        <div class="bookmark-actions" style="margin-top: 1rem;">
          <button id="bookmark-button" class="custom-btn">
            ${a?"🗑️ Hapus Simpanan":"📌 Simpan Cerita"}
          </button>
          <button id="notify-button" class="custom-btn">🔔 Try Notify Me</button>
        </div>
      </div>
    `;const o=document.getElementById("bookmark-button");o.addEventListener("click",async()=>{await b(n.id)?(await W(n.id),alert("✅ Cerita dihapus dari simpanan.")):(await z({...n,isCached:!1}),alert("✅ Cerita disimpan."));const s=await b(n.id);o.textContent=s?"🗑️ Hapus Simpanan":"📌 Simpan Cerita"});const i=document.getElementById("notify-button");i&&i.addEventListener("click",async()=>{if(!await b(n.id)){alert("❗ Cerita belum disimpan. Simpan dulu untuk menerima notifikasi.");return}const s=await navigator.serviceWorker.getRegistration();s&&s.showNotification("✅ Cerita Tersimpan",{body:`"${n.name}" sudah disimpan ke bookmark Anda.`,icon:"/icons/icon-192x192.png",tag:"story-saved"})});const r=document.createElement("script");r.src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js",r.onload=()=>{const c=L.map("map").setView([n.lat,n.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(c),L.marker([n.lat,n.lon]).addTo(c).bindPopup(n.name)},document.body.appendChild(r)}catch(n){e.innerHTML=`<p>❌ Gagal memuat detail: ${n.message}</p>`}}async function G(e){const t=await se();if(t.length===0){e.innerHTML=`
      <h2>📚 Cerita Tersimpan</h2>
      <p>Belum ada cerita yang disimpan.</p>
    `;return}e.innerHTML=`
    <h2>Cerita Tersimpan</h2>
    <ul id="bookmark-list">
      ${t.map(a=>`
        <li data-id="${a.id}">
          <a href="#/detail/${a.id}"><strong>${a.name}</strong></a>
          <br><small>${new Date(a.createdAt).toLocaleString()}</small>
          <br><button class="delete-bookmark">Hapus</button>
        </li>
      `).join("")}
    </ul>
  `,e.querySelectorAll(".delete-bookmark").forEach(a=>{a.addEventListener("click",async o=>{const r=o.target.closest("li").getAttribute("data-id");await W(r),alert("Cerita berhasil dihapus dari bookmark."),G(e)})})}const ke={"/":ge,"/tambah":fe,"/login":be,"/register":we,"/bookmark":G};function h(){const e=document.getElementById("app-content"),t=window.location.hash.slice(1)||"/",n=t.match(/^\/detail\/(.+)$/);if(n){ve(e,n[1]);return}const a=ke[t]||(()=>e.innerHTML="<p>Halaman tidak ditemukan.</p>");document.startViewTransition?document.startViewTransition(()=>a(e)):a(e)}window.addEventListener("hashchange",h);window.addEventListener("load",h);const M={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"};function Le(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/-/g,"+").replace(/_/g,"/"),a=atob(n);return Uint8Array.from([...a].map(o=>o.charCodeAt(0)))}async function Ee(e,t){try{const n=Le(M.VAPID_PUBLIC_KEY),a=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:n}),{endpoint:o,keys:i}=a.toJSON(),r=JSON.stringify({endpoint:o,keys:i}),c=await fetch(`${M.BASE_URL}/notifications/subscribe`,{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:r});return c.ok?(console.log("✅ Push subscription sent to server."),!0):(console.error("❌ Gagal subscribe:",c.status),await a.unsubscribe(),!1)}catch(n){return console.error("❌ Push subscription error:",n),!1}}async function Se(e,t){try{const n=await e.pushManager.getSubscription();if(!n)return!0;const a=await fetch(`${M.BASE_URL}/notifications/subscribe`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({endpoint:n.endpoint})});return a.ok?(await n.unsubscribe(),console.log("🚫 Unsubscribed"),!0):(console.error("❌ Gagal unsubscribe:",a.status),!1)}catch(n){return console.error("❌ Unsubscribe error:",n),!1}}async function Be(){const e=await navigator.serviceWorker.getRegistration();return!!await(e==null?void 0:e.pushManager.getSubscription())}window.addEventListener("hashchange",h);window.addEventListener("DOMContentLoaded",async()=>{await h(),await $()});function F(e,t=3e3){let n=document.getElementById("toast");n||(n=document.createElement("div"),n.id="toast",n.className="toast",document.body.appendChild(n)),n.textContent=e,n.classList.add("show"),setTimeout(()=>{n.classList.remove("show")},t)}async function $(){const e=document.getElementById("navbar"),t=localStorage.getItem("accessToken");let n="",a=!1;"serviceWorker"in navigator&&"PushManager"in window&&t&&(a=await Be(),n=`
      <a href="#" id="toggle-push">${a?"🔕 Unsubscribe":"🔔 Subscribe"}</a>
    `),e.innerHTML=t?`
      ${n}
      <a href="#/">Beranda</a>
      <a href="#/bookmark">📚 Bookmark</a>
      <a href="#/tambah">Tambah Cerita</a>
      <a href="#" id="logout-link">Logout</a>
    `:`
      <a href="#/">Beranda</a>
      <a href="#/login">Login</a>
      <a href="#/register">Daftar</a>
    `;const o=document.getElementById("logout-link");o&&o.addEventListener("click",r=>{r.preventDefault(),localStorage.removeItem("accessToken"),alert("Anda telah logout."),location.hash="#/",h(),$()});const i=document.getElementById("toggle-push");i&&i.addEventListener("click",async r=>{r.preventDefault();const c=await navigator.serviceWorker.getRegistration(),s=localStorage.getItem("accessToken");if(!s)return alert("Anda harus login terlebih dahulu.");let l=!1;a?(l=await Se(c,s),l&&(a=!1,F("🔕 Notifikasi dimatikan."))):(l=await Ee(c,s),l&&(a=!0,F("🔔 Notifikasi diaktifkan!"))),i.textContent=a?"🔕 Unsubscribe":"🔔 Subscribe"})}const B=document.querySelector("#main"),_=document.querySelector(".skip-link");_.addEventListener("click",function(e){e.preventDefault(),_.blur(),B.setAttribute("tabindex","-1"),B.focus(),B.scrollIntoView()});"serviceWorker"in navigator&&window.addEventListener("load",async()=>{const e=await navigator.serviceWorker.register("/sw.js");console.log("Service Worker registered:",e),Notification.permission==="default"&&await Notification.requestPermission()});
