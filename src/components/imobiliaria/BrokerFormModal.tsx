import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, User, Briefcase, Target, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrokerProfile {
  id: string;
  user_id: string | null;
  agency_id: string | null;
  commission_percentage: number;
  hired_at: string | null;
  status: 'active' | 'inactive' | 'pending';
  resume_url: string | null;
  contract_url: string | null;
  photo_url: string | null;
  creci_number: string | null;
  creci_state: string | null;
  specializations: string[] | null;
  profile?: {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string | null;
  };
  questionnaire?: any;
}

interface BrokerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: BrokerProfile | null;
}

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const specializationOptions = [
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
  { value: 'luxury', label: 'Alto Padrão' },
  { value: 'rental', label: 'Locação' },
];

export function BrokerFormModal({ isOpen, onClose, broker }: BrokerFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!broker;

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    commission_percentage: 3,
    status: 'pending' as 'active' | 'inactive' | 'pending',
    hired_at: '',
    creci_number: '',
    creci_state: 'MS',
    specializations: [] as string[],
  });

  // Questionnaire state
  const [questionnaire, setQuestionnaire] = useState({
    motivation: '',
    experience_years: 0,
    previous_experience: '',
    career_goals: '',
    monthly_sales_goal: 0,
    availability: '',
    strengths: '',
    improvement_areas: '',
    referral_source: '',
    additional_notes: '',
  });

  // File uploads
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch users for selection
  const { data: users = [] } = useQuery({
    queryKey: ['users-for-broker'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch agency
  const { data: agency } = useQuery({
    queryKey: ['agency-for-broker'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('real_estate_agency')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Load broker data when editing
  useEffect(() => {
    if (broker) {
      setFormData({
        user_id: broker.user_id || '',
        commission_percentage: broker.commission_percentage || 3,
        status: broker.status || 'pending',
        hired_at: broker.hired_at || '',
        creci_number: broker.creci_number || '',
        creci_state: broker.creci_state || 'MS',
        specializations: broker.specializations || [],
      });

      if (broker.questionnaire) {
        setQuestionnaire({
          motivation: broker.questionnaire.motivation || '',
          experience_years: broker.questionnaire.experience_years || 0,
          previous_experience: broker.questionnaire.previous_experience || '',
          career_goals: broker.questionnaire.career_goals || '',
          monthly_sales_goal: broker.questionnaire.monthly_sales_goal || 0,
          availability: broker.questionnaire.availability || '',
          strengths: broker.questionnaire.strengths || '',
          improvement_areas: broker.questionnaire.improvement_areas || '',
          referral_source: broker.questionnaire.referral_source || '',
          additional_notes: broker.questionnaire.additional_notes || '',
        });
      }
    } else {
      // Reset form for new broker
      setFormData({
        user_id: '',
        commission_percentage: 3,
        status: 'pending',
        hired_at: '',
        creci_number: '',
        creci_state: 'MS',
        specializations: [],
      });
      setQuestionnaire({
        motivation: '',
        experience_years: 0,
        previous_experience: '',
        career_goals: '',
        monthly_sales_goal: 0,
        availability: '',
        strengths: '',
        improvement_areas: '',
        referral_source: '',
        additional_notes: '',
      });
      setResumeFile(null);
    }
  }, [broker, isOpen]);

  // Upload file to storage
  const uploadFile = async (file: File, brokerId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${brokerId}/resume_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('broker-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('broker-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      
      let resumeUrl = broker?.resume_url || null;

      // Create or update broker profile
      const brokerData = {
        user_id: formData.user_id || null,
        agency_id: agency?.id || null,
        commission_percentage: formData.commission_percentage,
        status: formData.status,
        hired_at: formData.hired_at || null,
        creci_number: formData.creci_number || null,
        creci_state: formData.creci_state || 'MS',
        specializations: formData.specializations.length > 0 ? formData.specializations : null,
        resume_url: resumeUrl,
      };

      let brokerId = broker?.id;

      if (isEditing) {
        const { error } = await supabase
          .from('broker_profiles')
          .update(brokerData)
          .eq('id', broker.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('broker_profiles')
          .insert(brokerData)
          .select()
          .single();
        if (error) throw error;
        brokerId = data.id;
      }

      // Upload resume if provided
      if (resumeFile && brokerId) {
        const uploadedUrl = await uploadFile(resumeFile, brokerId);
        if (uploadedUrl) {
          await supabase
            .from('broker_profiles')
            .update({ resume_url: uploadedUrl })
            .eq('id', brokerId);
        }
      }

      // Save questionnaire
      if (brokerId) {
        const questionnaireData = {
          broker_id: brokerId,
          ...questionnaire,
        };

        // Check if questionnaire exists
        const { data: existingQ } = await supabase
          .from('broker_questionnaire')
          .select('id')
          .eq('broker_id', brokerId)
          .maybeSingle();

        if (existingQ) {
          const { error } = await supabase
            .from('broker_questionnaire')
            .update(questionnaire)
            .eq('id', existingQ.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('broker_questionnaire')
            .insert(questionnaireData);
          if (error) throw error;
        }
      }

      setIsUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broker-profiles'] });
      toast.success(isEditing ? 'Corretor atualizado!' : 'Corretor cadastrado!');
      onClose();
    },
    onError: (error) => {
      console.error('Error saving broker:', error);
      toast.error('Erro ao salvar corretor');
      setIsUploading(false);
    },
  });

  const toggleSpecialization = (value: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(value)
        ? prev.specializations.filter(s => s !== value)
        : [...prev.specializations, value],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold flex items-center gap-2">
            <User className="w-5 h-5" />
            {isEditing ? 'Editar Corretor' : 'Cadastrar Novo Corretor'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="questionnaire" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Questionário
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documentos
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Usuário Vinculado</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={(v) => setFormData({ ...formData, user_id: v })}
                >
                  <SelectTrigger className="input-premium mt-1">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                >
                  <SelectTrigger className="input-premium mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Comissão (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.commission_percentage}
                  onChange={(e) => setFormData({ ...formData, commission_percentage: parseFloat(e.target.value) || 0 })}
                  className="input-premium mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Porcentagem que o corretor recebe sobre o valor da venda
                </p>
              </div>

              <div>
                <Label>Data de Contratação</Label>
                <Input
                  type="date"
                  value={formData.hired_at}
                  onChange={(e) => setFormData({ ...formData, hired_at: e.target.value })}
                  className="input-premium mt-1"
                />
              </div>

              <div>
                <Label>Número do CRECI</Label>
                <Input
                  placeholder="Ex: 14851"
                  value={formData.creci_number}
                  onChange={(e) => setFormData({ ...formData, creci_number: e.target.value })}
                  className="input-premium mt-1"
                />
              </div>

              <div>
                <Label>Estado do CRECI</Label>
                <Select
                  value={formData.creci_state}
                  onValueChange={(v) => setFormData({ ...formData, creci_state: v })}
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
            </div>

            <div>
              <Label>Especializações</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {specializationOptions.map(spec => (
                  <button
                    key={spec.value}
                    type="button"
                    onClick={() => toggleSpecialization(spec.value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      formData.specializations.includes(spec.value)
                        ? 'bg-gold text-white'
                        : 'bg-surface border border-border text-muted-foreground hover:border-gold'
                    }`}
                  >
                    {spec.label}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Questionnaire Tab */}
          <TabsContent value="questionnaire" className="space-y-4 mt-4">
            <div className="bg-surface p-4 rounded-lg border border-border mb-4">
              <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-gold" />
                Formulário de Contratação
              </h4>
              <p className="text-sm text-muted-foreground">
                Estas perguntas ajudam a entender o perfil do corretor e suas expectativas.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label>Por que deseja trabalhar conosco?</Label>
                <Textarea
                  placeholder="Descreva sua motivação..."
                  value={questionnaire.motivation}
                  onChange={(e) => setQuestionnaire({ ...questionnaire, motivation: e.target.value })}
                  className="input-premium mt-1"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Anos de experiência no mercado imobiliário</Label>
                  <Input
                    type="number"
                    min="0"
                    value={questionnaire.experience_years}
                    onChange={(e) => setQuestionnaire({ ...questionnaire, experience_years: parseInt(e.target.value) || 0 })}
                    className="input-premium mt-1"
                  />
                </div>

                <div>
                  <Label>Meta mensal de vendas (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={questionnaire.monthly_sales_goal}
                    onChange={(e) => setQuestionnaire({ ...questionnaire, monthly_sales_goal: parseFloat(e.target.value) || 0 })}
                    className="input-premium mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Experiência anterior no mercado imobiliário</Label>
                <Textarea
                  placeholder="Descreva sua experiência..."
                  value={questionnaire.previous_experience}
                  onChange={(e) => setQuestionnaire({ ...questionnaire, previous_experience: e.target.value })}
                  className="input-premium mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Quais são seus objetivos de carreira?</Label>
                <Textarea
                  placeholder="Descreva seus objetivos..."
                  value={questionnaire.career_goals}
                  onChange={(e) => setQuestionnaire({ ...questionnaire, career_goals: e.target.value })}
                  className="input-premium mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Disponibilidade para trabalho</Label>
                <Input
                  placeholder="Ex: Integral, Segunda a Sábado..."
                  value={questionnaire.availability}
                  onChange={(e) => setQuestionnaire({ ...questionnaire, availability: e.target.value })}
                  className="input-premium mt-1"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Quais são seus pontos fortes?</Label>
                  <Textarea
                    placeholder="Descreva seus pontos fortes..."
                    value={questionnaire.strengths}
                    onChange={(e) => setQuestionnaire({ ...questionnaire, strengths: e.target.value })}
                    className="input-premium mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Áreas que deseja melhorar</Label>
                  <Textarea
                    placeholder="Descreva áreas de melhoria..."
                    value={questionnaire.improvement_areas}
                    onChange={(e) => setQuestionnaire({ ...questionnaire, improvement_areas: e.target.value })}
                    className="input-premium mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label>Como conheceu nossa imobiliária?</Label>
                <Input
                  placeholder="Ex: Indicação, Internet, Redes Sociais..."
                  value={questionnaire.referral_source}
                  onChange={(e) => setQuestionnaire({ ...questionnaire, referral_source: e.target.value })}
                  className="input-premium mt-1"
                />
              </div>

              <div>
                <Label>Observações adicionais</Label>
                <Textarea
                  placeholder="Informações adicionais..."
                  value={questionnaire.additional_notes}
                  onChange={(e) => setQuestionnaire({ ...questionnaire, additional_notes: e.target.value })}
                  className="input-premium mt-1"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <div>
              <Label>Currículo</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {resumeFile 
                      ? resumeFile.name 
                      : broker?.resume_url 
                        ? 'Currículo já anexado (clique para substituir)'
                        : 'Clique para anexar currículo (PDF, DOC)'
                    }
                  </p>
                </label>
              </div>
              {broker?.resume_url && !resumeFile && (
                <div className="mt-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold" />
                  <a 
                    href={broker.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-gold hover:underline"
                  >
                    Ver currículo atual
                  </a>
                </div>
              )}
            </div>

            <div className="bg-surface p-4 rounded-lg border border-border">
              <h4 className="font-medium text-foreground mb-2">Documentos Adicionais</h4>
              <p className="text-sm text-muted-foreground">
                Outros documentos podem ser anexados após o cadastro inicial, através da edição do corretor.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-gold hover:bg-gold-dark"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || isUploading}
          >
            {saveMutation.isPending || isUploading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
