# MVP Equilíbrio Produtivo

Construir a versão MVP do aplicativo web progressivo (PWA) "Equilíbrio Produtivo" com base no design "soft dark" da pasta `stitch` e nos requisitos do `Prompt Base.txt`. A interface usará CSS puramente customizável (variáveis) em conjunto com Tailwind CDN para utilitários, e o JavaScript será vanilla e estritamente modular. 

## User Review Required

> [!NOTE]
> Nova estrutura visual desenhada para a aba "Planner" (antiga "Mensal"). Incluí o Heatmap de dias ("choque" visual de consistência), a Tabela "Diário de Bordo" condensada em estilo de acordeão e o Kanban com rolagem horizontal e suporte a "Drag and Drop".
> Todo o design puxará a matriz estética já programada do Dashboard! Por favor verifique o plano. Com sua aprovação avançaremos para a codificação desta interface.

## Mapeamento de Dados (Schema do Daily Log)

Cada dia no banco de dados (`todayLog` / `history`) agora terá a seguinte estrutura robusta:

\`\`\`json
{
  "date": "2026-03-31",            // Data em formato ISO
  "dayOfWeek": "Terça-feira",      // Dia da semana calculado
  "completedProgress": 0.85,       // Progresso da barrinha (0 a 1)
  
  // Qualitativos
  "mood": "produtivo",             // enum: "feliz", "triste", "produtivo", "normal", "cansado"
  "sleep": "bom",                  // enum: "ruim", "bom", "mais_ou_menos"
  
  // Quantitativos
  "wakeUpTime": "06:30",           // Tempo (HH:mm)
  "waterLiters": 2.0,              // 1.0, 1.5, 2.0 (💧 = 1L)
  "instagramHours": "01:30",       // Minutos ou string (HH:mm)
  
  // Finanças Acopladas
  "spendDaily": 25.50,             // Gasto dia a dia do dia
  "spendMoney": 0.00,              // Gasto meu dinheiro do dia
  "earnDaily": 0.00,               // Ganho dia a dia
  "earnMoney": 150.00,             // Ganho meu dinheiro
  
  // Array Fixo de Hábitos Diários (Boolean)
  "habits": {
    "wakeup_early": true,          // Acordar cedo
    "gym": true,                   // Academia
    "breakfast": true,             // Café da manhã
    "lunch": true,                 // Almoço
    "study_dio": true,             // Estudos DIO
    "reading": false,              // Leitura
    "dinner": true,                // Janta
    "fill_notion": false           // Preencher notion
  }
}
\`\`\`

## Mapeamento de Dados (Schema do Módulo de Aprendizado)

Cada item (Curso ou Livro) persistido no `DB.getLearningData()` terá a seguinte estrutura robusta:

\`\`\`json
{
  "id": "171092837192",          // Timestamp ID único
  "icon": "🎓",                  // Emoji selecionado pelo usuário
  "type": "course",              // enum: "book" ou "course"
  "title": "UI Design Avançado", // Título da Obra/Curso
  "author": "Figma Master",      // Autor ou Instrutor
  "status": "in_progress",       // enum: "to_do" (Iniciar), "in_progress" (Em andamento), "done" (Concluído)
  "rating": 5,                   // Nota (1 a 5, ex: ⭐⭐⭐⭐⭐)
  "totalPages": 50,              // Total de páginas ou aulas
  "currentPage": 12,             // Página ou aula atual
  "progressPct": 24,             // % Calculado automaticamente ((current/total)*100)
  "genre": "Technology",         // Gênero opcional
  "startDate": "2026-03-01",     // Data de início (YYYY-MM-DD)
  "endDate": "",                 // Data de término opcional (YYYY-MM-DD)
  "review": "Muito bom!"         // Opinião pessoal livre sobre a obra/curso
}
\`\`\`

## Proposed Changes

### Estrutura do PWA e Configuração Base

#### [NEW] index.html
Arquivo principal contendo a Bottom Navigation Bar com as 4 abas, os containers para cada aba e os links para fontes (Plus Jakarta Sans/Inter) e ícones (Material Symbols Outlined).

#### [NEW] css/style.css
Definição das variáveis no `:root` (como `--accent-color`), classes base, reset e utilitários da interface "glass-card" e dark-mode.

#### [NEW] manifest.json e sw.js
Arquivos obrigatórios para que a aplicação seja instalável como um Progressive Web App e tenha capacidade básica offline.

### Módulos JavaScript (Arquitetura)

#### [NEW] js/app.js
Gerenciador central: cuida da lógica da Bottom Navigation Bar (esconder/mostrar abas) e inicialização dos demais submódulos.

#### [NEW] js/database.js
Gerenciador de dados (MVP no `localStorage`); expõe métodos como `saveDailyLog`, `getFinances`, `saveSettings`, etc., imitando a estrutura em árvore proposta no prompt.

### Telas (Abas)

#### [MODIFY] js/views/dashboard-view.js e js/controllers/dashboard-controller.js
O sanfona atual do "Check-in de Hoje" virará um botão largo que abre um Modal/Popup de tela inteira ("Formulário de Check-in"). Esse modal processará todo o esquema de dados acima e refletirá no progresso.

#### [DELETE] js/ui-monthly.js e [NEW] js/views/planner-view.js / js/controllers/planner-controller.js (Aba 2: Planner)
Exatamente para manter a nova arquitetura MVC limpa iniciada no Dashboard, o antigo arquivo `ui-monthly.js` será deletado. Suas responsabilidades migrarão para a \`View\` (componentes e marcação HTML do Heatmap/Sanfona/Kanban) e longo para o \`Controller\` (lógica de Drag'n'Drop, expansão da sanfona e eventos).
O novo layout será desenhado usando a identidade visual "glass-card" já solidificada, dividida da seguinte forma:
1. **O Topo (Resumo do Mês - Fator Consistência)**: 
   - **Calendário Grade Heatmap**: Substituição dos blocos soltos por um grid clássico mensal contendo os cabeçalhos dos dias da semana (D, S, T, Q, Q, S, S). Os quadradinhos terão 4 níveis exatos de intensidade: Nível 0 (vazio/apagado), Nível 1 (cor bem fraca/quase inativo), Nível 2 (cor média/mais ou menos) e Nível 3 (brilho resplandecente 100%).
   - **Métricas Acopladas**: Painel inferior colado ao calendário contendo: 'Dias Perfeitos', 'Média de Sono' e 'Média de Humor' (estes dois últimos reutilizando o exato design dos *chips/botões* de seleção do check-in original para familiaridade, ex: botão "Bom", botão "Produtivo"), e por fim duas novas métricas totalizadoras em R$: 'Gasto Dia a Dia' e 'Gasto Meu Dinheiro'.
2. **O Meio (Diário de Bordo)**: Lista condensada de linhas que representam o seu histórico em formato "accordeon" (sanfona). Visão Fechada mostra "Qua, 15", barrinha fininha de progresso e dois emojis curtos das métricas qualitativas. Visão Aberta expande para mostrar checagens verdes/vermelhas, Água consumida, bloqueio do Instagram e o botão \`Editar\`.
3. **A Base (Kanban Cérebro)**: Slider com deslizamento horizontal minimalista contendo as colunas "A Fazer (Ideias)", "Em Progresso" e "Concluído". Uso da API de HTML5 nativa ou biblioteca ultra leve para executar o Drag'n'Drop dos cards entre as colunas na interface em tempo real.

#### [NEW] js/ui-finances.js (Aba 3: Financeiro)
Visualização e inclusão rápida de transações (receitas/despesas). Mock da visão futura baseada nos registros do `database.js`.

#### [NEW] js/ui-settings.js (Aba 4: Configurações)
Lógica para permitir ao usuário mudar a `--accent-color` dinamicamente com salvamento nas configurações via `database.js`.

## Verification Plan

### Manual Verification
1. Abrir o `index.html` em um navegador moderno (ou pelo celular via localhost/deploy provisório).
2. Navegar entre as 4 abas e verificar a fluidez do Tailwind/CSS puro.
3. Testar a mudança de cor de destaque na aba "Configurações" e ver todas as telas se atualizarem.
4. Adicionar um hábito no "Resumo", checar o console para garantir que salvou no database (localStorage).
5. Visualizar o console no Chrome DevTools na aba Application -> Manifest e Service Workers para garantir os requisitos de PWA.
