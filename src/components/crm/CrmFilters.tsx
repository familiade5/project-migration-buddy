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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por código, endereço..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Stage Filter */}
      <Select value={selectedStage} onValueChange={onStageChange as any}>
        <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-700">
          <Filter className="w-4 h-4 mr-2 text-gray-400" />
          <SelectValue placeholder="Filtrar etapa" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200">
          <SelectItem
            value="all"
            className="text-gray-700 focus:bg-gray-100 focus:text-gray-900"
          >
            Todas as etapas
          </SelectItem>
          {STAGE_ORDER.map((stage) => (
            <SelectItem
              key={stage}
              value={stage}
              className="text-gray-700 focus:bg-gray-100 focus:text-gray-900"
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
        <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-700">
          <SelectValue placeholder="Filtrar corretor" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200">
          <SelectItem
            value="all"
            className="text-gray-700 focus:bg-gray-100 focus:text-gray-900"
          >
            Todos os corretores
          </SelectItem>
          {users.map((user) => (
            <SelectItem
              key={user.id}
              value={user.id}
              className="text-gray-700 focus:bg-gray-100 focus:text-gray-900"
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
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
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
        className="bg-gray-900 text-white hover:bg-gray-800"
      >
        <Plus className="w-4 h-4 mr-2" />
        Novo Imóvel
      </Button>
    </div>
  );
}
