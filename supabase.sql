-- =====================================================================
--  Panel de Servicios — tabla de contenido (un solo registro JSON)
--  Correr esto UNA VEZ en Supabase → SQL Editor → Run
--  Proyecto: el mismo de prospección (hdlsrcqjpdmidrkwufxe)
-- =====================================================================

create table if not exists panel_servicios (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Uso personal con anon key, igual que el resto del proyecto:
-- RLS deshabilitado = lectura y escritura abiertas con la anon key.
alter table panel_servicios disable row level security;
