/* eslint-disable react-hooks/incompatible-library, @typescript-eslint/no-explicit-any */
import { ChecklistItem } from "@/types";
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface ChecklistModalProps {
  checklist: ChecklistItem[];
  onAdd: (title: string) => void;
  onToggle: (id: string, is_completed: boolean) => void;
  onDelete: (id: string) => void;
}

function VirtualChecklist({ checklist, onToggle, onDelete }: { checklist: ChecklistItem[], onToggle: any, onDelete: any }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: checklist.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 58,
  });

  return (
    <div ref={parentRef} className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto pr-2">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = checklist[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="pb-2"
            >
              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-colors group h-full">
                <button onClick={() => onToggle(item.id, !item.is_completed)} className="flex items-center gap-3 flex-1 text-left h-full">
                  {item.is_completed ? (
                    <i className="fa-solid fa-circle-check text-emerald-500 text-xl shrink-0"></i>
                  ) : (
                    <i className="fa-regular fa-circle text-slate-300 hover:text-indigo-400 text-xl shrink-0 transition-colors"></i>
                  )}
                  <span className={`font-semibold ${item.is_completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.title}
                  </span>
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChecklistModal({ checklist, onAdd, onToggle, onDelete }: ChecklistModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      onAdd(e.currentTarget.value.trim());
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Ajouter une nouvelle tâche... (Appuyez sur Entrée)"
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium" 
        />
        <i className="fa-solid fa-plus absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
      </div>

      {checklist.length === 0 ? (
        <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto pr-2">
          <div className="text-center py-8 text-slate-500 font-medium">
            <i className="fa-solid fa-clipboard-check text-4xl mb-3 text-slate-300 block"></i>
            Votre checklist est vide. Ajoutez des éléments ci-dessus pour commencer à vous préparer !
          </div>
        </div>
      ) : checklist.length > 50 ? (
        <VirtualChecklist checklist={checklist} onToggle={onToggle} onDelete={onDelete} />
      ) : (
        <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto pr-2">
          {checklist.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-colors group">
              <button onClick={() => onToggle(item.id, !item.is_completed)} className="flex items-center gap-3 flex-1 text-left">
                {item.is_completed ? (
                  <i className="fa-solid fa-circle-check text-emerald-500 text-xl shrink-0"></i>
                ) : (
                  <i className="fa-regular fa-circle text-slate-300 hover:text-indigo-400 text-xl shrink-0 transition-colors"></i>
                )}
                <span className={`font-semibold ${item.is_completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.title}
                </span>
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
