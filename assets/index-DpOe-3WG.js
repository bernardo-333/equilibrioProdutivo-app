import{f as P}from"./firebase-CNzVcu9p.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=a(s);fetch(s.href,r)}})();const fe={apiKey:"AIzaSyBIlCbxhxEucKdBNyMWEwRuFOpEo0dVQx8",authDomain:"equilibrioprodutivo-app.firebaseapp.com",databaseURL:"https://equilibrioprodutivo-app-default-rtdb.firebaseio.com",projectId:"equilibrioprodutivo-app",storageBucket:"equilibrioprodutivo-app.firebasestorage.app",messagingSenderId:"785521986199",appId:"1:785521986199:web:449d7fe7979e0aad8db7d2",measurementId:"G-2FZ69XYWZJ"};P.apps.length||P.initializeApp(fe);const me="equilibrio_produtivo_data",oe={daily_logs:{},finances:{transactions:[],balance:0},learning:[],kanban:{ideas:[],doing:[],done:[]},settings:{accent_color:"#72fe8f"}};function ge(){const t=localStorage.getItem(me);if(!t)return JSON.parse(JSON.stringify(oe));try{const e=JSON.parse(t);return{daily_logs:e.daily_logs||{},finances:e.finances||{transactions:[],balance:0},learning:Array.isArray(e.learning)?e.learning:[],kanban:e.kanban||{ideas:[],doing:[],done:[]},settings:e.settings||{accent_color:"#72fe8f"}}}catch{return JSON.parse(JSON.stringify(oe))}}const ve=(t=new Date)=>{const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${n}`},X=()=>ve(new Date),p={_uid:null,init:async t=>{p._uid=t;try{if(!(await P.database().ref(`users/${t}`).once("value")).exists()){const a=ge();await P.database().ref(`users/${t}`).set(a)}}catch(e){console.error("[DB] Erro de inicialização",e)}},getRef:t=>{if(!p._uid)throw new Error("Usuário não autenticado");return P.database().ref(`users/${p._uid}/${t}`)},getSettings:async()=>{const t=await p.getRef("settings").once("value");return t.exists()?t.val():{accent_color:"#72fe8f"}},saveSettings:async t=>{const a={...await p.getSettings(),...t};return await p.getRef("settings").set(a),a},getTodayLog:async()=>{const t=X(),e=await p.getRef(`daily_logs/${t}`).once("value");if(!e.exists()){const a={habits:{},mood:null,sleep:null,water:0,screen_time:0,instagram:0,rest_day:!1};return await p.getRef(`daily_logs/${t}`).set(a),a}return e.val()},updateHabit:async(t,e,a=null)=>{const n=a||X();await p.getRef(`daily_logs/${n}/habits`).update({[t]:e})},updateDailyMetrics:async(t,e,a=null)=>{const n=a||X();await p.getRef(`daily_logs/${n}`).update({[t]:e})},updateDailyFinances:async(t,e)=>{const a={income_dia:Number((e==null?void 0:e.income_dia)||0),expense_dia:Number((e==null?void 0:e.expense_dia)||0),income_din:Number((e==null?void 0:e.income_din)||0),expense_din:Number((e==null?void 0:e.expense_din)||0)};await p.getRef(`daily_logs/${t}`).update(a)},getMonthlyLogs:async t=>{const e=await p.getRef("daily_logs").orderByKey().startAt(t).endAt(t+"").once("value");return e.exists()?e.val():{}},getDailyLog:async t=>{const e=await p.getRef(`daily_logs/${t}`).once("value");return e.exists()?e.val():null},getAllDailyLogs:async()=>{const t=await p.getRef("daily_logs").once("value");return t.exists()?t.val():{}},getFinances:async()=>{const t=await p.getRef("finances").once("value");if(!t.exists())return{transactions:[],balance:0};const e=t.val();return{transactions:e.transactions||[],balance:e.balance||0}},getEmergencyFund:async()=>{const t=await p.getRef("finances/emergency_fund").once("value");return t.exists()?Number(t.val()):0},saveEmergencyFund:async t=>{await p.getRef("finances/emergency_fund").set(Number(t))},addTransaction:async t=>{t.id=Date.now().toString();const e=await p.getFinances();return e.transactions||(e.transactions=[]),e.transactions.push(t),t.type==="income"?e.balance+=Number(t.amount):e.balance-=Number(t.amount),await p.getRef("finances").set(e),t},getLibrary:async()=>{const t=await p.getRef("learning").once("value");return t.exists()?t.val():[]},saveLibraryItem:async t=>{let e=await p.getLibrary();Array.isArray(e)||(e=[]);const a=e.findIndex(n=>n.id===t.id);return a>=0?e[a]=t:e.push(t),await p.getRef("learning").set(e),t},deleteLibraryItem:async t=>{let e=await p.getLibrary();e=(e||[]).filter(a=>a.id!==t),await p.getRef("learning").set(e)},getKanbanData:async()=>{const t=await p.getRef("kanban").once("value");if(!t.exists())return{ideas:[],doing:[],done:[]};const e=t.val();return{ideas:e.ideas||[],doing:e.doing||[],done:e.done||[]}},saveKanbanData:async t=>{await p.getRef("kanban").set(t)}};function ye({todayLog:t,balances:e,todayPct:a,missing:n,isAllDone:s,weekData:r,snapWeeks:i=[],currentWeekIndex:l=0,DEFAULT_HABITS:x,snapMessage:y,libraryItems:c}){const v=o=>Number(o||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),k=[{card:"bg-gradient-to-br from-cyan-500/12 via-surface-container-highest to-blue-500/10",border:"border-cyan-300/25",glow:"shadow-[0_8px_22px_rgba(34,211,238,0.14)]",bar:"bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.45)]",pct:"text-cyan-300",stepper:"bg-cyan-400/10 border-cyan-300/25 text-cyan-200 hover:bg-cyan-400/20"},{card:"bg-gradient-to-br from-emerald-500/12 via-surface-container-highest to-lime-500/10",border:"border-emerald-300/25",glow:"shadow-[0_8px_22px_rgba(52,211,153,0.14)]",bar:"bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.45)]",pct:"text-emerald-300",stepper:"bg-emerald-400/10 border-emerald-300/25 text-emerald-200 hover:bg-emerald-400/20"},{card:"bg-gradient-to-br from-amber-500/12 via-surface-container-highest to-orange-500/10",border:"border-amber-300/25",glow:"shadow-[0_8px_22px_rgba(251,191,36,0.14)]",bar:"bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.45)]",pct:"text-amber-300",stepper:"bg-amber-400/10 border-amber-300/25 text-amber-200 hover:bg-amber-400/20"},{card:"bg-gradient-to-br from-fuchsia-500/12 via-surface-container-highest to-pink-500/10",border:"border-fuchsia-300/25",glow:"shadow-[0_8px_22px_rgba(217,70,239,0.14)]",bar:"bg-fuchsia-300 shadow-[0_0_10px_rgba(240,171,252,0.45)]",pct:"text-fuchsia-300",stepper:"bg-fuchsia-400/10 border-fuchsia-300/25 text-fuchsia-200 hover:bg-fuchsia-400/20"},{card:"bg-gradient-to-br from-indigo-500/12 via-surface-container-highest to-violet-500/10",border:"border-indigo-300/25",glow:"shadow-[0_8px_22px_rgba(99,102,241,0.14)]",bar:"bg-indigo-300 shadow-[0_0_10px_rgba(165,180,252,0.45)]",pct:"text-indigo-300",stepper:"bg-indigo-400/10 border-indigo-300/25 text-indigo-200 hover:bg-indigo-400/20"}],L=o=>{const w=`${(o==null?void 0:o.id)||""}${(o==null?void 0:o.title)||""}${(o==null?void 0:o.type)||""}`;let m=0;for(let D=0;D<w.length;D++)m=(m<<5)-m+w.charCodeAt(D),m|=0;const g=Math.abs(m)%k.length;return k[g]},E=o=>{const w=o.total>0?Math.round(o.current/o.total*100):0,m=o.type==="book",g=L(o),D={to_do:"Para Iniciar",in_progress:"Em Andamento",done:"Concluído"},j={to_do:"text-on-surface-variant/60 bg-white/5 border-white/10",in_progress:"text-blue-400 bg-blue-400/10 border-blue-400/20",done:"text-green-400 bg-green-400/10 border-green-400/20"},A=m?"Pág":"Aula",T=j[o.status]||j.to_do;return`
            <div class="min-w-[255px] rounded-3xl p-5 border space-y-5 flex flex-col relative cursor-pointer active:scale-95 transition-transform ${g.card} ${g.border} ${g.glow}" onclick="window.openLibraryView('${o.id}')">
                <div class="flex justify-between items-start">
                    <span class="text-3xl">${o.emoji||(m?"📘":"🎓")}</span>
                    <span class="text-[8px] font-bold ${T} px-2 py-1 rounded-lg uppercase tracking-widest border">${D[o.status]||"Para Iniciar"}</span>
                </div>
                <div>
                    <span class="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/10 bg-black/20 text-white/80 mb-2">${m?"Livro":"Curso"}</span>
                    <h4 class="font-bold text-[var(--text-primary)] text-base leading-tight">${o.title}</h4>
                    <span class="text-[10px] text-on-surface-variant/50">${o.author||""}</span>
                </div>
                <div class="space-y-3 mt-auto">
                    <div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/10">
                        <div class="h-full ${g.bar} rounded-full" style="width:${w}%"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <button class="text-xs font-semibold text-on-surface-variant hover:text-white transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${o.id}')">${A} ${o.current||0} / ${o.total||0}</button>
                        <span class="text-[10px] font-extrabold ${g.pct}">${w}%</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 rounded-xl border text-base font-extrabold transition-colors ${g.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${o.id}', -1)">-</button>
                        <button class="w-8 h-8 rounded-xl border text-base font-extrabold transition-colors ${g.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${o.id}', 1)">+</button>
                        <button class="flex-1 h-8 rounded-xl border border-white/10 bg-black/20 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${o.id}')">Atualizar</button>
                    </div>
                </div>
            </div>`},f=(c||[]).filter(o=>o.type==="course"),$=(c||[]).filter(o=>o.type==="book"),_=o=>`<div class="min-w-[240px] bg-surface-container rounded-3xl p-5 border border-dashed border-white/10 flex items-center justify-center"><span class="text-sm text-on-surface-variant/30">Nenhum ${o} cadastrado</span></div>`,B=(o,w,m,g,D=!1)=>{if(m==="outside")return`
            <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[40px] opacity-20">
                <span class="text-[10px] font-bold text-on-surface-variant">${o}</span>
                <span class="text-[9px] text-on-surface-variant/60">${w}</span>
                <div class="relative w-10 h-10 flex items-center justify-center">
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/5" />
                    </svg>
                </div>
            </div>`;if(m==="future")return`
            <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[40px]">
                <span class="text-[10px] font-bold text-on-surface-variant">${o}</span>
                <span class="text-[9px] text-on-surface-variant/70">${w}</span>
                <div class="relative w-10 h-10 flex items-center justify-center">
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/5" />
                    </svg>
                </div>
            </div>`;const j=100.53,A=j-j*g/100,T=g===100;let M=D?`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 18px; font-variation-settings: 'FILL' 1;">hotel</span>`:T?`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`:`<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${g}%</span>`;const G=m==="today"?'id="snap-ring-today-circle"':"",d=m==="today"?'id="snap-ring-today-text"':"";let h="";return D?h='<circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="transparent" />':T?h='<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />':h=`
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" class="text-white/10" />
                <circle ${G} cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" stroke-width="3" 
                        class="text-primary accent-text drop-shadow-[0_0_4px_currentColor]" 
                        stroke-dasharray="${j}" stroke-dashoffset="${A}" stroke-linecap="round" />
            `,`
        <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[40px]">
            <span class="text-[10px] font-bold ${m==="today"?"text-primary accent-text":"text-on-surface-variant"}">${o}</span>
            <span class="text-[9px] ${m==="today"?"text-primary/90":"text-on-surface-variant/75"}">${w}</span>
            <div class="relative w-10 h-10 flex items-center justify-center rounded-full" ${D?'style="box-shadow: 0 0 15px rgba(251,191,36,0.45);"':T?'style="box-shadow: 0 0 15px var(--accent-color);"':""} ${m==="today"?'id="snap-ring-today-container"':""}>
                ${m==="today"?'<div class="absolute inset-0 rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] border border-primary/40 accent-border scale-125"></div>':""}
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                    ${h}
                </svg>
                <div class="z-10 flex items-center justify-center" ${d}>${M}</div>
            </div>
        </div>`},F=i&&i.length>0?i:[{index:0,label:"Semana 1",rangeLabel:"",days:r||[]}],H=F.map((o,w)=>`<span data-week-dot="${w}" class="w-1.5 h-1.5 rounded-full ${w===l?"bg-primary accent-bg":"bg-white/20"}"></span>`).join(""),u=F.map((o,w)=>{const m=o.days.filter(g=>g.state!=="outside"&&g.pct===100&&!g.isRestDay).length;return`
            <div data-week-index="${w}" class="min-w-full shrink-0 snap-start">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60">${o.label}${o.rangeLabel?` • ${o.rangeLabel}`:""}</span>
                    <span class="text-[10px] font-extrabold text-primary accent-text">${m} perfeitos</span>
                </div>
                <div class="flex flex-wrap justify-between gap-y-6 gap-x-2 w-full pb-2 px-1">
                    ${o.days.map(g=>B(g.day,g.dayNumber,g.state,g.pct,g.isRestDay)).join("")}
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
                                <p class="text-[var(--text-primary)] font-semibold tracking-tight leading-snug pr-1">${y}</p>
                            </div>
                            <div class="self-end sm:self-auto text-right shrink-0">
                                <span class="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50 block">Semanas no mês</span>
                                <span class="text-[10px] font-extrabold text-primary accent-text">${F.length}</span>
                            </div>
                        </div>

                        <div class="flex justify-center gap-1 mb-4">
                            ${H}
                        </div>

                        <div id="snap-weeks-carousel" class="flex overflow-x-auto hide-scrollbar snap-x snap-proximity gap-4 sm:gap-6" style="scrollbar-width:none;">
                            ${u}
                        </div>
                </div>

                <!-- Finance Card -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-amber-400/5 rounded-3xl p-6 border border-amber-300/20 opacity-90">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-amber-200/80 block mb-2 font-headline">Dia a Dia</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-amber-200/70">R$</span>
                            <span class="block w-full max-w-full truncate text-[clamp(1.1rem,4.8vw,1.85rem)] font-extrabold tracking-tighter text-[var(--text-primary)] font-headline" title="R$ ${v(e==null?void 0:e.diaBalance)}">${v(e==null?void 0:e.diaBalance)}</span>
                        </div>
                    </div>
                    <div class="bg-emerald-400/10 rounded-3xl p-6 border border-emerald-300/25 opacity-90">
                        <span class="text-[10px] font-bold tracking-widest uppercase text-emerald-200 block mb-2 font-headline">Meu Dinheiro</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-sm font-medium text-emerald-200/80">R$</span>
                            <span class="block w-full max-w-full truncate text-[clamp(1.1rem,4.8vw,1.85rem)] font-extrabold tracking-tighter text-[var(--text-primary)] font-headline" title="R$ ${v(e==null?void 0:e.dinheiroBalance)}">${v(e==null?void 0:e.dinheiroBalance)}</span>
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
                    ${$.length>0?$.map(E).join(""):_("livro")}
                </div>
            </section>

            <!-- Learning Section — Cursos -->
            <section class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold tracking-tight text-[var(--text-primary)] font-headline">Meus Cursos</h3>
                    <span class="text-xs font-bold text-primary accent-text tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity" onclick="window.openLibraryModal('course')">Ver Todos</span>
                </div>
                <div class="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    ${f.length>0?f.map(E).join(""):_("curso")}
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
                                    ${[{label:"Nervoso",val:"nervoso",active:"border-red-500 bg-red-500/20 text-red-500"},{label:"Feliz",val:"feliz",active:"border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]"},{label:"Produtivo",val:"produtivo",active:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},{label:"Normal",val:"normal",active:"border-white/50 bg-white/10 text-white"},{label:"Ansioso",val:"ansioso",active:"border-orange-400 bg-orange-400/20 text-orange-400"},{label:"Cansado",val:"cansado",active:"border-purple-400 bg-purple-400/20 text-purple-400"},{label:"Triste",val:"triste",active:"border-blue-400 bg-blue-400/20 text-blue-400"}].map(o=>{const w=t.mood===o.val;return`<button onclick="window.selectChip(this, 'mood-btn')" data-active-class="${o.active}" class="mood-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border ${w?o.active+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-60"} text-sm font-bold hover:opacity-100 transition-all">${o.label}</button>`}).join("")}
                                </div>
                            </div>
                            
                            <div class="h-px w-full bg-white/5"></div>

                            <!-- Sono -->
                            <div class="space-y-3">
                                <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                                <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width: none;">
                                    ${[{label:"Perfeito",val:"perfeito",active:"border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]"},{label:"Muito bom",val:"muito_bom",active:"border-blue-400 bg-blue-400/20 text-blue-400"},{label:"Bom",val:"bom",active:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},{label:"Mais ou menos",val:"mais_ou_menos",active:"border-orange-400 bg-orange-400/20 text-orange-400"},{label:"Ruim",val:"ruim",active:"border-red-500 bg-red-500/20 text-red-500"}].map(o=>{const w=t.sleep===o.val;return`<button onclick="window.selectChip(this, 'sleep-btn')" data-active-class="${o.active}" class="sleep-btn flex-shrink-0 px-5 py-2.5 rounded-2xl border ${w?o.active+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-60"} text-sm font-bold hover:opacity-100 transition-all">${o.label}</button>`}).join("")}
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Quantitativos e Horários -->
                    <section class="space-y-4">
                        <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70 pl-2">Seu corpo e tempo</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Hora que acordou -->
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Hora que acordou</span>
                                <input id="input-wake-time" type="time" value="${t.wake_time||""}" placeholder="00:00" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">
                            </div>
                            <!-- Instagram -->
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                <span class="text-xs font-bold text-on-surface-variant px-1">Tempo no Instagram</span>
                                <input id="input-instagram" type="text" inputmode="numeric" value="${t.instagram||""}" placeholder="00:40" maxlength="5" onblur="this.value = window.normalizeDurationValue ? window.normalizeDurationValue(this.value) : this.value" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline tracking-wider" autocomplete="off">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 px-1">Formato hh:mm</span>
                            </div>
                            <!-- Água -->
                            <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col items-center justify-center">
                                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                                <div class="flex items-center gap-3">
                                    ${[1,2,3,4,5].map(o=>{const w=o<=(t.water||0);return`<button onclick="window.setWaterInput(${o})" id="water-drop-${o}" class="text-4xl transition-all duration-300 ${w?"drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none":"grayscale opacity-30"} hover:scale-110 active:scale-90">💧</button>`}).join("")}
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
                            <h3 class="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">As 8 Rotinas</h3>
                            <span class="text-[10px] font-bold text-primary accent-text" id="lbl-habit-counter">0/8</span>
                        </div>
                        <div id="checkin-habits-section" class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5 transition-opacity">
                            ${x.map((o,w)=>{const m=t.habits?t.habits[o.id]:!1;return`
                                <div class="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-highest transition-colors cursor-pointer group active:scale-[0.98]" onclick="window.toggleHabit('${o.id}', ${!m})">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center text-on-surface-variant group-hover:text-[var(--text-primary)] transition-colors">
                                            <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' ${m?1:0};">${o.icon}</span>
                                        </div>
                                        <span id="txt-${o.id}" class="text-base font-bold transition-all ${m?"line-through opacity-50 text-on-surface-variant":"text-[var(--text-primary)]"}">${o.name}</span>
                                    </div>
                                    <div id="circle-${o.id}" class="w-7 h-7 rounded-full border-2 ${m?"bg-primary accent-bg border-primary accent-border":"border-on-surface-variant/30 group-hover:border-on-surface-variant/60"} flex items-center justify-center transition-all">
                                        ${m?'<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>':""}
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
                                            <input id="input-fluxo-dia-expense" value="${t.expense_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input id="input-fluxo-dia-income" value="${t.income_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
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
                                            <input id="input-fluxo-din-expense" value="${t.expense_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
                                        </div>
                                    </div>
                                    <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50">
                                        <span class="text-xs font-bold text-on-surface-variant">Ganho Hoje</span>
                                        <div class="flex items-center">
                                            <span class="text-primary accent-text font-bold mr-1">R$</span>
                                            <input id="input-fluxo-din-income" value="${t.income_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">
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
                    ${(c||[]).length===0?'<p class="text-center text-on-surface-variant/30 text-sm py-12">Nenhuma obra cadastrada ainda.</p>':(c||[]).map(o=>{const w=o.total>0?Math.round(o.current/o.total*100):0,m=o.type==="book",g=L(o),D={to_do:"Para Iniciar",in_progress:"Em Andamento",done:"Concluído"},j={to_do:"text-on-surface-variant/60 bg-white/5 border-white/10",in_progress:"text-blue-400 bg-blue-400/10 border-blue-400/20",done:"text-green-400 bg-green-400/10 border-green-400/20"},A=m?"Pág":"Aula",T=m?"Livro":"Curso",M=j[o.status]||j.to_do;return`
                            <div class="w-full rounded-[28px] p-5 border space-y-5 flex flex-col relative cursor-pointer active:scale-[0.98] transition-transform ${g.card} ${g.border} ${g.glow}" data-lib-type="${o.type}" onclick="window.openLibraryView('${o.id}')">
                                <div class="flex justify-between items-start">
                                    <span class="text-3xl filter drop-shadow-md">${o.emoji||(m?"📘":"🎓")}</span>
                                    <span class="text-[10px] font-bold ${M} px-3 py-1.5 rounded-xl uppercase tracking-widest border">${D[o.status]||"Para Iniciar"}</span>
                                </div>
                                <div>
                                    <span class="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1 block">${T} • ${o.author||""}</span>
                                    <h4 class="font-bold text-[var(--text-primary)] text-[18px] leading-tight">${o.title}</h4>
                                </div>
                                <div class="space-y-3 mt-auto">
                                    <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                                        <div class="h-full ${g.bar} rounded-full" style="width:${w}%"></div>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <button class="text-xs font-bold text-on-surface-variant hover:text-white transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${o.id}')">${A} ${o.current||0} de ${o.total||0}</button>
                                        <span class="text-xs font-extrabold ${g.pct}">${w}%</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button class="w-9 h-9 rounded-xl border text-lg font-extrabold transition-colors ${g.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${o.id}', -1)">-</button>
                                        <button class="w-9 h-9 rounded-xl border text-lg font-extrabold transition-colors ${g.stepper}" onclick="event.stopPropagation(); window.adjustLibraryProgress('${o.id}', 1)">+</button>
                                        <button class="flex-1 h-9 rounded-xl border border-white/10 bg-black/20 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition-colors" onclick="event.stopPropagation(); window.quickSetLibraryProgress('${o.id}')">Definir atual</button>
                                    </div>
                                </div>
                            </div>`}).join("")}
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
                                ${[1,2,3,4,5].map(o=>`<button class="lib-star text-4xl grayscale opacity-30 hover:scale-110 active:scale-90 transition-all text-yellow-500 drop-shadow-lg" onclick="window.setLibraryRating(${o})">⭐</button>`).join("")}
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
    `}const z=[{id:"wakeup_early",name:"Acordar cedo",icon:"wb_sunny"},{id:"gym",name:"Academia",icon:"fitness_center"},{id:"breakfast",name:"Café da manhã",icon:"coffee"},{id:"lunch",name:"Almoço",icon:"restaurant"},{id:"study_dio",name:"Estudos DIO",icon:"school"},{id:"reading",name:"Leitura",icon:"menu_book"},{id:"dinner",name:"Janta",icon:"restaurant_menu"},{id:"fill_notion",name:"Preencher Notion",icon:"edit_note"}];function he(t,e){const a=Object.values(t||{}),n=a.reduce((r,i)=>r+Number(i.income_dia||0)-Number(i.expense_dia||0),0),s=a.reduce((r,i)=>r+Number(i.income_din||0)-Number(i.expense_din||0),0);return{diaBalance:n,dinheiroBalance:s}}function ie(t){if(!t)return 0;if(t.rest_day)return 100;let e=0;const a=t.habits||{};for(const n of z)a[n.id]&&e++;return Math.round(e/z.length*100)}function te(t=new Date){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${n}`}function we(t){const e=new Date(t),a=e.getDay(),n=a===0?-6:-(a-1);return e.setDate(e.getDate()+n),e.setHours(0,0,0,0),e}function re(t){const e=String(t||"").trim();if(!e)return"";const a=e.replace(/[^0-9:]/g,"");if(!a)return"";if(a.includes(":")){const[i="",l=""]=a.split(":"),x=Math.max(0,Number.parseInt(i||"0",10)||0),y=Math.max(0,Math.min(59,Number.parseInt(l||"0",10)||0));return`${String(x).padStart(2,"0")}:${String(y).padStart(2,"0")}`}const n=a.replace(/\D/g,"");if(!n)return"";if(n.length<=2)return`00:${n.padStart(2,"0")}`;const s=n.slice(0,-2),r=n.slice(-2);return`${s.padStart(2,"0")}:${r.padStart(2,"0")}`}window.normalizeDurationValue=re;async function O(){var e;const t=document.getElementById("dashboard-root");try{const a=await p.getTodayLog(),n=await p.getLibrary();window._libraryItems=n;let s=0;a.habits||(a.habits={});for(const d of z)a.habits[d.id]&&s++;const r=!!a.rest_day,i=ie(a),l=z.length-s,x=r||s===z.length,y=["D","S","T","Q","Q","S","S"],c=new Date,v=te(c),k=await p.getAllDailyLogs(),L=he(k,v),E=c.getMonth(),f=c.getFullYear(),$=`${f}-${String(E+1).padStart(2,"0")}`,_=new Date(f,E,1),B=new Date(f,E+1,0),F=[];let H=0,u=!1,o=0,w=we(_);for(;w<=B;){const d=[];let h=!1;for(let b=0;b<5;b++){const S=new Date(w);S.setDate(w.getDate()+b);const C=S.getMonth()===E,I=te(S);C&&(h=!0);const R=C?k==null?void 0:k[I]:null,Q=C?ie(R):0,be=!!(R&&R.rest_day),xe=C?I===v?"today":I<v?"past":"future":"outside";d.push({day:y[S.getDay()],dayNumber:S.getDate(),dateKey:I,state:xe,pct:Q,isRestDay:be}),I===v&&(H=o,u=!0)}if(h){const b=d.find(C=>C.state!=="outside"),N=[...d].reverse().find(C=>C.state!=="outside");F.push({index:o,label:`Semana ${o+1}`,rangeLabel:b&&N?`${String(b.dayNumber).padStart(2,"0")} - ${String(N.dayNumber).padStart(2,"0")}`:"",days:d}),o++}w.setDate(w.getDate()+7)}if(!u&&F.length>0){const d=F.findLastIndex(h=>h.days.some(b=>b.state!=="outside"&&b.dateKey<=v));H=d>=0?d:0}let m=H;window._snapWeekMonthKey===$&&Number.isInteger(window._snapWeekIndex)&&(m=Math.max(0,Math.min(window._snapWeekIndex,F.length-1))),window._snapWeekMonthKey=$;const g=((e=F[m])==null?void 0:e.days)||[],D=g.filter(d=>d.pct===100&&!d.isRestDay).length,j=c.getDay()===1,A=g.findIndex(d=>d.state==="today");let T=`${D} dias perfeitos. <span class="text-primary accent-text">Não quebre a sequência hoje!</span>`;r&&(T="Hoje é dia de descanso. Recuperar também é disciplina."),D===5?T="Semana Lendária concluída! Descanse nos fins de semana.":j&&i===0?T="Tela em branco. Vamos desenhar uma semana perfeita?":A>0&&g[A-1].pct<100?T="Ontem foi dia de descanso, mas hoje é foco total!":i===0&&(T="O dia está voando. Hora do primeiro check-in!"),t.innerHTML=ye({todayLog:a,balances:L,todayPct:i,missing:l,isAllDone:x,weekData:g,snapWeeks:F,currentWeekIndex:m,DEFAULT_HABITS:z,snapMessage:T,libraryItems:n});const M=document.getElementById("snap-weeks-carousel"),G=M==null?void 0:M.querySelector(`[data-week-index="${m}"]`);if(M&&G){requestAnimationFrame(()=>{M.scrollTo({left:G.offsetLeft,behavior:"auto"})});const d=()=>{const b=Array.from(M.querySelectorAll("[data-week-index]")),S=Array.from(document.querySelectorAll("[data-week-dot]"));if(!b.length||!S.length)return;let N=0,C=Number.POSITIVE_INFINITY;for(const I of b){const R=Number(I.getAttribute("data-week-index")),Q=Math.abs(I.offsetLeft-M.scrollLeft);Q<C&&(C=Q,N=R)}window._snapWeekIndex=N,S.forEach(I=>{const R=Number(I.getAttribute("data-week-dot"))===N;I.classList.toggle("bg-primary",R),I.classList.toggle("accent-bg",R),I.classList.toggle("bg-white/20",!R)})};let h=null;M.addEventListener("scroll",()=>{h||(h=requestAnimationFrame(()=>{d(),h=null}))},{passive:!0}),d()}await K()}catch(a){console.error(a),t.innerHTML=`<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Dashboard:</h3><pre>${a.message}
${a.stack}</pre></div>`}}window.openCheckinModal=async()=>{const t=document.getElementById("checkin-modal"),e=document.getElementById("checkin-modal-overlay"),a=document.getElementById("checkin-modal-sheet");t.classList.remove("hidden"),t.classList.add("flex");const n=new Date,s=document.getElementById("lbl-checkin-date"),r=document.getElementById("lbl-checkin-day");s&&(s.textContent=n.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"}).replace(".","").toUpperCase()),r&&(r.textContent=n.toLocaleDateString("pt-BR",{weekday:"long"}));const i=await p.getTodayLog(),l={nervoso:"Nervoso",feliz:"Feliz",produtivo:"Produtivo",normal:"Normal",ansioso:"Ansioso",cansado:"Cansado",triste:"Triste"};if(i.mood){const k=l[i.mood];document.querySelectorAll(".mood-btn").forEach(L=>{L.textContent.trim()===k&&window.selectChip(L,"mood-btn",!0)})}const x={perfeito:"Perfeito",muito_bom:"Muito bom",bom:"Bom",mais_ou_menos:"Mais ou menos",ruim:"Ruim"};if(i.sleep){const k=x[i.sleep];document.querySelectorAll(".sleep-btn").forEach(L=>{L.textContent.trim()===k&&window.selectChip(L,"sleep-btn",!0)})}const y=i.water||0;if(y>0)for(let k=1;k<=5;k++){const L=document.getElementById(`water-drop-${k}`);L&&(k<=y?(L.classList.remove("grayscale","opacity-30"),L.classList.add("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")):(L.classList.add("grayscale","opacity-30"),L.classList.remove("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")))}const c=document.getElementById("input-wake-time"),v=document.getElementById("input-instagram");c&&(c.value=i.wake_time||""),v&&(v.value=re(i.instagram||"")),window.toggleRestDay(!!i.rest_day,!0),requestAnimationFrame(()=>{e.classList.remove("opacity-0"),a.classList.remove("translate-y-full")})};window.closeCheckinModal=async()=>{const t=document.getElementById("input-wake-time"),e=document.getElementById("input-instagram"),a=[];t&&a.push(p.updateDailyMetrics("wake_time",t.value||"")),e&&a.push(p.updateDailyMetrics("instagram",re(e.value||"")));const n=document.getElementById("rest-day-toggle-checkin"),s=(n==null?void 0:n.dataset.active)==="true";a.push(p.updateDailyMetrics("rest_day",!!s));const r=document.getElementById("input-fluxo-dia-income"),i=document.getElementById("input-fluxo-dia-expense"),l=document.getElementById("input-fluxo-din-income"),x=document.getElementById("input-fluxo-din-expense");if(r||i||l||x){const k={income_dia:r&&parseFloat(r.value)||0,expense_dia:i&&parseFloat(i.value)||0,income_din:l&&parseFloat(l.value)||0,expense_din:x&&parseFloat(x.value)||0},L=te(new Date);a.push(p.updateDailyFinances(L,k))}await Promise.all(a);const y=document.getElementById("checkin-modal"),c=document.getElementById("checkin-modal-overlay"),v=document.getElementById("checkin-modal-sheet");c.classList.add("opacity-0"),v.classList.add("translate-y-full"),setTimeout(()=>{y.classList.add("hidden"),y.classList.remove("flex"),O()},500)};let le=null;window.openLibraryView=t=>{const a=(window._libraryItems||[]).find(E=>E.id===t)||{id:t,emoji:"📘",title:"",author:"",type:"book",status:"",current:0,total:0};le=a,document.getElementById("lbl-lv-emoji").innerText=a.emoji||"📘",document.getElementById("lbl-lv-title").innerText=a.title||"",document.getElementById("lbl-lv-author").innerText=a.author||"";const n=a.total>0?Math.round(a.current/a.total*100):0,s=a.type==="book",r=s?"bg-cyan-400 shadow-[0_0_10px_rgba(136,235,255,0.5)]":"bg-primary accent-bg shadow-[0_0_10px_rgba(var(--accent-color-rgb),0.4)]",i=s?"text-cyan-400":"text-primary accent-text",l=s?"Pág":"Aula",x={to_do:"Para Iniciar",in_progress:"Em Andamento",done:"Concluído"},y={to_do:"text-on-surface-variant/60 border-white/10",in_progress:"text-blue-400 border-blue-400/20 bg-blue-400/10",done:"text-green-400 border-green-400/20 bg-green-400/10"},c=[];c.push(`
        <div class="flex gap-3">
            <div class="flex-1 bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Tipo</span>
                <p class="font-bold text-[var(--text-primary)]">${s?"📖 Livro":"📚 Curso"}</p>
            </div>
            <div class="flex-1 bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Status</span>
                <span class="inline-block px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${y[a.status]||""}">${x[a.status]||"—"}</span>
            </div>
        </div>`),c.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-5 border border-white/5 space-y-3">
            <div class="flex justify-between items-center">
                <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Progresso</span>
                <span class="font-extrabold text-sm ${i}">${n}%</span>
            </div>
            <div class="h-2.5 w-full bg-surface-container rounded-full overflow-hidden border border-white/5">
                <div class="h-full ${r} rounded-full transition-all" style="width:${n}%"></div>
            </div>
            <p class="text-xs font-bold text-on-surface-variant">${l} ${a.current} de ${a.total}</p>
        </div>`),a.genre&&c.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gênero</span>
            <p class="font-bold text-[var(--text-primary)]">${a.genre}</p>
        </div>`),a.rating&&c.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Sua Nota</span>
            <span class="text-xl tracking-wide">${"⭐".repeat(a.rating)}${'<span class="grayscale opacity-30">⭐</span>'.repeat(5-a.rating)}</span>
        </div>`),a.review&&c.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Suas Notas</span>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed">${a.review}</p>
        </div>`),document.getElementById("library-view-content").innerHTML=c.join("");const v=document.getElementById("library-view-modal"),k=document.getElementById("library-view-overlay"),L=document.getElementById("library-view-sheet");v.classList.remove("hidden"),v.classList.add("flex"),requestAnimationFrame(()=>{k.classList.remove("opacity-0"),L.classList.remove("translate-y-full")})};window.closeLibraryView=()=>{const t=document.getElementById("library-view-modal"),e=document.getElementById("library-view-overlay"),a=document.getElementById("library-view-sheet");e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},500)};window.openLibraryEditFromView=()=>{const t=le;window.closeLibraryView(),setTimeout(()=>{window.openLibraryForm(t==null?void 0:t.id,t)},200)};window.openLibraryModal=t=>{const e=document.getElementById("library-modal"),a=document.getElementById("library-modal-overlay"),n=document.getElementById("library-modal-sheet");e.classList.remove("hidden"),e.classList.add("flex"),requestAnimationFrame(()=>{a.classList.remove("opacity-0"),n.classList.remove("translate-y-full")}),window.filterLibrary(t||"all")};window.closeLibraryModal=()=>{const t=document.getElementById("library-modal"),e=document.getElementById("library-modal-overlay"),a=document.getElementById("library-modal-sheet");e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},500)};window.filterLibrary=t=>{document.querySelectorAll(".lib-filter-btn").forEach(a=>{a.classList.remove("bg-primary/20","text-primary","border","border-primary/30"),a.classList.add("bg-surface-highest","text-on-surface-variant","border","border-white/10")});const e=document.querySelector(`.lib-filter-btn[data-filter="${t}"]`);e&&(e.classList.remove("bg-surface-highest","text-on-surface-variant","border-white/10"),e.classList.add("bg-primary/20","text-primary","border-primary/30")),document.querySelectorAll("#library-modal-list > [data-lib-type]").forEach(a=>{t==="all"||a.dataset.libType===t?a.classList.remove("hidden"):a.classList.add("hidden")})};window.openLibraryForm=(t=null,e=null)=>{const a=document.getElementById("library-form-modal"),n=document.getElementById("library-form-overlay"),s=document.getElementById("library-form-sheet"),r=document.getElementById("lbl-lib-form-title"),i=document.getElementById("btn-lib-delete");window.setLibraryType("course"),window.setLibraryRating(0);const l=document.querySelector('.lib-status-btn[data-val="in_progress"]');if(l&&window.setLibraryStatus(l),t&&e){if(window._editingLibId=t,r.innerText="Editar Obra",i.classList.remove("hidden"),document.getElementById("lib-emoji").value=e.emoji||"",document.getElementById("lib-title").value=e.title||"",document.getElementById("lib-author").value=e.author||"",document.getElementById("lib-current").value=e.current||"",document.getElementById("lib-total").value=e.total||"",document.getElementById("lib-genre").value=e.genre||"",document.getElementById("lib-review").value=e.review||"",window.setLibraryType(e.type==="book"?"book":"course"),window.setLibraryRating(e.rating||0),e.status){const x=document.querySelector(`.lib-status-btn[data-val="${e.status}"]`);x&&window.setLibraryStatus(x)}}else window._editingLibId=null,r.innerText="Nova Obra",i.classList.add("hidden"),document.querySelectorAll("#library-form-sheet input, #library-form-sheet textarea").forEach(x=>x.value="");a.classList.remove("hidden"),a.classList.add("flex"),requestAnimationFrame(()=>{n.classList.remove("opacity-0"),s.classList.remove("translate-y-full")})};window.closeLibraryForm=()=>{const t=document.getElementById("library-form-modal"),e=document.getElementById("library-form-overlay"),a=document.getElementById("library-form-sheet");e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},300)};window.setLibraryType=t=>{const e=document.getElementById("btn-type-course"),a=document.getElementById("btn-type-book");t==="course"?(e.classList.add("bg-primary/20","text-primary","accent-text"),e.classList.remove("text-on-surface-variant","bg-transparent","hover:bg-white/5"),a.classList.remove("bg-primary/20","text-primary","accent-text"),a.classList.add("text-on-surface-variant","bg-transparent","hover:bg-white/5")):(a.classList.add("bg-primary/20","text-primary","accent-text"),a.classList.remove("text-on-surface-variant","bg-transparent","hover:bg-white/5"),e.classList.remove("bg-primary/20","text-primary","accent-text"),e.classList.add("text-on-surface-variant","bg-transparent","hover:bg-white/5"))};window.setLibraryStatus=t=>{document.querySelectorAll(".lib-status-btn").forEach(a=>{a.classList.remove("border-blue-400","bg-blue-400/20","text-blue-400","border-primary","bg-primary/20","text-primary","accent-text","accent-border"),a.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")});const e=t.getAttribute("data-val");t.classList.remove("border-white/10","bg-surface-highest","text-on-surface-variant"),e==="in_progress"?t.classList.add("border-blue-400","bg-blue-400/20","text-blue-400"):e==="done"?t.classList.add("border-primary","bg-primary/20","text-primary","accent-text","accent-border"):t.classList.add("text-white","border-white/50")};window.setLibraryRating=t=>{document.querySelectorAll(".lib-star").forEach((a,n)=>{n<t?(a.classList.remove("grayscale","opacity-30"),a.classList.add("filter-none","opacity-100")):(a.classList.add("grayscale","opacity-30"),a.classList.remove("filter-none","opacity-100"))})};window.saveLibraryForm=async()=>{var i;const t=document.getElementById("lib-title").value.trim();if(!t){document.getElementById("lib-title").focus();return}const e=(i=document.getElementById("btn-type-book"))==null?void 0:i.classList.contains("text-primary"),a=document.querySelector(".lib-status-btn.text-blue-400, .lib-status-btn.text-primary, .lib-status-btn.text-white"),n=document.querySelectorAll(".lib-star");let s=0;n.forEach((l,x)=>{l.classList.contains("grayscale")||(s=x+1)});const r={id:window._editingLibId||Date.now().toString(),emoji:document.getElementById("lib-emoji").value||(e?"📘":"🎓"),title:t,author:document.getElementById("lib-author").value.trim(),type:e?"book":"course",status:(a==null?void 0:a.dataset.val)||"to_do",current:parseInt(document.getElementById("lib-current").value)||0,total:parseInt(document.getElementById("lib-total").value)||0,genre:document.getElementById("lib-genre").value.trim(),rating:s,review:document.getElementById("lib-review").value.trim()};await p.saveLibraryItem(r),window.closeLibraryForm(),setTimeout(()=>O(),400)};window.adjustLibraryProgress=async(t,e=1)=>{const n=(window._libraryItems||[]).find(x=>x.id===t);if(!n)return;const s=Math.max(0,parseInt(n.total,10)||0),r=Math.max(0,parseInt(n.current,10)||0);let i=r+Number(e||0);if(s>0?i=Math.max(0,Math.min(s,i)):i=Math.max(0,i),i===r)return;const l={...n,current:i};await p.saveLibraryItem(l),await O()};window.quickSetLibraryProgress=async t=>{var c;const a=(window._libraryItems||[]).find(v=>v.id===t);if(!a)return;const n=a.type==="book"?"página atual":"aula atual",s=Math.max(0,parseInt(a.current,10)||0),r=Math.max(0,parseInt(a.total,10)||0),i=window.prompt(`Digite a ${n}:`,String(s));if(i===null)return;const l=Number.parseInt(String(i).trim(),10);if(!Number.isFinite(l)||l<0){(c=window.showToast)==null||c.call(window,"Valor invalido. Use um numero inteiro maior ou igual a 0.","error");return}let x=l;if(r>0&&(x=Math.min(r,x)),x===s)return;const y={...a,current:x};await p.saveLibraryItem(y),await O()};window.deleteLibraryItem=async()=>{window._editingLibId&&confirm("Tem certeza que deseja excluir esta obra?")&&(await p.deleteLibraryItem(window._editingLibId),window.closeLibraryForm(),setTimeout(()=>O(),400))};window.setWaterInput=async t=>{await p.updateDailyMetrics("water",t);for(let e=1;e<=5;e++){const a=document.getElementById(`water-drop-${e}`);a&&(e<=t?(a.classList.remove("grayscale","opacity-30"),a.classList.add("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")):(a.classList.add("grayscale","opacity-30"),a.classList.remove("drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]","filter-none")))}};window.selectChip=(t,e,a=!1)=>{const n={Nervoso:"nervoso",Feliz:"feliz",Produtivo:"produtivo",Normal:"normal",Ansioso:"ansioso",Cansado:"cansado",Triste:"triste"},s={Perfeito:"perfeito","Muito bom":"muito_bom",Bom:"bom","Mais ou menos":"mais_ou_menos",Ruim:"ruim"};document.querySelectorAll(`.${e}`).forEach(i=>{const l=i.getAttribute("data-active-class").split(" ");i.classList.remove(...l,"opacity-100"),i.classList.add("border-transparent","bg-surface-highest","text-on-surface-variant","opacity-60")});const r=t.getAttribute("data-active-class").split(" ");if(t.classList.remove("border-transparent","bg-surface-highest","text-on-surface-variant","opacity-60"),t.classList.add(...r,"opacity-100"),!a){const i=t.textContent.trim();e==="mood-btn"&&n[i]?(p.updateDailyMetrics("mood",n[i]),K()):e==="sleep-btn"&&s[i]&&(p.updateDailyMetrics("sleep",s[i]),K())}};window.toggleHabit=async(t,e)=>{var r;const a=document.getElementById("rest-day-toggle-checkin");if((a==null?void 0:a.dataset.active)==="true"){(r=window.showToast)==null||r.call(window,"Dia de descanso ativo. Desative para editar hábitos.","info");return}await p.updateHabit(t,e),K();const n=document.getElementById(`txt-${t}`),s=document.getElementById(`circle-${t}`);n&&s&&(e?(n.classList.add("line-through","text-on-surface-variant","opacity-50"),n.classList.remove("text-[var(--text-primary)]"),s.classList.add("border-primary","accent-border","bg-primary","accent-bg"),s.classList.remove("border-on-surface-variant/30","group-hover/habit:border-on-surface-variant/50"),s.innerHTML=`<span class="material-symbols-outlined text-black mix-blend-color-burn" style="font-size: 16px; font-variation-settings: 'FILL' 1;">check</span>`,s.parentElement.setAttribute("onclick",`window.toggleHabit('${t}', false)`)):(n.classList.remove("line-through","text-on-surface-variant","opacity-50"),n.classList.add("text-[var(--text-primary)]"),s.classList.remove("border-primary","accent-border","bg-primary","accent-bg"),s.classList.add("border-on-surface-variant/30","group-hover/habit:border-on-surface-variant/50"),s.innerHTML="",s.parentElement.setAttribute("onclick",`window.toggleHabit('${t}', true)`)))};window.setQualitative=async(t,e)=>{await p.updateDailyMetrics(t,e),K(),O()};window.updateWater=async t=>{const e=await p.getTodayLog(),a=Math.max(0,(e.water||0)+t);await p.updateDailyMetrics("water",a);const n=document.getElementById("lbl-water");n&&(n.innerText=`${a.toFixed(1)} L`),K()};window.toggleRestDay=async(t=null,e=!1)=>{const a=document.getElementById("rest-day-toggle-checkin"),n=document.getElementById("rest-day-badge-checkin"),s=document.getElementById("checkin-habits-section");if(!a||!n||!s)return;const r=a.dataset.active==="true",i=t===null?!r:!!t;a.dataset.active=String(i),i?(a.classList.add("bg-amber-400/20","border-amber-300/40","text-amber-200"),a.classList.remove("bg-surface-highest","border-white/10","text-on-surface-variant"),n.classList.remove("hidden"),s.classList.add("opacity-40")):(a.classList.remove("bg-amber-400/20","border-amber-300/40","text-amber-200"),a.classList.add("bg-surface-highest","border-white/10","text-on-surface-variant"),n.classList.add("hidden"),s.classList.remove("opacity-40")),e||(await p.updateDailyMetrics("rest_day",i),await K())};async function K(){const t=await p.getTodayLog();let e=0;t.habits||(t.habits={});for(const k of z)t.habits[k.id]&&e++;const a=z.length,n=!!t.rest_day,s=n?100:e/a*100,r=document.getElementById("lbl-habit-counter");r&&(r.innerText=n?"Descanso":`${e}/${a}`);const i=document.getElementById("checkin-internal-bar");i&&(i.style.width=`${s}%`);const l=document.getElementById("checkin-pct-text");l&&(l.innerText=`${Math.round(s)}%`);const x=document.getElementById("checkin-container");n||e===a?x&&(x.classList.remove("border-transparent"),x.classList.add("border","border-primary/50","accent-border","shadow-[0_0_20px_var(--accent-color)]","accent-glow")):x&&(x.classList.add("border-transparent"),x.classList.remove("border","border-primary/50","accent-border","shadow-[0_0_20px_var(--accent-color)]","accent-glow"));const y=document.getElementById("snap-ring-today-circle"),c=document.getElementById("snap-ring-today-text"),v=document.getElementById("snap-ring-today-container");if(y&&c&&v){const k=Math.round(s),L=2*Math.PI*16,E=L-s/100*L;n?(v.style.boxShadow="0 0 15px rgba(251,191,36,0.45)",v.querySelector("svg").innerHTML='<circle cx="20" cy="20" r="16" fill="#fbbf24" stroke="transparent" />',c.innerHTML=`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">hotel</span>`):k===100?(v.style.boxShadow="0 0 15px var(--accent-color)",v.querySelector("svg").innerHTML='<circle cx="20" cy="20" r="16" fill="var(--accent-color)" stroke="transparent" class="accent-bg" />',c.innerHTML=`<span class="material-symbols-outlined text-black opacity-90" style="font-size: 20px; font-variation-settings: 'FILL' 1;">local_fire_department</span>`):(v.style.boxShadow="none",y.style.strokeDashoffset=E,c.innerHTML=`<span class="text-[9px] font-extrabold tracking-tight text-on-surface-variant">${k}%</span>`)}}function ke({calendarData:t,historyDays:e,metrics:a,kanbanData:n,habitCatalog:s=[],habitFilterMonthLabel:r="",fullHistoryRows:i=[],fullHistoryMonths:l=[],fullHistoryCurrentMonthKey:x=""}){const y={nervoso:{label:"Nervoso",classes:"border-red-500 bg-red-500/20 text-red-500"},feliz:{label:"Feliz",classes:"border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]"},produtivo:{label:"Produtivo",classes:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},normal:{label:"Normal",classes:"border-white/50 bg-white/10 text-white"},ansioso:{label:"Ansioso",classes:"border-orange-400 bg-orange-400/20 text-orange-400"},cansado:{label:"Cansado",classes:"border-purple-400 bg-purple-400/20 text-purple-400"},triste:{label:"Triste",classes:"border-blue-400 bg-blue-400/20 text-blue-400"}},c={perfeito:{label:"Perfeito",classes:"border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.2)]"},muito_bom:{label:"Muito bom",classes:"border-blue-400 bg-blue-400/20 text-blue-400"},bom:{label:"Bom",classes:"border-cyan-400 bg-cyan-400/20 text-cyan-400"},mais_ou_menos:{label:"Mais ou menos",classes:"border-orange-400 bg-orange-400/20 text-orange-400"},ruim:{label:"Ruim",classes:"border-red-500 bg-red-500/20 text-red-500"}},v=u=>{if(!u||!y[u])return'<span class="text-xs font-bold text-on-surface-variant/60">—</span>';const o=y[u];return`<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl border text-[10px] font-bold ${o.classes}">${o.label}</span>`},k=u=>{if(!u||!c[u])return'<span class="text-xs font-bold text-on-surface-variant/60">—</span>';const o=c[u];return`<span class="inline-flex items-center justify-center px-2.5 py-1 rounded-xl border text-[10px] font-bold ${o.classes}">${o.label}</span>`},L=u=>{if(!u)return"";const o=new Date(`${u}T00:00:00`);return Number.isNaN(o.getTime())?"":new Intl.DateTimeFormat("pt-BR",{weekday:"long"}).format(o)},E=(u,o=!1)=>`
        <button class="${o?"history-day-row":""} w-full text-left border-b border-white/5 hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
                ${o?`data-month-key="${u.monthKey||""}"`:""}
                onclick="window.openDailyDetail('${u.rawDate}')">
            <div class="grid items-center gap-3 px-3 py-3" style="grid-template-columns: 140px 130px 110px 95px 120px 95px 80px;">
                <div class="flex items-center gap-2 leading-none">
                    <span class="text-sm font-extrabold text-[var(--text-primary)]">${u.date}</span>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/65">${L(u.rawDate)}</span>
                </div>

                <div>
                    <div class="h-2 w-full bg-surface-highest rounded-full overflow-hidden border border-white/5">
                        <div class="h-full ${u.restDay?"bg-amber-300":"bg-primary accent-bg"}" style="width: ${u.pct}%"></div>
                    </div>
                    <div class="text-[10px] font-extrabold ${u.restDay?"text-amber-300":"text-primary accent-text"} mt-1">${u.restDay?"Descanso":`${u.pct}%`}</div>
                </div>

                <div>${v(u.mood)}</div>

                <div class="text-xs font-bold text-[var(--text-primary)]">${u.wake_time||"--:--"}</div>

                <div>${k(u.sleep)}</div>

                <div class="text-xs font-bold text-[var(--text-primary)]">${u.instagram||"--:--"}</div>

                <div class="text-xs font-bold text-cyan-300">${Number(u.water||0)}L</div>
            </div>
        </button>
    `,f=u=>E(u,!0),$=new Date,_=new Date($.getFullYear(),$.getMonth(),1).getDay(),F=Array.from({length:_},()=>'<div class="aspect-square w-full"></div>').join("")+t.map(u=>{const o=u.day===$.getDate(),w=!u.isFuture,m=u.level===3&&u.pct===100;let g="";switch(u.level){case 0:g="bg-white/[0.04]";break;case 1:g="bg-primary/25 opacity-50";break;case 2:g="bg-primary/55 opacity-90 shadow-[0_0_6px_var(--accent-color)]";break;case 3:g=m?"bg-primary accent-bg ring-1 ring-white/65 shadow-[0_0_20px_var(--accent-color)]":"bg-primary/70 border border-primary/45 shadow-[0_0_6px_var(--accent-color)]";break;case 4:g="bg-amber-200/70 border border-amber-200/35";break}const D=o?"ring-2 ring-primary/80 accent-border scale-105":"",j=u.level===4?"text-amber-900/70":m?"text-black/85":u.level===3?"text-white/90":u.level>=2?"text-white/70":"text-white/25",A=m?`<span class="absolute top-1 right-1 material-symbols-outlined text-[10px] text-black/75" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>`:"",T=w?"cursor-pointer hover:scale-110 hover:brightness-125":"cursor-default",M=w?`onclick="window.openDailyDetail('${u.rawDate}')"`:"";return`<div title="Dia ${u.day}" ${M} class="aspect-square w-full rounded-lg ${g} ${D} relative flex items-center justify-center text-[9px] font-extrabold ${j} select-none transition-all duration-200 ${T}">${u.day}${A}</div>`}).join(""),H=e.slice(0,6).map(u=>E(u,!1)).join("");return`
        <div class="space-y-6 pb-12 font-headline animate-[fade-in_0.4s_ease-out]">

            <!-- Calendário e Métricas Integradas -->
            <section class="bg-surface-container-low rounded-[40px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 blur-[100px] -mr-36 -mt-36 opacity-30 pointer-events-none"></div>

                <!-- Header da Seção -->
                <div class="flex items-center justify-between mb-5 px-1">
                    <div>
                        <h3 class="text-xl font-extrabold text-[var(--text-primary)] font-headline tracking-tighter leading-none">Consistência</h3>
                        <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mt-0.5 block">${["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"][$.getMonth()]} ${$.getFullYear()}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.openHabitFilterModal()" class="h-8 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-white/10 bg-surface-highest text-[9px] sm:text-[10px] font-extrabold tracking-[0.08em] sm:tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
                            Filtrar hábitos
                        </button>
                        <div class="w-10 h-10 rounded-2xl bg-primary/10 accent-bg/10 flex items-center justify-center">
                            <span class="material-symbols-outlined text-primary accent-text text-xl">calendar_month</span>
                        </div>
                    </div>
                </div>

                <!-- Cabeçalho dias da semana -->
                <div class="grid grid-cols-7 text-[10px] font-bold text-on-surface-variant/30 text-center uppercase tracking-widest mb-2">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                </div>

                <!-- Grade do Calendário -->
                <div class="grid grid-cols-7 gap-[5px] mb-6">
                    ${F}
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
                            <div class="text-2xl font-extrabold tracking-tighter text-emerald-300 font-headline leading-none">${a.perfectDays}</div>
                            <div class="text-[9px] text-on-surface-variant/40 font-bold mt-0.5">dias</div>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-3 flex flex-col items-center justify-center border border-white/5 text-center gap-1.5">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest block">Sono</span>
                            <span class="px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${(c[a.avgSleep]||{classes:"border-white/20 bg-white/5 text-on-surface-variant/50"}).classes}">${(c[a.avgSleep]||{label:a.avgSleep||"—"}).label}</span>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-3 flex flex-col items-center justify-center border border-white/5 text-center gap-1.5">
                            <span class="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-widest block">Humor</span>
                            <span class="px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${(y[a.avgMood]||{classes:"border-white/20 bg-white/5 text-on-surface-variant/50"}).classes}">${(y[a.avgMood]||{label:a.avgMood||"—"}).label}</span>
                        </div>
                    </div>

                    <!-- Financeiro -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gasto Dia a Dia</span>
                                <div class="text-base font-extrabold tracking-tighter text-red-500 font-headline leading-none">R$ ${a.totalGastoDia.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
                            </div>
                            <span class="material-symbols-outlined text-red-500/25 text-2xl">payments</span>
                        </div>
                        <div class="bg-surface-highest/40 rounded-[22px] p-4 border border-white/5 flex items-center justify-between">
                            <div>
                                <span class="text-[9px] uppercase font-bold text-on-surface-variant/50 tracking-widest block mb-1">Gasto Meu Dinheiro</span>
                                <div class="text-base font-extrabold tracking-tighter text-red-400 font-headline leading-none">R$ ${a.totalGastoDinheiro.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
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
                    <span class="text-[10px] text-cyan-300 font-bold uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">Abril</span>
                </div>
                
                <div class="bg-surface-container-low rounded-[32px] p-2 border border-white/5 flex flex-col">
                    <div class="overflow-x-auto rounded-2xl border border-white/5" style="scrollbar-width:none;">
                        <div class="min-w-[760px] bg-surface-container-low/70 backdrop-blur">
                            <div class="grid items-center gap-3 px-3 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70" style="grid-template-columns: 140px 130px 110px 95px 120px 95px 80px;">
                                <span>Data</span>
                                <span>Progresso</span>
                                <span>Humor</span>
                                <span>Acordou</span>
                                <span>Sono</span>
                                <span>Instagram</span>
                                <span>Água</span>
                            </div>
                            ${H}
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
                    ${(()=>{const u={estudo:"text-blue-400 bg-blue-400/10 border-blue-400/20",hobbie:"text-purple-400 bg-purple-400/10 border-purple-400/20",crescimento:"text-green-400 bg-green-400/10 border-green-400/20",trabalho:"text-orange-400 bg-orange-400/10 border-orange-400/20",saude:"text-cyan-400 bg-cyan-400/10 border-cyan-400/20",outro:"text-on-surface-variant bg-white/5 border-white/10"},o=m=>{const g=u[m.type]||u.outro;return`
                    <div class="kanban-card flex-none p-4 bg-surface-container rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.3)] border border-white/5 cursor-pointer hover:bg-surface-highest hover:border-white/10 transition-all relative overflow-hidden group" draggable="true" data-card-id="${m.id}" onclick="window.openKanbanView('${m.id}')" ondragstart="event.stopPropagation()" >
                                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/40 accent-bg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div class="flex items-start justify-between mb-2">
                                    <span class="text-2xl leading-none filter drop-shadow-sm">${m.emoji||"🎯"}</span>
                                    ${m.type?`<span class="text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${g}">${m.type}</span>`:""}
                                </div>
                                <p class="text-[var(--text-primary)] font-bold text-[14px] leading-snug mb-1">${m.title}</p>
                                ${m.objective?`<p class="text-on-surface-variant/50 text-[11px] leading-snug line-clamp-2">${m.objective}</p>`:""}
                            </div>`},w=(m,g,D,j)=>`
                        <div class="flex-shrink-0 self-start w-[290px] flex flex-col gap-3">
                            <h4 class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pl-4 flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm opacity-40">${D}</span>
                                ${g} <span class="w-1 h-1 bg-white/20 rounded-full"></span> <span class="text-primary">${j.length}</span>
                            </h4>
                            <div class="kanban-column h-auto bg-surface-container-low/50 backdrop-blur rounded-[32px] p-4 min-h-[350px] border border-white/5 space-y-3 shadow-inner" data-column="${m}">
                                ${j.map(A=>o(A)).join("")}
                                ${j.length===0?'<div class="kanban-empty-state h-full flex items-center justify-center opacity-20 flex-col gap-2 mt-20"><span class="material-symbols-outlined text-4xl">inbox</span><p class="text-[10px] uppercase font-bold tracking-widest">Nada por aqui</p></div>':""}
                            </div>
                        </div>`;return`
                            ${w("ideas","A Fazer","lightbulb",n.ideas||[])}
                            ${w("doing","Em Progresso","pending",n.doing||[])}
                            ${w("done","Concluído","check_circle",n.done||[])}
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
                    ${(l||[]).map(u=>`<button
                            class="history-month-btn px-5 py-2 rounded-2xl border font-bold text-xs transition-colors ${u.key===x?"bg-primary/20 text-primary border-primary/30":"bg-white/5 text-on-surface-variant border-transparent hover:bg-white/10"}"
                            data-month-key="${u.key}"
                            onclick="window.filterFullHistoryMonth('${u.key}')">
                            ${u.label} <span class="opacity-70">(${u.count})</span>
                        </button>`).join("")}
                </div>
                <!-- List -->
                <div class="flex-1 overflow-y-auto px-6 py-2 hide-scrollbar">
                    <div class="overflow-x-auto rounded-2xl border border-white/5" style="scrollbar-width:none;">
                        <div class="min-w-[760px] bg-surface-container-low/70 backdrop-blur">
                            <div class="grid items-center gap-3 px-3 py-3 border-b border-white/8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70" style="grid-template-columns: 140px 130px 110px 95px 120px 95px 80px;">
                                <span>Data</span>
                                <span>Progresso</span>
                                <span>Humor</span>
                                <span>Acordou</span>
                                <span>Sono</span>
                                <span>Instagram</span>
                                <span>Água</span>
                            </div>
                            <div id="full-history-list">
                                ${(i||[]).map(u=>f(u)).join("")}
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
                            <span id="habit-filter-month-label" class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mt-1 block">${r}</span>
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
                            ${s.map(u=>`<button data-habit="${u.id}" onclick="window.setHabitCalendarFilter('${u.id}')" class="habit-filter-chip flex-shrink-0 px-4 py-2.5 rounded-2xl border border-white/10 bg-surface-highest text-on-surface-variant text-xs font-bold transition-all hover:bg-white/5">${u.name}</button>`).join("")}
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
    `}const q=[{id:"wakeup_early",name:"Acordar cedo"},{id:"gym",name:"Academia"},{id:"breakfast",name:"Café da manhã"},{id:"lunch",name:"Almoço"},{id:"study_dio",name:"Estudos DIO"},{id:"reading",name:"Leitura"},{id:"dinner",name:"Janta"},{id:"fill_notion",name:"Preencher Notion"}],Le=q.length,ee=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],ae=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];function $e(t){const e=String(t||"").trim();if(!e)return"";const a=e.replace(/[^0-9:]/g,"");if(!a)return"";if(a.includes(":")){const[i="",l=""]=a.split(":"),x=Math.max(0,Number.parseInt(i||"0",10)||0),y=Math.max(0,Math.min(59,Number.parseInt(l||"0",10)||0));return`${String(x).padStart(2,"0")}:${String(y).padStart(2,"0")}`}const n=a.replace(/\D/g,"");if(!n)return"";if(n.length<=2)return`00:${n.padStart(2,"0")}`;const s=n.slice(0,-2),r=n.slice(-2);return`${s.padStart(2,"0")}:${r.padStart(2,"0")}`}function U(t){if(!t)return 0;if(t.rest_day)return 100;let e=0;const a=t.habits||{};for(const n of q)a[n.id]&&e++;return Math.round(e/Le*100)}async function Z(){const t=document.getElementById("planner-root");try{let e=await p.getKanbanData();window._kanbanAllCards=[...(e.ideas||[]).map(d=>({...d,progress:"ideas"})),...(e.doing||[]).map(d=>({...d,progress:"doing"})),...(e.done||[]).map(d=>({...d,progress:"done"}))];const a=new Date,n=a.getFullYear(),s=a.getMonth(),r=`${n}-${String(s+1).padStart(2,"0")}`,i=new Date(n,s+1,0).getDate(),l=a.getDate(),x=new Date(n,s,1).getDay(),y=await p.getMonthlyLogs(r),c=await p.getAllDailyLogs(),v=[];for(let d=1;d<=i;d++){const h=`${r}-${String(d).padStart(2,"0")}`,b=y[h],S=U(b),N=!!b,C=!!(b&&b.rest_day);let I=0;C?I=4:S>0&&S<=33?I=1:S>33&&S<=66?I=2:S>66&&(I=3),v.push({day:d,level:I,pct:S,isFuture:d>l,isRestDay:C,rawDate:h,hasLog:N})}const k=[];for(let d=1;d<=i;d++){const h=`${r}-${String(d).padStart(2,"0")}`,b=y[h];k.push({day:d,rawDate:h,hasLog:!!b,habits:b&&b.habits?b.habits:{}})}const L=Object.entries(c||{}).sort((d,h)=>h[0].localeCompare(d[0])).map(([d,h])=>{const[b,S,N]=d.split("-").map(Number),C=U(h),I=q.map(R=>({id:R.id,name:R.name,done:!!(h.habits&&h.habits[R.id])}));return{date:`${String(N).padStart(2,"0")} ${ae[(S||1)-1]}`,rawDate:d,monthKey:`${b}-${String(S).padStart(2,"0")}`,pct:C,mood:h.mood||null,sleep:h.sleep||null,water:h.water||0,wake_time:h.wake_time||"",instagram:h.instagram||"",telas:h.screen_time||0,income_dia:h.income_dia||0,expense_dia:h.expense_dia||0,income_din:h.income_din||0,expense_din:h.expense_din||0,restDay:!!h.rest_day,habits:I}}),E=[],f={};for(const d of L)f[d.monthKey]=(f[d.monthKey]||0)+1;Object.keys(f).sort((d,h)=>h.localeCompare(d)).forEach(d=>{const[h,b]=d.split("-").map(Number);E.push({key:d,label:`${ee[(b||1)-1]} ${h}`,count:f[d]})});const $=r;window._plannerFullHistoryCurrentMonthKey=$;const _=[];for(let d=l;d>=1;d--){const h=`${r}-${String(d).padStart(2,"0")}`,b=y[h],S=b?U(b):0,N=q.map(C=>{var I;return{id:C.id,name:C.name,done:!!((I=b==null?void 0:b.habits)!=null&&I[C.id])}});_.push({date:`${String(d).padStart(2,"0")} ${ae[s]}`,rawDate:h,pct:S,mood:(b==null?void 0:b.mood)||null,sleep:(b==null?void 0:b.sleep)||null,water:(b==null?void 0:b.water)||0,wake_time:(b==null?void 0:b.wake_time)||"",instagram:(b==null?void 0:b.instagram)||"",telas:(b==null?void 0:b.screen_time)||0,income_dia:(b==null?void 0:b.income_dia)||0,expense_dia:(b==null?void 0:b.expense_dia)||0,income_din:(b==null?void 0:b.income_din)||0,expense_din:(b==null?void 0:b.expense_din)||0,restDay:!!(b!=null&&b.rest_day),habits:N})}window._plannerHistory=L,window._plannerHabitFilter={days:k,monthLabel:`${ee[s]} ${n}`,firstDayOffset:x,todayDate:l},window._plannerHabitFilterCurrentHabit||(window._plannerHabitFilterCurrentHabit="gym");const B=Object.values(y),F=B.filter(d=>U(d)===100&&!d.rest_day).length,H={perfeito:5,muito_bom:4,bom:3,mais_ou_menos:2,ruim:1},u={5:"perfeito",4:"muito_bom",3:"bom",2:"mais_ou_menos",1:"ruim"},o={feliz:5,produtivo:4,normal:3,cansado:2,triste:1},w={5:"feliz",4:"produtivo",3:"normal",2:"cansado",1:"triste"};let m=0,g=0,D=0,j=0;for(const d of B)d.sleep&&H[d.sleep]&&(m+=H[d.sleep],g++),d.mood&&o[d.mood]&&(D+=o[d.mood],j++);const A=g>0?u[Math.round(m/g)]||"bom":"—",T=j>0?w[Math.round(D/j)]||"normal":"—",M=B.reduce((d,h)=>(d.totalGastoDia+=Number(h.expense_dia||0),d.totalGastoDinheiro+=Number(h.expense_din||0),d),{totalGastoDia:0,totalGastoDinheiro:0}),G={perfectDays:F,avgSleep:A,avgMood:T,totalGastoDia:M.totalGastoDia,totalGastoDinheiro:M.totalGastoDinheiro};t.innerHTML=ke({calendarData:v,historyDays:_,metrics:G,kanbanData:e,habitCatalog:q,habitFilterMonthLabel:`${ee[s]} ${n}`,fullHistoryRows:L,fullHistoryMonths:E,fullHistoryCurrentMonthKey:$}),Ee()}catch(e){console.error("Planner error:",e),t.innerHTML=`<div style="color:red; padding:20px; word-break:break-all;"><h3>Erro no Planner:</h3><pre>${e.message}
${e.stack}</pre></div>`}}function ce(){const t=window._plannerHabitFilter;if(!t)return;const e=window._plannerHabitFilterCurrentHabit||"gym",a=q.find(c=>c.id===e)||q[0],n=document.getElementById("habit-filter-grid"),s=document.getElementById("habit-filter-summary"),r=document.getElementById("habit-filter-selected-title");if(!n||!s||!r)return;document.querySelectorAll(".habit-filter-chip").forEach(c=>{const v=c.dataset.habit===a.id;c.classList.toggle("border-primary",v),c.classList.toggle("bg-primary/20",v),c.classList.toggle("text-primary",v),c.classList.toggle("border-white/10",!v),c.classList.toggle("bg-surface-highest",!v),c.classList.toggle("text-on-surface-variant",!v)});const i=t.days.filter(c=>{var v;return c.hasLog&&!!((v=c.habits)!=null&&v[a.id])}).length,l=t.days.filter(c=>c.hasLog).length;r.textContent=a.name,s.textContent=`${i} de ${l} dias com registro concluíram este hábito.`;const x=Array.from({length:t.firstDayOffset},()=>'<div class="aspect-square w-full"></div>').join(""),y=t.days.map(c=>{var B;const v=c.hasLog&&!!((B=c.habits)!=null&&B[a.id]),k=c.day===t.todayDate,L=c.hasLog?`onclick="window.openDailyDetail('${c.rawDate}')"`:"",E=v?"bg-primary/90 border border-primary/60 text-white shadow-[0_0_10px_var(--accent-color)]":c.hasLog?"bg-surface-highest border border-white/10 text-on-surface-variant":"bg-white/[0.04] border border-transparent text-white/20",f=k?"ring-2 ring-primary/70":"",$=c.hasLog?"cursor-pointer hover:scale-105 hover:brightness-110":"cursor-default",_=v?`<span class="absolute top-1 right-1 material-symbols-outlined text-[10px] text-black/70" style="font-variation-settings: 'FILL' 1;">check_circle</span>`:"";return`<div ${L} class="aspect-square w-full rounded-xl relative flex items-center justify-center text-[10px] font-extrabold transition-all ${E} ${f} ${$}">${c.day}${_}</div>`}).join("");n.innerHTML=x+y}window.openHabitFilterModal=()=>{var s;const t=document.getElementById("habit-filter-modal"),e=document.getElementById("habit-filter-overlay"),a=document.getElementById("habit-filter-sheet");if(!t||!e||!a)return;const n=document.getElementById("habit-filter-month-label");n&&((s=window._plannerHabitFilter)!=null&&s.monthLabel)&&(n.textContent=window._plannerHabitFilter.monthLabel),t.classList.remove("hidden"),t.classList.add("flex"),requestAnimationFrame(()=>{e.classList.remove("opacity-0"),a.classList.remove("translate-y-full")}),ce()};window.setHabitCalendarFilter=t=>{window._plannerHabitFilterCurrentHabit=t,ce()};window.closeHabitFilterModal=()=>{const t=document.getElementById("habit-filter-modal"),e=document.getElementById("habit-filter-overlay"),a=document.getElementById("habit-filter-sheet");!t||!e||!a||(e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},400))};window.openDailyDetail=(t,e=!1)=>{let a=window._plannerHistory.find(f=>f.date===t||f.rawDate===t);if(!a){const f=t.split("-").map(Number);if(f.length!==3)return;const[$,_,B]=f;a={date:`${String(B).padStart(2,"0")} ${ae[(_||1)-1]}`,rawDate:t,pct:0,mood:null,sleep:null,water:0,wake_time:"",instagram:"",telas:0,income_dia:0,expense_dia:0,income_din:0,expense_din:0,restDay:!1,habits:q.map(F=>({id:F.id,name:F.name,done:!1}))},e=!0}const n=a.date||t,s=a.rawDate||t,r=document.getElementById("day-detail-modal"),i=document.getElementById("day-detail-overlay"),l=document.getElementById("day-detail-sheet"),x=document.getElementById("day-detail-content");document.getElementById("lbl-day-title").innerText=n,document.getElementById("lbl-day-pct").innerText=a.restDay?"Dia de Descanso":`${a.pct}% Concluído`;const y={nervoso:"Nervoso",feliz:"Feliz",produtivo:"Produtivo",normal:"Normal",ansioso:"Ansioso",cansado:"Cansado",triste:"Triste"},c={nervoso:"border-red-500 bg-red-500/20 text-red-500",feliz:"border-green-400 bg-green-400/20 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]",produtivo:"border-cyan-400 bg-cyan-400/20 text-cyan-400",normal:"border-white/50 bg-white/10 text-white",ansioso:"border-orange-400 bg-orange-400/20 text-orange-400",cansado:"border-purple-400 bg-purple-400/20 text-purple-400",triste:"border-blue-400 bg-blue-400/20 text-blue-400"},v={perfeito:"Perfeito",muito_bom:"Muito bom",bom:"Bom",mais_ou_menos:"Mais ou menos",ruim:"Ruim"},k={perfeito:"border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]",muito_bom:"border-blue-400 bg-blue-400/20 text-blue-400",bom:"border-cyan-400 bg-cyan-400/20 text-cyan-400",mais_ou_menos:"border-orange-400 bg-orange-400/20 text-orange-400",ruim:"border-red-500 bg-red-500/20 text-red-500"},L=Math.round(a.water),E=[1,2,3,4,5].map(f=>e?`<button onclick="window.setWaterForDate('${s}', ${f})" class="text-4xl transition-all duration-300 ${f<=L?"drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] filter-none":"grayscale opacity-30"} hover:scale-110 active:scale-90">💧</button>`:`<span class="text-4xl transition-all duration-300 ${f<=L?"drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]":"grayscale opacity-30"}">💧</span>`).join("");x.innerHTML=`
        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${e?"text-primary accent-text":"text-on-surface-variant/70"} pl-2">Dia</h3>
            <div class="bg-surface-container-highest rounded-3xl p-4 border border-white/5 flex items-center justify-between gap-3">
                <div>
                    <p class="font-bold text-[var(--text-primary)]">Dia de Descanso</p>
                    <p class="text-xs text-on-surface-variant">Não exige marcação das 8 rotinas.</p>
                </div>
                ${e?`<button onclick="window.setRestDayForDate('${s}', ${!a.restDay})" class="px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${a.restDay?"bg-amber-400/20 border-amber-300/40 text-amber-200":"bg-surface-highest border-white/10 text-on-surface-variant"}">${a.restDay?"Ativo":"Inativo"}</button>`:`<span class="px-3 py-2 rounded-xl border font-extrabold text-[10px] uppercase tracking-widest ${a.restDay?"bg-amber-400/20 border-amber-300/40 text-amber-200":"bg-surface-highest border-white/10 text-on-surface-variant"}">${a.restDay?"Descanso":"Normal"}</span>`}
            </div>
        </section>

        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${e?"text-primary accent-text":"text-on-surface-variant/70"} pl-2 flex items-center gap-2">
                Como você se sentiu? ${e?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
            </h3>
            <div class="bg-surface-container-highest rounded-3xl p-5 border border-white/5 space-y-6">

                <!-- Humor -->
                <div class="space-y-3">
                    <span class="text-sm font-bold text-[var(--text-primary)] block">Humor Geral</span>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                        ${Object.keys(y).map(f=>{const $=f===a.mood;return e?`<button onclick="window.setQualitativeForDate('${s}', 'mood', '${f}')" class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${$?c[f]+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-30 hover:opacity-100"}">${y[f]}</button>`:`<span class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${$?c[f]:"border-transparent bg-surface-highest text-on-surface-variant opacity-30"}">${y[f]}</span>`}).join("")}
                    </div>
                </div>

                <div class="h-px w-full bg-white/5"></div>

                <!-- Sono -->
                <div class="space-y-3">
                    <span class="text-sm font-bold text-[var(--text-primary)] block">Qualidade do Sono</span>
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-2 px-2" style="scrollbar-width:none;">
                        ${Object.keys(v).map(f=>{const $=f===a.sleep;return e?`<button onclick="window.setQualitativeForDate('${s}', 'sleep', '${f}')" class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${$?k[f]+" opacity-100":"border-transparent bg-surface-highest text-on-surface-variant opacity-30 hover:opacity-100"}">${v[f]}</button>`:`<span class="flex-shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${$?k[f]:"border-transparent bg-surface-highest text-on-surface-variant opacity-30"}">${v[f]}</span>`}).join("")}
                    </div>
                </div>
            </div>
        </section>

        <!-- Corpo e Tempo -->
        <section class="space-y-4">
            <h3 class="text-[11px] font-bold tracking-widest uppercase ${e?"text-primary accent-text":"text-on-surface-variant/70"} pl-2 flex items-center gap-2">
                Seu corpo e tempo ${e?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
            </h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 ${e?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                    <span class="text-xs font-bold text-on-surface-variant px-1">Hora que acordou</span>
                    ${e?`<input id="input-planner-wake-time" type="time" value="${a.wake_time||""}" placeholder="00:00" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline" style="color-scheme: dark;">`:`<span class="text-2xl font-extrabold text-[var(--text-primary)] pl-1 font-headline">${a.wake_time||"--:--"}</span>`}
                </div>

                <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 ${e?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                    <span class="text-xs font-bold text-on-surface-variant px-1">Tempo no Instagram</span>
                    ${e?`<input id="input-planner-instagram" type="text" inputmode="numeric" value="${a.instagram||""}" placeholder="00:40" maxlength="5" onblur="this.value = window.normalizeDurationValue ? window.normalizeDurationValue(this.value) : this.value" class="w-full bg-transparent border-none text-2xl font-extrabold text-[var(--text-primary)] p-0 pl-1 focus:outline-none focus:ring-0 text-left font-headline tracking-wider" autocomplete="off"><span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 px-1">Formato hh:mm</span>`:`<span class="text-2xl font-extrabold text-[var(--text-primary)] pl-1 font-headline">${a.instagram||"--:--"}</span>`}
                </div>

                <div class="col-span-2 bg-surface-container rounded-3xl p-5 border border-white/5 flex flex-col items-center gap-4">
                    <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Água Consumida (1 Gota = 1 Litro)</span>
                    <div class="flex items-center gap-3">
                        ${E}
                    </div>
                    <span class="text-[10px] font-bold text-cyan-400 tracking-widest">${a.water}L no total</span>
                </div>
                
                <!-- Fluxo Financeiro Diário -->
                <div class="col-span-2 space-y-4 pt-2">
                    <h3 class="text-[11px] font-bold tracking-widest uppercase ${e?"text-primary accent-text":"text-on-surface-variant/70"} flex items-center gap-2">
                        Fluxo do Caixa ${e?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
                    </h3>
                    
                    <!-- Carteira Dia a Dia -->
                    <div class="space-y-3">
                        <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Dia a Dia"</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${e?"focus-within:ring-2 focus-within:ring-red-400":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Gasto do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-red-400 font-bold mr-1">R$</span>
                                    ${e?`<input id="input-planner-dia-expense" value="${a.expense_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.expense_dia||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${e?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Ganho do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-primary accent-text font-bold mr-1">R$</span>
                                    ${e?`<input id="input-planner-dia-income" value="${a.income_dia||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.income_dia||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Carteira Meu Dinheiro -->
                    <div class="space-y-3 pt-2">
                        <span class="text-sm font-bold text-[var(--text-primary)] px-2">Carteira "Meu Dinheiro"</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${e?"focus-within:ring-2 focus-within:ring-red-400":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Gasto do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-red-400 font-bold mr-1">R$</span>
                                    ${e?`<input id="input-planner-din-expense" value="${a.expense_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.expense_din||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
                                </div>
                            </div>
                            <div class="bg-surface-container rounded-3xl p-4 border border-white/5 space-y-2 relative overflow-hidden group ${e?"focus-within:ring-2 focus-within:ring-primary/50":""}">
                                <span class="text-xs font-bold text-on-surface-variant">Ganho do Dia</span>
                                <div class="flex items-center">
                                    <span class="text-primary accent-text font-bold mr-1">R$</span>
                                    ${e?`<input id="input-planner-din-income" value="${a.income_din||""}" type="number" step="0.01" placeholder="0.00" class="w-full bg-transparent border-none text-xl font-extrabold text-[var(--text-primary)] p-0 focus:outline-none focus:ring-0 appearance-none font-headline">`:`<span class="text-xl font-extrabold text-[var(--text-primary)] font-headline">${Number(a.income_din||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>`}
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
                <h3 class="text-[11px] font-bold tracking-widest uppercase ${e?"text-primary accent-text":"text-on-surface-variant/70"} flex items-center gap-2">
                    As 8 Rotinas ${e?'<span class="material-symbols-outlined text-[14px]">edit</span>':""}
                </h3>
                <span class="text-[10px] font-bold ${a.restDay?"text-amber-300":"text-primary accent-text"}">${a.restDay?"Descanso":`${a.habits.filter(f=>f.done).length}/${a.habits.length}`}</span>
            </div>
            <div class="bg-surface-container rounded-[32px] p-2 space-y-1 border border-white/5">
                ${a.restDay?`
                    <div class="p-4 rounded-2xl bg-amber-400/10 border border-amber-300/20 text-amber-200 text-sm font-bold text-center">
                        Dia de descanso ativo. Rotinas não são obrigatórias hoje.
                    </div>
                `:""}
                ${a.habits.map(f=>e?`
                        <div class="flex items-center justify-between p-3 rounded-2xl ${f.done?"bg-surface-highest/50":""} transition-colors cursor-pointer group active:scale-[0.98] ${a.restDay?"opacity-40 pointer-events-none":""}" onclick="window.toggleHabitForDate('${s}', '${f.id}', ${!f.done})">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
                                    <span class="material-symbols-outlined text-lg ${f.done?"text-primary accent-text":"text-on-surface-variant group-hover:text-white"}" style="font-variation-settings: 'FILL' ${f.done?1:0};">task_alt</span>
                                </div>
                                <span class="text-base font-bold transition-all ${f.done?"line-through opacity-50 text-on-surface-variant":"text-[var(--text-primary)]"}">${f.name}</span>
                            </div>
                            <div class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${f.done?"bg-primary accent-bg border-primary accent-border":"border-on-surface-variant/30 group-hover:border-white/40"}">
                                ${f.done?'<span class="material-symbols-outlined text-black font-bold mix-blend-color-burn" style="font-size:16px;">check</span>':""}
                            </div>
                        </div>`:`
                        <div class="flex items-center justify-between p-3 rounded-2xl ${f.done?"bg-surface-highest/50":"opacity-60"} transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-surface-highest flex items-center justify-center">
                                    <span class="material-symbols-outlined text-lg ${f.done?"text-primary accent-text":"text-on-surface-variant"}" style="font-variation-settings: 'FILL' ${f.done?1:0};">task_alt</span>
                                </div>
                                <span class="text-base font-bold transition-all ${f.done?"line-through text-on-surface-variant":"text-on-surface-variant"}">${f.name}</span>
                            </div>
                            ${f.done?'<div class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center"><span class="material-symbols-outlined text-primary accent-text font-bold" style="font-size:16px;">check</span></div>':""}
                        </div>`).join("")}
            </div>
        </section>

        <!-- Footer Buttons -->
        ${e?`
        <button onclick="window.saveAndCloseDailyDetail('${s}');" class="w-full h-16 rounded-[24px] bg-primary accent-bg text-black font-extrabold text-lg shadow-xl active:scale-95 transition-transform mt-6">
            Salvar e Concluir
        </button>
        `:`
        <button onclick="window.openDailyDetail('${s}', true);" class="w-full h-16 rounded-[24px] bg-surface-highest border border-white/10 text-[var(--text-primary)] font-bold text-lg active:scale-95 transition-transform mt-6 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">edit</span> Editar Dia
        </button>
        `}
    `,r.classList.contains("hidden")&&(r.classList.remove("hidden"),r.classList.add("flex"),requestAnimationFrame(()=>{i.classList.remove("opacity-0"),l.classList.remove("translate-y-full")}))};window.toggleHabitForDate=async(t,e,a)=>{var s;const n=window._plannerHistory.find(r=>r.rawDate===t);if(n!=null&&n.restDay){(s=window.showToast)==null||s.call(window,"Dia de descanso ativo. Desative para editar hábitos.","info");return}if(await p.updateHabit(e,a,t),n){const r=n.habits.find(l=>l.id===e);r&&(r.done=a);let i=n.habits.filter(l=>l.done).length;n.pct=Math.round(i/n.habits.length*100)}window.openDailyDetail(t,!0)};window.setQualitativeForDate=async(t,e,a)=>{await p.updateDailyMetrics(e,a,t);const n=window._plannerHistory.find(s=>s.rawDate===t);n&&(n[e]=a),window.openDailyDetail(t,!0)};window.setWaterForDate=async(t,e)=>{await p.updateDailyMetrics("water",e,t);const a=window._plannerHistory.find(n=>n.rawDate===t);a&&(a.water=e),window.openDailyDetail(t,!0)};window.setRestDayForDate=async(t,e)=>{await p.updateDailyMetrics("rest_day",e,t);const a=window._plannerHistory.find(n=>n.rawDate===t);a&&(a.restDay=e,a.pct=e?100:Math.round(a.habits.filter(n=>n.done).length/a.habits.length*100)),window.openDailyDetail(t,!0)};window.saveAndCloseDailyDetail=async t=>{const e=[],a=document.getElementById("input-planner-wake-time"),n=document.getElementById("input-planner-instagram");a&&e.push(p.updateDailyMetrics("wake_time",a.value||"",t)),n&&e.push(p.updateDailyMetrics("instagram",$e(n.value||""),t));const s=document.getElementById("input-planner-dia-income"),r=document.getElementById("input-planner-dia-expense"),i=document.getElementById("input-planner-din-income"),l=document.getElementById("input-planner-din-expense");if(s||r||i||l){const x={income_dia:s&&parseFloat(s.value)||0,expense_dia:r&&parseFloat(r.value)||0,income_din:i&&parseFloat(i.value)||0,expense_din:l&&parseFloat(l.value)||0};e.push(p.updateDailyFinances(t,x))}await Promise.all(e),window.closeDailyDetail(),setTimeout(()=>{Z()},550)};window.closeDailyDetail=()=>{const t=document.getElementById("day-detail-modal"),e=document.getElementById("day-detail-overlay"),a=document.getElementById("day-detail-sheet");e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},500)};window.filterFullHistoryMonth=t=>{document.querySelectorAll(".history-month-btn").forEach(n=>{const s=n.dataset.monthKey===t;n.classList.toggle("bg-primary/20",s),n.classList.toggle("text-primary",s),n.classList.toggle("border-primary/30",s),n.classList.toggle("bg-white/5",!s),n.classList.toggle("text-on-surface-variant",!s)});let e=0;document.querySelectorAll(".history-day-row").forEach(n=>{const s=n.dataset.monthKey===t;n.classList.toggle("hidden",!s),s&&e++});const a=document.getElementById("full-history-empty");a&&a.classList.toggle("hidden",e>0)};window.openFullHistory=()=>{var n;const t=document.getElementById("full-history-modal"),e=document.getElementById("full-history-sheet");t.classList.remove("hidden"),t.classList.add("flex"),requestAnimationFrame(()=>{e.classList.remove("scale-95","opacity-0")});const a=window._plannerFullHistoryCurrentMonthKey||((n=document.querySelector(".history-month-btn"))==null?void 0:n.getAttribute("data-month-key"));a&&window.filterFullHistoryMonth(a)};window.closeFullHistory=()=>{const t=document.getElementById("full-history-modal");document.getElementById("full-history-sheet").classList.add("scale-95","opacity-0"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},300)};const _e={estudo:"📚 Estudo",hobbie:"🎮 Hobbie",crescimento:"🌱 Crescimento",trabalho:"💼 Trabalho",saude:"🏋️ Saúde",outro:"📌 Outro"},De={ideas:"A Iniciar",doing:"Em Progresso",done:"Feito ✅"},Ie={ideas:"text-on-surface-variant/60",doing:"text-blue-400",done:"text-green-400"};let J=null,V=null;window.openKanbanView=t=>{var x,y;const e=document.querySelector(`.kanban-card[data-card-id="${t}"]`),a=(window._kanbanAllCards||[]).find(c=>c.id===t)||{id:t,emoji:((x=e==null?void 0:e.querySelector("span.text-2xl"))==null?void 0:x.innerText)||"🎯",title:((y=e==null?void 0:e.querySelector("p"))==null?void 0:y.innerText)||"",type:"",objective:"",description:"",start:"",end:""};V=a,document.getElementById("lbl-kv-emoji").innerText=a.emoji||"🎯",document.getElementById("lbl-kv-title").innerText=a.title||"",document.getElementById("lbl-kv-type").innerText=_e[a.type]||"";const n=[];a.objective&&n.push(`
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
        </div>`);const s=Ie[a.progress]||"text-on-surface-variant/60";n.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 flex items-center justify-between">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest">Progresso</span>
            <span class="font-bold text-sm ${s}">${De[a.progress]||"A Iniciar"}</span>
        </div>`),a.description&&n.push(`
        <div class="bg-surface-container-highest rounded-3xl px-5 py-4 border border-white/5 space-y-2">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-widest block">Descrição</span>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed">${a.description}</p>
        </div>`),document.getElementById("kanban-view-content").innerHTML=n.join("")||'<p class="text-center text-on-surface-variant/30 text-sm py-8">Sem detalhes adicionados.</p>';const r=document.getElementById("kanban-view-modal"),i=document.getElementById("kanban-view-overlay"),l=document.getElementById("kanban-view-sheet");r.classList.remove("hidden"),r.classList.add("flex"),requestAnimationFrame(()=>{i.classList.remove("opacity-0"),l.classList.remove("translate-y-full")})};window.closeKanbanView=()=>{const t=document.getElementById("kanban-view-modal"),e=document.getElementById("kanban-view-overlay"),a=document.getElementById("kanban-view-sheet");e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},500)};window.openKanbanEditFromView=()=>{window.closeKanbanView(),setTimeout(()=>{window.openKanbanForm(V==null?void 0:V.id,V)},200)};window.openKanbanForm=(t,e)=>{const a=document.getElementById("kanban-form-modal"),n=document.getElementById("kanban-form-overlay"),s=document.getElementById("kanban-form-sheet");if(document.querySelectorAll(".kanban-type-btn").forEach(r=>{r.classList.remove("border-primary","bg-primary/20","text-primary"),r.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),document.querySelectorAll(".kanban-progress-btn").forEach(r=>{r.classList.remove("border-blue-400","bg-blue-400/20","text-blue-400"),r.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),t&&e){if(J=t,document.getElementById("lbl-kanban-form-title").innerText="Editar Card",document.getElementById("btn-kanban-delete").classList.remove("hidden"),document.getElementById("kanban-emoji").value=e.emoji||"",document.getElementById("kanban-title").value=e.title||"",document.getElementById("kanban-objective").value=e.objective||"",document.getElementById("kanban-description").value=e.description||"",document.getElementById("kanban-start").value=e.start||"",document.getElementById("kanban-end").value=e.end||"",e.type){const l=document.querySelector(`.kanban-type-btn[data-val="${e.type}"]`);l&&window.setKanbanType(l)}const r=e.progress||"ideas",i=document.querySelector(`.kanban-progress-btn[data-val="${r}"]`);i&&window.setKanbanProgress(i)}else{J=null,document.getElementById("lbl-kanban-form-title").innerText="Novo Card",document.getElementById("btn-kanban-delete").classList.add("hidden"),document.getElementById("kanban-emoji").value="",document.getElementById("kanban-title").value="",document.getElementById("kanban-objective").value="",document.getElementById("kanban-description").value="",document.getElementById("kanban-start").value="",document.getElementById("kanban-end").value="";const r=document.querySelector('.kanban-progress-btn[data-val="ideas"]');r&&window.setKanbanProgress(r)}a.classList.remove("hidden"),a.classList.add("flex"),requestAnimationFrame(()=>{n.classList.remove("opacity-0"),s.classList.remove("translate-y-full")})};window.closeKanbanForm=()=>{const t=document.getElementById("kanban-form-modal"),e=document.getElementById("kanban-form-overlay"),a=document.getElementById("kanban-form-sheet");e.classList.add("opacity-0"),a.classList.add("translate-y-full"),setTimeout(()=>{t.classList.add("hidden"),t.classList.remove("flex")},400)};window.setKanbanType=t=>{document.querySelectorAll(".kanban-type-btn").forEach(e=>{e.classList.remove("border-primary","bg-primary/20","text-primary"),e.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),t.classList.remove("border-white/10","bg-surface-highest","text-on-surface-variant"),t.classList.add("border-primary","bg-primary/20","text-primary")};window.setKanbanProgress=t=>{document.querySelectorAll(".kanban-progress-btn").forEach(e=>{e.classList.remove("border-blue-400","bg-blue-400/20","text-blue-400"),e.classList.add("border-white/10","bg-surface-highest","text-on-surface-variant")}),t.classList.remove("border-white/10","bg-surface-highest","text-on-surface-variant"),t.classList.add("border-blue-400","bg-blue-400/20","text-blue-400")};window.saveKanbanForm=async()=>{var s,r;const t=document.getElementById("kanban-title").value.trim();if(!t){document.getElementById("kanban-title").focus();return}const e={id:J||Date.now().toString(),emoji:document.getElementById("kanban-emoji").value,title:t,type:((s=document.querySelector(".kanban-type-btn.text-primary"))==null?void 0:s.dataset.val)||"",start:document.getElementById("kanban-start").value,end:document.getElementById("kanban-end").value,objective:document.getElementById("kanban-objective").value,description:document.getElementById("kanban-description").value},a=((r=document.querySelector(".kanban-progress-btn.text-blue-400"))==null?void 0:r.dataset.val)||"ideas";let n=await p.getKanbanData();n.ideas||(n.ideas=[]),n.doing||(n.doing=[]),n.done||(n.done=[]),["ideas","doing","done"].forEach(i=>{n[i]=n[i].filter(l=>l.id!==e.id)}),n[a].unshift(e),await p.saveKanbanData(n),window.closeKanbanForm(),setTimeout(()=>Z(),400)};window.deleteKanbanCard=async()=>{if(J&&confirm("Tem certeza que deseja excluir este card?")){let t=await p.getKanbanData();["ideas","doing","done"].forEach(e=>{t[e]=(t[e]||[]).filter(a=>a.id!==J)}),await p.saveKanbanData(t),window.closeKanbanForm(),setTimeout(()=>Z(),400)}};function Ee(){let t=null;const e=document.querySelectorAll(".kanban-card"),a=document.querySelectorAll(".kanban-column");e.forEach(n=>{n.addEventListener("dragstart",function(s){t=this,setTimeout(()=>this.classList.add("opacity-30","scale-95"),0)}),n.addEventListener("dragend",function(){setTimeout(()=>{this.classList.remove("opacity-30","scale-95"),t=null},0)})}),a.forEach(n=>{n.addEventListener("dragover",function(s){s.preventDefault()}),n.addEventListener("dragenter",function(s){s.preventDefault(),this.classList.add("border-primary/50","bg-white/5")}),n.addEventListener("dragleave",function(){this.classList.remove("border-primary/50","bg-white/5")}),n.addEventListener("drop",async function(){if(this.classList.remove("border-primary/50","bg-white/5"),t){const s=this.querySelector(".kanban-empty-state");s&&s.remove(),this.prepend(t);const r=t.dataset.cardId,i=this.dataset.column;if(r&&i){let l=await p.getKanbanData(),x=null;["ideas","doing","done"].forEach(y=>{const c=(l[y]||[]).findIndex(v=>v.id===r);c>=0&&(x=l[y].splice(c,1)[0])}),x&&(l[i]||(l[i]=[]),l[i].unshift(x),await p.saveKanbanData(l))}}})})}let ne={},se=0;function W(t){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t)}function Y(t){return t>0?"text-green-400":t<0?"text-red-400":"text-on-surface-variant"}function Be(t){const e=Object.values(t||{}),a=e.reduce((s,r)=>s+Number(r.income_dia||0)-Number(r.expense_dia||0),0),n=e.reduce((s,r)=>s+Number(r.income_din||0)-Number(r.expense_din||0),0);return{diaBalance:a,dinheiroBalance:n}}function Se(t){const[e,a,n]=t.split("-").map(Number),s=new Date(e,a-1,n),r=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],i=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];return`${r[s.getDay()]}, ${String(n).padStart(2,"0")} ${i[a-1]}`}function je(t,e,a){const n=Y(t),s=Y(e);return`
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
                <p class="text-2xl font-extrabold ${n}">${W(t)}</p>
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
                <p class="text-2xl font-extrabold ${s}">${W(e)}</p>
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
                <p class="text-2xl font-extrabold text-amber-400">${W(a)}</p>
                <p class="text-xs text-on-surface-variant/60 mt-1">Valor definido manualmente</p>
            </div>
        </div>
    </section>
    `}function Fe(){const t=document.createElement("div");t.id="fin-modals-host",t.innerHTML=`
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
    `,document.body.appendChild(t)}function de(t){const e=document.getElementById(t);e.classList.remove("hidden"),e.classList.add("flex"),requestAnimationFrame(()=>{document.getElementById(`${t}-overlay`).classList.remove("opacity-0"),document.getElementById(`${t}-sheet`).classList.remove("translate-y-full")})}function pe(t){document.getElementById(`${t}-overlay`).classList.add("opacity-0"),document.getElementById(`${t}-sheet`).classList.add("translate-y-full"),setTimeout(()=>{const e=document.getElementById(t);e.classList.add("hidden"),e.classList.remove("flex")},500)}function Ce(t){const e=t==="dia",a=document.getElementById("fin-detail-title"),n=document.getElementById("fin-detail-icon"),s=document.getElementById("fin-detail-content");e?(a.textContent="Dia a Dia",n.className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-none",n.innerHTML='<span class="material-symbols-outlined text-blue-400" style="font-size:18px">wallet</span>'):(a.textContent="Meu Dinheiro",n.className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-none",n.innerHTML='<span class="material-symbols-outlined text-violet-400" style="font-size:18px">savings</span>');const r=e?"income_dia":"income_din",i=e?"expense_dia":"expense_din",l=Object.entries(ne).filter(([,_])=>Number(_[r]||0)>0||Number(_[i]||0)>0).sort((_,B)=>B[0].localeCompare(_[0]));if(l.length===0){s.innerHTML=`
            <div class="flex flex-col items-center justify-center h-48 gap-3">
                <span class="material-symbols-outlined text-on-surface-variant/30" style="font-size:44px">receipt_long</span>
                <p class="text-sm text-on-surface-variant/60">Nenhuma movimentação registrada</p>
            </div>
        `;return}const x=l.reduce((_,[,B])=>_+Number(B[r]||0),0),y=l.reduce((_,[,B])=>_+Number(B[i]||0),0),c=x-y,v=Y(c),k=e?"text-blue-400":"text-violet-400",L="1fr 80px 80px 84px",E=`
        <div class="grid items-center gap-2 px-3 py-2 border-b border-white/10 mb-1 sticky top-0 bg-surface-container-low z-10"
             style="grid-template-columns:${L}">
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Data</span>
            <span class="text-[10px] font-bold uppercase tracking-widest ${k} text-right">Ganho</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-red-400 text-right">Gasto</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 text-right">Saldo</span>
        </div>
    `,f=l.map(([_,B])=>{const F=Number(B[r]||0),H=Number(B[i]||0),u=F-H,o=Y(u),w=u>0?"+":"",m=Se(_),g=D=>D>0?D.toLocaleString("pt-BR",{minimumFractionDigits:2}):'<span class="text-on-surface-variant/30">—</span>';return`
            <div class="grid items-center gap-2 px-3 py-3 border-b border-white/5
                        hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
                 style="grid-template-columns:${L}">
                <span class="text-sm font-extrabold text-[var(--text-primary)] leading-none">${m}</span>
                <span class="text-xs font-bold ${k} text-right">${g(F)}</span>
                <span class="text-xs font-bold text-red-400 text-right">${g(H)}</span>
                <span class="text-xs font-extrabold ${o} text-right">${u!==0?w+W(u).replace("R$ ",""):"—"}</span>
            </div>
        `}).join(""),$=`
        <div class="grid items-center gap-2 px-3 py-3 mt-1 bg-surface-container rounded-2xl border border-white/5"
             style="grid-template-columns:${L}">
            <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Total</span>
            <span class="text-xs font-extrabold ${k} text-right">${x>0?x.toLocaleString("pt-BR",{minimumFractionDigits:2}):"—"}</span>
            <span class="text-xs font-extrabold text-red-400 text-right">${y>0?y.toLocaleString("pt-BR",{minimumFractionDigits:2}):"—"}</span>
            <span class="text-xs font-extrabold ${v} text-right">${c!==0?(c>0?"+":"")+W(c).replace("R$ ",""):"—"}</span>
        </div>
    `;s.innerHTML=E+f+$}window.openFinDetailModal=t=>{Ce(t),de("fin-detail-modal")};window.closeFinDetailModal=()=>pe("fin-detail-modal");window.openEmergencyEditModal=()=>{const t=document.getElementById("input-emergency-fund");t&&(t.value=se>0?se.toFixed(2):""),de("emergency-edit-modal")};window.closeEmergencyEditModal=()=>pe("emergency-edit-modal");window.saveEmergencyFund=async()=>{const t=document.getElementById("input-emergency-fund"),e=parseFloat(t==null?void 0:t.value)||0;try{await p.saveEmergencyFund(e),window.closeEmergencyEditModal(),setTimeout(()=>ue(),520),window.showToast("Reserva de emergência atualizada","success")}catch(a){console.error("[Finances] Erro ao salvar reserva",a),window.showToast("Erro ao salvar reserva","error")}};async function ue(){const t=document.getElementById("finances-root");t.innerHTML=`
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
    `;const[e,a]=await Promise.all([p.getAllDailyLogs(),p.getEmergencyFund()]);ne=e||{},se=a;const{diaBalance:n,dinheiroBalance:s}=Be(ne);t.innerHTML=je(n,s,a);const r=document.getElementById("fin-modals-host");r&&r.remove(),Fe()}async function Te(){const t=document.getElementById("settings-root"),e=await p.getSettings(),a=[{name:"Verde (Default)",hex:"#72fe8f"},{name:"Azul",hex:"#4da6ff"},{name:"Roxo",hex:"#d48bff"},{name:"Vermelho",hex:"#ff5c5c"}];t.innerHTML=`
        <section class="mb-12 mt-2">
            <h2 class="text-xl font-bold font-headline mb-6">Configurações</h2>
            
            <div class="glass-card p-6 rounded-2xl bg-[#2A2A2A] mb-6">
                <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Tema e Cores</h3>
                
                <p class="text-xs text-on-surface-variant mb-4">Escolha a cor de destaque principal do aplicativo (Accent Color):</p>
                
                <div class="flex flex-wrap gap-4">
                    ${a.map(n=>`
                        <button onclick="window.changeAccentColor('${n.hex}')" 
                            class="w-12 h-12 rounded-full border-2 transition-transform active:scale-90 hover:scale-105 ${e.accent_color===n.hex?"border-white scale-110":"border-transparent"}"
                            style="background-color: ${n.hex};"
                            title="${n.name}"></button>
                    `).join("")}
                </div>
            </div>

            <div class="glass-card p-6 rounded-2xl bg-[#2A2A2A]">
                <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">Dados</h3>
                <button class="w-full text-left p-4 rounded-xl bg-surface-container-highest flex items-center justify-between group hover:bg-surface-highest transition-colors">
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
    `}window.changeAccentColor=async t=>{await p.saveSettings({accent_color:t}),document.documentElement.style.setProperty("--accent-color",t),Te()};window.clearData=()=>{confirm("Tem certeza? Isso apagará o MVP inteiro do localStorage.")&&(localStorage.removeItem("equilibrio_produtivo_data"),window.location.reload())};function Me(){let t=document.getElementById("app-toast-host");return t||(t=document.createElement("div"),t.id="app-toast-host",t.className="app-toast-host",document.body.appendChild(t)),t}window.showToast=(t,e="info")=>{const a=Me(),n=document.createElement("div");n.className=`app-toast app-toast-${e}`,n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.textContent=t,a.appendChild(n),requestAnimationFrame(()=>n.classList.add("show")),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>n.remove(),220)},2400)};class Ae{constructor(e){this.user=e,this.currentTab="tab-dashboard",this.initNavigation(),this.renderTab(this.currentTab);const a={weekday:"short",day:"numeric",month:"short"};let n=new Date().toLocaleDateString("pt-BR",a);n=n.replace(".","").replace(" de "," ").replace(".",""),document.getElementById("header-date").textContent=n;const s=document.getElementById("user-avatar");s&&this.user.photoURL&&(s.innerHTML=`<img src="${this.user.photoURL}" alt="User Avatar" class="w-full h-full object-cover">`),this.initScrollHeader(),this.updateDynamicGreeting()}getGreeting(){const e=new Date().getHours();return e>=5&&e<12?"Bom dia":e>=12&&e<18?"Boa tarde":"Boa noite"}getGreetingMeta(){const e=new Date().getHours();return e>=5&&e<12?{text:"Bom dia",icon:"wb_sunny",iconClass:"text-amber-300"}:e>=12&&e<18?{text:"Boa tarde",icon:"partly_cloudy_day",iconClass:"text-orange-300"}:{text:"Boa noite",icon:"dark_mode",iconClass:"text-blue-300"}}buildDashboardTitle(){const e=this.getGreetingMeta(),a=this.user.displayName?this.user.displayName.split(" ")[0]:"Usuário";return`<span class='inline-flex items-center gap-1.5 text-xl accent-text'><span>${e.text}</span><span class='material-symbols-outlined ${e.iconClass}' style="font-size: 19px; font-variation-settings: 'FILL' 1;">${e.icon}</span></span><br/>${a}`}updateDynamicGreeting(){const e=this.buildDashboardTitle();this.currentTab==="tab-dashboard"&&(document.getElementById("header-title").innerHTML=e);const a=document.getElementById("nav-dashboard");a&&a.setAttribute("data-title",e)}async signOut(){confirm("Tem certeza que deseja sair da sua conta?")&&await P.auth().signOut()}initScrollHeader(){let e=0;const a=document.getElementById("main-header");window.addEventListener("scroll",()=>{const n=window.pageYOffset;n>60&&n>e?(a.classList.add("-translate-y-full","opacity-0"),a.classList.remove("shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]")):(a.classList.remove("-translate-y-full","opacity-0"),n>10&&a.classList.add("shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)]")),e=n})}applyAccentColor(e){document.documentElement.style.setProperty("--accent-color",e)}initNavigation(){const e=document.querySelectorAll(".nav-item");e.forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.target;let s=a.dataset.title;if(n==="tab-dashboard"&&(s=this.buildDashboardTitle()),n===this.currentTab)return;document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById(n).classList.add("active"),e.forEach(i=>{i.classList.remove("accent-text"),i.querySelector(".material-symbols-outlined").classList.remove("filled")}),a.classList.add("accent-text"),a.querySelector(".material-symbols-outlined").classList.add("filled"),document.getElementById("header-title").innerHTML=s,this.currentTab=n,this.renderTab(n)})})}renderTab(e){switch(e){case"tab-dashboard":O();break;case"tab-planner":Z();break;case"tab-finances":ue();break}}}document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("auth-screen"),e=document.getElementById("auth-loading"),a=document.getElementById("auth-login-box"),n=document.getElementById("btn-login-google"),s=document.getElementById("app-container"),r=document.getElementById("main-header"),i=document.getElementById("bottom-nav");n.addEventListener("click",async()=>{var l;try{const x=new P.auth.GoogleAuthProvider;await P.auth().signInWithPopup(x)}catch(x){console.error("Erro no login com google:",x),(l=window.showToast)==null||l.call(window,"Erro ao realizar login. Tente novamente.","error")}}),P.auth().onAuthStateChanged(async l=>{l?(p.init(l.uid),t.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>{t.classList.add("hidden"),s.classList.remove("opacity-0","pointer-events-none"),r.classList.remove("opacity-0","pointer-events-none"),i.classList.remove("opacity-0","pointer-events-none","translate-y-full"),document.body.classList.remove("overflow-hidden"),window.app?window.app.renderTab(window.app.currentTab):window.app=new Ae(l)},500)):(t.classList.remove("hidden","opacity-0","pointer-events-none"),e.classList.add("hidden"),a.classList.remove("hidden"),s.classList.add("opacity-0","pointer-events-none"),r.classList.add("opacity-0","pointer-events-none"),i.classList.add("opacity-0","pointer-events-none","translate-y-full"),window.app=null)})});
