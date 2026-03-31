import { MongoClient } from 'mongodb';

let client;
let dbInstance;

/**
 * Connect to MongoDB using the standard URI.
 * Cloudflare Workers now support TCP connections, which allows using the standard driver.
 */
export async function connectToDatabase(env) {
    if (dbInstance) return dbInstance;

    if (!env.MONGO_URI) {
        throw new Error("MONGO_URI est manquante dans les variables d'environnement Cloudflare.");
    }

    if (!client) {
        client = new MongoClient(env.MONGO_URI);
    }

    try {
        await client.connect();
        dbInstance = client.db(env.MONGODB_DATABASE || 'rbh-clinic');
        console.log("✅ Connecté à MongoDB via standard URI");
        return dbInstance;
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB:", error);
        throw error;
    }
}

export const db = {
    getCollection: async (name, env) => {
        const database = await connectToDatabase(env);
        return database.collection(name);
    }
};
