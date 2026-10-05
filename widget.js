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
  if(c.sleep && c.sleep.ok) p+=POINTS.sleepBefore21;
  if(c.move && c.move.done && (c.move.rope||0)>=DAILY_GOALS.jumpRope) p+=POINTS.jumpRope50;
  if(c.study && c.study.english) p+=POINTS.englishRead15;
  if(c.study && c.study.homework) p+=POINTS.finishHomework;
  if(c.study && c.study.german) p+=POINTS.germanReview;
  return p;
}
function totalPoints(){ let t=0; for(const k in DB.checkins) t+=dayPoints(DB.checkins[k]); if(DB.weekly) for(const k in DB.weekly) if(DB.weekly[k].reviewed) t+=POINTS.weeklyReview; return t; }

function renderWidget(){
  const hr=new Date().getHours();
  const greetT = hr<11?"早":(hr<18?"下午":"晚");
  document.getElementById("wGreet").textContent = `⚡ ${SITE.childName}，${greetT}好！`;
  const du = daysUntil(SITE.schoolStart);
  document.getElementById("wMeta").textContent = `第 ${dayNumber()} 天 · ${du>0?"距开学 "+du+" 天":"开学啦 🎒"} · ${fmtDate(todayStr())}`;
  document.getElementById("wStats").innerHTML = `
    <div class="w-stat"><div class="num">${dayStreak()}</div><div class="lbl">连续打卡</div></div>
    <div class="w-stat"><div class="num">${weekDoneCount()}/${weekTotalDays()}</div><div class="lbl">本周三件事</div></div>
    <div class="w-stat"><div class="num">${totalPoints()}</div><div class="lbl">自信币</div></div>
    <div class="w-stat"><div class="num">${du>0?du:"0"}</div><div class="lbl">距开学</div></div>
  `;

  const c = DB.checkins[todayStr()] || {eat:{},sleep:{},move:{}};
  if(!c.eat) c.eat={}; if(!c.sleep) c.sleep={}; if(!c.move) c.move={};
  const things=[
    {k:"eat.done", icon:"🍎", t:"好好吃饭", cls:"eat", sub:`喝水 ${c.eat.water||0} 杯`},
    {k:"sleep.done", icon:"😴", t:"早点睡觉", cls:"sleep", sub:`${c.sleep.bed||"21:00"} 睡`},
    {k:"move.done", icon:"🏃", t:"动一动", cls:"move", sub:`跳绳 ${c.move.rope||0} 个`}
  ];
  document.getElementById("wThree").innerHTML = things.map(th=>{
    const [grp,key] = th.k.split(".");
    const checked = c[grp][key] ? "checked" : "";
    return `<label class="w-thing ${th.cls}">
      <input type="checkbox" data-k="${th.k}" ${checked}>
      <div class="t">${th.icon} ${th.t}<div class="d">${th.sub}</div></div>
    </label>`;
  }).join("");

  document.getElementById("wDone").style.display = allThree(c) ? "block" : "none";

  document.querySelectorAll("#wThree input").forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const c2 = DB.checkins[todayStr()] || {eat:{},sleep:{},move:{}};
      if(!c2.eat) c2.eat={}; if(!c2.sleep) c2.sleep={}; if(!c2.move) c2.move={};
      const [grp,key] = inp.dataset.k.split(".");
      c2[grp][key] = inp.checked;
      if(grp==="sleep") c2.sleep.ok = !!c2.sleep.done;
      DB.checkins[todayStr()] = c2;
      save();
      renderWidget();
    });
  });
}

window.addEventListener("DOMContentLoaded", renderWidget);
