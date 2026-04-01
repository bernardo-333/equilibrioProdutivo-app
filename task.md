# Roadmap: Equilíbrio Produtivo MVP

## Fase 1: Interface, UX e Funções Básicas (Front-end)
- [x] Bootstrapping Base (HTML, Tailwind CSS Variáveis, App.js).
- [x] Aba Configurações: Tema `Soft Dark` com persistência de Cor Destaque (`--accent-color`).
- [x] Aba Visão Geral (Resumo): 
  - [x] Interface Responsiva Glass-card.
  - [x] Smart Scroll Header (Data/Nome).
  - [x] Weekly Snap gamificado e Pop-up de Finanças Simples.
  - [x] Refatoração para Padrão Vanilla MVC (Componentizado).
- [x] Formulário Interativo do Check-in:
  - [x] Transformar botão vazio "Check-in de Hoje" em Modal Fullscreen de Abertura inferior.
  - [x] Layout e Inputs: Controles de Água, Selects de Qualitativo por Ícones, Inputs de tempo.
  - [x] UI de Checkboxes sofisticados para os Oito Hábitos (Academia, DIO, etc).
  - [x] Inputs Acoplados (Ganhos/Gastos Dinheiro e Dia a Dia).
- [x] Aba Planner (Antiga Mensal):
  - [x] Topo: Heatmap (Grid tipo Github de Consistência) e Cards Rápidos de Métricas Pessoais (Perfeitos, Sono, Humor).
  - [x] Meio: Tabela Diário de Bordo (Cards finos tipo sanfona contendo resumo horizontal e expansão para os 8 hábitos, água e botão editar).
  - [x] Base: Kanban Base (Carrossel Horizontal interativo e suporte nativo a arrastar-e-soltar / drag and drop).
- [ ] Aba Financeiro: Rascunho das Listas de Entradas/Saídas Históricas.
- [x] Módulo Biblioteca (Continuar de Onde Parou):
  - [x] UI: Modal de Listagem da Biblioteca (Meus Cursos e Livros).
  - [x] UI: Sub-Modal "Criar Nova Obra" com Formulário (Emoji, Tipo, Rating, Páginas, Opinião, etc).
  - [ ] UI: Atualizar o Carousel do Dashboard para renderizar os cards baseados nos dados em andamento.

## Fase 2: Lógica Interna e Processamento (Back-end Web)
- [ ] Salvar Formulário massivo do "Daily Log" de forma inteligente e compacta via `localStorage`.
- [ ] Lógica de Finanças: Calcular saldos cruzados do check-in.
- [ ] CRUD Biblioteca: Criar, Editar, Listar e Deletar Livros/Cursos salvando via `database.js`.

## Fase 3: Conexão Cloud (Google Firebase)
- [ ] Criação de Projeto Firebase (Auth, Firestore).
- [ ] Refatorar os "mocks" de `database.js` acionando as APIs Reais da Nuvem.
- [ ] Implementar Offline First (Service Workers Cacheando o Firebase Auth).
- [ ] Tela de Login/Cadastro.

## Fase 4: Acabamento, Polimento e Deploy
- [ ] Tratamentos Globais de Erro.
- [ ] Polimento de Micro-animações nativas, transições Mobile.
- [ ] Manifest.json (Ícones Home Screen atualizados, Splash Screen).
- [ ] Validação como App Nativo em Deploy.
