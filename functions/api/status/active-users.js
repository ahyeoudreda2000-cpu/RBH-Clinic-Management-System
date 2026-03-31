export const onRequestGet = async (context) => {
    // Dans un environnement Serverless pur, le suivi en temps réel nécessite un état partagé 
    // (ex: Durable Objects ou Redis). Ici on retourne une réponse simulée cohérente.
    
    return new Response(JSON.stringify({ 
        visitors: 8, 
        patients: 4,
        total: 12
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
