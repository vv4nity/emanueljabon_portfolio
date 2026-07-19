/* MiraFit Admin — load animations + charts (sample data) */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  function tween(el, to, dur) {
    var useComma = el.dataset.fmt === 'comma';
    if (reduced || !dur) { el.textContent = useComma ? fmt(to) : String(to); return; }
    var t0 = performance.now();
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur); p = 1 - Math.pow(1 - p, 3);
      var v = to * p;
      el.textContent = useComma ? fmt(v) : String(Math.round(v));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ── donut: 2-unit gaps, cumulative rotation ── */
  function donut() {
    var C = 2 * Math.PI * 46, gap = 5, cum = 0;
    $$('.donut .seg').forEach(function (seg) {
      var share = parseFloat(seg.dataset.share) / 100;
      var len = Math.max(0, share * C - gap);
      seg.style.strokeDashoffset = String(-(cum + gap / 2));
      seg.style.strokeDasharray = '0 ' + C;
      if (!reduced) seg.style.transition = 'stroke-dasharray 1.1s cubic-bezier(.25,.8,.3,1)';
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        seg.style.strokeDasharray = len + ' ' + (C - len);
      }); });
      cum += share * C;
    });
  }

  /* ── user growth line ── */
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var Y2026 = [8420, 9060, 9710, 10480, 11120, 11840, 12480];           // through Jul
  var Y2025 = [3180, 3650, 4090, 4560, 5010, 5440, 5890, 6310, 6780, 7240, 7690, 8120];
  var W = 560, H = 180, MAX = 16000;
  var px = function (i) { return i * (W / 11); };
  var py = function (v) { return H - (v / MAX) * H; };

  function smoothPath(vals) {
    var pts = vals.map(function (v, i) { return [px(i), py(v)]; });
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i], mx = (p0[0] + p1[0]) / 2;
      d += ' C' + mx + ',' + p0[1] + ' ' + mx + ',' + p1[1] + ' ' + p1[0] + ',' + p1[1];
    }
    return d;
  }

  function growth() {
    var svg = $('#gChart svg'); if (!svg) return;
    var grid = $('.grid', svg);
    for (var g = 0; g <= 4; g++) {
      var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ln.setAttribute('x1', 0); ln.setAttribute('x2', W);
      ln.setAttribute('y1', g * H / 4); ln.setAttribute('y2', g * H / 4);
      grid.appendChild(ln);
    }
    $('#pLast').setAttribute('d', smoothPath(Y2025));
    var now = $('#pNow'), area = $('#pAreaNow');
    now.setAttribute('d', smoothPath(Y2026));
    area.setAttribute('d', smoothPath(Y2026) + ' L' + px(Y2026.length - 1) + ',' + H + ' L0,' + H + ' Z');
    var dot = $('#pDot');
    dot.setAttribute('cx', px(Y2026.length - 1)); dot.setAttribute('cy', py(Y2026[Y2026.length - 1]));
    /* screen-reader table */
    var tb = $('#srBody');
    months.forEach(function (m, i) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + m + '</td><td>' + (Y2026[i] ? fmt(Y2026[i]) : '—') + '</td><td>' + fmt(Y2025[i]) + '</td>';
      tb.appendChild(tr);
    });

    /* crosshair + tooltip */
    var wrap = $('#gChart'), tip = $('#gTip'), xh = $('#xhair');
    wrap.addEventListener('mousemove', function (e) {
      var r = svg.getBoundingClientRect();
      var i = Math.round(((e.clientX - r.left) / r.width) * 11);
      i = Math.max(0, Math.min(11, i));
      var xpix = (px(i) / W) * r.width + (svg.getBoundingClientRect().left - wrap.getBoundingClientRect().left);
      xh.setAttribute('x1', px(i)); xh.setAttribute('x2', px(i)); xh.setAttribute('opacity', '1');
      tip.style.opacity = '1';
      tip.style.left = xpix + 'px';
      tip.style.top = '12px';
      tip.innerHTML = '<b>' + months[i] + '</b> · 2026 <b>' + (Y2026[i] ? fmt(Y2026[i]) : '—') +
        '</b> <span class="t2">· 2025 ' + fmt(Y2025[i]) + '</span>';
    });
    wrap.addEventListener('mouseleave', function () {
      tip.style.opacity = '0'; xh.setAttribute('opacity', '0');
    });
  }

  /* replayable draw-in for the growth line (runs on every dashboard visit) */
  function growthPlay() {
    var now = $('#pNow'), area = $('#pAreaNow'), dot = $('#pDot');
    if (!now || !now.getAttribute('d')) return;
    if (reduced) { area.style.opacity = '1'; dot.style.opacity = '1'; return; }
    var len = now.getTotalLength();
    now.style.transition = 'none';
    now.style.strokeDasharray = len; now.style.strokeDashoffset = len;
    area.style.transition = 'none'; area.style.opacity = '0'; dot.style.opacity = '0';
    now.getBoundingClientRect();
    now.style.transition = 'stroke-dashoffset 1.5s ease';
    area.style.transition = 'opacity .8s ease';
    requestAnimationFrame(function () { requestAnimationFrame(function () { now.style.strokeDashoffset = '0'; }); });
    setTimeout(function () { area.style.opacity = '1'; dot.style.opacity = '1'; }, 900);
  }

  /* ── plan split tick gauge: Pro 58% / Easy 42% — replayable ── */
  var gaugeTicks = null;
  function gauge() {
    var svg = $('#gauge'); if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg', N = 34, PRO = 0.58;
    var cx = 100, cy = 112, r1 = 62, r2 = 90;
    if (!gaugeTicks) {
      gaugeTicks = [];
      for (var i = 0; i < N; i++) {
        var a = Math.PI - (i / (N - 1)) * Math.PI;
        var ln = document.createElementNS(NS, 'line');
        ln.setAttribute('x1', cx + r1 * Math.cos(a)); ln.setAttribute('y1', cy - r1 * Math.sin(a));
        ln.setAttribute('x2', cx + r2 * Math.cos(a)); ln.setAttribute('y2', cy - r2 * Math.sin(a));
        ln.setAttribute('stroke', '#e7eee8'); ln.setAttribute('stroke-width', '3.4'); ln.setAttribute('stroke-linecap', 'round');
        svg.appendChild(ln);
        gaugeTicks.push(ln);
      }
    }
    gaugeTicks.forEach(function (ln, i) {
      var color = i < Math.round(N * PRO) ? '#059669' : '#4f46e5';
      if (reduced) { ln.setAttribute('stroke', color); return; }
      ln.setAttribute('stroke', '#e7eee8');
      setTimeout(function () { ln.setAttribute('stroke', color); }, 300 + i * 28);
    });
  }

  /* ── users data (sample) ── */
  var USERS = [
    { id: 1, name: 'Alex Rivera', mail: 'alex.r@gmail.com', img: 'img/alex.jpg', plan: 'Pro', goal: 'Body Toning', bt: 'Mesomorph', form: 88, last: '2 min ago', st: 'ok', joined: 'Mar 2026', wdelta: '−2.4 kg', bmi: '23.1', workouts: 26, streak: 12, week: [70, 85, 60, 90, 95, 30, 88] },
    { id: 2, name: 'Marco Dela Peña', mail: 'marco.dp@gmail.com', ini: 'MD', tint: 'g', plan: 'Pro', goal: 'Endurance', bt: 'Ectomorph', form: 91, last: '12 min ago', st: 'ok', joined: 'Jan 2026', wdelta: '−1.1 kg', bmi: '21.4', workouts: 41, streak: 18, week: [90, 80, 85, 75, 95, 60, 70] },
    { id: 3, name: 'Gienel Mateo', mail: 'gienel.m@gmail.com', img: 'img/t-gienel.jpg', plan: 'Easy', goal: 'Weight Loss', bt: 'Endomorph', form: 81, last: '26 min ago', st: 'ok', joined: 'Apr 2026', wdelta: '−3.8 kg', bmi: '27.2', workouts: 19, streak: 6, week: [60, 0, 75, 80, 70, 85, 65] },
    { id: 4, name: 'Mika Santos', mail: 'mika.san@yahoo.com', ini: 'MS', tint: 'v', plan: 'Pro', goal: 'Muscle Gain', bt: 'Ectomorph', form: 84, last: '1 hr ago', st: 'ok', joined: 'Feb 2026', wdelta: '+1.9 kg', bmi: '20.8', workouts: 33, streak: 9, week: [85, 70, 90, 0, 80, 75, 95] },
    { id: 5, name: 'Rhea Villar', mail: 'rhea.v@gmail.com', ini: 'RV', tint: 'g', plan: 'Easy', goal: 'Body Toning', bt: 'Mesomorph', form: 79, last: '2 hr ago', st: 'ok', joined: 'May 2026', wdelta: '−1.6 kg', bmi: '24.0', workouts: 14, streak: 4, week: [50, 65, 0, 70, 80, 60, 75] },
    { id: 6, name: 'Jhon Kaiser', mail: 'jhon.kai@gmail.com', img: 'img/t-jhon.jpg', plan: 'Easy', goal: 'Posture Fix', bt: 'Mesomorph', form: 76, last: '5 hr ago', st: 'idle', joined: 'Jun 2026', wdelta: '−0.4 kg', bmi: '24.9', workouts: 8, streak: 0, week: [40, 60, 0, 0, 55, 70, 0] },
    { id: 7, name: 'Joana Cruz', mail: 'joanacruz@gmail.com', ini: 'JC', tint: 'a', plan: 'Pro', goal: 'Endurance', bt: 'Ectomorph', form: 90, last: 'Yesterday', st: 'idle', joined: 'Dec 2025', wdelta: '−2.9 kg', bmi: '22.3', workouts: 52, streak: 0, week: [80, 90, 85, 70, 0, 0, 0] },
    { id: 8, name: 'Liam Ford', mail: 'liam.ford@outlook.com', ini: 'LF', tint: 'v', plan: 'Pro', goal: 'Muscle Gain', bt: 'Mesomorph', form: 86, last: '3 days ago', st: 'idle', joined: 'Oct 2025', wdelta: '+3.2 kg', bmi: '23.6', workouts: 61, streak: 0, week: [75, 80, 0, 0, 0, 65, 0] },
    { id: 9, name: 'Candido James', mail: 'cjames@outlook.com', img: 'img/t-candido.jpg', plan: 'Easy', goal: 'Weight Loss', bt: 'Endomorph', form: 72, last: '6 days ago', st: 'risk', joined: 'May 2026', wdelta: '−0.9 kg', bmi: '28.4', workouts: 7, streak: 0, week: [45, 0, 0, 0, 0, 0, 0] },
    { id: 10, name: 'Precious Uy', mail: 'precious.uy@gmail.com', ini: 'PU', tint: 'a', plan: 'Easy', goal: 'Weight Loss', bt: 'Endomorph', form: 68, last: '8 days ago', st: 'risk', joined: 'Jun 2026', wdelta: '−0.6 kg', bmi: '29.1', workouts: 4, streak: 0, week: [0, 30, 0, 0, 0, 0, 0] }
  ];
  var TINT = { g: 'background:#dcf1e6;color:#065f46', v: 'background:#e5e0f7;color:#4f46e5', a: 'background:#fdecd2;color:#b45309' };
  var BT = { Mesomorph: 'bt-me', Ectomorph: 'bt-ec', Endomorph: 'bt-en' };
  var ST = { ok: '<i class="chip st ok">● Active</i>', idle: '<i class="chip st idle">● Idle</i>', risk: '<i class="chip st risk">● At risk</i>' };
  var uQuery = '';

  function avatarHTML(u, big) {
    return u.img
      ? '<img src="' + u.img + '" alt="">'
      : '<span class="uin' + (big ? ' big' : '') + '" style="' + TINT[u.tint] + '">' + u.ini + '</span>';
  }
  function fmbarHTML(p) {
    return '<span class="fmbar' + (p < 80 ? ' low' : '') + '"><i style="--p:' + p + '%"></i></span>' + p + '%';
  }

  function renderUsers() {
    var tb = $('#uBody'); if (!tb) return;
    var live = USERS.filter(function (u) { return !u.deleted; });
    var shown = live.filter(function (u) {
      return (u.name + ' ' + u.mail).toLowerCase().indexOf(uQuery) !== -1;
    });
    tb.innerHTML = shown.map(function (u) {
      return '<tr data-id="' + u.id + '" tabindex="0">' +
        '<td><span class="uc">' + avatarHTML(u) + '<span><b>' + u.name + '</b><s>' + u.mail + '</s></span></span></td>' +
        '<td><i class="chip ' + u.plan.toLowerCase() + '">' + u.plan + '</i></td>' +
        '<td>' + u.goal + '</td>' +
        '<td><i class="chip bt ' + BT[u.bt] + '">' + u.bt + '</i></td>' +
        '<td class="num">' + fmbarHTML(u.form) + '</td>' +
        '<td>' + u.last + '</td>' +
        '<td>' + ST[u.st] + '</td>' +
        '<td><span class="trash" title="Delete user" role="button" aria-label="Delete ' + u.name + '">✕</span></td>' +
      '</tr>';
    }).join('');
    var c = $('#uCount');
    if (c) c.textContent = 'Showing ' + shown.length + ' of 12,4' + (80 - (USERS.length - live.length)) + ' users';

    var del = USERS.filter(function (u) { return u.deleted; });
    var dc = $('#delCard'), db = $('#delBody');
    if (dc) {
      dc.hidden = !del.length;
      db.innerHTML = del.map(function (u) {
        return '<div class="delrow" data-id="' + u.id + '">' +
          '<span class="uc">' + avatarHTML(u) + '<span><b>' + u.name + '</b><s>Deleted just now · was last active ' + u.last + '</s></span></span>' +
          '<span class="restore" role="button">↺ Restore</span></div>';
      }).join('');
    }
  }

  /* ── drawer ── */
  function openDrawer(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0]; if (!u) return;
    $('#dAvatar').innerHTML = avatarHTML(u, true);
    $('#dName').textContent = u.name;
    $('#dMail').textContent = u.mail;
    $('#dChips').innerHTML = '<i class="chip ' + u.plan.toLowerCase() + '">' + u.plan + ' Plan</i>' +
      '<i class="chip bt ' + BT[u.bt] + '">' + u.bt + '</i>' +
      '<i class="chip goal">◎ ' + u.goal + '</i>' + ST[u.st];
    $('#dLast').innerHTML = '<b>Last active:</b> ' + u.last +
      (u.deleted ? ' · <em class="delmark">deleted account</em>' : '');
    $('#dStats').innerHTML = [
      ['Avg Form', u.form + '%'], ['Workouts', u.workouts], ['Day Streak', u.streak],
      ['Weight Δ', u.wdelta], ['BMI', u.bmi], ['Joined', u.joined]
    ].map(function (s) { return '<div class="dstat"><s>' + s[0] + '</s><b>' + s[1] + '</b></div>'; }).join('');
    var bars = $('#dBars');
    bars.classList.remove('grow');
    bars.innerHTML = u.week.map(function (h, i) {
      return '<i style="--h:' + (h || 6) + '%;transition-delay:' + (reduced ? 0 : 120 + i * 65) + 'ms" class="' + (h ? '' : 'mut') + '"></i>';
    }).join('');
    bars.getBoundingClientRect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { bars.classList.add('grow'); }); });
    $('#dActions').innerHTML = u.deleted
      ? '<span class="dbtn restorebtn" data-act="restore">↺ Restore User</span><p class="anote">Restoring brings back the plan, history and streaks exactly as they were.</p>'
      : '<span class="dbtn delbtn" data-act="delete">✕ Delete User</span><p class="anote">Soft delete — recoverable from “Recently Deleted” for 30 days.</p>';
    $('#dActions').dataset.id = u.id;
    $('#drawer').hidden = false; $('#scrim').hidden = false;
    requestAnimationFrame(function () { document.body.classList.add('drawer-open'); });
  }
  function closeDrawer() {
    document.body.classList.remove('drawer-open');
    setTimeout(function () { $('#drawer').hidden = true; $('#scrim').hidden = true; }, reduced ? 0 : 280);
  }

  /* ── delete / restore + toast ── */
  var toastTimer;
  function toast(msg, actLabel, actFn) {
    var t = $('#toast'); $('#toastMsg').textContent = msg;
    var a = $('#toastAct'); a.textContent = actLabel || ''; a.onclick = actFn || null;
    t.hidden = false; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.hidden = true; }, 300); }, 4200);
  }
  function setDeleted(id, val) {
    USERS.forEach(function (u) { if (u.id === id) u.deleted = val; });
    renderUsers();
  }
  function deleteUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    setDeleted(id, true);
    toast(u.name + ' deleted — recoverable for 30 days', 'Undo', function () { setDeleted(id, false); toast(u.name + ' restored'); });
  }
  function restoreUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0];
    setDeleted(id, false);
    toast(u.name + ' restored — plan and history recovered');
  }

  function wireUsers() {
    var tb = $('#uBody'); if (!tb) return;
    tb.addEventListener('click', function (e) {
      var tr = e.target.closest('tr'); if (!tr) return;
      var id = parseInt(tr.dataset.id, 10);
      if (e.target.closest('.trash')) { deleteUser(id); return; }
      openDrawer(id);
    });
    tb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var tr = e.target.closest('tr'); if (tr) openDrawer(parseInt(tr.dataset.id, 10)); }
    });
    $('#delBody').addEventListener('click', function (e) {
      var row = e.target.closest('.delrow'); if (!row) return;
      var id = parseInt(row.dataset.id, 10);
      if (e.target.closest('.restore')) { restoreUser(id); return; }
      openDrawer(id);
    });
    $('#dActions').addEventListener('click', function (e) {
      var btn = e.target.closest('.dbtn'); if (!btn) return;
      var id = parseInt($('#dActions').dataset.id, 10);
      closeDrawer();
      if (btn.dataset.act === 'delete') deleteUser(id); else restoreUser(id);
    });
    $('#dClose').addEventListener('click', closeDrawer);
    $('#scrim').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); closeModel(); } });
    var s = $('#v-users .search input');
    if (s) s.addEventListener('input', function () { uQuery = s.value.trim().toLowerCase(); renderUsers(); });
  }

  /* ── model status modal ── */
  function openModel() {
    var m = $('#mModal'); if (!m) return;
    m.hidden = false;
    requestAnimationFrame(function () {
      m.classList.add('show');
      $$('.abar', m).forEach(function (el, i) {
        el.style.setProperty('--w', el.dataset.pct + '%');
        el.classList.remove('in');
        setTimeout(function () { el.classList.add('in'); }, reduced ? 0 : 300 + i * 140);
      });
    });
  }
  function closeModel() {
    var m = $('#mModal'); if (!m || m.hidden) return;
    m.classList.remove('show');
    setTimeout(function () { m.hidden = true; }, reduced ? 0 : 260);
  }
  function wireModel() {
    var btn = $('.mbtn'), m = $('#mModal');
    if (btn) btn.addEventListener('click', openModel);
    if ($('#mClose')) $('#mClose').addEventListener('click', closeModel);
    if (m) m.addEventListener('click', function (e) { if (e.target === m) closeModel(); });
    var hc = $('#hcBtn');
    if (hc) hc.addEventListener('click', function () {
      hc.classList.add('busy'); hc.textContent = 'Running checks…';
      setTimeout(function () {
        hc.classList.remove('busy'); hc.textContent = 'Run Health Check';
        toast('All systems healthy — 6/6 checks passed ✓');
      }, reduced ? 0 : 1400);
    });
  }

  /* ── view switching ── */
  function animateView(view) {
    $$('.rise', view).forEach(function (el, i) {
      el.classList.remove('go');
      setTimeout(function () { el.classList.add('go'); }, reduced ? 0 : 60 + i * 90);
    });
    $$('.gbars', view).forEach(function (el) {
      el.classList.remove('in');
      setTimeout(function () { el.classList.add('in'); }, reduced ? 0 : 350);
    });
    $$('.abar, .fbar', view).forEach(function (el, i) {
      if (el.dataset.pct) el.style.setProperty('--w', el.dataset.pct + '%');
      el.classList.remove('in');
      setTimeout(function () { el.classList.add('in'); }, reduced ? 0 : 400 + i * 150);
    });
    $$('[data-tween]', view).forEach(function (el, i) {
      var to = parseFloat(el.dataset.tween);
      setTimeout(function () { tween(el, to, 1100); }, reduced ? 0 : 250 + i * 120);
    });
  }

  function showView(name) {
    $$('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'v-' + name); });
    $$('#nav a').forEach(function (a) { a.classList.toggle('on', a.dataset.view === name); });
    var link = $('#nav a[data-view="' + name + '"]');
    var title = $('#viewTitle'); if (title && link) title.textContent = link.dataset.title;
    var view = $('#v-' + name);
    if (view) animateView(view);
    if (name === 'dashboard') { growthPlay(); donut(); gauge(); }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ── auto-play demo mode (?demo=1 or window.MF_DEMO) ── */
  var DEMO = /[?&]demo=1/.test(location.search) || !!window.MF_DEMO;
  var demoTimers = [], demoOn = false, cursor, replayBtn;

  function DT(f, t) { demoTimers.push(setTimeout(f, t)); }
  function demoClear() { demoTimers.forEach(clearTimeout); demoTimers = []; }

  function demoBuild() {
    cursor = document.createElement('div'); cursor.className = 'demo-cursor';
    document.body.appendChild(cursor);
    replayBtn = document.createElement('div'); replayBtn.id = 'demoReplay';
    replayBtn.hidden = true; replayBtn.textContent = '↻ Replay demo';
    replayBtn.addEventListener('click', function (e) {
      e.stopPropagation(); replayBtn.hidden = true;
      closeDrawer(); closeModel(); showView('dashboard'); demoRun();
    });
    document.body.appendChild(replayBtn);
    /* a real (trusted) interaction hands control to the viewer */
    document.addEventListener('pointerdown', function (e) {
      if (demoOn && e.isTrusted && e.target !== replayBtn) demoStop();
    }, true);
  }

  function demoSay(label) {
    try { if (window.parent !== window) window.parent.postMessage({ mfDemo: label }, '*'); } catch (e) {}
  }

  function demoStop() {
    demoOn = false; demoClear();
    if (cursor) cursor.style.opacity = '0';
    if (replayBtn) replayBtn.hidden = false;
    demoSay('takeover');
  }

  function curTo(el) {
    var r = el.getBoundingClientRect();
    cursor.style.left = (r.left + r.width / 2) + 'px';
    cursor.style.top = (r.top + r.height / 2) + 'px';
  }

  function demoRun() {
    demoOn = true;
    cursor.style.opacity = '1';
    demoSay('Dashboard tour — users, goals and detection accuracy count up while the growth line draws itself');
    var t = 0;
    function step(delay, selFn, label) {
      t += delay;
      DT(function () {
        if (!demoOn) return;
        var el = selFn(); if (!el) return;
        if (label) demoSay(label);
        /* scroll only this (iframe) window — scrollIntoView would also
           scroll the embedding page's viewport on every step */
        var r = el.getBoundingClientRect();
        var top = r.top + window.pageYOffset - (window.innerHeight - r.height) / 2;
        window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
        DT(function () {
          if (!demoOn) return;
          curTo(el);
          DT(function () {
            if (!demoOn) return;
            cursor.classList.add('tap');
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            setTimeout(function () { cursor.classList.remove('tap'); }, 280);
          }, 720);
        }, 420);
      }, t);
    }
    step(4200, function () { return $('.mbtn'); },
      'Opening the AI detection model’s status — uptime, accuracy and release history');
    step(2400, function () { return $('#hcBtn'); },
      'Running a live health check on the vision pipeline');
    step(2800, function () { return $('#mClose'); },
      'All systems healthy — 6/6 checks passed');
    step(1500, function () { return $('#nav a[data-view="users"]'); },
      'Into Users — every member, their plan, goal, body type and form average');
    step(2400, function () { return $('#uBody tr'); },
      'Opening a member profile — stats, streaks and their last 7 days of training');
    step(3600, function () { return $('#dClose'); });
    step(1500, function () { return $('#uBody tr[data-id="9"] .trash'); },
      'Soft-deleting a churned account…');
    step(3000, function () { return $('.delrow .restore'); },
      '…and restoring it in one click — plan, history and streaks intact');
    step(2800, function () { return $('#nav a[data-view="dashboard"]'); },
      'Back to the overview — the loop restarts');
    t += 4600;
    DT(function () { if (demoOn) { demoClear(); demoRun(); } }, t);          // loop
  }

  function init() {
    growth(); gauge();
    renderUsers(); wireUsers(); wireModel();
    showView('dashboard');
    $$('#nav a').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); showView(a.dataset.view); });
    });
    $$('[data-goto]').forEach(function (el) {
      el.addEventListener('click', function () { showView(el.dataset.goto); });
    });
    if (DEMO) { demoBuild(); demoRun(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
