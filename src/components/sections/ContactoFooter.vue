<template>
  <footer id="contacto" class="f-footer" role="contentinfo">
    <div class="f-footer__inner">
      <div class="f-footer__grid">
        <!-- Síguenos -->
        <section class="f-footer__block" aria-labelledby="f-siguenos-title">
          <h2 id="f-siguenos-title" class="f-footer__title">Síguenos en nuestras redes sociales</h2>
          <p class="f-footer__handle">{{ EMPRESA.usuarioRedes }}</p>
          <nav class="f-footer__nav" aria-label="Redes sociales">
            <ul class="f-footer__list f-footer__list--grid">
              <li v-for="red in EMPRESA.redesSociales" :key="red.id">
                <a
                  :href="red.url"
                  :target="red.target"
                  :rel="red.rel"
                  class="f-footer__link f-footer__link--red"
                  :class="`f-footer__link--${red.nombre.toLowerCase()}`"
                >
                  <i :class="red.icono" class="f-footer__icon" aria-hidden="true"></i>
                  <span>{{ red.nombre }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </section>

        <!-- Contrataciones -->
        <section class="f-footer__block" aria-labelledby="f-contrataciones-title">
          <h2 id="f-contrataciones-title" class="f-footer__title">Contrataciones</h2>
          <p class="f-footer__desc">Reserva tu fecha. Teléfono o WhatsApp.</p>
          <ul class="f-footer__list">
            <li>
              <a
                :href="`tel:${EMPRESA.telefono}`"
                class="f-footer__link f-footer__link--phone"
                aria-label="Llamar por teléfono"
              >
                <i class="fa-solid fa-phone f-footer__icon" aria-hidden="true"></i>
                <span>{{ EMPRESA.telefonoFormateado }}</span>
              </a>
            </li>
            <li>
              <a
                :href="urlWhatsAppContacto"
                target="_blank"
                rel="noopener noreferrer"
                class="f-footer__link f-footer__link--whatsapp"
                aria-label="Escribir por WhatsApp"
              >
                <i class="fa-brands fa-whatsapp f-footer__icon" aria-hidden="true"></i>
                <span>Escribir por WhatsApp</span>
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div class="f-footer__bottom">
        <p class="f-footer__credits">
          <img :src="logoPath" alt="" width="32" height="32" class="f-footer__logo" />
          <span class="f-footer__brand">{{ EMPRESA.nombre }}</span>
          <span class="f-footer__credits-text">Grabamos tu evento como se merece.</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EMPRESA } from '@/data/empresa';

const logoPath = `${import.meta.env.BASE_URL}img/logo.png`;

const urlWhatsAppContacto = computed(
  () => `https://wa.me/${EMPRESA.telefono}?text=${encodeURIComponent(EMPRESA.whatsappMensajeCotizar)}`
);
</script>

<style scoped>
.f-footer {
  margin-top: auto;
  background: #1a202c;
  color: #f7fafc;
  --muted: #a0aec0;
  --border: rgba(255, 255, 255, 0.08);
}

.f-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1rem;
}

.f-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 0.5rem;
  align-items: start;
}

@media (min-width: 640px) {
  .f-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem 2rem;
  }
}

.f-footer__block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
  min-width: 0;
}

.f-footer__title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0;
  line-height: 1.2;
}

.f-footer__handle,
.f-footer__desc {
  font-size: 0.9375rem;
  margin: 0;
}

.f-footer__handle { color: #f7fafc; font-weight: 500; }
.f-footer__desc { color: var(--muted); }

.f-footer__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.f-footer__list--grid {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-self: stretch;
}

.f-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.9375rem;
  line-height: 1.3;
  text-decoration: none;
  color: var(--muted);
  transition: color 0.2s;
}

.f-footer__link:hover { color: #f7fafc; text-decoration: underline; }
.f-footer__link:focus-visible { outline: 2px solid #f7fafc; outline-offset: 2px; }

.f-footer__icon { flex-shrink: 0; width: 1rem; }

/* Colores por red/contacto */
.f-footer__link--youtube { color: #ff4444; }
.f-footer__link--youtube:hover { color: #ff6b6b; }
.f-footer__link--live { color: #ff6b6b; }
.f-footer__link--live:hover { color: #ff8787; }
.f-footer__link--facebook { color: #1877f2; }
.f-footer__link--facebook:hover { color: #4d9aff; }
.f-footer__link--tiktok { color: #fff; }
.f-footer__link--tiktok:hover { color: #00f2ea; }
.f-footer__link--instagram { color: #e4405f; }
.f-footer__link--instagram:hover { color: #f77737; }
.f-footer__link--phone,
.f-footer__link--whatsapp { color: #25d366; }
.f-footer__link--phone:hover,
.f-footer__link--whatsapp:hover { color: #3ee67c; }

.f-footer__bottom {
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.f-footer__credits {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem 0.5rem;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--muted);
}

.f-footer__logo { display: block; border-radius: 0.5rem; }
.f-footer__brand { font-weight: 600; color: #f7fafc; }
</style>
