import { supabase } from './supabase';

interface Contrato {
  id: number;
  tipo_evento: string;
  fecha_evento: string;
  hora_evento?: string;
  lugar?: string;
  descripcion?: string;
  paquete?: string;
  precio?: number;
  contratante: string;
  telefono: string;
  padrinos?: string;
  padres?: string;
  festejado?: string;
  notas?: string;
}

/**
 * Obtiene todos los emails de los usuarios del sistema
 */
async function getUsersEmails(): Promise<string[]> {
  const { data, error } = await supabase
    .from('user')
    .select('email')
    .not('email', 'is', null);

  if (error) {
    console.error('Error al obtener emails:', error);
    return [];
  }

  return data.map(user => user.email).filter((email): email is string => email !== null);
}

/**
 * Formatea el contrato para el correo
 */
function formatContratoForEmail(contrato: Contrato): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  let emailBody = `
    <h2>Nueva Solicitud de Contratación - PEGASO FILMS</h2>
    <p>Se ha recibido una nueva solicitud de contratación:</p>
    
    <h3>Información del Evento</h3>
    <ul>
      <li><strong>Tipo de Evento:</strong> ${contrato.tipo_evento}</li>
      <li><strong>Fecha:</strong> ${formatDate(contrato.fecha_evento)}</li>
      ${contrato.hora_evento ? `<li><strong>Hora:</strong> ${contrato.hora_evento}</li>` : ''}
      ${contrato.lugar ? `<li><strong>Lugar:</strong> ${contrato.lugar}</li>` : ''}
      ${contrato.paquete ? `<li><strong>Paquete:</strong> ${contrato.paquete}</li>` : ''}
      ${contrato.precio ? `<li><strong>Presupuesto:</strong> ${formatCurrency(contrato.precio)}</li>` : ''}
    </ul>

    <h3>Información del Contratante</h3>
    <ul>
      <li><strong>Nombre:</strong> ${contrato.contratante}</li>
      <li><strong>Teléfono:</strong> ${contrato.telefono}</li>
    </ul>
  `;

  if (contrato.padrinos || contrato.padres || contrato.festejado) {
    emailBody += `<h3>Información Adicional</h3><ul>`;
    if (contrato.padrinos) emailBody += `<li><strong>Padrinos:</strong> ${contrato.padrinos}</li>`;
    if (contrato.padres) emailBody += `<li><strong>Padres:</strong> ${contrato.padres}</li>`;
    if (contrato.festejado) emailBody += `<li><strong>Festejado:</strong> ${contrato.festejado}</li>`;
    emailBody += `</ul>`;
  }

  if (contrato.descripcion) {
    emailBody += `<h3>Descripción</h3><p>${contrato.descripcion}</p>`;
  }

  if (contrato.notas) {
    emailBody += `<h3>Notas Adicionales</h3><p>${contrato.notas}</p>`;
  }

  emailBody += `<hr><p><small>ID del Contrato: ${contrato.id}</small></p>`;

  return emailBody;
}

/**
 * Envía correos de notificación a todos los usuarios
 */
export async function sendNotificationEmail(contrato: Contrato): Promise<void> {
  const emails = await getUsersEmails();

  if (emails.length === 0) {
    console.warn('No se encontraron emails de usuarios para notificar');
    return;
  }

  const emailBody = formatContratoForEmail(contrato);
  const subject = `Nueva Solicitud: ${contrato.tipo_evento} - ${contrato.contratante}`;
  const fromEmail = 'notificacion@pegasofilms.com';

  // NOTA: Para enviar correos, necesitas configurar un servicio de email.
  // Opciones:
  // 1. Supabase Edge Function con Resend/SendGrid
  // 2. EmailJS
  // 3. API propia con servicio de email

  // Por ahora, usaremos una función de Supabase Edge Function
  // Asegúrate de crear esta función en Supabase

  try {
    // Llamar a la función de Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: emails,
        from: fromEmail,
        subject: subject,
        html: emailBody
      }
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }

    console.log('Correos enviados exitosamente:', data);
  } catch (error) {
    // Si no hay función de Supabase, intentar con EmailJS o otro servicio
    console.warn('No se pudo enviar correo a través de Supabase Function. Configura el servicio de email.');
    
    // Alternativa: usar EmailJS directamente desde el cliente
    // Esto requiere configurar EmailJS (https://www.emailjs.com/)
    // Descomenta y configura si prefieres esta opción:
    /*
    if (window.emailjs) {
      for (const email of emails) {
        await window.emailjs.send(
          'YOUR_SERVICE_ID',
          'YOUR_TEMPLATE_ID',
          {
            to_email: email,
            from_email: fromEmail,
            subject: subject,
            message: emailBody
          }
        );
      }
    }
    */
  }
}
