import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Upload, X, Loader2, MessageCircle } from 'lucide-react';
import noPhoto from '@/assets/imagem-nao-fornecida.jpg';
import { supabase } from '@/integrations/supabase/client';
import { SiteLayout } from '@/components/site/SiteLayout';
import { SiteProperty, SITE_GREEN, brl, siteTable, whatsappLink } from '@/lib/vdhSite';

type DocKind = 'identidade' | 'renda' | 'residencia' | 'compositor' | 'outros';
const DOCS: { kind: DocKind; label: string; hint: string }[] = [
  { kind: 'identidade', label: 'RG ou CNH', hint: 'Frente e verso' },
  { kind: 'renda', label: 'Comprovante de renda', hint: 'Holerite, extrato ou IR' },
  { kind: 'residencia', label: 'Comprovante de residência', hint: 'Conta de luz, água…' },
  { kind: 'compositor', label: 'Documentos de quem soma renda', hint: 'Se houver' },
  { kind: 'outros', label: 'Outros', hint: 'Certidão de casamento, CTPS…' },
];
const STEPS = ['Seus dados', 'Renda', 'Documentos', 'Enviar'];
const MAX_FILE = 10 * 1024 * 1024;

const inputCls = 'w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-slate-400';
const money = (v: string) => Number(v.replace(/\D/g, '')) / 100;
const fmtMoney = (v: string) => (v ? money(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '');
const maskPhone = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
const maskCpf = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export default function SiteSimulate() {
  const { code = '' } = useParams();
  const [p, setP] = useState<SiteProperty | null>(null);
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ full_name: '', cpf: '', phone: '', email: '', birth_date: '', marital_status: '', income: '', income_type: 'CLT', uses_fgts: false, has_coborrower: false, coborrower_name: '', coborrower_income: '' });
  const [files, setFiles] = useState<{ kind: DocKind; file: File }[]>([]);
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => { siteTable().select('*').eq('code', code).maybeSingle().then(({ data }: any) => setP(data)); }, [code]);
  const set = (k: keyof typeof f, v: any) => setF((o) => ({ ...o, [k]: v }));

  const stepError = () => {
    if (step === 0) {
      if (f.full_name.trim().length < 3) return 'Informe seu nome completo';
      if (f.phone.replace(/\D/g, '').length < 10) return 'Informe um WhatsApp válido';
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return 'E-mail inválido';
    }
    if (step === 1 && money(f.income) <= 0) return 'Informe sua renda mensal';
    if (step === 3 && !consent) return 'Marque a autorização para continuar';
    return '';
  };

  const next = () => { const e = stepError(); setError(e); if (!e) setStep((s) => s + 1); };

  const addFiles = (kind: DocKind, list: FileList | null) => {
    if (!list) return;
    const ok = [...list].filter((x) => x.size <= MAX_FILE && /^(image\/|application\/pdf)/.test(x.type));
    if (ok.length < list.length) setError('Alguns arquivos foram ignorados (aceitamos fotos e PDF de até 10 MB).');
    setFiles((o) => [...o, ...ok.map((file) => ({ kind, file }))].slice(0, 12));
  };

  const submit = async () => {
    const e = stepError(); setError(e); if (e) return;
    setSending(true);
    try {
      let batch = crypto.randomUUID();
      const documents: { kind: DocKind; name: string; path: string }[] = [];
      if (files.length) {
        const { data, error: upErr } = await supabase.functions.invoke('vdh-site-submit', {
          body: { action: 'upload_urls', files: files.map((x) => ({ kind: x.kind, name: x.file.name.slice(0, 150) })) },
        });
        if (upErr || !data?.success) throw new Error('upload');
        batch = data.batch;
        for (const [i, u] of data.uploads.entries()) {
          const { error: sErr } = await supabase.storage.from('vdh-site-docs').uploadToSignedUrl(u.path, u.token, files[i].file);
          if (sErr) throw sErr;
          documents.push({ kind: u.kind, name: u.name, path: u.path });
        }
      }
      const { data, error: subErr } = await supabase.functions.invoke('vdh-site-submit', {
        body: {
          action: 'submit', batch, property_code: p?.code || null,
          full_name: f.full_name.trim(), cpf: f.cpf, email: f.email.trim(), phone: f.phone,
          birth_date: f.birth_date, marital_status: f.marital_status,
          monthly_income: money(f.income), income_type: f.income_type, uses_fgts: f.uses_fgts,
          has_coborrower: f.has_coborrower, coborrower_name: f.coborrower_name,
          coborrower_income: f.has_coborrower ? money(f.coborrower_income) : null,
          city: p?.city || '', uf: p?.uf || '', consent: true, documents,
        },
      });
      if (subErr || !data?.success) throw new Error(data?.error || 'submit');
      setDone(true);
    } catch {
      setError('Não conseguimos enviar agora. Confira sua internet e tente de novo, ou fale com a gente no WhatsApp.');
    } finally { setSending(false); }
  };

  if (done) return (
    <SiteLayout title="Pedido enviado">
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: '#e8f3ec' }}><Check className="w-8 h-8" style={{ color: SITE_GREEN }} /></div>
        <h1 className="text-2xl font-extrabold mt-4 text-slate-900">Recebemos seu pedido!</h1>
        <p className="text-slate-600 mt-2">Nossa equipe de crédito vai analisar seus dados e documentos. Em breve um corretor entra em contato pelo WhatsApp {f.phone}.</p>
        <ol className="text-left text-sm text-slate-600 mt-6 space-y-2 bg-slate-50 rounded-2xl p-5">
          <li>1. Análise da documentação pela nossa equipe</li>
          <li>2. Retorno com o resultado da pré-análise</li>
          <li>3. Contato do corretor para visita e proposta</li>
        </ol>
        <div className="flex gap-2 justify-center mt-6">
          <Link to="/imoveis" className="px-5 py-3 rounded-xl font-semibold border border-slate-200 text-slate-700 bg-white">Ver mais imóveis</Link>
          <a href={whatsappLink(p)} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#25D366' }}><MessageCircle className="w-4 h-4" />WhatsApp</a>
        </div>
      </div>
    </SiteLayout>
  );

  return (
    <SiteLayout title="Pré-análise de crédito" whatsapp={whatsappLink(p)}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to={p ? `/imoveis/imovel/${p.code}` : '/imoveis'} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="w-4 h-4" /> Voltar ao imóvel</Link>
        <h1 className="text-2xl font-extrabold mt-2 text-slate-900">Descubra se você aprova</h1>
        <p className="text-sm text-slate-500">Leva uns 3 minutos. Seus dados ficam protegidos e só nossa equipe de crédito tem acesso.</p>

        {p && (
          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl border border-slate-200 bg-white">
            <img src={p.photo_url || noPhoto} onError={(e) => { (e.currentTarget as HTMLImageElement).src = noPhoto; }} className="w-16 h-12 rounded-lg object-cover" alt="" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{p.property_type} · {p.neighborhood}</p>
              <p className="text-xs text-slate-500">{p.city}/{p.uf} · {brl(p.price)}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="h-1.5 rounded-full" style={{ backgroundColor: i <= step ? SITE_GREEN : '#e2e8f0' }} />
              <p className="text-[11px] mt-1" style={{ color: i === step ? SITE_GREEN : '#94a3b8' }}>{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {step === 0 && (<>
            <Field label="Nome completo *"><input className={inputCls} value={f.full_name} maxLength={120} onChange={(e) => set('full_name', e.target.value)} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="WhatsApp *"><input className={inputCls} inputMode="tel" value={f.phone} onChange={(e) => set('phone', maskPhone(e.target.value))} placeholder="(85) 99999-9999" /></Field>
              <Field label="CPF"><input className={inputCls} inputMode="numeric" value={f.cpf} onChange={(e) => set('cpf', maskCpf(e.target.value))} /></Field>
              <Field label="E-mail"><input className={inputCls} type="email" maxLength={255} value={f.email} onChange={(e) => set('email', e.target.value)} /></Field>
              <Field label="Data de nascimento"><input className={inputCls} type="date" value={f.birth_date} onChange={(e) => set('birth_date', e.target.value)} /></Field>
            </div>
            <Field label="Estado civil">
              <select className={inputCls} value={f.marital_status} onChange={(e) => set('marital_status', e.target.value)}>
                <option value="">Selecione</option>{['Solteiro(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Viúvo(a)'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
          </>)}

          {step === 1 && (<>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Sua renda mensal *"><input className={inputCls} inputMode="numeric" value={fmtMoney(f.income)} onChange={(e) => set('income', e.target.value.replace(/\D/g, ''))} placeholder="R$ 0,00" /></Field>
              <Field label="Tipo de renda">
                <select className={inputCls} value={f.income_type} onChange={(e) => set('income_type', e.target.value)}>
                  {['CLT', 'Autônomo', 'Servidor público', 'Aposentado', 'Empresário', 'Informal'].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
            </div>
            <Toggle checked={f.uses_fgts} onChange={(v) => set('uses_fgts', v)} label="Tenho FGTS (3 anos ou mais de carteira assinada)" />
            <Toggle checked={f.has_coborrower} onChange={(v) => set('has_coborrower', v)} label="Vou somar renda com outra pessoa (cônjuge, familiar)" />
            {f.has_coborrower && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome de quem soma renda"><input className={inputCls} maxLength={120} value={f.coborrower_name} onChange={(e) => set('coborrower_name', e.target.value)} /></Field>
                <Field label="Renda dessa pessoa"><input className={inputCls} inputMode="numeric" value={fmtMoney(f.coborrower_income)} onChange={(e) => set('coborrower_income', e.target.value.replace(/\D/g, ''))} placeholder="R$ 0,00" /></Field>
              </div>
            )}
          </>)}

          {step === 2 && (<>
            <p className="text-sm text-slate-600">Envie fotos nítidas ou PDF. Pode pular se preferir mandar depois pelo WhatsApp.</p>
            {DOCS.filter((d) => d.kind !== 'compositor' || f.has_coborrower).map((d) => {
              const mine = files.filter((x) => x.kind === d.kind);
              return (
                <div key={d.kind} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div><p className="font-semibold text-slate-900 text-sm">{d.label}</p><p className="text-xs text-slate-500">{d.hint}</p></div>
                    <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: SITE_GREEN }}>
                      <Upload className="w-4 h-4" /> Anexar
                      <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => { addFiles(d.kind, e.target.files); e.target.value = ''; }} />
                    </label>
                  </div>
                  {mine.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {mine.map((x) => (
                        <li key={x.file.name + x.file.size} className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-2 py-1.5">
                          <span className="truncate flex items-center gap-1"><Check className="w-3.5 h-3.5" style={{ color: SITE_GREEN }} />{x.file.name}</span>
                          <button onClick={() => setFiles((o) => o.filter((y) => y !== x))} aria-label="Remover"><X className="w-3.5 h-3.5" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </>)}

          {step === 3 && (
            <div className="p-4 rounded-xl bg-slate-50 text-sm text-slate-700 space-y-1">
              <p><b>{f.full_name}</b> · {f.phone}</p>
              <p>Renda: {fmtMoney(f.income)}{f.has_coborrower ? ` + ${fmtMoney(f.coborrower_income)} (${f.coborrower_name || 'compositor'})` : ''}</p>
              <p>{files.length} documento(s) anexado(s)</p>
              <label className="flex items-start gap-2 mt-4 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                <span>Autorizo a Venda Direta Hoje a usar meus dados e documentos para análise de crédito imobiliário e contato, conforme a LGPD.</span>
              </label>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          {step > 0 && <button onClick={() => { setError(''); setStep((s) => s - 1); }} className="h-12 px-5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold">Voltar</button>}
          {step < 3 ? (
            <button onClick={next} className="flex-1 h-12 rounded-xl font-bold text-white" style={{ backgroundColor: SITE_GREEN }}>Continuar</button>
          ) : (
            <button onClick={submit} disabled={sending} className="flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: SITE_GREEN }}>
              {sending && <Loader2 className="w-4 h-4 animate-spin" />} Enviar para análise
            </button>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-medium text-slate-600">{label}</span><div className="mt-1">{children}</div></label>;
}
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
