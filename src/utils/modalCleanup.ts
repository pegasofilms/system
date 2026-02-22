/**
 * Elimina el backdrop de Bootstrap y restaura el body.
 * Útil cuando se navega con "Atrás" con un modal abierto y el backdrop queda colgado.
 */
export function limpiarBackdropModal(): void {
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
  document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
}
