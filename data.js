// ============================================================
//  DATOS POR DEFECTO (seed)
//  Esto es solo el contenido inicial de ejemplo.
//  Podés editar todo desde la web (botón "Editar") y se guarda
//  en tu navegador. También podés Exportar / Importar este JSON.
// ============================================================

const DATA_DEFAULT = {
  marca: {
    nombre: "Mis Servicios",
    subtitulo: "Panel comercial · beneficios de cada servicio",
  },
  servicios: [
    {
      id: "paginas-web",
      nombre: "Páginas Web",
      icono: "🌐",
      tagline: "Tu presencia profesional online, lista para vender.",
      descripcion:
        "Sitios web institucionales y profesionales, rápidos, optimizados para Google y adaptados a celular. Pensados para que tu negocio se vea serio y genere confianza desde el primer clic.",
      beneficios: [
        { titulo: "Imagen profesional", detalle: "Tu negocio transmite seriedad y confianza 24/7." },
        { titulo: "Aparecés en Google", detalle: "Optimización SEO básica para que te encuentren." },
        { titulo: "100% responsive", detalle: "Se ve perfecto en celular, tablet y compu." },
        { titulo: "Carga rápida", detalle: "Webs livianas que no hacen esperar al cliente." },
      ],
      incluye: [
        "Diseño personalizado a tu marca",
        "Hasta 5 secciones / páginas",
        "Formulario de contacto + WhatsApp",
        "Optimización SEO inicial",
        "Hosting y dominio asesorado",
      ],
      idealPara: "Profesionales, estudios, comercios y emprendimientos que necesitan una presencia online sólida.",
      paquetes: [
        { nombre: "Básica", precio: "$ —", detalle: "1 página · info esencial" },
        { nombre: "Profesional", precio: "$ —", detalle: "Hasta 5 secciones · SEO" },
        { nombre: "Premium", precio: "$ —", detalle: "A medida · integraciones" },
      ],
    },
    {
      id: "ecommerce",
      nombre: "Tienda Ecommerce",
      icono: "🛒",
      tagline: "Vendé online 24/7 con tu propia tienda.",
      descripcion:
        "Tiendas online completas con catálogo, carrito, medios de pago y gestión de productos. Para que vendas sin límite de horario y cobres de forma automática.",
      beneficios: [
        { titulo: "Vendés sin horarios", detalle: "Tu tienda cobra mientras dormís." },
        { titulo: "Pagos integrados", detalle: "Mercado Pago, tarjeta y transferencia." },
        { titulo: "Gestión simple", detalle: "Cargá y editás productos vos mismo." },
        { titulo: "Escalable", detalle: "Crece con tu negocio sin rehacer todo." },
      ],
      incluye: [
        "Catálogo de productos ilimitado",
        "Carrito y checkout",
        "Integración de medios de pago",
        "Panel de administración",
        "Cálculo de envíos",
      ],
      idealPara: "Comercios y marcas que quieren vender productos online de forma autónoma.",
      paquetes: [
        { nombre: "Start", precio: "$ —", detalle: "Catálogo + carrito" },
        { nombre: "Pro", precio: "$ —", detalle: "Pagos + envíos" },
        { nombre: "Full", precio: "$ —", detalle: "A medida · integraciones" },
      ],
    },
    {
      id: "landing",
      nombre: "Landing Page",
      icono: "🚀",
      tagline: "Una página, un objetivo: convertir.",
      descripcion:
        "Páginas de aterrizaje diseñadas para una campaña o producto puntual, enfocadas 100% en generar contactos o ventas. Ideales para publicidad.",
      beneficios: [
        { titulo: "Alta conversión", detalle: "Estructura pensada para que el visitante actúe." },
        { titulo: "Lista para ads", detalle: "Perfecta para campañas de Meta y Google." },
        { titulo: "Rápida de lanzar", detalle: "Entrega ágil para no perder oportunidades." },
        { titulo: "Medible", detalle: "Lista para píxel y métricas." },
      ],
      incluye: [
        "Diseño de una sola página enfocada",
        "Copy orientado a conversión",
        "Botones de acción y WhatsApp",
        "Formulario de captación de leads",
        "Integración con píxel / analytics",
      ],
      idealPara: "Campañas publicitarias, lanzamientos de producto o promociones puntuales.",
      paquetes: [
        { nombre: "Express", precio: "$ —", detalle: "1 página estándar" },
        { nombre: "Campaña", precio: "$ —", detalle: "Copy + píxel + ads" },
      ],
    },
    {
      id: "efectos-ia",
      nombre: "Efectos IA",
      icono: "✨",
      tagline: "Experiencias con inteligencia artificial que sorprenden.",
      descripcion:
        "Incorporamos efectos e integraciones con IA en tu web: chatbots, generación de contenido, animaciones inteligentes y más. Tecnología de última generación que diferencia tu marca.",
      beneficios: [
        { titulo: "Diferenciación", detalle: "Tu marca se ve innovadora y moderna." },
        { titulo: "Atención automática", detalle: "Chatbots que responden 24/7." },
        { titulo: "Más engagement", detalle: "Efectos visuales que captan la atención." },
        { titulo: "Ahorro de tiempo", detalle: "Automatizás tareas repetitivas." },
      ],
      incluye: [
        "Chatbot con IA entrenado a tu negocio",
        "Efectos visuales / animaciones IA",
        "Generación de contenido asistida",
        "Integraciones a medida",
      ],
      idealPara: "Marcas que quieren destacarse con tecnología de punta y automatizar atención.",
      paquetes: [
        { nombre: "Chatbot", precio: "$ —", detalle: "Asistente IA en tu web" },
        { nombre: "Efectos+", precio: "$ —", detalle: "Animaciones e integraciones" },
      ],
    },
    {
      id: "turneros",
      nombre: "Turneros",
      icono: "📅",
      tagline: "Reservas y turnos online, sin WhatsApp colapsado.",
      descripcion:
        "Sistemas de turnos y reservas online para que tus clientes agenden solos. Reducís ausencias, organizás tu agenda y profesionalizás la atención.",
      beneficios: [
        { titulo: "Agenda automática", detalle: "Los clientes reservan solos, vos te liberás." },
        { titulo: "Menos ausencias", detalle: "Recordatorios y confirmaciones." },
        { titulo: "Orden total", detalle: "Toda tu agenda en un solo lugar." },
        { titulo: "Imagen pro", detalle: "Atención moderna y prolija." },
      ],
      incluye: [
        "Panel de turnos / reservas",
        "Gestión de horarios y servicios",
        "Recordatorios automáticos",
        "Vista para el cliente y para el admin",
      ],
      idealPara: "Estéticas, barberías, consultorios, estudios y cualquier negocio con agenda.",
      paquetes: [
        { nombre: "Básico", precio: "$ —", detalle: "Reservas + agenda" },
        { nombre: "Pro", precio: "$ —", detalle: "Recordatorios + multi-servicio" },
      ],
    },
  ],
};
