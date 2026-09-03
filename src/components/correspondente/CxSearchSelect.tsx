import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

export interface CxSearchOption {
  value: string;
  label: string;
  hint?: string;
}

interface Props {
  options: CxSearchOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearLabel?: string;
  triggerClassName?: string;
}

export function CxSearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecionar',
  searchPlaceholder = 'Buscar pelo nome…',
  emptyText = 'Nada encontrado',
  clearLabel,
  triggerClassName = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between bg-white border-slate-200 text-slate-900 font-normal hover:bg-slate-50 ${triggerClassName}`}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className={`truncate ${selected ? 'text-slate-900' : 'text-slate-400'}`}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0 bg-white border-slate-200 w-[var(--radix-popover-trigger-width)] min-w-[260px]"
      >
        <Command className="bg-white">
          <CommandInput placeholder={searchPlaceholder} className="text-slate-900" />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-slate-500">{emptyText}</CommandEmpty>
            <CommandGroup>
              {clearLabel && (
                <CommandItem
                  value={clearLabel}
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                  className="text-slate-600"
                >
                  {clearLabel}
                </CommandItem>
              )}
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={`${o.label} ${o.hint || ''}`}
                  onSelect={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="text-slate-900"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${o.value === value ? 'opacity-100 text-[#1a3a6b]' : 'opacity-0'}`}
                  />
                  <span className="min-w-0">
                    <span className="block truncate">{o.label}</span>
                    {o.hint && <span className="block text-[11px] text-slate-400 truncate">{o.hint}</span>}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
