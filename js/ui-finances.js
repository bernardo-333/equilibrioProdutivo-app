export async function renderFinances() {
    const root = document.getElementById('finances-root');
    root.innerHTML = `
        <section class="min-h-[65vh] flex items-center justify-center px-4">
            <div class="max-w-md w-full rounded-3xl border border-white/10 bg-surface-container-low p-8 text-center space-y-4">
                <div class="w-14 h-14 rounded-2xl bg-primary/15 mx-auto flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary accent-text" style="font-size:28px">construction</span>
                </div>
                <h2 class="text-2xl font-extrabold font-headline">Financeiro em desenvolvimento</h2>
                <p class="text-sm text-on-surface-variant leading-relaxed">
                    Esta aba vai receber melhorias futuras. Enquanto isso, Dashboard e Planner seguem como foco principal.
                </p>
                <p class="text-xs text-on-surface-variant/70 uppercase tracking-widest font-bold">
                    Fase futura
                </p>
            </div>
        </section>
    `;
}
