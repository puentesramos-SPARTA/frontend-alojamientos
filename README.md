# Frontend Alojamientos — Sprint 2 (SPA Vanilla)

Incremento acumulado **Sprint 1 + Sprint 2** del frontend de `api-alojamientos`. HTML5, CSS3, Bootstrap 5, JavaScript ES Modules, Vite, `fetch`, History API. Sin React, Vue ni Angular.

## Requisitos

- Node compatible con Vite 8 (preferiblemente 22.12 o posterior), npm y Git.
- API Flask real operativa en `http://localhost:5000`; MySQL disponible y migración `003` aplicada.
- En el `.env` **del backend**: `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000`.

## Preparación

Desde este directorio:

```bash
npm ci
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

La única variable necesaria para Vite es `VITE_API_URL=http://localhost:5000`. No copie las claves MySQL ni `SECRET_KEY` del backend al frontend. Vite expone las variables con prefijo `VITE_` al navegador.

```bash
npm test
npm run dev
```

Abra `http://localhost:5173`, manteniendo Flask disponible en otra terminal. Para comprobar la compilación:

```bash
npm run build
npm run preview
```

## Vistas

- Sprint 1 público: `/`, `/alojamientos`, `/alojamientos/:id`, `/comodidades`, `/estado`.
- Sprint 2 público: `/registro`, `/login`.
- Sprint 2 protegido: `/perfil` (JWT), `/admin/usuarios` (JWT + rol `admin`).

La sesión se guarda solo en `sessionStorage` y desaparece al cerrar la pestaña. No existe logout remoto ni renovación del JWT en la API real. Para obtener un admin, registre un usuario y ejecute `python -m scripts.promover_admin admin@ejemplo.com` **en la carpeta backend** con su `.venv`; cierre sesión e inicie nuevamente para refrescar el menú si cambió el rol.

## Contratos backend

`POST /api/v1/usuarios/registro` (201/400/409), `POST /api/v1/usuarios/login` (200/401), `GET /api/v1/usuarios/perfil` (200/401), `GET /api/v1/admin/usuarios` (200/401/403). No se implementa edición de perfiles ni de roles: esas rutas no existen en el backend entregado.

## Pruebas

`npm test` debe informar **23 pruebas superadas**, incluidos los 9 casos del Sprint 1. Las pruebas automatizadas simulan llamadas a `fetch` y no sustituyen el recorrido manual completo contra Flask/MySQL. Consulte `SPRINT-02.md` y `TUTORIAL-02.md` del paquete del docente.