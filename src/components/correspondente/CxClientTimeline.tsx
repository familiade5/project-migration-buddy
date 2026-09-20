import { CxClientEvent } from '@/hooks/useCxClientEvents';
import { FileText, History, UserPlus, PencilLine, Flag } from 'lucide-react';

const ICONS: Record<string, typeof FileText> = {
  documento: FileText,
  cliente: UserPlus,
  status: Flag,
  nota: PencilLine,
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export function CxClientTimeline({ events }: { events: CxClientEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
        <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600">Nenhum histórico ainda</p>
        <p className="text-xs text-slate-400 mt-1">
          Tudo que for feito com este cliente aparece aqui em ordem.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative pl-6">
      <span className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" aria-hidden />
      {events.map((e) => {
        const Icon = ICONS[e.kind] || PencilLine;
        return (
          <li key={e.id} className="relative pb-5 last:pb-0">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-[#1a3a6b] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a6b]" />
            </span>
            <div className="bg-white rounded-xl border border-slate-200 p-3">
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 text-[#1a3a6b] mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                  {e.description && (
                    <p className="text-xs text-slate-600 mt-0.5 break-words">{e.description}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {fmt(e.created_at)}
                    {e.actor_name ? ` • ${e.actor_name}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
