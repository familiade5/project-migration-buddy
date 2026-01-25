import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2, Plus, Trash2, Edit2, Check, X, Star, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BrokerManagement } from '@/components/imobiliaria/BrokerManagement';

interface Agency {
  id: string;
  name: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
}

interface Creci {
  id: string;
  agency_id: string;
  creci_number: string;
  state: string;
  name: string | null;
  is_default: boolean;
  is_active: boolean;
}

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const Imobiliaria = () => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [crecis, setCrecis] = useState<Creci[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCreci, setIsAddingCreci] = useState(false);
  const [editingAgency, setEditingAgency] = useState(false);
  
  // Form states for new CRECI
  const [newCreci, setNewCreci] = useState({ creci_number: '', state: 'MS', name: '' });
  
  // Form states for agency
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    website: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('real_estate_agency')
        .select('*')
        .limit(1)
        .single();
      
      if (agencyError && agencyError.code !== 'PGRST116') throw agencyError;
      
      if (agencyData) {
        setAgency(agencyData);
        setAgencyForm({
          name: agencyData.name || '',
          phone: agencyData.phone || '',
          email: agencyData.email || '',
          address: agencyData.address || '',
          website: agencyData.website || ''
        });
      }
      
      // Fetch CRECIs
      const { data: crecisData, error: crecisError } = await supabase
        .from('crecis')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (crecisError) throw crecisError;
      setCrecis(crecisData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAgency = async () => {
    if (!agency) return;
    
    try {
      const { error } = await supabase
        .from('real_estate_agency')
        .update(agencyForm)
        .eq('id', agency.id);
      
      if (error) throw error;
      
      setAgency({ ...agency, ...agencyForm });
      setEditingAgency(false);
      toast.success('Dados da imobiliária atualizados!');
    } catch (error) {
      console.error('Error updating agency:', error);
      toast.error('Erro ao atualizar dados');
    }
  };

  const handleAddCreci = async () => {
    if (!agency || !newCreci.creci_number) {
      toast.error('Preencha o número do CRECI');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('crecis')
        .insert({
          agency_id: agency.id,
          creci_number: newCreci.creci_number,
          state: newCreci.state,
          name: newCreci.name || null,
          is_default: crecis.length === 0
        });
      
      if (error) throw error;
      
      setNewCreci({ creci_number: '', state: 'MS', name: '' });
      setIsAddingCreci(false);
      fetchData();
      toast.success('CRECI adicionado com sucesso!');
    } catch (error: any) {
      console.error('Error adding CRECI:', error);
      if (error.code === '23505') {
        toast.error('Este CRECI já está cadastrado');
      } else {
        toast.error('Erro ao adicionar CRECI');
      }
    }
  };

  const handleDeleteCreci = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crecis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchData();
      toast.success('CRECI removido');
    } catch (error) {
      console.error('Error deleting CRECI:', error);
      toast.error('Erro ao remover CRECI');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!agency) return;
    
    try {
      // First, unset all defaults
      await supabase
        .from('crecis')
        .update({ is_default: false })
        .eq('agency_id', agency.id);
      
      // Then set the new default
      const { error } = await supabase
        .from('crecis')
        .update({ is_default: true })
        .eq('id', id);
      
      if (error) throw error;
      
      fetchData();
      toast.success('CRECI padrão definido');
    } catch (error) {
      console.error('Error setting default CRECI:', error);
      toast.error('Erro ao definir CRECI padrão');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gold/20">
            <Building2 className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Imobiliária</h1>
            <p className="text-sm text-muted-foreground">Gerencie dados da imobiliária, CRECIs e corretores</p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="agency" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agency" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="crecis" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              CRECIs
            </TabsTrigger>
            <TabsTrigger value="brokers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Corretores
            </TabsTrigger>
          </TabsList>

          {/* Agency Tab */}
          <TabsContent value="agency" className="mt-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Dados da Imobiliária
                </CardTitle>
                {!editingAgency ? (
                  <Button variant="outline" size="sm" onClick={() => setEditingAgency(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingAgency(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-gold hover:bg-gold-dark" onClick={handleSaveAgency}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {editingAgency ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nome da Imobiliária</Label>
                      <Input
                        value={agencyForm.name}
                        onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                        className="input-premium mt-1"
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={agencyForm.phone}
                        onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                        className="input-premium mt-1"
                      />
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <Input
                        value={agencyForm.email}
                        onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                        className="input-premium mt-1"
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={agencyForm.website}
                        onChange={(e) => setAgencyForm({ ...agencyForm, website: e.target.value })}
                        className="input-premium mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Endereço</Label>
                      <Input
                        value={agencyForm.address}
                        onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                        className="input-premium mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Nome</p>
                      <p className="text-foreground font-medium">{agency?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{agency?.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">E-mail</p>
                      <p className="text-foreground">{agency?.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Website</p>
                      <p className="text-foreground">{agency?.website || '-'}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground">Endereço</p>
                      <p className="text-foreground">{agency?.address || '-'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CRECIs Tab */}
          <TabsContent value="crecis" className="mt-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gold">CRECIs Cadastrados</CardTitle>
                <Dialog open={isAddingCreci} onOpenChange={setIsAddingCreci}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gold hover:bg-gold-dark">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle>Adicionar CRECI</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Número do CRECI</Label>
                        <Input
                          placeholder="Ex: CRECI 14851"
                          value={newCreci.creci_number}
                          onChange={(e) => setNewCreci({ ...newCreci, creci_number: e.target.value })}
                          className="input-premium mt-1"
                        />
                      </div>
                      <div>
                        <Label>Estado</Label>
                        <Select 
                          value={newCreci.state} 
                          onValueChange={(v) => setNewCreci({ ...newCreci, state: v })}
                        >
                          <SelectTrigger className="input-premium mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card">
                            {states.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nome/Descrição (opcional)</Label>
                        <Input
                          placeholder="Ex: PJ, João Silva"
                          value={newCreci.name}
                          onChange={(e) => setNewCreci({ ...newCreci, name: e.target.value })}
                          className="input-premium mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingCreci(false)}>Cancelar</Button>
                      <Button className="bg-gold hover:bg-gold-dark" onClick={handleAddCreci}>Adicionar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {crecis.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum CRECI cadastrado</p>
                ) : (
                  <div className="space-y-2">
                    {crecis.map((creci) => (
                      <div 
                        key={creci.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          creci.is_default ? 'bg-gold/10 border border-gold/30' : 'bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {creci.is_default && (
                            <Star className="w-4 h-4 text-gold fill-gold" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">
                              {creci.creci_number} {creci.state}
                              {creci.name && <span className="text-muted-foreground ml-2">({creci.name})</span>}
                            </p>
                            {creci.is_default && (
                              <p className="text-xs text-gold">CRECI Padrão</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!creci.is_default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(creci.id)}
                              className="text-muted-foreground hover:text-gold"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCreci(creci.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brokers Tab */}
          <TabsContent value="brokers" className="mt-6">
            <BrokerManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Imobiliaria;
