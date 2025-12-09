// utils/rutUtils.js
export function limpiarRut(rut) {
  return rut.replace(/\./g, "").replace(/-/g, "");
}
