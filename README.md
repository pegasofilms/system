# PEGASO FILMS - Sistema de Gestión

Sistema de gestión de contratos y eventos para PEGASO FILMS.

## Configuración de Variables de Entorno

### Desarrollo Local

1. Crea un archivo `.env.local` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=https://nrqnrfkobcvhuhbexipv.supabase.co
VITE_SUPABASE_KEY=sb_publishable_XKvkpNi_YwSTT27D56VZgQ_ts-6ncku
```

### GitHub Pages (Producción)

Las variables de entorno se configuran usando **GitHub Secrets**:

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret**
4. Agrega los siguientes secrets:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://nrqnrfkobcvhuhbexipv.supabase.co`
   
   - **Name:** `VITE_SUPABASE_KEY`
   - **Value:** `sb_publishable_XKvkpNi_YwSTT27D56VZgQ_ts-6ncku`

5. El workflow de GitHub Actions usará automáticamente estos secrets al hacer el build

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tecnologías

- Vue 3
- TypeScript
- Supabase
- Bootstrap 5
- PrimeVue
