import { solicitarJSON } from './http.js';
import { obtenerToken } from '../state/sesion.js';

/** Registro 201 {success,data:{id,correo,rol}}; errores 400 o 409. */
export function registrarUsuario(datos, signal) {
  return solicitarJSON('/api/v1/usuarios/registro', { method: 'POST', body: datos, signal });
}

/** Login 200 {success,data:{access_token,usuario}}; error 401. */
export function iniciarSesionAPI(datos, signal) {
  return solicitarJSON('/api/v1/usuarios/login', { method: 'POST', body: datos, signal });
}

/** Perfil 200 {success,data:{id,nombre,apellido,telefono,usuario_id}}. */
export function consultarPerfil(signal) {
  return solicitarJSON('/api/v1/usuarios/perfil', { token: obtenerToken(), signal });
}

/** Administración 200 {success,data:[{id,correo,rol}]}; error 403. */
export function listarUsuariosAdmin(signal) {
  return solicitarJSON('/api/v1/admin/usuarios', { token: obtenerToken(), signal });
}