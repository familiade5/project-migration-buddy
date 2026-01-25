import { forwardRef } from 'react';

const jobTitleLabels: Record<string, string> = {
  corretor: 'Corretor de Imóveis',
  gestor_trafego: 'Gestor de Tráfego',
  editor_video: 'Editor de Vídeo',
  rh: 'Recursos Humanos',
  administrativo: 'Administrativo',
  gerente: 'Gerente',
  diretor: 'Diretor',
  assistente: 'Assistente',
  outros: 'Outros',
};

interface PrintableQuestionnaireProps {
  jobTitle?: string;
}

export const PrintableQuestionnaire = forwardRef<HTMLDivElement, PrintableQuestionnaireProps>(
  ({ jobTitle = 'corretor' }, ref) => {
    const isBroker = jobTitle === 'corretor';
    
    return (
      <div ref={ref} className="bg-white p-8 max-w-[210mm] mx-auto print:p-0 print:bg-white [&_*]:!text-black [&_h1]:!text-black [&_h2]:!text-black [&_p]:!text-black [&_label]:!text-black [&_.text-gray-900]:!text-black [&_.text-gray-700]:!text-gray-800 [&_.text-gray-500]:!text-gray-600 print:[&_*]:!text-black">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            FORMULÁRIO DE ADMISSÃO
          </h1>
          <p className="text-lg text-gray-700">
            {jobTitleLabels[jobTitle] || 'Colaborador'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Venda Direta Hoje - Imobiliária
          </p>
        </div>

        {/* Personal Info Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold bg-gray-100 p-2 mb-4">
            1. DADOS PESSOAIS
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Nome Completo:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CPF:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">RG:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">Data de Nascimento:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">E-mail:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">Telefone/WhatsApp:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Endereço Completo:</label>
              <div className="border-b border-gray-400 h-8"></div>
            </div>
          </div>
        </section>

        {/* Banking Info */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold bg-gray-100 p-2 mb-4">
            2. DADOS BANCÁRIOS
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Banco:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium mb-1">Agência:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">Conta:</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chave PIX (preferencial):</label>
              <div className="border-b border-gray-400 h-8"></div>
            </div>
          </div>
        </section>

        {/* Professional Info - for brokers */}
        {isBroker && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold bg-gray-100 p-2 mb-4">
              3. DADOS PROFISSIONAIS
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-48">
                  <label className="block text-sm font-medium mb-1">CRECI:</label>
                  <div className="border-b border-gray-400 h-8"></div>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium mb-1">UF:</label>
                  <div className="border-b border-gray-400 h-8"></div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Anos de Experiência:</label>
                  <div className="border-b border-gray-400 h-8"></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Especializações (tipos de imóveis que trabalha):</label>
                <div className="border-b border-gray-400 h-8"></div>
              </div>
            </div>
          </section>
        )}

        {/* Questionnaire */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold bg-gray-100 p-2 mb-4">
            {isBroker ? '4' : '3'}. QUESTIONÁRIO
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                O que te motivou a se candidatar para esta vaga?
              </label>
              <div className="border border-gray-400 h-24 rounded"></div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Descreva sua experiência anterior na área:
              </label>
              <div className="border border-gray-400 h-24 rounded"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quais são seus objetivos de carreira para os próximos 2-5 anos?
              </label>
              <div className="border border-gray-400 h-24 rounded"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quais são seus pontos fortes que podem contribuir para a empresa?
              </label>
              <div className="border border-gray-400 h-24 rounded"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quais áreas você gostaria de desenvolver/melhorar?
              </label>
              <div className="border border-gray-400 h-24 rounded"></div>
            </div>

            {isBroker && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Qual sua meta de vendas mensal (em R$)?
                </label>
                <div className="border-b border-gray-400 h-8 w-64"></div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Qual sua disponibilidade de horário?
              </label>
              <div className="border-b border-gray-400 h-8"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Como você ficou sabendo desta oportunidade?
              </label>
              <div className="border-b border-gray-400 h-8"></div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Observações adicionais:
              </label>
              <div className="border border-gray-400 h-24 rounded"></div>
            </div>
          </div>
        </section>

        {/* Signature */}
        <section className="mt-12">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm">Data: ____/____/________</p>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-800 w-64 pt-2">
                <p className="text-sm">Assinatura do Candidato</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
          <p>Documento confidencial - Uso interno</p>
        </div>
      </div>
    );
  }
);

PrintableQuestionnaire.displayName = 'PrintableQuestionnaire';
