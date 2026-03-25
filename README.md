# RecurreYa 🚗⚖️

Plataforma SaaS española que analiza multas de tráfico con IA y genera escritos de recurso profesionales por 4,99€ (modelo pay-per-use).

## Stack técnico

- **Frontend + Backend** — Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Base de datos** — Supabase (PostgreSQL + Storage)
- **Pagos** — Stripe
- **IA** — Anthropic Claude (extracción PDF + generación escrito), Groq (análisis previo)
- **Emails** — Resend
- **Deploy** — Vercel

## Flujo de la aplicación

1. Usuario introduce su multa (subiendo PDF o rellenando manualmente)
2. La IA analiza el expediente y detecta argumentos legales (gratuito)
3. Si hay argumentos, el usuario paga 4,99€
4. La IA genera un escrito de recurso profesional en PDF
5. El usuario descarga el PDF y recibe instrucciones de presentación por email

## Tipos de multa soportados

- Velocidad por radar (fijo, móvil y de tramo)
- Semáforo en rojo
- Estacionamiento indebido
- Uso del móvil / cinturón
- ZBE Madrid (Zona de Bajas Emisiones)

## Variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# IA
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=
GROQ_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# Resend
RESEND_API_KEY=

# Upstash (Rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PRECIO=4.99
```

## Instalación

```bash
git clone https://github.com/GiovannyPanesso/recurreya.git
cd recurreya
npm install
npm run dev
```

## Estructura del proyecto

```
src/
├── app/
│   ├── (legal)/          # Páginas legales
│   ├── api/              # API routes
│   ├── multa/            # Flujo principal
│   └── resultado/        # Pantalla post-pago
├── components/
│   ├── ui/               # Componentes reutilizables
│   └── form/             # Steps del formulario
├── lib/
│   ├── supabase/         # Cliente Supabase
│   ├── ai/               # Proveedores de IA
│   ├── email/            # Plantillas de email
│   └── pdf/              # Generación de PDF
├── types/                # Tipos TypeScript
└── utils/                # Utilidades
```

## Aviso legal

RecurreYa es una herramienta de redacción asistida por IA. No es un despacho de abogados y no garantiza el resultado del recurso.
