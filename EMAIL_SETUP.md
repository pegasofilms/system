# Configuración de Envío de Correos

Para que el sistema envíe correos de notificación cuando se recibe una nueva solicitud de contratación, necesitas configurar un servicio de email.

## Opción 1: Supabase Edge Function (Recomendado)

### Pasos:

1. **Crear la función en Supabase:**
   - Ve a tu proyecto en Supabase
   - Ve a **Edge Functions** en el menú lateral
   - Crea una nueva función llamada `send-email`

2. **Código de la función (`send-email/index.ts`):**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const resend = new Resend(RESEND_API_KEY)

serve(async (req) => {
  try {
    const { to, from, subject, html } = await req.json()

    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: html,
    })

    if (error) {
      return new Response(JSON.stringify({ error }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

3. **Configurar Resend:**
   - Crea una cuenta en [Resend](https://resend.com)
   - Obtén tu API Key
   - En Supabase, ve a **Settings** → **Edge Functions** → **Secrets**
   - Agrega el secret: `RESEND_API_KEY` con tu API key de Resend

4. **Desplegar la función:**
   ```bash
   supabase functions deploy send-email
   ```

## Opción 2: EmailJS (Alternativa más simple)

1. **Crear cuenta en EmailJS:**
   - Ve a [EmailJS](https://www.emailjs.com/)
   - Crea una cuenta gratuita
   - Configura un servicio de email (Gmail, Outlook, etc.)
   - Crea un template de email

2. **Instalar EmailJS:**
   ```bash
   npm install @emailjs/browser
   ```

3. **Actualizar `src/utils/emailService.ts`:**
   - Descomenta y configura la sección de EmailJS
   - Agrega tu Service ID y Template ID

## Opción 3: API Propia

Puedes crear tu propia API que maneje el envío de correos usando:
- Node.js con Nodemailer
- Python con SendGrid
- Cualquier otro servicio de email

Luego actualiza `sendNotificationEmail` en `src/utils/emailService.ts` para llamar a tu API.

## Configuración Actual

El sistema está configurado para usar Supabase Edge Functions. Si prefieres otra opción, modifica el archivo `src/utils/emailService.ts`.

**Remitente configurado:** `notificacion@pegasofilms.com`

**Destinatarios:** Todos los usuarios con email en la tabla `user`
