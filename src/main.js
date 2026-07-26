import './style.css';
import { router } from './js/router.js';
import { checkAuth } from './js/auth.js';

window.addEventListener('hashchange', router);
checkAuth();
router();
