import { ChecklistItem } from "@/types";

interface ChecklistModalProps {
  checklist: ChecklistItem[];
  onAdd: (title: string) => void;
  onToggle: (id: string, is_completed: boolean) => void;
  onDelete: (id: string) => void;
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
          placeholder="Add a new task... (press Enter)"
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 pl-11 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium" 
        />
        <i className="fa-solid fa-plus absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
      </div>

      <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto pr-2">
        {checklist.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-medium">
            <i className="fa-solid fa-clipboard-check text-4xl mb-3 text-slate-300 block"></i>
            Your checklist is empty. Add items above to start preparing!
          </div>
        ) : (
          checklist.map(item => (
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
          ))
        )}
      </div>
    </div>
  );
}
