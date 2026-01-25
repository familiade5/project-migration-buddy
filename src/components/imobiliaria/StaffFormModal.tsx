import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, User, Briefcase, Target, FileText, X, UserPlus, Printer, Building, CreditCard } from 'lucide-react';
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
import { PrintableQuestionnaire } from './PrintableQuestionnaire';

interface StaffProfile {
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
  job_title?: string;
  personal_phone?: string | null;
  personal_email?: string | null;
  birth_date?: string | null;
  cpf?: string | null;
  rg?: string | null;
  bank_name?: string | null;
  bank_agency?: string | null;
  bank_account?: string | null;
  pix_key?: string | null;
  profile?: {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string | null;
  };
  questionnaire?: any;
}

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffProfile | null;
}

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const jobTitles = [
  { value: 'corretor', label: 'Corretor de Imóveis' },
  { value: 'gestor_trafego', label: 'Gestor de Tráfego' },
  { value: 'editor_video', label: 'Editor de Vídeo' },
  { value: 'rh', label: 'Recursos Humanos' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'assistente', label: 'Assistente' },
  { value: 'outros', label: 'Outros' },
];

const specializationOptions = [
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'rural', label: 'Rural' },
  { value: 'luxury', label: 'Alto Padrão' },
  { value: 'rental', label: 'Locação' },
];

export function StaffFormModal({ isOpen, onClose, staff }: StaffFormModalProps) {
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);
  const isEditing = !!staff;

  // Create user mode
  const [createUserMode, setCreateUserMode] = useState<'existing' | 'new'>('existing');
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
  });
  const [createdTempPassword, setCreatedTempPassword] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    job_title: 'corretor',
    commission_percentage: 3,
    status: 'pending' as 'active' | 'inactive' | 'pending',
    hired_at: '',
    creci_number: '',
    creci_state: 'MS',
    specializations: [] as string[],
    personal_phone: '',
    personal_email: '',
    birth_date: '',
    cpf: '',
    rg: '',
    bank_name: '',
    bank_agency: '',
    bank_account: '',
    pix_key: '',
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

  // Print dialog state
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Fetch users for selection
  const { data: users = [] } = useQuery({
    queryKey: ['users-for-staff'],
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
    queryKey: ['agency-for-staff'],
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

  // Load staff data when editing
  useEffect(() => {
    if (staff) {
      setFormData({
        user_id: staff.user_id || '',
        job_title: staff.job_title || 'corretor',
        commission_percentage: staff.commission_percentage || 3,
        status: staff.status || 'pending',
        hired_at: staff.hired_at || '',
        creci_number: staff.creci_number || '',
        creci_state: staff.creci_state || 'MS',
        specializations: staff.specializations || [],
        personal_phone: staff.personal_phone || '',
        personal_email: staff.personal_email || '',
        birth_date: staff.birth_date || '',
        cpf: staff.cpf || '',
        rg: staff.rg || '',
        bank_name: staff.bank_name || '',
        bank_agency: staff.bank_agency || '',
        bank_account: staff.bank_account || '',
        pix_key: staff.pix_key || '',
      });

      if (staff.questionnaire) {
        setQuestionnaire({
          motivation: staff.questionnaire.motivation || '',
          experience_years: staff.questionnaire.experience_years || 0,
          previous_experience: staff.questionnaire.previous_experience || '',
          career_goals: staff.questionnaire.career_goals || '',
          monthly_sales_goal: staff.questionnaire.monthly_sales_goal || 0,
          availability: staff.questionnaire.availability || '',
          strengths: staff.questionnaire.strengths || '',
          improvement_areas: staff.questionnaire.improvement_areas || '',
          referral_source: staff.questionnaire.referral_source || '',
          additional_notes: staff.questionnaire.additional_notes || '',
        });
      }
      setCreateUserMode('existing');
    } else {
      // Reset form for new staff
      setFormData({
        user_id: '',
        job_title: 'corretor',
        commission_percentage: 3,
        status: 'pending',
        hired_at: '',
        creci_number: '',
        creci_state: 'MS',
        specializations: [],
        personal_phone: '',
        personal_email: '',
        birth_date: '',
        cpf: '',
        rg: '',
        bank_name: '',
        bank_agency: '',
        bank_account: '',
        pix_key: '',
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
      setNewUserData({ fullName: '', email: '' });
      setCreatedTempPassword(null);
      setCreateUserMode('new');
    }
  }, [staff, isOpen]);

  // Create new user via edge function
  const createUser = async (): Promise<string | null> => {
    if (!newUserData.email || !newUserData.fullName) {
      toast.error('Preencha nome e e-mail do novo funcionário');
      return null;
    }

    setIsCreatingUser(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Não autenticado');
      }

      const response = await supabase.functions.invoke('create-user', {
        body: { email: newUserData.email, fullName: newUserData.fullName },
      });

      if (response.error) {
        throw response.error;
      }

      const { user, tempPassword } = response.data;
      setCreatedTempPassword(tempPassword);
      toast.success('Usuário criado com sucesso!');
      
      // Refresh users list
      queryClient.invalidateQueries({ queryKey: ['users-for-staff'] });
      
      return user.id;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao criar usuário');
      return null;
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Upload file to storage
  const uploadFile = async (file: File, staffId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${staffId}/resume_${Date.now()}.${fileExt}`;

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
      
      let userId = formData.user_id;

      // If creating new user
      if (createUserMode === 'new' && !isEditing) {
        const newUserId = await createUser();
        if (!newUserId) {
          throw new Error('Falha ao criar usuário');
        }
        userId = newUserId;
      }

      let resumeUrl = staff?.resume_url || null;

      // Create or update staff profile
      const staffData = {
        user_id: userId || null,
        agency_id: agency?.id || null,
        job_title: formData.job_title,
        commission_percentage: formData.commission_percentage,
        status: formData.status,
        hired_at: formData.hired_at || null,
        creci_number: formData.creci_number || null,
        creci_state: formData.creci_state || 'MS',
        specializations: formData.specializations.length > 0 ? formData.specializations : null,
        resume_url: resumeUrl,
        personal_phone: formData.personal_phone || null,
        personal_email: formData.personal_email || null,
        birth_date: formData.birth_date || null,
        cpf: formData.cpf || null,
        rg: formData.rg || null,
        bank_name: formData.bank_name || null,
        bank_agency: formData.bank_agency || null,
        bank_account: formData.bank_account || null,
        pix_key: formData.pix_key || null,
      };

      let staffId = staff?.id;

      if (isEditing) {
        const { error } = await supabase
          .from('broker_profiles')
          .update(staffData)
          .eq('id', staff.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('broker_profiles')
          .insert(staffData)
          .select()
          .single();
        if (error) throw error;
        staffId = data.id;
      }

      // Upload resume if provided
      if (resumeFile && staffId) {
        const uploadedUrl = await uploadFile(resumeFile, staffId);
        if (uploadedUrl) {
          await supabase
            .from('broker_profiles')
            .update({ resume_url: uploadedUrl })
            .eq('id', staffId);
        }
      }

      // Save questionnaire (mainly for corretores)
      if (staffId && formData.job_title === 'corretor') {
        const questionnaireData = {
          broker_id: staffId,
          ...questionnaire,
        };

        const { data: existingQ } = await supabase
          .from('broker_questionnaire')
          .select('id')
          .eq('broker_id', staffId)
          .maybeSingle();

        if (existingQ) {
          await supabase
            .from('broker_questionnaire')
            .update(questionnaire)
            .eq('id', existingQ.id);
        } else {
          await supabase
            .from('broker_questionnaire')
            .insert(questionnaireData);
        }
      }

      setIsUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broker-profiles'] });
      toast.success(isEditing ? 'Funcionário atualizado!' : 'Funcionário cadastrado!');
      
      // Show temp password if created
      if (createdTempPassword) {
        toast.info(`Senha temporária: ${createdTempPassword}`, {
          duration: 15000,
          description: 'Anote esta senha - ela será mostrada apenas uma vez.',
        });
      }
      
      onClose();
    },
    onError: (error: any) => {
      console.error('Error saving staff:', error);
      toast.error('Erro ao salvar funcionário');
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

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const executePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Por favor, permita pop-ups para imprimir');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Formulário de Admissão</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; }
          @page { margin: 1cm; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setShowPrintDialog(false);
  };

  const isBroker = formData.job_title === 'corretor';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-gold flex items-center gap-2">
              <User className="w-5 h-5" />
              {isEditing ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-muted-foreground"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Formulário
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="flex items-center gap-1 text-xs">
                <User className="w-3 h-3" />
                Cadastro
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-1 text-xs">
                <CreditCard className="w-3 h-3" />
                Pessoal
              </TabsTrigger>
              <TabsTrigger value="questionnaire" className="flex items-center gap-1 text-xs" disabled={!isBroker}>
                <Target className="w-3 h-3" />
                Questionário
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1 text-xs">
                <FileText className="w-3 h-3" />
                Documentos
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="info" className="space-y-4 mt-4">
              {/* User Creation Mode */}
              {!isEditing && (
                <div className="bg-surface p-4 rounded-lg border border-border">
                  <Label className="text-sm font-medium mb-3 block">Como cadastrar o usuário?</Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCreateUserMode('new')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        createUserMode === 'new'
                          ? 'border-gold bg-gold/10'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <UserPlus className="w-6 h-6 mx-auto mb-2 text-gold" />
                      <p className="font-medium text-foreground">Criar Novo Usuário</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Gerar login e senha automaticamente
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateUserMode('existing')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        createUserMode === 'existing'
                          ? 'border-gold bg-gold/10'
                          : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium text-foreground">Vincular Existente</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Usar um usuário já cadastrado
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* New User Fields */}
              {createUserMode === 'new' && !isEditing && (
                <div className="bg-gold/5 p-4 rounded-lg border border-gold/30">
                  <h4 className="font-medium text-foreground flex items-center gap-2 mb-4">
                    <UserPlus className="w-4 h-4 text-gold" />
                    Dados para Criar Acesso ao Sistema
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nome Completo *</Label>
                      <Input
                        placeholder="Nome do funcionário"
                        value={newUserData.fullName}
                        onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                        className="input-premium mt-1"
                      />
                    </div>
                    <div>
                      <Label>E-mail *</Label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        className="input-premium mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Será usado para login. Uma senha temporária será gerada.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing User Selection */}
              {(createUserMode === 'existing' || isEditing) && (
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
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Cargo *</Label>
                  <Select
                    value={formData.job_title}
                    onValueChange={(v) => setFormData({ ...formData, job_title: v })}
                  >
                    <SelectTrigger className="input-premium mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {jobTitles.map(job => (
                        <SelectItem key={job.value} value={job.value}>
                          {job.label}
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

                {isBroker && (
                  <>
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
                        % sobre o valor da venda
                      </p>
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
                  </>
                )}

                <div>
                  <Label>Data de Contratação</Label>
                  <Input
                    type="date"
                    value={formData.hired_at}
                    onChange={(e) => setFormData({ ...formData, hired_at: e.target.value })}
                    className="input-premium mt-1"
                  />
                </div>
              </div>

              {isBroker && (
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
              )}
            </TabsContent>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="bg-surface p-4 rounded-lg border border-border">
                <h4 className="font-medium text-foreground flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gold" />
                  Dados Pessoais
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Telefone Pessoal</Label>
                    <Input
                      placeholder="(67) 99999-9999"
                      value={formData.personal_phone}
                      onChange={(e) => setFormData({ ...formData, personal_phone: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>E-mail Pessoal</Label>
                    <Input
                      type="email"
                      placeholder="email@pessoal.com"
                      value={formData.personal_email}
                      onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <Input
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>RG</Label>
                    <Input
                      placeholder="0000000"
                      value={formData.rg}
                      onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface p-4 rounded-lg border border-border">
                <h4 className="font-medium text-foreground flex items-center gap-2 mb-4">
                  <Building className="w-4 h-4 text-gold" />
                  Dados Bancários
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Banco</Label>
                    <Input
                      placeholder="Nome do banco"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>Agência</Label>
                    <Input
                      placeholder="0000"
                      value={formData.bank_agency}
                      onChange={(e) => setFormData({ ...formData, bank_agency: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>Conta</Label>
                    <Input
                      placeholder="00000-0"
                      value={formData.bank_account}
                      onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                  <div>
                    <Label>Chave PIX</Label>
                    <Input
                      placeholder="CPF, telefone, e-mail ou chave aleatória"
                      value={formData.pix_key}
                      onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
                      className="input-premium mt-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Questionnaire Tab (only for corretores) */}
            <TabsContent value="questionnaire" className="space-y-4 mt-4">
              {isBroker ? (
                <>
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
                        <Label>Anos de experiência</Label>
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
                      <Label>Experiência anterior</Label>
                      <Textarea
                        placeholder="Descreva sua experiência..."
                        value={questionnaire.previous_experience}
                        onChange={(e) => setQuestionnaire({ ...questionnaire, previous_experience: e.target.value })}
                        className="input-premium mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Objetivos de carreira</Label>
                      <Textarea
                        placeholder="Onde você se vê em 5 anos?"
                        value={questionnaire.career_goals}
                        onChange={(e) => setQuestionnaire({ ...questionnaire, career_goals: e.target.value })}
                        className="input-premium mt-1"
                        rows={2}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Pontos fortes</Label>
                        <Textarea
                          placeholder="O que você faz bem?"
                          value={questionnaire.strengths}
                          onChange={(e) => setQuestionnaire({ ...questionnaire, strengths: e.target.value })}
                          className="input-premium mt-1"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Áreas de melhoria</Label>
                        <Textarea
                          placeholder="O que deseja desenvolver?"
                          value={questionnaire.improvement_areas}
                          onChange={(e) => setQuestionnaire({ ...questionnaire, improvement_areas: e.target.value })}
                          className="input-premium mt-1"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Disponibilidade</Label>
                        <Input
                          placeholder="Horários disponíveis"
                          value={questionnaire.availability}
                          onChange={(e) => setQuestionnaire({ ...questionnaire, availability: e.target.value })}
                          className="input-premium mt-1"
                        />
                      </div>
                      <div>
                        <Label>Como conheceu a imobiliária?</Label>
                        <Input
                          placeholder="Indicação, redes sociais..."
                          value={questionnaire.referral_source}
                          onChange={(e) => setQuestionnaire({ ...questionnaire, referral_source: e.target.value })}
                          className="input-premium mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Observações adicionais</Label>
                      <Textarea
                        placeholder="Algo mais que gostaria de compartilhar?"
                        value={questionnaire.additional_notes}
                        onChange={(e) => setQuestionnaire({ ...questionnaire, additional_notes: e.target.value })}
                        className="input-premium mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  O questionário de contratação é exclusivo para corretores.
                </div>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="bg-surface p-4 rounded-lg border border-border">
                <h4 className="font-medium text-foreground flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-gold" />
                  Currículo / Documentos
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label>Anexar Currículo (PDF)</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          {resumeFile ? resumeFile.name : 'Clique para selecionar arquivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>

                  {staff?.resume_url && !resumeFile && (
                    <div className="flex items-center gap-2 p-2 bg-surface rounded border border-border">
                      <FileText className="w-4 h-4 text-gold" />
                      <a
                        href={staff.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gold hover:underline flex-1"
                      >
                        Ver currículo atual
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setResumeFile(null)}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || isUploading || isCreatingUser}
              className="bg-gold hover:bg-gold-dark"
            >
              {saveMutation.isPending || isUploading || isCreatingUser ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Salvando...
                </>
              ) : (
                isEditing ? 'Atualizar' : 'Cadastrar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Formulário para Impressão</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={executePrint} className="bg-gold hover:bg-gold-dark">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
                Fechar
              </Button>
            </div>
          </DialogHeader>
          <div ref={printRef}>
            <PrintableQuestionnaire jobTitle={formData.job_title} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
