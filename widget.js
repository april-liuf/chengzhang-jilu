/* ===== 成长记录 · 小组件进度页 =====
   与主站共用 localStorage（growth_v1），只展示今日进度。 */
const KEY = "growth_v1";
let DB = load();

function load(){
  try{
    const r = localStorage.getItem(KEY);
    if(r){
      const d = JSON.parse(r);
      if(d.leitner){ for(const k in d.leitner){ if(typeof d.leitner[k]==="number") d.leitner[k]={lv:d.leitner[k], due:"1999-12-31"}; } }
      return d;
    }
  }catch(e){}
  return { checkins:{}, weekly:{}, leitner:{}, diet:[] };
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){} }

function _pd(x){ return String(x).padStart(2,"0"); }
function _fmtLocal(d){ return d.getFullYear()+"-"+_pd(d.getMonth()+1)+"-"+_pd(d.getDate()); }
function todayStr(){ return _fmtLocal(new Date()); }
function addDays(ds,n){ const d=new Date(ds+"T00:00:00"); d.setDate(d.getDate()+n); return _fmtLocal(d); }
function fmtDate(s){ const [y,m,d]=s.split("-"); return `${+m}月${+d}日`; }
function mondayOf(s){ const d=new Date(s+"T00:00:00"); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return _fmtLocal(d); }
function daysUntil(ds){ const a=new Date(todayStr()+"T00:00:00"), b=new Date(ds+"T00:00:00"); return Math.round((b-a)/86400000); }
function dayNumber(){ const n=-daysUntil(SITE.startDate); return n<0?1:n+1; }
function allThree(c){ return !!(c&&c.eat&&c.eat.done&&c.sleep&&c.sleep.done&&c.move&&c.move.done); }
function dayStreak(){
  let s=0, cur=todayStr();
  if(!allThree(DB.checkins[cur])) cur=addDays(cur,-1);
  while(allThree(DB.checkins[cur])){ s++; cur=addDays(cur,-1); }
  return s;
}
function weekTotalDays(){ const mk=mondayOf(todayStr()); const el=Math.round((new Date(todayStr()+"T00:00:00")-new Date(mk+"T00:00:00"))/86400000)+1; return Math.max(1,el); }
function weekDoneCount(){ const mk=mondayOf(todayStr()), t=todayStr(); let n=0; for(let ds=mk;ds<=t;ds=addDays(ds,1)){ if(allThree(DB.checkins[ds])) n++; } return n; }
function dayPoints(c){
  if(!c) return 0;
  let p=0;
  if(c.eat && c.eat.done) p+=POINTS.eatWell;
  const sc=sleepCategory(c); if(sc) p+=sc.pts;
  if(c.move && c.move.done && (c.move.rope||0)>=DAILY_GOALS.jumpRope) p+=POINTS.jumpRope50;
  if(c.study && c.study.english) p+=POINTS.englishRead15;
  if(c.study && c.study.homework) p+=POINTS.finishHomework;
  if(c.study && c.study.german) p+=POINTS.germanReview;
  if(c.chore && c.chore.list && c.chore.list.length) p += c.chore.list.length * POINTS.chore;
  return p;
}
function totalPoints(){ let t=0; for(const k in DB.checkins) t+=dayPoints(DB.checkins[k]); if(DB.weekly) for(const k in DB.weekly) if(DB.weekly[k].reviewed) t+=POINTS.weeklyReview; return t; }

function sleepMinutes(bed, wake){
  if(!bed||!wake) return null;
  const p=s=>{ const a=(s||"").split(":").map(Number); return (a[0]||0)*60+(a[1]||0); };
  const b=p(bed), w=p(wake); if(isNaN(b)||isNaN(w)) return null;
  return ((w-b)%1440+1440)%1440;
}
function sleepCategory(c){
  if(!c||!c.sleep) return null;
  const d=sleepMinutes(c.sleep.bed, c.sleep.wake); if(d===null) return null;
  const early = (c.sleep.bed||"23:59") <= SLEEP.earlyCutoff;
  const enough = d/60 >= SLEEP.goalHours;
  if(early && enough) return {key:"earlyEnough", pts:SLEEP.scores.earlyEnough, label:"早睡+睡够"};
  if(early && !enough) return {key:"earlyShort", pts:SLEEP.scores.earlyShort, label:"早睡但短"};
  if(!early && enough) return {key:"lateEnough", pts:SLEEP.scores.lateEnough, label:"晚睡但够"};
  return {key:"lateShort", pts:SLEEP.scores.lateShort, label:"晚睡且短"};
}
function renderWidget(){
  const hr=new Date().getHours();
  const greetT = hr<11?"早":(hr<18?"下午":"晚");
  document.getElementById("wGreet").textContent = `⚡ ${SITE.childName}，${greetT}好！`;
  document.getElementById("wMeta").textContent = `第 ${dayNumber()} 天 · ${fmtDate(todayStr())}`;

  /* 每周主题：与主站同一个函数（content.js 里的 schoolWeekInfo），按开学日自动算 */
  const wi = (typeof schoolWeekInfo==="function" ? schoolWeekInfo() : null) || null;
  const wTheme = document.getElementById("wTheme");
  if(wTheme) wTheme.innerHTML = wi
    ? `<div class="wt-b">📌 ${wi.banner}</div>${wi.focus?`<div class="wt-f">💡 ${wi.focus}</div>`:""}`
    : "";

  /* 第 4 格：开学前显示倒计时，开学后显示「已开学 N 天」（与主站一致） */
  const du = daysUntil(SITE.schoolStart);
  const duNum = du>0 ? du : (du<0 ? -du : 0);
  const duLbl = du>0 ? "距开学" : (du<0 ? "已开学" : "开学日");
  document.getElementById("wStats").innerHTML = `
    <div class="w-stat"><div class="num">${dayStreak()}</div><div class="lbl">连续打卡</div></div>
    <div class="w-stat"><div class="num">${weekDoneCount()}/${weekTotalDays()}</div><div class="lbl">本周三件事</div></div>
    <div class="w-stat"><div class="num">${totalPoints()}</div><div class="lbl">积分</div></div>
    <div class="w-stat"><div class="num">${duNum}</div><div class="lbl">${duLbl}</div></div>
  `;

  const c = DB.checkins[todayStr()] || {eat:{},sleep:{},move:{}};
  if(!c.eat) c.eat={}; if(!c.sleep) c.sleep={}; if(!c.move) c.move={};
  if(c.sleep.bed && c.sleep.wake) c.sleep.done=true;
  const things=[
    {k:"eat.done", icon:"🍎", t:"好好吃饭", cls:"eat", sub:`喝水 ${c.eat.water||0} 杯`},
    {k:"move.done", icon:"🏃", t:"动一动", cls:"move", sub:`跳绳 ${c.move.rope||0} 个`}
  ];
  document.getElementById("wThree").innerHTML = things.map(th=>{
    const [grp,key] = th.k.split(".");
    const checked = c[grp][key] ? "checked" : "";
    return `<label class="w-thing ${th.cls}">
      <input type="checkbox" data-k="${th.k}" ${checked}>
      <div class="t">${th.icon} ${th.t}<div class="d">${th.sub}</div></div>
    </label>`;
  }).join("") + sleepWidget(c);

  document.getElementById("wDone").style.display = allThree(c) ? "block" : "none";

  document.querySelectorAll("#wThree input").forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const c2 = DB.checkins[todayStr()] || {eat:{},sleep:{},move:{}};
      if(!c2.eat) c2.eat={}; if(!c2.sleep) c2.sleep={}; if(!c2.move) c2.move={};
      const k = inp.dataset.k;
      if(inp.type==="checkbox"){ const [grp,key]=k.split("."); c2[grp][key]=inp.checked; }
      else { const [grp,key]=k.split("."); c2[grp][key]=inp.value; if(grp==="sleep") c2.sleep.done=!!(c2.sleep.bed&&c2.sleep.wake); }
      DB.checkins[todayStr()] = c2;
      save();
      renderWidget();
    });
  });
}
function sleepWidget(c){
  const sc=sleepCategory(c);
  const d=sleepMinutes(c.sleep.bed, c.sleep.wake);
  const dur = d===null? "" : ` · ${(Math.floor(d/60))}h${d%60}m`;
  return `<div class="w-thing sleep">
    <div class="t">😴 好好睡觉<div class="d">🛏<input type="time" class="w-time" data-k="sleep.bed" value="${c.sleep.bed||"21:00"}"> ⏰<input type="time" class="w-time" data-k="sleep.wake" value="${c.sleep.wake||"07:00"}">${dur}</div></div>
    <div class="ws-core">${sc?("🌟 "+sc.pts+" 分 · "+sc.label):"填时间自动算分"}</div>
  </div>`;
}

window.addEventListener("DOMContentLoaded", renderWidget);
