import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Send, Search, Inbox, Archive, UserPlus, Tag, Loader2, MessageCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const BRAND = "#006633";

type Conversation = {
  id: string;
  ig_participant_id: string;
  ig_username: string | null;
  ig_full_name: string | null;
  ig_profile_pic: string | null;
  last_message_text: string | null;
  last_message_at: string | null;
  last_message_direction: "in" | "out" | null;
  unread_count: number;
  assigned_to_user_id: string | null;
  assigned_to_name: string | null;
  status: "open" | "archived";
  lead_status: "novo" | "qualificando" | "quente" | "fechado" | "perdido";
  notes: string | null;
};

type Message = {
  id: string;
  conversation_id: string;
  direction: "in" | "out";
  text: string | null;
  attachment_type: string | null;
  attachment_url: string | null;
  story_url: string | null;
  sent_by_user_id: string | null;
  sent_by_name: string | null;
  created_at: string;
};

const LEAD_STATUS_CONFIG: Record<Conversation["lead_status"], { label: string; color: string }> = {
  novo: { label: "Novo", color: "#6b7280" },
  qualificando: { label: "Qualificando", color: "#3b82f6" },
  quente: { label: "Quente", color: "#f97316" },
  fechado: { label: "Fechado", color: "#22c55e" },
  perdido: { label: "Perdido", color: "#ef4444" },
};

type FilterTab = "todas" | "minhas" | "nao_lidas" | "arquivadas";

export default function VDHInbox() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("todas");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);

  const threadEndRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  );

  // Access check
  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("has_vdh_inbox_access", { _user_id: user.id })
      .then(({ data }) => setHasAccess(!!data));
  }, [user]);

  // Fetch conversations
  const loadConversations = async () => {
    setLoadingConvs(true);
    const { data, error } = await supabase
      .from("vdh_conversations")
      .select("*")
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(200);
    if (!error && data) setConversations(data as Conversation[]);
    setLoadingConvs(false);
  };

  useEffect(() => {
    if (hasAccess) loadConversations();
  }, [hasAccess]);

  // Realtime — conversations
  useEffect(() => {
    if (!hasAccess) return;
    const channel = supabase
      .channel("vdh-conversations-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vdh_conversations" },
        (payload) => {
          setConversations((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as Conversation, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              const updated = payload.new as Conversation;
              return prev
                .map((c) => (c.id === updated.id ? updated : c))
                .sort((a, b) => {
                  const ta = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
                  const tb = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
                  return tb - ta;
                });
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((c) => c.id !== (payload.old as Conversation).id);
            }
            return prev;
          });
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [hasAccess]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    supabase
      .from("vdh_messages")
      .select("*")
      .eq("conversation_id", selectedId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setMessages(data as Message[]);
      });

    // Mark as read
    supabase.from("vdh_conversations").update({ unread_count: 0 }).eq("id", selectedId).then(() => {});
  }, [selectedId]);

  // Realtime — messages for selected conv
  useEffect(() => {
    if (!selectedId) return;
    const channel = supabase
      .channel(`vdh-messages-${selectedId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "vdh_messages", filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          setMessages((prev) => {
            const m = payload.new as Message;
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, m];
          });
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  // Auto-scroll thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedId]);

  const filteredConvs = useMemo(() => {
    return conversations.filter((c) => {
      if (filter === "arquivadas") {
        if (c.status !== "archived") return false;
      } else {
        if (c.status === "archived") return false;
      }
      if (filter === "minhas" && c.assigned_to_user_id !== user?.id) return false;
      if (filter === "nao_lidas" && c.unread_count === 0) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${c.ig_full_name ?? ""} ${c.ig_username ?? ""} ${c.last_message_text ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [conversations, filter, search, user?.id]);

  const totalUnread = conversations.reduce((s, c) => s + (c.status === "open" ? c.unread_count : 0), 0);

  const handleSend = async () => {
    if (!selected || !draft.trim() || sending) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("vdh-instagram-send", {
        body: { conversation_id: selected.id, text: draft.trim() },
      });
      if (error || (data as { error?: string })?.error) {
        const msg = (data as { error?: string; detail?: { error?: { message?: string } } })?.detail?.error?.message
          ?? (data as { error?: string })?.error
          ?? error?.message
          ?? "Erro ao enviar";
        throw new Error(msg);
      }
      setDraft("");
    } catch (e) {
      toast({
        title: "Falha ao enviar",
        description: e instanceof Error ? e.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const updateConv = async (patch: Partial<Conversation>) => {
    if (!selected) return;
    const { error } = await supabase.from("vdh_conversations").update(patch).eq("id", selected.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
  };

  const handleAssignToMe = async () => {
    if (!user || !profile) return;
    await updateConv({
      assigned_to_user_id: user.id,
      assigned_to_name: profile.full_name ?? profile.email,
    });
    toast({ title: "Conversa atribuída a você" });
  };

  const handleUnassign = async () => {
    await updateConv({ assigned_to_user_id: null, assigned_to_name: null });
  };

  const handleArchive = async () => {
    await updateConv({ status: selected?.status === "archived" ? "open" : "archived" });
  };

  // Access denied UI
  if (hasAccess === false) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] gap-3 text-center px-6">
          <AlertCircle className="w-12 h-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700">Sem acesso à Caixa de Entrada</h2>
          <p className="text-sm text-gray-500 max-w-md">
            Peça a um administrador para liberar seu acesso à inbox do VDH.
          </p>
        </div>
      </AppLayout>
    );
  }

  if (hasAccess === null) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-[calc(100vh-0px)] lg:h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="border-b px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Caixa de Entrada VDH</h1>
              <p className="text-xs text-gray-500">
                Instagram Direct centralizado
                {totalUnread > 0 && <span className="ml-2 font-semibold" style={{ color: BRAND }}>• {totalUnread} não lidas</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Split view */}
        <div className="flex-1 flex min-h-0">
          {/* Conversations list */}
          <div className={`${selected ? "hidden md:flex" : "flex"} w-full md:w-[340px] border-r flex-col flex-shrink-0`}>
            <div className="p-3 border-b space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar conversa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {([
                  { k: "todas", label: "Todas" },
                  { k: "nao_lidas", label: "Não lidas" },
                  { k: "minhas", label: "Minhas" },
                  { k: "arquivadas", label: "Arquivadas" },
                ] as { k: FilterTab; label: string }[]).map((t) => (
                  <button
                    key={t.k}
                    onClick={() => setFilter(t.k)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                    style={
                      filter === t.k
                        ? { backgroundColor: BRAND, color: "white" }
                        : { backgroundColor: "#f3f4f6", color: "#6b7280" }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              ) : filteredConvs.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Nenhuma conversa
                </div>
              ) : (
                filteredConvs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="w-full text-left px-3 py-3 border-b hover:bg-gray-50 transition-colors flex gap-3"
                    style={selectedId === c.id ? { backgroundColor: "#ecfdf5" } : undefined}
                  >
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      {c.ig_profile_pic && <AvatarImage src={c.ig_profile_pic} />}
                      <AvatarFallback style={{ backgroundColor: BRAND, color: "white" }}>
                        {(c.ig_full_name ?? c.ig_username ?? "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm truncate text-gray-900">
                          {c.ig_full_name ?? c.ig_username ?? "Usuário"}
                        </p>
                        {c.last_message_at && (
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {formatDistanceToNow(new Date(c.last_message_at), { locale: ptBR, addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-xs text-gray-500 truncate">
                          {c.last_message_direction === "out" && "Você: "}
                          {c.last_message_text ?? "—"}
                        </p>
                        {c.unread_count > 0 && (
                          <Badge style={{ backgroundColor: BRAND }} className="h-5 min-w-5 px-1.5 text-[10px]">
                            {c.unread_count}
                          </Badge>
                        )}
                      </div>
                      {c.assigned_to_name && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Atribuída a: {c.assigned_to_name}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Thread */}
          <div className={`${selected ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0`}>
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                <MessageCircle className="w-12 h-12 text-gray-200" />
                <p className="text-sm">Selecione uma conversa</p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="border-b px-4 py-3 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setSelectedId(null)} className="md:hidden text-gray-500 text-sm">←</button>
                    <Avatar className="w-9 h-9">
                      {selected.ig_profile_pic && <AvatarImage src={selected.ig_profile_pic} />}
                      <AvatarFallback style={{ backgroundColor: BRAND, color: "white" }}>
                        {(selected.ig_full_name ?? "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{selected.ig_full_name ?? "Usuário"}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {selected.ig_username ? `@${selected.ig_username}` : selected.ig_participant_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={selected.lead_status}
                      onValueChange={(v) => updateConv({ lead_status: v as Conversation["lead_status"] })}
                    >
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LEAD_STATUS_CONFIG).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                              {v.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selected.assigned_to_user_id === user?.id ? (
                      <Button size="sm" variant="outline" onClick={handleUnassign} className="h-8 text-xs">
                        Liberar
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleAssignToMe} className="h-8 text-xs" style={{ backgroundColor: BRAND }}>
                        <UserPlus className="w-3 h-3 mr-1" />
                        Assumir
                      </Button>
                    )}

                    <Button size="sm" variant="outline" onClick={handleArchive} className="h-8 text-xs">
                      <Archive className="w-3 h-3 mr-1" />
                      {selected.status === "archived" ? "Reabrir" : "Arquivar"}
                    </Button>
                  </div>
                </div>

                {selected.assigned_to_user_id && selected.assigned_to_user_id !== user?.id && (
                  <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Atribuída a <strong>{selected.assigned_to_name}</strong>. Você ainda pode responder.
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.direction === "out" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm"
                        style={
                          m.direction === "out"
                            ? { backgroundColor: BRAND, color: "white" }
                            : { backgroundColor: "white", color: "#111827", border: "1px solid #e5e7eb" }
                        }
                      >
                        {m.attachment_type === "image" && m.attachment_url && (
                          <img src={m.attachment_url} alt="" className="rounded-lg mb-1 max-h-60" />
                        )}
                        {m.attachment_type === "story_mention" && (
                          <div className="text-xs italic opacity-80 mb-1">↪ Mencionou seu story</div>
                        )}
                        {m.attachment_type && !m.text && !["image", "story_mention"].includes(m.attachment_type) && (
                          <div className="text-xs italic opacity-80">[{m.attachment_type}]</div>
                        )}
                        {m.text && <div className="whitespace-pre-wrap break-words">{m.text}</div>}
                        <div className={`text-[10px] mt-1 ${m.direction === "out" ? "text-white/70" : "text-gray-400"}`}>
                          {new Date(m.created_at).toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                          {m.direction === "out" && m.sent_by_name && ` • ${m.sent_by_name}`}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={threadEndRef} />
                </div>

                {/* Composer */}
                <div className="border-t p-3 flex-shrink-0 bg-white">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite uma mensagem..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={sending}
                      maxLength={1000}
                    />
                    <Button onClick={handleSend} disabled={sending || !draft.trim()} style={{ backgroundColor: BRAND }}>
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    Janela de 24h do Meta: só pode iniciar conversa se o cliente enviou mensagem nas últimas 24h.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}