# Debug: Erros no Planner

## Problema Principal

`TypeError: Cannot read properties of undefined (reading 'classes')` em `js/views/planner-view.js:109:153` dentro da função `getPlannerHTML`, chamado por `js/controllers/planner-controller.js:110:22` em `renderPlanner`.

## Checklist de Testes

- [x] Navegar para `http://localhost:5500`
- [x] Clicar na aba "Planner" (segundo ícone na bottom nav)
- [x] Aguardar 3 segundos e tirar screenshot (Planner renderiza!)
- [x] Rolar até a seção Kanban
- [x] Clicar no botão "+" para adicionar novo card
- [x] Preencher título "Teste de Kanban" e salvar
- [x] Verificar logs de console
- ❌ **Falhou**: Modal não fechou, card não salvo

## Observações

- O Planner renderiza com sucesso (calendário visível).
- Métricas (Sono, Humor) exibem "—" — sem dados reais ainda.
- Colunas do Kanban mostram 0 itens.
- **Erro crítico** persiste no console ao renderizar.
- **Falha no save**: Clicar em "Salvar Card" no modal do Kanban não fecha o modal. Após recarregar, o card não persiste. O processo de save é interrompido pelo erro de JS.

## Hipótese

O erro ocorre porque algum elemento do array de hábitos ou de dados do dia está `undefined` na linha 109 do `planner-view.js`. O save do Kanban depende de `renderPlanner()` que também falha pelo mesmo motivo.

## Screenshot capturado

`planner_error_screen_1775166815070.png`
