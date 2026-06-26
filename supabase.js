// ============================================================
//  Conexión a Supabase
//  La anon key es PÚBLICA por diseño (segura para el front).
//  Proyecto compartido con prospección.
// ============================================================

const SUPABASE_URL = "https://hdlsrcqjpdmidrkwufxe.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkbHNyY3FqcGRtaWRya3d1ZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzgzNjIsImV4cCI6MjA5Mzg1NDM2Mn0.xwWVXVAvBVnyPsmBEHDH62StSCFs_EScK-veJLL-IwA";

const TABLE = "panel_servicios";
const ROW_ID = "main";

// Cliente global (supabase-js cargado por CDN en index.html)
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Lee el registro de contenido. Devuelve el objeto data o null.
async function cloudLoad() {
  const { data, error } = await sb
    .from(TABLE)
    .select("data")
    .eq("id", ROW_ID)
    .maybeSingle();
  if (error) throw error;
  return data ? data.data : null;
}

// Guarda (upsert) todo el contenido en la nube.
async function cloudSave(payload) {
  const { error } = await sb
    .from(TABLE)
    .upsert({ id: ROW_ID, data: payload, updated_at: new Date().toISOString() });
  if (error) throw error;
}
