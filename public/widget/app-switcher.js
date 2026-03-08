"use strict";(()=>{var u=`
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .app-switcher-trigger {
    position: fixed;
    z-index: 999999;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #1e293b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: background 0.2s, transform 0.15s;
  }
  .app-switcher-trigger:hover {
    background: #334155;
    transform: scale(1.05);
  }
  .app-switcher-trigger.top-left { top: 16px; left: 16px; }
  .app-switcher-trigger.top-right { top: 16px; right: 16px; }
  .app-switcher-trigger.bottom-left { bottom: 16px; left: 16px; }
  .app-switcher-trigger.bottom-right { bottom: 16px; right: 16px; }

  .waffle-icon {
    display: grid;
    grid-template-columns: repeat(3, 4px);
    gap: 3px;
  }
  .waffle-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #94a3b8;
  }
  .app-switcher-trigger:hover .waffle-dot {
    background: #e2e8f0;
  }

  .app-switcher-panel {
    position: fixed;
    z-index: 999998;
    width: 320px;
    max-height: 420px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    overflow: hidden;
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
    transition: opacity 0.15s ease, transform 0.15s ease;
    pointer-events: none;
  }
  .app-switcher-panel.open {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }
  .app-switcher-panel.top-left { top: 64px; left: 16px; }
  .app-switcher-panel.top-right { top: 64px; right: 16px; }
  .app-switcher-panel.bottom-left { bottom: 64px; left: 16px; }
  .app-switcher-panel.bottom-right { bottom: 64px; right: 16px; }

  .panel-header {
    padding: 12px 16px;
    border-bottom: 1px solid #334155;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .app-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    padding: 12px;
    overflow-y: auto;
    max-height: 320px;
  }

  .app-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.15s;
    cursor: pointer;
  }
  .app-tile:hover {
    background: #334155;
  }
  .app-tile.current {
    background: #334155;
  }

  .app-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .app-icon img {
    width: 22px;
    height: 22px;
  }

  .app-name {
    font-size: 11px;
    color: #cbd5e1;
    text-align: center;
    line-height: 1.2;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .app-tile:hover .app-name {
    color: #f1f5f9;
  }

  .panel-footer {
    padding: 10px 16px;
    border-top: 1px solid #334155;
    text-align: center;
  }
  .panel-footer a {
    font-size: 12px;
    color: #60a5fa;
    text-decoration: none;
    transition: color 0.15s;
  }
  .panel-footer a:hover {
    color: #93bbfc;
  }

  .loading {
    padding: 24px;
    text-align: center;
    color: #64748b;
    font-size: 13px;
  }
`;(function(){let p=document.currentScript;if(!p)return;let s=p.dataset.portalUrl||"",d=p.dataset.currentApp||"",g=p.dataset.position||"top-right";if(!s){console.warn("[App Switcher] data-portal-url is required");return}let l=document.createElement("div");l.id="app-switcher-widget",document.body.appendChild(l);let c=l.attachShadow({mode:"closed"}),f=document.createElement("style");f.textContent=u,c.appendChild(f);let o=document.createElement("button");o.className=`app-switcher-trigger ${g}`,o.setAttribute("aria-label","Open app switcher"),o.innerHTML=`
    <div class="waffle-icon">
      ${Array(9).fill('<div class="waffle-dot"></div>').join("")}
    </div>
  `,c.appendChild(o);let t=document.createElement("div");t.className=`app-switcher-panel ${g}`,t.innerHTML=`
    <div class="panel-header">Apps</div>
    <div class="app-grid">
      <div class="loading">Loading apps...</div>
    </div>
    <div class="panel-footer">
      <a href="${s}" target="_blank" rel="noopener noreferrer">More from App Portal</a>
    </div>
  `,c.appendChild(t);let i=!1,x=!1;function w(){i=!i,t.classList.toggle("open",i),i&&!x&&b()}function h(){i=!1,t.classList.remove("open")}async function b(){let e=t.querySelector(".app-grid");try{let n=s.replace(/\/$/,"")+"/api/widget/apps",m=await fetch(n);if(!m.ok)throw new Error("Failed to fetch");let v=await m.json();x=!0,e.innerHTML=v.map(r=>`
            <a class="app-tile${d&&r.appName.toLowerCase()===d.toLowerCase()?" current":""}" href="${a(r.productionUrl)}" target="_blank" rel="noopener noreferrer">
              <div class="app-icon" style="background:${a(r.iconColor)}">
                <img src="${a(r.iconUrl)}" alt="${a(r.appName)}" />
              </div>
              <span class="app-name">${a(r.appName)}</span>
            </a>
          `).join("")}catch{e.innerHTML='<div class="loading">Failed to load apps</div>'}}function a(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}o.addEventListener("click",e=>{e.stopPropagation(),w()}),document.addEventListener("click",()=>h()),document.addEventListener("keydown",e=>{e.key==="Escape"&&h()}),t.addEventListener("click",e=>e.stopPropagation())})();})();
