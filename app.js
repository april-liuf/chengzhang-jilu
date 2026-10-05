/* ===== 成长记录 · 交互逻辑 ===== */
const KEY = "growth_v1";
let DB = load();

function load(){
  try{
    const r = localStorage.getItem(KEY);
    if(r){
      const d = JSON.parse(r);
      /* 迁移：莱特纳旧数据只存等级数字 → 升级为 {lv, due} 结构 */
      if(d.leitner){ for(const k in d.leitner){ if(typeof d.leitner[k]==="number") d.leitner[k]={lv:d.leitner[k], due:"1999-12-31"}; } }
      return d;
    }
  }catch(e){}
  const def = { checkins:{}, weekly:{}, leitner:{}, diet:[] };
  /* 本地预览（localhost/127.0.0.1）首次打开自动填入示例，方便妈妈看效果；局域网 iPad(192.168.1.33)不受影响 */
  if(location.hostname==="localhost"||location.hostname==="127.0.0.1"){
    def.checkins["2026-09-19"] = {
      eat:    { done:true, waterOk:true, water:4, bf:["daoxiaomian","egg_b","soymilk","veg"] },
      sleep:  { done:true, ok:true, bed:"21:00", wake:"07:10" },
      move:   { done:true, rope:60, min:15, sports:["run"] },
      study:  { english:true, homework:true, german:false, exam:false },
      happy:  ["今天第一次跑步，坚持跑下来了，超开心！","奶奶的刀削面 + 煮鸡蛋 + 豆浆，早餐吃得很满足"]
    };
  }
  return def;
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){} }

/* ---------- 日期工具（统一用本地日期，避免 UTC 混用导致东八区差一天） ---------- */
function _pd(x){ return String(x).padStart(2,"0"); }
function _fmtLocal(d){ return d.getFullYear()+"-"+_pd(d.getMonth()+1)+"-"+_pd(d.getDate()); }
function todayStr(){ return _fmtLocal(new Date()); }
function addDays(ds,n){ const d=new Date(ds+"T00:00:00"); d.setDate(d.getDate()+n); return _fmtLocal(d); }
function fmtDate(s){ const [y,m,d]=s.split("-"); return `${+m}月${+d}日`; }
function mondayOf(s){ const d=new Date(s+"T00:00:00"); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); return _fmtLocal(d); }

/* ---------- 乐乐式首页辅助计算 ---------- */
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m])); }
function daysUntil(ds){ const a=new Date(todayStr()+"T00:00:00"), b=new Date(ds+"T00:00:00"); return Math.round((b-a)/86400000); }
function dayNumber(){ const n=-daysUntil(SITE.startDate); return n<0?1:n+1; }
function allThree(c){ return !!(eatDone(c)&&c.sleep&&c.sleep.done&&c.move&&c.move.done); }
function dayStreak(){
  let s=0, cur=todayStr();
  if(!allThree(DB.checkins[cur])) cur=addDays(cur,-1);
  while(allThree(DB.checkins[cur])){ s++; cur=addDays(cur,-1); }
  return s;
}
function weekTotalDays(){ const mk=mondayOf(todayStr()); const el=Math.round((new Date(todayStr()+"T00:00:00")-new Date(mk+"T00:00:00"))/86400000)+1; return Math.max(1,el); }
function weekDoneCount(){ const mk=mondayOf(todayStr()), t=todayStr(); let n=0; for(let ds=mk;ds<=t;ds=addDays(ds,1)){ if(allThree(DB.checkins[ds])) n++; } return n; }

/* ---------- 积分 / 连续计算 ---------- */
function eatDone(c){ return !!(c&&c.eat&&(c.eat.done || (c.eat.bf&&c.eat.bf.length>=3))); }
function dayPoints(c){
  if(!c) return 0;
  let p=0;
  if(eatDone(c)) p+=POINTS.eatWell;
  if(c.eat && c.eat.waterOk) p+=POINTS.drinkWater;
  const sc=sleepCategory(c); if(sc) p+=sc.pts;
  if(c.move && c.move.done && (c.move.rope||0)>=DAILY_GOALS.jumpRope) p+=POINTS.jumpRope50;
  if(c.move && c.move.sports && c.move.sports.length) p+=POINTS.moveAny;
  if(c.chore && c.chore.list && c.chore.list.length) p += c.chore.list.length * POINTS.chore;
  if(c.study && c.study.english) p+=POINTS.englishRead15;
  if(c.study && c.study.homework) p+=POINTS.finishHomework;
  if(c.study && c.study.german) p+=POINTS.germanReview;
  if(c.study && c.study.exam) p+=POINTS.examPerfect;
  return p;
}
function totalPoints(){ let t=0; for(const k in DB.checkins) t+=dayPoints(DB.checkins[k]); if(DB.weekly) for(const k in DB.weekly) if(DB.weekly[k].reviewed) t+=POINTS.weeklyReview; return t; }
function sleepStreak(){
  let streak=0; let cur=todayStr();
  if(!(DB.checkins[cur] && DB.checkins[cur].sleep && DB.checkins[cur].sleep.done)) cur=addDays(cur,-1);
  while(DB.checkins[cur] && DB.checkins[cur].sleep && DB.checkins[cur].sleep.done){ streak++; cur=addDays(cur,-1); }
  return streak;
}
function sleepMinutes(bed, wake){
  if(!bed||!wake) return null;
  const p=s=>{ const a=(s||"").split(":").map(Number); return (a[0]||0)*60+(a[1]||0); };
  const b=p(bed), w=p(wake); if(isNaN(b)||isNaN(w)) return null;
  return ((w-b)%1440+1440)%1440;
}
function sleepCategory(c){
  if(!c||!c.sleep) return null;
  const d=sleepMinutes(c.sleep.bed, c.sleep.wake); if(d===null) return null;
  const early = (c.sleep.bed||"23:59") <= SLEEP.earlyCutoff;   // "HH:MM" 字符串比较即可
  const enough = d/60 >= SLEEP.goalHours;
  if(early && enough) return {key:"earlyEnough", pts:SLEEP.scores.earlyEnough, label:"早睡 + 睡够", desc:"科学作息，满分！"};
  if(early && !enough) return {key:"earlyShort", pts:SLEEP.scores.earlyShort, label:"早睡但时间短", desc:"睡得早，但可以再多睡会儿"};
  if(!early && enough) return {key:"lateEnough", pts:SLEEP.scores.lateEnough, label:"晚睡但睡够", desc:"睡得久，但晚了一点"};
  return {key:"lateShort", pts:SLEEP.scores.lateShort, label:"晚睡且时间短", desc:"要加油，早点上床多睡会儿"};
}
/* 睡眠质量统计：遍历所有打卡日，按四档矩阵累计 */
function sleepQualityStats(){
  const s={earlyEnough:0, earlyShort:0, lateEnough:0, lateShort:0, total:0};
  for(const k in DB.checkins){
    const c=DB.checkins[k];
    if(!(c&&c.sleep&&c.sleep.done)) continue;
    s.total++;
    const cat=sleepCategory(c); if(cat) s[cat.key]++;
  }
  return s;
}
/* 连续“早睡+睡够”满分天数（真正的睡眠质量连续 streak） */
function fullStreak(){
  let streak=0, cur=todayStr();
  const isFull=c=> c&&c.sleep&&c.sleep.done&&sleepCategory(c)&&sleepCategory(c).key==="earlyEnough";
  if(!isFull(DB.checkins[cur])) cur=addDays(cur,-1);
  while(isFull(DB.checkins[cur])){ streak++; cur=addDays(cur,-1); }
  return streak;
}
function updateSleepInfo(c){
  const info=document.getElementById("sleepInfo");
  const score=document.getElementById("sleepScore");
  const cat=c&&sleepCategory(c);
  if(info){
    const d=sleepMinutes(c&&c.sleep&&c.sleep.bed, c&&c.sleep&&c.sleep.wake);
    if(d===null){ info.textContent="填写入睡和起床时间，自动算睡眠时长"; }
    else {
      const h=Math.floor(d/60), m=d%60;
      info.innerHTML=`😴 睡眠时长 <b>${h} 小时 ${m} 分</b> · 科学目标 ≥ ${SLEEP.goalHours} 小时<br>${cat.label}：${cat.desc}（<b>${cat.pts} 分</b>）`;
    }
  }
  if(score){ score.textContent = cat ? ("🌟 "+cat.pts+" 分") : ""; }
}
function countDays(pred){ let n=0; for(const k in DB.checkins) if(pred(DB.checkins[k])) n++; return n; }
function moveStreak(){
  let streak=0,cur=todayStr();
  if(!(DB.checkins[cur]&&DB.checkins[cur].move&&DB.checkins[cur].move.done)) cur=addDays(cur,-1);
  while(DB.checkins[cur]&&DB.checkins[cur].move&&DB.checkins[cur].move.done){ streak++; cur=addDays(cur,-1); }
  return streak;
}

/* ---------- 积分等级（8 级阶梯） ---------- */
function levelInfo(total){
  let lvl=1, rem=total;
  for(let i=0;i<LEVEL_STEPS.length;i++){
    if(rem>=LEVEL_STEPS[i]){ rem-=LEVEL_STEPS[i]; lvl++; }
    else break;
  }
  const isMax = lvl>=LEVEL_NAMES.length;
  const need = isMax ? 0 : LEVEL_STEPS[lvl-1];
  return { level:lvl, inLevel:rem, need:need, isMax:isMax, name:LEVEL_NAMES[lvl-1], nextName:isMax?"":LEVEL_NAMES[lvl] };
}

/* ---------- 顶部统计（首页英雄区 4 个数字 + 等级） ---------- */
function renderStats(){
  const du = daysUntil(SITE.schoolStart);
  const cdNum = du>0 ? du : (du<0 ? -du : 0);
  const cdLbl = du>0 ? "距开学" : (du<0 ? "已开学" : "开学日");
  const cd = document.getElementById("stat-countdown"); if(cd) cd.textContent = cdNum;
  const cdL = document.getElementById("lbl-countdown"); if(cdL) cdL.textContent = cdLbl;
  document.getElementById("stat-streak").textContent = dayStreak();
  document.getElementById("stat-week").textContent = weekDoneCount()+"/"+weekTotalDays();
  document.getElementById("stat-total").textContent = totalPoints();
  const li = levelInfo(totalPoints());
  const lvEl = document.getElementById("levelInfo");
  if(lvEl) lvEl.textContent = `L${li.level} ${li.name}` + (li.isMax ? "（满级🏆）" : ` · 本级 ${li.inLevel}/${li.need}`);
  const lbEl = document.getElementById("levelBar");
  if(lbEl) lbEl.style.width = li.isMax ? "100%" : Math.min(100, Math.round(li.inLevel/li.need*100)) + "%";
}

/* ---------- 导航 ---------- */
function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".sidebar-nav button").forEach(b=>b.classList.toggle("active", b.dataset.target===id));
  window.scrollTo({top:0,behavior:"smooth"});
  if(window.innerWidth<=800) setSidebar(false);
}

/* ================= 今日三件事（乐乐式单屏英雄页） ================= */
function renderToday(dateStr){
  dateStr = dateStr || todayStr();
  const c = DB.checkins[dateStr] || {eat:{},sleep:{},move:{},study:{},chore:{},self:[],happy:[]};
  if(!c.eat) c.eat={}; if(!c.sleep) c.sleep={}; if(!c.move) c.move={}; if(!c.study) c.study={}; if(!c.chore) c.chore={}; if(!c.self) c.self=[]; if(!c.happy) c.happy=[];
  const sec = document.getElementById("today");

  const hr=new Date().getHours();
  const greetT = hr<11?"早":(hr<18?"下午":"晚");
  const dn = dayNumber();

  const selfHtml = c.self.length ? c.self.map((t,i)=>`
    <div class="self-item ${t.done?"done":""}" data-i="${i}">
      <input type="checkbox" data-self="${i}" ${t.done?"checked":""}>
      <span class="t">${escapeHtml(t.t)}</span>
      <button class="del" data-del="${i}" title="删除">×</button>
    </div>`).join("") : `<div class="self-empty">还没有添加任务。定 1–3 件就好，做完就是胜利。</div>`;

  const happyHtml = (c.happy&&c.happy.length) ? c.happy.map((t,i)=>`
    <div class="happy-item" data-i="${i}">
      <span class="h-emoji">😊</span>
      <span class="h-t">${escapeHtml(t)}</span>
      <button class="del" data-hdel="${i}" title="删除">×</button>
    </div>`).join("") : `<div class="self-empty">今天还没有记录开心的事。来写一件吧～</div>`;

  sec.innerHTML = `
    <div class="hero">
      <div class="greet">⚡ ${escapeHtml(SITE.childName)}，${greetT}好！</div>
      <div class="motto">${escapeHtml(SITE.motto)}</div>
      <div class="stat-tiles">
        <div class="tile"><span class="num" id="stat-countdown">—</span><span class="lbl" id="lbl-countdown">距开学</span></div>
        <div class="tile"><span class="num" id="stat-streak">0</span><span class="lbl">连续打卡</span></div>
        <div class="tile"><span class="num" id="stat-week">0/1</span><span class="lbl">本周三件事</span></div>
        <div class="tile"><span class="num" id="stat-total">0</span><span class="lbl">积分</span></div>
      </div>
      <div class="level-banner">🏅 <span id="levelInfo">L1 萌芽小超人</span></div>
      <div class="level-wrap"><div class="level-bar" id="levelBar"></div></div>
      <div class="theme-banner">📌 第 ${dn} 天 · ${escapeHtml(SITE.weeklyTheme)}</div>
    </div>

    <div class="card">
      <div class="today-head">
        <span class="pill">${dateStr===todayStr()?"今天":fmtDate(dateStr)}</span>
        <span class="muted">先把底层燃料填满，再谈学习 🚀</span>
        <span class="datepick">改日期（出差补打卡）：
          <input type="date" id="pick" value="${dateStr}" max="${todayStr()}">
        </span>
      </div>

      <h3 class="three-title">📋 今天的三件事</h3>
      <div class="three">
        <div class="thing eat">
          <div class="thing-top"><span>🍎 好好吃饭</span><span class="bf-count" id="bfCount"></span></div>
          <div class="thing-detail">
            💧 喝水 <input type="number" min="0" data-k="eat.water" value="${c.eat.water||0}"> 杯
            <label style="display:inline-flex;gap:6px;align-items:center;margin-left:10px;font-size:13px"><input type="checkbox" data-k="eat.waterOk" ${c.eat.waterOk?"checked":""}> 好好喝水（+1）</label>
            ${BREAKFAST.favorites.length?`<div class="bf"><span class="bf-note">${BREAKFAST.note}</span><div class="chips">${BREAKFAST.favorites.map(f=>`<button type="button" class="chip ${ (c.eat.bf||[]).includes(f.id)?"on":"" }" data-bf="${f.id}">${f.name}</button>`).join("")}</div></div>`:""}
            <div class="bf-tip">✅ 早餐选够 <b>3 项</b> 就 +1 分（已选 <span id="bfN">${(c.eat.bf||[]).length}</span> 项）</div>
          </div>
        </div>
        <div class="thing sleep">
          <div class="thing-top"><span>😴 好好睡觉</span><span class="bf-count" id="sleepScore"></span></div>
          <div class="thing-detail">🛏 昨晚入睡 <input type="time" data-k="sleep.bed" value="${c.sleep.bed||"21:00"}"> · ⏰ 今早起床 <input type="time" data-k="sleep.wake" value="${c.sleep.wake||"07:00"}"></div>
          <div class="bf-tip" id="sleepInfo"></div>
        </div>
        <div class="thing move">
          <div class="thing-top"><span>🏃 动一动</span><span class="bf-count" id="sportCount"></span></div>
          <div class="thing-detail">🪢 跳绳 <input type="number" min="0" data-k="move.rope" value="${c.move.rope||0}"> 个（≥50 个 +2 分）</div>
          <div class="bf"><span class="bf-note">做了任意运动就 +3 分 👇（以后想加项目，告诉妈妈往里加）</span><div class="chips">${SPORT.sports.map(s=>`<button type="button" class="chip ${ (c.move.sports||[]).includes(s.id)?"on":"" }" data-sport="${s.id}">${s.icon} ${s.name}</button>`).join("")}</div></div>
        </div>
      </div>

      <details class="more">
        <summary>📚 今天的学习（可选打钩）</summary>
        <div class="cat-grid">
          <div class="cat move" style="background:linear-gradient(135deg,#2D9CDB,#1B7FB8)">
            <label><input type="checkbox" data-k="study.math" ${c.study.math?"checked":""}> 数学 15–20 分钟</label>
            <label><input type="checkbox" data-k="study.english" ${c.study.english?"checked":""}> 英语阅读 ${DAILY_GOALS.englishReadMin} 分</label>
          </div>
          <div class="cat eat" style="background:linear-gradient(135deg,#6C5CE7,#5145c9)">
            <label><input type="checkbox" data-k="study.german" ${c.study.german?"checked":""}> 德语单词 ${DAILY_GOALS.germanWords} 个</label>
            <label><input type="checkbox" data-k="study.homework" ${c.study.homework?"checked":""}> 完成作业</label>
            <label><input type="checkbox" data-k="study.exam" ${c.study.exam?"checked":""}> 📝 考试全对（+5 分）</label>
          </div>
          <div class="cat sleep" style="background:linear-gradient(135deg,#27AE60,#1E8C4C)">
            <div class="sub" style="font-size:15px;font-weight:800">今日可得积分</div>
            <div class="de" id="live-points" style="font-size:30px;font-weight:800">${dayPoints(c)} 分</div>
          </div>
        </div>
      </details>

      <div class="savebar" style="margin-top:14px">
        <button class="btn green" id="saveToday">💾 保存今天</button>
        <span class="muted" id="savedTip"></span>
      </div>
      <div class="note-line">💡 妈妈出差也没关系——选上面的日期，随时回来补打卡 ✅</div>
    </div>

    <div class="card chore">
      <div class="today-head">
        <span class="pill">🧹 劳动小能手</span>
        <span class="muted">做了就点一下，每项 +1 分</span>
        <span class="bf-count" id="choreCount"></span>
      </div>
      <div class="bf">
        <span class="bf-note">👶 小孩子能做的劳动，挑今天做了的打钩（以后想加项目，告诉妈妈往里加）</span>
        <div class="chips">${CHORES.map(ch=>`<button type="button" class="chip ${ (c.chore&&c.chore.list||[]).includes(ch.id)?"on":"" }" data-chore="${ch.id}">${ch.icon} ${ch.name}</button>`).join("")}</div>
      </div>
      <div class="bf-tip" id="choreTip"></div>
    </div>

    <div class="card happy">
      <h3>😊 今天的 Happy Things</h3>
      <div id="happyList">${happyHtml}</div>
      <div class="self-add">
        <input id="happyInput" placeholder="今天有什么开心的事？写下来留住它～">
        <button class="btn" id="happyAdd">＋ 添加</button>
      </div>
      <div class="note-line">开心的瞬间值得被记得。写 1 件还是 N 件，都行 ✨</div>
    </div>

    <div class="card self">
      <h3>✍️ 我自己加的任务</h3>
      <div id="selfList">${selfHtml}</div>
      <div class="self-add">
        <input id="selfInput" placeholder="定 1–3 件就好，做完就是胜利">
        <button class="btn" id="selfAdd">＋ 添加</button>
      </div>
      <div class="note-line">今天有哪三件小事，是你做到了的？</div>
    </div>

    <div class="encourage">今天做的事，正在通往哪里？🌟</div>`;

  renderStats();

  document.getElementById("pick").addEventListener("change", e=>renderToday(e.target.value));

  sec.querySelectorAll("input[data-k]").forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const c2 = DB.checkins[dateStr] || {eat:{},sleep:{},move:{},study:{}};
      if(!c2.eat)c2.eat={};if(!c2.sleep)c2.sleep={};if(!c2.move)c2.move={};if(!c2.study)c2.study={};if(!c2.self)c2.self=[];
      const k=inp.dataset.k; const [grp,key]=k.split(".");
      if(inp.type==="checkbox") c2[grp][key]=inp.checked;
      else c2[grp][key]= inp.type==="number" ? (+inp.value||0) : inp.value;
      if(grp==="sleep"){ c2.sleep.done = !!(c2.sleep.bed && c2.sleep.wake); updateSleepInfo(c2); }   // 填了入睡+起床即算"好好睡觉"完成
      if(grp==="move"){ c2.move.done = ((c2.move.sports&&c2.move.sports.length>0) || (c2.move.rope||0)>=DAILY_GOALS.jumpRope); }
      DB.checkins[dateStr]=c2; save();                    // 自动保存，孩子勾了就存
      const live=document.getElementById("live-points");
      if(live) live.textContent = dayPoints(c2)+" 分";
      renderStats();
    });
  });

  sec.querySelectorAll(".chip[data-bf]").forEach(ch=>{
    ch.addEventListener("click",()=>{
      const c3 = DB.checkins[dateStr] || {eat:{},sleep:{},move:{},study:{}};
      if(!c3.eat)c3.eat={}; if(!c3.eat.bf)c3.eat.bf=[];
      const id=ch.dataset.bf; const arr=c3.eat.bf; const i=arr.indexOf(id);
      if(i>=0) arr.splice(i,1); else arr.push(id);
      c3.eat.done = arr.length>=3;                       // 选够 3 项即达成“好好吃饭”
      DB.checkins[dateStr]=c3; save();
      ch.classList.toggle("on");
      const n=arr.length;
      const bn=document.getElementById("bfN"); if(bn) bn.textContent=n;
      const bc=document.getElementById("bfCount"); if(bc) bc.textContent= n>=3?"🎉 已得 +1 分":`还差 ${3-n} 项`;
      const live=document.getElementById("live-points"); if(live) live.textContent=dayPoints(c3)+" 分";
      renderStats();
    });
  });

  sec.querySelectorAll(".chip[data-sport]").forEach(ch=>{
    ch.addEventListener("click",()=>{
      const c4 = DB.checkins[dateStr] || {eat:{},sleep:{},move:{},study:{}};
      if(!c4.move)c4.move={}; if(!c4.move.sports)c4.move.sports=[];
      const id=ch.dataset.sport; const arr=c4.move.sports; const i=arr.indexOf(id);
      if(i>=0) arr.splice(i,1); else arr.push(id);
      c4.move.done = arr.length>0 || (c4.move.rope||0)>=DAILY_GOALS.jumpRope;
      DB.checkins[dateStr]=c4; save();
      ch.classList.toggle("on");
      const n=arr.length;
      const sc=document.getElementById("sportCount"); if(sc) sc.textContent= n>0?"🎉 已得 +3 分":"";
      const live=document.getElementById("live-points"); if(live) live.textContent=dayPoints(c4)+" 分";
      renderStats();
    });
  });

  sec.querySelectorAll(".chip[data-chore]").forEach(ch=>{
    ch.addEventListener("click",()=>{
      const c9 = DB.checkins[dateStr] || {eat:{},sleep:{},move:{},study:{},chore:{}};
      if(!c9.chore)c9.chore={}; if(!c9.chore.list)c9.chore.list=[];
      const id=ch.dataset.chore; const arr=c9.chore.list; const i=arr.indexOf(id);
      if(i>=0) arr.splice(i,1); else arr.push(id);
      DB.checkins[dateStr]=c9; save();
      ch.classList.toggle("on");
      const n=arr.length;
      const cc=document.getElementById("choreCount"); if(cc) cc.textContent= n>0?`🎉 已得 +${n} 分`:"";
      const ct=document.getElementById("choreTip"); if(ct) ct.textContent= n>0?`今天做了 ${n} 项劳动，太棒了！`:"选一项劳动试试看～";
      const live=document.getElementById("live-points"); if(live) live.textContent=dayPoints(c9)+" 分";
      renderStats();
    });
  });

  const _bfn=(c.eat.bf||[]).length; const _bc=document.getElementById("bfCount"); if(_bc) _bc.textContent= _bfn>=3?"🎉 已得 +1 分":`还差 ${3-_bfn} 项`;
  const _sn=(c.move.sports||[]).length; const _sc=document.getElementById("sportCount"); if(_sc) _sc.textContent= _sn>0?"🎉 已得 +3 分":"";
  const _cn=(c.chore&&c.chore.list||[]).length; const _cc=document.getElementById("choreCount"); if(_cc) _cc.textContent= _cn>0?`🎉 已得 +${_cn} 分`:"";
  const _ct=document.getElementById("choreTip"); if(_ct) _ct.textContent= _cn>0?`今天做了 ${_cn} 项劳动，太棒了！`:"选一项劳动试试看～";
  if(c.sleep.bed && c.sleep.wake) c.sleep.done=true;
  updateSleepInfo(c);

  const selfInput=document.getElementById("selfInput");
  const addSelf=()=>{
    const v=selfInput.value.trim(); if(!v) return;
    const c4=DB.checkins[dateStr]||{eat:{},sleep:{},move:{},study:{},self:[]};
    if(!c4.self)c4.self=[];
    c4.self.push({t:v,done:false}); DB.checkins[dateStr]=c4; save(); renderToday(dateStr);
  };
  document.getElementById("selfAdd").addEventListener("click",addSelf);
  selfInput.addEventListener("keydown",e=>{ if(e.key==="Enter") addSelf(); });

  sec.querySelectorAll("input[data-self]").forEach(cb=>{
    cb.addEventListener("change",()=>{
      const i=+cb.dataset.self; const c5=DB.checkins[dateStr];
      if(c5&&c5.self[i]){ c5.self[i].done=cb.checked; save(); renderToday(dateStr); }
    });
  });
  sec.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const i=+btn.dataset.del; const c6=DB.checkins[dateStr];
      if(c6&&c6.self){ c6.self.splice(i,1); save(); renderToday(dateStr); }
    });
  });

  const happyInput=document.getElementById("happyInput");
  const addHappy=()=>{
    const v=happyInput.value.trim(); if(!v) return;
    const c7=DB.checkins[dateStr]||{eat:{},sleep:{},move:{},study:{},self:[],happy:[]};
    if(!c7.happy)c7.happy=[];
    c7.happy.push(v); DB.checkins[dateStr]=c7; save(); renderToday(dateStr);
  };
  document.getElementById("happyAdd").addEventListener("click",addHappy);
  happyInput.addEventListener("keydown",e=>{ if(e.key==="Enter") addHappy(); });
  sec.querySelectorAll("[data-hdel]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const i=+btn.dataset.hdel; const c8=DB.checkins[dateStr];
      if(c8&&c8.happy){ c8.happy.splice(i,1); save(); renderToday(dateStr); }
    });
  });

  document.getElementById("saveToday").addEventListener("click", ()=>{
    if(!DB.checkins[dateStr]) DB.checkins[dateStr]={eat:{},sleep:{},move:{},study:{},self:[]};
    const s=DB.checkins[dateStr].sleep; s.done=!!(s.bed&&s.wake);
    save(); renderStats();
    const tip=document.getElementById("savedTip");
    tip.textContent="✅ 已保存！"+fmtDate(dateStr);
    setTimeout(()=>tip.textContent="",2500);
  });
}

/* ================= 学习天地 ================= */
function renderStudy(){
  const sec=document.getElementById("study");
  let math = MATH.units.map(u=>`<div class="unit"><div class="no">${u.n||"★"}</div><div class="body"><b>${u.title}</b><div class="cn">${u.desc}</div></div></div>`).join("");
  let eng = ENGLISH.units.filter(u=>u.n>0).map(u=>`<div class="unit"><div class="no">${u.n}</div><div class="body"><b>${u.title}</b> <span class="cn">· ${u.cn}</span><div class="cn">A：${u.a}<br>B：${u.b}<br>🎯 Project：${u.project}</div></div></div>`).join("");
  eng += `<div class="unit"><div class="no">↺</div><div class="body"><b>${ENGLISH.units.find(u=>u.n===0).title}</b> <span class="cn">· ${ENGLISH.units.find(u=>u.n===0).cn}</span><div class="cn">${ENGLISH.units.find(u=>u.n===0).a}</div></div></div>`;
  let readGoals = ENGLISH.readGoals.map(r=>`<tr><td>${r.grade}</td><td>${r.words}</td><td>${r.min}</td></tr>`).join("");
  let ielts = ENGLISH.ielts.map(r=>`<tr><td>${r.stage}</td><td>${r.goal}</td><td>${r.action}</td></tr>`).join("");
  const cats={};
  GERMAN.words.forEach(w=>{ const c=w.cat||"其他"; (cats[c]=cats[c]||[]).push(w); });
  let gerWords = Object.keys(cats).map(c=>`<div style="margin:8px 0 2px"><b style="font-size:13px">${c}（${cats[c].length}）</b><br>${cats[c].map(w=>`<span class="tag b">${w.art?w.art+" ":""}${w.de} · ${w.cn}</span>`).join("")}</div>`).join("");
  let leitner = GERMAN.leitner.map(l=>`<tr><td><b>Box ${l.box}</b></td><td>${l.freq}</td><td>${l.what}</td></tr>`).join("");
  let path = GERMAN.path.map(p=>`<tr><td>${p.grade}</td><td>${p.goal}</td><td>${p.week}</td></tr>`).join("");
  let texts = GERMAN.textbooks.map(t=>`<li>${t}</li>`).join("");
  let planDaily = GERMAN.plan.daily.map(d=>`<tr><td><b>${d.t}</b></td><td>${d.d}</td></tr>`).join("");
  let planWeek = GERMAN.plan.week.map(d=>`<tr><td><b>${d.d}</b></td><td>${d.act}</td></tr>`).join("");
  let planPhases = GERMAN.plan.phases.map(p=>`<tr><td><b>${p.p}</b></td><td>${p.d}</td></tr>`).join("");

  sec.innerHTML = `
    <h2 class="sec">📚 学习天地</h2>

    <div class="card">
      <h3>🧠 数学 · ${MATH.book}</h3>
      <p class="muted">${MATH.tip}</p>
      ${math}
    </div>

    <div class="card">
      <h3>🌟 英语 · ${ENGLISH.book}</h3>
      <p class="muted">${ENGLISH.note}</p>
      ${eng}
      <h4 style="margin:14px 0 4px;">小学 3–6 年级阅读量目标</h4>
      <table class="tbl"><tr><th>年级</th><th>年阅读量</th><th>每天只需</th></tr>${readGoals}</table>
      <h4 style="margin:14px 0 4px;">英语进阶路线（长线，不急）</h4>
      <table class="tbl"><tr><th>阶段</th><th>目标</th><th>行动</th></tr>${ielts}</table>
    </div>

    <div class="card">
      <h3>🌟 德语 · 你的差异化优势</h3>
      <p class="muted">考试目标：<b>${GERMAN.exam}</b></p>
      <p class="muted">${GERMAN.school}</p>
      <p style="font-size:13px"><b>常见教材（供预习参考）：</b></p>
      <ul class="clean">${texts}</ul>
      <p class="muted">${GERMAN.note}</p>
      <h4 style="margin:14px 0 4px;">德语学习路径</h4>
      <table class="tbl"><tr><th>年级</th><th>德语目标</th><th>每周投入</th></tr>${path}</table>
      <h4 style="margin:16px 0 4px;">📅 背单词作战计划（每天 10 分钟）</h4>
      <p class="muted">目标：${GERMAN.plan.goal}<br>${GERMAN.plan.exam}</p>
      <table class="tbl"><tr><th>每日三段</th><th>做什么</th></tr>${planDaily}</table>
      <table class="tbl"><tr><th>每周节奏</th><th>安排</th></tr>${planWeek}</table>
      <table class="tbl"><tr><th>阶段</th><th>目标</th></tr>${planPhases}</table>
      <p class="muted">📦 实体莱特纳盒子：${GERMAN.plan.physical}</p>
      <h4 style="margin:14px 0 4px;">📝 记单词的科学方法：莱特纳盒子（间隔重复）</h4>
      <table class="tbl"><tr><th>盒子</th><th>复习频率</th><th>放什么单词</th></tr>${leitner}</table>
      <p class="muted">规则：答对升盒（复习间隔拉长），答错退回 Box 1（明天再见）。下面这台卡片机就是照着这个规则自动排程的 👇</p>
      <div id="flash"></div>
      <h4 style="margin:16px 0 4px;">词库 · 按主题分组（可在 content.js 里随意加）</h4>
      <div>${gerWords}</div>
    </div>`;
  renderFlash();
}

/* ---- 德语单词卡（莱特纳盒子 · 真间隔排程） ----
   每个词存 {lv:0-4, due:"YYYY-MM-DD"}；lv0=新词。
   认识 → 升盒，按盒间隔（1/3/7/30 天）定下次复习日；不认识 → 回 Box1，明天再见。 */
const BOX_IVL={1:1,2:3,3:7,4:30};
let flashRevealed=false;
function leitnerOf(de){ const s=DB.leitner[de]; return (s&&s.lv)?s:{lv:0,due:"1999-12-31"}; }
function dueWords(){
  const t=todayStr();
  return GERMAN.words
    .filter(w=>leitnerOf(w.de).due<=t)
    .sort((a,b)=>leitnerOf(a.de).due.localeCompare(leitnerOf(b.de).due));
}
function renderFlash(){
  const box=document.getElementById("flash"); if(!box) return;
  const counts=[1,2,3,4].map(b=>GERMAN.words.filter(w=>leitnerOf(w.de).lv===b).length);
  const stat=`Box1 ${counts[0]} · Box2 ${counts[1]} · Box3 ${counts[2]} · Box4 ${counts[3]}`;
  const learned=counts[0]+counts[1]+counts[2]+counts[3];
  const q=dueWords();
  if(!q.length){
    box.innerHTML=`
    <div class="flash">
      <div class="de">🎉</div>
      <div class="cn"><b>今天的盒子清空啦！</b></div>
      <div class="note-line">已学 ${learned} / ${GERMAN.words.length} 词 · ${stat}<br>明天再来，或者去 content.js 里加新词</div>
    </div>`;
    return;
  }
  const w=q[0], s=leitnerOf(w.de);
  const meter=[1,2,3,4].map(b=>`<div class="b ${s.lv>=b?"on":""}">Box ${b}</div>`).join("");
  box.innerHTML=`
    <div class="flash">
      <div class="art">${w.art?("("+w.art+")"):"单词"} · ${w.cat||""} · 今日到期 ${q.length} 个</div>
      <div class="de">${w.de}</div>
      ${flashRevealed?`<div class="cn">${w.cn}</div><div class="ex">${w.ex}</div>`:`<div class="cn" style="color:#bbb">想一想它的意思，再点“显示中文”</div>`}
      <div class="boxmeter">${meter}</div>
      <div class="flash-btns">
        ${flashRevealed?
          `<button class="btn green" id="kNow">✅ 认识（升盒）</button>
           <button class="btn" style="background:var(--red)" id="kNo">🔁 不认识（回 Box1）</button>`
          :`<button class="btn" id="kShow">👀 显示中文</button>`}
        <button class="btn ghost" id="kSkip">⏭ 跳过（明天见）</button>
      </div>
      <div class="note-line">已学 ${learned} / ${GERMAN.words.length} · ${stat} · 升到 Box4 = 长期记住</div>
    </div>`;
  const show=document.getElementById("kShow");
  if(show) show.onclick=()=>{flashRevealed=true;renderFlash();};
  const now=document.getElementById("kNow");
  if(now) now.onclick=()=>{
    const nl=Math.min(4,s.lv+1);
    DB.leitner[w.de]={lv:nl, due:addDays(todayStr(),BOX_IVL[nl])};
    save(); flashRevealed=false; renderFlash();
  };
  const no=document.getElementById("kNo");
  if(no) no.onclick=()=>{ DB.leitner[w.de]={lv:1, due:addDays(todayStr(),1)}; save(); flashRevealed=false; renderFlash(); };
  const skip=document.getElementById("kSkip");
  if(skip) skip.onclick=()=>{ const cur=leitnerOf(w.de); DB.leitner[w.de]={lv:cur.lv, due:addDays(todayStr(),1)}; save(); flashRevealed=false; renderFlash(); };
}

/* ================= 运动能量站 ================= */
function renderSport(){
  const sec=document.getElementById("sport");
  let ben=SPORT.benefits.map(b=>`<div class="badge" style="border:none;background:#FFF3E6"><div class="ico">${b.icon}</div><div style="font-weight:800;margin:4px 0">${b.t}</div><div class="tt">${b.d}</div></div>`).join("");
  let levels=SPORT.levels.map(L=>{
    let items=L.items.map(i=>`<div class="unit" style="margin:6px 0"><div class="no" style="background:var(--orange)">${i.icon}</div><div class="body"><b>${i.name}</b> <span class="cn">· ${i.time}</span><div class="cn">${i.detail}</div></div></div>`).join("");
    return `<div class="card"><h3>${L.lv}</h3>${items}<p class="muted">🎯 ${L.goal}</p></div>`;
  }).join("");
  // 最近7天运动打卡
  let week="";
  for(let i=6;i>=0;i--){ const ds=addDays(todayStr(),-i); const c=DB.checkins[ds]; const ok=c&&c.move&&c.move.done; week+=`<div class="badge ${ok?"got":""}"><div class="ico">${ok?"✅":"⭕"}</div><div class="tt">${fmtDate(ds)}<br>${ok?(c.move.rope||0)+"个":""}</div></div>`; }

  // 挑战运动（与首页“动一动”一致；做了任意一项就 +3 分）
  let chal=SPORT.sports.map(s=>`<div class="badge" style="border:none;background:#E8F5E9"><div class="ico">${s.icon}</div><div style="font-weight:800;margin:4px 0">${s.name}</div><div style="margin-top:4px;color:var(--green-d);font-weight:800">做了就 +3 分</div></div>`).join("");

  sec.innerHTML=`
    <h2 class="sec">🏃 运动能量站</h2>
    <div class="card"><p class="muted">运动是对大脑最好的投资！运动后立刻学习，效率最高。</p>
      <div class="badge-row">${ben}</div></div>
    ${levels}
    <div class="card"><h3>📅 最近 7 天运动打卡</h3><div class="badge-row">${week}</div>
      <p class="muted">连续跳绳 ${moveStreak()} 天 · 去“今日三件事”补打卡 →</p></div>
    <div class="card"><h3>🏅 今天的挑战运动（做了任意一项 +3 分）</h3>
      <p class="muted">不是每天必做，在“今日三件事 → 动一动”里点一下就记上，立刻加分！想加新项目，告诉妈妈往里加。</p>
      <div class="badge-row">${chal}</div></div>`;
}

/* ================= 时间小管家 ================= */
let pomoTimer=null, pomoLeft=25*60, pomoMode="专注";
function renderTime(){
  const sec=document.getElementById("time");
  let sch=SCHEDULE.map(s=>`<tr><td><b>${s.time}</b></td><td>${s.act}</td><td class="muted">${s.note}</td></tr>`).join("");
  const wk=mondayOf(todayStr()); const w=DB.weekly[wk]||{};
  sec.innerHTML=`
    <h2 class="sec">⏰ 时间小管家</h2>
    <div class="card"><h3>📋 三年级作息建议</h3>
      <table class="tbl"><tr><th>时间段</th><th>活动</th><th>备注</th></tr>${sch}</table>
      <p class="muted">时间管理的本质不是填满时间，而是选最重要的事，然后专注做好它。</p>
    </div>

    <div class="card"><h3>🍅 番茄钟（专注 25 + 休息 5）</h3>
      <div class="pomo">
        <div class="clock" id="pomoClock">25:00</div>
        <div class="mode" id="pomoMode">专注时间</div>
        <div class="pomo-btns">
          <button class="btn" id="pomoStart">▶ 开始</button>
          <button class="btn ghost" id="pomoReset">↺ 重置</button>
        </div>
        <p class="muted">三年级可先从“15 分钟专注 + 5 分钟休息”开始，慢慢加到 25 分钟。</p>
      </div>
    </div>

    <div class="card"><h3>🗓 周看板（每周日小计划会议）</h3>
      <p class="muted">本周（${fmtDate(wk)} 起）</p>
      <b>本周三大目标</b>
      <input class="week-input" id="wg1" placeholder="目标 1" value="${w.g1||""}">
      <input class="week-input" id="wg2" placeholder="目标 2" value="${w.g2||""}">
      <input class="week-input" id="wg3" placeholder="目标 3" value="${w.g3||""}">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        <input class="week-input" style="flex:1;min-width:140px" id="wm" placeholder="运动目标（如：跳绳___个）" value="${w.moveGoal||""}">
        <input class="week-input" style="flex:1;min-width:140px" id="ws" placeholder="学习目标（如：数学___题）" value="${w.studyGoal||""}">
        <input class="week-input" style="flex:1;min-width:140px" id="wh" placeholder="习惯目标（如：___点睡）" value="${w.habitGoal||""}">
      </div>
      <label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-size:14px">
        <input type="checkbox" id="wrev" ${w.reviewed?"checked":""}> 本周已完成复盘（+5 分）</label>
      <div class="savebar" style="margin-top:10px"><button class="btn green" id="saveWeek">💾 保存周看板</button><span class="muted" id="wkTip"></span></div>
    </div>`;

  document.getElementById("pomoStart").onclick=togglePomo;
  document.getElementById("pomoReset").onclick=()=>{ clearInterval(pomoTimer); pomoTimer=null; pomoMode="专注"; pomoLeft=25*60; updatePomo(); };
  document.getElementById("saveWeek").onclick=()=>{
    DB.weekly[wk]={ g1:val("wg1"),g2:val("wg2"),g3:val("wg3"),moveGoal:val("wm"),studyGoal:val("ws"),habitGoal:val("wh"),reviewed:document.getElementById("wrev").checked };
    save(); renderStats();
    const t=document.getElementById("wkTip"); t.textContent="✅ 已保存！"; setTimeout(()=>t.textContent="",2500);
  };
}
function val(id){ const e=document.getElementById(id); return e?e.value:""; }
function updatePomo(){ const m=String(Math.floor(pomoLeft/60)).padStart(2,"0"); const s=String(pomoLeft%60).padStart(2,"0");
  const c=document.getElementById("pomoClock"); if(c)c.textContent=`${m}:${s}`;
  const md=document.getElementById("pomoMode"); if(md)md.textContent=pomoMode+"时间"; }
function togglePomo(){
  if(pomoTimer){ clearInterval(pomoTimer); pomoTimer=null; document.getElementById("pomoStart").textContent="▶ 继续"; return; }
  document.getElementById("pomoStart").textContent="⏸ 暂停";
  pomoTimer=setInterval(()=>{
    pomoLeft--;
    if(pomoLeft<=0){ clearInterval(pomoTimer); pomoTimer=null; pomoMode = pomoMode==="专注"?"休息":"专注"; pomoLeft = pomoMode==="专注"?25*60:5*60; document.getElementById("pomoStart").textContent="▶ 开始"; }
    updatePomo();
  },1000);
  updatePomo();
}

/* ================= 成长里程碑 ================= */
function sleepBar(label, n, total, color){
  const pct = total>0 ? Math.round(n/total*100) : 0;
  return `<div style="margin:8px 0">
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span>${label}</span><b>${n} 天 · ${pct}%</b></div>
    <div style="height:9px;background:#EDEDF2;border-radius:6px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${color};border-radius:6px"></div></div>
  </div>`;
}
function renderMilestone(){
  const sec=document.getElementById("milestone");
  const ms=moveStreak(), ss=sleepStreak(), fs=fullStreak(), sq=sleepQualityStats(), rd=countDays(c=>c.study&&c.study.english), mt=countDays(c=>c.study&&c.study.math), gw=Object.keys(DB.leitner).length;
  const valOf={ "🏃 运动":ms, "📚 阅读":rd, "🔢 数学":mt, "💤 睡眠":sq.earlyEnough, "📝 德语":gw };
  const thr={ "🏃 运动":[7,21,50], "📚 阅读":[5,10,20], "🔢 数学":[50,100,200], "💤 睡眠":[7,21,50], "📝 德语":[50,100,200] };
  let rows=ACHIEVEMENTS.map(a=>{
    const v=valOf[a.cat]||0; const [b,s,g]=thr[a.cat];
    const mk=(txt,th,got)=>`<div class="badge ${got?"got":""}"><div class="ico">${got?"🏅":"🔒"}</div><div class="tt">${txt}<br>${v}/${th}</div></div>`;
    return `<div class="card"><h3>${a.cat}</h3><div class="badge-row">
      ${mk("🥉 "+a.bronze,b,v>=b)} ${mk("🥈 "+a.silver,s,v>=s)} ${mk("🥇 "+a.gold,g,v>=g)}</div></div>`;
  }).join("");

  let rewards=REWARDS.map(r=>`<tr><td><b>${r.need} 分</b></td><td>${r.text}</td></tr>`).join("");
  let rules=Object.entries(POINTS).map(([k,v])=>`<li>${labelOf(k)}：+${v} 分</li>`).join("");
  let sleepRules=`<li>😴 睡觉打分：早睡(≤${SLEEP.earlyCutoff})+睡够(≥${SLEEP.goalHours}h)= <b>${SLEEP.scores.earlyEnough} 分(满分)</b>；早睡短=${SLEEP.scores.earlyShort}；晚睡睡够=${SLEEP.scores.lateEnough}；晚睡短=${SLEEP.scores.lateShort}</li>`;

  sec.innerHTML=`
    <h2 class="sec">🌟 成长里程碑</h2>
    <div class="card">
      <h3>🌳 目标树</h3>
      <svg viewBox="0 0 320 200" width="100%" style="max-width:420px;display:block;margin:0 auto">
        <line x1="160" y1="200" x2="160" y2="120" stroke="#8B5A2B" stroke-width="10"/>
        <circle cx="160" cy="80" r="46" fill="#27AE60"/>
        <text x="160" y="76" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">终极梦想</text>
        <text x="160" y="94" text-anchor="middle" font-size="10" fill="#eafff0">初中目标</text>
        <text x="80" y="135" text-anchor="middle" font-size="9" fill="#2B2B3A">小学目标</text>
        <text x="240" y="135" text-anchor="middle" font-size="9" fill="#2B2B3A">本学期</text>
        <text x="40" y="170" text-anchor="middle" font-size="9" fill="#7A7A8C">健康习惯</text>
        <text x="280" y="170" text-anchor="middle" font-size="9" fill="#7A7A8C">三语能力</text>
      </svg>
      <p class="muted" style="text-align:center">从小目标出发，一步步往上爬 🪜</p>
    </div>
    <h2 class="sec" style="font-size:18px">🏆 成就墙</h2>
    ${rows}
    <div class="card"><h3>💤 睡眠质量统计</h3>
      <p class="muted">按「早睡(≤${SLEEP.earlyCutoff}) × 睡够(≥${SLEEP.goalHours}h)」四档，统计已打卡的 <b>${sq.total}</b> 天：</p>
      <div style="margin-top:6px">
        ${sleepBar("🌟 早睡+睡够（满分）", sq.earlyEnough, sq.total, "#27AE60")}
        ${sleepBar("🌙 早睡但时间短", sq.earlyShort, sq.total, "#F2C94C")}
        ${sleepBar("☀️ 晚睡但睡够", sq.lateEnough, sq.total, "#56A0E8")}
        ${sleepBar("⚠️ 晚睡且时间短", sq.lateShort, sq.total, "#EB5757")}
      </div>
      <p class="muted" style="margin-top:10px">📅 连续打卡 <b>${ss}</b> 天 · 🌟 连续满分 <b>${fs}</b> 天 · 累计满分 <b>${sq.earlyEnough}</b> 天</p>
    </div>
    <div class="card"><h3>🏅 专属徽章</h3>
      <p class="muted">单项做到位，就能点亮一枚徽章。集齐全部门，就是全能小超人！</p>
      <div class="badge-row" id="badgeWall"></div>
    </div>
    <div class="card"><h3>💎 积分体系</h3>
      <ul class="clean">${rules}${sleepRules}</ul>
      <h4 style="margin:10px 0 4px">积分兑换</h4>
      <table class="tbl"><tr><th>需要</th><th>奖励</th></tr>${rewards}</table>
      <p class="muted">当前累计积分：<b id="ms-total">${totalPoints()}</b> 分</p>
    </div>`;
  renderBadges(document.getElementById("badgeWall"));
}
function labelOf(k){ return {eatWell:"好好吃饭(早餐3项)",drinkWater:"好好喝水",jumpRope50:"跳绳 50 个以上",moveAny:"做了运动",englishRead15:"英语阅读 15 分钟",finishHomework:"完成作业",germanReview:"德语单词复习",examPerfect:"考试全对",weeklyReview:"每周周看板复盘",chore:"劳动(每项+1分)"}[k]||k; }

/* ---- 专属徽章（基于现有数据计算） ---- */
function computeBadges(){
  const vals = {
    moveStreak: moveStreak(),
    sleepStreak: sleepStreak(),
    sleepFullStreak: fullStreak(),
    englishDays: countDays(c=>c.study&&c.study.english),
    germanWords: Object.keys(DB.leitner).length,
    eatDays: countDays(c=>eatDone(c)),
    examCount: countDays(c=>c.study&&c.study.exam),
    choreCount: Object.values(DB.checkins).reduce((s,c)=>s+((c.chore&&c.chore.list)?c.chore.list.length:0),0)
  };
  return BADGES.map(b=>{
    const v=vals[b.src]||0;
    let medal=0; for(let i=0;i<b.tiers.length;i++){ if(v>=b.tiers[i]) medal=i+1; }
    return Object.assign({}, b, { value:v, medal });
  });
}
function renderBadges(box){
  if(!box) return;
  const medals=["","🥉","🥈","🥇"];
  box.innerHTML = computeBadges().map(b=>{
    const tierTxt = b.medal>0 ? `${medals[b.medal]} ${b.tiers[b.medal-1]} 已达成` : `还差 ${Math.max(0,b.tiers[0]-b.value)} 个`;
    return `<div class="badge ${b.medal>0?"got":""}">
      <div class="ico">${b.icon}</div>
      <div style="font-weight:800">${b.name}</div>
      <div class="tt">${b.label}：${b.value}</div>
      <div class="tt" style="color:${b.medal>0?'var(--green-d)':'var(--muted)'}">${tierTxt}</div>
    </div>`;
  }).join("");
}

/* ================= 亲子加油站 ================= */
function renderParent(){
  const sec=document.getElementById("parent");
  let roles=PARENT.roles.map((r,i)=>`<div class="unit"><div class="no" style="background:var(--purple)">${i+1}</div><div class="body">${r}</div></div>`).join("");
  let fuels=PARENT.fuels.map(f=>`<div class="badge" style="border:none;background:#F3EEFF"><div class="ico">${f.icon}</div><div style="font-weight:800">${f.dim}</div><div class="tt">目标：${f.goal}</div><div class="tt">${f.why}</div></div>`).join("");
  let rev=PARENT.review.map(r=>`<div class="card" style="box-shadow:none;border:1px solid var(--line)"><b>${r.step}</b><ul class="clean">${r.qs.map(q=>`<li>${q}</li>`).join("")}</ul></div>`).join("");
  sec.innerHTML=`
    <h2 class="sec">💬 亲子加油站</h2>
    <div class="card"><h3>👨‍👩‍👦 家长专区 · 教练式父母</h3>${roles}</div>
    <div class="card"><h3>🔋 你最该关注的三大“底层燃料”</h3><div class="badge-row">${fuels}</div></div>
    <div class="card"><div style="display:flex;align-items:center;gap:8px">
      <h3 style="margin:0">📝 每周复盘模板</h3><span class="print-btn" id="printRev">🖨 打印 / 存为 PDF</span></div>
      ${rev}
      <p class="muted">每周日，和孩子一起做 15 分钟复盘。先肯定，再看目标，最后定下周计划。</p>
    </div>`;
  document.getElementById("printRev").onclick=()=>window.print();
}

/* ================= 健康饮食 · 方案中心 ================= */
function bmiLabel(b){
  if(b>=20.7) return ["超重","#EB5757"];
  if(b>=18.4) return ["超重边缘","#EB5757"];
  if(b>=16.9) return ["正常偏高 · 目标区间","#FF8A3D"];
  if(b>=15.0) return ["正常","#27AE60"];
  return ["偏瘦","#2D9CDB"];
}
function renderDiet(){
  const sec=document.getElementById("diet");
  const kid=DIET.kid;

  const plate=DIET.plate.map(p=>`<div class="d-slice" style="flex:${p.val};background:${p.color}">
      <b>${p.name} ${p.pct}</b><span>${p.amount}</span><span class="d-tip">${p.tip}</span>
    </div>`).join("");

  const flow=DIET.dayFlow.map(f=>`<div class="d-flow">
      <div class="d-time">${f.time}</div>
      <div class="d-body"><b>${f.place} · ${f.item}</b>
        <div>${f.what}</div><div class="d-key">🔑 ${f.key}</div></div>
    </div>`).join("");

  const snacks=DIET.snacks.map(s=>`<div class="d-snack">
      <div class="ico">${s.icon}</div>
      <div style="flex:1"><b>${s.name}</b><div class="muted">${s.amount}</div></div>
      <span class="tag g">${s.kcal} kcal</span>
    </div>`).join("");

  const swaps=DIET.swaps.map(s=>`<tr>
      <td><b>${s.old}</b><div class="muted">${s.problem}</div></td>
      <td><b>${s.neu}</b><div class="muted">口感保留度 ${s.keep}</div></td>
      <td class="muted">${s.how}</td>
    </tr>`).join("");

  const tabBtns=DIET.menu.map(m=>`<button class="d-tab ${m.id==="mon"?"on":""}" data-day="${m.id}">${m.day}</button>`).join("");
  const tabPanes=DIET.menu.map(m=>{
    const blocks=m.blocks.map(b=>`<div class="d-menu-block"><h4>${b.title}</h4>
      <table class="tbl"><tr><th>吃什么</th><th>份量</th><th>备注</th></tr>
      ${b.rows.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td class="muted">${r[2]||""}</td></tr>`).join("")}</table></div>`).join("");
    return `<div class="d-pane ${m.id==="mon"?"on":""}" data-pane="${m.id}">
      <div class="d-pane-tag">${m.tag}</div>${blocks}</div>`;
  }).join("");

  const mLines=DIET.mantra.lines.map(l=>`<div class="d-m-line"><div class="ico">${l.icon}</div>
      <div><b>${l.text}</b><div class="muted">${l.note}</div></div></div>`).join("");
  const mSteps=DIET.mantra.steps.map((s,i)=>`<div class="d-step"><span>${i+1}</span>${s}</div>`).join("");
  const mAvoid=DIET.mantra.avoid.map(a=>`<li>${a}</li>`).join("");

  const buy=DIET.shopping.buy.map(x=>`<li>${x}</li>`).join("");
  const less=DIET.shopping.less.map(x=>`<li>${x}</li>`).join("");
  const no=DIET.shopping.no.map(x=>`<li>${x}</li>`).join("");
  const labelHead=DIET.label.head.map(h=>`<th>${h}</th>`).join("");
  const labelRows=DIET.label.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("");
  const labelTraps=DIET.label.traps.map(t=>`<li>🚨 ${t}</li>`).join("");

  const good=DIET.tracking.good.map(g=>`<li>${g}</li>`).join("");
  const warn=DIET.tracking.warn.map(w=>`<li>${w}</li>`).join("");

  /* ---- 家庭共识区块 ---- */
  const F=DIET.family;
  const fConsensus=F.consensus.map(c=>`<tr>
    <td><b>${c.step}</b></td>
    <td><span style="color:var(--red-d)">❌ ${c.bad}</span></td>
    <td><span style="color:var(--green-d)">✅ ${c.good}</span></td>
    <td class="muted">${c.why}</td></tr>`).join("");
  const fRules=F.cookRules.map(r=>`<div class="d-snack">
    <div class="ico">${r.icon}</div>
    <div style="flex:1"><b>${r.rule}</b><div class="muted">${r.detail}</div></div></div>`).join("");
  const fPortions=F.cookPortions.map(p=>`<tr>
    <td><b>${p.item}</b></td><td>${p.amount}</td><td class="muted">${p.note}</td></tr>`).join("");
  const fDishFix=F.dishFix.map(d=>`<tr>
    <td><b>${d.dish}</b></td><td class="muted">${d.old}</td>
    <td><span style="color:var(--green-d)">✅ ${d.fix}</span></td></tr>`).join("");
  const fDonts=F.cookDonts.map(d=>`<tr>
    <td><b style="color:var(--red-d)">⚠️ ${d.dont}</b></td>
    <td class="muted">${d.why}</td><td><b>${d.instead}</b></td></tr>`).join("");
  const fTalk=F.talkTips.map(t=>`<tr>
    <td class="muted">${t.scene}</td>
    <td><span style="color:var(--red-d)">❌ ${t.bad}</span></td>
    <td><span style="color:var(--green-d)">✅ ${t.good}</span></td></tr>`).join("");
  const fTactics=F.kidTactics.map(t=>`<div class="d-snack">
    <div class="ico">${t.icon}</div>
    <div style="flex:1"><b>${t.name}</b><div class="muted">${t.desc}</div></div></div>`).join("");
  const fTimeline=F.kidTimeline.map(t=>`<tr>
    <td><b>${t.phase}</b><br><span class="muted">${t.time}</span></td>
    <td>${t.status}</td><td>${t.focus}</td></tr>`).join("");
  const fReactions=F.kidReactions.map(r=>`<tr>
    <td><b>${r.says}</b></td>
    <td><span style="color:var(--red-d)">❌ ${r.bad}</span></td>
    <td><span style="color:var(--green-d)">✅ ${r.good}</span></td></tr>`).join("");
  const fRoles=F.roles.map(r=>`<tr>
    <td><b>${r.role}</b></td><td>${r.does}</td><td class="muted">${r.notDoes}</td></tr>`).join("");

  sec.innerHTML=`
    <h2 class="sec">🍽️ 健康饮食 · 方案中心</h2>

    <div class="card">
      <h3>🧒 孩子档案</h3>
      <div class="badge-row">
        <div class="badge"><div class="ico">📏</div><div class="tt">${kid.height}cm</div></div>
        <div class="badge"><div class="ico">⚖️</div><div class="tt">${kid.weight}kg</div></div>
        <div class="badge"><div class="ico">📊</div><div class="tt">BMI ${kid.bmi}<br>${kid.level}</div></div>
        <div class="badge"><div class="ico">🏃</div><div class="tt">${kid.activity}</div></div>
      </div>
      <p class="muted">🎯 ${DIET.goal}</p>
      <p class="muted">💡 ${DIET.principle}</p>
      <p class="muted">🔋 ${DIET.calories}</p>
    </div>

    <div class="card">
      <h3>🥗 我的餐盘（每餐结构）</h3>
      <div class="d-plate">${plate}</div>
      <p class="muted">调整前主食占 ½ → 现在主食降到 ⅓~⅖，蔬菜、蛋白加量。孩子喊饿 → 加菜加蛋，不加饭。运动训练日当天主食加回 ⅓ 碗。</p>
    </div>

    <div class="card">
      <h3>⏰ 每日节奏</h3>
      ${flow}
    </div>

    <div class="card">
      <h3>🍎 放学加餐（150–200kcal，选 1 组）</h3>
      <div class="d-snacks">${snacks}</div>
      <p class="muted">⚠️ 方便面、薯片、辣条、含糖饮料 → 不放这个时段，留给周日赦免日。</p>
    </div>

    <div class="card">
      <h3>🔄 碳水降级替换表（保留口感 · 升级原料）</h3>
      <table class="tbl"><tr><th>原来的</th><th>✅ 换成</th><th>怎么过渡</th></tr>${swaps}</table>
      <p class="muted">⚠️ 每周只换 1–2 样，给孩子味蕾适应期；孩子抗拒就退回上一步比例，别硬刚。</p>
    </div>

    <div class="card">
      <h3>📅 一周食谱</h3>
      <div class="d-tabs">${tabBtns}</div>
      ${tabPanes}
    </div>

    <div class="card d-mantra">
      <h3>🎒 给孩子 · 打饭口诀（打印贴文具盒）</h3>
      <div class="d-m-title">${DIET.mantra.title}</div>
      ${mLines}
      <div class="d-m-steps">${mSteps}</div>
      <div class="d-m-avoid"><b>🚫 三样少碰</b><ul class="clean">${mAvoid}</ul></div>
    </div>

    <div class="card">
      <h3>🛒 超市采购清单</h3>
      <div class="d-shop">
        <div class="d-shop-col ok"><h4>✅ 该买（常备）</h4><ul class="clean">${buy}</ul></div>
        <div class="d-shop-col warn"><h4>⚠️ 少买（控量）</h4><ul class="clean">${less}</ul></div>
        <div class="d-shop-col bad"><h4>❌ 不买（不出现）</h4><ul class="clean">${no}</ul></div>
      </div>
      <h4 style="margin:14px 0 4px">🔍 零食配料表避雷（每 100g 标准）</h4>
      <table class="tbl"><tr>${labelHead}</tr>${labelRows}</table>
      <ul class="clean">${labelTraps}</ul>
    </div>

    <div class="card">
      <h3>📈 成长追踪（体重每 2 周 / 身高每月）</h3>
      <div class="d-track-form">
        <label>日期<input type="date" id="dtDate" value="${todayStr()}"></label>
        <label>身高<input type="number" id="dtH" placeholder="cm" min="100" max="200"></label>
        <label>体重<input type="number" id="dtW" placeholder="kg" min="15" max="80" step="0.1"></label>
        <button class="btn green" id="dtSave">💾 记录</button>
      </div>
      <div id="dtList"></div>
      <p class="muted">📏 ${DIET.tracking.freq}</p>
    </div>

    <div class="card">
      <h3>🎯 怎么看结果</h3>
      <h4 style="color:var(--green-d)">✅ 向好信号（继续执行）</h4><ul class="clean">${good}</ul>
      <h4 style="color:var(--orange-d)">⚠️ 预警信号（要调整）</h4><ul class="clean">${warn}</ul>
    </div>

    <div class="card">
      <h3>👨‍👩‍👦 家庭共识怎么做</h3>
      <p class="muted">核心：把目标从「减体重」偷换成「促身高」。老人一听「长高」立刻配合。</p>
      <table class="tbl"><tr><th>步骤</th><th>❌ 别这样</th><th>✅ 这样说</th><th>为什么</th></tr>${fConsensus}</table>
    </div>

    <div class="card">
      <h3>👵 老人做饭指南（可打印贴冰箱）</h3>
      <h4>做饭 4 条原则</h4>
      <div class="d-snacks">${fRules}</div>
      <h4 style="margin:14px 0 4px">每日份量参考</h4>
      <table class="tbl"><tr><th>做什么</th><th>份量</th><th>备注</th></tr>${fPortions}</table>
      <h4 style="margin:14px 0 4px">5 道常做菜的微调（不换菜，只改 1 处）</h4>
      <table class="tbl"><tr><th>菜名</th><th>原来的</th><th>✅ 微调后</th></tr>${fDishFix}</table>
      <h4 style="margin:14px 0 4px">⚠️ 3 个「不要」</h4>
      <table class="tbl"><tr><th>不要</th><th>为什么</th><th>换成</th></tr>${fDonts}</table>
      <h4 style="margin:14px 0 4px">💬 跟老人说话的技巧</h4>
      <table class="tbl"><tr><th>场景</th><th>❌ 别说</th><th>✅ 这么说</th></tr>${fTalk}</table>
    </div>

    <div class="card">
      <h3>🧒 让孩子接受方案的 6 招</h3>
      <div class="d-snacks">${fTactics}</div>
      <h4 style="margin:14px 0 4px">📅 接受时间线（⚠️ 第 2-3 周最危险，扛过去就赢了）</h4>
      <table class="tbl"><tr><th>阶段</th><th>孩子状态</th><th>大人重点</th></tr>${fTimeline}</table>
      <h4 style="margin:14px 0 4px">💬 孩子反抗时的应对</h4>
      <table class="tbl"><tr><th>孩子说</th><th>❌ 别说</th><th>✅ 这么说</th></tr>${fReactions}</table>
    </div>

    <div class="card">
      <h3>📋 全家执行分工</h3>
      <table class="tbl"><tr><th>角色</th><th>负责什么</th><th>不负责什么</th></tr>${fRoles}</table>
      <p class="muted" style="margin-top:10px">💡 成败 60% 取决于做饭的人，30% 取决于冰箱里有什么，10% 取决于孩子。先搞定做饭的人，再搞定冰箱，孩子自然跟上。</p>
    </div>`;

  sec.querySelectorAll(".d-tab").forEach(tb=>tb.onclick=()=>{
    sec.querySelectorAll(".d-tab").forEach(x=>x.classList.remove("on"));
    sec.querySelectorAll(".d-pane").forEach(x=>x.classList.remove("on"));
    tb.classList.add("on");
    const pane=sec.querySelector(`.d-pane[data-pane="${tb.dataset.day}"]`);
    if(pane) pane.classList.add("on");
  });

  renderDietTrack();
}

/* ---- 成长追踪（体重/身高记录 + BMI 自动算） ---- */
function renderDietTrack(){
  const box=document.getElementById("dtList"); if(!box) return;

  /* 先绑保存按钮（空状态也要可点，不能提前 return 在绑定之后） */
  const saveBtn=document.getElementById("dtSave");
  if(saveBtn) saveBtn.onclick=()=>{
    const h=parseFloat(document.getElementById("dtH").value);
    const w=parseFloat(document.getElementById("dtW").value);
    const d=document.getElementById("dtDate").value||todayStr();
    if(!h||!w||h<100||h>200||w<15||w>80){ alert("请填写有效的身高和体重（身高cm、体重kg）"); return; }
    const bmi=Math.round(w/((h/100)*(h/100))*10)/10;
    if(!DB.diet) DB.diet=[];
    DB.diet.push({date:d,height:h,weight:w,bmi});
    save();
    document.getElementById("dtH").value="";
    document.getElementById("dtW").value="";
    renderDietTrack();
  };

  /* 先按日期升序，再反转 → 同一天多条时，后录入的也排在前面 */
  const list=(DB.diet||[]).slice().sort((a,b)=>a.date.localeCompare(b.date)).reverse();
  if(!list.length){
    box.innerHTML=`<p class="muted">还没有记录。先记一笔（比如 130cm / 28.5kg），之后每 2 周称一次、每月量一次身高 📏</p>`;
    return;
  }
  const rows=list.map((r,i)=>{
    const [lb,col]=bmiLabel(r.bmi);
    const prev=list[i+1];
    const dh=prev?(r.height-prev.height>0?`+${(r.height-prev.height).toFixed(1)}cm`:`${(r.height-prev.height).toFixed(1)}cm`):"—";
    const dw=prev?(r.weight-prev.weight>0?`+${(r.weight-prev.weight).toFixed(1)}kg`:`${(r.weight-prev.weight).toFixed(1)}kg`):"—";
    return `<tr>
      <td><b>${fmtDate(r.date)}</b></td>
      <td>${r.height}cm<br><span class="muted">${dh}</span></td>
      <td>${r.weight}kg<br><span class="muted">${dw}</span></td>
      <td><b>${r.bmi}</b></td>
      <td><span class="tag" style="background:#fff;color:${col};border:2px solid ${col}">${lb}</span></td>
    </tr>`;
  }).join("");
  box.innerHTML=`<table class="tbl"><tr><th>日期</th><th>身高</th><th>体重</th><th>BMI</th><th>评估</th></tr>${rows}</table>`;
}

/* ================= 初始化 ================= */
function setSidebar(open){
  const sb=document.getElementById("sidebar");
  const bd=document.getElementById("sidebarBackdrop");
  if(sb) sb.classList.toggle("open", open);
  if(bd) bd.classList.toggle("show", open);
}
function init(){
  document.getElementById("childName").textContent=SITE.childName;
  document.getElementById("childMeta").textContent=`${SITE.childAge}岁 · ${SITE.childGrade}`;
  document.getElementById("schoolLine").textContent=SITE.school;
  document.getElementById("ver").textContent=SITE.version;
  renderToday();
  renderStats();
  renderStudy();
  renderSport();
  renderTime();
  renderMilestone();
  renderDiet();
  renderParent();
  document.querySelectorAll(".sidebar-nav button").forEach(b=>b.addEventListener("click",()=>show(b.dataset.target)));
  const menuToggle=document.getElementById("menuToggle");
  const backdrop=document.getElementById("sidebarBackdrop");
  if(menuToggle) menuToggle.addEventListener("click",()=>setSidebar(!document.getElementById("sidebar").classList.contains("open")));
  if(backdrop) backdrop.addEventListener("click",()=>setSidebar(false));
  registerPWA();
  wireDataTools();
  show("today");
}

/* ---- PWA：注册 Service Worker（离线 + 主屏幕安装） ---- */
function registerPWA(){
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
}

/* ---- 数据备份 / 恢复（跨设备：妈妈手机 ↔ 孩子 iPad） ---- */
function wireDataTools(){
  const ex=document.getElementById("exportData");
  if(ex) ex.onclick=()=>{
    const blob=new Blob([JSON.stringify(DB,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download="成长记录-数据备份-"+todayStr()+".json"; a.click();
    URL.revokeObjectURL(a.href);
  };
  const im=document.getElementById("importData");
  if(im) im.onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d&&d.checkins){ DB=d; save(); location.reload(); } }catch(err){ alert("文件格式不对，导入失败"); } };
    r.readAsText(f);
  };
}

window.addEventListener("DOMContentLoaded",init);
