import{f as G}from"./firebase-CNzVcu9p.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const ye={apiKey:"AIzaSyBIlCbxhxEucKdBNyMWEwRuFOpEo0dVQx8",authDomain:"equilibrioprodutivo-app.firebaseapp.com",databaseURL:"https://equilibrioprodutivo-app-default-rtdb.firebaseio.com",projectId:"equilibrioprodutivo-app",storageBucket:"equilibrioprodutivo-app.firebasestorage.app",messagingSenderId:"785521986199",appId:"1:785521986199:web:449d7fe7979e0aad8db7d2",measurementId:"G-2FZ69XYWZJ"};G.apps.length||G.initializeApp(ye);const we="equilibrio_produtivo_data",be={daily_logs:{},finances:{transactions:[],balance:0},learning:[],kanban:{ideas:[],doing:[],done:[]},settings:{accent_color:"#72fe8f"}};function ke(){const e=localStorage.getItem(we);if(!e)return JSON.parse(JSON.stringify(be));try{const t=JSON.parse(e);return{daily_logs:t.daily_logs||{},finances:t.finances||{transactions:[],balance:0},learning:Array.isArray(t.learning)?t.learning:[],kanban:t.kanban||{ideas:[],doing:[],done:[]},settings:t.settings||{accent_color:"#72fe8f"}}}catch{return JSON.parse(JSON.stringify(be))}}const Le=(e=new Date)=>{const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${n}`},oe=()=>Le(new Date),d={_uid:null,init:async e=>{d._uid=e;try{if(!(await G.database().ref(`users/${e}`).once("value")).exists()){const a=ke();await G.database().ref(`users/${e}`).set(a)}}catch(t){console.error("[DB] Erro de inicialização",t)}},getRef:e=>{if(!d._uid)throw new Error("Usuário não autenticado");return G.database().ref(`users/${d._uid}/${e}`)},getSettings:async()=>{const e=await d.getRef("settings").once("value");return e.exists()?e.val():{accent_color:"#72fe8f"}},saveSettings:async e=>{const a={...await d.getSettings(),...e};return await d.getRef("settings").set(a),a},getHabits:async()=>{const e=await d.getRef("settings/habits").once("value");return e.exists()?e.val():null},saveHabits:async e=>{await d.getRef("settings/habits").set(e)},getTodayLog:async()=>{const e=oe(),t=await d.getRef(`daily_logs/${e}`).once("value");if(!t.exists()){const a={habits:{},mood:null,sleep:null,water:0,screen_time:0,rest_day:!1};return await d.getRef(`daily_logs/${e}`).set(a),a}return t.val()},updateHabit:async(e,t,a=null)=>{const n=a||oe();await d.getRef(`daily_logs/${n}/habits`).update({[e]:t})},updateDailyMetrics:async(e,t,a=null)=>{const n=a||oe();await d.getRef(`daily_logs/${n}`).update({[e]:t})},updateDailyFinances:async(e,t)=>{const a={income_dia:Number((t==null?void 0:t.income_dia)||0),expense_dia:Number((t==null?void 0:t.expense_dia)||0),income_din:Number((t==null?void 0:t.income_din)||0),expense_din:Number((t==null?void 0:t.expense_din)||0)};await d.getRef(`daily_logs/${e}`).update(a)},getMonthlyLogs:async e=>{const t=await d.getRef("daily_logs").orderByKey().startAt(e).endAt(e+"").once("value");return t.exists()?t.val():{}},getDailyLog:async e=>{const t=await d.getRef(`daily_logs/${e}`).once("value");return t.exists()?t.val():null},getAllDailyLogs:async()=>{const e=await d.getRef("daily_logs").once("value");return e.exists()?e.val():{}},getFinances:async()=>{const e=await d.getRef("finances").once("value");if(!e.exists())return{transactions:[],balance:0};const t=e.val();return{transactions:t.transactions||[],balance:t.balance||0}},getEmergencyFund:async()=>{const e=await d.getRef("finances/emergency_fund").once("value");return e.exists()?Number(e.val()):0},saveEmergencyFund:async e=>{await d.getRef("finances/emergency_fund").set(Number(e))},addTransaction:async e=>{e.id=Date.now().toString();const t=await d.getFinances();return t.transactions||(t.transactions=[]),t.transactions.push(e),e.type==="income"?t.balance+=Number(e.amount):t.balance-=Number(e.amount),await d.getRef("finances").set(t),e},getLibrary:async()=>{const e=await d.getRef("learning").once("value");return e.exists()?e.val():[]},saveLibraryItem:async e=>{let t=await d.getLibrary();Array.isArray(t)||(t=[]);const a=t.findIndex(n=>n.id===e.id);return a>=0?t[a]=e:t.push(e),await d.getRef("learning").set(t),e},deleteLibraryItem:async e=>{let t=await d.getLibrary();t=(t||[]).filter(a=>a.id!==e),await d.getRef("learning").set(t)},getKanbanData:async()=>{const e=await d.getRef("kanban").once("value");if(!e.exists())return{ideas:[],doing:[],done:[]};const t=e.val();return{ideas:t.ideas||[],doing:t.doing||[],done:t.done||[]}},saveKanbanData:async e=>{await d.getRef("kanban").set(e)}};function _e({todayLog:e,balances:t,todayPct:a,missing:n,isAllDone:s,weekData:r,snapWeeks:o=[],currentWeekIndex:c=0,DEFAULT_HABITS:f,snapMessage:k,libraryItems:y}){const g=l=>Number(l||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),p=[{card:"bg-gradient-to-br from-cyan-500/12 via-surface-container-highest to-blue-500/10",border:"border-cyan-300/25",glow:"shadow-[0_8px_22px_rgba(34,211,238,0.14)]",bar:"bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.45)]",pct:"text-cyan-300",stepper:"bg-cyan-400/10 border-cyan-300/25 text-cyan-200 hover:bg-cyan-400/20"},{card:"bg-gradient-to-br from-emerald-500/12 via-surface-container-highest to-lime-500/10",border:"border-emerald-300/25",glow:"shadow-[0_8px_22px_rgba(52,211,153,0.14)]",bar:"bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.45)]",pct:"text-emerald-300",stepper:"bg-emerald-400/10 border-emerald-300/25 text-emerald-200 hover:bg-emerald-400/20"},{card:"bg-gradient-to-br from-amber-500/12 via-surface-container-highest to-orange-500/10",border:"border-amber-300/25",glow:"shadow-[0_8px_22px_rgba(251,191,36,0.14)]",bar:"bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.45)]",pct:"text-amber-300",stepper:"bg-amber-400/10 border-amber-300/25 text-amber-200 hover:bg-amber-400/20"},{card:"bg-gradient-to-br from-fuchsia-500/12 via-surface-container-highest to-pink-500/10",border:"border-fuchsia-300/25",glow:"shadow-[0_8px_22px_rgba(217,70,239,0.14)]",bar:"bg-fuchsia-300 shadow-[0_0_10px_rgba(240,171,252,0.45)]",pct:"text-fuchsia-300",stepper:"bg-fuchsia-400/10 border-fuchsia-300/25 text-fuchsia-200 hover:bg-fuchsia-400/20"},{card:"bg-gradient-to-br from-indigo-500/12 via-surface-container-highest to-violet-500/10",border:"border-indigo-300/25",glow:"shadow-[0_8px_22px_rgba(99,102,241,0.14)]",bar:"bg-indigo-300 shadow-[0_0_10px_rgba(165,180,252,0.45)]",pct:"text-indigo-300",stepper:"bg-indigo-400/10 border-indigo-300/25 text-indigo-200 hover:bg-indigo-400/20"}],w=l=>{const L=`${(l==null?void 0:l.id)||""}${(l==null?void 0:l.title)||""}${(l==null?void 0:l.type)||""}`;let i=0;for(let j=0;j<L.length;j++)i=(i<<5)-i+L.charCodeAt(j),i|=0;const m=Math.abs(i)%p.length;return p[m]},F=l=>{const L=l.total>0?Math.round(l.current/l.total*100):0,i=l.type==="book",m=w(l),j={to_do:"Para Iniciar",in_progress:"Em Andamento",done:"Concluído"},$={to_do:"text-on-surface-variant/60 bg-white/5 border-white/10",in_progress:"text-blue-400 bg-blue-400/10 border-blue-400/20",done:"text-green-400 bg-green-400/10 border-green-400/20"},E=i?"Pág":"Aula",S=$[l.status]||$.to_do,h=l.status==="in_progress",C=l.status==="done"?"opacity-60":"",D=h?"ring-2 ring-blue-400/40":"";return`
            <div class="min-w-[255px] rounded-3xl p-5 border space-y-5 flex flex-col relative cursor-pointer active:scale-95 transition-transform ${m.card} ${m.border} ${m.glow} ${D} ${C}" onclick="window.openLibraryView('${l.id}')">
                <div class="flex justify-between items-start">
                    <span class="text-3xl">${l.emoji||(i?"📘":"🎓")}</span>
                    <span class="text-[8px] font-bold ${S} px-2 py-1 rounded-lg uppercase tracking-widest border${h?" animate-pulse":""}">${j[l.status]||"Para Iniciar"}</span>
                </div>
                <div>
                    <span class="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/10 bg-black/20 text-white/80 mb-2">${i?"Livro":"Curso"}</span>
                    <h4 class="font-bold text-[var(--text-primary)] text-base leading-tight">${l.title}</h4>
                    <span class="text-[10px] text-on-surface-variant/50">${l.author||""}</span>
                </div>
                <div class="space-y-3 mt-auto">
                    <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/10">
                        <div class="h-full ${m.bar} rounded-full" style="width:${L}%"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <button class="text-xs font-semibold text-on-surface-variant hover:text-white transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${l.id}')">${E} ${l.current||0} / ${l.total||0}</button>
                        <span class="text-[10px] font-extrabold ${m.pct}">${L}%</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 rounded-xl border text-base font-extrabold transition-colors ${m.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${l.id}', -1)">-</button>
                        <button class="w-8 h-8 rounded-xl border text-base font-extrabold transition-colors ${m.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${l.id}', 1)">+</button>
                        <button class="flex-1 h-8 rounded-xl border border-white/10 bg-black/20 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${l.id}')">Atualizar</button>
                    </div>
                </div>
            </div>`},x={in_progress:0,to_do:1,done:2},B=l=>[...l].sort((L,i)=>(x[L.status]??1)-(x[i.status]??1)),I=B((y||[]).filter(l=>l.type==="course")),T=B((y||[]).filter(l=>l.type==="book")),A=l=>`<div class="min-w-[240px] bg-surface-container rounded-3xl p-5 border border-dashed border-white/10 flex items-center justify-center"><span class="text-sm text-on-surface-variant/30">Nenhum ${l} cadastrado</span></div>`,H=(l,L,i,m,j=!1)=>{if(i==="outside")return`
            <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[40px] opacity-20">
                <span class="text-[10px] font-bold text-on-surface-variant">${l}</span>
                <span class="text-[9px] text-on-surface-variant/60">${L}</span>
                <div class="relative w-10 h-10 flex items-center justify-center">
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/5" />
                    </svg>
                </div>
            </div>`;if(i==="future")return`
            <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[40px]">
                <span class="text-[10px] font-bold text-on-surface-variant">${l}</span>
                <span class="text-[9px] text-on-surface-variant/70">${L}</span>
                <div class="relative w-10 h-10 flex items-center justify-center">
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/5" />
                    </svg>
                </div>
            </div>`;const $=100.53,E=$-$*m/100,S=m===100;let h=j?`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 18px; font-variation-settings: 'FILL' 1;">hotel</span>`:S?`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`:`<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${m}%</span>`;const _=i==="today"?'id="snap-ring-today-circle"':"",C=i==="today"?'id="snap-ring-today-text"':"";let D="";return j?D='<circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="transparent" />':S?D='<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />':D=`
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/10" />
                <circle ${_} cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" 
                        class="text-primary accent-text drop-shadow-[0_0_4px_currentColor]" 
                        stroke-dasharray="${$}" stroke-dashoffset="${E}" stroke-linecap="round" />
            `,`
        <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[40px]">
            <span class="text-[10px] font-bold ${i==="today"?"text-primary accent-text":"text-on-surface-variant"}">${l}</span>
            <span class="text-[9px] ${i==="today"?"text-primary/90":"text-on-surface-variant/75"}">${L}</span>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full" ${j?'style="box-shadow: 0 0 15px rgba(251,191,36,0.45);"':S?'style="box-shadow: 0 0 15px var(--accent-color);"':""} ${i==="today"?'id="snap-ring-today-container"':""}>
                ${i==="today"?'<div class="absolute inset-0 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] border border-primary/40 accent-border scale-125"></div>':""}
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                    ${D}
                </svg>
                <div class="z-10 flex items-center justify-center" ${C}>${h}</div>
            </div>
        </div>`},P=o&&o.length>0?o:[{index:0,label:"Semana 1",rangeLabel:"",days:r||[]}],O=P.map((l,L)=>`<span data-week-dot="${L}" class="w-1.5 h-1.5 rounded-full ${L===c?"bg-primary accent-bg":"bg-white/20"}"></span>`).join(""),K=P.map((l,L)=>{const i=l.days.filter(m=>m.state!=="outside"&&m.pct===100&&!m.isRestDay).length;return`
            <div data-week-index="${L}" class="min-w-full shrink-0 snap-start">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60">${l.label}${l.rangeLabel?` • ${l.rangeLabel}`:""}</span>
                    <span class="text-[10px] font-extrabold text-primary accent-text">${i} perfeitos</span>
                </div>
                <div class="flex flex-wrap justify-between gap-y-6 gap-x-2 w-full pb-2 px-1">
                    ${l.days.map(m=>H(m.day,m.dayNumber,m.state,m.pct,m.isRestDay)).join("")}
                </div>
            </div>
        `}).join("");return`
        <div class="space-y-8 pb-12">
            <!-- Weekly Snap & Finance Block -->
            <section class="space-y-6 pt-8 sm:pt-0 mt-2 sm:mt-0">
                <!-- Weekly Snap Card -->
                <div class="bg-surface-container-low rounded-3xl p-6 pt-7 relative overflow-hidden border border-white/6">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-3xl -mr-16 -mt-16 opacity-20"></div>
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-5">
                            <div class="max-w-full">
                                <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1 block font-headline">Snap Semanal</span>
                                <p class="text-[var(--text-primary)] font-semibold tracking-tight leading-snug pr-1">${k}</p>
                            </div>
                            <div class="self-end sm:self-auto text-right shrink-0">
                                <span class="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50 block">Semanas no mês</span>
                                <span class="text-[10px] font-extrabold text-primary accent-text">${P.length}</span>
                            </div>
                        </div>

                        <div class="flex justify-center gap-1 mb-4">
                            ${O}
                        </div>

                        <div id="snap-weeks-carousel" class="flex overflow-x-auto hide-scrollbar snap-x snap-proximity gap-4 sm:gap-6" style="scrollbar-width:none;">
                            ${K}
                        </div>
                </div>

                <!-- Finance Card -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-amber-400/5 rounded-3xl p-6 border border-amber-300/20 opacity-90">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-amber-200/80 block mb-2 font-headline">Dia a Dia</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-amber-200/70">R$</span>
                            <span class="block w-full max-w-full truncate text-[clamp(1.1rem,4.8vw,1.85rem)] font-extrabold tracking-tighter text-[var(--text-primary)] font-headline" title="R$ ${g(t==null?void 0:t.diaBalance)}">${g(t==null?void 0:t.diaBalance)}</span>
                        </div>
                    </div>
                    <div class="bg-emerald-400/10 rounded-3xl p-6 border border-emerald-300/25 opacity-90">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-emerald-200 block mb-2 font-headline">Meu Dinheiro</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-emerald-200/80">R$</span>
                            <span class="block w-full max-w-full truncate text-[clamp(1.1rem,4.8vw,1.85rem)] font-extrabold tracking-tighter text-[var(--text-primary)] font-headline" title="R$ ${g(t==null?void 0:t.dinheiroBalance)}">${g(t==null?void 0:t.dinheiroBalance)}</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Check-in Trigger Block -->
            <section>
                <div class="bg-surface-container-highest rounded-[32px] overflow-hidden relative group transition-all duration-700 ${s?"border border-primary/50 accent-border shadow-[0_0_20px_var(--accent-color)] accent-glow":"border border-transparent"}" id="checkin-container" onclick="window.openCheckinModal()">
                    <div class="p-6 flex items-center justify-between hover:bg-surface-highest transition-colors cursor-pointer active:scale-95 transition-transform duration-300">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary accent-text" style="font-variation-settings: 'FILL' 1;">edit_document</span>
                            </div>
                            <div class="flex flex-col gap-1 w-32 sm:w-40">
                                <h3 class="font-bold text-[16px] text-[var(--text-primary)] leading-tight">Check-in Diário</h3>
                                <div class="flex items-center gap-2">
                                    <div class="h-1.5 flex-1 bg-black/40 rounded-full overflow-hidden">
                                        <div id="checkin-internal-bar" class="h-full bg-primary accent-bg transition-all duration-500 ease-out" style="width: ${a}%"></div>
                                    </div>
                                    <span class="text-[10px] font-bold text-on-surface-variant" id="checkin-pct-text">${a}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 bg-surface-highest px-4 py-2 rounded-full border border-white/5">
                            <span class="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">Abrir</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Learning Section — Livros -->
            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] font-headline">Meus Livros</h3>
                    <span class="text-xs font-bold text-cyan-400 tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity" onclick="window.openLibraryModal('book')">Ver Todos</span>
                </div>
                <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    ${T.length>0?T.map(F).join(""):A("livro")}
                </div>
            </section>

            <!-- Learning Section — Cursos -->
            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] font-headline">Meus Cursos</h3>
                    <span class="text-xs font-bold text-primary accent-text tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity" onclick="window.openLibraryModal('course')">Ver Todos</span>
                </div>
                <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    ${I.length>0?I.map(F).join(""):A("curso")}
                </div>
            </section>
        </div>

        <!-- Fullscreen Daily Check-in Modal -->
        <div id="checkin-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
            <!-- Overlay -->
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="checkin-modal-overlay" onclick="window.closeCheckinModal()"></div>
            
            <!-- Modal Body (Sliding up from bottom) -->
            <div class="relative w-full h-[95vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="checkin-modal-sheet">
                
                <!-- Fixed Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <h2 class="text-3xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none" id="lbl-checkin-date">09 ABR</h2>
                            <span class="text-[12px] font-bold tracking-widest uppercase text-primary accent-text mt-1" id="lbl-checkin-day">Domingo</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeCheckinModal()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>

                <!-- Scrollable Form Area -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-10 hide-scrollbar" id="checkin-modal-scroll">
                    
                    <!-- Qualitativos -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Como você se sentiu?</h3>
                        
                        <div class="bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-6">
                            <!-- Humor -->
                            <div class="space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] block">Humor Geral</span>
                                <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width: none;">
                                    ${[{label:"Nervoso",val:"nervoso",active:"border-red-500 bg-red-500/20 text-red-500"},{label:"Feliz",val:"feliz",active:"border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]"},{label:"Produtivo",val:"produtivo",active:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},{label:"Normal",val:"normal",active:"border-white/50 bg-white/10 text-white"},{label:"Ansioso",val:"ansioso",active:"border-orange-400 bg-orange-400/20 text-orange-400"},{label:"Cansado",val:"cansado",active:"border-purple-400 bg-purple-400/20 text-purple-400"},{label:"Triste",val:"triste",active:"border-blue-400 bg-blue-400/20 text-blue-400"}].map(l=>{const L=e.mood===l.val;return`<button onclick="window.selectChip(this, 'mood-btn')" data-active-class="${l.active}" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border ${L?l.active+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-60"} text-sm font-bold hover:opacity-100 transition-all">${l.label}</button>`}).join("")}
                                </div>
                            </div>
                            
                            <div class="h-px w-full bg-white/5"></div>

                            <!-- Sono -->
                            <div class="space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                                <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width: none;">
                                    ${[{label:"Perfeito",val:"perfeito",active:"border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]"},{label:"Muito bom",val:"muito_bom",active:"border-blue-400 bg-blue-400/20 text-blue-400"},{label:"Bom",val:"bom",active:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},{label:"Mais ou menos",val:"mais_ou_menos",active:"border-orange-400 bg-orange-400/20 text-orange-400"},{label:"Ruim",val:"ruim",active:"border-red-500 bg-red-500/20 text-red-500"}].map(l=>{const L=e.sleep===l.val;return`<button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="${l.active}" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border ${L?l.active+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-60"} text-sm font-bold hover:opacity-100 transition-all">${l.label}</button>`}).join("")}
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Quantitativos e Horários -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Seu corpo e tempo</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Hora que acordou -->
                            <div class="col-span-2 bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Hora que acordou</span>
                                <input id="input-wake-time" type="time" value="${e.wake_time||""}" placeholder="00:00" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">
                            </div>
                            <!-- Água -->
                            <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col items-center justify-center">
                                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                                <div class="flex items-center gap-3">
                                    ${[1,2,3,4,5].map(l=>{const L=l<=(e.water||0);return`<button onclick="window.setWaterInput(${l})" id="water-drop-${l}" class="text-4xl transition-all duration-300 ${L?"drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none":"grayscale opacity-30"} hover:scale-110 active:scale-90">💧</button>`}).join("")}
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Hábitos Base -->
                    <section class="space-y-4">
                        <div class="flex items-center justify-between gap-3 px-2">
                            <button id="rest-day-toggle-checkin" data-active="false" onclick="window.toggleRestDay()" class="w-full h-12 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant font-bold text-sm transition-all active:scale-95">
                                Dia de Descanso
                            </button>
                            <span id="rest-day-badge-checkin" class="hidden flex-shrink-0 px-3 py-2 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-200 text-[10px] font-extrabold uppercase tracking-widest">Descanso</span>
                        </div>
                        <div class="flex justify-between items-center pl-2 pr-1">
                            <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">As ${f.length} Rotinas</h3>
                            <span class="text-[10px] font-bold text-primary accent-text" id="lbl-habit-counter">0/${f.length}</span>
                        </div>
                        <div id="checkin-habits-section" class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5 transition-opacity">
                            ${f.map((l,L)=>{const i=e.habits?e.habits[l.id]:!1;return`
                                <div class="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-highest transition-colors cursor-pointer group active:scale-[0.98]" onclick="window.toggleHabit('${l.id}', ${!i})">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center text-on-surface-variant group-hover:text-[var(--text-primary)] transition-colors">
                                            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' ${i?1:0};">${l.icon}</span>
                                        </div>
                                        <span id="txt-${l.id}" class="text-base font-bold transition-all ${i?"line-through opacity-50 text-on-surface-variant":"text-[var(--text-primary)]"}">${l.name}</span>
                                    </div>
                                    <div id="circle-${l.id}" class="w-7 h-7 rounded-full border-2 ${i?"bg-primary accent-bg border-primary accent-border":"border-on-surface-variant/30 group-hover:border-on-surface-variant/60"} flex items-center justify-center transition-all">
                                        ${i?'<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>':""}
                                    </div>
                                </div>
                                `}).join("")}
                        </div>
                    </section>

                    <!-- Fluxo Financeiro Diário -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Fluxo do Caixa</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Dia a dia -->
                            <div class="col-span-2 space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Dia a Dia"</span>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-red-400">
                                        <span class="text-xs font-bold text-on-surface-variant">Gasto Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-red-400 font-bold mr-1">R$</span>
                                            <input id="input-fluxo-dia-expense" value="${e.expense_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input id="input-fluxo-dia-income" value="${e.income_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Meu Dinheiro -->
                            <div class="col-span-2 space-y-3 mt-4">
                                <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Meu Dinheiro"</span>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-red-400">
                                        <span class="text-xs font-bold text-on-surface-variant">Gasto Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-red-400 font-bold mr-1">R$</span>
                                            <input id="input-fluxo-din-expense" value="${e.expense_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input id="input-fluxo-din-income" value="${e.income_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                
                <!-- Fixed Footer Area -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-transform" onclick="window.closeCheckinModal()">
                        Salvar e Concluir Diário
                    </button>
                </div>
            </div>
        </div>

        <!-- Library VIEW Modal (bottom sheet, read-only) -->
        <div id="library-view-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="library-view-overlay" onclick="window.closeLibraryView()"></div>
            <div class="relative w-full h-[80vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="library-view-sheet">
                <!-- Handle + Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl" id="lbl-lv-emoji">📘</span>
                            <div>
                                <h2 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-tight" id="lbl-lv-title">Título</h2>
                                <span id="lbl-lv-author" class="text-[11px] font-bold text-on-surface-variant/50">Autor</span>
                            </div>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeLibraryView()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-4 hide-scrollbar" id="library-view-content"></div>
                <!-- Footer -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2" onclick="window.openLibraryEditFromView()">
                        <span class="material-symbols-outlined">edit</span> Editar Obra
                    </button>
                </div>
            </div>
        </div>

        <!-- Library List Modal -->
        <div id="library-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="library-modal-overlay" onclick="window.closeLibraryModal()"></div>
            
            <div class="relative w-full h-[95vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="library-modal-sheet">
                <!-- Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <h2 class="text-3xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none">Minha Biblioteca</h2>
                            <span class="text-[12px] font-bold tracking-widest uppercase text-on-surface-variant mt-1">Seus livros e cursos</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeLibraryModal()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                    <!-- Filter tabs -->
                    <div class="flex gap-2 pt-2">
                        <button class="lib-filter-btn px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95" data-filter="all" onclick="window.filterLibrary('all')">Todos</button>
                        <button class="lib-filter-btn px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95" data-filter="course" onclick="window.filterLibrary('course')">📚 Cursos</button>
                        <button class="lib-filter-btn px-5 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95" data-filter="book" onclick="window.filterLibrary('book')">📖 Livros</button>
                    </div>
                </div>

                <!-- Scrollable List Area -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-4 hide-scrollbar" id="library-modal-list">
                    ${(()=>{const l=y||[];if(l.length===0)return'<p class="text-center text-on-surface-variant/30 text-sm py-12">Nenhuma obra cadastrada ainda.</p>';const L=(h,_=!1)=>{const C=h.total>0?Math.round(h.current/h.total*100):0,D=h.type==="book",M=w(h),R={to_do:"Para Iniciar",in_progress:"Em Andamento",done:"Concluído"},u={to_do:"text-on-surface-variant/60 bg-white/5 border-white/10",in_progress:"text-blue-400 bg-blue-400/10 border-blue-400/20",done:"text-green-400 bg-green-400/10 border-green-400/20"},v=D?"Pág":"Aula",b=D?"Livro":"Curso",N=u[h.status]||u.to_do,q=h.status==="in_progress"?"ring-2 ring-blue-400/30":"",z=_?"opacity-60":"";return`
                            <div class="w-full rounded-[28px] p-5 border space-y-5 flex flex-col relative cursor-pointer active:scale-[0.98] transition-transform ${M.card} ${M.border} ${M.glow} ${q} ${z}" data-lib-type="${h.type}" onclick="window.openLibraryView('${h.id}')">
                                <div class="flex justify-between items-start">
                                    <span class="text-3xl filter drop-shadow-md">${h.emoji||(D?"📘":"🎓")}</span>
                                    <span class="text-[10px] font-bold ${N} px-3 py-1.5 rounded-xl uppercase tracking-widest border">${R[h.status]||"Para Iniciar"}</span>
                                </div>
                                <div>
                                    <span class="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1 block">${b} • ${h.author||""}</span>
                                    <h4 class="font-bold text-[var(--text-primary)] text-[18px] leading-tight">${h.title}</h4>
                                </div>
                                <div class="space-y-3 mt-auto">
                                    <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                                        <div class="h-full ${M.bar} rounded-full" style="width:${C}%"></div>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <button class="text-xs font-bold text-on-surface-variant hover:text-white transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${h.id}')">${v} ${h.current||0} de ${h.total||0}</button>
                                        <span class="text-xs font-extrabold ${M.pct}">${C}%</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button class="w-9 h-9 rounded-xl border text-lg font-extrabold transition-colors ${M.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${h.id}', -1)">-</button>
                                        <button class="w-9 h-9 rounded-xl border text-lg font-extrabold transition-colors ${M.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${h.id}', 1)">+</button>
                                        <button class="flex-1 h-9 rounded-xl border border-white/10 bg-black/20 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${h.id}')">Definir atual</button>
                                    </div>
                                </div>
                            </div>`},i={in_progress:0,to_do:1,done:2},m=[...l].sort((h,_)=>(i[h.status]??1)-(i[_.status]??1)),j=m.filter(h=>h.status!=="done"),$=m.filter(h=>h.status==="done"),E=j.map(h=>L(h,!1)).join(""),S=$.length>0?`
                            <div class="pt-2">
                                <button onclick="window.toggleLibDoneSection()" class="w-full flex items-center justify-between px-2 py-3 text-on-surface-variant/60 hover:text-on-surface-variant transition-colors">
                                    <span class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                        <span class="material-symbols-outlined text-sm">check_circle</span>
                                        Concluídos (${$.length})
                                    </span>
                                    <span class="material-symbols-outlined text-sm transition-transform" id="lib-done-chevron">expand_more</span>
                                </button>
                                <div id="lib-done-section" class="hidden space-y-4 pt-2">
                                    ${$.map(h=>L(h,!0)).join("")}
                                </div>
                            </div>`:"";return E+S})()}
                </div>

                <!-- Floating Bottom Button -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-surface-highest border border-white/10 text-[var(--text-primary)] font-extrabold text-lg shadow-xl hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2" onclick="window.openLibraryForm()">
                        <span class="material-symbols-outlined">add</span> Adicionar Obra
                    </button>
                </div>
            </div>
        </div>

        <!-- Library CRUD Form Modal (Overlays Library List) -->
        <div id="library-form-modal" class="fixed inset-0 z-[300] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="library-form-overlay" onclick="window.closeLibraryForm()"></div>
            
            <div class="relative w-full h-[90vh] bg-surface-container rounded-t-[40px] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] transform translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="library-form-sheet">
                
                <div class="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-surface-container/50 backdrop-blur top-0 z-10 sticky rounded-t-[40px]">
                    <h3 class="font-extrabold text-xl text-[var(--text-primary)] font-headline" id="lbl-lib-form-title">Nova Obra</h3>
                    <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeLibraryForm()">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <!-- Form Scroll -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-6 hide-scrollbar">
                    
                    <div class="flex gap-4">
                        <!-- Emoji -->
                        <div class="bg-surface-highest rounded-[24px] w-20 flex flex-col items-center justify-center border border-white/5 p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ícone</span>
                            <input type="text" id="lib-emoji" placeholder="🎓" maxlength="2" class="w-full bg-transparent text-center text-4xl p-0 border-none focus:ring-0">
                        </div>
                        <!-- Tipo -->
                        <div class="bg-surface-highest p-1.5 flex flex-1 rounded-[24px] border border-white/5 relative">
                            <button class="flex-1 rounded-2xl py-2 font-bold text-sm bg-primary/20 text-primary accent-text transition-all" id="btn-type-course" onclick="window.setLibraryType('course')">Curso</button>
                            <button class="flex-1 rounded-2xl py-2 font-bold text-sm text-on-surface-variant transition-all hover:bg-white/5" id="btn-type-book" onclick="window.setLibraryType('book')">Livro</button>
                        </div>
                    </div>

                    <!-- Texts -->
                    <div class="space-y-4">
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Título</span>
                            <input type="text" id="lib-title" placeholder="Ex: Hábitos Atômicos" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-lg p-0 focus:ring-0">
                        </div>
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Autor / Instrutor</span>
                            <input type="text" id="lib-author" placeholder="Ex: James Clear" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-lg p-0 focus:ring-0">
                        </div>
                    </div>

                    <!-- Progress & Numbers -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-surface-highest rounded-[24px] p-4 flex flex-col items-center border border-white/5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 text-center">Já li/Fiz</span>
                            <input type="number" id="lib-current" placeholder="0" class="w-full text-center bg-transparent border-none text-3xl font-extrabold text-[var(--text-primary)] p-0 focus:ring-0 font-headline">
                        </div>
                        <div class="bg-surface-highest rounded-[24px] p-4 flex flex-col items-center border border-white/5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 text-center">Total (Págs/Aulas)</span>
                            <input type="number" id="lib-total" placeholder="100" class="w-full text-center bg-transparent border-none text-3xl font-extrabold text-[var(--text-primary)] p-0 focus:ring-0 font-headline">
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="space-y-2">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block px-2">Status da Obra</span>
                        <div class="flex gap-2 pb-1 overflow-x-auto hide-scrollbar -mx-2 px-2" style="scrollbar-width:none;">
                            <button class="lib-status-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="to_do" onclick="window.setLibraryStatus(this)">Para Iniciar</button>
                            <button class="lib-status-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-blue-400 bg-blue-400/20 text-blue-400 shadow-[0_4px_15px_rgba(96,165,250,0.15)] text-sm font-bold transition-all hover:bg-blue-400/30 active:scale-95" data-val="in_progress" onclick="window.setLibraryStatus(this)">Em Andamento</button>
                            <button class="lib-status-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="done" onclick="window.setLibraryStatus(this)">Concluído</button>
                        </div>
                    </div>

                    <!-- Gênero e Opinião -->
                    <div class="space-y-4 pt-2">
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Gênero</span>
                            <input type="text" id="lib-genre" placeholder="Ex: Produtividade" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0">
                        </div>
                        
                        <!-- Rating 5 Stars -->
                        <div class="bg-surface-highest rounded-[24px] p-5 border border-white/5 flex flex-col items-center gap-4">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Sua Nota Pessoal</span>
                            <div class="flex gap-1 sm:gap-4">
                                ${[1,2,3,4,5].map(l=>`<button class="lib-star text-4xl grayscale opacity-30 hover:scale-110 active:scale-90 transition-all text-yellow-500 drop-shadow-lg" onclick="window.setLibraryRating(${l})">⭐</button>`).join("")}
                            </div>
                        </div>

                        <!-- Review Textarea -->
                        <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-2">Suas Notas e Resumo</span>
                            <textarea id="lib-review" placeholder="Quais os principais aprendizados que você teve com essa obra?" class="w-full bg-transparent border-none text-[var(--text-primary)] text-sm p-0 focus:ring-0 resize-none min-h-[120px] leading-relaxed"></textarea>
                        </div>
                    </div>

                </div>

                <!-- Footer Action Buttons -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container via-surface-container to-transparent flex gap-4" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-16 h-16 rounded-[24px] bg-red-500/10 text-red-500 font-extrabold flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform hidden" id="btn-lib-delete" onclick="window.deleteLibraryItem()">
                        <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                    <button class="flex-1 h-16 rounded-[24px] bg-[var(--text-primary)] text-surface-highest font-extrabold text-lg shadow-xl active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2" onclick="window.saveLibraryForm()">
                        <span class="material-symbols-outlined">save</span> Salvar Obra
                    </button>
                </div>
            </div>
        </div>
    `}const $e=[{id:"wakeup_early",name:"Acordar cedo",icon:"wb_sunny"},{id:"gym",name:"Academia",icon:"fitness_center"},{id:"breakfast",name:"Café da manhã",icon:"coffee"},{id:"lunch",name:"Almoço",icon:"restaurant"},{id:"study_dio",name:"Estudos DIO",icon:"school"},{id:"reading",name:"Leitura",icon:"menu_book"},{id:"dinner",name:"Janta",icon:"restaurant_menu"},{id:"fill_notion",name:"Preencher Notion",icon:"edit_note"}],ne=()=>window.APP_HABITS||$e;function De(e,t){const a=Object.values(e||{}),n=a.reduce((r,o)=>r+Number(o.income_dia||0)-Number(o.expense_dia||0),0),s=a.reduce((r,o)=>r+Number(o.income_din||0)-Number(o.expense_din||0),0);return{diaBalance:n,dinheiroBalance:s}}function xe(e){if(!e)return 0;if(e.rest_day)return 100;const t=ne();let a=0;const n=e.habits||{};for(const s of t)n[s.id]&&a++;return Math.round(a/t.length*100)}function le(e=new Date){const t=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`${t}-${a}-${n}`}function Ie(e){const t=new Date(e),a=t.getDay(),n=a===0?-6:-(a-1);return t.setDate(t.getDate()+n),t.setHours(0,0,0,0),t}async function W(){var t;const e=document.getElementById("dashboard-root");try{const a=await d.getTodayLog(),n=await d.getLibrary();window._libraryItems=n;const s=ne();let r=0;a.habits||(a.habits={});for(const _ of s)a.habits[_.id]&&r++;const o=!!a.rest_day,c=xe(a),f=s.length-r,k=o||r===s.length,y=["D","S","T","Q","Q","S","S"],g=new Date,p=le(g),w=await d.getAllDailyLogs(),F=De(w,p),x=g.getMonth(),B=g.getFullYear(),I=`${B}-${String(x+1).padStart(2,"0")}`,T=new Date(B,x,1),A=new Date(B,x+1,0),H=[];let P=0,O=!1,K=0,l=Ie(T);for(;l<=A;){const _=[];let C=!1;for(let D=0;D<5;D++){const M=new Date(l);M.setDate(l.getDate()+D);const u=M.getMonth()===x,v=le(M);u&&(C=!0);const b=u?w==null?void 0:w[v]:null,N=u?xe(b):0,V=!!(b&&b.rest_day),q=u?v===p?"today":v<p?"past":"future":"outside";_.push({day:y[M.getDay()],dayNumber:M.getDate(),dateKey:v,state:q,pct:N,isRestDay:V}),v===p&&(P=K,O=!0)}if(C){const D=_.find(u=>u.state!=="outside"),R=[..._].reverse().find(u=>u.state!=="outside");H.push({index:K,label:`Semana ${K+1}`,rangeLabel:D&&R?`${String(D.dayNumber).padStart(2,"0")} - ${String(R.dayNumber).padStart(2,"0")}`:"",days:_}),K++}l.setDate(l.getDate()+7)}if(!O&&H.length>0){const _=H.findLastIndex(C=>C.days.some(D=>D.state!=="outside"&&D.dateKey<=p));P=_>=0?_:0}let L=P;window._snapWeekMonthKey===I&&Number.isInteger(window._snapWeekIndex)&&(L=Math.max(0,Math.min(window._snapWeekIndex,H.length-1))),window._snapWeekMonthKey=I;const i=((t=H[L])==null?void 0:t.days)||[],m=i.filter(_=>_.pct===100&&!_.isRestDay).length,j=g.getDay()===1,$=i.findIndex(_=>_.state==="today");let E=`${m} dias perfeitos. <span class="text-primary accent-text">Não quebre a sequência hoje!</span>`;o&&(E="Hoje é dia de descanso. Recuperar também é disciplina."),m===5?E="Semana Lendária concluída! Descanse nos fins de semana.":j&&c===0?E="Tela em branco. Vamos desenhar uma semana perfeita?":$>0&&i[$-1].pct<100?E="Ontem foi dia de descanso, mas hoje é foco total!":c===0&&(E="O dia está voando. Hora do primeiro check-in!"),e.innerHTML=_e({todayLog:a,balances:F,todayPct:c,missing:f,isAllDone:k,weekData:i,snapWeeks:H,currentWeekIndex:L,DEFAULT_HABITS:ne(),snapMessage:E,libraryItems:n});const S=document.getElementById("snap-weeks-carousel"),h=S==null?void 0:S.querySelector(`[data-week-index="${L}"]`);if(S&&h){requestAnimationFrame(()=>{S.scrollTo({left:h.offsetLeft,behavior:"auto"})});const _=()=>{const D=Array.from(S.querySelectorAll("[data-week-index]")),M=Array.from(document.querySelectorAll("[data-week-dot]"));if(!D.length||!M.length)return;let R=0,u=Number.POSITIVE_INFINITY;for(const v of D){const b=Number(v.getAttribute("data-week-index")),N=Math.abs(v.offsetLeft-S.scrollLeft);N<u&&(u=N,R=b)}window._snapWeekIndex=R,M.forEach(v=>{const b=Number(v.getAttribute("data-week-dot"))===R;v.classList.toggle("bg-primary",b),v.classList.toggle("accent-bg",b),v.classList.toggle("bg-white/20",!b)})};let C=null;S.addEventListener("scroll",()=>{C||(C=requestAnimationFrame(()=>{_(),C=null}))},{passive:!0}),_()}await Q()}catch(a){console.error(a),e.innerHTML=`<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Dashboard:</h3><pre>${a.message}
${a.stack}</pre></div>`}}window.openCheckinModal=async()=>{const e=document.getElementById("checkin-modal"),t=document.getElementById("checkin-modal-overlay"),a=document.getElementById("checkin-modal-sheet");e.classList.remove("hidden"),e.classList.add("flex");const n=new Date,s=document.getElementById("lbl-checkin-date"),r=document.getElementById("lbl-checkin-day");s&&(s.textContent=n.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}).replace(".","").toUpperCase()),r&&(r.textContent=n.toLocaleDateString("pt-BR",{weekday:"long"}));const o=await d.getTodayLog(),c={nervoso:"Nervoso",feliz:"Feliz",produtivo:"Produtivo",normal:"Normal",ansioso:"Ansioso",cansado:"Cansado",triste:"Triste"};if(o.mood){const g=c[o.mood];document.querySelectorAll(".mood-btn").forEach(p=>{p.textContent.trim()===g&&window.selectChip(p,"mood-btn",!0)})}const f={perfeito:"Perfeito",muito_bom:"Muito bom",bom:"Bom",mais_ou_menos:"Mais ou menos",ruim:"Ruim"};if(o.sleep){const g=f[o.sleep];document.querySelectorAll(".sleep-btn").forEach(p=>{p.textContent.trim()===g&&window.selectChip(p,"sleep-btn",!0)})}const k=o.water||0;if(k>0)for(let g=1;g<=5;g++){const p=document.getElementById(`water-drop-${g}`);p&&(g<=k?(p.classList.remove("grayscale","opacity-30"),p.classList.add("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")):(p.classList.add("grayscale","opacity-30"),p.classList.remove("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")))}const y=document.getElementById("input-wake-time");y&&(y.value=o.wake_time||""),window.toggleRestDay(!!o.rest_day,!0),requestAnimationFrame(()=>{t.classList.remove("opacity-0"),a.classList.remove("translate-y-full")})};window.closeCheckinModal=async()=>{const e=document.getElementById("input-wake-time"),t=[];e&&t.push(d.updateDailyMetrics("wake_time",e.value||""));const a=document.getElementById("rest-day-toggle-checkin"),n=(a==null?void 0:a.dataset.active)==="true";t.push(d.updateDailyMetrics("rest_day",!!n));const s=document.getElementById("input-fluxo-dia-income"),r=document.getElementById("input-fluxo-dia-expense"),o=document.getElementById("input-fluxo-din-income"),c=document.getElementById("input-fluxo-din-expense");if(s||r||o||c){const g={income_dia:s&&parseFloat(s.value)||0,expense_dia:r&&parseFloat(r.value)||0,income_din:o&&parseFloat(o.value)||0,expense_din:c&&parseFloat(c.value)||0},p=le(new Date);t.push(d.updateDailyFinances(p,g))}await Promise.all(t);const f=document.getElementById("checkin-modal"),k=document.getElementById("checkin-modal-overlay"),y=document.getElementById("checkin-modal-sheet");k.classList.add("opacity-0"),y.classList.add("translate-y-full"),setTimeout(()=>{f.classList.add("hidden"),f.classList.remove("flex"),W()},500)};let fe=null;window.openLibraryView=e=>{const a=(window._libraryItems||[]).find(F=>F.id===e)||{id:e,emoji:"📘",title:"",author:"",type:"book",status:"",current:0,total:0};fe=a,document.getElementById("lbl-lv-emoji").innerText=a.emoji||"📘",document.getElementById("lbl-lv-title").innerText=a.title||"",document.getElementById("lbl-lv-author").innerText=a.author||"";const n=a.total>0?Math.round(a.current/a.total*100):0,s=a.type==="book",r=s?"bg-cyan-400 shadow-[0_0_10px_rgba(136,235,255,0.5)]":"bg-primary accent-bg shadow-[0_0_10px_rgba(var(--accent-color-rgb),0.4)]",o=s?"text-cyan-400":"text-primary accent-text",c=s?"Pág":"Aula",f={to_do:"Para Iniciar",in_progress:"Em Andamento",done:"Concluído"},k={to_do:"text-on-surface-variant/60 border-white/10",in_progress:"text-blue-400 border-blue-400/20 bg-blue-400/10",done:"text-green-400 border-green-400/20 bg-green-400/10"},y=[];y.push(`
        <div class="flex gap-3">
            <div class="flex-1 bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Tipo</span>
                <p class="font-bold text-[var(--text-primary)]">${s?"📖 Livro":"📚 Curso"}</p>
            </div>
            <div class="flex-1 bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Status</span>
                <span class="inline-block px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${k[a.status]||""}">${f[a.status]||"—"}</span>
            </div>
        </div>`),y.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-5 border border-white/5 space-y-3">
            <div class="flex justify-between items-center">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Progresso</span>
                <span class="font-extrabold text-sm ${o}">${n}%</span>
            </div>
            <div class="h-2.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                <div class="h-full ${r} rounded-full transition-all" style="width:${n}%"></div>
            </div>
            <p class="text-xs font-bold text-on-surface-variant">${c} ${a.current} de ${a.total}</p>
        </div>`),a.genre&&y.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gênero</span>
            <p class="font-bold text-[var(--text-primary)]">${a.genre}</p>
        </div>`),a.rating&&y.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Sua Nota</span>
            <span class="text-xl tracking-wide">${"⭐".repeat(a.rating)}${'<span class="grayscale opacity-30">⭐</span>'.repeat(5-a.rating)}</span>
        </div>`),a.review&&y.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Suas Notas</span>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed">${a.review}</p>
        </div>`),document.getElementById("library-view-content").innerHTML=y.join("");const g=document.getElementById("library-view-modal"),p=document.getElementById("library-view-overlay"),w=document.getElementById("library-view-sheet");g.classList.remove("hidden"),g.classList.add("flex"),requestAnimationFrame(()=>{p.classList.remove("opacity-0"),w.classList.remove("translate-y-full")})};window.closeLibraryView=()=>{const e=document.getElementById("library-view-modal"),t=document.getElementById("library-view-overlay"),a=document.getElementById("library-view-sheet");t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},500)};window.openLibraryEditFromView=()=>{const e=fe;window.closeLibraryView(),setTimeout(()=>{window.openLibraryForm(e==null?void 0:e.id,e)},200)};window.openLibraryModal=e=>{const t=document.getElementById("library-modal"),a=document.getElementById("library-modal-overlay"),n=document.getElementById("library-modal-sheet");t.classList.remove("hidden"),t.classList.add("flex"),requestAnimationFrame(()=>{a.classList.remove("opacity-0"),n.classList.remove("translate-y-full")}),window.filterLibrary(e||"all")};window.closeLibraryModal=()=>{const e=document.getElementById("library-modal"),t=document.getElementById("library-modal-overlay"),a=document.getElementById("library-modal-sheet");t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},500)};window.filterLibrary=e=>{document.querySelectorAll(".lib-filter-btn").forEach(a=>{a.classList.remove("bg-primary/20","text-primary","border","border-primary/30"),a.classList.add("bg-surface-highest","text-on-surface-variant","border","border-white/10")});const t=document.querySelector(`.lib-filter-btn[data-filter="${e}"]`);t&&(t.classList.remove("bg-surface-highest","text-on-surface-variant","border-white/10"),t.classList.add("bg-primary/20","text-primary","border-primary/30")),document.querySelectorAll("#library-modal-list [data-lib-type]").forEach(a=>{e==="all"||a.dataset.libType===e?a.classList.remove("hidden"):a.classList.add("hidden")})};window.openLibraryForm=(e=null,t=null)=>{const a=document.getElementById("library-form-modal"),n=document.getElementById("library-form-overlay"),s=document.getElementById("library-form-sheet"),r=document.getElementById("lbl-lib-form-title"),o=document.getElementById("btn-lib-delete");window.setLibraryType("course"),window.setLibraryRating(0);const c=document.querySelector('.lib-status-btn[data-val="in_progress"]');if(c&&window.setLibraryStatus(c),e&&t){if(window._editingLibId=e,r.innerText="Editar Obra",o.classList.remove("hidden"),document.getElementById("lib-emoji").value=t.emoji||"",document.getElementById("lib-title").value=t.title||"",document.getElementById("lib-author").value=t.author||"",document.getElementById("lib-current").value=t.current||"",document.getElementById("lib-total").value=t.total||"",document.getElementById("lib-genre").value=t.genre||"",document.getElementById("lib-review").value=t.review||"",window.setLibraryType(t.type==="book"?"book":"course"),window.setLibraryRating(t.rating||0),t.status){const f=document.querySelector(`.lib-status-btn[data-val="${t.status}"]`);f&&window.setLibraryStatus(f)}}else window._editingLibId=null,r.innerText="Nova Obra",o.classList.add("hidden"),document.querySelectorAll("#library-form-sheet input, #library-form-sheet textarea").forEach(f=>f.value="");a.classList.remove("hidden"),a.classList.add("flex"),requestAnimationFrame(()=>{n.classList.remove("opacity-0"),s.classList.remove("translate-y-full")})};window.closeLibraryForm=()=>{const e=document.getElementById("library-form-modal"),t=document.getElementById("library-form-overlay"),a=document.getElementById("library-form-sheet");t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},300)};window.setLibraryType=e=>{const t=document.getElementById("btn-type-course"),a=document.getElementById("btn-type-book");e==="course"?(t.classList.add("bg-primary/20","text-primary","accent-text"),t.classList.remove("text-on-surface-variant","bg-transparent","hover:bg-white/5"),a.classList.remove("bg-primary/20","text-primary","accent-text"),a.classList.add("text-on-surface-variant","bg-transparent","hover:bg-white/5")):(a.classList.add("bg-primary/20","text-primary","accent-text"),a.classList.remove("text-on-surface-variant","bg-transparent","hover:bg-white/5"),t.classList.remove("bg-primary/20","text-primary","accent-text"),t.classList.add("text-on-surface-variant","bg-transparent","hover:bg-white/5"))};window.setLibraryStatus=e=>{document.querySelectorAll(".lib-status-btn").forEach(a=>{a.classList.remove("border-blue-400","bg-blue-400/20","text-blue-400","border-primary","bg-primary/20","text-primary","accent-text","accent-border"),a.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")});const t=e.getAttribute("data-val");e.classList.remove("border-white/10","bg-surface-highest","text-on-surface-variant"),t==="in_progress"?e.classList.add("border-blue-400","bg-blue-400/20","text-blue-400"):t==="done"?e.classList.add("border-primary","bg-primary/20","text-primary","accent-text","accent-border"):e.classList.add("text-white","border-white/50")};window.setLibraryRating=e=>{document.querySelectorAll(".lib-star").forEach((a,n)=>{n<e?(a.classList.remove("grayscale","opacity-30"),a.classList.add("filter-none","opacity-100")):(a.classList.add("grayscale","opacity-30"),a.classList.remove("filter-none","opacity-100"))})};window.saveLibraryForm=async()=>{var o;const e=document.getElementById("lib-title").value.trim();if(!e){document.getElementById("lib-title").focus();return}const t=(o=document.getElementById("btn-type-book"))==null?void 0:o.classList.contains("text-primary"),a=document.querySelector(".lib-status-btn.text-blue-400, .lib-status-btn.text-primary, .lib-status-btn.text-white"),n=document.querySelectorAll(".lib-star");let s=0;n.forEach((c,f)=>{c.classList.contains("grayscale")||(s=f+1)});const r={id:window._editingLibId||Date.now().toString(),emoji:document.getElementById("lib-emoji").value||(t?"📘":"🎓"),title:e,author:document.getElementById("lib-author").value.trim(),type:t?"book":"course",status:(a==null?void 0:a.dataset.val)||"to_do",current:parseInt(document.getElementById("lib-current").value)||0,total:parseInt(document.getElementById("lib-total").value)||0,genre:document.getElementById("lib-genre").value.trim(),rating:s,review:document.getElementById("lib-review").value.trim()};await d.saveLibraryItem(r),window.closeLibraryForm(),setTimeout(()=>W(),400)};window.adjustLibraryProgress=async(e,t=1)=>{const n=(window._libraryItems||[]).find(f=>f.id===e);if(!n)return;const s=Math.max(0,parseInt(n.total,10)||0),r=Math.max(0,parseInt(n.current,10)||0);let o=r+Number(t||0);if(s>0?o=Math.max(0,Math.min(s,o)):o=Math.max(0,o),o===r)return;const c={...n,current:o};await d.saveLibraryItem(c),await W()};window.quickSetLibraryProgress=async e=>{var y;const a=(window._libraryItems||[]).find(g=>g.id===e);if(!a)return;const n=a.type==="book"?"página atual":"aula atual",s=Math.max(0,parseInt(a.current,10)||0),r=Math.max(0,parseInt(a.total,10)||0),o=window.prompt(`Digite a ${n}:`,String(s));if(o===null)return;const c=Number.parseInt(String(o).trim(),10);if(!Number.isFinite(c)||c<0){(y=window.showToast)==null||y.call(window,"Valor invalido. Use um numero inteiro maior ou igual a 0.","error");return}let f=c;if(r>0&&(f=Math.min(r,f)),f===s)return;const k={...a,current:f};await d.saveLibraryItem(k),await W()};window.deleteLibraryItem=async()=>{window._editingLibId&&confirm("Tem certeza que deseja excluir esta obra?")&&(await d.deleteLibraryItem(window._editingLibId),window.closeLibraryForm(),setTimeout(()=>W(),400))};window.toggleLibDoneSection=()=>{const e=document.getElementById("lib-done-section"),t=document.getElementById("lib-done-chevron");if(!e||!t)return;const a=e.classList.contains("hidden");e.classList.toggle("hidden",!a),t.style.transform=a?"rotate(180deg)":""};window.setWaterInput=async e=>{await d.updateDailyMetrics("water",e);for(let t=1;t<=5;t++){const a=document.getElementById(`water-drop-${t}`);a&&(t<=e?(a.classList.remove("grayscale","opacity-30"),a.classList.add("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")):(a.classList.add("grayscale","opacity-30"),a.classList.remove("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")))}};window.selectChip=(e,t,a=!1)=>{const n={Nervoso:"nervoso",Feliz:"feliz",Produtivo:"produtivo",Normal:"normal",Ansioso:"ansioso",Cansado:"cansado",Triste:"triste"},s={Perfeito:"perfeito","Muito bom":"muito_bom",Bom:"bom","Mais ou menos":"mais_ou_menos",Ruim:"ruim"};document.querySelectorAll(`.${t}`).forEach(o=>{const c=o.getAttribute("data-active-class").split(" ");o.classList.remove(...c,"opacity-100"),o.classList.add("border-transparent","bg-surface-highest","text-on-surface-variant","opacity-60")});const r=e.getAttribute("data-active-class").split(" ");if(e.classList.remove("border-transparent","bg-surface-highest","text-on-surface-variant","opacity-60"),e.classList.add(...r,"opacity-100"),!a){const o=e.textContent.trim();t==="mood-btn"&&n[o]?(d.updateDailyMetrics("mood",n[o]),Q()):t==="sleep-btn"&&s[o]&&(d.updateDailyMetrics("sleep",s[o]),Q())}};window.toggleHabit=async(e,t)=>{var r;const a=document.getElementById("rest-day-toggle-checkin");if((a==null?void 0:a.dataset.active)==="true"){(r=window.showToast)==null||r.call(window,"Dia de descanso ativo. Desative para editar hábitos.","info");return}await d.updateHabit(e,t),Q();const n=document.getElementById(`txt-${e}`),s=document.getElementById(`circle-${e}`);n&&s&&(t?(n.classList.add("line-through","text-on-surface-variant","opacity-50"),n.classList.remove("text-[var(--text-primary)]"),s.classList.add("border-primary","accent-border","bg-primary","accent-bg"),s.classList.remove("border-on-surface-variant/30","group-hover/habit:border-on-surface-variant/50"),s.innerHTML=`<span class="material-symbols-outlined text-black mix-blend-color-burn" style="font-size: 16px; font-variation-settings: 'FILL' 1;">check</span>`,s.parentElement.setAttribute("onclick",`window.toggleHabit('${e}', false)`)):(n.classList.remove("line-through","text-on-surface-variant","opacity-50"),n.classList.add("text-[var(--text-primary)]"),s.classList.remove("border-primary","accent-border","bg-primary","accent-bg"),s.classList.add("border-on-surface-variant/30","group-hover/habit:border-on-surface-variant/50"),s.innerHTML="",s.parentElement.setAttribute("onclick",`window.toggleHabit('${e}', true)`)))};window.setQualitative=async(e,t)=>{await d.updateDailyMetrics(e,t),Q(),W()};window.updateWater=async e=>{const t=await d.getTodayLog(),a=Math.max(0,(t.water||0)+e);await d.updateDailyMetrics("water",a);const n=document.getElementById("lbl-water");n&&(n.innerText=`${a.toFixed(1)} L`),Q()};window.toggleRestDay=async(e=null,t=!1)=>{const a=document.getElementById("rest-day-toggle-checkin"),n=document.getElementById("rest-day-badge-checkin"),s=document.getElementById("checkin-habits-section");if(!a||!n||!s)return;const r=a.dataset.active==="true",o=e===null?!r:!!e;a.dataset.active=String(o),o?(a.classList.add("bg-amber-400/20","border-amber-300/40","text-amber-200"),a.classList.remove("bg-surface-highest","border-white/10","text-on-surface-variant"),n.classList.remove("hidden"),s.classList.add("opacity-40")):(a.classList.remove("bg-amber-400/20","border-amber-300/40","text-amber-200"),a.classList.add("bg-surface-highest","border-white/10","text-on-surface-variant"),n.classList.add("hidden"),s.classList.remove("opacity-40")),t||(await d.updateDailyMetrics("rest_day",o),await Q())};async function Q(){const e=await d.getTodayLog(),t=ne();let a=0;e.habits||(e.habits={});for(const w of t)e.habits[w.id]&&a++;const n=t.length,s=!!e.rest_day,r=s?100:a/n*100,o=document.getElementById("lbl-habit-counter");o&&(o.innerText=s?"Descanso":`${a}/${n}`);const c=document.getElementById("checkin-internal-bar");c&&(c.style.width=`${r}%`);const f=document.getElementById("checkin-pct-text");f&&(f.innerText=`${Math.round(r)}%`);const k=document.getElementById("checkin-container");s||a===n?k&&(k.classList.remove("border-transparent"),k.classList.add("border","border-primary/50","accent-border","shadow-[0_0_20px_var(--accent-color)]","accent-glow")):k&&(k.classList.add("border-transparent"),k.classList.remove("border","border-primary/50","accent-border","shadow-[0_0_20px_var(--accent-color)]","accent-glow"));const y=document.getElementById("snap-ring-today-circle"),g=document.getElementById("snap-ring-today-text"),p=document.getElementById("snap-ring-today-container");if(y&&g&&p){const w=Math.round(r),F=2*Math.PI*16,x=F-r/100*F;s?(p.style.boxShadow="0 0 15px rgba(251,191,36,0.45)",p.querySelector("svg").innerHTML='<circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="transparent" />',g.innerHTML=`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">hotel</span>`):w===100?(p.style.boxShadow="0 0 15px var(--accent-color)",p.querySelector("svg").innerHTML='<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />',g.innerHTML=`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`):(p.style.boxShadow="none",y.style.strokeDashoffset=x,g.innerHTML=`<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${w}%</span>`)}}function Ee({calendarData:e,calendarYear:t,calendarMonth:a,historyDays:n,metrics:s,kanbanData:r,habitCatalog:o=[],habitFilterMonthLabel:c="",fullHistoryRows:f=[],fullHistoryMonths:k=[],fullHistoryCurrentMonthKey:y="",isCurrentMonth:g=!0}){const p={nervoso:{label:"Nervoso",classes:"border-red-500 bg-red-500/20 text-red-500"},feliz:{label:"Feliz",classes:"border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]"},produtivo:{label:"Produtivo",classes:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},normal:{label:"Normal",classes:"border-white/50 bg-white/10 text-white"},ansioso:{label:"Ansioso",classes:"border-orange-400 bg-orange-400/20 text-orange-400"},cansado:{label:"Cansado",classes:"border-purple-400 bg-purple-400/20 text-purple-400"},triste:{label:"Triste",classes:"border-blue-400 bg-blue-400/20 text-blue-400"}},w={perfeito:{label:"Perfeito",classes:"border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.2)]"},muito_bom:{label:"Muito bom",classes:"border-blue-400 bg-blue-400/20 text-blue-400"},bom:{label:"Bom",classes:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},mais_ou_menos:{label:"Mais ou menos",classes:"border-orange-400 bg-orange-400/20 text-orange-400"},ruim:{label:"Ruim",classes:"border-red-500 bg-red-500/20 text-red-500"}},F=i=>{if(!i||!p[i])return'<span class="text-xs font-bold text-on-surface-variant/60">—</span>';const m=p[i];return`<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl border text-[10px] font-bold ${m.classes}">${m.label}</span>`},x=i=>{if(!i||!w[i])return'<span class="text-xs font-bold text-on-surface-variant/60">—</span>';const m=w[i];return`<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl border text-[10px] font-bold ${m.classes}">${m.label}</span>`},B=i=>{if(!i)return"";const m=new Date(`${i}T00:00:00`);return Number.isNaN(m.getTime())?"":new Intl.DateTimeFormat("pt-BR",{weekday:"long"}).format(m)},I=(i,m=!1)=>`
        <button class="${m?"history-day-row":""} w-full text-left border-b border-white/5 hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
                ${m?`data-month-key="${i.monthKey||""}"`:""}
                onclick="window.openDailyDetail('${i.rawDate}')">
            <div class="grid items-center gap-3 px-3 py-3" style="grid-template-columns: 140px 130px 110px 95px 120px 80px;">
                <div class="flex items-center gap-2 leading-none">
                    <span class="text-sm font-extrabold text-[var(--text-primary)]">${i.date}</span>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/65">${B(i.rawDate)}</span>
                </div>

                <div>
                    <div class="h-2 w-full bg-surface-highest rounded-full overflow-hidden border border-white/5">
                        <div class="h-full ${i.restDay?"bg-amber-300":"bg-primary accent-bg"}" style="width: ${i.pct}%"></div>
                    </div>
                    <div class="text-[10px] font-extrabold ${i.restDay?"text-amber-300":"text-primary accent-text"} mt-1">${i.restDay?"Descanso":`${i.pct}%`}</div>
                </div>

                <div>${F(i.mood)}</div>

                <div class="text-xs font-bold text-[var(--text-primary)]">${i.wake_time||"--:--"}</div>

                <div>${x(i.sleep)}</div>

                <div class="text-xs font-bold text-cyan-300">${Number(i.water||0)}L</div>
            </div>
        </button>
    `,T=i=>I(i,!0),A=new Date,H=t??A.getFullYear(),P=a??A.getMonth(),O=new Date(H,P,1).getDay(),l=Array.from({length:O},()=>'<div class="aspect-square w-full"></div>').join("")+e.map(i=>{const m=g&&i.day===A.getDate(),j=!i.isFuture,$=i.level===3&&i.pct===100;let E="";switch(i.level){case 0:E="bg-white/[0.04]";break;case 1:E="bg-primary/25 opacity-50";break;case 2:E="bg-primary/55 opacity-90 shadow-[0_0_6px_var(--accent-color)]";break;case 3:E=$?"bg-primary accent-bg ring-1 ring-white/65 shadow-[0_0_20px_var(--accent-color)]":"bg-primary/70 border border-primary/45 shadow-[0_0_6px_var(--accent-color)]";break;case 4:E="bg-amber-200/70 border border-amber-200/35";break}const S=m?"ring-2 ring-primary/80 accent-border scale-105":"",h=i.level===4?"text-amber-900/70":$?"text-black/85":i.level===3?"text-white/90":i.level>=2?"text-white/70":"text-white/25",_=$?`<span class="absolute top-1 right-1 material-symbols-outlined text-[10px] text-black/75" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>`:"",C=j?"cursor-pointer hover:scale-110 hover:brightness-125":"cursor-default",D=j?`onclick="window.openDailyDetail('${i.rawDate}')"`:"";return`<div title="Dia ${i.day}" ${D} class="aspect-square w-full rounded-lg ${E} ${S} relative flex items-center justify-center text-[9px] font-extrabold ${h} select-none transition-all duration-200 ${C}">${i.day}${_}</div>`}).join(""),L=n.slice(0,6).map(i=>I(i,!1)).join("");return`
        <div class="space-y-6 pb-12 font-headline animate-[fade-in_0.4s_ease-out]">

            <!-- Calendário e Métricas Integradas -->
            <section class="bg-surface-container-low rounded-[40px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 blur-[100px] -mr-36 -mt-36 opacity-30 pointer-events-none"></div>

                <!-- Header da Seção -->
                <div class="flex items-center justify-between mb-5 px-1">
                    <div>
                        <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Consistência</h3>
                        <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mt-0.5 block">${["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][P]} ${H}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.openHabitFilterModal()" class="h-8 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-white/10 bg-surface-highest text-[9px] sm:text-[10px] font-extrabold tracking-[0.08em] sm:tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
                            Filtrar hábitos
                        </button>
                        <button onclick="window.prevCalMonth()" class="w-9 h-9 rounded-xl border border-white/10 bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90">
                            <span class="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <button onclick="window.nextCalMonth()" class="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center transition-colors active:scale-90 ${g?"bg-surface-highest/30 text-on-surface-variant/30 cursor-not-allowed":"bg-surface-highest text-on-surface-variant hover:text-primary"}" ${g?"disabled":""}>
                            <span class="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>

                <!-- Cabeçalho dias da semana -->
                <div class="grid grid-cols-7 text-[10px] font-bold text-on-surface-variant/30 text-center uppercase tracking-widest mb-2">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                </div>

                <!-- Grade do Calendário -->
                <div class="grid grid-cols-7 gap-[5px] mb-6">
                    ${l}
                </div>

                <!-- Legenda de Níveis -->
                <div class="flex items-center gap-2 mb-6 px-1">
                    <span class="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Nada</span>
                    <div class="flex gap-1 items-center">
                        <div class="w-4 h-4 rounded-sm bg-white/[0.04]"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary/25 opacity-50"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary/55 opacity-90"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary/70 border border-primary/45"></div>
                        <div class="w-4 h-4 rounded-sm bg-primary accent-bg ring-1 ring-white/70 relative"><span class="material-symbols-outlined text-[8px] text-black/75 absolute inset-0 flex items-center justify-center" style="font-variation-settings: 'FILL' 1;">auto_awesome</span></div>
                        <div class="w-4 h-4 rounded-sm bg-amber-300"></div>
                    </div>
                    <span class="text-[9px] font-bold text-white/60 uppercase tracking-widest">67-99%</span>
                    <span class="text-[9px] font-bold text-primary accent-text uppercase tracking-widest">100%</span>
                    <span class="text-[9px] font-bold text-amber-300 uppercase tracking-widest">Descanso</span>
                </div>

                <!-- Divisória elegante -->
                <div class="h-px w-full bg-white/5 mb-5"></div>

                <!-- Métricas Integradas -->
                <div class="space-y-3 relative z-10">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 text-center">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest mb-1.5 block">Perfeitos</span>
                            <div class="text-2xl font-extrabold tracking-tighter text-emerald-300 font-headline leading-none">${s.perfectDays}</div>
                            <div class="text-[9px] text-on-surface-variant/40 font-bold mt-0.5">dias</div>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-3 flex flex-col items-center justify-center border border-white/5 text-center gap-1.5">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest block">Sono</span>
                            <span class="px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${(w[s.avgSleep]||{classes:"border-white/20 bg-white/5 text-on-surface-variant/50"}).classes}">${(w[s.avgSleep]||{label:s.avgSleep||"—"}).label}</span>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-3 flex flex-col items-center justify-center border border-white/5 text-center gap-1.5">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest block">Humor</span>
                            <span class="px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${(p[s.avgMood]||{classes:"border-white/20 bg-white/5 text-on-surface-variant/50"}).classes}">${(p[s.avgMood]||{label:s.avgMood||"—"}).label}</span>
                        </div>
                    </div>

                    <!-- Financeiro -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gasto Dia a Dia</span>
                                <div class="text-base font-extrabold tracking-tighter text-red-500 font-headline leading-none">R$ ${s.totalGastoDia.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
                            </div>
                            <span class="material-symbols-outlined text-red-500/25 text-2xl">payments</span>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gasto Meu Dinheiro</span>
                                <div class="text-base font-extrabold tracking-tighter text-red-400 font-headline leading-none">R$ ${s.totalGastoDinheiro.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
                            </div>
                            <span class="material-symbols-outlined text-red-400/25 text-2xl">account_balance_wallet</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Diário de Bordo Compacto -->
            <section class="space-y-4">
                <div class="flex justify-between items-center px-1">
                    <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Diário de <span class="text-on-surface-variant">Bordo</span></h3>
                    <span class="text-[10px] text-cyan-300 font-bold uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">${["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][A.getMonth()]}</span>
                </div>
                
                <div class="bg-surface-container-low rounded-[32px] p-2 border border-white/5 flex flex-col">
                    <div class="overflow-x-auto rounded-2xl border border-white/5" style="scrollbar-width:none;">
                        <div class="min-w-[760px] bg-surface-container-low/70 backdrop-blur">
                            <div class="grid items-center gap-3 px-3 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70" style="grid-template-columns: 140px 130px 110px 95px 120px 80px;">
                                <span>Data</span>
                                <span>Progresso</span>
                                <span>Humor</span>
                                <span>Acordou</span>
                                <span>Sono</span>
                                <span>Água</span>
                            </div>
                            ${L}
                        </div>
                    </div>
                    <button class="w-full py-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors flex items-center justify-center gap-2" onclick="window.openFullHistory()">
                        Ver Tudo <span class="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                </div>
            </section>

            <!-- Kanban Cérebro -->
            <section class="space-y-4 pt-6">
                 <div class="flex justify-between items-end px-2 mb-2">
                    <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Brain <span class="text-on-surface-variant">Kanban</span></h3>
                    <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant border border-white/5 hover:text-emerald-300 active:scale-90 transition-all" onclick="window.openKanbanForm()">
                        <span class="material-symbols-outlined text-lg font-bold">add</span>
                    </button>
                 </div>
                 <div class="flex items-start gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-6 pt-2 snap-x" style="scrollbar-width: none;">
                    ${(()=>{const i={estudo:"text-blue-400 bg-blue-400/10 border-blue-400/20",hobbie:"text-purple-400 bg-purple-400/10 border-purple-400/20",crescimento:"text-green-400 bg-green-400/10 border-green-400/20",trabalho:"text-orange-400 bg-orange-400/10 border-orange-400/20",saude:"text-cyan-400 bg-cyan-400/10 border-cyan-400/20",outro:"text-on-surface-variant bg-white/5 border-white/10"},m=$=>{const E=i[$.type]||i.outro;return`
                    <div class="kanban-card flex-none p-4 bg-surface-container rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.3)] border border-white/5 cursor-pointer hover:bg-surface-highest hover:border-white/10 transition-all relative overflow-hidden group" draggable="true" data-card-id="${$.id}" onclick="window.openKanbanView('${$.id}')" ondragstart="event.stopPropagation()" >
                                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/40 accent-bg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div class="flex items-start justify-between mb-2">
                                    <span class="text-2xl leading-none filter drop-shadow-sm">${$.emoji||"🎯"}</span>
                                    ${$.type?`<span class="text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${E}">${$.type}</span>`:""}
                                </div>
                                <p class="text-[var(--text-primary)] font-bold text-[14px] leading-snug mb-1">${$.title}</p>
                                ${$.objective?`<p class="text-on-surface-variant/50 text-[11px] leading-snug line-clamp-2">${$.objective}</p>`:""}
                            </div>`},j=($,E,S,h)=>`
                        <div class="flex-shrink-0 self-start w-[290px] flex flex-col gap-3">
                            <h4 class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pl-4 flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm opacity-40">${S}</span>
                                ${E} <span class="w-1 h-1 bg-white/20 rounded-full"></span> <span class="text-primary">${h.length}</span>
                            </h4>
                            <div class="kanban-column h-auto bg-surface-container-low/50 backdrop-blur rounded-[32px] p-4 min-h-[350px] border border-white/5 space-y-3 shadow-inner" data-column="${$}">
                                ${h.map(_=>m(_)).join("")}
                                ${h.length===0?'<div class="kanban-empty-state h-full flex items-center justify-center opacity-20 flex-col gap-2 mt-20"><span class="material-symbols-outlined text-4xl">inbox</span><p class="text-[10px] uppercase font-bold tracking-widest">Nada por aqui</p></div>':""}
                            </div>
                        </div>`;return`
                            ${j("ideas","A Fazer","lightbulb",r.ideas||[])}
                            ${j("doing","Em Progresso","pending",r.doing||[])}
                            ${j("done","Concluído","check_circle",r.done||[])}
                        `})()}
                 </div>
            </section>
        </div>

        <!-- Kanban VIEW Modal (click card) -->
        <div id="kanban-view-modal" class="fixed inset-0 z-[600] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="kanban-view-overlay" onclick="window.closeKanbanView()"></div>
            <div class="relative w-full h-[80vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="kanban-view-sheet">
                <!-- Handle + Header -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl" id="lbl-kv-emoji">🎯</span>
                            <div>
                                <h2 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-tight" id="lbl-kv-title">Título</h2>
                                <span id="lbl-kv-type" class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60"></span>
                            </div>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeKanbanView()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-28 space-y-4 hide-scrollbar" id="kanban-view-content"></div>
                <!-- Footer -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container-low via-surface-container-low to-transparent" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-[0_10px_30px_rgba(var(--accent-color-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2" onclick="window.openKanbanEditFromView()">
                        <span class="material-symbols-outlined">edit</span> Editar Card
                    </button>
                </div>
            </div>
        </div>

        <!-- Kanban CRUD Form Modal -->
        <div id="kanban-form-modal" class="fixed inset-0 z-[700] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="kanban-form-overlay" onclick="window.closeKanbanForm()"></div>
            
            <div class="relative w-full h-[90vh] bg-surface-container rounded-t-[40px] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] transform translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="kanban-form-sheet">
                
                <!-- Header -->
                <div class="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-surface-container/50 backdrop-blur top-0 z-10 sticky rounded-t-[40px]">
                    <h3 class="font-extrabold text-xl text-[var(--text-primary)] font-headline" id="lbl-kanban-form-title">Novo Card</h3>
                    <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeKanbanForm()">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <!-- Scrollable Form -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-6 hide-scrollbar">
                    
                    <!-- Emoji + Título -->
                    <div class="flex gap-4">
                        <div class="bg-surface-highest rounded-[24px] w-20 flex flex-col items-center justify-center border border-white/5 p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ícone</span>
                            <input type="text" id="kanban-emoji" placeholder="🎯" maxlength="2" class="w-full bg-transparent text-center text-4xl p-0 border-none focus:ring-0">
                        </div>
                        <div class="flex-1 bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors flex flex-col justify-center">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Título</span>
                            <input type="text" id="kanban-title" placeholder="Ex: Aprender Node.js" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-lg p-0 focus:ring-0">
                        </div>
                    </div>

                    <!-- Tipo / Área -->
                    <div class="space-y-2">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block px-2">Área</span>
                        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="estudo" onclick="window.setKanbanType(this)">📚 Estudo</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="hobbie" onclick="window.setKanbanType(this)">🎮 Hobbie</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="crescimento" onclick="window.setKanbanType(this)">🌱 Crescimento</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="trabalho" onclick="window.setKanbanType(this)">💼 Trabalho</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="saude" onclick="window.setKanbanType(this)">🏋️ Saúde</button>
                            <button class="kanban-type-btn flex-shrink-0 px-4 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all hover:bg-white/5 active:scale-95" data-val="outro" onclick="window.setKanbanType(this)">📌 Outro</button>
                        </div>
                    </div>

                    <!-- Progresso (coluna do kanban) -->
                    <div class="space-y-2">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block px-2">Progresso</span>
                        <div class="flex gap-2 pb-1 -mx-2 px-2">
                            <button class="kanban-progress-btn flex-1 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all active:scale-95" data-val="ideas" onclick="window.setKanbanProgress(this)">A Iniciar</button>
                            <button class="kanban-progress-btn flex-1 py-3 rounded-2xl border border-blue-400 bg-blue-400/20 text-blue-400 text-sm font-bold transition-all active:scale-95" data-val="doing" onclick="window.setKanbanProgress(this)">Em Progresso</button>
                            <button class="kanban-progress-btn flex-1 py-3 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-sm font-bold transition-all active:scale-95" data-val="done" onclick="window.setKanbanProgress(this)">Feito</button>
                        </div>
                    </div>

                    <!-- Datas -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-surface-highest rounded-[24px] p-4 border border-white/5 space-y-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Início</span>
                            <input type="date" id="kanban-start" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0" style="color-scheme: dark;">
                        </div>
                        <div class="bg-surface-highest rounded-[24px] p-4 border border-white/5 space-y-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Término</span>
                            <input type="date" id="kanban-end" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0" style="color-scheme: dark;">
                        </div>
                    </div>

                    <!-- Objetivo -->
                    <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-1">Objetivo</span>
                        <input type="text" id="kanban-objective" placeholder="O que você quer alcançar?" class="w-full bg-transparent border-none text-[var(--text-primary)] font-bold text-base p-0 focus:ring-0">
                    </div>

                    <!-- Descrição -->
                    <div class="bg-surface-highest rounded-[24px] px-5 py-4 border border-white/5 focus-within:border-primary/50 transition-colors">
                        <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block mb-2">Descrição</span>
                        <textarea id="kanban-description" placeholder="Detalhe o card: etapas, links, anotações..." class="w-full bg-transparent border-none text-[var(--text-primary)] text-sm p-0 focus:ring-0 resize-none min-h-[120px] leading-relaxed"></textarea>
                    </div>

                </div>

                <!-- Footer -->
                <div class="absolute bottom-0 left-0 w-full px-6 pt-10 pb-6 bg-gradient-to-t from-surface-container via-surface-container to-transparent flex gap-4" style="padding-bottom: env(safe-area-inset-bottom, 24px);">
                    <button class="w-16 h-16 rounded-[24px] bg-red-500/10 text-red-500 font-extrabold flex items-center justify-center border border-red-500/20 active:scale-95 transition-transform hidden" id="btn-kanban-delete" onclick="window.deleteKanbanCard()">
                        <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                    <button class="flex-1 h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-xl active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2" onclick="window.saveKanbanForm()">
                        <span class="material-symbols-outlined">save</span> Salvar Card
                    </button>
                </div>
            </div>
        </div>

        <!-- Daily Detail Modal -->
        <div id="day-detail-modal" class="fixed inset-0 z-[500] hidden flex-col justify-end">
            <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="day-detail-overlay" onclick="window.closeDailyDetail()"></div>
            <div class="relative w-full h-[95vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="day-detail-sheet">
                <!-- Header — igual ao check-in -->
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                            <h2 class="text-3xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none" id="lbl-day-title">15 ABR</h2>
                            <span id="lbl-day-pct" class="text-[12px] font-bold tracking-widest uppercase text-primary accent-text mt-1">100% Concluído</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeDailyDetail()">
                            <span class="material-symbols-outlined font-bold">close</span>
                        </button>
                    </div>
                </div>
                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 pb-12 space-y-10 hide-scrollbar" id="day-detail-content">
                    <!-- Dinamicamente preenchido -->
                </div>
            </div>
        </div>

        <!-- Full History Modal -->
        <div id="full-history-modal" class="fixed inset-0 z-[400] hidden flex-col">
            <div class="relative w-full h-full bg-surface-container-low flex flex-col pt-10 transform scale-95 opacity-0 transition-all duration-300" id="full-history-sheet">
                <div class="px-8 py-4 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant" onclick="window.closeFullHistory()">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h3 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline">Histórico Completo</h3>
                    </div>
                </div>
                <!-- Filter bar -->
                <div class="px-8 py-4 flex gap-3 overflow-x-auto hide-scrollbar">
                    ${(k||[]).map(i=>`<button
                            class="history-month-btn px-5 py-2 rounded-2xl border font-bold text-xs transition-colors ${i.key===y?"bg-primary/20 text-primary border-primary/30":"bg-white/5 text-on-surface-variant border-transparent hover:bg-white/10"}"
                            data-month-key="${i.key}"
                            onclick="window.filterFullHistoryMonth('${i.key}')">
                            ${i.label} <span class="opacity-70">(${i.count})</span>
                        </button>`).join("")}
                </div>
                <!-- List -->
                <div class="flex-1 overflow-y-auto px-6 py-2 hide-scrollbar">
                    <div class="overflow-x-auto rounded-2xl border border-white/5" style="scrollbar-width:none;">
                        <div class="min-w-[760px] bg-surface-container-low/70 backdrop-blur">
                            <div class="grid items-center gap-3 px-3 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70" style="grid-template-columns: 140px 130px 110px 95px 120px 80px;">
                                <span>Data</span>
                                <span>Progresso</span>
                                <span>Humor</span>
                                <span>Acordou</span>
                                <span>Sono</span>
                                <span>Água</span>
                            </div>
                            <div id="full-history-list">
                                ${(f||[]).map(i=>T(i)).join("")}
                            </div>
                        </div>
                    </div>
                    <div id="full-history-empty" class="hidden text-center py-10 text-on-surface-variant/40 text-sm font-bold">
                        Nenhum dia encontrado para este mês.
                    </div>
                </div>
            </div>
        </div>

        <!-- Habit Filter Calendar Modal -->
        <div id="habit-filter-modal" class="fixed inset-0 z-[450] hidden flex-col justify-end">
            <div id="habit-filter-overlay" class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-400" onclick="window.closeHabitFilterModal()"></div>
            <div id="habit-filter-sheet" class="relative w-full h-[92vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.55)] transform translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <div class="px-8 py-5 border-b border-white/5 flex flex-col gap-4">
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-1"></div>
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h3 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline tracking-tight leading-none">Filtro de Hábitos</h3>
                            <span id="habit-filter-month-label" class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mt-1 block">${c}</span>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-[var(--text-primary)] transition-colors active:scale-95" onclick="window.closeHabitFilterModal()">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto px-6 py-6 pb-12 space-y-5 hide-scrollbar">
                    <div class="space-y-3">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/70 px-2 block">Escolha o hábito</span>
                        <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                            ${o.map(i=>`<button data-habit="${i.id}" onclick="window.setHabitCalendarFilter('${i.id}')" class="habit-filter-chip flex-shrink-0 px-4 py-2.5 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-xs font-bold transition-all hover:bg-white/5">${i.name}</button>`).join("")}
                        </div>
                    </div>

                    <div class="bg-surface-highest/40 rounded-3xl p-4 border border-white/5">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50 block">Hábito selecionado</span>
                        <div class="flex items-center justify-between gap-4 mt-2">
                            <span id="habit-filter-selected-title" class="text-lg font-extrabold text-[var(--text-primary)]">Academia</span>
                            <span id="habit-filter-summary" class="text-[11px] font-bold text-primary accent-text text-right">0 de 0 dias</span>
                        </div>
                    </div>

                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5">
                        <div class="grid grid-cols-7 text-[10px] font-bold text-on-surface-variant/30 text-center uppercase tracking-widest mb-2">
                            <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                        </div>
                        <div id="habit-filter-grid" class="grid grid-cols-7 gap-[5px]"></div>
                    </div>
                    <p class="text-[11px] text-on-surface-variant/60 text-center">
                        Dica: toque em um dia destacado para abrir o Diário de Bordo desse dia.
                    </p>
                </div>
            </div>
        </div>
    `}let X=new Date().getFullYear(),J=new Date().getMonth();window.prevCalMonth=()=>{J--,J<0&&(J=11,X--),U()};window.nextCalMonth=()=>{const e=new Date;(X<e.getFullYear()||X===e.getFullYear()&&J<e.getMonth())&&(J++,J>11&&(J=0,X++),U())};const Be=[{id:"wakeup_early",name:"Acordar cedo"},{id:"gym",name:"Academia"},{id:"breakfast",name:"Café da manhã"},{id:"lunch",name:"Almoço"},{id:"study_dio",name:"Estudos DIO"},{id:"reading",name:"Leitura"},{id:"dinner",name:"Janta"},{id:"fill_notion",name:"Preencher Notion"}],Y=()=>window.APP_HABITS||Be,ie=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],ce=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];function ae(e){if(!e)return 0;if(e.rest_day)return 100;const t=Y();let a=0;const n=e.habits||{};for(const s of t)n[s.id]&&a++;return Math.round(a/t.length*100)}async function U(){const e=document.getElementById("planner-root");try{let t=await d.getKanbanData();window._kanbanAllCards=[...(t.ideas||[]).map(u=>({...u,progress:"ideas"})),...(t.doing||[]).map(u=>({...u,progress:"doing"})),...(t.done||[]).map(u=>({...u,progress:"done"}))];const a=new Date,n=X,s=J,r=`${n}-${String(s+1).padStart(2,"0")}`,o=new Date(n,s+1,0).getDate(),c=n===a.getFullYear()&&s===a.getMonth(),f=c?a.getDate():o,k=new Date(n,s,1).getDay(),y=await d.getMonthlyLogs(r),g=await d.getAllDailyLogs(),p=[];for(let u=1;u<=o;u++){const v=`${r}-${String(u).padStart(2,"0")}`,b=y[v],N=ae(b),V=!!b,q=!!(b&&b.rest_day);let z=0;q?z=4:N>0&&N<=33?z=1:N>33&&N<=66?z=2:N>66&&(z=3),p.push({day:u,level:z,pct:N,isFuture:u>f,isRestDay:q,rawDate:v,hasLog:V})}const w=[];for(let u=1;u<=o;u++){const v=`${r}-${String(u).padStart(2,"0")}`,b=y[v];w.push({day:u,rawDate:v,hasLog:!!b,habits:b&&b.habits?b.habits:{}})}const F=Object.entries(g||{}).sort((u,v)=>v[0].localeCompare(u[0])).map(([u,v])=>{const[b,N,V]=u.split("-").map(Number),q=ae(v),z=Y().map(re=>({id:re.id,name:re.name,done:!!(v.habits&&v.habits[re.id])}));return{date:`${String(V).padStart(2,"0")} ${ce[(N||1)-1]}`,rawDate:u,monthKey:`${b}-${String(N).padStart(2,"0")}`,pct:q,mood:v.mood||null,sleep:v.sleep||null,water:v.water||0,wake_time:v.wake_time||"",telas:v.screen_time||0,income_dia:v.income_dia||0,expense_dia:v.expense_dia||0,income_din:v.income_din||0,expense_din:v.expense_din||0,restDay:!!v.rest_day,habits:z}}),x=[],B={};for(const u of F)B[u.monthKey]=(B[u.monthKey]||0)+1;Object.keys(B).sort((u,v)=>v.localeCompare(u)).forEach(u=>{const[v,b]=u.split("-").map(Number);x.push({key:u,label:`${ie[(b||1)-1]} ${v}`,count:B[u]})});const I=r;window._plannerFullHistoryCurrentMonthKey=I;const T=[],A=a.getMonth(),P=`${a.getFullYear()}-${String(A+1).padStart(2,"0")}`,O=c?y:await d.getMonthlyLogs(P),K=c?o:a.getDate();for(let u=a.getDate();u>=1;u--){const v=`${P}-${String(u).padStart(2,"0")}`,b=O[v],N=b?ae(b):0,V=Y().map(q=>{var z;return{id:q.id,name:q.name,done:!!((z=b==null?void 0:b.habits)!=null&&z[q.id])}});T.push({date:`${String(u).padStart(2,"0")} ${ce[A]}`,rawDate:v,pct:N,mood:(b==null?void 0:b.mood)||null,sleep:(b==null?void 0:b.sleep)||null,water:(b==null?void 0:b.water)||0,wake_time:(b==null?void 0:b.wake_time)||"",telas:(b==null?void 0:b.screen_time)||0,income_dia:(b==null?void 0:b.income_dia)||0,expense_dia:(b==null?void 0:b.expense_dia)||0,income_din:(b==null?void 0:b.income_din)||0,expense_din:(b==null?void 0:b.expense_din)||0,restDay:!!(b!=null&&b.rest_day),habits:V})}window._plannerHistory=F,window._plannerHabitFilter={days:w,monthLabel:`${ie[s]} ${n}`,firstDayOffset:k,todayDate:f},window._plannerHabitFilterCurrentHabit||(window._plannerHabitFilterCurrentHabit="gym");const l=Object.values(y),L=l.filter(u=>ae(u)===100&&!u.rest_day).length,i={perfeito:5,muito_bom:4,bom:3,mais_ou_menos:2,ruim:1},m={5:"perfeito",4:"muito_bom",3:"bom",2:"mais_ou_menos",1:"ruim"},j={feliz:5,produtivo:4,normal:3,cansado:2,triste:1},$={5:"feliz",4:"produtivo",3:"normal",2:"cansado",1:"triste"};let E=0,S=0,h=0,_=0;for(const u of l)u.sleep&&i[u.sleep]&&(E+=i[u.sleep],S++),u.mood&&j[u.mood]&&(h+=j[u.mood],_++);const C=S>0?m[Math.round(E/S)]||"bom":"—",D=_>0?$[Math.round(h/_)]||"normal":"—",M=l.reduce((u,v)=>(u.totalGastoDia+=Number(v.expense_dia||0),u.totalGastoDinheiro+=Number(v.expense_din||0),u),{totalGastoDia:0,totalGastoDinheiro:0}),R={perfectDays:L,avgSleep:C,avgMood:D,totalGastoDia:M.totalGastoDia,totalGastoDinheiro:M.totalGastoDinheiro};e.innerHTML=Ee({calendarData:p,calendarYear:n,calendarMonth:s,isCurrentMonth:c,historyDays:T,metrics:R,kanbanData:t,habitCatalog:Y(),habitFilterMonthLabel:`${ie[s]} ${n}`,fullHistoryRows:F,fullHistoryMonths:x,fullHistoryCurrentMonthKey:I}),Fe()}catch(t){console.error("Planner error:",t),e.innerHTML=`<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Planner:</h3><pre>${t.message}
${t.stack}</pre></div>`}}function me(){var g;const e=window._plannerHabitFilter;if(!e)return;const t=Y(),a=window._plannerHabitFilterCurrentHabit||((g=t[0])==null?void 0:g.id)||"gym",n=t.find(p=>p.id===a)||t[0],s=document.getElementById("habit-filter-grid"),r=document.getElementById("habit-filter-summary"),o=document.getElementById("habit-filter-selected-title");if(!s||!r||!o)return;document.querySelectorAll(".habit-filter-chip").forEach(p=>{const w=p.dataset.habit===n.id;p.classList.toggle("border-primary",w),p.classList.toggle("bg-primary/20",w),p.classList.toggle("text-primary",w),p.classList.toggle("border-white/10",!w),p.classList.toggle("bg-surface-highest",!w),p.classList.toggle("text-on-surface-variant",!w)});const c=e.days.filter(p=>{var w;return p.hasLog&&!!((w=p.habits)!=null&&w[n.id])}).length,f=e.days.filter(p=>p.hasLog).length;o.textContent=n.name,r.textContent=`${c} de ${f} dias com registro concluíram este hábito.`;const k=Array.from({length:e.firstDayOffset},()=>'<div class="aspect-square w-full"></div>').join(""),y=e.days.map(p=>{var H;const w=p.hasLog&&!!((H=p.habits)!=null&&H[n.id]),F=p.day===e.todayDate,x=p.hasLog?`onclick="window.openDailyDetail('${p.rawDate}')"`:"",B=w?"bg-primary/90 border border-primary/60 text-white shadow-[0_0_10px_var(--accent-color)]":p.hasLog?"bg-surface-highest border border-white/10 text-on-surface-variant":"bg-white/[0.04] border border-transparent text-white/20",I=F?"ring-2 ring-primary/70":"",T=p.hasLog?"cursor-pointer hover:scale-105 hover:brightness-110":"cursor-default",A=w?`<span class="absolute top-1 right-1 material-symbols-outlined text-[10px] text-black/70" style="font-variation-settings: 'FILL' 1;">check_circle</span>`:"";return`<div ${x} class="aspect-square w-full rounded-xl relative flex items-center justify-center text-[10px] font-extrabold transition-all ${B} ${I} ${T}">${p.day}${A}</div>`}).join("");s.innerHTML=k+y}window.openHabitFilterModal=()=>{var s;const e=document.getElementById("habit-filter-modal"),t=document.getElementById("habit-filter-overlay"),a=document.getElementById("habit-filter-sheet");if(!e||!t||!a)return;const n=document.getElementById("habit-filter-month-label");n&&((s=window._plannerHabitFilter)!=null&&s.monthLabel)&&(n.textContent=window._plannerHabitFilter.monthLabel),e.classList.remove("hidden"),e.classList.add("flex"),requestAnimationFrame(()=>{t.classList.remove("opacity-0"),a.classList.remove("translate-y-full")}),me()};window.setHabitCalendarFilter=e=>{window._plannerHabitFilterCurrentHabit=e,me()};window.closeHabitFilterModal=()=>{const e=document.getElementById("habit-filter-modal"),t=document.getElementById("habit-filter-overlay"),a=document.getElementById("habit-filter-sheet");!e||!t||!a||(t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},400))};window.openDailyDetail=(e,t=!1)=>{let a=window._plannerHistory.find(x=>x.date===e||x.rawDate===e);if(!a){const x=e.split("-").map(Number);if(x.length!==3)return;const[B,I,T]=x;a={date:`${String(T).padStart(2,"0")} ${ce[(I||1)-1]}`,rawDate:e,pct:0,mood:null,sleep:null,water:0,wake_time:"",telas:0,income_dia:0,expense_dia:0,income_din:0,expense_din:0,restDay:!1,habits:Y().map(A=>({id:A.id,name:A.name,done:!1}))},t=!0}const n=a.date||e,s=a.rawDate||e,r=document.getElementById("day-detail-modal"),o=document.getElementById("day-detail-overlay"),c=document.getElementById("day-detail-sheet"),f=document.getElementById("day-detail-content");document.getElementById("lbl-day-title").innerText=n,document.getElementById("lbl-day-pct").innerText=a.restDay?"Dia de Descanso":`${a.pct}% Concluído`;const k={nervoso:"Nervoso",feliz:"Feliz",produtivo:"Produtivo",normal:"Normal",ansioso:"Ansioso",cansado:"Cansado",triste:"Triste"},y={nervoso:"border-red-500 bg-red-500/20 text-red-500",feliz:"border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]",produtivo:"border-cyan-400 bg-cyan-400/20 text-cyan-400",normal:"border-white/50 bg-white/10 text-white",ansioso:"border-orange-400 bg-orange-400/20 text-orange-400",cansado:"border-purple-400 bg-purple-400/20 text-purple-400",triste:"border-blue-400 bg-blue-400/20 text-blue-400"},g={perfeito:"Perfeito",muito_bom:"Muito bom",bom:"Bom",mais_ou_menos:"Mais ou menos",ruim:"Ruim"},p={perfeito:"border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]",muito_bom:"border-blue-400 bg-blue-400/20 text-blue-400",bom:"border-cyan-400 bg-cyan-400/20 text-cyan-400",mais_ou_menos:"border-orange-400 bg-orange-400/20 text-orange-400",ruim:"border-red-500 bg-red-500/20 text-red-500"},w=Math.round(a.water),F=[1,2,3,4,5].map(x=>t?`<button onclick="window.setWaterForDate('${s}', ${x})" class="text-4xl transition-all duration-300 ${x<=w?"drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none":"grayscale opacity-30"} hover:scale-110 active:scale-90">💧</button>`:`<span class="text-4xl transition-all duration-300 ${x<=w?"drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]":"grayscale opacity-30"}">💧</span>`).join("");f.innerHTML=`
        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${t?"text-primary accent-text":"text-on-surface-variant/70"} pl-2">Dia</h3>
            <div class="bg-surface-container-highest rounded-3xl p-4 border border-white/5 flex items-center justify-between gap-3">
                <div>
                    <p class="font-bold text-[var(--text-primary)]">Dia de Descanso</p>
                    <p class="text-xs text-on-surface-variant">Não exige marcação das 8 rotinas.</p>
                </div>
                ${t?`<button onclick="window.setRestDayForDate('${s}', ${!a.restDay})" class="px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${a.restDay?"bg-amber-400/20 border-amber-300/40 text-amber-200":"bg-surface-highest border-white/10 text-on-surface-variant"}">${a.restDay?"Ativo":"Inativo"}</button>`:`<span class="px-3 py-2 rounded-xl border font-extrabold text-[10px] uppercase tracking-widest ${a.restDay?"bg-amber-400/20 border-amber-300/40 text-amber-200":"bg-surface-highest border-white/10 text-on-surface-variant"}">${a.restDay?"Descanso":"Normal"}</span>`}
            </div>
        </section>

        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${t?"text-primary accent-text":"text-on-surface-variant/70"} pl-2 flex items-center gap-2">
                Como você se sentiu? ${t?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
            </h3>
            <div class="bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-6">

                <!-- Humor -->
                <div class="space-y-3">
                    <span class="text-sm font-bold text-[var(--text-primary)] block">Humor Geral</span>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                        ${Object.keys(k).map(x=>{const B=x===a.mood;return t?`<button onclick="window.setQualitativeForDate('${s}', 'mood', '${x}')" class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${B?y[x]+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-30 hover:opacity-100"}">${k[x]}</button>`:`<span class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${B?y[x]:"border-transparent bg-surface-highest text-on-surface-variant opacity-30"}">${k[x]}</span>`}).join("")}
                    </div>
                </div>

                <div class="h-px w-full bg-white/5"></div>

                <!-- Sono -->
                <div class="space-y-3">
                    <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                        ${Object.keys(g).map(x=>{const B=x===a.sleep;return t?`<button onclick="window.setQualitativeForDate('${s}', 'sleep', '${x}')" class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${B?p[x]+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-30 hover:opacity-100"}">${g[x]}</button>`:`<span class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${B?p[x]:"border-transparent bg-surface-highest text-on-surface-variant opacity-30"}">${g[x]}</span>`}).join("")}
                    </div>
                </div>
            </div>
        </section>

        <!-- Corpo e Tempo -->
        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${t?"text-primary accent-text":"text-on-surface-variant/70"} pl-2 flex items-center gap-2">
                Seu corpo e tempo ${t?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
            </h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 ${t?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                    <span class="text-xs font-bold text-on-surface-variant px-1">Hora que acordou</span>
                    ${t?`<input id="input-planner-wake-time" type="time" value="${a.wake_time||""}" placeholder="00:00" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">`:`<span class="text-2xl font-extrabold text-[var(--text-primary)] pl-1 font-headline">${a.wake_time||"--:--"}</span>`}
                </div>

                <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 flex flex-col items-center gap-4">
                    <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                    <div class="flex items-center gap-3">
                        ${F}
                    </div>
                    <span class="text-[10px] font-bold text-cyan-400 tracking-widest">${a.water}L no total</span>
                </div>
                
                <!-- Fluxo Financeiro Diário -->
                <div class="col-span-2 space-y-4 pt-2">
                    <h3 class="text-[11px] font-bold tracking-widest uppercase ${t?"text-primary accent-text":"text-on-surface-variant/70"} flex items-center gap-2">
                        Fluxo do Caixa ${t?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
                    </h3>
                    
                    <!-- Carteira Dia a Dia -->
                    <div class="space-y-3">
                        <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Dia a Dia"</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${t?"focus-within:ring-2 focus-within:ring-red-400":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Gasto do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-red-400 font-bold mr-1">R$</span>
                                    ${t?`<input id="input-planner-dia-expense" value="${a.expense_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.expense_dia||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${t?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Ganho do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-primary accent-text font-bold mr-1">R$</span>
                                    ${t?`<input id="input-planner-dia-income" value="${a.income_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.income_dia||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Carteira Meu Dinheiro -->
                    <div class="space-y-3 pt-2">
                        <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Meu Dinheiro"</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${t?"focus-within:ring-2 focus-within:ring-red-400":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Gasto do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-red-400 font-bold mr-1">R$</span>
                                    ${t?`<input id="input-planner-din-expense" value="${a.expense_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.expense_din||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${t?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Ganho do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-primary accent-text font-bold mr-1">R$</span>
                                    ${t?`<input id="input-planner-din-income" value="${a.income_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.income_din||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- As 8 Rotinas -->
        <section class="space-y-4">
            <div class="flex justify-between items-center pl-2 pr-1">
                <h3 class="text-[11px] font-bold tracking-widest uppercase ${t?"text-primary accent-text":"text-on-surface-variant/70"} flex items-center gap-2">
                    As ${Y().length} Rotinas ${t?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
                </h3>
                <span class="text-[10px] font-bold ${a.restDay?"text-amber-300":"text-primary accent-text"}">${a.restDay?"Descanso":`${a.habits.filter(x=>x.done).length}/${a.habits.length}`}</span>
            </div>
            <div class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5">
                ${a.restDay?`
                    <div class="p-4 rounded-2xl bg-amber-400/10 border border-amber-300/20 text-amber-200 text-sm font-bold text-center">
                        Dia de descanso ativo. Rotinas não são obrigatórias hoje.
                    </div>
                `:""}
                ${a.habits.map(x=>t?`
                        <div class="flex items-center justify-between p-3 rounded-2xl ${x.done?"bg-surface-highest/50":""} transition-colors cursor-pointer group active:scale-[0.98] ${a.restDay?"opacity-40 pointer-events-none":""}" onclick="window.toggleHabitForDate('${s}', '${x.id}', ${!x.done})">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
                                    <span class="material-symbols-outlined text-lg ${x.done?"text-primary accent-text":"text-on-surface-variant group-hover:text-white"}" style="font-variation-settings: 'FILL' ${x.done?1:0};">task_alt</span>
                                </div>
                                <span class="text-base font-bold transition-all ${x.done?"line-through opacity-50 text-on-surface-variant":"text-[var(--text-primary)]"}">${x.name}</span>
                            </div>
                            <div class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${x.done?"bg-primary accent-bg border-primary accent-border":"border-on-surface-variant/30 group-hover:border-white/40"}">
                                ${x.done?'<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>':""}
                            </div>
                        </div>`:`
                        <div class="flex items-center justify-between p-3 rounded-2xl ${x.done?"bg-surface-highest/50":"opacity-60"} transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
                                    <span class="material-symbols-outlined text-lg ${x.done?"text-primary accent-text":"text-on-surface-variant"}" style="font-variation-settings: 'FILL' ${x.done?1:0};">task_alt</span>
                                </div>
                                <span class="text-base font-bold transition-all ${x.done?"line-through text-on-surface-variant":"text-on-surface-variant"}">${x.name}</span>
                            </div>
                            ${x.done?'<div class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center"><span class="material-symbols-outlined text-primary accent-text font-bold" style="font-size:16px;">check</span></div>':""}
                        </div>`).join("")}
            </div>
        </section>

        <!-- Footer Buttons -->
        ${t?`
        <button onclick="window.saveAndCloseDailyDetail('${s}');" class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-xl active:scale-95 transition-transform mt-6">
            Salvar e Concluir
        </button>
        `:`
        <button onclick="window.openDailyDetail('${s}', true);" class="w-full h-16 rounded-[24px] bg-surface-highest border border-white/10 text-[var(--text-primary)] font-bold text-lg active:scale-95 transition-transform mt-6 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">edit</span> Editar Dia
        </button>
        `}
    `,r.classList.contains("hidden")&&(r.classList.remove("hidden"),r.classList.add("flex"),requestAnimationFrame(()=>{o.classList.remove("opacity-0"),c.classList.remove("translate-y-full")}))};window.toggleHabitForDate=async(e,t,a)=>{var s;const n=window._plannerHistory.find(r=>r.rawDate===e);if(n!=null&&n.restDay){(s=window.showToast)==null||s.call(window,"Dia de descanso ativo. Desative para editar hábitos.","info");return}if(await d.updateHabit(t,a,e),n){const r=n.habits.find(c=>c.id===t);r&&(r.done=a);let o=n.habits.filter(c=>c.done).length;n.pct=Math.round(o/n.habits.length*100)}window.openDailyDetail(e,!0)};window.setQualitativeForDate=async(e,t,a)=>{await d.updateDailyMetrics(t,a,e);const n=window._plannerHistory.find(s=>s.rawDate===e);n&&(n[t]=a),window.openDailyDetail(e,!0)};window.setWaterForDate=async(e,t)=>{await d.updateDailyMetrics("water",t,e);const a=window._plannerHistory.find(n=>n.rawDate===e);a&&(a.water=t),window.openDailyDetail(e,!0)};window.setRestDayForDate=async(e,t)=>{await d.updateDailyMetrics("rest_day",t,e);const a=window._plannerHistory.find(n=>n.rawDate===e);a&&(a.restDay=t,a.pct=t?100:Math.round(a.habits.filter(n=>n.done).length/a.habits.length*100)),window.openDailyDetail(e,!0)};window.saveAndCloseDailyDetail=async e=>{const t=[],a=document.getElementById("input-planner-wake-time");a&&t.push(d.updateDailyMetrics("wake_time",a.value||"",e));const n=document.getElementById("input-planner-dia-income"),s=document.getElementById("input-planner-dia-expense"),r=document.getElementById("input-planner-din-income"),o=document.getElementById("input-planner-din-expense");if(n||s||r||o){const c={income_dia:n&&parseFloat(n.value)||0,expense_dia:s&&parseFloat(s.value)||0,income_din:r&&parseFloat(r.value)||0,expense_din:o&&parseFloat(o.value)||0};t.push(d.updateDailyFinances(e,c))}await Promise.all(t),window.closeDailyDetail(),setTimeout(()=>{U()},550)};window.closeDailyDetail=()=>{const e=document.getElementById("day-detail-modal"),t=document.getElementById("day-detail-overlay"),a=document.getElementById("day-detail-sheet");t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},500)};window.filterFullHistoryMonth=e=>{document.querySelectorAll(".history-month-btn").forEach(n=>{const s=n.dataset.monthKey===e;n.classList.toggle("bg-primary/20",s),n.classList.toggle("text-primary",s),n.classList.toggle("border-primary/30",s),n.classList.toggle("bg-white/5",!s),n.classList.toggle("text-on-surface-variant",!s)});let t=0;document.querySelectorAll(".history-day-row").forEach(n=>{const s=n.dataset.monthKey===e;n.classList.toggle("hidden",!s),s&&t++});const a=document.getElementById("full-history-empty");a&&a.classList.toggle("hidden",t>0)};window.openFullHistory=()=>{var n;const e=document.getElementById("full-history-modal"),t=document.getElementById("full-history-sheet");e.classList.remove("hidden"),e.classList.add("flex"),requestAnimationFrame(()=>{t.classList.remove("scale-95","opacity-0")});const a=window._plannerFullHistoryCurrentMonthKey||((n=document.querySelector(".history-month-btn"))==null?void 0:n.getAttribute("data-month-key"));a&&window.filterFullHistoryMonth(a)};window.closeFullHistory=()=>{const e=document.getElementById("full-history-modal");document.getElementById("full-history-sheet").classList.add("scale-95","opacity-0"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},300)};const Se={estudo:"📚 Estudo",hobbie:"🎮 Hobbie",crescimento:"🌱 Crescimento",trabalho:"💼 Trabalho",saude:"🏋️ Saúde",outro:"📌 Outro"},je={ideas:"A Iniciar",doing:"Em Progresso",done:"Feito ✅"},Te={ideas:"text-on-surface-variant/60",doing:"text-blue-400",done:"text-green-400"};let te=null,Z=null;window.openKanbanView=e=>{var f,k;const t=document.querySelector(`.kanban-card[data-card-id="${e}"]`),a=(window._kanbanAllCards||[]).find(y=>y.id===e)||{id:e,emoji:((f=t==null?void 0:t.querySelector("span.text-2xl"))==null?void 0:f.innerText)||"🎯",title:((k=t==null?void 0:t.querySelector("p"))==null?void 0:k.innerText)||"",type:"",objective:"",description:"",start:"",end:""};Z=a,document.getElementById("lbl-kv-emoji").innerText=a.emoji||"🎯",document.getElementById("lbl-kv-title").innerText=a.title||"",document.getElementById("lbl-kv-type").innerText=Se[a.type]||"";const n=[];a.objective&&n.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-1">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Objetivo</span>
            <p class="font-bold text-[var(--text-primary)] text-base leading-snug">${a.objective}</p>
        </div>`),(a.start||a.end)&&n.push(`
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Início</span>
                <p class="font-bold text-[var(--text-primary)]">${a.start||"—"}</p>
            </div>
            <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Término</span>
                <p class="font-bold text-[var(--text-primary)]">${a.end||"—"}</p>
            </div>
        </div>`);const s=Te[a.progress]||"text-on-surface-variant/60";n.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Progresso</span>
            <span class="font-bold text-sm ${s}">${je[a.progress]||"A Iniciar"}</span>
        </div>`),a.description&&n.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Descrição</span>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed">${a.description}</p>
        </div>`),document.getElementById("kanban-view-content").innerHTML=n.join("")||'<p class="text-center text-on-surface-variant/30 text-sm py-8">Sem detalhes adicionados.</p>';const r=document.getElementById("kanban-view-modal"),o=document.getElementById("kanban-view-overlay"),c=document.getElementById("kanban-view-sheet");r.classList.remove("hidden"),r.classList.add("flex"),requestAnimationFrame(()=>{o.classList.remove("opacity-0"),c.classList.remove("translate-y-full")})};window.closeKanbanView=()=>{const e=document.getElementById("kanban-view-modal"),t=document.getElementById("kanban-view-overlay"),a=document.getElementById("kanban-view-sheet");t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},500)};window.openKanbanEditFromView=()=>{window.closeKanbanView(),setTimeout(()=>{window.openKanbanForm(Z==null?void 0:Z.id,Z)},200)};window.openKanbanForm=(e,t)=>{const a=document.getElementById("kanban-form-modal"),n=document.getElementById("kanban-form-overlay"),s=document.getElementById("kanban-form-sheet");if(document.querySelectorAll(".kanban-type-btn").forEach(r=>{r.classList.remove("border-primary","bg-primary/20","text-primary"),r.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),document.querySelectorAll(".kanban-progress-btn").forEach(r=>{r.classList.remove("border-blue-400","bg-blue-400/20","text-blue-400"),r.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),e&&t){if(te=e,document.getElementById("lbl-kanban-form-title").innerText="Editar Card",document.getElementById("btn-kanban-delete").classList.remove("hidden"),document.getElementById("kanban-emoji").value=t.emoji||"",document.getElementById("kanban-title").value=t.title||"",document.getElementById("kanban-objective").value=t.objective||"",document.getElementById("kanban-description").value=t.description||"",document.getElementById("kanban-start").value=t.start||"",document.getElementById("kanban-end").value=t.end||"",t.type){const c=document.querySelector(`.kanban-type-btn[data-val="${t.type}"]`);c&&window.setKanbanType(c)}const r=t.progress||"ideas",o=document.querySelector(`.kanban-progress-btn[data-val="${r}"]`);o&&window.setKanbanProgress(o)}else{te=null,document.getElementById("lbl-kanban-form-title").innerText="Novo Card",document.getElementById("btn-kanban-delete").classList.add("hidden"),document.getElementById("kanban-emoji").value="",document.getElementById("kanban-title").value="",document.getElementById("kanban-objective").value="",document.getElementById("kanban-description").value="",document.getElementById("kanban-start").value="",document.getElementById("kanban-end").value="";const r=document.querySelector('.kanban-progress-btn[data-val="ideas"]');r&&window.setKanbanProgress(r)}a.classList.remove("hidden"),a.classList.add("flex"),requestAnimationFrame(()=>{n.classList.remove("opacity-0"),s.classList.remove("translate-y-full")})};window.closeKanbanForm=()=>{const e=document.getElementById("kanban-form-modal"),t=document.getElementById("kanban-form-overlay"),a=document.getElementById("kanban-form-sheet");t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},400)};window.setKanbanType=e=>{document.querySelectorAll(".kanban-type-btn").forEach(t=>{t.classList.remove("border-primary","bg-primary/20","text-primary"),t.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),e.classList.remove("border-white/10","bg-surface-highest","text-on-surface-variant"),e.classList.add("border-primary","bg-primary/20","text-primary")};window.setKanbanProgress=e=>{document.querySelectorAll(".kanban-progress-btn").forEach(t=>{t.classList.remove("border-blue-400","bg-blue-400/20","text-blue-400"),t.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),e.classList.remove("border-white/10","bg-surface-highest","text-on-surface-variant"),e.classList.add("border-blue-400","bg-blue-400/20","text-blue-400")};window.saveKanbanForm=async()=>{var s,r;const e=document.getElementById("kanban-title").value.trim();if(!e){document.getElementById("kanban-title").focus();return}const t={id:te||Date.now().toString(),emoji:document.getElementById("kanban-emoji").value,title:e,type:((s=document.querySelector(".kanban-type-btn.text-primary"))==null?void 0:s.dataset.val)||"",start:document.getElementById("kanban-start").value,end:document.getElementById("kanban-end").value,objective:document.getElementById("kanban-objective").value,description:document.getElementById("kanban-description").value},a=((r=document.querySelector(".kanban-progress-btn.text-blue-400"))==null?void 0:r.dataset.val)||"ideas";let n=await d.getKanbanData();n.ideas||(n.ideas=[]),n.doing||(n.doing=[]),n.done||(n.done=[]),["ideas","doing","done"].forEach(o=>{n[o]=n[o].filter(c=>c.id!==t.id)}),n[a].unshift(t),await d.saveKanbanData(n),window.closeKanbanForm(),setTimeout(()=>U(),400)};window.deleteKanbanCard=async()=>{if(te&&confirm("Tem certeza que deseja excluir este card?")){let e=await d.getKanbanData();["ideas","doing","done"].forEach(t=>{e[t]=(e[t]||[]).filter(a=>a.id!==te)}),await d.saveKanbanData(e),window.closeKanbanForm(),setTimeout(()=>U(),400)}};function Fe(){let e=null;const t=document.querySelectorAll(".kanban-card"),a=document.querySelectorAll(".kanban-column");t.forEach(n=>{n.addEventListener("dragstart",function(s){e=this,setTimeout(()=>this.classList.add("opacity-30","scale-95"),0)}),n.addEventListener("dragend",function(){setTimeout(()=>{this.classList.remove("opacity-30","scale-95"),e=null},0)})}),a.forEach(n=>{n.addEventListener("dragover",function(s){s.preventDefault()}),n.addEventListener("dragenter",function(s){s.preventDefault(),this.classList.add("border-primary/50","bg-white/5")}),n.addEventListener("dragleave",function(){this.classList.remove("border-primary/50","bg-white/5")}),n.addEventListener("drop",async function(){if(this.classList.remove("border-primary/50","bg-white/5"),e){const s=this.querySelector(".kanban-empty-state");s&&s.remove(),this.prepend(e);const r=e.dataset.cardId,o=this.dataset.column;if(r&&o){let c=await d.getKanbanData(),f=null;["ideas","doing","done"].forEach(k=>{const y=(c[k]||[]).findIndex(g=>g.id===r);y>=0&&(f=c[k].splice(y,1)[0])}),f&&(c[o]||(c[o]=[]),c[o].unshift(f),await d.saveKanbanData(c))}}})})}let de={},pe=0;function ee(e){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(e)}function se(e){return e>0?"text-green-400":e<0?"text-red-400":"text-on-surface-variant"}function Me(e){const t=Object.values(e||{}),a=t.reduce((s,r)=>s+Number(r.income_dia||0)-Number(r.expense_dia||0),0),n=t.reduce((s,r)=>s+Number(r.income_din||0)-Number(r.expense_din||0),0);return{diaBalance:a,dinheiroBalance:n}}function Ae(e){const[t,a,n]=e.split("-").map(Number),s=new Date(t,a-1,n),r=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],o=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];return`${r[s.getDay()]}, ${String(n).padStart(2,"0")} ${o[a-1]}`}function Ce(e,t,a){const n=se(e),s=se(t);return`
    <section class="px-4 pt-6 pb-10 space-y-4">
        <div class="px-1 mb-2">
            <h2 class="text-2xl font-extrabold">Finanças</h2>
            <p class="text-xs text-on-surface-variant mt-1">Visão geral das suas carteiras</p>
        </div>

        <!-- Card Dia a Dia -->
        <button onclick="window.openFinDetailModal('dia')"
            class="w-full text-left rounded-3xl bg-surface-container-low border border-white/[0.08] p-5 active:scale-[0.98] transition-transform cursor-pointer">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-blue-400" style="font-size:18px">wallet</span>
                    </div>
                    <span class="text-sm font-bold text-on-surface-variant">Dia a Dia</span>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant/40" style="font-size:20px">chevron_right</span>
            </div>
            <div class="px-1">
                <p class="text-2xl font-extrabold ${n}">${ee(e)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Saldo acumulado · toque para detalhes</p>
            </div>
        </button>

        <!-- Card Meu Dinheiro -->
        <button onclick="window.openFinDetailModal('din')"
            class="w-full text-left rounded-3xl bg-surface-container-low border border-white/[0.08] p-5 active:scale-[0.98] transition-transform cursor-pointer">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-violet-400" style="font-size:18px">savings</span>
                    </div>
                    <span class="text-sm font-bold text-on-surface-variant">Meu Dinheiro</span>
                </div>
                <span class="material-symbols-outlined text-on-surface-variant/40" style="font-size:20px">chevron_right</span>
            </div>
            <div class="px-1">
                <p class="text-2xl font-extrabold ${s}">${ee(t)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Saldo acumulado · toque para detalhes</p>
            </div>
        </button>

        <!-- Card Reserva de Emergência -->
        <div class="rounded-3xl bg-surface-container-low border border-white/[0.08] p-5">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-amber-400" style="font-size:18px">shield</span>
                    </div>
                    <span class="text-sm font-bold text-on-surface-variant">Reserva de Emergência</span>
                </div>
                <button onclick="window.openEmergencyEditModal()"
                    class="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size:18px">edit</span>
                </button>
            </div>
            <div class="px-1">
                <p class="text-2xl font-extrabold text-amber-400">${ee(a)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Valor definido manualmente</p>
            </div>
        </div>
    </section>
    `}function He(){const e=document.createElement("div");e.id="fin-modals-host",e.innerHTML=`
    <!-- Finance Detail Modal -->
    <div id="fin-detail-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
        <div id="fin-detail-modal-overlay"
            class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500"
            onclick="window.closeFinDetailModal()"></div>
        <div id="fin-detail-modal-sheet"
            class="relative w-full h-[88vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
            <div class="w-12 h-[5px] bg-white/10 rounded-full mx-auto mt-3 mb-1 flex-none"></div>
            <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-none">
                <div class="flex items-center gap-3">
                    <div id="fin-detail-icon" class="w-9 h-9 rounded-xl flex items-center justify-center flex-none"></div>
                    <h3 id="fin-detail-title" class="text-lg font-extrabold"></h3>
                </div>
                <button onclick="window.closeFinDetailModal()"
                    class="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size:20px">close</span>
                </button>
            </div>
            <div id="fin-detail-content" class="flex-1 overflow-y-auto px-6 py-4 pb-10 hide-scrollbar"></div>
        </div>
    </div>

    <!-- Emergency Fund Edit Modal -->
    <div id="emergency-edit-modal" class="fixed inset-0 z-[200] hidden flex-col justify-end">
        <div id="emergency-edit-modal-overlay"
            class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500"
            onclick="window.closeEmergencyEditModal()"></div>
        <div id="emergency-edit-modal-sheet"
            class="relative w-full bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
            <div class="w-12 h-[5px] bg-white/10 rounded-full mx-auto mt-3 mb-1 flex-none"></div>
            <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-none">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-none">
                        <span class="material-symbols-outlined text-amber-400" style="font-size:18px">shield</span>
                    </div>
                    <h3 class="text-lg font-extrabold">Reserva de Emergência</h3>
                </div>
                <button onclick="window.closeEmergencyEditModal()"
                    class="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-on-surface-variant" style="font-size:20px">close</span>
                </button>
            </div>
            <div class="px-6 py-6 space-y-5">
                <div class="space-y-2">
                    <label class="text-xs font-bold tracking-widest uppercase text-on-surface-variant/70">Valor da Reserva</label>
                    <div class="flex items-center gap-3 bg-surface-container-highest rounded-2xl px-4 py-3 border border-white/[0.06]">
                        <span class="text-on-surface-variant font-bold text-sm">R$</span>
                        <input id="input-emergency-fund" type="number" step="0.01" min="0" inputmode="decimal"
                            class="flex-1 bg-transparent border-none outline-none text-xl font-extrabold text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0"
                            placeholder="0,00">
                    </div>
                </div>
                <button onclick="window.saveEmergencyFund()"
                    class="w-full h-14 rounded-[20px] bg-amber-400 text-black font-extrabold text-base active:scale-95 transition-transform">
                    Salvar
                </button>
            </div>
            <div class="h-8 flex-none"></div>
        </div>
    </div>
    `,document.body.appendChild(e)}function ge(e){const t=document.getElementById(e);t.classList.remove("hidden"),t.classList.add("flex"),requestAnimationFrame(()=>{document.getElementById(`${e}-overlay`).classList.remove("opacity-0"),document.getElementById(`${e}-sheet`).classList.remove("translate-y-full")})}function ve(e){document.getElementById(`${e}-overlay`).classList.add("opacity-0"),document.getElementById(`${e}-sheet`).classList.add("translate-y-full"),setTimeout(()=>{const t=document.getElementById(e);t.classList.add("hidden"),t.classList.remove("flex")},500)}function Pe(e){const t=e==="dia",a=document.getElementById("fin-detail-title"),n=document.getElementById("fin-detail-icon"),s=document.getElementById("fin-detail-content");t?(a.textContent="Dia a Dia",n.className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-none",n.innerHTML='<span class="material-symbols-outlined text-blue-400" style="font-size:18px">wallet</span>'):(a.textContent="Meu Dinheiro",n.className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-none",n.innerHTML='<span class="material-symbols-outlined text-violet-400" style="font-size:18px">savings</span>');const r=t?"income_dia":"income_din",o=t?"expense_dia":"expense_din",c=Object.entries(de).filter(([,I])=>Number(I[r]||0)>0||Number(I[o]||0)>0).sort((I,T)=>T[0].localeCompare(I[0]));if(c.length===0){s.innerHTML=`
            <div class="flex flex-col items-center justify-center h-48 gap-3">
                <span class="material-symbols-outlined text-on-surface-variant/30" style="font-size:44px">receipt_long</span>
                <p class="text-sm text-on-surface-variant/60">Nenhuma movimentação registrada</p>
            </div>
        `;return}const f=c.reduce((I,[,T])=>I+Number(T[r]||0),0),k=c.reduce((I,[,T])=>I+Number(T[o]||0),0),y=f-k,g=se(y),p=t?"text-blue-400":"text-violet-400",w="1fr 80px 80px 84px",F=`
        <div class="grid items-center gap-2 px-3 py-2 border-b border-white/10 mb-1 sticky top-0 bg-surface-container-low z-10"
             style="grid-template-columns:${w}">
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Data</span>
            <span class="text-[10px] font-bold uppercase tracking-widest ${p} text-right">Ganho</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-red-400 text-right">Gasto</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 text-right">Saldo</span>
        </div>
    `,x=c.map(([I,T])=>{const A=Number(T[r]||0),H=Number(T[o]||0),P=A-H,O=se(P),K=P>0?"+":"",l=Ae(I),L=i=>i>0?i.toLocaleString("pt-BR",{minimumFractionDigits:2}):'<span class="text-on-surface-variant/30">—</span>';return`
            <div class="grid items-center gap-2 px-3 py-3 border-b border-white/5
                        hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
                 style="grid-template-columns:${w}">
                <span class="text-sm font-extrabold text-[var(--text-primary)] leading-none">${l}</span>
                <span class="text-xs font-bold ${p} text-right">${L(A)}</span>
                <span class="text-xs font-bold text-red-400 text-right">${L(H)}</span>
                <span class="text-xs font-extrabold ${O} text-right">${P!==0?K+ee(P).replace("R$ ",""):"—"}</span>
            </div>
        `}).join(""),B=`
        <div class="grid items-center gap-2 px-3 py-3 mt-1 bg-surface-container rounded-2xl border border-white/5"
             style="grid-template-columns:${w}">
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Total</span>
            <span class="text-xs font-extrabold ${p} text-right">${f>0?f.toLocaleString("pt-BR",{minimumFractionDigits:2}):"—"}</span>
            <span class="text-xs font-extrabold text-red-400 text-right">${k>0?k.toLocaleString("pt-BR",{minimumFractionDigits:2}):"—"}</span>
            <span class="text-xs font-extrabold ${g} text-right">${y!==0?(y>0?"+":"")+ee(y).replace("R$ ",""):"—"}</span>
        </div>
    `;s.innerHTML=F+x+B}window.openFinDetailModal=e=>{Pe(e),ge("fin-detail-modal")};window.closeFinDetailModal=()=>ve("fin-detail-modal");window.openEmergencyEditModal=()=>{const e=document.getElementById("input-emergency-fund");e&&(e.value=pe>0?pe.toFixed(2):""),ge("emergency-edit-modal")};window.closeEmergencyEditModal=()=>ve("emergency-edit-modal");window.saveEmergencyFund=async()=>{const e=document.getElementById("input-emergency-fund"),t=parseFloat(e==null?void 0:e.value)||0;try{await d.saveEmergencyFund(t),window.closeEmergencyEditModal(),setTimeout(()=>he(),520),window.showToast("Reserva de emergência atualizada","success")}catch(a){console.error("[Finances] Erro ao salvar reserva",a),window.showToast("Erro ao salvar reserva","error")}};async function he(){const e=document.getElementById("finances-root");e.innerHTML=`
        <section class="px-4 pt-6 space-y-4">
            <div class="px-1 mb-2">
                <div class="h-7 w-28 rounded-xl bg-white/[0.06] mb-2 animate-pulse"></div>
                <div class="h-3 w-44 rounded-full bg-white/[0.04] animate-pulse"></div>
            </div>
            ${[1,2,3].map(()=>`
                <div class="rounded-3xl bg-surface-container-low border border-white/[0.08] p-5 animate-pulse">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-9 h-9 rounded-xl bg-white/[0.06] flex-none"></div>
                        <div class="h-3 w-24 rounded-full bg-white/[0.06]"></div>
                    </div>
                    <div class="h-7 w-32 rounded-xl bg-white/[0.06] mb-2"></div>
                    <div class="h-3 w-40 rounded-full bg-white/[0.04]"></div>
                </div>
            `).join("")}
        </section>
    `;const[t,a]=await Promise.all([d.getAllDailyLogs(),d.getEmergencyFund()]);de=t||{},pe=a;const{diaBalance:n,dinheiroBalance:s}=Me(de);e.innerHTML=Ce(n,s,a);const r=document.getElementById("fin-modals-host");r&&r.remove(),He()}const Ne=["wb_sunny","fitness_center","coffee","restaurant","school","menu_book","restaurant_menu","edit_note","self_improvement","directions_run","bedtime","water_drop","favorite","psychology","music_note","code","brush","local_library","sports_soccer","hiking","spa","timer"];async function Re(){const e=document.getElementById("settings-root"),t=await d.getSettings(),a=[{name:"Verde (Default)",hex:"#72fe8f"},{name:"Azul",hex:"#4da6ff"},{name:"Roxo",hex:"#d48bff"},{name:"Vermelho",hex:"#ff5c5c"}];e.innerHTML=`
        <section class="mb-12 mt-2">
            <h2 class="text-xl font-bold font-headline mb-6">Configurações</h2>
            
            <div class="glass-card p-6 rounded-2xl bg-[#2A2A2A] mb-6">
                <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Tema e Cores</h3>
                
                <p class="text-xs text-on-surface-variant mb-4">Escolha a cor de destaque principal do aplicativo (Accent Color):</p>
                
                <div class="flex flex-wrap gap-4">
                    ${a.map(n=>`
                        <button onclick="window.changeAccentColor('${n.hex}')" 
                            class="w-12 h-12 rounded-full border-2 transition-transform active:scale-90 hover:scale-105 ${t.accent_color===n.hex?"border-white scale-110":"border-transparent"}"
                            style="background-color: ${n.hex};"
                            title="${n.name}"></button>
                    `).join("")}
                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl bg-[#2A2A2A]">
                <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Dados</h3>
                <button onclick="window.openHabitsManager()" class="w-full text-left p-4 rounded-xl bg-surface-container-highest flex items-center justify-between group hover:bg-surface-highest transition-colors">
                    <span class="text-sm font-bold">Gerenciar Hábitos Diários</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-white">chevron_right</span>
                </button>
                <div class="my-2"></div>
                <button class="w-full text-left p-4 rounded-xl bg-surface-container-highest flex items-center justify-between group hover:bg-surface-highest transition-colors">
                    <span class="text-sm font-bold">Exportar Dados</span>
                    <span class="material-symbols-outlined text-on-surface-variant group-hover:text-white">download</span>
                </button>
                <div class="my-2"></div>
                <button onclick="window.clearData()" class="w-full text-left p-4 rounded-xl bg-secondary/10 flex items-center justify-between group hover:bg-secondary/20 transition-colors">
                    <span class="text-sm font-bold text-secondary">Apagar todos os dados</span>
                    <span class="material-symbols-outlined text-secondary">delete</span>
                </button>
            </div>
        </section>
    `}function ue(){const e=window.APP_HABITS||[],t=Ne.map(a=>`<button data-icon="${a}" onclick="window._habitIconPick('${a}', this)" class="habit-icon-opt w-10 h-10 rounded-xl border border-white/10 bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all">
            <span class="material-symbols-outlined text-lg">${a}</span>
        </button>`).join("");return`
        <div class="space-y-4">
            <div class="space-y-2" id="habits-list-editable">
                ${e.map((a,n)=>`
                <div class="flex items-center gap-3 p-3 bg-surface-container rounded-2xl border border-white/5">
                    <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-lg text-primary accent-text">${a.icon||"check_circle"}</span>
                    </div>
                    <span class="flex-1 font-bold text-sm text-[var(--text-primary)]">${a.name}</span>
                    <button onclick="window._removeHabit('${a.id}')" class="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors flex-shrink-0">
                        <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                </div>`).join("")}
            </div>

            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-3">
                <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 block">Adicionar hábito</span>
                <input id="new-habit-name" type="text" placeholder="Nome do hábito..." class="w-full bg-surface-highest rounded-xl px-4 py-3 border border-white/10 text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Ícone</span>
                    <div class="flex flex-wrap gap-2" id="habit-icon-grid">
                        ${t}
                    </div>
                    <input type="hidden" id="new-habit-icon" value="check_circle">
                </div>
                <button onclick="window._addHabit()" class="w-full h-12 rounded-2xl bg-primary/20 border border-primary/30 text-primary font-bold text-sm hover:bg-primary/30 transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">add</span> Adicionar
                </button>
            </div>

            <button onclick="window._saveHabits()" class="w-full h-14 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-base shadow-xl active:scale-95 transition-transform">
                Salvar Hábitos
            </button>
            <p class="text-[11px] text-on-surface-variant/50 text-center">Os percentuais do dia serão calculados automaticamente com base nos hábitos ativos.</p>
        </div>
    `}window.openHabitsManager=()=>{let e=document.getElementById("habits-manager-modal");e||(e=document.createElement("div"),e.id="habits-manager-modal",e.className="fixed inset-0 z-[600] hidden flex-col justify-end",document.body.appendChild(e)),e.innerHTML=`
        <div class="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity opacity-0 duration-500" id="hm-overlay" onclick="window.closeHabitsManager()"></div>
        <div class="relative w-full h-[90vh] bg-surface-container-low rounded-t-[40px] flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.5)] transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" id="hm-sheet">
            <div class="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                <div>
                    <div class="w-12 h-[5px] bg-surface-highest rounded-full mx-auto mb-3"></div>
                    <h2 class="text-2xl font-extrabold text-[var(--text-primary)] font-headline">Gerenciar Hábitos</h2>
                    <span class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/60">${(window.APP_HABITS||[]).length} hábitos ativos</span>
                </div>
                <button onclick="window.closeHabitsManager()" class="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-6 pb-12 hide-scrollbar">
                ${ue()}
            </div>
        </div>
    `,e.classList.remove("hidden"),e.classList.add("flex"),requestAnimationFrame(()=>{document.getElementById("hm-overlay").classList.remove("opacity-0"),document.getElementById("hm-sheet").classList.remove("translate-y-full")}),window._habitIconPick("check_circle",null)};window.closeHabitsManager=()=>{const e=document.getElementById("habits-manager-modal"),t=document.getElementById("hm-overlay"),a=document.getElementById("hm-sheet");e&&(t.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{e.classList.add("hidden"),e.classList.remove("flex")},500))};window._habitIconPick=(e,t)=>{document.querySelectorAll(".habit-icon-opt").forEach(s=>{s.classList.remove("border-primary","bg-primary/20","text-primary"),s.classList.add("border-white/10","text-on-surface-variant")});const a=t||document.querySelector(`.habit-icon-opt[data-icon="${e}"]`);a&&(a.classList.add("border-primary","bg-primary/20","text-primary"),a.classList.remove("border-white/10","text-on-surface-variant"));const n=document.getElementById("new-habit-icon");n&&(n.value=e)};window._addHabit=()=>{const e=document.getElementById("new-habit-name"),t=document.getElementById("new-habit-icon"),a=e==null?void 0:e.value.trim();if(!a){e==null||e.focus();return}const n=(t==null?void 0:t.value)||"check_circle",s=a.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")+"_"+Date.now(),r=window.APP_HABITS||[];r.push({id:s,name:a,icon:n}),window.APP_HABITS=r,e&&(e.value="");const o=document.getElementById("habits-manager-modal"),c=o==null?void 0:o.querySelector(".flex-1.overflow-y-auto");c&&(c.innerHTML=ue()),window._habitIconPick("check_circle",null)};window._removeHabit=e=>{var n;if((window.APP_HABITS||[]).length<=1){(n=window.showToast)==null||n.call(window,"Você precisa ter pelo menos 1 hábito.","error");return}window.APP_HABITS=(window.APP_HABITS||[]).filter(s=>s.id!==e);const t=document.getElementById("habits-manager-modal"),a=t==null?void 0:t.querySelector(".flex-1.overflow-y-auto");a&&(a.innerHTML=ue())};window._saveHabits=async()=>{var t,a,n;const e=window.APP_HABITS||[];e.length!==0&&(await d.saveHabits(e),window.closeHabitsManager(),(t=window.showToast)==null||t.call(window,"Hábitos salvos com sucesso!","info"),((a=window.app)==null?void 0:a.currentTab)==="tab-dashboard"?W():((n=window.app)==null?void 0:n.currentTab)==="tab-planner"&&U())};window.changeAccentColor=async e=>{await d.saveSettings({accent_color:e}),document.documentElement.style.setProperty("--accent-color",e),Re()};window.clearData=()=>{confirm("Tem certeza? Isso apagará o MVP inteiro do localStorage.")&&(localStorage.removeItem("equilibrio_produtivo_data"),window.location.reload())};function qe(){let e=document.getElementById("app-toast-host");return e||(e=document.createElement("div"),e.id="app-toast-host",e.className="app-toast-host",document.body.appendChild(e)),e}window.showToast=(e,t="info")=>{const a=qe(),n=document.createElement("div");n.className=`app-toast app-toast-${t}`,n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.textContent=e,a.appendChild(n),requestAnimationFrame(()=>n.classList.add("show")),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>n.remove(),220)},2400)};class ze{constructor(t){this.user=t,this.currentTab="tab-dashboard",this.initNavigation(),this.renderTab(this.currentTab);const a={weekday:"short",day:"numeric",month:"short"};let n=new Date().toLocaleDateString("pt-BR",a);n=n.replace(".","").replace(" de "," ").replace(".",""),document.getElementById("header-date").textContent=n;const s=document.getElementById("user-avatar");s&&this.user.photoURL&&(s.innerHTML=`<img src="${this.user.photoURL}" alt="User Avatar" class="w-full h-full object-cover">`),this.initScrollHeader(),this.updateDynamicGreeting()}getGreeting(){const t=new Date().getHours();return t>=5&&t<12?"Bom dia":t>=12&&t<18?"Boa tarde":"Boa noite"}getGreetingMeta(){const t=new Date().getHours();return t>=5&&t<12?{text:"Bom dia",icon:"wb_sunny",iconClass:"text-amber-300"}:t>=12&&t<18?{text:"Boa tarde",icon:"partly_cloudy_day",iconClass:"text-orange-300"}:{text:"Boa noite",icon:"dark_mode",iconClass:"text-blue-300"}}buildDashboardTitle(){const t=this.getGreetingMeta(),a=this.user.displayName?this.user.displayName.split(" ")[0]:"Usuário";return`<span class='inline-flex items-center gap-1.5 text-xl accent-text'><span>${t.text}</span><span class='material-symbols-outlined ${t.iconClass}' style="font-size: 19px; font-variation-settings: 'FILL' 1;">${t.icon}</span></span><br/>${a}`}updateDynamicGreeting(){const t=this.buildDashboardTitle();this.currentTab==="tab-dashboard"&&(document.getElementById("header-title").innerHTML=t);const a=document.getElementById("nav-dashboard");a&&a.setAttribute("data-title",t)}async signOut(){confirm("Tem certeza que deseja sair da sua conta?")&&await G.auth().signOut()}initScrollHeader(){let t=0;const a=document.getElementById("main-header");window.addEventListener("scroll",()=>{const n=window.pageYOffset;n>60&&n>t?(a.classList.add("-translate-y-full","opacity-0"),a.classList.remove("shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]")):(a.classList.remove("-translate-y-full","opacity-0"),n>10&&a.classList.add("shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]")),t=n})}applyAccentColor(t){document.documentElement.style.setProperty("--accent-color",t)}initNavigation(){const t=document.querySelectorAll(".nav-item");t.forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.target;let s=a.dataset.title;if(n==="tab-dashboard"&&(s=this.buildDashboardTitle()),n===this.currentTab)return;document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active")),document.getElementById(n).classList.add("active"),t.forEach(o=>{o.classList.remove("accent-text"),o.querySelector(".material-symbols-outlined").classList.remove("filled")}),a.classList.add("accent-text"),a.querySelector(".material-symbols-outlined").classList.add("filled"),document.getElementById("header-title").innerHTML=s,this.currentTab=n,this.renderTab(n)})})}renderTab(t){switch(t){case"tab-dashboard":W();break;case"tab-planner":U();break;case"tab-finances":he();break}}}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("auth-screen"),t=document.getElementById("auth-loading"),a=document.getElementById("auth-login-box"),n=document.getElementById("btn-login-google"),s=document.getElementById("app-container"),r=document.getElementById("main-header"),o=document.getElementById("bottom-nav");n.addEventListener("click",async()=>{var c;try{const f=new G.auth.GoogleAuthProvider;await G.auth().signInWithPopup(f)}catch(f){console.error("Erro no login com google:",f),(c=window.showToast)==null||c.call(window,"Erro ao realizar login. Tente novamente.","error")}}),G.auth().onAuthStateChanged(async c=>{if(c){await d.init(c.uid);const f=[{id:"wakeup_early",name:"Acordar cedo",icon:"wb_sunny"},{id:"gym",name:"Academia",icon:"fitness_center"},{id:"breakfast",name:"Café da manhã",icon:"coffee"},{id:"lunch",name:"Almoço",icon:"restaurant"},{id:"study_dio",name:"Estudos DIO",icon:"school"},{id:"reading",name:"Leitura",icon:"menu_book"},{id:"dinner",name:"Janta",icon:"restaurant_menu"},{id:"fill_notion",name:"Preencher Notion",icon:"edit_note"}],k=await d.getHabits();window.APP_HABITS=k||f,e.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>{e.classList.add("hidden"),s.classList.remove("opacity-0","pointer-events-none"),r.classList.remove("opacity-0","pointer-events-none"),o.classList.remove("opacity-0","pointer-events-none","translate-y-full"),document.body.classList.remove("overflow-hidden"),window.app?window.app.renderTab(window.app.currentTab):window.app=new ze(c)},500)}else e.classList.remove("hidden","opacity-0","pointer-events-none"),t.classList.add("hidden"),a.classList.remove("hidden"),s.classList.add("opacity-0","pointer-events-none"),r.classList.add("opacity-0","pointer-events-none"),o.classList.add("opacity-0","pointer-events-none","translate-y-full"),window.app=null})});
