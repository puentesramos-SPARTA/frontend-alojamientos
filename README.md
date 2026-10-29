# Frontend Alojamientos — Sprint 1

SPA pública construida desde cero con **HTML5, CSS3, JavaScript ES Modules, Bootstrap 5 y Vite**, sin React. Consume la API Flask del proyecto `api-alojamientos` (backend final hasta su Sprint 3).

## Preparación

1. Inicie MySQL y el backend Flask en `http://localhost:5000` y compruebe `GET /health`.
2. Requiera Node.js compatible con Vite 8 (por ejemplo 22.12+).
3. Instale dependencias con `npm ci` (o `npm install` si ha regenerado el lockfile).
4. Cree `.env` a partir de `.env.example` y deje `VITE_API_URL=http://localhost:5000`.
5. Ejecute `npm run dev` y abra `http://localhost:5173`.

```bash
npm ci
npm run dev
```

Otros comandos: `npm test` (9 tests automatizados), `npm run build` (genera `dist/`), `npm run preview` (vista previa de build).

## Contrato HTTP de este sprint

| Método | Ruta Flask | Vista |
|---|---|---|
| GET | `/health` | Inicio, Estado |
| GET | `/api/v1/alojamientos` | Catálogo |
| GET | `/api/v1/alojamientos/:id` | Detalle |
| GET | `/api/v1/comodidades` | Comodidades |

El estado se obtiene de Flask: no hay datos simulados. Si MySQL no tiene alojamientos, la lista estará vacía. Para poblarla siga los pasos de Postman del tutorial. El backend permite por defecto el origen `http://localhost:5173`; no use `127.0.0.1:5173` sin configurar CORS adicionalmente.

## Alcance

Incluye navegación SPA con History API, tarjetas ilustrativas CSS, filtro cliente por ciudad/título, control de errores y cancelación de solicitudes anteriores. **No incluye** autenticación, acciones de escritura, reservas ni subida de imágenes. Las funciones protegidas se incorporarán en los Sprints 2 y 3.

**Seguridad:** nunca coloque secretos en variables `VITE_*`; son públicas en el navegador. `package-lock.json` se versiona y `.env`, `node_modules/` y `dist/` se excluyen.

## Estructura

- `src/js/api/`: peticiones a las rutas reales de Flask.
- `src/js/components/`: navbar, footer, tarjetas, estados.
- `src/js/pages/`: vistas públicas.
- `src/js/router/`: mapa URL-vista y History API.
- `src/js/utils/`: escape HTML, moneda, resumen.
- `src/css/main.css`: diseño responsive.
- `tests/`: pruebas Node sin dependencias externas de testing.

La ruta directa `/alojamientos/1` funciona con Vite en desarrollo. Al desplegar en otro hosting, configure reescritura de rutas SPA hacia `index.html`.