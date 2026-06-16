const lessons=[
{t:'簿記の5分類',b:'資産・負債・純資産・収益・費用を最初に固定します。資産増加は借方、負債増加は貸方、収益発生は貸方、費用発生は借方です。'},
{t:'商品売買',b:'商品を買ったら仕入、売ったら売上。後払いで売れば売掛金、後払いで仕入れれば買掛金です。商品以外の後払いは未払金です。'},
{t:'現金・預金',b:'現金、普通預金、当座預金は資産です。増えたら借方、減ったら貸方です。売掛金を回収しても売上は再計上しません。'},
{t:'貸付・借入',b:'貸した側は貸付金、借りた側は借入金です。利息を受け取れば受取利息、支払えば支払利息です。'},
{t:'現金過不足',b:'実際有高と帳簿残高がずれ、原因不明なら現金過不足。原因判明時に正しい勘定科目へ振り替えます。'},
{t:'決算整理',b:'減価償却、貸倒引当金、売上原価、前払・未払・未収・前受が第3問の中心です。第3問は仕訳を書いてから表へ反映します。'}
];
const roadmap=Array.from({length:30},(_,i)=>{const d=i+1;let task='';if(d<=3)task='5分類・借方貸方・基本仕訳10問';else if(d<=10)task='商品売買・現金預金・掛取引の仕訳30問';else if(d<=17)task='貸倒・減価償却・経過勘定など決算整理';else if(d<=23)task='第3問：精算表・財務諸表ミニ問題';else task='模試・弱点復習・時間配分練習';return{d,task}});
const qs=[
{c:'商品売買',q:'商品10,000円を仕入れ、代金は現金で支払った。',a:[['仕入','10000','現金','10000']],e:'商品を買ったので仕入。現金が減るので貸方現金。'},
{c:'商品売買',q:'商品30,000円を売り上げ、代金は掛けとした。',a:[['売掛金','30000','売上','30000']],e:'掛けで売ったので売掛金が増え、売上が発生します。'},
{c:'現金預金',q:'売掛金20,000円を普通預金に回収した。',a:[['普通預金','20000','売掛金','20000']],e:'回収なので売上は使いません。普通預金増加、売掛金減少。'},
{c:'現金預金',q:'買掛金15,000円を普通預金から支払った。',a:[['買掛金','15000','普通預金','15000']],e:'買掛金という負債が減るので借方。普通預金が減るので貸方。'},
{c:'固定資産',q:'備品80,000円を購入し、代金は月末に支払う。',a:[['備品','80000','未払金','80000']],e:'商品以外の後払いなので買掛金ではなく未払金。'},
{c:'費用収益',q:'給料120,000円を普通預金から支払った。',a:[['給料','120000','普通預金','120000']],e:'給料は費用。費用発生は借方。'},
{c:'費用収益',q:'事務所の家賃50,000円を現金で支払った。',a:[['支払家賃','50000','現金','50000']],e:'支払家賃は費用。現金は減少。'},
{c:'貸付借入',q:'銀行から300,000円を借り入れ、普通預金に入金された。',a:[['普通預金','300000','借入金','300000']],e:'普通預金という資産が増え、借入金という負債も増えます。'},
{c:'貸付借入',q:'借入金100,000円を普通預金から返済した。利息は考えない。',a:[['借入金','100000','普通預金','100000']],e:'借入金が減るので借方、普通預金が減るので貸方。'},
{c:'貸付借入',q:'得意先に現金50,000円を貸し付けた。',a:[['貸付金','50000','現金','50000']],e:'貸した側は貸付金という資産が増えます。'},
{c:'貸付借入',q:'貸付金50,000円について、利息2,000円とともに現金で回収した。',a:[['現金','52000','貸付金','50000'],['','','受取利息','2000']],e:'元本は貸付金の減少。利息は受取利息という収益。'},
{c:'商品売買',q:'商品40,000円を売り上げ、10,000円は現金で受け取り、残額は掛けとした。',a:[['現金','10000','売上','40000'],['売掛金','30000','','']],e:'売上総額は40,000円。受取分と未収分に分けます。'},
{c:'現金過不足',q:'現金の実際有高が帳簿残高より3,000円不足していた。原因不明である。',a:[['現金過不足','3000','現金','3000']],e:'帳簿上の現金を減らし、原因不明分を現金過不足で処理。'},
{c:'現金過不足',q:'上記の現金不足3,000円は通信費の記入漏れと判明した。',a:[['通信費','3000','現金過不足','3000']],e:'原因が判明したので通信費へ振り替え、現金過不足を消します。'},
{c:'決算整理',q:'売掛金10,000円が貸し倒れた。貸倒引当金残高は6,000円。',a:[['貸倒引当金','6000','売掛金','10000'],['貸倒損失','4000','','']],e:'引当金を先に使い、不足分だけ貸倒損失にします。'},
{c:'決算整理',q:'備品について減価償却費120,000円を計上する。間接法。',a:[['減価償却費','120000','備品減価償却累計額','120000']],e:'間接法では資産を直接減らさず、減価償却累計額を使います。'},
{c:'決算整理',q:'決算で受取家賃12,000円が未収であることが判明した。',a:[['未収家賃','12000','受取家賃','12000']],e:'当期分の収益を計上し、まだ受け取っていない権利を未収家賃にします。'},
{c:'決算整理',q:'支払保険料24,000円のうち、翌期分6,000円が含まれていた。',a:[['前払保険料','6000','支払保険料','6000']],e:'翌期分は当期費用から外し、前払保険料という資産にします。'}
];
const fsMini=[
{q:'決算整理前残高：売上500,000円、仕入300,000円、繰越商品（期首）40,000円、繰越商品（期末）50,000円。売上原価はいくらか。',ans:'290000',e:'売上原価＝期首商品40,000＋仕入300,000−期末商品50,000＝290,000円'},
{q:'売掛金残高200,000円に対して2%の貸倒引当金を設定する。貸倒引当金残高が1,000円ある場合、繰入額はいくらか。',ans:'3000',e:'必要額200,000×2%=4,000円。残高1,000円があるので繰入額は3,000円。'},
{q:'取得原価600,000円、残存価額0、耐用年数5年、定額法。1年分の減価償却費はいくらか。',ans:'120000',e:'600,000÷5年＝120,000円。'},
{q:'支払家賃120,000円のうち翌期分20,000円が含まれている。当期の支払家賃はいくらか。',ans:'100000',e:'翌期分20,000円は前払家賃として除く。120,000−20,000＝100,000円。'}
];
const S={tab:'home',cat:'全分野',i:0,stats:{ans:0,ok:0},wrong:JSON.parse(localStorage.bokiWrong||'[]'),done:JSON.parse(localStorage.bokiDone||'{}')};
const tabs=[['home','ホーム'],['lesson','講義'],['journal','仕訳練習'],['fs','第3問ミニ'],['weak','弱点'],['road','30日計画']];
function save(){localStorage.bokiWrong=JSON.stringify(S.wrong);localStorage.bokiDone=JSON.stringify(S.done)}
function nav(){document.getElementById('tabs').innerHTML=tabs.map(t=>`<button class="tab ${S.tab==t[0]?'active':''}" onclick="S.tab='${t[0]}';render()">${t[1]}</button>`).join('')}
function today(){const d=Math.min(30,Math.max(1,Number(localStorage.bokiDay||1)));return roadmap[d-1]}
function setDay(v){localStorage.bokiDay=v;render()}
function render(){nav();const app=document.getElementById('app');if(S.tab==='home')home(app);if(S.tab==='lesson')lesson(app);if(S.tab==='journal')journal(app);if(S.tab==='fs')fs(app);if(S.tab==='weak')weak(app);if(S.tab==='road')road(app)}
function home(app){const t=today();const rate=S.stats.ans?Math.round(S.stats.ok/S.stats.ans*100):0;app.innerHTML=`<section class="card"><h2>今日のタスク：Day ${t.d}</h2><p>${t.task}</p><div class="bar"><span style="width:${Math.min(100,t.d/30*100)}%"></span></div><p class="muted">30日計画の進捗 ${t.d}/30</p><div class="row"><button class="btn" onclick="S.tab='journal';render()">仕訳を解く</button><button class="btn sub" onclick="S.tab='lesson';render()">講義を見る</button><button class="btn sub" onclick="S.tab='fs';render()">第3問ミニ</button></div></section><section class="card"><h2>成績</h2><div class="grid"><div class="mini">回答数<br><b>${S.stats.ans}</b></div><div class="mini">正解数<br><b>${S.stats.ok}</b></div><div class="mini">正答率<br><b>${rate}%</b></div><div class="mini">弱点数<br><b>${S.wrong.length}</b></div></div><button class="btn bad" onclick="resetAll()">進捗を初期化</button></section>`}
function lesson(app){app.innerHTML=`<section class="card"><h2>講義</h2><div class="grid">${lessons.map(x=>`<div class="mini"><span class="pill">重要</span><h3>${x.t}</h3><p>${x.b}</p></div>`).join('')}</div></section>`}
function curQs(){return S.cat==='全分野'?qs:qs.filter(x=>x.c===S.cat)}
function journal(app){const cats=['全分野',...new Set(qs.map(x=>x.c))];const arr=curQs();if(S.i>=arr.length)S.i=0;const q=arr[S.i];app.innerHTML=`<section class="card"><h2>仕訳練習</h2><select class="select" onchange="S.cat=this.value;S.i=0;render()">${cats.map(c=>`<option ${S.cat===c?'selected':''}>${c}</option>`).join('')}</select><p class="muted">${S.i+1}/${arr.length}　<span class="pill">${q.c}</span></p><div class="qbox"><b>問題</b><p>${q.q}</p></div><h3>仕訳入力</h3><div id="entry"></div><div class="row"><button class="btn" onclick="checkJournal()">答え合わせ</button><button class="btn sub" onclick="nextQ()">次へ</button></div><div id="result"></div></section>`;drawEntry(q.a.length)}
function drawEntry(n){document.getElementById('entry').innerHTML=Array.from({length:Math.max(2,n)},(_,i)=>`<div class="journal"><input placeholder="借方科目" id="d${i}"><input placeholder="金額" id="dm${i}"><input placeholder="貸方科目" id="c${i}"><input placeholder="金額" id="cm${i}"></div>`).join('')}
function norm(x){return String(x||'').replace(/[\s,，円]/g,'').trim()}
function checkJournal(){const arr=curQs(),q=arr[S.i];let ok=true;for(let i=0;i<q.a.length;i++){const a=q.a[i];if(norm(document.getElementById('d'+i).value)!==norm(a[0])||norm(document.getElementById('dm'+i).value)!==norm(a[1])||norm(document.getElementById('c'+i).value)!==norm(a[2])||norm(document.getElementById('cm'+i).value)!==norm(a[3]))ok=false}
S.stats.ans++;if(ok)S.stats.ok++;else if(!S.wrong.some(w=>w.q===q.q))S.wrong.push(q);save();document.getElementById('result').innerHTML=`<div class="mini"><p class="${ok?'ok':'ng'}">${ok?'正解':'不正解'}</p><table class="table"><tr><th>借方</th><th>金額</th><th>貸方</th><th>金額</th></tr>${q.a.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table><p>${q.e}</p></div>`}
function nextQ(){S.i=(S.i+1)%curQs().length;render()}
function fs(app){app.innerHTML=`<section class="card"><h2>第3問ミニ問題</h2><p class="muted">まずは決算整理の計算だけを潰します。精算表フル問題の前段階です。</p>${fsMini.map((x,i)=>`<div class="mini"><b>問${i+1}</b><p>${x.q}</p><input id="fs${i}" placeholder="答えを数字で入力"><button class="btn sub" onclick="checkFs(${i})">確認</button><div id="fsr${i}"></div></div>`).join('')}</section>`}
function checkFs(i){const x=fsMini[i];const v=norm(document.getElementById('fs'+i).value);document.getElementById('fsr'+i).innerHTML=`<p class="${v===x.ans?'ok':'ng'}">${v===x.ans?'正解':'不正解'}：答え ${Number(x.ans).toLocaleString()}円</p><p>${x.e}</p>`}
function weak(app){app.innerHTML=`<section class="card"><h2>弱点復習</h2>${S.wrong.length?S.wrong.map((w,i)=>`<div class="mini"><span class="pill">${w.c}</span><p>${w.q}</p><p class="muted">${w.e}</p><button class="btn sub" onclick="S.wrong.splice(${i},1);save();render()">克服したので削除</button></div>`).join(''):'<p>まだ弱点はありません。まず仕訳練習を解いてください。</p>'}</section>`}
function road(app){app.innerHTML=`<section class="card"><h2>30日ロードマップ</h2><p>現在Day <input style="width:90px" type="number" min="1" max="30" value="${today().d}" onchange="setDay(this.value)"></p><div class="grid">${roadmap.map(r=>`<div class="mini"><b>Day ${r.d}</b><p>${r.task}</p></div>`).join('')}</div></section>`}
function resetAll(){if(confirm('進捗と弱点を削除しますか？')){localStorage.removeItem('bokiWrong');localStorage.removeItem('bokiDone');localStorage.removeItem('bokiDay');S.wrong=[];S.done={};S.stats={ans:0,ok:0};render()}}
render();
