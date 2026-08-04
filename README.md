# Agents

Plataforma SaaS multiempresa para que cada cliente pueda crear, entrenar, probar y administrar sus propios agentes de inteligencia artificial.

## Primera tanda

Esta versión incluye:

- Aplicación Next.js 16 preparada para Vercel.
- Landing comercial y experiencia visual del producto.
- Registro e inicio de sesión con Supabase Auth SSR.
- Proxy de renovación de sesión compatible con Next.js 16.
- Dashboard multiempresa.
- Onboarding para crear una organización.
- Listado y creación inicial de agentes.
- Modelo de datos para organizaciones, miembros, agentes, versiones, ejecuciones y consumo.
- Políticas Row Level Security para aislar los datos de cada cliente.
- Modo demostración mientras no existan variables de Supabase.

## Stack

- Next.js 16 + React 19
- Supabase Auth + PostgreSQL + RLS
- Vercel
- GitHub

## Configuración local

1. Instala Node.js 22 o superior.
2. Instala dependencias:

```bash
npm install
```

3. Copia las variables:

```bash
cp .env.example .env.local
```

4. Crea un proyecto dedicado en Supabase.
5. Ejecuta la migración `supabase/migrations/20260804143000_initial_schema.sql`.
6. Agrega la URL y la publishable key del proyecto a `.env.local`.
7. Inicia la aplicación:

```bash
npm run dev
```

## Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
AI_GATEWAY_API_KEY=
```

Nunca agregues una secret key o `service_role` a variables con prefijo `NEXT_PUBLIC_`.

## Próxima tanda

- Constructor conversacional de agentes.
- Herramientas y catálogo de integraciones.
- Carga de documentos y base de conocimiento.
- Motor de pruebas y publicación.
- Ejecuciones, aprobaciones y trazabilidad.
