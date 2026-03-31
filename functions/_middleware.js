import { requestLogger, requireAuth, requireAdmin } from './middleware/AuthMiddleware.js';

export const onRequest = async (context) => {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // 1. Exécuter le Logger Global sur chaque requête API
    if (url.pathname.startsWith('/api')) {
        // context.waitUntil permet d'exécuter le log sans bloquer la requête HTTP
        context.waitUntil(requestLogger(request, env));
    }

    // 2. Vérification d'authentification pour les routes protégées
    if (url.pathname.startsWith('/api/admin')) {
        const adminCheck = await requireAdmin(request);
        if (adminCheck instanceof Response) {
            return adminCheck; // Retourne 401 ou 403
        }
    } else if (url.pathname.startsWith('/api/protected')) {
        const authCheck = await requireAuth(request);
        if (authCheck instanceof Response) {
            return authCheck; // Retourne 401
        }
    }

    // 3. Continuer vers le gestionnaire de route
    return await next();
};
