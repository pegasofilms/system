// Supabase Edge Function para enviar correos
// Instrucciones:
// 1. Instala Supabase CLI: npm install -g supabase
// 2. Inicia sesión: supabase login
// 3. Enlaza tu proyecto: supabase link --project-ref tu-project-ref
// 4. Configura el secret: supabase secrets set RESEND_API_KEY=tu_api_key
// 5. Despliega: supabase functions deploy send-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY no está configurado')
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    if (!resend) {
      throw new Error('Resend no está configurado. Configura RESEND_API_KEY en los secrets de Supabase.')
    }

    const { to, from, subject, html } = await req.json()

    if (!to || !Array.isArray(to) || to.length === 0) {
      throw new Error('Se requiere al menos un destinatario')
    }

    if (!from || !subject || !html) {
      throw new Error('Se requieren: from, subject, html')
    }

    // Enviar correo a cada destinatario
    const results = await Promise.all(
      to.map(email => 
        resend.emails.send({
          from: from,
          to: email,
          subject: subject,
          html: html,
        })
      )
    )

    // Verificar si hubo errores
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Errores al enviar correos:', errors)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: results.length - errors.length,
        errors: errors.length 
      }), 
      {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('Error en send-email:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    )
  }
})
