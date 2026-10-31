# Frontend Alojamientos — Sprint 3 (SPA Vanilla)

Aplicación HTML/CSS/JavaScript (módulos ES), Bootstrap 5 y Vite. **Continúa el mismo repositorio del Sprint 2** y consume exclusivamente la API Flask Alojamientos.

## Requisitos
- Node.js compatible con la versión de Vite especificada en `package.json` (Vite 8 requiere Node >=20.19 o >=22.12).
- MySQL iniciado, API Flask del Sprint 3 ejecutándose en `http://localhost:5000`, migraciones 001/002/003 aplicadas.
- Un usuario normal y otro promovido a `admin` con el script del backend.

## Inicio
```bash
npm ci
cp .env.example .env
npm run dev
```
En Windows PowerShell: `Copy-Item .env.example .env`. Revise `VITE_API_URL` antes de iniciar.

## Pruebas y compilación
```bash
npm test
npm run build
npm run preview
```

## Rutas incorporadas en Sprint 3
- `/mis-alojamientos` protegido; filtra el catálogo público por `usuario_id` del usuario autenticado.
- `/alojamientos/nuevo` protegido; `POST /api/v1/alojamientos`.
- `/alojamientos/:id/editar` protegido; `PATCH` alojamiento, `PATCH` comodidades, `DELETE` alojamiento.
- `/admin/comodidades/nueva` solo admin; `POST /api/v1/comodidades`.

## Limitaciones reales del backend
- No tiene reservas, pagos, subida de fotografías, edición de perfil ni endpoints `GET /mis-alojamientos`, `GET /comodidades/:id`.
- `PATCH /alojamientos/:id/comodidades` **reemplaza** la lista; use `[]` para quitar todas las asociaciones.
- El filtrado y la ocultación de botones en el navegador **no son seguridad**: Flask autoriza cada operación con JWT y roles/propiedad.
- La sesión usa `sessionStorage` y el JWT puede expirar a los 15 minutos. Inicie sesión nuevamente si recibe 401.
- Si promueve al usuario admin después de iniciar sesión, vuelva a entrar para refrescar el rol visual almacenado por el frontend.