/* THE OUTLAWS — shared runtime: chrome styles, motion system, navigation.
   Loaded from <helmet> on every page (synchronous, so the stylesheet is in
   place before any body markup paints). One source of truth for the header,
   footer, background field, scroll reveal, cursor FX and page transitions. */
(function () {
  if (window.OutlawsFX) return;

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── stylesheet ─────────────────────────────────────────────────── */
  var CSS = [
    'html,body{margin:0;padding:0;background:#08060a}',
    "body{font-family:'Space Grotesk',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}",
    '*{box-sizing:border-box}',
    'a{color:#FF6A00;text-decoration:none}a:hover{color:#FF9040}',
    '::selection{background:#FF6A00;color:#0a0709}',
    '::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:#0b0810}',
    '::-webkit-scrollbar-thumb{background:#2a1f2b;border-radius:99px}::-webkit-scrollbar-thumb:hover{background:#FF6A00}',
    'input,textarea,select,button{font-family:inherit}',

    /* keyframes */
    '@keyframes vx-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.82)}}',
    '@keyframes vx-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes vx-sweep{from{transform:translateX(-120%)}to{transform:translateX(320%)}}',
    '@keyframes vx-orbit{from{transform:rotate(0)}to{transform:rotate(360deg)}}',
    '@keyframes vx-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
    '@keyframes vx-word{0%{opacity:0;transform:translateY(34px) scale(.9);filter:blur(12px)}55%{opacity:.85;transform:translateY(8px) scale(.98);filter:blur(2px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}',
    '@keyframes vx-draw{0%{stroke-dashoffset:1200;opacity:0}45%{opacity:.5}100%{stroke-dashoffset:0;opacity:.22}}',
    '@keyframes vx-dotglow{0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.55;transform:scale(1.45)}}',
    '@keyframes vx-float{0%,100%{transform:translate3d(0,0,0);opacity:.18}25%{transform:translate3d(6px,-14px,0);opacity:.7}50%{transform:translate3d(-4px,-7px,0);opacity:.35}75%{transform:translate3d(9px,-19px,0);opacity:.85}}',
    '@keyframes vx-ripple{0%{transform:translate(-50%,-50%) scale(.2);opacity:.85}100%{transform:translate(-50%,-50%) scale(11);opacity:0}}',
    '@keyframes vx-scan{0%{transform:translateY(-110%);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translateY(560%);opacity:0}}',
    '@keyframes vx-tickin{from{opacity:0;transform:translateY(-58%) scale(.92);filter:blur(5px)}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}',
    '@keyframes vx-node{0%,100%{box-shadow:0 0 0 0 rgba(255,106,0,.55)}50%{box-shadow:0 0 0 9px rgba(255,106,0,0)}}',
    '@keyframes vx-seal{0%{transform:scale(.4) rotate(-12deg);opacity:0}60%{transform:scale(1.08) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}',
    '@keyframes vx-urgent{0%,100%{color:#FF6A00;text-shadow:0 0 0 rgba(255,60,0,0)}50%{color:#FF8A33;text-shadow:0 0 22px rgba(255,60,0,.75)}}',
    '@keyframes vx-shimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}',
    '@keyframes ol-enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',

    /* motion utilities */
    '.vx-rise{animation:vx-rise .7s cubic-bezier(.2,.8,.2,1) both}',
    '.vx-word{display:inline-block;animation:vx-word .95s cubic-bezier(.16,1,.3,1) both;transition:color .3s,transform .3s,text-shadow .3s}',
    '.vx-word:hover{transform:translateY(-4px);text-shadow:0 0 28px rgba(255,106,0,.6)}',
    '.vx-line{stroke:#FF6A00;stroke-width:.6;opacity:0;stroke-dasharray:6 7;stroke-dashoffset:1200;animation:vx-draw 2.6s cubic-bezier(.16,1,.3,1) forwards}',
    '.vx-dot{fill:#FF8A33;opacity:0;transform-box:fill-box;transform-origin:center;animation:vx-dotglow 3.4s ease-in-out infinite}',
    '.vx-mote{position:absolute;width:2px;height:2px;border-radius:99px;background:#FF8A33;box-shadow:0 0 8px rgba(255,106,0,.9);animation:vx-float 9s ease-in-out infinite}',
    '.vx-ripple{position:fixed;width:46px;height:46px;border-radius:99px;border:1px solid rgba(255,106,0,.75);pointer-events:none;z-index:9999;animation:vx-ripple .95s cubic-bezier(.16,1,.3,1) forwards}',
    '.vx-tick{animation:vx-tickin .45s cubic-bezier(.16,1,.3,1)}',
    '.vx-urgent{animation:vx-urgent 1.6s ease-in-out infinite}',
    '.vx-seal{animation:vx-seal .7s cubic-bezier(.16,1,.3,1) both}',
    '.vx-node{animation:vx-node 1.8s ease-in-out infinite}',
    '.vx-scanner{position:absolute;left:0;right:0;height:38%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,106,0,.16),transparent);animation:vx-scan 1.5s linear infinite}',
    '.vx-skel{position:relative;overflow:hidden;background:rgba(255,255,255,.03)}',
    ".vx-skel::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);animation:vx-shimmer 1.3s linear infinite}",

    /* scroll reveal — default VISIBLE; JS arms then reveals */
    '.vx-reveal{transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1),filter 1s cubic-bezier(.16,1,.3,1)}',
    '.vx-stagger>*{transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1),filter .85s cubic-bezier(.16,1,.3,1)}',
    '.vx-armed.vx-reveal{opacity:0;transform:translateY(38px);filter:blur(7px)}',
    '.vx-armed.vx-reveal.vx-in{opacity:1;transform:translateY(0);filter:blur(0)}',
    '.vx-armed.vx-stagger>*{opacity:0;transform:translateY(30px) scale(.985);filter:blur(6px)}',
    '.vx-armed.vx-stagger.vx-in>*{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}',
    '.vx-stagger>*:nth-child(1){transition-delay:0s}.vx-stagger>*:nth-child(2){transition-delay:.07s}',
    '.vx-stagger>*:nth-child(3){transition-delay:.14s}.vx-stagger>*:nth-child(4){transition-delay:.21s}',
    '.vx-stagger>*:nth-child(5){transition-delay:.28s}.vx-stagger>*:nth-child(6){transition-delay:.35s}',
    '.vx-stagger>*:nth-child(7){transition-delay:.42s}.vx-stagger>*:nth-child(8){transition-delay:.49s}',

    '.vx-spot{position:relative}',
    ".vx-spot::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(340px circle at var(--mx,50%) var(--my,50%),rgba(255,106,0,.14),transparent 62%)}",
    '.vx-spot:hover::after{opacity:1}',

    /* page transition — deliberately lighter than the in-page motion:
       a short fade/lift with no blur, so navigation feels instant while
       scroll-reveal and state animations keep their weight. */
    '[data-page]>*:not(header):not(footer):not(svg):not([aria-hidden="true"]){animation:ol-enter .26s cubic-bezier(.22,.9,.3,1) both}',
    'html[data-leaving] [data-page]{opacity:.55;transition:opacity .12s linear}',

    /* ── chrome: header ── */
    '.ol-hd{position:sticky;top:0;z-index:40;backdrop-filter:blur(18px);background:rgba(8,6,10,.78);border-bottom:1px solid rgba(255,255,255,.07)}',
    '.ol-hd-in{max-width:min(2040px,94vw);margin:0 auto;padding:0 34px;height:72px;display:flex;align-items:center;gap:22px}',
    '.ol-hairline{height:1px;background:linear-gradient(90deg,transparent,rgba(255,106,0,.55) 18%,rgba(255,106,0,.85) 50%,rgba(255,106,0,.55) 82%,transparent);opacity:.5}',
    '.ol-brand{display:flex;align-items:center;gap:11px;flex:none}',
    '.ol-diamond{width:30px;height:30px;display:grid;place-items:center;border:1.5px solid #FF6A00;transform:rotate(45deg);box-shadow:0 0 22px rgba(255,106,0,.45)}',
    '.ol-diamond i{width:8px;height:8px;background:#FF6A00;box-shadow:0 0 10px #FF6A00;display:block}',
    '.ol-mark{display:flex;flex-direction:column;line-height:1}',
    ".ol-mark b{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:11px;letter-spacing:.42em;color:#6E646C}",
    ".ol-mark s{font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:19px;letter-spacing:.13em;color:#F4EDE6;margin-top:3px;text-decoration:none}",
    '.ol-nav{display:flex;align-items:center;gap:4px;flex:1}',
    '.ol-nav a{padding:9px 15px;font-size:14.5px;font-weight:500;color:#8C8189;border-radius:8px;white-space:nowrap;transition:color .22s,background .22s}',
    '.ol-nav a:hover{color:#F4EDE6;background:rgba(255,255,255,.05)}',
    '.ol-nav a.on{color:#F4EDE6;background:rgba(255,106,0,.1)}',
    '.ol-burger{display:none;width:40px;height:40px;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.09);border-radius:9px;color:#C6BBC1;font-size:15px;cursor:pointer;margin-right:auto;transition:border-color .22s,color .22s}',
    '.ol-burger:hover{border-color:rgba(255,106,0,.45);color:#FF6A00}',
    '.ol-srch{display:flex;align-items:center;gap:10px;padding:9px 14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.09);border-radius:9px;color:#6E646C;font-size:13.5px;cursor:pointer;min-width:220px;flex:none;transition:border-color .22s,color .22s}',
    '.ol-srch:hover{border-color:rgba(255,106,0,.45);color:#A79BA3}',
    '.ol-srch em{flex:1;text-align:left;font-style:normal;white-space:nowrap}',
    ".ol-srch kbd{font-family:'JetBrains Mono',monospace;font-size:10.5px;padding:2px 6px;border:1px solid rgba(255,255,255,.13);border-radius:5px;letter-spacing:.06em}",
    '.ol-bell{position:relative;width:38px;height:38px;display:grid;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.09);border-radius:9px;color:#A79BA3;cursor:pointer;font-size:15px;transition:border-color .22s,color .22s}',
    '.ol-bell:hover{border-color:rgba(255,106,0,.45);color:#F4EDE6}',
    '.ol-bell i{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:99px;background:#FF6A00;box-shadow:0 0 9px #FF6A00}',
    '.ol-sub{padding:10px 17px;font-size:13.5px;font-weight:600;color:#08060a;background:linear-gradient(180deg,#FFA047,#FF6A00);border-radius:9px;white-space:nowrap;box-shadow:0 6px 24px rgba(255,106,0,.32);transition:transform .2s,box-shadow .2s}',
    '.ol-sub:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,106,0,.5);color:#08060a}',
    '.ol-user{display:flex;align-items:center;gap:9px;padding:5px 11px 5px 5px;border:1px solid rgba(255,255,255,.09);border-radius:99px;transition:border-color .22s}',
    '.ol-user:hover{border-color:rgba(255,106,0,.4)}',
    ".ol-user i{width:28px;height:28px;border-radius:99px;background:linear-gradient(135deg,#FF6A00,#7a2a00);display:grid;place-items:center;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#08060a;font-style:normal}",
    ".ol-user s{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#C6BBC1;text-decoration:none}",

    /* ── chrome: footer ── */
    '.ol-ft{position:relative;z-index:1;margin-top:84px;border-top:1px solid rgba(255,255,255,.07)}',
    '.ol-ft-grid{max-width:min(2040px,94vw);margin:0 auto;padding:48px 34px 24px;display:grid;grid-template-columns:minmax(0,1.5fr) repeat(4,minmax(0,1fr));gap:36px 28px}',
    '@media(max-width:1120px){.ol-ft-grid{grid-template-columns:minmax(0,1.4fr) repeat(2,minmax(0,1fr))}}',
    ".ol-ft-t{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.16em;color:#4E454C;margin-bottom:16px}",
    '.ol-ft-col{display:flex;flex-direction:column;gap:11px}',
    '.ol-ft-col a{font-size:13.5px;color:#8C8189;transition:color .2s}.ol-ft-col a:hover{color:#FF6A00}',
    '.ol-ft-bot{max-width:min(2040px,94vw);margin:0 auto;padding:20px 34px 32px;border-top:1px solid rgba(255,255,255,.05);display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between}',
    ".ol-ft-bot span{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#4E454C;letter-spacing:.05em}",

    /* ── responsive ── */
    '@media(max-width:1120px){.ol-nav,.vx-nav{display:none!important}.ol-burger{display:grid}.ol-hd-in{gap:14px}.ol-brand,header .vx-shell>a:first-child{margin-right:auto}.ol-srch,.vx-search{min-width:0!important;width:40px;justify-content:center;padding:9px 0!important}.ol-srch em,.ol-srch kbd,.vx-search-label,.vx-search-kbd{display:none!important}}',
    '@media(max-width:820px){.ol-user,.vx-chip{display:none!important}.ol-hd-in,.ol-ft-grid,.ol-ft-bot{padding-left:16px;padding-right:16px}.ol-shell,.vx-shell{padding-left:16px!important;padding-right:16px!important}}',
    /* phones use the full width — the fluid desktop measure would inset twice */
    '@media(max-width:900px){.ol-hd-in,.ol-ft-grid,.ol-ft-bot,.ol-shell,.vx-shell,[data-page] [style*="max-width:min(2040px,94vw)"],[data-page] [style*="max-width: min(2040px, 94vw)"]{max-width:none!important}}',
    '@media(max-width:620px){.ol-hd-in{gap:10px}}',
    '@media(max-width:620px){.ol-sub{display:none}.ol-mark b{display:none}.ol-ft-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@media(max-width:480px){.ol-hd-in{height:62px!important;padding-left:12px!important;padding-right:12px!important;gap:6px}.ol-mark,.vx-mark{display:none!important}.ol-srch,.vx-search{width:44px!important;height:44px!important}.ol-bell{width:44px!important;height:44px!important}header .vx-shell{height:62px!important;padding-left:12px!important;padding-right:12px!important;gap:6px!important}.vx-burger,.ol-burger{width:44px!important;height:44px!important}}',
    '@media(pointer:coarse){#vx-halo{display:none}.vx-spot::after{display:none}}',

    /* ── global search: header field, dropdown, mobile sheet ── */
    '.ol-srch,.vx-search{position:relative}',
    '.ol-sxi{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#F4EDE6;font:inherit;font-size:13.5px}',
    '.ol-sxi::placeholder{color:#6E646C}',
    '.ol-sx{position:fixed;z-index:1000;display:none;flex-direction:column;max-height:min(72vh,540px);border:1px solid rgba(255,106,0,.3);border-radius:14px;background:#0e0a10;box-shadow:0 26px 70px rgba(0,0,0,.7);overflow:hidden}',
    '.ol-sx[data-open]{display:flex}',
    '.ol-sx-list{overflow-y:auto;padding:6px}',
    ".ol-sx-g{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.16em;color:#4E454C;padding:10px 10px 6px}",
    '.ol-sx-row{display:flex;align-items:center;gap:12px;width:100%;padding:10px;border:0;border-radius:9px;background:transparent;color:#F4EDE6;font:inherit;font-size:13.5px;text-align:left;cursor:pointer;min-height:46px}',
    '.ol-sx-row:hover,.ol-sx-row[data-sel]{background:rgba(255,106,0,.11)}',
    ".ol-sx-row i{width:30px;height:30px;flex:none;border-radius:8px;display:grid;place-items:center;font-family:'Chakra Petch',sans-serif;font-style:normal;font-size:11px;font-weight:700;color:#08060a}",
    '.ol-sx-row b{display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    ".ol-sx-row em{display:block;font-family:'JetBrains Mono',monospace;font-style:normal;font-size:9px;letter-spacing:.1em;color:#6E646C;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".ol-sx-row s{flex:none;font-family:'JetBrains Mono',monospace;text-decoration:none;font-size:8.5px;letter-spacing:.12em;color:#FF8A33;border:1px solid rgba(255,106,0,.28);border-radius:4px;padding:3px 6px}",
    '.ol-sx-empty{padding:14px 12px;color:#8C8189;font-size:12.5px;line-height:1.55}',
    '.ol-sx-ft{border-top:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);padding:9px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
    ".ol-sxc{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.1em;color:#8C8189;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:8px 12px;min-height:34px;cursor:pointer}",
    '.ol-sxc:hover{border-color:rgba(255,106,0,.5);color:#FF9040}',
    '.ol-sxc[data-on]{background:rgba(255,106,0,.14);border-color:rgba(255,106,0,.5);color:#FFB061}',
    '.ol-sx-set{border-top:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.015);padding:4px 9px 11px;display:flex;flex-direction:column}',
    ".ol-sx-set .l{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.16em;color:#4E454C;margin:11px 0 7px}",
    '.ol-sx-set .r{display:flex;gap:6px;flex-wrap:wrap}',
    ".ol-sx-hint{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.1em;color:#4E454C;margin-left:auto;padding-right:4px}",
    '.ol-sheet{position:fixed;inset:0;z-index:90;display:none;flex-direction:column;background:#08060a}',
    '.ol-sheet[data-open]{display:flex}',
    '.ol-sheet-top{display:flex;align-items:center;gap:10px;padding:calc(12px + env(safe-area-inset-top)) 14px 12px;border-bottom:1px solid rgba(255,255,255,.08)}',
    '.ol-sheet-top input{flex:1;min-width:0;height:46px;padding:0 14px;border:1px solid rgba(255,106,0,.35);border-radius:11px;background:rgba(255,255,255,.04);color:#F4EDE6;font:inherit;font-size:16px;outline:0}',
    '.ol-sheet-x{flex:none;min-width:46px;height:46px;display:grid;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:11px;color:#C6BBC1;font-size:15px;cursor:pointer}',
    '.ol-sheet-x:hover{border-color:#FF6A00;color:#FF6A00}',
    '.ol-sheet-body{flex:1;display:flex;flex-direction:column;overflow-y:auto;padding-bottom:env(safe-area-inset-bottom)}',
    '.ol-sheet .ol-sx-row{min-height:54px}',
    '@media(max-width:1120px){.ol-srch .ol-sxi,.vx-search .ol-sxi{display:none!important}}',

    /* ── breadcrumb rails scroll instead of clipping on small screens ── */
    '.ol-rail{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch}',
    '.ol-rail::-webkit-scrollbar{display:none}',
    '.ol-rail>*{flex:none;white-space:nowrap}',
    '@media(max-width:620px){.ol-rail{padding-left:16px!important;padding-right:16px!important;gap:9px!important}}',

    /* ── phone legibility: floor the desktop micro-type and grow tap targets.
       Inline styles are matched on the serialized style attribute so this
       reaches hand-authored and runtime-rendered markup alike. */
    '@media(max-width:620px){',
    '[data-page] [style*="font-size:8px"],[data-page] [style*="font-size: 8px"],',
    '[data-page] [style*="font-size:8.5px"],[data-page] [style*="font-size: 8.5px"],',
    '[data-page] [style*="font-size:9px"],[data-page] [style*="font-size: 9px"]{font-size:10px!important}',
    '[data-page] [style*="font-size:9.5px"],[data-page] [style*="font-size: 9.5px"],',
    '[data-page] [style*="font-size:10px"],[data-page] [style*="font-size: 10px"],',
    '[data-page] [style*="font-size:10.5px"],[data-page] [style*="font-size: 10.5px"]{font-size:11px!important}',
    '[data-page] [style*="font-size:12px"],[data-page] [style*="font-size: 12px"],',
    '[data-page] [style*="font-size:12.5px"],[data-page] [style*="font-size: 12.5px"]{font-size:13px!important}',
    '[data-page] button:not(:empty):not(:has(> span[style*="position:absolute"])):not(:has(> span[style*="position: absolute"])){min-height:40px!important}',
    '[data-page] button:not(:empty):not([style*="display"]):not(:has(> span[style*="position:absolute"])):not(:has(> span[style*="position: absolute"])){display:inline-flex!important;align-items:center!important;justify-content:center!important}',
    '}',
    /* ── header "More" menu: every non-primary destination ── */
    '.ol-more{position:relative;flex:none}',
    '.ol-more-b{display:flex;align-items:center;gap:7px;padding:9px 15px;font-size:14.5px;font-weight:500;color:#8C8189;background:transparent;border:0;border-radius:8px;cursor:pointer;white-space:nowrap;transition:color .22s,background .22s}',
    '.ol-more-b:hover,.ol-more[data-open] .ol-more-b{color:#F4EDE6;background:rgba(255,255,255,.05)}',
    '.ol-more-p{position:absolute;top:calc(100% + 14px);left:0;z-index:50;display:none;grid-template-columns:repeat(3,minmax(168px,1fr));gap:2px 20px;padding:16px 18px 18px;border:1px solid rgba(255,106,0,.28);border-radius:14px;background:#0e0a10;box-shadow:0 26px 70px rgba(0,0,0,.72)}',
    '.ol-more[data-open] .ol-more-p{display:grid}',
    ".ol-more-p .t{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.16em;color:#4E454C;padding:0 8px 9px}",
    '.ol-more-p a{display:block;padding:9px 8px;font-size:13.5px;color:#C6BBC1;border-radius:8px;white-space:nowrap;transition:color .2s,background .2s}',
    '.ol-more-p a:hover{color:#FF9040;background:rgba(255,106,0,.09)}',
    '.ol-more-p a[data-on]{color:#F4EDE6;background:rgba(255,106,0,.1)}',
    '@media(max-width:1120px){.ol-more{display:none!important}}',

    /* ── decorative field + mobile drawer ── */
    '.ol-field{position:fixed;inset:0;pointer-events:none;z-index:0}',
    '.ol-grid{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.32;background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:76px 76px;-webkit-mask-image:radial-gradient(1000px 700px at 50% 0%,#000 20%,transparent 78%);mask-image:radial-gradient(1000px 700px at 50% 0%,#000 20%,transparent 78%)}',
    '#vx-aura{position:fixed;inset:0;pointer-events:none;z-index:0;will-change:transform;background:radial-gradient(1100px 620px at 74% -8%,rgba(255,106,0,.15),transparent 65%),radial-gradient(740px 520px at 2% 16%,rgba(255,60,0,.06),transparent 70%)}',
    '#vx-halo{position:fixed;top:0;left:0;width:520px;height:520px;border-radius:99px;pointer-events:none;z-index:1;opacity:0;filter:blur(58px);will-change:transform,opacity;transition:opacity .5s;background:radial-gradient(circle,rgba(255,106,0,.13),rgba(255,60,0,.05) 45%,transparent 70%)}',
    '.ol-prog{position:fixed;top:0;left:0;right:0;height:2px;z-index:60;pointer-events:none}',
    '#vx-progress{display:block;height:100%;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,#FF3C00,#FFA047,#00D6B4);box-shadow:0 0 14px rgba(255,106,0,.7)}',
    '.ol-drawer{position:fixed;inset:0;z-index:70;display:none;background:rgba(4,3,5,.74);backdrop-filter:blur(7px)}',
    '.ol-drawer[data-open]{display:block}',
    '.ol-drawer-p{position:absolute;top:0;left:0;bottom:0;width:min(88vw,330px);background:#0b080d;border-right:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;overflow-y:auto;animation:ol-slide .34s cubic-bezier(.16,1,.3,1) both;box-shadow:34px 0 90px rgba(0,0,0,.6)}',
    '@keyframes ol-slide{from{transform:translateX(-100%)}to{transform:translateX(0)}}',
    '.ol-drawer-top{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 18px 16px;border-bottom:1px solid rgba(255,255,255,.07)}',
    '.ol-drawer-body{padding:6px 14px 22px;display:flex;flex-direction:column}',
    ".ol-drawer-p a{display:flex;align-items:center;gap:12px;padding:13px 13px;font-size:15.5px;font-weight:600;color:#C6BBC1;border-radius:10px;transition:color .2s,background .2s}",
    '.ol-drawer-p a:hover{color:#FF6A00;background:rgba(255,106,0,.07)}',
    '.ol-drawer-p a[data-on]{color:#F4EDE6;background:rgba(255,106,0,.1)}',
    ".ol-drawer-p a i{width:5px;height:5px;border-radius:99px;background:#3E353C;flex:none}",
    '.ol-drawer-p a[data-on] i,.ol-drawer-p a:hover i{background:#FF6A00;box-shadow:0 0 8px #FF6A00}',
    ".ol-drawer-p .t{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.18em;color:#4E454C;margin:16px 15px 8px}",
    '.ol-drawer-p .t:first-child{margin-top:10px}',
    '.ol-drawer-cta{margin:14px 14px 0;padding:14px;text-align:center;font-size:14.5px;font-weight:700;color:#08060a;background:linear-gradient(180deg,#FFA047,#FF6A00);border-radius:11px}',
    '.ol-drawer-cta:hover{color:#08060a}',
    '.ol-drawer-x{width:38px;height:38px;flex:none;display:grid;place-items:center;background:transparent;border:1px solid rgba(255,255,255,.12);border-radius:9px;color:#C6BBC1;font-size:15px;cursor:pointer}',
    '.ol-drawer-x:hover{border-color:#FF6A00;color:#FF6A00}',

    /* the burger is the first element in the header markup on every page */
    '.ol-burger{margin-right:0!important;flex:none}',
    '.ol-drawer-acct{display:flex;align-items:center;gap:11px;margin:12px 14px 0;padding:12px 13px;border:1px solid rgba(255,255,255,.1);border-radius:12px}',
    '.ol-drawer-acct:hover{border-color:rgba(255,106,0,.4)}',
    ".ol-drawer-acct i{width:34px;height:34px;flex:none;border-radius:99px;background:linear-gradient(135deg,#FF6A00,#7a2a00);display:grid;place-items:center;font-family:'JetBrains Mono',monospace;font-style:normal;font-size:12px;font-weight:700;color:#08060a}",
    '.ol-drawer-acct b{display:block;font-size:14.5px;color:#F4EDE6;font-weight:600}',
    ".ol-drawer-acct em{display:block;font-family:'JetBrains Mono',monospace;font-style:normal;font-size:9px;letter-spacing:.12em;color:#6E646C;margin-top:3px}",
    'html[data-menu]{overflow:hidden}',

    '@media(prefers-reduced-motion:reduce){.vx-word,.vx-line,.vx-mote,.vx-rise,.vx-scanner,.vx-urgent,.vx-node,.vx-skel::after,[data-page]>*{animation:none!important;opacity:1!important}.vx-reveal,.vx-stagger>*{opacity:1!important;transform:none!important;filter:none!important}}'
  ].join('');

  var st = document.createElement('style');
  st.id = 'outlaws-runtime';
  st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  /* ── behaviour ──────────────────────────────────────────────────── */
  var started = false;
  var pt = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  var raf = null, idleTimer = null, sweepQueued = false;

  function node(id) { var n = document.getElementById(id); return n && n.isConnected ? n : null; }

  function sweep() {
    var vh = window.innerHeight || 800;
    var list = document.querySelectorAll('.vx-reveal, .vx-stagger');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.classList.contains('vx-in')) continue;
      if (!el.classList.contains('vx-armed')) {
        if (RM) { el.classList.add('vx-in'); continue; }
        el.classList.add('vx-armed');
        continue;
      }
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('vx-in');
    }
  }
  function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(function () {
      sweepQueued = false;
      sweep();
      /* a page re-render can replace the header: rewire any fresh search box */
      if (started) { globalSearch(); moreMenu(); }
    });
  }

  function loop() {
    pt.x += (pt.tx - pt.x) * 0.13;
    pt.y += (pt.ty - pt.y) * 0.13;
    var h = node('vx-halo');
    if (h) {
      h.style.transform = 'translate3d(' + (pt.x - 260) + 'px,' + (pt.y - 260) + 'px,0)';
      if (pt.on) h.style.opacity = '1';
    }
    if (Math.abs(pt.tx - pt.x) < 0.4 && Math.abs(pt.ty - pt.y) < 0.4) { raf = null; return; }
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (raf === null && !document.hidden) raf = requestAnimationFrame(loop); }

  function onMove(e) {
    pt.tx = e.clientX; pt.ty = e.clientY; pt.on = true;
    kick();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }, 900);
    var card = e.target.closest && e.target.closest('.vx-spot');
    if (card) {
      var b = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
      card.style.setProperty('--my', (e.clientY - b.top) + 'px');
    }
  }
  function onLeave() { pt.on = false; var h = node('vx-halo'); if (h) h.style.opacity = '0'; }

  function onClick(e) {
    var r = document.createElement('span');
    r.className = 'vx-ripple';
    r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(function () { r.remove(); }, 1000);
  }

  function onScroll() {
    var doc = document.documentElement;
    var top = doc.scrollTop || document.body.scrollTop || 0;
    var max = doc.scrollHeight - doc.clientHeight;
    var bar = node('vx-progress');
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, top / max) : 0) + ')';
    var aura = node('vx-aura');
    if (aura && !RM) aura.style.transform = 'translate3d(0,' + (top * -0.07) + 'px,0)';
    queueSweep();
  }

  function internal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || a.target === '_blank') return false;
    return /\.dc\.html($|[?#])/.test(href) || /(^|\/)index\.html($|[?#])/.test(href);
  }
  function onNavClick(e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (e.target && e.target.closest && e.target.closest('.ol-sx, .ol-sheet, .ol-srch, .vx-search')) return;
    var a = e.target.closest && e.target.closest('a');
    if (!internal(a)) return;
    var href = a.getAttribute('href');
    /* The account link is intentionally left to native navigation. It stays reliable
       even when a page transition is interrupted by a rapid click or re-render. */
    if (/(^|\/)profile\.dc\.html(?:[?#]|$)/.test(href)) return;
    e.preventDefault();
    if (RM) { location.href = href; return; }
    document.documentElement.setAttribute('data-leaving', '');
    setTimeout(function () { location.href = href; }, 170);
  }
  var prefetched = {};

  /* ── global search ───────────────────────────────────────────────
     The header field answers in place: typing shows a live dropdown
     (mobile: a full-screen sheet). It only leaves the page when the
     user actually asks for a filtered view — a type chip, a search
     setting, or "Open full search". */
  var SIX = [
    ['ARCforge Genesis Pass', 'RAFFLE', 'raffle.dc.html', 'ACTIVE · 4,821 ENTRIES · GTD', 'AF'],
    ['Riftbound Arena Beta Key', 'RAFFLE', 'raffle.dc.html', 'ACTIVE · FCFS · 1,000 SPOTS', 'RB'],
    ['Nightfall Arena Access', 'RAFFLE', 'raffle.dc.html', 'ENDING SOON · 12H 32M', 'NI'],
    ['Frontier Land Whitelist', 'RAFFLE', 'raffle.dc.html', 'ENDING SOON · 50 SPOTS', 'FL'],
    ['Nova Node Operator Drop', 'RAFFLE', 'raffle.dc.html', 'ACTIVE · GTD · 8 SPOTS', 'NP'],
    ['ARCforge Labs', 'PROJECT', 'project.dc.html', '4 ACTIVE · VERIFIED', 'AF'],
    ['Riftbound', 'PROJECT', 'project.dc.html', '2 ACTIVE · 1 UPCOMING', 'RB'],
    ['Frontier Labs', 'PROJECT', 'project.dc.html', '2 ACTIVE · VERIFIED', 'FL'],
    ['Nova Protocol', 'PROJECT', 'project.dc.html', '1 ACTIVE · VERIFIED', 'NP'],
    ['ARCforge Community', 'COMMUNITY', 'community.dc.html', '12.4K MEMBERS · PLATINUM', 'AC'],
    ['Nightfall Guild', 'COMMUNITY', 'community.dc.html', '9.2K MEMBERS · GOLD', 'NG'],
    ['Frontier Collective', 'COMMUNITY', 'community.dc.html', '8.1K MEMBERS · GOLD', 'FC'],
    ['My Raffles', 'PAGE', 'myraffles.dc.html', 'YOUR ENTRIES AND RESULTS', 'MR'],
    ['Calendar', 'PAGE', 'calendar.dc.html', 'UPCOMING AND CLOSING DRAWS', 'CA'],
    ['Discover', 'PAGE', 'discover.dc.html', 'EVERY OPEN ALLOCATION', 'DI'],
    ['Premium', 'PAGE', 'premium.dc.html', 'AUTO-REGISTER AND ALERTS', 'PR'],
    ['Support', 'PAGE', 'support.dc.html', 'HELP CENTER AND DOCS', 'SP'],
    ['My Wins', 'PAGE', 'wins.dc.html', 'ALLOCATIONS YOU WON', 'WI'],
    ['Auto-Register', 'PAGE', 'autoregister.dc.html', 'PREMIUM AUTOMATION', 'AR'],
    ['Notifications', 'PAGE', 'notifications.dc.html', 'EVENTS AND PREFERENCES', 'NO'],
    ['Messages', 'PAGE', 'messages.dc.html', 'INTERNAL CONVERSATIONS', 'ME'],
    ['Account settings', 'PAGE', 'settings.dc.html', 'IDENTITY · WALLETS · SECURITY', 'AS'],
    ['Support requests', 'PAGE', 'requests.dc.html', 'TICKETS AND REPLIES', 'SR'],
    ['Community manager', 'PAGE', 'community-admin.dc.html', 'TEAM · ROLES · RULES', 'CM'],
    ['Raffle manager', 'PAGE', 'raffle-admin.dc.html', 'ENTRIES · WINNERS · AUDIT', 'RM'],
    ['Requirements builder', 'PAGE', 'raffle-admin.dc.html#requirements', 'AND BLOCKS · OR VALUES', 'RQ'],
    ['Templates', 'PAGE', 'raffle-admin.dc.html#templates', 'REUSABLE RAFFLE CONFIGS', 'TE'],
    ['Winner selection', 'PAGE', 'raffle-admin.dc.html#winners', 'DRAW PREPARATION', 'WS'],
    ['Provably fair records', 'PAGE', 'raffle-admin.dc.html#fairness', 'PUBLISHED EVIDENCE', 'PF'],
    ['Admin dashboard', 'PAGE', 'dashboard.dc.html', 'SUPER ADMIN CONSOLE', 'AD'],
    ['Talent and hiring', 'PAGE', 'hiring.dc.html', 'JOBS AND APPLICATIONS', 'HR'],
    ['Page map', 'PAGE', 'sitemap.dc.html', 'EVERY SCREEN AND STATE', 'PM']
  ];
  var SPREF = { sort: 'RELEVANCE', eligible: false, ended: false, verified: false };
  try {
    var storedPrefs = window.localStorage && localStorage.getItem('ol.search.prefs');
    if (storedPrefs) { var parsed = JSON.parse(storedPrefs); for (var pk in SPREF) if (pk in parsed) SPREF[pk] = parsed[pk]; }
  } catch (e) {}
  function savePrefs() { try { localStorage.setItem('ol.search.prefs', JSON.stringify(SPREF)); } catch (e) {} }

  var SS = { q: '', type: 'ALL', sel: 0, settings: false };
  var sxPanel = null, sxSheet = null, sxTriggers = [];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function sxArt(kind) {
    return kind === 'COMMUNITY' ? 'linear-gradient(135deg,#5ef2d6,#00806c)'
      : kind === 'PROJECT' ? 'linear-gradient(135deg,#FFD08A,#FF8A33)'
      : kind === 'PAGE' ? 'linear-gradient(135deg,#C6BBC1,#6E646C)'
      : 'linear-gradient(135deg,#FFA047,#FF3C00)';
  }
  function sxHits() {
    var q = SS.q.trim().toLowerCase();
    var rows = SIX.filter(function (r) {
      if (SS.type !== 'ALL' && r[1] !== SS.type) return false;
      if (!q) return false;
      return (r[0] + ' ' + r[1] + ' ' + r[3]).toLowerCase().indexOf(q) !== -1;
    });
    if (SPREF.sort === 'ENDING SOON') rows.sort(function (a, b) { return (b[3].indexOf('ENDING') > -1) - (a[3].indexOf('ENDING') > -1); });
    return rows.slice(0, 8);
  }
  function sxQuick() {
    return SIX.filter(function (r) { return r[1] === 'PAGE' || r[3].indexOf('ENDING') > -1; }).slice(0, 5);
  }
  function sxRows() { return SS.q.trim() ? sxHits() : sxQuick(); }
  function sxURL() {
    var p = ['q=' + encodeURIComponent(SS.q.trim()), 'type=' + SS.type.toLowerCase(), 'sort=' + SPREF.sort.toLowerCase().replace(/ /g, '-')];
    if (SPREF.eligible) p.push('eligible=1');
    if (SPREF.ended) p.push('ended=1');
    if (SPREF.verified) p.push('verified=1');
    return 'search.dc.html?' + p.join('&');
  }
  function sxGo(href) {
    sxClose();
    location.href = href;
  }
  function chip(label, on, attrs) {
    return '<button type="button" class="ol-sxc"' + (on ? ' data-on=""' : '') + ' ' + attrs + '>' + label + '</button>';
  }
  function sxMarkup() {
    var rows = sxRows(), typed = !!SS.q.trim(), out = '<div class="ol-sx-list">';
    out += '<div class="ol-sx-g">' + (typed ? (rows.length + (rows.length === 1 ? ' MATCH' : ' MATCHES')) : 'QUICK JUMPS') + '</div>';
    if (!rows.length) {
      out += '<div class="ol-sx-empty">Nothing matches “' + esc(SS.q.trim()) + '”. Try a shorter word, or open full search for the filtered view.</div>';
    }
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      out += '<button type="button" class="ol-sx-row" data-go="' + r[2] + '"' + (i === SS.sel ? ' data-sel=""' : '') + '>'
        + '<i style="background:' + sxArt(r[1]) + '">' + esc(r[4]) + '</i>'
        + '<span style="flex:1;min-width:0"><b>' + esc(r[0]) + '</b><em>' + esc(r[3]) + '</em></span>'
        + '<s>' + r[1] + '</s></button>';
    }
    out += '</div>';

    out += '<div class="ol-sx-ft">'
      + chip('ALL', SS.type === 'ALL', 'data-type="ALL"')
      + chip('RAFFLES', SS.type === 'RAFFLE', 'data-type="RAFFLE"')
      + chip('PROJECTS', SS.type === 'PROJECT', 'data-type="PROJECT"')
      + chip('COMMUNITIES', SS.type === 'COMMUNITY', 'data-type="COMMUNITY"')
      + chip('⚙ SETTINGS', SS.settings, 'data-settings="1"')
      + '<span class="ol-sx-hint">ENTER OPENS · ESC CLOSES</span></div>';

    if (SS.settings) {
      out += '<div class="ol-sx-set">'
        + '<div class="l">SORT RESULTS</div><div class="r">'
        + ['RELEVANCE', 'ENDING SOON', 'NEWEST'].map(function (s) { return chip(s, SPREF.sort === s, 'data-sort="' + s + '"'); }).join('')
        + '</div><div class="l">ONLY SHOW</div><div class="r">'
        + chip('ELIGIBLE FOR ME', SPREF.eligible, 'data-flag="eligible"')
        + chip('VERIFIED PROJECTS', SPREF.verified, 'data-flag="verified"')
        + chip('INCLUDE ENDED', SPREF.ended, 'data-flag="ended"')
        + '</div></div>';
    }
    out += '<div class="ol-sx-ft"><button type="button" class="ol-sxc" data-full="1" style="width:100%;color:#FFB061;border-color:rgba(255,106,0,.35)">OPEN FULL SEARCH →</button></div>';
    return out;
  }
  function sxPaint() {
    var m = sxMarkup();
    if (sxPanel) sxPanel.innerHTML = m;
    if (sxSheet) sxSheet.querySelector('.ol-sheet-body').innerHTML = m;
    for (var i = 0; i < sxTriggers.length; i++) {
      var input = sxTriggers[i].querySelector('.ol-sxi');
      if (input && input.value !== SS.q) input.value = SS.q;
    }
  }
  function sxPlace(trigger) {
    if (!sxPanel || !trigger) return;
    var r = trigger.getBoundingClientRect();
    var w = Math.min(Math.max(340, r.width), window.innerWidth - 24);
    var left = Math.min(Math.max(12, r.left), window.innerWidth - w - 12);
    sxPanel.style.left = left + 'px';
    sxPanel.style.top = (r.bottom + 8) + 'px';
    sxPanel.style.width = w + 'px';
  }
  function narrow() { return window.matchMedia('(max-width:1120px)').matches; }
  function sxClose() {
    SS.settings = false;
    if (sxPanel) sxPanel.removeAttribute('data-open');
    if (sxSheet) sxSheet.removeAttribute('data-open');
    document.documentElement.style.overflow = '';
  }
  function sxOpenPanel(trigger) {
    if (!sxPanel) return;
    SS.sel = 0;
    sxPaint();
    sxPanel.setAttribute('data-open', '');
    sxPanel.__trigger = trigger;
    sxPlace(trigger);
  }
  function sxOpenSheet() {
    if (!sxSheet) return;
    SS.sel = 0;
    sxPaint();
    sxSheet.setAttribute('data-open', '');
    document.documentElement.style.overflow = 'hidden';
    var input = sxSheet.querySelector('input');
    input.value = SS.q;
    setTimeout(function () { input.focus(); }, 40);
  }
  function sxFocus() {
    if (narrow()) return sxOpenSheet();
    var t = sxTriggers[0];
    if (!t) return;
    var input = t.querySelector('.ol-sxi');
    if (input) input.focus();
    sxOpenPanel(t);
  }
  function sxType(v) {
    SS.q = v; SS.sel = 0;
    sxPaint();
    if (sxPanel && sxPanel.hasAttribute('data-open')) sxPlace(sxPanel.__trigger);
  }
  function sxKeys(e) {
    var rows = sxRows();
    if (e.key === 'Escape') { sxClose(); if (e.target.blur) e.target.blur(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!rows.length) return;
      SS.sel = (SS.sel + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length;
      sxPaint();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (rows[SS.sel]) sxGo(rows[SS.sel][2]);
    }
  }
  function sxAction(e) {
    var el = e.target.closest && e.target.closest('[data-go],[data-type],[data-sort],[data-flag],[data-settings],[data-full]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    if (el.hasAttribute('data-go')) return sxGo(el.getAttribute('data-go'));
    if (el.hasAttribute('data-settings')) { SS.settings = !SS.settings; return sxPaint(); }
    if (el.hasAttribute('data-full')) return sxGo(sxURL());
    /* a filter or a setting is an explicit request for the full, filtered view */
    if (el.hasAttribute('data-type')) {
      SS.type = el.getAttribute('data-type');
      if (SS.type === 'ALL' && !SS.q.trim()) return sxPaint();
      return sxGo(sxURL());
    }
    if (el.hasAttribute('data-sort')) { SPREF.sort = el.getAttribute('data-sort'); savePrefs(); return sxGo(sxURL()); }
    var flag = el.getAttribute('data-flag');
    SPREF[flag] = !SPREF[flag];
    savePrefs();
    sxGo(sxURL());
  }
  function globalSearch() {
    if (!sxPanel) {
      sxPanel = document.createElement('div');
      sxPanel.className = 'ol-sx';
      sxPanel.setAttribute('role', 'listbox');
      document.body.appendChild(sxPanel);
      sxPanel.addEventListener('mousedown', function (e) { e.preventDefault(); });
      sxPanel.addEventListener('click', sxAction);

      sxSheet = document.createElement('div');
      sxSheet.className = 'ol-sheet';
      sxSheet.innerHTML = '<div class="ol-sheet-top"><input type="search" aria-label="Search raffles, projects or communities" placeholder="Search raffles, projects…" autocomplete="off" /><button type="button" class="ol-sheet-x" aria-label="Close search">✕</button></div><div class="ol-sheet-body"></div>';
      document.body.appendChild(sxSheet);
      sxSheet.querySelector('input').addEventListener('input', function (e) { sxType(e.target.value); });
      sxSheet.querySelector('input').addEventListener('keydown', sxKeys);
      sxSheet.querySelector('.ol-sheet-x').addEventListener('click', function () { sxClose(); });
      sxSheet.addEventListener('click', sxAction);

      document.addEventListener('click', function (e) {
        if (!sxPanel.hasAttribute('data-open')) return;
        if (sxPanel.contains(e.target)) return;
        for (var i = 0; i < sxTriggers.length; i++) if (sxTriggers[i].contains(e.target)) return;
        sxClose();
      });
      window.addEventListener('resize', function () { if (sxPanel.hasAttribute('data-open')) sxPlace(sxPanel.__trigger); });
      window.addEventListener('scroll', function () { if (sxPanel.hasAttribute('data-open')) sxPlace(sxPanel.__trigger); }, true);
      document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); sxFocus(); }
      });
    }

    sxTriggers = sxTriggers.filter(function (t) { return t.isConnected; });
    var boxes = document.querySelectorAll('.ol-srch, .vx-search');
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      if (box.__sx) continue;
      box.__sx = 1;
      sxTriggers.push(box);
      box.innerHTML = '<span style="font-size:14px;flex:none">⌕</span>'
        + '<input class="ol-sxi" type="search" aria-label="Search raffles, projects or communities" placeholder="Search raffles, projects…" autocomplete="off" />'
        + '<kbd style="font-family:\'JetBrains Mono\',monospace;font-size:10.5px;padding:2px 6px;border:1px solid rgba(255,255,255,.13);border-radius:5px;letter-spacing:.06em">⌘K</kbd>';
      (function (trigger) {
        var input = trigger.querySelector('.ol-sxi');
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          if (narrow()) return sxOpenSheet();
          input.focus();
          sxOpenPanel(trigger);
        });
        input.addEventListener('input', function (e) {
          sxType(e.target.value);
          if (!sxPanel.hasAttribute('data-open')) sxOpenPanel(trigger);
        });
        input.addEventListener('focus', function () { if (!narrow()) sxOpenPanel(trigger); });
        input.addEventListener('keydown', sxKeys);
      })(box);
    }
  }
  function onHover(e) {
    var a = e.target.closest && e.target.closest('a');
    if (!internal(a)) return;
    var href = a.getAttribute('href');
    if (prefetched[href]) return;
    prefetched[href] = 1;
    var l = document.createElement('link');
    l.rel = 'prefetch'; l.href = href;
    document.head.appendChild(l);
  }

  /* decorative background field — injected once, never authored per page */
  var NAV = [
    ['BROWSE', [['Home', 'index.html'], ['Discover', 'discover.dc.html'], ['Projects', 'projects.dc.html'], ['Communities', 'communities.dc.html'], ['Calendar', 'calendar.dc.html']]],
    ['YOUR ACTIVITY', [['My Raffles', 'myraffles.dc.html'], ['My Wins', 'wins.dc.html'], ['Notifications', 'notifications.dc.html'], ['Messages', 'messages.dc.html'], ['Auto-Register', 'autoregister.dc.html'], ['Premium', 'premium.dc.html']]],
    ['MANAGE', [['Community manager', 'community-admin.dc.html'], ['Raffle manager', 'raffle-admin.dc.html'], ['Requirements builder', 'raffle-admin.dc.html#requirements'], ['Templates', 'raffle-admin.dc.html#templates'], ['Winner selection', 'raffle-admin.dc.html#winners']]],
    ['VERIFICATION', [['Check eligibility', 'verify.dc.html'], ['Provably fair records', 'raffle-admin.dc.html#fairness'], ['How it works', 'support.dc.html#verification']]],
    ['MORE', [['Search', 'search.dc.html'], ['Account settings', 'settings.dc.html'], ['Support requests', 'requests.dc.html'], ['Talent and hiring', 'hiring.dc.html'], ['Admin dashboard', 'dashboard.dc.html'], ['Page map', 'sitemap.dc.html'], ['Sign in', 'auth.dc.html']]]
  ];

  /* header "More" menu — the non-primary destinations, one source of truth */
  var MORE = [
    ['MANAGE', [['Community manager', 'community-admin.dc.html'], ['Create community', 'community-admin.dc.html#create'], ['Raffle manager', 'raffle-admin.dc.html'], ['Create raffle', 'raffle-admin.dc.html#create'], ['Requirements builder', 'raffle-admin.dc.html#requirements'], ['Templates', 'raffle-admin.dc.html#templates']]],
    ['YOUR ACCOUNT', [['My wins', 'wins.dc.html'], ['Auto-Register', 'autoregister.dc.html'], ['Notifications', 'notifications.dc.html'], ['Messages', 'messages.dc.html'], ['Support requests', 'requests.dc.html'], ['Account settings', 'settings.dc.html']]],
    ['PLATFORM', [['Winner selection', 'raffle-admin.dc.html#winners'], ['Provably fair records', 'raffle-admin.dc.html#fairness'], ['Admin dashboard', 'dashboard.dc.html'], ['Talent and hiring', 'hiring.dc.html'], ['Page map', 'sitemap.dc.html'], ['System states', 'states.dc.html']]]
  ];

  function moreMenu() {
    var navs = document.querySelectorAll('.ol-nav');
    var here = (location.pathname.split('/').pop() || 'index.html');
    for (var i = 0; i < navs.length; i++) {
      var nav = navs[i];
      if (nav.__more) continue;
      nav.__more = 1;
      var wrap = document.createElement('div');
      wrap.className = 'ol-more';
      var html = '<button type="button" class="ol-more-b" aria-haspopup="true" aria-expanded="false">More <span aria-hidden="true" style="font-size:10px">▾</span></button><div class="ol-more-p">';
      for (var g = 0; g < MORE.length; g++) {
        html += '<div><div class="t">' + MORE[g][0] + '</div>';
        var items = MORE[g][1];
        for (var j = 0; j < items.length; j++) {
          var on = items[j][1].split('#')[0] === here ? ' data-on=""' : '';
          html += '<a href="' + items[j][1] + '"' + on + '>' + items[j][0] + '</a>';
        }
        html += '</div>';
      }
      wrap.innerHTML = html + '</div>';
      nav.appendChild(wrap);
    }
  }
  function closeMore() {
    var list = document.querySelectorAll('.ol-more[data-open]');
    for (var i = 0; i < list.length; i++) {
      list[i].removeAttribute('data-open');
      var b = list[i].querySelector('.ol-more-b');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  }

  function field() {
    if (document.getElementById('vx-aura') || !document.body) return;
    var page = document.querySelector('[data-page]');
    if (!page) return;
    var frag = document.createElement('div');
    var motes = '';
    var pos = [[20, 11, .3], [36, 89, 1.3], [56, 6, 2.2], [70, 93, .8], [84, 28, 3], [13, 61, 3.7]];
    for (var i = 0; i < pos.length; i++) motes += '<span class="vx-mote" style="top:' + pos[i][0] + '%;left:' + pos[i][1] + '%;animation-delay:' + pos[i][2] + 's"></span>';
    frag.innerHTML =
      '<div id="vx-aura" aria-hidden="true"></div>' +
      '<div class="ol-grid" aria-hidden="true"></div>' +
      '<svg class="ol-field" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="0" y1="24%" x2="100%" y2="24%" class="vx-line" style="animation-delay:.4s"/>' +
        '<line x1="0" y1="78%" x2="100%" y2="78%" class="vx-line" style="animation-delay:.9s"/>' +
        '<line x1="17%" y1="0" x2="17%" y2="100%" class="vx-line" style="animation-delay:1.3s"/>' +
        '<line x1="83%" y1="0" x2="83%" y2="100%" class="vx-line" style="animation-delay:1.7s"/>' +
        '<circle cx="17%" cy="24%" r="2.4" class="vx-dot" style="animation-delay:2.5s"/>' +
        '<circle cx="83%" cy="24%" r="2.4" class="vx-dot" style="animation-delay:2.8s"/>' +
        '<circle cx="17%" cy="78%" r="2.4" class="vx-dot" style="animation-delay:3.1s"/>' +
        '<circle cx="83%" cy="78%" r="2.4" class="vx-dot" style="animation-delay:3.4s"/>' +
      '</svg>' +
      '<div class="ol-field" aria-hidden="true">' + motes + '</div>' +
      '<div id="vx-halo" aria-hidden="true"></div>' +
      '<div class="ol-prog" aria-hidden="true"><span id="vx-progress"></span></div>';
    while (frag.firstChild) document.body.appendChild(frag.firstChild);
  }

  function drawer() {
    var d = document.querySelector('.ol-drawer');
    if (d) return d;
    d = document.createElement('div');
    d.className = 'ol-drawer';
    d.id = 'ol-menu';
    var here = (location.pathname.split('/').pop() || 'index.html');
    var body = '';
    for (var g = 0; g < NAV.length; g++) {
      body += '<div class="t">' + NAV[g][0] + '</div>';
      var items = NAV[g][1];
      for (var i = 0; i < items.length; i++) {
        var on = items[i][1] === here ? ' data-on=""' : '';
        body += '<a href="' + items[i][1] + '"' + on + '><i></i>' + items[i][0] + '</a>';
      }
    }
    d.innerHTML =
      '<div class="ol-drawer-p" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="ol-drawer-top">' +
          '<span class="ol-brand"><span class="ol-diamond"><i></i></span><span class="ol-mark"><b>THE</b><s>OUTLAWS</s></span></span>' +
          '<button class="ol-drawer-x" type="button" aria-label="Close menu">✕</button>' +
        '</div>' +
        '<a class="ol-drawer-acct" href="profile.dc.html"><i>A</i><span><b>arc_director</b><em>VIEW PROFILE · WALLETS · SOCIALS</em></span></a>' +
        '<div class="ol-drawer-body">' + body + '</div>' +
        '<a class="ol-drawer-cta" href="premium.dc.html">Go Premium</a>' +
        '<div style="padding:16px 20px calc(22px + env(safe-area-inset-bottom));font-family:\'JetBrains Mono\',monospace;font-size:9px;line-height:1.7;letter-spacing:.06em;color:#4E454C">NON-CUSTODIAL · NO PRIVATE KEYS STORED</div>' +
      '</div>';
    d.addEventListener('click', function (e) {
      /* outside tap, the X, or picking any destination all close the drawer */
      if (e.target === d || (e.target.closest && e.target.closest('.ol-drawer-x, a'))) closeMenu();
    });
    document.body.appendChild(d);
    return d;
  }
  function closeMenu() {
    var d = document.querySelector('.ol-drawer');
    if (d) d.removeAttribute('data-open');
    document.documentElement.removeAttribute('data-menu');
    var b = document.querySelectorAll('.ol-burger, .vx-burger');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var d = drawer();
    if (d.hasAttribute('data-open')) return closeMenu();
    sxClose();
    d.setAttribute('data-open', '');
    document.documentElement.setAttribute('data-menu', '');
    var b = document.querySelectorAll('.ol-burger, .vx-burger');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-expanded', 'true');
    var x = d.querySelector('.ol-drawer-x');
    if (x) setTimeout(function () { x.focus(); }, 60);
  }

  /* ── raffle CTA vocabulary ───────────────────────────────────────
     One state machine for every raffle card and row on the platform, so
     a card never says "Enter" on a raffle that cannot be entered. Pages
     pass the raffle's state and render the returned label + palette. */
  var CTA_SKIN = {
    primary: { ink: '#08060a', bg: 'linear-gradient(180deg,#FFA047,#FF6A00)', border: 'transparent' },
    warn:    { ink: '#FFB061', bg: 'rgba(255,106,0,.1)',  border: 'rgba(255,106,0,.45)' },
    met:     { ink: '#00D6B4', bg: 'rgba(0,214,180,.09)', border: 'rgba(0,214,180,.42)' },
    win:     { ink: '#08060a', bg: 'linear-gradient(180deg,#FFD98A,#FFC24D)', border: 'transparent' },
    live:    { ink: '#08060a', bg: 'linear-gradient(180deg,#5ef2d6,#00b899)', border: 'transparent' },
    ghost:   { ink: '#DCD2D6', bg: 'transparent', border: 'rgba(255,255,255,.16)' }
  };
  function cta(r) {
    r = r || {};
    var status = (r.status || 'live').toLowerCase();
    var missing = r.missing || 1;
    function mk(label, href, skin, note) {
      var s = CTA_SKIN[skin];
      return { label: label, href: href, kind: skin, note: note || '', ink: s.ink, bg: s.bg, border: s.border };
    }
    if (status === 'upcoming' || status === 'scheduled') return mk('Set a reminder', 'calendar.dc.html', 'ghost', 'OPENS LATER');
    if (status === 'drawing' || status === 'finalizing') return mk('Draw in progress', 'raffle.dc.html#fairness', 'live', 'SEED REVEALING');
    if (status === 'finalized' || status === 'ended') {
      if (r.won) return mk('View result', 'myraffles.dc.html', 'win', 'YOU WON');
      if (r.entered) return mk('View winners', 'raffle.dc.html#fairness', 'met', 'NOT DRAWN FOR YOU');
      return mk('Verify fairness', 'raffle.dc.html#fairness', 'met', 'EVIDENCE PUBLISHED');
    }
    if (r.entered) return mk('Entry confirmed', 'myraffles.dc.html', 'met', 'IN THE LEDGER');
    if (r.fit === 'eligible') return mk('Enter raffle', 'raffle.dc.html#requirements', 'primary', 'ALL BLOCKS MET');
    if (r.fit === 'partial') return mk('Fix ' + missing + (missing === 1 ? ' requirement' : ' requirements'), 'raffle.dc.html#requirements', 'warn', 'ONE STEP LEFT');
    if (r.fit === 'missing') return mk('See requirements', 'raffle.dc.html#requirements', 'warn', 'NOT ELIGIBLE YET');
    return mk('Check eligibility', 'verify.dc.html', 'ghost', 'NOT CHECKED');
  }

  window.OutlawsFX = {
    reduced: RM,
    cta: cta,
    sweep: queueSweep,
    start: function () {
      if (started) { field(); queueSweep(); return; }
      started = true;
      field();
      globalSearch();
      moreMenu();

      document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.ol-more-b');
        if (b) {
          var wrap = b.parentNode, open = wrap.hasAttribute('data-open');
          closeMore();
          if (!open) { wrap.setAttribute('data-open', ''); b.setAttribute('aria-expanded', 'true'); }
          e.preventDefault();
          return;
        }
        if (!(e.target.closest && e.target.closest('.ol-more-p'))) closeMore();
      });

      document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.ol-burger, .vx-burger');
        if (!b) return;
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });
      /* the header search field is a div trigger: give it key activation */
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var t = e.target.closest && e.target.closest('.ol-srch, .vx-search');
        if (!t || e.target.closest('input')) return;
        e.preventDefault();
        sxFocus();
      });
      window.addEventListener('resize', function () {
        /* a drawer left open while the viewport grows past the breakpoint
           would trap the page behind an invisible overlay */
        if (!narrow() && document.querySelector('.ol-drawer[data-open]')) closeMenu();
      });
      document.addEventListener('click', function (e) {
        var bell = e.target.closest && e.target.closest('button[aria-label="Notifications"]');
        if (!bell) return;
        location.href = 'notifications.dc.html';
      });
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (document.querySelector('.ol-drawer[data-open]')) closeMenu();
      });
      if (!RM) {
        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('click', onClick);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      document.addEventListener('click', onNavClick);
      document.addEventListener('pointerenter', onHover, true);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden && raf !== null) { cancelAnimationFrame(raf); raf = null; }
      });
      window.addEventListener('pageshow', function () {
        document.documentElement.removeAttribute('data-leaving');
      });
      onScroll();
      queueSweep();
    }
  };
})();
