// Harbour Jackpot landing page: renders every section from data.json (all editable content lives there)
// and wires the countdown, FAQ accordion, mobile menu and footer accordions.
const A = (p) => `assets/${p}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rich = (segs) => segs.map((s) => (s.highlight ? `<span class="y">${esc(s.text)}</span>` : esc(s.text))).join('');
const ico = (name, cls = '') => `<img class="${cls}" src="${A('icons/' + name)}" alt="" aria-hidden="true">`;
const pic = (d, m, alt, cls = '', bp = 1280) =>
  `<picture class="${cls}"><source media="(min-width:${bp}px)" srcset="${A(d)}"><img src="${A(m)}" alt="${esc(alt)}"></picture>`;
const btn = (c, extra = '') => `<a class="btn btn--primary ${extra}" href="${esc(c.cta.href)}">${esc(c.cta.label)}</a>`;
const heading = (id, title, sub, cls = '') =>
  `<div class="sh ${cls}"><h2 id="${id}">${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;

/* ---------- section templates ---------- */
const header = (c) => `
<header class="hdr"><div class="hdr__in">
  <a class="hdr__logo" href="#home">${pic('img/logo-desktop.png', 'img/logo-mobile.png', c.site.logoAlt)}</a>
  <button class="hdr__burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="${esc(c.navigation.menuLabel)}">${ico('menu.svg')}</button>
  <nav class="hdr__nav" id="nav" aria-label="Main">
    <ul>${c.navigation.items.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join('')}</ul>
    <button class="lang" type="button" aria-label="${esc(c.navigation.languageLabel)}">${ico('globe-header.svg')}<span>${esc(c.navigation.language)}</span></button>
    ${btn(c, 'hdr__cta')}
  </nav>
</div></header>`;

const hero = (c) => `
<section class="hero" id="home" aria-labelledby="hero-title">
  <div class="hero__bg">${pic('img/hero-desktop.png', 'img/hero-mobile.png', c.hero.imageAlt)}</div>
  <picture class="hero__fade hero__fade--top"><source media="(min-width:1280px)" srcset="${A('img/hero-fade-top.png')}"><img src="${A('img/hero-m-fade-top.png')}" alt=""></picture>
  <picture class="hero__fade hero__fade--bot"><source media="(min-width:1280px)" srcset="${A('img/hero-fade-bottom.png')}"><img src="${A('img/hero-m-fade-bottom.png')}" alt=""></picture>
  <div class="hero__in">
    <div class="hero__copy">
      <h1 id="hero-title"><span class="hero__t">${esc(c.hero.title)}</span><span class="gold-up hero__amt">${esc(c.jackpot.amount)}</span></h1>
      <p class="hero__tag">${rich(c.hero.tagline)}</p>
      ${btn(c, 'hero__cta')}
    </div>
    <p class="hero__legal">${esc(c.hero.legal)}</p>
  </div>
</section>`;

const unit = (k, label) => `<div class="cd__u cd__u--${k}"><span class="cd__n" data-cd="${k}" aria-hidden="true">00</span><span class="cd__l" aria-hidden="true">${esc(label)}</span></div>`;
const countdown = (c, cls = '') => {
  const L = c.countdown.labels;
  const sep = `<picture class="cd__sep" aria-hidden="true"><source media="(min-width:1280px)" srcset="${A('icons/colon.svg')}"><img src="${A('icons/colon-m.svg')}" alt=""></picture>`;
  return `
<section class="cd ${cls}" aria-labelledby="${cls}-h">
  <div class="cd__in">
    <div class="cd__info"><h2 id="${cls}-h">${esc(c.countdown.title)}</h2><p>${rich(c.countdown.subtitle)}</p></div>
    <div class="cd__timer" role="timer" aria-label="${esc(c.countdown.ariaLabel)}">
      <span class="sr" data-cd-sr></span>
      ${unit('days', L.days)}${sep}${unit('hours', L.hours)}${sep}${unit('min', L.minutes)}${sep}${unit('sec', L.seconds)}
    </div>
    ${btn(c, 'cd__cta')}
  </div>
</section>`;
};

const howTo = (c) => `
<section class="sec how" id="how-to-play" aria-labelledby="how-h">
  ${heading('how-h', c.howToPlay.title, c.howToPlay.subtitle, 'sh--c')}
  <ol class="how__list">${c.howToPlay.steps.map((s, i) => `
    <li class="step step--${i + 1}">
      <div class="step__art"><img class="step__img" src="${A('img/step-' + (i + 1) + '.png')}" alt="${esc(s.imageAlt)}"></div>
      <span class="step__ov step__ov--css" aria-hidden="true"></span>${i === 1 ? ico('step-2-overlay.svg', 'step__ov step__ov--svg') : i === 2 ? ico('step-3-overlay-m.svg', 'step__ov step__ov--svg') : ''}
      <div class="step__txt"><span class="step__n">${esc(s.number)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
    </li>`).join('')}</ol>
</section>`;

const prizes = (c) => `
<section class="sec prz" id="prizes" aria-labelledby="prz-h">
  <div class="prz__head">${heading('prz-h', c.prizes.title, c.prizes.subtitle)}${btn(c, 'prz__cta')}</div>
  <ul class="prz__grid">${c.prizes.tiers.map((t, i) => `
    <li class="prize t${i}">
      <div class="prize__top"><h3>${esc(t.name)}</h3><p>${esc(c.prizes.blurb)}</p></div>
      <div class="prize__vis">${i < 3 ? `<span class="prize__crop"><img src="${A('img/prize-sprite.png')}" alt="${esc(t.imageAlt)}"></span>` : `<img class="prize__art" src="${A('icons/prize-4th.svg')}" alt="${esc(t.imageAlt)}">`}</div>
      <p class="prize__amt gold-down">${esc(t.amount)}</p>
    </li>`).join('')}</ul>
</section>`;

const results = (c) => { const r = c.latestResults; return `
<section class="sec res" id="results" aria-labelledby="res-h">
  ${heading('res-h', r.title, r.subtitle, 'sh--c')}
  <div class="res__row">
    <article class="rc" aria-label="${esc(r.drawNumber)}">
      <div class="rc__top">
        <div class="rc__id"><p class="rc__date">${esc(r.drawDate)}</p><p class="rc__draw">${esc(r.drawNumber)}</p></div>
        <ol class="rc__balls" aria-label="${esc(r.numbersLabel)}">${r.numbers.map((b) => `<li class="ball">${ico('ball.svg')}<span>${esc(b)}</span></li>`).join('')}</ol>
      </div>
      <div class="rule rule--m" aria-hidden="true"><img src="${A('icons/rule-results-m.svg')}" alt=""></div>
      <div class="rc__bot"><p class="rc__win"><span class="y">${esc(r.winners)} </span>${esc(r.winnersLabel)}</p>
        <a class="btn btn--outline" href="${esc(r.viewAll.href)}">${esc(r.viewAll.label)}</a></div>
    </article>
    <aside class="nd" aria-labelledby="nd-h">
      <h3 id="nd-h">${esc(c.countdown.nextDrawTitle)}</h3><p data-next-draw>Saturday</p>
      ${btn(c, 'nd__cta')}
    </aside>
  </div>
</section>`; };

const faq = (c) => `
<section class="sec faq" id="faq" aria-labelledby="faq-h">
  <h2 id="faq-h">${esc(c.faq.title)}</h2>
  <div class="faq__list">${c.faq.items.map((it, i) => `
    <div class="fi" data-open="${it.open ? 'true' : 'false'}">
      <h3><button class="fi__q" type="button" id="fq-${i}" aria-expanded="${it.open ? 'true' : 'false'}" aria-controls="fa-${i}">
        <span>${esc(it.question)}</span><span class="fi__ic" aria-hidden="true">${ico('plus.svg', 'fi__plus')}${ico('minus.svg', 'fi__minus fi__minus--d')}${ico('minus-m.svg', 'fi__minus fi__minus--m')}</span></button></h3>
      <div class="fi__a" id="fa-${i}" role="region" aria-labelledby="fq-${i}" ${it.open ? '' : 'hidden'}><p>${esc(it.answer)}</p></div>
    </div>`).join('')}</div>
</section>`;

const footer = (c) => {
  const f = c.footer;
  const group = (g) => `
    <div class="fg fg--${g.id}" id="${esc(g.id)}">
      <h3><button class="fg__btn" type="button" data-fg="${g.id}" aria-expanded="false" aria-controls="fgb-${g.id}"><span>${esc(g.title)}</span>${ico('chevron.svg', 'fg__chev')}</button></h3>
      <ul class="fg__body" id="fgb-${g.id}">${g.items.map((i) => `<li>${i.href ? `<a href="${esc(i.href)}">${esc(i.label)}</a>` : esc(i.label)}</li>`).join('')}</ul>
    </div>`;
  return `
<footer class="ft" aria-label="Site footer">
  <div class="rule" aria-hidden="true"><picture><source media="(min-width:1280px)" srcset="${A('icons/rule-footer-top.svg')}"><img src="${A('icons/rule-footer-top-m.svg')}" alt=""></picture></div>
  <div class="ft__in">
    <div class="ft__groups">${f.groups.map(group).join('')}</div>
    <div class="ft__row">
      <div class="follow"><h3>${esc(f.followTitle)}</h3><ul>${f.social.map((s, i) => `<li><a href="${esc(s.href)}" aria-label="${esc(s.label)}">${ico('social-' + (i + 1) + '.svg')}</a></li>`).join('')}</ul></div>
      <div class="pay"><h3>${esc(f.paymentsTitle)}</h3><ul>${f.payments.map((p, i) => `<li><img src="${A('img/pay-' + String(i + 1).padStart(2, '0') + '.png')}" alt="${esc(p)}" width="61" height="37"></li>`).join('')}</ul></div>
    </div>
    <section class="ft__rg" id="safer-gambling" aria-labelledby="rg-h">
      <h3 id="rg-h">${esc(c.saferGambling.title)}</h3><p>${esc(c.saferGambling.text)}</p>${c.saferGambling.support ? `<p>${esc(c.saferGambling.support)}</p>` : ''}
    </section>
    <div class="ft__bot">
      <div class="rule" aria-hidden="true"><picture><source media="(min-width:1280px)" srcset="${A('icons/rule-footer-bottom.svg')}"><img src="${A('icons/rule-footer-bottom-m.svg')}" alt=""></picture></div>
      <div class="ft__copy">
        <div class="ft__brand">${pic('img/logo-desktop.png', 'img/logo-mobile.png', c.site.logoAlt)}<p>${esc(f.copyright.prefix)}<span class="muted">${esc(f.copyright.name)}</span>${esc(f.copyright.suffix)}</p></div>
        <div class="ft__opts">
          <button class="opt" type="button" aria-label="Language: ${esc(f.language)}">${ico('globe.svg')}<span>${esc(f.language)}</span></button>
          <button class="opt" type="button" aria-label="Currency: ${esc(f.currency)}"><span class="opt__eur">${ico('euro-streamline-core.svg')}</span><span>${esc(f.currency)}</span></button>
          <button class="opt opt--a11y" type="button" aria-label="${esc(f.accessibilityLabel)}"><span class="opt__ring">${ico('accessibility-original.svg')}</span></button>
        </div>
      </div>
      ${f.licence?.text ? `<p class="ft__lic">${esc(f.licence.text)}</p>` : ''}
    </div>
  </div>
</footer>`;
};

/* ---------- countdown ---------- */
// Offset (ms) between wall-clock time in `tz` and UTC at timestamp `ts`.
const tzOffset = (ts, tz) => {
  const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    .formatToParts(new Date(ts)).forEach((p) => (o[p.type] = +p.value));
  return Date.UTC(o.year, o.month - 1, o.day, o.hour, o.minute, o.second) - Math.floor(ts / 1000) * 1000;
};
const nextDraw = (now, { timezone: tz, weekday, time, nextDrawOverride }) => {
  // A one-off date in data.json wins while it is still in the future; otherwise use the weekly schedule.
  const fixed = nextDrawOverride ? Date.parse(nextDrawOverride) : NaN;
  if (!Number.isNaN(fixed) && fixed > now) return fixed;
  const [hour, minute] = String(time).split(':').map(Number);
  const off = tzOffset(now, tz), l = new Date(now + off);
  const at = (add) => { const wall = Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate() + add, hour, minute); return wall - tzOffset(wall - off, tz); };
  const add = (weekday - l.getUTCDay() + 7) % 7;
  let t = at(add);
  if (t <= now) t = at(add + 7);
  return t;
};
const drawLabel = (t, tz) => {
  const p = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).formatToParts(new Date(t)).forEach((x) => (p[x.type] = x.value));
  return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
};
const initCountdown = (c) => {
  const cfg = c.draw, pad = (n) => String(n).padStart(2, '0');
  const nd = document.querySelector('[data-next-draw]');
  if (nd) nd.textContent = drawLabel(nextDraw(Date.now(), cfg), cfg.timezone);
  let lastMin = -1;
  const tick = () => {
    const s = Math.max(0, Math.floor((nextDraw(Date.now(), cfg) - Date.now()) / 1000));
    const v = { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, min: Math.floor(s / 60) % 60, sec: s % 60 };
    document.querySelectorAll('[data-cd]').forEach((el) => (el.textContent = pad(v[el.dataset.cd])));
    if (v.min !== lastMin) { // screen-reader text refreshed once a minute, never per second
      lastMin = v.min;
      const txt = `${v.days} days, ${v.hours} hours, ${v.min} minutes`;
      document.querySelectorAll('[data-cd-sr]').forEach((el) => (el.textContent = txt));
    }
  };
  tick(); setInterval(tick, 1000);
};

/* ---------- interactions ---------- */
const initFaq = () => document.querySelectorAll('.fi').forEach((fi) => {
  const b = fi.querySelector('.fi__q'), p = fi.querySelector('.fi__a');
  b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open); p.hidden = !open; fi.dataset.open = open;
  });
});
const initMenu = () => {
  const b = document.querySelector('.hdr__burger'), nav = document.getElementById('nav'), hdr = document.querySelector('.hdr');
  const set = (o) => { b.setAttribute('aria-expanded', o); hdr.dataset.menu = o; };
  b.addEventListener('click', () => set(b.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') { set(false); b.focus(); } });
};
const initFooter = () => {
  const mq = matchMedia('(min-width:1280px)'), btns = document.querySelectorAll('.fg__btn');
  btns.forEach((b) => b.addEventListener('click', () => { if (!mq.matches) b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'); }));
  const sync = () => btns.forEach((b) => {
    if (mq.matches) { b.removeAttribute('aria-expanded'); b.removeAttribute('aria-controls'); b.tabIndex = -1; }
    else { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'fgb-' + b.dataset.fg); b.tabIndex = 0; }
  });
  mq.addEventListener('change', sync); sync();
};

/* Touch screens have no hover: tapping a How to Play or Prize card shows its hover state (.is-tapped);
   tapping anywhere else clears it. Mouse input is left to CSS :hover. */
function initStepTap() {
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const card = e.target.closest('.step, .prize');
    document.querySelectorAll('.is-tapped').forEach((s) => { if (s !== card) s.classList.remove('is-tapped'); });
    card?.classList.add('is-tapped');
  }, { passive: true });
}

/* ---------- data tokens ---------- */
// Strings in data.json may contain {jackpot}, {ticketPrice}, {drawDay}, {drawDayUpper} and {drawTime}.
// They are filled once from the jackpot/draw blocks, so e.g. changing draw.time updates every mention.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fillTokens = (data) => {
  const day = DAYS[data.draw.weekday] ?? '';
  const tokens = { jackpot: data.jackpot.amount, ticketPrice: data.jackpot.ticketPrice, drawDay: day, drawDayUpper: day.toUpperCase(), drawTime: data.draw.time };
  const walk = (v) => typeof v === 'string' ? v.replace(/\{(\w+)\}/g, (m, k) => (k in tokens ? tokens[k] : m))
    : Array.isArray(v) ? v.map(walk)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v;
  return walk(data);
};

/* ---------- boot ---------- */
try {
  const res = await fetch('data.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('HTTP ' + res.status + ' loading data.json');
  const c = fillTokens(await res.json());
  document.title = c.site.title;
  document.querySelector('meta[name=description]')?.setAttribute('content', c.site.description);
  document.getElementById('app').innerHTML =
    header(c) + `<main id="main">${hero(c)}${countdown(c, 'cd--top')}${howTo(c)}${prizes(c)}${results(c)}${faq(c)}${countdown(c, 'cd--bottom')}</main>` + footer(c);
  initCountdown(c); initFaq(); initMenu(); initFooter(); initStepTap();
} catch (e) {
  document.getElementById('app').innerHTML = '<p class="noscript">Content could not be loaded. Serve this folder over HTTP (see README.md) and check that data.json is valid JSON.</p>';
  console.error(e);
}
