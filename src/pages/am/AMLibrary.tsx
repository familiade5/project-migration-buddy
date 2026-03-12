// AM Library - wraps the same creatives library but with AMLayout
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AMLayout } from '@/components/layout/AMLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Loader2, Trash2, Eye, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Creative {
  id: string;
  title: string;
  created_at: string;
  thumbnail_url?: string;
  exported_images?: string[];
  format?: string;
}

export default function AMLibrary() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCreatives = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('creatives')
        .select('id, title, created_at, thumbnail_url, exported_images, format')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: false });

      if (!error && data) setCreatives(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchCreatives(); }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('creatives').delete().eq('id', deleteId);
    if (!error) {
      setCreatives((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success('Criativo excluído');
    }
    setDeleteId(null);
  };

  const filtered = creatives.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AMLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl text-white" style={{ backgroundColor: '#1B5EA6' }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Biblioteca</h1>
              <p className="text-sm text-gray-500">Seus criativos salvos</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              className="pl-9 w-60 border-gray-300 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#1B5EA6' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum criativo encontrado.</p>
            <p className="text-sm text-gray-400 mt-1">Crie posts na aba "Criar Post" e salve-os aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: '#F0F6FF' }}>
                  {c.thumbnail_url || (c.exported_images && c.exported_images[0]) ? (
                    <img
                      src={c.thumbnail_url || c.exported_images![0]}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setSelectedCreative(c)}
                      className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="p-2 rounded-full bg-white text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview dialog */}
        <Dialog open={!!selectedCreative} onOpenChange={() => setSelectedCreative(null)}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">{selectedCreative?.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {(selectedCreative?.exported_images || []).map((img, i) => (
                <img key={i} src={img} alt={`Slide ${i + 1}`} className="w-full rounded-xl border border-gray-200" />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">Excluir criativo?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="text-white"
                style={{ backgroundColor: '#EF4444' }}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AMLayout>
  );
}
