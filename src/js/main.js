import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import '../css/main.css';
import { iniciarRouter } from './router/router.js';

// Bootstrap gestiona el menú de navegación responsive; no gestiona el router SPA.
window.bootstrap = bootstrap;
iniciarRouter();