const st={step:0,mode:'y26',tab:'home',birth:'',region:'',ints:[],bal:0,total:0,hist:[],coupons:[],promo:true,gF:'전체',pF:'전체',only:false,fit:false,nt:{bal:true,survey:true,event:true},sv:{done:false},theme:null};
const $=s=>document.querySelector(s),L=$('#layer');
const total=()=>CAP.includes(st.region)?MODE[st.mode].cap:MODE[st.mode].non;
const minP=s=>Math.min(...s.seats.map(x=>x[1]).filter(x=>x>0));
const DEADLINE=17; // 데모: 이용 기한까지 남은 일수
const grad=i=>`linear-gradient(145deg,${COL[i%8]},${COL[(i+3)%8]})`;
function render(){ if(st.step<5) return onboard(); home(); }
function steps(n){return `<div class="step">${[1,2,3,4].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>`}
function onboard(){
 $('#tabs').innerHTML='';let m=$('#main'),h='';
 if(st.step==0) h=`<div style="padding-top:60px"><div class="poster" style="width:76px;height:76px;border-radius:24px;background:var(--pt);color:#1d2523;font-size:30px;align-items:center;justify-content:center;padding:0">🎟</div><h1 style="margin-top:20px;font-size:28px">문화생활,<br>남은 지원금까지<br>한 번에 챙겨요</h1><p class="sub" style="margin:12px 0 28px">청년문화패스 신청부터 공연 추천, 예매처 연결, 잔액 알림까지 한 앱에서.</p><button class="btn" onclick="go(1)">시작하기</button><p class="note" style="text-align:center">※ 팀 연구용 프로토타입 · 모든 공연·금액은 예시 데이터입니다</p></div>`;
 if(st.step==1){const a=MODE[st.mode].age;h=`${steps(1)}<h1>대상인지 먼저 확인할게요</h1><p class="sub" style="margin:6px 0 16px">출생연도를 입력하면 연령을 확인해요. 실제 서비스는 예매처 간편인증으로 연결됩니다.</p><input type="number" id="by" placeholder="출생연도 (예: 2007)" value="${st.birth}" oninput="st.birth=this.value;chk()"><div id="chk" class="alert ok" style="display:none"></div><div class="note">적용 기준: ${MODE[st.mode].name} (${a[0]}~${a[1]}세)</div><div style="height:20px"></div><button class="btn" id="nx" onclick="go(2)" disabled>다음</button>`}
 if(st.step==2) h=`${steps(2)}<h1>어느 지역에 사시나요?</h1><p class="sub" style="margin:6px 0 16px">지역에 따라 지원금이 달라요. 수도권 ${W(MODE[st.mode].cap)} · 비수도권 ${W(MODE[st.mode].non)}</p><div class="reg">${REG.map(r=>`<button class="${st.region==r?'on':''}" onclick="st.region='${r}';onboard()">${r}</button>`).join('')}</div><div style="height:20px"></div><button class="btn" onclick="go(3)" ${st.region?'':'disabled'}>다음</button>`;
 if(st.step==3) h=`${steps(3)}<h1>관심 있는 분야를 골라주세요</h1><p class="sub" style="margin:6px 0 16px">여러 개 선택할 수 있고, 맞춤 추천에 사용돼요. 새로운 장르에도 도전해 보세요!</p><div class="chips">${GEN.map(g=>`<button class="chip ${st.ints.includes(g)?'on':''}" onclick="tg('${g}')">${g}</button>`).join('')}</div><div style="height:24px"></div><button class="btn" onclick="go(4)" ${st.ints.length?'':'disabled'}>다음</button>`;
 if(st.step==4) h=`${steps(4)}<h1>패스를 발급받아요</h1><p class="sub" style="margin:6px 0 16px">발급은 예매처에서 진행되며, 포인트는 선택한 예매처에서만 쓸 수 있어요.</p><div class="card"><div class="row between"><b>${st.region}</b><span class="tag">${CAP.includes(st.region)?'수도권':'비수도권'}</span></div><div class="big" style="font-size:26px;font-weight:900;margin:6px 0">${W(total())}</div><div class="sub">관심: ${st.ints.join(', ')}</div></div><h2>예매처 선택</h2><button class="seat" onclick="issue('인터파크')"><span><b>인터파크</b><br><span class="sub">공연·전시 중심</span></span><span>발급 →</span></button><button class="seat" onclick="issue('YES24')"><span><b>YES24</b><br><span class="sub">공연·영화·도서</span></span><span>발급 →</span></button><p class="note">※ 한 번 선택하면 포인트 교환이 불가하다는 현행 구조를 반영했어요. 최초 1회 발급 시 안내 문구를 꼭 보여줘야 합니다.</p>`;
 m.innerHTML=h;chk();}
function chk(){const b=+st.birth,e=$('#chk');if(!e)return;const age=2026-b+0,a=MODE[st.mode].age;const ok=st.birth.length==4&&age>=a[0]&&age<=a[1];e.style.display=st.birth.length==4?'block':'none';e.className='alert '+(ok?'ok':'');e.textContent=ok?`만 ${age}세 · 신청 가능해요!`:`만 ${age}세 · 현재 기준으로는 대상이 아니에요. 대상 안내를 받아볼까요?`;$('#nx').disabled=!ok}
function go(n){st.step=n;render()}function tg(g){const i=st.ints.indexOf(g);i<0?st.ints.push(g):st.ints.splice(i,1);onboard()}
function issue(p){st.plat=p;st.total=st.bal=total();st.step=5;st.tab='home';toast(`${p}에서 ${W(st.bal)} 발급 완료`);render()}
function toast(t){const d=document.createElement('div');d.textContent=t;d.style.cssText='position:absolute;left:16px;right:16px;bottom:80px;background:#1d2523;color:#fff;padding:12px;border-radius:12px;text-align:center;z-index:9';$('#app').append(d);setTimeout(()=>d.remove(),2200)}
function tabs(){$('#tabs').innerHTML=[['home','🏠','홈'],['find','🔎','공연 찾기'],['perk','🎁','혜택'],['my','👤','MY']].map(t=>`<button class="${st.tab==t[0]?'on':''}" onclick="st.tab='${t[0]}';home()"><b>${t[1]}</b>${t[2]}</button>`).join('')}
function home(){tabs();({home:vHome,find:vFind,perk:vPerk,my:vMy})[st.tab]();$('#main').scrollTop=0;if(st.promo&&st.tab=='home'){st.promo=false;promo()}}
function showCard(s){const lo=minP(s),fit=lo<=st.bal;return `<button class="card show" onclick="detail(${s.id})"><div class="poster" style="background:${grad(s.id)}">${s.g}</div><div style="flex:1"><div class="row" style="flex-wrap:wrap;gap:4px"><span class="tag">${s.r}</span>${st.ints.includes(s.g)?'<span class="tag">관심</span>':''}</div><div style="font-weight:700;margin:3px 0">${s.t}</div><div class="sub">${s.v} · ${s.p}</div><div class="price">${W(lo)}~ ${fit?'':'<span class="tag w">잔액 부족</span>'}</div></div></button>`}
function mine(){return SHOWS.filter(s=>s.r=='전국'||s.r==st.region||st.ints.includes(s.g)&&false)}
function reco(){return SHOWS.filter(s=>(s.r=='전국'||s.r==st.region)&&minP(s)<=st.bal&&st.ints.includes(s.g)||(st.ints.includes(s.g)&&minP(s)<=st.bal))}
function vHome(){
 const used=st.total-st.bal,pc=Math.round(used/st.total*100);
 let al=st.bal==0?`<div class="alert ok">지원금을 모두 사용했어요 🎉 만족도 조사에 참여해 주세요</div>`:st.nt.bal?`<div class="alert">🔔 사용할 수 있는 지원금이 <b>${W(st.bal)}</b> 남았어요, <b>${DEADLINE}일</b> 안에 사용하세요!</div>`:'';
 const rc=reco().slice(0,3);
 $('#main').innerHTML=`<div class="between row"><div><div class="sub">${st.region} · ${CAP.includes(st.region)?'수도권':'비수도권'}</div><h1>안녕하세요 👋</h1></div><span class="tag">${st.plat}</span></div>
 <div class="hero" style="margin-top:14px"><div class="sub" style="color:#e3fffb">남은 지원금</div><div class="big">${W(st.bal)}</div><div class="bar"><i style="width:${100-pc}%"></i></div><div class="row between" style="font-size:12px"><span>사용 ${W(used)}</span><span>전체 ${W(st.total)}</span></div></div>${al}
 ${st.nt.survey&&st.hist.length&&!st.sv.done?`<button class="card row" style="width:100%;margin-top:10px;text-align:left" onclick="survey()"><span style="font-size:22px">📝</span><span style="flex:1"><b>관람은 어떠셨나요?</b><br><span class="sub">1분 만족도 조사 · 참여하면 쿠폰 지급</span></span>›</button>`:''}
 <h2>내 잔액으로 볼 수 있는 맞춤 공연</h2>${rc.length?rc.map(showCard).join(''):'<p class="sub">조건에 맞는 공연이 없어요. 공연 찾기에서 분야를 넓혀 보세요.</p>'}
 <div class="row" style="gap:8px"><button class="btn ghost" onclick="st.tab='find';st.fit=true;home()">잔액 맞춤 전체 보기</button><button class="btn ghost" onclick="st.tab='perk';home()">이벤트·쿠폰</button></div>`}
function vFind(){
 let l=SHOWS.filter(s=>(st.gF=='전체'||s.g==st.gF)&&(st.pF=='전체'||inR(minP(s),st.pF))&&(!st.fit||minP(s)<=st.bal));
 if(st.only) l=l.filter(s=>s.r=='전국'||s.r==st.region);
 l.sort((a,b)=>(st.ints.includes(b.g)-st.ints.includes(a.g))||minP(a)-minP(b));
 $('#main').innerHTML=`<h1>공연 찾기</h1><p class="sub" style="margin:4px 0 12px">관심 분야가 먼저 보여요</p><div class="chips" style="margin-bottom:8px">${['전체',...GEN].map(g=>`<button class="chip ${st.gF==g?'on':''}" onclick="st.gF='${g}';vFind()">${g}</button>`).join('')}</div>
 <div class="chips" style="margin-bottom:10px">${['전체','1만원 이하','1~3만원','3~5만원','5만원 이상'].map(g=>`<button class="chip ${st.pF==g?'on':''}" onclick="st.pF='${g}';vFind()">${g}</button>`).join('')}</div>
 <div class="card row between" style="margin-bottom:8px"><span>💰 잔액 <b>${W(st.bal)}</b>으로 가능한 것만</span><button class="tog ${st.fit?'on':''}" onclick="st.fit=!st.fit;vFind()" aria-label="잔액 맞춤"></button></div>
 <div class="card row between" style="margin-bottom:14px"><span>📍 내 지역(${st.region})·전국만</span><button class="tog ${st.only?'on':''}" onclick="st.only=!st.only;vFind()" aria-label="지역"></button></div>
 ${l.length?l.map(showCard).join(''):'<p class="sub">조건에 맞는 결과가 없어요. 필터를 줄여 보세요.</p>'}`}
function inR(p,f){return f=='1만원 이하'?p<=10000:f=='1~3만원'?p>10000&&p<=30000:f=='3~5만원'?p>30000&&p<=50000:p>50000}
function vPerk(){
 $('#main').innerHTML=`<h1>혜택</h1><h2>진행 중인 이벤트</h2>${EVENTS.map(e=>`<div class="card" style="margin-bottom:10px"><div class="row between"><b>${e.t}</b><span class="tag">${e.b}</span></div><div class="sub" style="margin-top:4px">${e.d}</div></div>`).join('')}
 <h2>받을 수 있는 쿠폰</h2>${COUPONS.map(c=>{const h=st.coupons.includes(c.id);return `<div class="coupon"><div><b>${c.t}</b><div class="sub">${c.d}</div></div><div>${h?'<span class="sub">보관 중</span>':`<button onclick="st.coupons.push('${c.id}');toast('쿠폰을 받았어요');vPerk()" style="color:var(--brand-d);font-weight:700">받기</button>`}</div></div>`}).join('')}<p class="note">※ 쿠폰은 예매 단계에서 선택 적용되는 방식으로 설계했어요.</p>`}
function vMy(){
 const m=st.mode;
 $('#main').innerHTML=`<h1>MY</h1>
 <div class="card" style="margin:12px 0"><div class="row between"><b>${st.region} · ${st.plat}</b><button class="tag" onclick="st.step=2;st.hist=[];onboard()">지역 변경</button></div><div class="sub" style="margin:4px 0 8px">관심 분야</div><div class="chips">${GEN.map(g=>`<button class="chip ${st.ints.includes(g)?'on':''}" onclick="tg2('${g}')">${g}</button>`).join('')}</div></div>
 <h2>사용 내역</h2><div class="card">${st.hist.length?st.hist.map(h=>`<div class="row between" style="padding:5px 0"><span>${h.t}<br><span class="sub">${h.seat} · ${h.p}</span></span><b>-${W(h.pass)}</b></div>`).join(''):'<span class="sub">아직 사용 내역이 없어요. 공연 찾기에서 첫 관람을 골라보세요.</span>'}</div>
 <h2>알림 설정</h2><div class="card">${[['bal','잔여 지원금·기한 알림'],['survey','만족도 조사 알림'],['event','이벤트·쿠폰 알림']].map(a=>`<div class="row between" style="padding:6px 0"><span>${a[1]}</span><button class="tog ${st.nt[a[0]]?'on':''}" onclick="st.nt['${a[0]}']=!st.nt['${a[0]}'];vMy()" aria-label="${a[1]}"></button></div>`).join('')}</div>
 <h2>제도 시나리오 (연구용)</h2><div class="chips"><button class="chip ${m=='y26'?'on':''}" onclick="setMode('y26')">2026 현행</button><button class="chip ${m=='y27'?'on':''}" onclick="setMode('y27')">2027 정부안</button></div><p class="note">2027안: 19~34세, 인당 10~15만원, 매년 지급, 국회 심의 중이라 변경될 수 있어요. (수도권 10 / 비수도권 15로 가정)</p>
 <button class="btn ghost" style="margin-top:16px" onclick="st.promo=true;st.tab='home';home()">홍보 팝업 다시 보기</button>
 <button class="btn ghost" style="margin-top:8px" onclick="location.reload()">처음부터 다시 체험</button>`}
function tg2(g){const i=st.ints.indexOf(g);if(i<0)st.ints.push(g);else if(st.ints.length>1)st.ints.splice(i,1);vMy()}
function setMode(k){st.mode=k;const used=st.total-st.bal;st.total=total();st.bal=Math.max(0,st.total-used);vMy()}
function close(){L.innerHTML=''}
function promo(){L.innerHTML=`<div class="scrim mid" onclick="if(event.target==this)close()"><div class="sheet" style="padding:0;overflow:hidden"><div style="background:linear-gradient(140deg,#1f9e92,#4cc9bc);color:#fff;padding:26px 20px"><div class="tag" style="background:#ffc531;color:#1d2523">NEW</div><h1 style="margin-top:10px">첫 관람 인증하면<br>팝콘 쿠폰 증정!</h1><p style="margin-top:6px;opacity:.9">신규 장르 도전 챌린지 · ~12/31</p></div><div class="row" style="padding:12px;gap:8px"><button class="btn ghost" onclick="close()">오늘은 그만 보기</button><button class="btn" onclick="close();st.tab='perk';home()">이벤트 보기</button></div></div></div>`}
function detail(id){const s=SHOWS.find(x=>x.id==id);st.sel={s,i:0};dsheet()}
function dsheet(){const {s,i}=st.sel,[g,p]=s.seats[i],pass=Math.min(st.bal,p),own=p-pass;
 L.innerHTML=`<div class="scrim" onclick="if(event.target==this)close()"><div class="sheet"><div class="row" style="gap:12px"><div class="poster" style="background:${grad(s.id)}">${s.g}</div><div><span class="tag">${s.r}</span><h2 style="margin:4px 0 2px">${s.t}</h2><div class="sub">${s.v} · ${s.p}</div></div></div>
 <h2>좌석·옵션 선택</h2>${s.seats.map((x,k)=>`<button class="seat ${k==i?'on':''} ${x[1]>st.bal?'no':''}" onclick="st.sel.i=${k};dsheet()"><b>${x[0]}</b><span>${W(x[1])} ${x[1]>st.bal?'<span class="tag w">자부담 '+W(x[1]-st.bal)+'</span>':'<span class="tag">전액 지원</span>'}</span></button>`).join('')}
 <div class="sum"><div><span>티켓 금액</span><span>${W(p)}</span></div><div><span>패스 사용</span><span style="color:var(--brand-d)">-${W(pass)}</span></div><div><b>내가 낼 금액</b><b>${W(own)}</b></div><div class="sub"><span>사용 후 잔액</span><span>${W(st.bal-pass)}</span></div></div>
 ${own>0?`<div class="alert">좌석을 한 단계 낮추면 전액 지원돼요</div>`:''}
 <p class="note" style="margin:0 0 10px">※ 좌석별 가격과 잔여석은 예매처 실시간 데이터 연동이 필요해요(API 확인 필요).</p>
 <button class="btn" onclick="redir()" ${st.bal==0?'disabled':''}>${s.p}에서 예매하기</button></div></div>`}
function redir(){const {s,i}=st.sel;L.innerHTML=`<div class="scrim mid"><div class="sheet" style="text-align:center"><div style="font-size:34px">↗</div><h2 style="margin:6px 0">${s.p}로 이동할게요</h2><p class="sub">패스 포인트를 쓸 수 있는 예매처 화면으로 연결돼요.<br>예매를 마치면 앱으로 돌아와 사용 내역을 반영해요.</p><div style="height:14px"></div><button class="btn" onclick="done()">이동 후 예매 완료 (시뮬레이션)</button><button class="btn ghost" style="margin-top:8px" onclick="dsheet()">취소</button></div></div>`}
function done(){const {s,i}=st.sel,[g,p]=s.seats[i],pass=Math.min(st.bal,p);st.bal-=pass;st.hist.unshift({t:s.t,seat:g,p:s.p,pass});close();toast(`${W(pass)} 사용 처리됐어요`);home()}
function survey(){let r=0;const draw=()=>{L.innerHTML=`<div class="scrim mid" onclick="if(event.target==this)close()"><div class="sheet"><h2 style="margin-top:0">패스 만족도</h2><p class="sub">${st.hist[0].t}을(를) 보셨네요</p><div class="row" style="gap:2px;margin:8px 0">${[1,2,3,4,5].map(n=>`<button class="star ${n<=r?'on':''}" onclick="rate(${n})" aria-label="${n}점">★</button>`).join('')}</div><div class="sub" style="margin:10px 0 6px">가장 아쉬운 점</div><div class="chips">${['티켓 가격','시간 부족','이동·교통','예매 절차','볼 공연 부족'].map(c=>`<button class="chip" onclick="this.classList.toggle('on')">${c}</button>`).join('')}</div><div style="height:16px"></div><button class="btn" onclick="st.sv.done=true;st.coupons.push('c1');close();toast('참여 감사! 쿠폰이 지급됐어요');home()">제출하고 쿠폰 받기</button></div></div>`};window.rate=n=>{r=n;draw()};draw()}
render();
