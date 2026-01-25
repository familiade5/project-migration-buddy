import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Plus } from 'lucide-react';
import { PropertyStage, STAGE_CONFIG, STAGE_ORDER } from '@/types/crm';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface Profile {
  id: string;
  full_name: string;
}

interface CrmFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStage: PropertyStage | 'all';
  onStageChange: (stage: PropertyStage | 'all') => void;
  selectedUser: string;
  onUserChange: (userId: string) => void;
  onAddProperty: () => void;
}

export function CrmFilters({
  searchQuery,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedUser,
  onUserChange,
  onAddProperty,
}: CrmFiltersProps) {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const hasFilters = searchQuery || selectedStage !== 'all' || selectedUser;

  const clearFilters = () => {
    onSearchChange('');
    onStageChange('all');
    onUserChange('');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
        <Input
          placeholder="Buscar por código, endereço..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-[#0d0d0d] border-[#1a1a1a] text-[#e0e0e0] placeholder:text-[#555]"
        />
      </div>

      {/* Stage Filter */}
      <Select value={selectedStage} onValueChange={onStageChange as any}>
        <SelectTrigger className="w-[180px] bg-[#0d0d0d] border-[#1a1a1a] text-[#e0e0e0]">
          <Filter className="w-4 h-4 mr-2 text-[#555]" />
          <SelectValue placeholder="Filtrar etapa" />
        </SelectTrigger>
        <SelectContent className="bg-[#0d0d0d] border-[#1a1a1a]">
          <SelectItem
            value="all"
            className="text-[#e0e0e0] focus:bg-[#1a1a1a] focus:text-[#e0e0e0]"
          >
            Todas as etapas
          </SelectItem>
          {STAGE_ORDER.map((stage) => (
            <SelectItem
              key={stage}
              value={stage}
              className="text-[#e0e0e0] focus:bg-[#1a1a1a] focus:text-[#e0e0e0]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STAGE_CONFIG[stage].color }}
                />
                {STAGE_CONFIG[stage].label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* User Filter */}
      <Select value={selectedUser} onValueChange={onUserChange}>
        <SelectTrigger className="w-[180px] bg-[#0d0d0d] border-[#1a1a1a] text-[#e0e0e0]">
          <SelectValue placeholder="Filtrar corretor" />
        </SelectTrigger>
        <SelectContent className="bg-[#0d0d0d] border-[#1a1a1a]">
          <SelectItem
            value="all"
            className="text-[#e0e0e0] focus:bg-[#1a1a1a] focus:text-[#e0e0e0]"
          >
            Todos os corretores
          </SelectItem>
          {users.map((user) => (
            <SelectItem
              key={user.id}
              value={user.id}
              className="text-[#e0e0e0] focus:bg-[#1a1a1a] focus:text-[#e0e0e0]"
            >
              {user.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-[#888] hover:text-[#e0e0e0] hover:bg-[#1a1a1a]"
        >
          <X className="w-4 h-4 mr-1" />
          Limpar
        </Button>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Add Property Button */}
      <Button
        onClick={onAddProperty}
        className="bg-[#3b82f6] text-white hover:bg-[#2563eb]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Novo Imóvel
      </Button>
    </div>
  );
}
