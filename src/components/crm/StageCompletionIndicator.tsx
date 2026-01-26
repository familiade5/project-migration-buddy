import { PropertyCompletionStatus } from '@/types/stageCompletion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StageCompletionIndicatorProps {
  status: PropertyCompletionStatus | null;
  variant?: 'minimal' | 'full';
}

export function StageCompletionIndicator({
  status,
  variant = 'minimal',
}: StageCompletionIndicatorProps) {
  if (!status) return null;

  // Only show indicator for incomplete critical stages
  if (status.isComplete) {
    if (variant === 'full' && status.isCriticalStage) {
      return (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">Etapa completa</span>
        </div>
      );
    }
    return null;
  }

  if (!status.isCriticalStage) return null;

  if (variant === 'minimal') {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 border border-amber-200 cursor-help">
              <AlertCircle className="w-3 h-3 text-amber-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-gray-900 text-gray-100 border-gray-700 max-w-[200px]"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-amber-400">Etapa incompleta</p>
              <ul className="text-[10px] text-gray-400 space-y-0.5">
                {status.missingItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Full variant - shows complete list
  return (
    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium text-amber-700">
          Etapa incompleta ({status.completionPercentage}%)
        </span>
      </div>
      <div className="space-y-1.5">
        {status.missingItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[11px] text-amber-600">
            <div className="w-3.5 h-3.5 rounded-full border border-amber-300 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-amber-400" />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
        {status.completedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[11px] text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
