/* Evita el parpadeo en español cuando el visitante ya eligió inglés. */
try { if (localStorage.getItem('md-lang') === 'en') document.documentElement.classList.add('i18n-pending'); } catch (e) {}
