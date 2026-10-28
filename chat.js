/* Toldo Studio — "Talk to the team" chat. Needs window.TOLDO_CONFIG.chat = {endpoint}; without it, nothing renders.
   Backend: ~/Toldo/chat/worker (Cloudflare Worker). The assistant answers first; a person joins from Slack. */
(() => {
  const CFG = window.TOLDO_CONFIG || {}, C = CFG.chat;
  if (!C || !C.endpoint || window.__toldoChat) return;
  window.__toldoChat = 1;
  const EP = C.endpoint.replace(/\/+$/, ""), B = CFG.base || "", MAIL = CFG.email || "hello@toldostudio.com";
  const KEY = "toldo-chat", OPEN_KEY = "toldo-chat-open", TTL = 30 * 864e5;
  const GREET = "Hi! Questions about your store, our services or prices? Ask here and we'll answer right away.";
  const CHIPS = [["What's in the free Mini X-Ray?"], ["How much is a store redesign?"], ["Talk to a person", 1]];
  const PERSON = "I'd like to talk to a person.";
  const mobile = () => matchMedia("(max-width:560px)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- state (survives page changes) ---------- */
  const fresh = () => ({ msgs: [], last: 0, mode: "ai", email: false, handoff: false });
  let S = (() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && s.id && Date.now() - (s.at || 0) < TTL) return s;
    } catch (e) {}
    return fresh();
  })();
  const save = () => { S.at = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  let busy = false, typing = false, pending = null, note = null, unread = 0, timer = null;

  /* ---------- DOM ---------- */
  const icon = `${B}/apple-touch-icon.png`;
  const root = document.createElement("div");
  root.className = "tc";
  root.innerHTML =
    `<button class="tc-launch" type="button" aria-controls="tc-panel" aria-expanded="false"><span class="tc-avw"><span class="tc-av"><img src="${icon}" alt="" width="40" height="40"></span><i class="tc-dot"></i></span><span class="tc-lt">Talk to the team</span><span class="tc-badge" hidden></span></button>` +
    `<section class="tc-panel" id="tc-panel" role="dialog" aria-label="Chat with Toldo Studio">` +
    `<div class="tc-band grad"></div>` +
    `<header class="tc-head"><span class="tc-avw"><span class="tc-av lg"><img src="${icon}" alt="" width="46" height="46"></span><i class="tc-dot"></i></span><div><div class="tc-name">Toldo Studio</div><div class="tc-sub">Replies right away · Austin, TX</div></div><button class="tc-x" type="button" aria-label="Close chat">×</button></header>` +
    `<div class="tc-log" role="log" aria-live="polite"></div><div class="tc-chips"></div>` +
    `<form class="tc-form"><textarea rows="1" maxlength="1500" placeholder="Write a message…" aria-label="Your message"></textarea><button class="tc-send" type="submit" aria-label="Send" disabled>→</button></form>` +
    `<p class="tc-note">Answers come from our AI assistant. Someone from the team can join anytime.</p></section>`;
  document.body.appendChild(root);
  const q = (s) => root.querySelector(s);
  const launch = q(".tc-launch"), lt = q(".tc-lt"), badge = q(".tc-badge"), log = q(".tc-log"), chips = q(".tc-chips");
  const form = q(".tc-form"), ta = q("textarea"), sendBtn = q(".tc-send");

  /* ---------- rendering ---------- */
  const fmt = (t) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\bhttps?:\/\/[^\s<]+[^\s<.,;:!?)'"]/g, (u) => {
      const own = /^https?:\/\/(www\.)?toldostudio\.com(\/|$)/.test(u);
      return `<a href="${u}"${own ? "" : ' target="_blank" rel="noopener"'}>${u.replace(/^https?:\/\/(www\.)?/, "")}</a>`;
    })
    .replace(/(^|[\s(])([\w.+-]+@[\w-]+(\.[\w-]+)+)/g, '$1<a href="mailto:$2">$2</a>')
    .replace(/\n/g, "<br>");

  function render() {
    const rows = [{ from: "assistant", text: GREET }, ...S.msgs];
    if (pending) rows.push({ from: "visitor", text: pending, pend: 1 });
    let html = "", prev = null;
    for (const m of rows) {
      if (m.from === "system") { html += `<p class="tc-sys"><span>${fmt(m.text)}</span></p>`; prev = null; continue; }
      const out = m.from === "visitor";
      if (!out && prev !== m.from) html += `<span class="tc-who">${m.from === "team" ? "Team · Toldo Studio" : "Toldo Studio"}</span>`;
      html += `<div class="tc-m ${out ? "out" : "in"}${m.pend ? " pend" : ""}">${fmt(m.text)}</div>`;
      prev = m.from;
    }
    if (typing) html += `<div class="tc-typing" aria-label="Typing"><i></i><i></i><i></i></div>`;
    if (note) html += `<p class="tc-sys err" role="alert"><span>${fmt(note)}</span></p>`;
    if (S.handoff && !S.email) html += `<div class="tc-mail"><p>Where should we reply if you step away?</p><form><input type="email" required placeholder="you@yourstore.com" aria-label="Your email" autocomplete="email"><button type="submit">Save</button></form></div>`;
    log.innerHTML = html;
    const mf = log.querySelector(".tc-mail form");
    if (mf) mf.addEventListener("submit", (e) => { e.preventDefault(); saveEmail(mf.querySelector("input").value); });
    const fresh = !S.msgs.some((m) => m.from === "visitor") && !pending;
    chips.innerHTML = fresh ? CHIPS.map(([t, h], i) => `<button class="tc-chip" type="button" data-i="${i}">${esc(t)}</button>`).join("") : "";
    log.scrollTop = log.scrollHeight;
  }

  const setBadge = () => { badge.hidden = !unread; badge.textContent = unread; };

  /* ---------- API ---------- */
  async function api(path, body) {
    const h = {};
    if (body) h["content-type"] = "application/json";
    if (S.token) h["x-chat-token"] = S.token;
    const r = await fetch(EP + path, { method: body ? "POST" : "GET", headers: h, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(j.error || "http " + r.status); e.status = r.status; throw e; }
    return j;
  }
  function merge(j) {
    let fresh = 0;
    for (const m of j.msgs || []) if (m.n > S.last) { S.msgs.push(m); S.last = m.n; if (m.from !== "visitor") fresh++; }
    S.mode = j.mode; S.email = j.email; S.handoff = j.handoff;
    save();
    return fresh;
  }
  const reset = () => { S = fresh(); save(); };

  async function send(text, human) {
    text = text.trim();
    if (!text || busy) return;
    busy = true; pending = text; note = null; typing = S.mode === "ai" && !human;
    ta.value = ""; grow(); render();
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (!S.id) { const j = await api("/v1/chat", { page: location.href }); Object.assign(S, fresh(), { id: j.id, token: j.token }); save(); }
        merge(await api(`/v1/chat/${S.id}/send`, { text, page: location.href, after: S.last, human: !!human }));
        break;
      } catch (e) {
        if (e.status === 404 && attempt === 0) { reset(); continue; } // chat expired on the server: start a new one
        note = e.status === 429 ? `This chat hit its limit. Email us at ${MAIL} and we'll reply there.` : "Couldn't send that. Check your connection and try again.";
        if (e.status !== 429) ta.value = text;
        break;
      }
    }
    busy = false; pending = null; typing = false;
    render(); grow(); schedule();
  }

  async function saveEmail(v) {
    try { merge(await api(`/v1/chat/${S.id}/email`, { email: v.trim(), after: S.last })); note = null; }
    catch (e) { note = e.status === 400 ? "That email doesn't look right. Mind checking it?" : "Couldn't save that. Try again in a moment."; }
    render();
  }

  /* ---------- polling: only while a person is involved ---------- */
  function schedule() {
    clearTimeout(timer);
    if (!S.id || S.mode === "ai" || document.hidden) return;
    timer = setTimeout(poll, isOpen() ? 3000 : 15000);
  }
  async function poll() {
    if (!S.id) return;
    if (busy) return schedule();
    try {
      const n = merge(await api(`/v1/chat/${S.id}?after=${S.last}`));
      if (n) {
        if (isOpen()) render();
        else { unread += n; setBadge(); launch.classList.remove("ping"); void launch.offsetWidth; launch.classList.add("ping"); }
      }
    } catch (e) {
      if (e.status === 404) { reset(); render(); return; }
    }
    schedule();
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && S.id && S.mode !== "ai") poll(); });

  /* ---------- open / close ---------- */
  const isOpen = () => root.classList.contains("open");
  function setOpen(v) {
    root.classList.toggle("open", v);
    launch.setAttribute("aria-expanded", String(v));
    lt.textContent = v ? "Close" : "Talk to the team";
    try { sessionStorage.setItem(OPEN_KEY, v && !mobile() ? "1" : ""); } catch (e) {}
    if (v) {
      unread = 0; setBadge(); render();
      if (!mobile()) setTimeout(() => ta.focus({ preventScroll: true }), 250);
      if (S.id && S.mode !== "ai") poll();
    }
    schedule();
  }
  launch.addEventListener("click", () => setOpen(!isOpen()));
  q(".tc-x").addEventListener("click", () => { setOpen(false); launch.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) { setOpen(false); launch.focus(); } });
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tc-chip");
    if (!b) return;
    const [t, h] = CHIPS[+b.dataset.i];
    send(h ? PERSON : t, !!h);
  });

  /* ---------- composer ---------- */
  function grow() { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 132) + "px"; sendBtn.disabled = busy || !ta.value.trim(); }
  ta.addEventListener("input", grow);
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(ta.value); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); send(ta.value); });

  /* ---------- boot ---------- */
  render();
  let wasOpen = false;
  try { wasOpen = sessionStorage.getItem(OPEN_KEY) === "1" && !mobile(); } catch (e) {}
  if (wasOpen) setOpen(true);
  else if (S.id && S.mode !== "ai") poll();
})();
