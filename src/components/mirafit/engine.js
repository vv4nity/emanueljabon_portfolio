// Animation engine for the embedded MiraFit demo stages.
// Adapted from the original case study's app.js: wrapped in an init function
// with full teardown so it survives React mount/unmount cycles.
export function initMiraFitDemo(){
  var _ios = [], _cleanups = [], dwSliderIv = null;
  var LOGO="/mirafit-study/img/logo.png";
  document.querySelectorAll("img[data-logo]").forEach(function(i){i.src=LOGO;});
  var MFIMG = {"expushup": "/mirafit-study/img/ex-pushup.jpg", "excurl": "/mirafit-study/img/ex-curl.jpg", "express": "/mirafit-study/img/ex-press.jpg", "explank": "/mirafit-study/img/ex-plank.jpg", "meal": "/mirafit-study/img/meals.png", "scanmodel": "/mirafit-study/img/scanmodel.jpg", "storybg": "/mirafit-study/img/storybg.jpg", "lockbg": "/mirafit-study/img/lockbg.jpg", "alex": "/mirafit-study/img/alex.jpg", "temanuel": "/mirafit-study/img/t-emanuel.jpg", "tcandido": "/mirafit-study/img/t-candido.jpg", "tgienel": "/mirafit-study/img/t-gienel.jpg", "tjhon": "/mirafit-study/img/t-jhon.jpg"};
  window.MFIMG = MFIMG;
  document.querySelectorAll('img[data-img]').forEach(function(i){ i.src = MFIMG[i.dataset.img]; });
  var dph = document.getElementById('dwPhoto'); if (dph) dph.src = MFIMG.expushup;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(id){ return document.getElementById(id); };
  var el = $;

  // ── timers scoped to the active screen (cleared on switch) ──
  var curScr = 'scan', timers = [];
  function clr(){ timers.forEach(function(id){ clearTimeout(id); clearInterval(id); }); timers = []; }
  function T(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
  function IV(fn, ms){ var id = setInterval(fn, ms); timers.push(id); return id; }
  function setW(id, w){ var e = $(id); if (e) e.style.width = w; }
  function countUp(id, to, dur, dec, suf){
    var e = $(id); if (!e) return;
    suf = suf || '';
    if (reduced){ e.textContent = (dec ? to.toFixed(dec) : Math.round(to)) + suf; return; }
    var st = null;
    function step(ts){ if (st === null) st = ts; var p = Math.min((ts - st) / dur, 1);
      var k = 1 - Math.pow(1 - p, 3); var v = to * k;
      e.textContent = (dec ? v.toFixed(dec) : Math.round(v)) + suf;
      if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  // ── screen switcher ──
  var tabs = document.querySelectorAll('.mocktab');
  var apps = document.querySelectorAll('#mockscreen .app');
  function syncDesc(t){
    var d = $('mockDesc'); if (!d || !t) return;
    var b = t.querySelector('b'), s = t.querySelector('span');
    d.innerHTML = (b ? '<b>' + b.textContent + '</b>' : '') + (s ? s.innerHTML : '');
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-selected','false'); });
      t.classList.add('on'); t.setAttribute('aria-selected','true');
      apps.forEach(function(a){ a.classList.toggle('on', a.dataset.scr === t.dataset.tgt); });
      syncDesc(t);
      t.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
      playScreen(t.dataset.tgt);
    });
  });
  syncDesc(document.querySelector('.mocktab.on'));
  // (clicking the phone no longer restarts the demo — use the step buttons to replay)

  function playScreen(scr){
    clr(); curScr = scr;
    if (scr === 'scan') startOnboarding();
    else if (scr === 'workout') playWorkout();
    else if (scr === 'progress') playProgress();
    else if (scr === 'food') playFood();
    else if (scr === 'story') playStory();
    else if (scr === 'notif') playNotif();
  }

  // ── onboarding: scan → goals → generate → choose plan ──
  function cls(id, c, on){ var e = $(id); if (e) e.classList.toggle(c, on); }
  function pick(id, text){ var e = $(id); if (!e) return; e.classList.add('picked');
    var s = e.querySelector('span'); if (s) s.textContent = text; }
  function dots(n){ for (var i = 1; i <= 3; i++) cls('asd' + i, 'on', i <= n); }
  // showCountdown colors: colors[count-1]
  var CNT_COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#06b6d4'];
  function setCnt(v){
    var e = $('as-cnum'), ring = $('as-cring'); if (!e) return;
    var col = CNT_COLORS[v-1] || '#22c55e';
    e.textContent = v; e.style.color = col; e.style.textShadow = '0 0 20px ' + col + '80';
    if (ring) ring.style.stroke = col;
    e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop');
  }
  function asReset(){
    ['as-count','as-analyze','as-results','as-goal','as-gen','as-plan','as-toast'].forEach(function(id){ cls(id,'show',false); });
    ['as-g1','as-g2','as-g3'].forEach(function(id){ var e = $(id); if (!e) return; e.classList.remove('picked');
      var s = e.querySelector('span'); if (s) s.textContent = { 'as-g1':'Select goal…','as-g2':'Select level…','as-g3':'Select equipment…' }[id]; });
    cls('as-genbtn','pressed',false); cls('as-easy','pressed',false);
    var ring = $('as-cring'); if (ring){ ring.style.transition='none'; ring.style.strokeDashoffset='283'; ring.getBoundingClientRect(); ring.style.transition='stroke-dashoffset 1s linear,stroke .3s'; }
    setCnt(5);
    var sl = $('as-scanline'); if (sl) sl.style.opacity = '1';
    var pb = document.querySelector('#as-plan .planbody'); if (pb) pb.scrollTop = 0;
    cls('as-modes','hide',false);   // mode selector visible while scanning
    dots(1);
  }
  function planScroll(){
    var pb = document.querySelector('#as-plan .planbody'); if (!pb || reduced) return;
    var max = pb.scrollHeight - pb.clientHeight; if (max <= 6) return;
    var st = null, dur = 2600;
    function step(ts){ if (curScr !== 'scan') return; if (st === null) st = ts;
      var p = Math.min((ts - st) / dur, 1);
      var k = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
      pb.scrollTop = max * k;
      if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var SEQ = [
    [0,     asReset],
    // countdown 5→1, ring fills one second per tick (real showCountdown(5))
    [900,   function(){ cls('as-count','show',true); var ring=$('as-cring'); if(ring) ring.style.strokeDashoffset='226.4'; }],
    [1900,  function(){ setCnt(4); var ring=$('as-cring'); if(ring) ring.style.strokeDashoffset='169.8'; }],
    [2900,  function(){ setCnt(3); var ring=$('as-cring'); if(ring) ring.style.strokeDashoffset='113.2'; }],
    [3900,  function(){ setCnt(2); var ring=$('as-cring'); if(ring) ring.style.strokeDashoffset='56.6'; }],
    [4900,  function(){ setCnt(1); var ring=$('as-cring'); if(ring) ring.style.strokeDashoffset='0'; }],
    [5900,  function(){ cls('as-count','show',false); cls('as-analyze','show',true); }],
    [8000,  function(){ cls('as-analyze','show',false); var sl=$('as-scanline'); if(sl) sl.style.opacity='0'; cls('as-modes','hide',true); cls('as-results','show',true); }],
    [11200, function(){ cls('as-results','show',false); cls('as-goal','show',true); dots(2); }],
    [12200, function(){ pick('as-g1','Body Toning'); }],
    [13000, function(){ pick('as-g2','Beginner'); }],
    [13800, function(){ pick('as-g3','Without Equipment'); }],
    [14700, function(){ cls('as-genbtn','pressed',true); }],
    [15200, function(){ cls('as-goal','show',false); cls('as-gen','show',true); }],
    [17800, function(){ cls('as-gen','show',false); cls('as-plan','show',true); dots(3); }],
    [19600, planScroll],                                        // scroll down to reveal the Easy plan
    [23000, function(){ cls('as-easy','pressed',true); }],
    [23900, function(){ cls('as-plan','show',false); cls('as-toast','show',true); }],
  ];
  var TOTAL = 27500;
  function startOnboarding(){
    if (reduced){ asReset(); cls('as-results','show',true); return; }
    SEQ.forEach(function(s){ T(s[1], s[0]); });
    T(function(){ if (curScr === 'scan') startOnboarding(); }, TOTAL);
  }

  // ── home dashboard: count-up + bar fills + scroll reveal ──
  var heroTimers = [], heroOn = false;
  function HT(fn, ms){ heroTimers.push(setTimeout(fn, ms)); }
  function heroClr(){ heroTimers.forEach(clearTimeout); heroTimers = []; }
  // ── hero Home Dashboard: splash → count-up → guided scroll tour ──
  var DW_EX = [
    {n:'Push-Ups',       r:'3 × 12', k:'95 kcal', img:'expushup'},
    {n:'Bicep Curls',    r:'3 × 10', k:'70 kcal', img:'excurl'},
    {n:'Shoulder Press', r:'3 × 10', k:'80 kcal', img:'express'},
    {n:'Plank',          r:'3 × 30s', k:'75 kcal', img:'explank'}
  ];
  var dwIdx = 0;
  function dwShow(i){
    dwIdx = i;
    var e = DW_EX[i];
    var n=$('dwName'), r=$('dwReps'), k=$('dwKcal'), s=$('dwStep');
    var ph=$('dwPhoto');
    if(n) n.textContent=e.n; if(r) r.textContent=e.r; if(k) k.textContent=e.k;
    if(s) s.textContent='0'+(i+1)+' / 04';
    if(ph && window.MFIMG){ ph.classList.add('fade');
      setTimeout(function(){ ph.src = MFIMG[e.img]; ph.classList.remove('fade'); }, 320); }
    document.querySelectorAll('#dwDots i').forEach(function(d,j){ d.classList.toggle('on', j===i); });
  }
  function startDwSlider(){
    if (reduced) return;
    dwSliderIv = setInterval(function(){ dwShow((dwIdx + 1) % DW_EX.length); }, 2800);
  }
  function startHeroDash(){
    var roll = $('dashRoll'); if (!roll) return;
    var g=$('hGood'), b=$('hBad'), gv=$('hGoodV'), bv=$('hBadV');
    ['hPct','hKcal','hSets','hReps','hPost'].forEach(function(id){ var e=$(id); if(e) e.textContent='0'; });
    setW('hBar','0'); if(g) g.style.width='0'; if(b) b.style.width='0';
    if(gv) gv.textContent='0%'; if(bv) bv.textContent='0%';
    roll.style.transition='none'; roll.style.transform='translateY(0)'; roll.getBoundingClientRect(); roll.style.transition='';
    if (reduced){
      var e=$('hPct'); if(e) e.textContent='67'; setW('hBar','67%');
      var k=$('hKcal'); if(k) k.textContent='412'; var s=$('hSets'); if(s) s.textContent='9'; var rp=$('hReps'); if(rp) rp.textContent='96'; var p=$('hPost'); if(p) p.textContent='86';
      if(g) g.style.width='86%'; if(b) b.style.width='14%';
      if(gv) gv.textContent='86%'; if(bv) bv.textContent='14%';
      return;
    }
    // splash first, then the dashboard boots
    var sp = $('heroSplash');
    var SPLASH_MS = sp ? 2300 : 0;
    if (sp){
      sp.classList.remove('gone');
      // restart the loading-bar fill cleanly each time the splash shows
      var bi = sp.querySelector('.lbar i');
      if (bi){ bi.style.animation='none'; bi.getBoundingClientRect(); bi.style.animation=''; }
      HT(function(){ sp.classList.add('gone'); }, SPLASH_MS);
    }
    HT(function(){
      countUp('hPct',67,1100); setW('hBar','67%');
      countUp('hKcal',412,1200); countUp('hSets',9,900); countUp('hReps',96,1200); countUp('hPost',86,1100);
      if(g) g.style.width='86%'; if(b) b.style.width='14%';
      countUp('hGoodV',86,1100,0,'%'); countUp('hBadV',14,900,0,'%');
    }, SPLASH_MS + 400);
    HT(heroTour, SPLASH_MS + 2200);
    if (!startHeroDash._slider){ startHeroDash._slider = true; startDwSlider(); }
  }
  function heroTour(){
    var roll = $('dashRoll'), body = document.querySelector('.app[data-scr="dash"] .appbody');
    if (!roll || !body || reduced) return;
    var vis = body.clientHeight;
    function maxPan(){ return Math.max(0, roll.offsetHeight - vis); }
    function target(elm){ return elm ? Math.min(Math.max(elm.offsetTop - 8, 0), maxPan()) : 0; }
    function pan(y, dur, cb){ roll.style.transitionDuration = (dur/1000)+'s'; roll.style.transform='translateY(-'+y+'px)'; HT(cb, dur+40); }
    // single pass: posture → Daily Workout (stay until the slider shows all 4
    // exercises) → back to top → after a long dwell, zoom back to the splash and loop
    pan(target($('hPosture')), 1150, function(){
      HT(function(){ pan(maxPan(), 1150, function(){
        // full slider cycle = 4 × 2.8s — hold until every scheduled exercise has shown
        HT(function(){ pan(0, 1050, heroRelaunch); }, 4 * 2800 + 600);
      }); }, 1700);
    });
  }
  function heroRelaunch(){
    if (reduced) return;
    // brief dwell on the dashboard, then zoom out → splash zooms in → boot again
    HT(function(){
      var app = document.querySelector('header.hero .app');
      var sp = $('heroSplash');
      if (app) app.classList.add('zoomed');
      HT(function(){ if (sp) sp.classList.remove('gone'); }, 300);
      HT(function(){
        if (app) app.classList.remove('zoomed');   // reset behind the splash
        startHeroDash();                            // splash holds, then dashboard boots
      }, 1200);
    }, 4500);
  }

  // ── workout: rep-by-rep, sets stay in sync, grade varies each rep ──
  // Per-rep form scores across 3 sets × 12 reps (36), trending up with realistic noise.
  var WK_SCORES = [72,68,76,81,74,79,66,84,78,71,88,82, 75,80,73,90,85,77,69,83,79,86,74,91, 81,78,92,70,87,84,76,89,82,94,80,88];
  var WK_TIERS = [
    {min:90, g:'A', col:'#6ee7b7', sh:'rgba(16,185,129,.55)',  bd:'rgba(52,211,153,.5)',  cap:'em', glow:'linear-gradient(90deg,#10b981,#14b8a6,#06b6d4)', fc:'rgba(110,231,183,.8)', fb:'Perfect depth — locked in!'},
    {min:80, g:'B', col:'#86efac', sh:'rgba(34,197,94,.5)',    bd:'rgba(74,222,128,.5)',  cap:'em', glow:'linear-gradient(90deg,#22c55e,#10b981,#14b8a6)', fc:'rgba(134,239,172,.8)', fb:'Strong form, steady tempo.'},
    {min:70, g:'C', col:'#fde047', sh:'rgba(251,191,36,.55)',  bd:'rgba(251,191,36,.5)',  cap:'am', glow:'linear-gradient(90deg,#f59e0b,#f97316,#ef4444)', fc:'rgba(253,224,71,.75)', fb:'Hips sagging — squeeze your glutes.'},
    {min:60, g:'D', col:'#fb923c', sh:'rgba(251,146,60,.55)',  bd:'rgba(251,146,60,.5)',  cap:'am', glow:'linear-gradient(90deg,#f97316,#fb923c,#f59e0b)', fc:'rgba(251,146,60,.8)',  fb:'Slow the descent — stay controlled.'},
    {min:0,  g:'F', col:'#f87171', sh:'rgba(239,68,68,.55)',   bd:'rgba(248,113,113,.5)', cap:'rd', glow:'linear-gradient(90deg,#ef4444,#f43f5e,#fb7185)', fc:'rgba(248,113,113,.8)', fb:'Reset posture — chest up.'}
  ];
  function wkTier(sc){ for (var i=0;i<WK_TIERS.length;i++) if (sc>=WK_TIERS[i].min) return WK_TIERS[i]; return WK_TIERS[4]; }
  function applyForm(sc){
    var t = wkTier(sc), gr=$('wkGrade'), scn=$('wkScore'), inr=$('wkInner'), gl=$('wkGlow'), fd=$('wkFeed'), gc=$('wkGradeCap');
    if(gr){ gr.textContent=t.g; gr.style.color=t.col; gr.style.textShadow='0 0 22px '+t.sh; }
    if(scn) scn.textContent=sc;
    if(inr) inr.style.borderColor=t.bd;
    if(gl) gl.style.background=t.glow;
    if(gc) gc.style.color=t.fc;
    if(fd) fd.innerHTML='<svg class="ic"><use href="#ic-chevdown"/></svg> &nbsp;'+t.fb;
  }
  var WK_REP_MS = 780, WK_REPS = 12, WK_SETS = 3;
  function playWorkout(){
    var r=$('wRepRing'), n=$('wReps'), sr=$('wSetRing'), sn=$('wSets');
    var flash=$('wkFlash'), res=$('wkResults'), chk=$('wkrCheck');
    function reset(ring, off){ if(!ring) return; ring.style.transition='none'; ring.style.strokeDashoffset=off; ring.getBoundingClientRect(); ring.style.transition='stroke-dashoffset .5s ease-out'; }
    if(res) res.classList.remove('show'); if(flash) flash.classList.remove('show'); if(chk) chk.classList.remove('done');
    reset(r,'194.8'); reset(sr,'129.9');       // start already on set 2 (1/3 done)
    if(n) n.textContent='0/12'; if(sn) sn.textContent='1/3';
    applyForm(WK_SCORES[12]);
    var pr=$('wkrRing'), pcr=$('wkrPctRing');
    if(pr){ pr.style.transition='none'; pr.style.strokeDashoffset='220'; pr.getBoundingClientRect(); pr.style.transition='stroke-dashoffset 1.05s cubic-bezier(.2,.8,.3,1)'; }
    if(pcr){ pcr.style.transition='none'; pcr.style.strokeDashoffset='270.2'; pcr.getBoundingClientRect(); pcr.style.transition='stroke-dashoffset 1.05s cubic-bezier(.2,.8,.3,1)'; }
    ['wkrPct','wkrCal','wkrReps','wkrForm','wkrEx'].forEach(function(id){ var e=$(id); if(e) e.textContent='0'; });
    setW('wkrGood','0'); setW('wkrBad','0');
    var gt=$('wkrGoodT'), bt=$('wkrBadT'); if(gt) gt.textContent='0%'; if(bt) bt.textContent='0%';
    if(reduced){ if(n) n.textContent='12/12'; if(sn) sn.textContent='3/3'; showWkResults(); return; }

    var setN = 2, repN = 0, gi = 12;
    function tick(){
      if (curScr !== 'workout') return;
      repN++;
      if(n) n.textContent = repN + '/12';
      if(r) r.style.strokeDashoffset = (194.8 * (1 - repN / WK_REPS)).toFixed(1);
      applyForm(WK_SCORES[gi % WK_SCORES.length]); gi++;
      if (repN >= WK_REPS){
        // set complete → advance the sets ring in sync
        if(sn) sn.textContent = setN + '/3';
        if(sr) sr.style.strokeDashoffset = (194.8 * (1 - setN / WK_SETS)).toFixed(1);
        if (setN >= WK_SETS){ T(finishWk, 750); return; }
        setN++;
        // brief rest between sets, then reset reps and continue
        T(function(){
          if (curScr !== 'workout') return;
          repN = 0; if(n) n.textContent = '0/12';
          if(r){ r.style.transition='none'; r.style.strokeDashoffset='194.8'; r.getBoundingClientRect(); r.style.transition='stroke-dashoffset .5s ease-out'; }
          T(tick, 550);
        }, 850);
        return;
      }
      T(tick, WK_REP_MS);
    }
    T(tick, 600);
  }
  function finishWk(){
    var flash=$('wkFlash');
    if(flash) flash.classList.add('show');
    T(function(){ if(flash) flash.classList.remove('show'); }, 1450);
    T(showWkResults, 1650);
    T(function(){ if(curScr==='workout') playWorkout(); }, 9500);
  }
  function showWkResults(){
    var res=$('wkResults'), chk=$('wkrCheck'); if(res) res.classList.add('show');
    T(function(){ var pr=$('wkrRing'); if(pr) pr.style.strokeDashoffset='0'; }, 300);   // header check ring draws
    T(function(){ if(chk) chk.classList.add('done'); }, 1100);                            // checkmark pops
    T(function(){
      var pcr=$('wkrPctRing'); if(pcr) pcr.style.strokeDashoffset='0';                    // 100% ring fills
      countUp('wkrPct',100,1300,0,'%'); countUp('wkrCal',320,1300); countUp('wkrReps',142,1400); countUp('wkrForm',87,1200,0,'%'); countUp('wkrEx',5,1000);
      setW('wkrGood','87%'); setW('wkrBad','13%');
      var gt=$('wkrGoodT'), bt=$('wkrBadT'); if(gt) T(function(){ gt.textContent='87%'; },500); if(bt) T(function(){ bt.textContent='13%'; },500);
    }, 800);
  }

  // ── progress: metric count-up + cycling chart ──
  var progData = [
    {key:'weight', txt:'Weight',      icon:'ic-scale',    color:'#4ade80', area:'rgba(74,222,128,.10)',  ys:[38,44,58,72], cap:'Body weight · <b style="color:#4ade80">72.2 → 71.4 kg</b> this month'},
    {key:'bmi',    txt:'BMI',         icon:'ic-chartline',color:'#60a5fa', area:'rgba(96,165,250,.10)',  ys:[42,46,53,60], cap:'BMI · <b style="color:#60a5fa">23.9 → 23.1</b> this month'},
    {key:'cal',    txt:'Calories',    icon:'ic-fire',     color:'#fb923c', area:'rgba(251,146,60,.10)',  ys:[72,54,60,32], cap:'Calories burned · <b style="color:#fb923c">up 24%</b> vs last week'},
    {key:'work',   txt:'Workouts',    icon:'i-dumbbell',  color:'#a855f7', area:'rgba(168,85,247,.10)',  ys:[74,58,66,42], cap:'Workouts · <b style="color:#a855f7">18 sessions</b> this month'},
    {key:'posture',txt:'Posture',     icon:'ic-walk',     color:'#22c55e', area:'rgba(34,197,94,.10)',   ys:[64,58,48,34], cap:'Good-form rate · <b style="color:#22c55e">78% → 88%</b>'},
    {key:'consistency',txt:'Consistency',icon:'ic-chartline',color:'#2dd4bf',area:'rgba(45,212,191,.10)',ys:[52,58,54,68], cap:'Plan consistency · <b style="color:#2dd4bf">86% this week</b>'}
  ];
  var progXs = [8,88,170,252], progMap = {weight:'mc-weight',bmi:'mc-bmi',cal:'mc-cal',work:'mc-work'};
  function drawProg(i){
    var d = progData[i];
    var SY = 64/108;  // data is in 108-space; chart viewBox is 70 tall
    var P = d.ys.map(function(y,k){ return [progXs[k], y*SY + 2]; });
    // smooth Catmull-Rom → cubic bezier
    function smooth(pts){
      var p = 'M' + pts[0][0] + ',' + pts[0][1].toFixed(1);
      for (var k = 0; k < pts.length - 1; k++){
        var p0 = pts[Math.max(k-1,0)], p1 = pts[k], p2 = pts[k+1], p3 = pts[Math.min(k+2,pts.length-1)];
        var c1x = p1[0] + (p2[0]-p0[0])/6, c1y = p1[1] + (p2[1]-p0[1])/6;
        var c2x = p2[0] - (p3[0]-p1[0])/6, c2y = p2[1] - (p3[1]-p1[1])/6;
        p += ' C' + c1x.toFixed(1)+','+c1y.toFixed(1)+' '+c2x.toFixed(1)+','+c2y.toFixed(1)+' '+p2[0]+','+p2[1].toFixed(1);
      }
      return p;
    }
    var line = smooth(P);
    var L=$('progLine'), A=$('progArea'), dot=$('progDot'), pts=$('progPts');
    var s1=$('pgS1'), s2=$('pgS2');
    if(s1) s1.setAttribute('stop-color', d.color); if(s2) s2.setAttribute('stop-color', d.color);
    if(A){ A.setAttribute('d', line+' L'+P[3][0]+',70 L'+P[0][0]+',70 Z'); }
    if(L){ L.setAttribute('stroke', d.color); L.setAttribute('d', line); }
    if(pts){ pts.innerHTML = P.slice(0,3).map(function(pt){
      return '<circle cx="'+pt[0]+'" cy="'+pt[1].toFixed(1)+'" r="2.6" fill="'+d.color+'" stroke="#0f1720" stroke-width="1.2"/>'; }).join(''); }
    if(dot){ dot.setAttribute('fill', d.color); dot.setAttribute('cx', P[3][0]); dot.setAttribute('cy', P[3][1].toFixed(1)); }
    var cap=$('progCaption'); if(cap) cap.innerHTML = d.cap;
    var dt=$('progDropTxt'); if(dt) dt.textContent = d.txt;
    var du=document.querySelector('#progDrop .dico use'); if(du) du.setAttribute('href','#'+d.icon);
    ['mc-weight','mc-bmi','mc-cal','mc-work'].forEach(function(id){ var c=$(id); if(c){ c.classList.remove('hot'); c.style.boxShadow=''; } });
    var hc=progMap[d.key]; if(hc){ var c=$(hc); if(c){ c.classList.add('hot'); c.style.boxShadow='0 0 0 1px '+d.color+', 0 5px 16px rgba(0,0,0,.35)'; } }
    if(L && !reduced && L.getTotalLength){ var len=L.getTotalLength();
      L.style.transition='none'; L.style.strokeDasharray=len; L.style.strokeDashoffset=len; L.getBoundingClientRect();
      L.style.transition='stroke-dashoffset 1s ease'; L.style.strokeDashoffset='0'; }
  }
  // RAF-driven pan (no CSS-transition dependency — always animates)
  var progPanY = 0;
  function rafPan(roll, scr, to, dur, cb){
    if (reduced){ roll.style.transform='translateY(-'+to+'px)'; progPanY=to; if(cb) cb(); return; }
    var from = progPanY, d = to - from, st = null;
    function step(ts){
      if (curScr !== scr) return;
      if (st === null) st = ts;
      var p = Math.min((ts - st)/dur, 1);
      var k = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2,2)/2;
      progPanY = from + d*k;
      roll.style.transform = 'translateY(-' + progPanY.toFixed(1) + 'px)';
      if (p < 1) requestAnimationFrame(step); else if (cb) cb();
    }
    requestAnimationFrame(step);
  }
  function playProgress(){
    var roll = $('progRoll'), body = document.querySelector('.app[data-scr="progress"] .appbody');
    // reset everything
    if (roll){ roll.style.transition='none'; roll.style.transform='translateY(0)'; progPanY = 0; }
    var tp=$('tpPct'), tc=$('tpCnt'); if(tp) tp.textContent='0'; if(tc) tc.textContent='0/4 exercises'; setW('tpBar','0');
    var bi=$('ckBicep'), bn=$('ckBicepNum'), bs=$('ckBicepSt');
    if(bi){ bi.classList.remove('done'); bi.classList.add('inprog'); }
    if(bn) bn.innerHTML='<svg class="ic"><use href="#ic-clock"/></svg>';
    if(bs) bs.textContent='In Progress';
    ['mv-weight','mv-bmi','mv-cal','mv-work'].forEach(function(id){ var e=$(id); if(e) e.textContent='0'; });
    var pc=$('pv-consist'), ps=$('pv-streak'); if(pc) pc.textContent='0%'; if(ps) ps.textContent='0';
    drawProg(0);
    if (reduced){
      if(tp) tp.textContent='50'; if(tc) tc.textContent='2/4 exercises'; setW('tpBar','50%');
      countUp('mv-weight',71.4,0,1); countUp('mv-bmi',23.1,0,1); countUp('mv-cal',412,0); countUp('mv-work',18,0);
      if(pc) pc.textContent='86%'; if(ps) ps.textContent='9';
      return;
    }
    // phase 1 (0–3s): today's progress + realtime checklist tracking
    T(function(){ countUp('tpPct',25,800); setW('tpBar','25%'); if(tc) tc.textContent='1/4 exercises'; }, 350);
    T(function(){
      if(bi){ bi.classList.remove('inprog'); bi.classList.add('done'); }
      if(bn) bn.innerHTML='<svg class="ic"><use href="#ic-check"/></svg>';
      if(bs) bs.textContent='Done';
      countUp('tpPct',50,800); setW('tpBar','50%'); if(tc) tc.textContent='2/4 exercises';
    }, 2100);
    // phase 2 (3s): ONE scroll down to the metrics section → everything below counts up
    T(function(){
      if (!roll || !body) return;
      var vis = body.clientHeight;
      var maxP = Math.max(0, roll.offsetHeight - vis);
      var mg = document.querySelector('.app[data-scr="progress"] .mgrid');
      var sk = document.querySelector('.app[data-scr="progress"] .pcard.green');
      var NAVCLEAR = 72;
      // "need": pan required so the streak card clears the nav. "mgTop": pan that keeps metrics uncut.
      var need = sk ? Math.min(Math.max(sk.offsetTop + sk.offsetHeight + NAVCLEAR - vis, 0), maxP) : 0;
      var mgTop = mg ? Math.max(mg.offsetTop - 10, 0) : 0;
      rafPan(roll, 'progress', Math.min(mgTop, maxP), 1300, function(){
        // metrics count up uncut at the top of the view
        countUp('mv-weight',71.4,1000,1); countUp('mv-bmi',23.1,1000,1); countUp('mv-cal',412,1000); countUp('mv-work',18,900);
        // cycle the chart through EVERY metric (Weight → BMI → Calories →
        // Workouts → Posture → Consistency); only after the full cycle
        // has been shown does it scroll back to the top.
        drawProg(0);
        var ci = 0, shown = 1;
        var cyc = setInterval(function(){
          if (curScr !== 'progress'){ clearInterval(cyc); return; }
          ci = (ci + 1) % progData.length; drawProg(ci); shown++;
          if (shown >= progData.length){
            clearInterval(cyc);
            // let the last metric (Consistency) sit for a moment, then return
            T(function(){ rafPan(roll, 'progress', 0, 1100, function(){
              T(function(){ if (curScr==='progress') playProgress(); }, 1800);
            }); }, 2800);
          }
        }, 2600);
        timers.push(cyc);
        if (need <= mgTop + 4){
          // everything already fits — consistency & streak are visible: count them now
          countUp('pv-consist',86,1200,0,'%'); countUp('pv-streak',9,1000);
        } else {
          // doesn't fit: nudge down to reveal consistency + streak while the chart keeps cycling
          T(function(){
            rafPan(roll, 'progress', need, 1000, function(){
              countUp('pv-consist',86,1200,0,'%'); countUp('pv-streak',9,1000);
            });
          }, 3200);
        }
      });
    }, 3000);
  }

  // ── meal scanner: capture → analyzing → results ──
  function playFood(){
    var cap=$('mealCap'), scan=$('mealScan'), sheet=$('mealSheet'), btn=$('mealCapBtn'), brk=$('mealBrk');
    if(cap) cap.classList.remove('gone'); if(scan) scan.classList.remove('on'); if(sheet) sheet.classList.remove('up');
    if(brk) brk.classList.remove('gone');
    ['mealCal','mealPr','mealCb','mealFt','mealHScore'].forEach(function(id){ var e=$(id); if(e) e.textContent = id==='mealCal'||id==='mealHScore'?'0':'0g'; });
    var mc=$('mealCal'); if(mc) mc.textContent='0'; var hs=$('mealHScore'); if(hs) hs.textContent='0';
    setW('mealR1','0'); setW('mealR2','0'); setW('mealR3','0'); setW('mealHealth','0');
    var ring=$('mealRing'); if(ring) ring.setAttribute('stroke-dashoffset','339.3');
    // camera "focus" intro: photo starts zoomed + blurred, settles into focus first
    var pic = document.querySelector('.app[data-scr="food"] .campic');
    if (pic){ pic.style.transition='none'; pic.classList.add('unfocus'); pic.getBoundingClientRect(); pic.style.transition=''; }
    if(reduced){ if(pic) pic.classList.remove('unfocus'); if(cap) cap.classList.add('gone'); mealResults(); return; }
    T(function(){ if(pic) pic.classList.remove('unfocus'); }, 350);        // zoom out + sharpen (~1.8s)
    T(function(){ if(btn) btn.classList.add('press'); }, 2600);            // then the shutter clicks
    T(function(){ if(btn) btn.classList.remove('press'); if(cap) cap.classList.add('gone'); if(scan) scan.classList.add('on'); }, 2850);
    T(function(){ if(scan) scan.classList.remove('on'); mealResults(); }, 4900);
    T(function(){ if(curScr==='food') playFood(); }, 10800);
  }
  function mealResults(){
    var sheet=$('mealSheet'); if(sheet) sheet.classList.add('up');
    var brk=$('mealBrk'); if(brk) brk.classList.add('gone');   // scanner closes once results show
    T(function(){
      var ring=$('mealRing'); if(ring) ring.setAttribute('stroke-dashoffset','251');
      countUp('mealCal',520,1100); countUp('mealPr',42,1000,0,'g'); countUp('mealCb',55,1000,0,'g'); countUp('mealFt',14,1000,0,'g');
      countUp('mealHScore',78,1100);
      setW('mealR1','32%'); setW('mealR2','44%'); setW('mealR3','24%'); setW('mealHealth','78%');
    }, 280);
  }

  // ── share story: count-up ──
  function playStory(){
    countUp('stPct',87,1200); countUp('stKcal',412,1200); countUp('stMin',24,1000); countUp('stForm',88,1100,0,'%');
  }

  // ── notifications: staggered pop-in + live updates ──
  function playNotif(){
    var ns = document.querySelectorAll('.app[data-scr="notif"] .notif.popin');
    ns.forEach(function(n){ n.classList.remove('in'); });
    var live = $('notifLive');
    if (reduced){ ns.forEach(function(n){ n.classList.add('in'); }); return; }
    ns.forEach(function(n){ var d = +n.dataset.nd; T(function(){ n.classList.add('in'); }, 300 + d * 780); });
    var seq = [[2,10,94],[2,12,91],[3,3,96],[3,6,89],[3,9,93]], k = 0;
    T(function(){ IV(function(){ k = (k + 1) % seq.length; var s = seq[k];
      if (live) live.innerHTML = 'Squat · Set ' + s[0] + ' / 3 · ' + s[1] + ' reps · <span class="fs">' + s[2] + '% form</span>'; }, 1500); }, 2400);
    T(function(){ if (curScr === 'notif') playNotif(); }, 9500);
  }

  // ── Weekly Progress Check stage: prompt → comparison, looping while visible ──
  var wpcTimers = [], wpcOn = false;
  function WT(fn, ms){ wpcTimers.push(setTimeout(fn, ms)); }
  function wpcClr(){ wpcTimers.forEach(clearTimeout); wpcTimers = []; }
  function tween(id, from, to, dur, dec, suf){
    var e = $(id); if (!e) return;
    suf = suf || '';
    if (reduced){ e.textContent = (dec ? to.toFixed(dec) : Math.round(to)) + suf; return; }
    var st = null;
    function step(ts){ if (!wpcOn) return; if (st === null) st = ts;
      var p = Math.min((ts - st)/dur, 1), k = 1 - Math.pow(1 - p, 3);
      var v = from + (to - from) * k;
      e.textContent = (dec ? v.toFixed(dec) : Math.round(v)) + suf;
      if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function wpcReset(){
    cls('wpcPrompt','off',false); cls('wpcComp','off',true); cls('wpcStart','pressed',false); cls('wpcChg','pressed',false);
    for (var i = 1; i <= 7; i++) cls('wi' + i, 'in', false);
    cls('wpcHi','show',false); cls('wpcTip','show',false);
    cls('wi5','pressed',false); cls('wi6','pressed',false);
    ['hd0','hd1','hd2','hd3','hd4','hd5','td0','td1','td2','td3','td3b','td4'].forEach(function(id){ cls(id,'in',false); });
    var hb=$('hiBars'); if(hb) hb.classList.remove('grow');
    var sp=$('wxSpark'); if(sp){ sp.style.transition='none'; sp.style.strokeDashoffset='200'; sp.getBoundingClientRect(); sp.style.transition='stroke-dashoffset 1.4s ease'; }
    var dt=$('wxDot'); if(dt) dt.style.opacity='0';
    var t=$('wxThis'); if(t) t.textContent='72.2';
    var bv=$('wbmiV'); if(bv) bv.textContent='23.4';
    var mk=$('wbmiMark'); if(mk) mk.style.left='56%';
    ['wrCons','wrForm'].forEach(function(id){ var r=$(id); if(r){ r.style.transition='none'; r.style.strokeDashoffset='150.8'; r.getBoundingClientRect(); r.style.transition='stroke-dashoffset 1.3s cubic-bezier(.2,.8,.3,1)'; } });
    var cv=$('wrConsV'); if(cv) cv.textContent='0'; var fv=$('wrFormV'); if(fv) fv.textContent='0';
    var wk=$('wsWk'); if(wk) wk.textContent='0'; var kc=$('wsKcal'); if(kc) kc.textContent='0';
    document.querySelectorAll('#wsSegs i').forEach(function(s){ s.classList.remove('on'); });
  }
  function wpcPlay(){
    wpcClr(); wpcReset();
    if (reduced){ cls('wpcPrompt','off',true); cls('wpcComp','off',false);
      for (var i=1;i<=7;i++) cls('wi'+i,'in',true);
      var sp=$('wxSpark'); if(sp) sp.style.strokeDashoffset='0';
      tween('wxThis',71.4,71.4,0,1); tween('wbmiV',23.1,23.1,0,1);
      var r1=$('wrCons'); if(r1) r1.style.strokeDashoffset='25.6'; var r2=$('wrForm'); if(r2) r2.style.strokeDashoffset='18.1';
      tween('wrConsV',83,83,0); tween('wrFormV',88,88,0); tween('wsWk',5,5,0); tween('wsKcal',2140,2140,0);
      document.querySelectorAll('#wsSegs i').forEach(function(s,j){ if(j<5) s.classList.add('on'); });
      return;
    }
    WT(function(){ cls('wpcStart','pressed',true); }, 2100);
    WT(function(){ cls('wpcPrompt','off',true); cls('wpcComp','off',false); }, 2550);
    // staggered reveal + graphics
    WT(function(){ cls('wi1','in',true);
      var sp=$('wxSpark'); if(sp) sp.style.strokeDashoffset='0';
      WT(function(){ var dt=$('wxDot'); if(dt) dt.style.opacity='1'; }, 1300);
      tween('wxThis',72.2,71.4,1400,1);
    }, 3100);
    WT(function(){ cls('wi2','in',true); }, 3500);
    WT(function(){ cls('wi3','in',true);
      var mk=$('wbmiMark'); if(mk) mk.style.left='51.5%';
      tween('wbmiV',23.4,23.1,1200,1);
    }, 3900);
    WT(function(){ cls('wi4','in',true);
      var r1=$('wrCons'); if(r1) r1.style.strokeDashoffset='25.6';
      var r2=$('wrForm'); if(r2) r2.style.strokeDashoffset='18.1';
      tween('wrConsV',0,83,1300); tween('wrFormV',0,88,1300);
      tween('wsWk',0,5,1000); tween('wsKcal',0,2140,1400);
      WT(function(){ var k=$('wsKcal'); if(k) k.textContent='2,140'; }, 1550);
      document.querySelectorAll('#wsSegs i').forEach(function(s,j){ if(j<5) WT(function(){ s.classList.add('on'); }, 250+j*200); });
    }, 4300);
    WT(function(){ cls('wi5','in',true); }, 4800);
    WT(function(){ cls('wi6','in',true); }, 5150);
    WT(function(){ cls('wi7','in',true); }, 5500);
    // tap "Progress Highlights" → full-screen detail
    WT(function(){ cls('wi5','pressed',true); }, 8600);
    WT(function(){ cls('wi5','pressed',false); cls('wpcHi','show',true);
      ['hd0','hd1','hd2','hd3','hd4','hd5'].forEach(function(id,j){ WT(function(){ cls(id,'in',true); }, 200+j*230); });
      WT(function(){ var hb=$('hiBars'); if(hb) hb.classList.add('grow'); }, 1150);
    }, 9100);
    WT(function(){ cls('wpcHi','show',false); }, 14200);
    // tap "What to Improve" → full-screen detail
    WT(function(){ cls('wi6','pressed',true); }, 14900);
    WT(function(){ cls('wi6','pressed',false); cls('wpcTip','show',true);
      ['td0','td1','td2','td3','td3b','td4'].forEach(function(id,j){ WT(function(){ cls(id,'in',true); }, 200+j*230); });
    }, 15400);
    WT(function(){ cls('wpcTip','show',false); }, 20400);
    // choose "Change My Plan", then loop back to the prompt
    WT(function(){ cls('wpcChg','pressed',true); }, 21400);
    WT(function(){ cls('wpcComp','off',true); cls('wpcPrompt','off',false); }, 22300);
    WT(function(){ if (wpcOn) wpcPlay(); }, 24600);
  }
  (function(){
    var stage = $('wpcStage'); if (!stage) return;
    if (!('IntersectionObserver' in window)){ wpcOn = true; wpcPlay(); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(en){
      if (en.isIntersecting && !wpcOn){ wpcOn = true; wpcPlay(); }
      else if (!en.isIntersecting && wpcOn){ wpcOn = false; wpcClr(); }
    }); }, { threshold: .3 });
    io.observe(stage); _ios.push(io);
  })();

  // ── iPad scroll-driven tilt: angled on approach, straightens as it settles in view ──
  (function(){
    var wrap = document.querySelector('.ipadwrap'), pad = document.querySelector('.ipad');
    if (!wrap || !pad || reduced) return;
    var mq = window.matchMedia('(max-width:900px)');
    var ticking = false;
    function upd(){
      ticking = false;
      var r = wrap.getBoundingClientRect(), vh = window.innerHeight;
      var c = r.top + r.height / 2;
      var p = (vh * 0.98 - c) / (vh * 0.52);   // 0 = entering from below, 1 = settled mid-view
      p = Math.max(0, Math.min(1, p));
      var e = 1 - Math.pow(1 - p, 2);          // ease-out
      var ax = mq.matches ? 7 : 10, ay = mq.matches ? -9 : -14;  // gentler on the phone frame
      pad.style.transform = 'rotateX(' + (ax * (1 - e)).toFixed(2) + 'deg) rotateY(' + (ay * (1 - e)).toFixed(2) + 'deg) rotateZ(' + (.6 * (1 - e)).toFixed(2) + 'deg)';
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(upd); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    _cleanups.push(function(){
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
    upd();
  })();

  // walkthrough plays only while it's scrolled into view
  (function(){
    var mock = $('mockscreen');
    if (!mock){ return; }
    if (!('IntersectionObserver' in window)){ playScreen('scan'); return; }
    var visible = false;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting && !visible){ visible = true; playScreen(curScr); }
        else if (!en.isIntersecting && visible){ visible = false; clr(); }
      });
    }, { threshold: .3 });
    io.observe(mock); _ios.push(io);
  })();

  // hero: play the Home Dashboard showcase only while it's in view
  (function(){
    var heroPhone = document.querySelector('header.hero .phone');
    if (!heroPhone){ return; }
    if (!('IntersectionObserver' in window)){ heroOn = true; startHeroDash(); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(en){
      if (en.isIntersecting && !heroOn){ heroOn = true; startHeroDash(); }
      else if (!en.isIntersecting && heroOn){ heroOn = false; heroClr(); }
    }); }, { threshold: .3 });
    io.observe(heroPhone); _ios.push(io);
  })();

  return function cleanup(){
    clr(); heroClr(); wpcClr();
    wpcOn = false; heroOn = false;
    curScr = 'none';
    if (dwSliderIv) clearInterval(dwSliderIv);
    _ios.forEach(function(io){ io.disconnect(); });
    _cleanups.forEach(function(f){ f(); });
  };
}
