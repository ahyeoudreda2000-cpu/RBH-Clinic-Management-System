import { parse } from 'cookie';

/**
 * Logger global pour enregistrer chaque requête
 * Enregistre dans MongoDB : [Date/Heure] | User | Action | URL
 */
export const requestLogger = async (request, env) => {
    const url = new URL(request.url);
    const method = request.method;
    const dateStr = new Date().toLocaleString('fr-FR');

    // Extraire l'utilisateur (Session ou Invité)
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parse(cookieHeader);

    let user = 'Invité';
    if (cookies.sessionId) {
        user = `Session:${cookies.sessionId.substring(0, 8)}`;
    }
    // Pré-configuration de l'admin par défaut (ADMIN / RBH2026@project)
    if (cookies.role === 'ADMIN') {
        user = 'ADMIN';
    }

    const logEntry = `[${dateStr}] | Utilisateur: ${user} | Action: ${method} | URL: ${url.pathname}`;
    console.log("📝 JOURNAL DE REQUÊTE:", logEntry);

    // Enregistrement dans MongoDB (Simulation pour l'instant, à connecter avec Mongoose/MongoDB Driver)
    try {
        // Si MongoDB Atlas Data API ou mongoose:
        // await env.LogsCollection.insertOne({ log: logEntry });
    } catch (error) {
        console.error("Erreur d'enregistrement du journal:", error);
    }

    return logEntry;
};

/**
 * Middleware d'authentification pour gérer les sessions via cookies
 */
export const requireAuth = async (request) => {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parse(cookieHeader);

    if (!cookies.sessionId) {
        return new Response(JSON.stringify({
            erreur: "Non autorisé. Veuillez vous connecter."
        }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Vérification de la session en base de données à implémenter ici
    // const session = await env.ActiveSessions.findOne({ sessionId: cookies.sessionId });

    return {
        isAuthenticated: true,
        user: cookies.role === 'ADMIN' ? 'ADMIN' : 'USER'
    };
};

/**
 * Middleware spécifique pour vérifier les privilèges administrateur
 */
export const requireAdmin = async (request) => {
    const authResult = await requireAuth(request);

    // Si requireAuth retourne une Response, c'est une erreur 401
    if (authResult instanceof Response) {
        return authResult;
    }

    if (authResult.user !== 'ADMIN') {
        return new Response(JSON.stringify({
            erreur: "Accès refusé. Privilèges administrateur requis."
        }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    }

    return { isAdmin: true };
};
