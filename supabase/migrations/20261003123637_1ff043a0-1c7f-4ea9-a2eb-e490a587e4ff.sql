INSERT INTO public.cx_pipeline_stages (key, label, color, bg, position, is_system, is_active)
VALUES
  ('documentacao', 'Documentação', '#2563eb', '#eff6ff', 65, true, true),
  ('engenharia', 'Engenharia / Vistoria', '#7c3aed', '#f5f3ff', 67, true, true),
  ('pendencia_engenharia', 'Pendência de engenharia', '#dc2626', '#fef2f2', 68, true, true),
  ('perdido', 'Perdido / encerrado', '#64748b', '#f8fafc', 110, true, true)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  color = EXCLUDED.color,
  bg = EXCLUDED.bg,
  position = EXCLUDED.position,
  is_system = true,
  is_active = true;