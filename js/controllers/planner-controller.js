import { DB } from '../database.js';
import { getPlannerHTML } from '../views/planner-view.js';

export async function renderPlanner() {
    const root = document.getElementById('planner-root');
    const kanbanData = await DB.getKanbanData();
    
    // Mock metrics & history data that mimics Daily Log schema for MVP UI
    const metrics = { perfectDays: 12, avgSleep: 'bom', avgMood: 'produtivo' };
    const historyDays = [
        { date: 'Qua, 15', pct: 80, mood: 'produtivo', sleep: 'bom', water: 2.0, telas: 1.5, habits: [{name:'Academia', done:true}, {name:'Leitura', done:false}, {name:'DIO', done:true}] },
        { date: 'Ter, 14', pct: 100, mood: 'feliz', sleep: 'ruim', water: 1.0, telas: 3.5, habits: [{name:'Academia', done:true}, {name:'Leitura', done:true}, {name:'DIO', done:true}] },
        { date: 'Seg, 13', pct: 40, mood: 'cansado', sleep: 'mais_ou_menos', water: 1.5, telas: 2.0, habits: [{name:'Academia', done:false}, {name:'Leitura', done:false}, {name:'DIO', done:false}] }
    ];

    // Inject HTML
    root.innerHTML = getPlannerHTML({ historyDays, metrics, kanbanData });

    // Initialize JavaScript interactive logic
    initAccordionEvents();
    initKanbanDragAndDrop();
}

/**
 * Handles the expansion logic for the "Diário de Bordo" table rows
 */
function initAccordionEvents() {
    const rows = document.querySelectorAll('.accordeon-row');
    rows.forEach(row => {
        row.addEventListener('click', (e) => {
             // Block click if it was an internal button (like edit)
             if (e.target.tagName.toLowerCase() === 'button') return;

             const details = row.querySelector('.accordeon-details');
             if(details.classList.contains('hidden')) {
                 details.classList.remove('hidden');
                 row.classList.add('bg-surface-highest'); // highlight active row
             } else {
                 details.classList.add('hidden');
                 row.classList.remove('bg-surface-highest');
             }
        });
    });
}

/**
 * Handles HTML5 drag and drop events for the Kanban board
 */
function initKanbanDragAndDrop() {
    let draggedItem = null;
    
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');

    cards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => this.classList.add('opacity-30', 'scale-95'), 0);
        });
        
        card.addEventListener('dragend', function() {
            setTimeout(() => {
                this.classList.remove('opacity-30', 'scale-95');
                draggedItem = null;
            }, 0);
        });
    });

    columns.forEach(col => {
        col.addEventListener('dragover', function(e) {
            e.preventDefault(); // necessary to allow 'drop'
        });
        
        col.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.classList.add('border-primary/50', 'bg-white/5');
            this.classList.remove('border-white/5');
        });
        
        col.addEventListener('dragleave', function() {
            this.classList.remove('border-primary/50', 'bg-white/5');
            this.classList.add('border-white/5');
        });
        
        col.addEventListener('drop', async function() {
            this.classList.remove('border-primary/50', 'bg-white/5');
            this.classList.add('border-white/5');
            
            if (draggedItem) {
                // If dropping into empty message, clear it
                const emptyMsg = this.querySelector('p');
                if (emptyMsg) emptyMsg.remove();
                
                this.appendChild(draggedItem);
                
                // Real DB save logic for MVP:
                /*
                const itemId = draggedItem.dataset.id;
                const newColId = this.dataset.col; // 'ideas', 'doing', 'done'
                // call DB logic...
                */
            }
        });
    });
}
