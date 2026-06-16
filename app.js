const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));
const STORAGE_KEY = 'boki3TrainerV2';

const accounts = ['現金','普通預金','売掛金','買掛金','仕入','売上','備品','未払金','給料','支払家賃','借入金','貸付金','受取利息','通信費','資本金','現金過不足','貸倒引当金','貸倒損失','減価償却費','備品減価償却累計額','未収家賃','受取家賃','前払保険料','支払保険料','支払利息','受取手数料','消耗品費','前受金','仮払金','仮受金','租税公課','広告宣伝費','水道光熱費','当座預金','売上原価','繰越商品','受取商品券','商品券','電子記録債権','電子記録債務','クレジット売掛金','貸倒引当金繰入','前払家賃','未収手数料'];
const categories = ['基礎仕訳','商品売買','現金預金','貸借・費用','決算整理','弱点復習'];

const lessons = [
  {id:'l1', title:'5分類と借方・貸方', tag:'最重要', body:'資産・費用は増えたら借方、負債・純資産・収益は増えたら貸方。まずここを反射にする。'},
  {id:'l2', title:'商品売買', tag:'頻出', body:'商品を買うと仕入、売ると売上。後払いなら、売った側は売掛金、買った側は買掛金。商品以外の後払いは未払金。'},
  {id:'l3', title:'現金・普通預金', tag:'基礎', body:'現金や普通預金は資産。増加は借方、減少は貸方。売掛金回収では売上を再計上しない。'},
  {id:'l4', title:'貸付金・借入金', tag:'頻出', body:'貸した側は貸付金、借りた側は借入金。利息を受け取れば受取利息、支払えば支払利息。'},
  {id:'l5', title:'現金過不足', tag:'苦手化しやすい', body:'現金実査で帳簿との差額が出たら現金過不足。原因判明後、正しい費用や収益に振り替える。'},
  {id:'l6', title:'決算整理', tag:'第3問直結', body:'貸倒引当金、減価償却、前払・未収・未払・前受は第3問の核。仕訳として一度書ければ集計問題に進める。'},
  {id:'l7', title:'精算表・財務諸表の考え方', tag:'第3問', body:'決算整理仕訳を書き、残高試算表に足し引きし、費用収益は損益計算書、資産負債純資産は貸借対照表へ振り分ける。'}
];

const roadmap = [
  'Day1: 5分類と借方貸方。仕訳10問。',
  'Day2: 商品売買。仕入・売上・売掛金・買掛金。',
  'Day3: 現金預金。売掛金回収・買掛金支払。',
  'Day4: 費用・収益。家賃・通信費・給料。',
  'Day5: 貸付金・借入金・利息。',
  'Day6: 未払金・前受金・仮払金・仮受金。',
  'Day7: 現金過不足。原因不明→原因判明。',
  'Day8: ここまでの仕訳50問復習。',
  'Day9: 貸倒れと貸倒引当金。',
  'Day10: 減価償却。直接法と間接法。',
  'Day11: 前払・未払・未収・前受。',
  'Day12: 消耗品・貯蔵品・税金。',
  'Day13: 決算整理仕訳まとめ。',
  'Day14: 決算整理だけ30問。',
  'Day15: 第2問対策。補助簿の入り口。',
  'Day16: 勘定記入・伝票の入り口。',
  'Day17: 商品有高帳の基本。',
  'Day18: 第3問の構造理解。',
  'Day19: 精算表ミニ問題。',
  'Day20: 財務諸表ミニ問題。',
  'Day21: 第1問仕訳を時間制限で演習。',
  'Day22: 第2問を浅く広く演習。',
  'Day23: 第3問を25分で解く練習。',
  'Day24: 模試1回目。',
  'Day25: 模試1回目のミス潰し。',
  'Day26: 模試2回目。',
  'Day27: 決算整理の弱点だけ復習。',
  'Day28: 模試3回目。',
  'Day29: 仕訳と第3問の総復習。',
  'Day30: 本番想定。60分で1セット。'
];

function q(id, category, text, entries, explanation, level=1){ return {id, category, text, entries, explanation, level}; }
const baseQuestions = [
q('q001','商品売買','商品10,000円を仕入れ、代金は現金で支払った。',[['仕入',10000,'現金',10000]],'商品を買ったので仕入。現金支払いなので現金を減らす。'),
q('q002','商品売買','商品30,000円を売り上げ、代金は掛けとした。',[['売掛金',30000,'売上',30000]],'後でもらう権利は売掛金。売上は貸方。'),
q('q003','現金預金','売掛金20,000円を普通預金に回収した。',[['普通預金',20000,'売掛金',20000]],'回収なので売上は出さない。売掛金を減らす。'),
q('q004','現金預金','買掛金15,000円を普通預金から支払った。',[['買掛金',15000,'普通預金',15000]],'買掛金という負債を減らし、普通預金も減らす。'),
q('q005','貸借・費用','備品80,000円を購入し、代金は月末に支払うことにした。',[['備品',80000,'未払金',80000]],'商品以外の後払いは買掛金ではなく未払金。'),
q('q006','貸借・費用','給料120,000円を普通預金から支払った。',[['給料',120000,'普通預金',120000]],'給料は費用。費用の発生は借方。'),
q('q007','貸借・費用','事務所家賃50,000円を現金で支払った。',[['支払家賃',50000,'現金',50000]],'家賃の支払いは支払家賃。'),
q('q008','貸借・費用','銀行から300,000円を借り入れ、普通預金に入金された。',[['普通預金',300000,'借入金',300000]],'資産の普通預金と負債の借入金が同時に増える。'),
q('q009','貸借・費用','借入金100,000円を普通預金から返済した。利息は考えない。',[['借入金',100000,'普通預金',100000]],'借入金という負債を減らす。'),
q('q010','貸借・費用','得意先に現金50,000円を貸し付けた。',[['貸付金',50000,'現金',50000]],'貸した側は貸付金という資産が増える。'),
q('q011','貸借・費用','貸付金50,000円について、利息2,000円とともに現金で回収した。',[['現金',52000,'貸付金',50000],['','', '受取利息',2000]],'元本は貸付金の減少、利息は受取利息。',2),
q('q012','商品売買','商品40,000円を売り上げ、10,000円は現金で受け取り、残額は掛けとした。',[['現金',10000,'売上',40000],['売掛金',30000,'','']], '売上総額は40,000円。未回収分30,000円は売掛金。',2),
q('q013','貸借・費用','通信費8,000円を現金で支払った。',[['通信費',8000,'現金',8000]],'通信費は費用。'),
q('q014','基礎仕訳','店主が私用のため、事業用普通預金から20,000円を引き出した。',[['資本金',20000,'普通預金',20000]],'個人企業の店主引出は資本金の減少として処理。',2),
q('q015','現金預金','現金実査で帳簿残高より3,000円不足していた。原因は不明。',[['現金過不足',3000,'現金',3000]],'実際の現金が少ないので帳簿上の現金を減らす。'),
q('q016','現金預金','現金不足3,000円の原因が通信費の記入漏れと判明した。',[['通信費',3000,'現金過不足',3000]],'原因判明後、現金過不足を正しい費用に振り替える。'),
q('q017','決算整理','売掛金10,000円が貸し倒れた。貸倒引当金残高は6,000円である。',[['貸倒引当金',6000,'売掛金',10000],['貸倒損失',4000,'','']], '引当金で足りない分だけ貸倒損失。',2),
q('q018','決算整理','備品について減価償却費120,000円を計上する。間接法による。',[['減価償却費',120000,'備品減価償却累計額',120000]],'間接法では備品を直接減らさず累計額を使う。'),
q('q019','決算整理','決算にあたり、受取家賃12,000円が未収である。',[['未収家賃',12000,'受取家賃',12000]],'当期分の収益を計上し、未収の権利を資産にする。'),
q('q020','決算整理','支払保険料24,000円のうち、翌期分6,000円が含まれていた。',[['前払保険料',6000,'支払保険料',6000]],'翌期分は当期費用から外し、前払保険料にする。')
];

function makeGenerated(){
  const arr=[]; let id=21;
  const nums=[6000,8000,12000,15000,18000,20000,24000,30000,36000,50000];
  nums.forEach(n=>arr.push(q('q'+String(id++).padStart(3,'0'),'商品売買',`商品${n.toLocaleString()}円を仕入れ、代金は掛けとした。`,[['仕入',n,'買掛金',n]],'商品を後払いで仕入れたので買掛金。')));
  nums.forEach(n=>arr.push(q('q'+String(id++).padStart(3,'0'),'商品売買',`商品${(n*2).toLocaleString()}円を売り上げ、代金は現金で受け取った。`,[['現金',n*2,'売上',n*2]],'売上は収益。現金受取なので現金が増える。')));
  nums.slice(0,8).forEach(n=>arr.push(q('q'+String(id++).padStart(3,'0'),'現金預金',`売掛金${n.toLocaleString()}円を現金で回収した。`,[['現金',n,'売掛金',n]],'売掛金の回収なので売上は出さない。')));
  nums.slice(0,8).forEach(n=>arr.push(q('q'+String(id++).padStart(3,'0'),'現金預金',`買掛金${n.toLocaleString()}円を現金で支払った。`,[['買掛金',n,'現金',n]],'買掛金という負債を減らす。')));
  const expenses=[['広告宣伝費',12000],['水道光熱費',9000],['租税公課',7000],['消耗品費',5000],['通信費',11000],['支払家賃',45000],['給料',90000]];
  expenses.forEach(([a,n])=>arr.push(q('q'+String(id++).padStart(3,'0'),'貸借・費用',`${a}${n.toLocaleString()}円を普通預金から支払った。`,[[a,n,'普通預金',n]],`${a}は費用。普通預金を減らす。`)));
  const borrow=[100000,150000,200000,250000,500000];
  borrow.forEach(n=>arr.push(q('q'+String(id++).padStart(3,'0'),'貸借・費用',`銀行から${n.toLocaleString()}円を借り入れ、当座預金に入金された。`,[['当座預金',n,'借入金',n]],'預金資産と借入金負債が増える。')));
  borrow.forEach(n=>arr.push(q('q'+String(id++).padStart(3,'0'),'貸借・費用',`借入金${n.toLocaleString()}円と利息${Math.round(n*0.02).toLocaleString()}円を普通預金から支払った。`,[['借入金',n,'普通預金',n+Math.round(n*0.02)],['支払利息',Math.round(n*0.02),'','']], '元本は借入金の減少、利息は支払利息。',2)));
  const adj=[
    ['決算整理','売掛金200,000円に対し、2%の貸倒引当金を設定する。差額補充法で、残高はない。',[['貸倒引当金繰入',4000,'貸倒引当金',4000]],'売掛金×2%=4,000円。※科目候補にない場合は解説で理解する。',2],
    ['決算整理','取得原価300,000円の備品について、定額法で減価償却費60,000円を計上する。間接法。',[['減価償却費',60000,'備品減価償却累計額',60000]],'間接法は累計額を使う。'],
    ['決算整理','支払家賃のうち翌期分15,000円が含まれていた。',[['前払家賃',15000,'支払家賃',15000]],'翌期分の家賃は当期費用から外し、前払家賃という資産にする。',2],
    ['決算整理','受取手数料8,000円が未収であった。',[['未収手数料',8000,'受取手数料',8000]],'未収収益は資産、収益を追加計上する。',2],
    ['基礎仕訳','注文を受け、内金20,000円を現金で受け取った。',[['現金',20000,'前受金',20000]],'商品引渡し前の受取額は売上ではなく前受金。'],
    ['基礎仕訳','出張旅費の概算額30,000円を現金で渡した。',[['仮払金',30000,'現金',30000]],'用途や金額が確定するまで仮払金。'],
    ['基礎仕訳','内容不明の入金10,000円が普通預金にあった。',[['普通預金',10000,'仮受金',10000]],'内容不明の入金は仮受金。']
  ];
  adj.forEach(x=>arr.push(q('q'+String(id++).padStart(3,'0'),x[0],x[1],x[2],x[3],x[4]||1)));
  return arr;
}
const questions = baseQuestions.concat(makeGenerated());

function defaultState(){return {doneLessons:[], answered:0, correct:0, wrongIds:[], history:[], day:1, currentMode:'all'};}
let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultState();
function save(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderHeader();}
function normalizeEntry(row){return {debit:row[0]||'', debitAmount:Number(row[1]||0), credit:row[2]||'', creditAmount:Number(row[3]||0)};}
function eqEntries(user, ans){
  const clean = xs => xs.map(x=>({debit:x.debit||'',debitAmount:Number(x.debitAmount||0),credit:x.credit||'',creditAmount:Number(x.creditAmount||0)})).filter(x=>x.debit||x.credit||x.debitAmount||x.creditAmount);
  const u=clean(user), a=ans.map(normalizeEntry);
  if(u.length!==a.length)return false;
  return a.every((r,i)=>u[i].debit===r.debit && u[i].credit===r.credit && u[i].debitAmount===r.debitAmount && u[i].creditAmount===r.creditAmount);
}
function renderHeader(){
  const completed = state.doneLessons.length + Math.min(state.answered,120)/120*8;
  const pct = Math.min(100, Math.round(completed/(lessons.length+8)*100));
  $('#progressText').textContent = pct+'%'; $('#progressBar').style.width = pct+'%';
  const today = roadmap[(state.day-1)%roadmap.length];
  $('#todayTask').textContent = `Day${state.day}: ${today.replace(/^Day\d+:\s*/,'')}`;
}
function renderRoadmap(){
  $('#roadmap').innerHTML = `<div class="card"><h2>30日ロードマップ</h2><p class="muted">今日やることを小さく固定。ゼロの日を作らない設計です。</p><div class="toolbar"><button class="primary" id="nextDay">今日のタスク完了</button><button class="ghost" id="prevDay">1日戻す</button></div></div><div class="roadmap-list">${roadmap.map((r,i)=>`<div class="item ${i<state.day-1?'done':''}"><span class="badge ${i<state.day-1?'ok':''}">Day${i+1}</span>${r.replace(/^Day\d+:\s*/,'')}</div>`).join('')}</div>`;
  $('#nextDay').onclick=()=>{state.day=Math.min(30,state.day+1);save();renderRoadmap();};
  $('#prevDay').onclick=()=>{state.day=Math.max(1,state.day-1);save();renderRoadmap();};
}
function renderLesson(){
  $('#lesson').innerHTML = `<div class="card"><h2>講義</h2><p class="muted">読んだら完了。細かく読み込むより、すぐ仕訳練習へ進む。</p></div><div class="lesson-list">${lessons.map(l=>`<div class="item ${state.doneLessons.includes(l.id)?'done':''}"><span class="badge">${l.tag}</span><h3>${l.title}</h3><p>${l.body}</p><button class="small ${state.doneLessons.includes(l.id)?'ghost':'primary'}" data-lesson="${l.id}">${state.doneLessons.includes(l.id)?'完了済み':'完了にする'}</button></div>`).join('')}</div>`;
  $$('[data-lesson]').forEach(b=>b.onclick=()=>{ if(!state.doneLessons.includes(b.dataset.lesson)) state.doneLessons.push(b.dataset.lesson); save(); renderLesson(); });
}
function filteredQuestions(){
  if(state.currentMode==='weak') return questions.filter(x=>state.wrongIds.includes(x.id));
  if(state.currentMode==='all') return questions;
  return questions.filter(x=>x.category===state.currentMode);
}
function pickQuestion(){
  const pool = filteredQuestions();
  if(pool.length===0) return null;
  const weights = pool.map(x => (state.wrongIds.includes(x.id)?4:1) + x.level*.3);
  const sum = weights.reduce((a,b)=>a+b,0); let r=Math.random()*sum;
  for(let i=0;i<pool.length;i++){ r-=weights[i]; if(r<=0) return pool[i]; }
  return pool[0];
}
function entryRow(i){
  return `<div class="choice"><select class="debit" data-i="${i}"><option value="">借方科目</option>${accounts.map(a=>`<option>${a}</option>`).join('')}</select><input class="amount debitAmount" data-i="${i}" type="number" placeholder="金額"><select class="credit" data-i="${i}"><option value="">貸方科目</option>${accounts.map(a=>`<option>${a}</option>`).join('')}</select><input class="amount creditAmount" data-i="${i}" type="number" placeholder="金額"></div>`;
}
function renderQuiz(qobj=pickQuestion()){
  const modeButtons = ['all',...categories].filter((v,i,a)=>a.indexOf(v)===i).map(m=>`<button class="pill ${state.currentMode===m?'active':''}" data-mode="${m}">${m==='all'?'全分野':m}</button>`).join('');
  if(!qobj){ $('#quiz').innerHTML = `<div class="card"><h2>仕訳練習</h2><div class="pillbox">${modeButtons}</div><p>このモードの問題がまだありません。</p></div>`; bindModes(); return; }
  $('#quiz').innerHTML = `<div class="card"><h2>仕訳練習</h2><div class="pillbox">${modeButtons}</div><div class="stat-row"><div class="stat"><span>回答数</span><strong>${state.answered}</strong></div><div class="stat"><span>正解</span><strong>${state.correct}</strong></div><div class="stat"><span>正答率</span><strong>${state.answered?Math.round(state.correct/state.answered*100):0}%</strong></div></div></div><div class="card quiz-box"><div><span class="badge warn">${qobj.category}</span><span class="badge">Lv.${qobj.level}</span></div><h3>${qobj.text}</h3><p class="muted">必要な行だけ入力。2行目が不要な場合は空欄でOK。</p><div class="choices">${entryRow(0)}${entryRow(1)}</div><div class="toolbar"><button class="primary" id="checkAnswer">答え合わせ</button><button class="ghost" id="nextQuestion">別の問題</button></div><div id="answerArea"></div></div>`;
  bindModes();
  $('#nextQuestion').onclick=()=>renderQuiz();
  $('#checkAnswer').onclick=()=>{
    const user=[0,1].map(i=>({debit:$$(`.debit[data-i="${i}"]`)[0].value,debitAmount:$$(`.debitAmount[data-i="${i}"]`)[0].value,credit:$$(`.credit[data-i="${i}"]`)[0].value,creditAmount:$$(`.creditAmount[data-i="${i}"]`)[0].value}));
    const ok=eqEntries(user,qobj.entries);
    state.answered++; if(ok){state.correct++; state.wrongIds=state.wrongIds.filter(id=>id!==qobj.id);} else if(!state.wrongIds.includes(qobj.id)){state.wrongIds.push(qobj.id);}
    state.history.unshift({id:qobj.id, ok, at:new Date().toISOString()}); state.history=state.history.slice(0,50); save();
    $('#answerArea').innerHTML = `<div class="result ${ok?'correct':'incorrect'}"><h3>${ok?'正解':'不正解'}</h3>${answerTable(qobj)}<p>${qobj.explanation}</p><button class="primary" id="again">次の問題へ</button></div>`;
    $('#again').onclick=()=>renderQuiz();
  };
}
function answerTable(qobj){
  return `<table class="table"><thead><tr><th>借方</th><th>金額</th><th>貸方</th><th>金額</th></tr></thead><tbody>${qobj.entries.map(r=>`<tr><td>${r[0]||''}</td><td>${r[1]?Number(r[1]).toLocaleString():''}</td><td>${r[2]||''}</td><td>${r[3]?Number(r[3]).toLocaleString():''}</td></tr>`).join('')}</tbody></table>`;
}
function bindModes(){ $$('[data-mode]').forEach(b=>b.onclick=()=>{state.currentMode=b.dataset.mode; save(); renderQuiz();}); }
function renderWeak(){
  const wrong = questions.filter(q=>state.wrongIds.includes(q.id));
  $('#weak').innerHTML = `<div class="card"><h2>弱点リスト</h2><p class="muted">間違えた問題はここに残ります。解き直して正解すると自動で消えます。</p><div class="toolbar"><button class="primary" id="weakStart">弱点だけ解く</button><button class="ghost danger" id="clearWeak">弱点をクリア</button></div></div>${wrong.length?wrong.map(q=>`<details><summary>${q.category}：${q.text}</summary>${answerTable(q)}<p>${q.explanation}</p></details>`).join(''):'<div class="card"><p>まだ弱点はありません。まず仕訳練習を解いてください。</p></div>'}`;
  $('#weakStart').onclick=()=>{state.currentMode='weak';save();showView('quiz');renderQuiz();};
  $('#clearWeak').onclick=()=>{state.wrongIds=[];save();renderWeak();};
}
function showView(id){ $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===id)); $$('.view').forEach(v=>v.classList.toggle('active',v.id===id)); }
$$('.tab').forEach(t=>t.onclick=()=>{showView(t.dataset.view); if(t.dataset.view==='roadmap')renderRoadmap(); if(t.dataset.view==='lesson')renderLesson(); if(t.dataset.view==='quiz')renderQuiz(); if(t.dataset.view==='weak')renderWeak();});
$('#resetBtn').onclick=()=>{ if(confirm('進捗を初期化しますか？')){state=defaultState();save();renderRoadmap();renderLesson();renderQuiz();renderWeak();}};
renderHeader(); renderRoadmap(); renderLesson(); renderQuiz(); renderWeak();
