import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Veuillez entrer votre adresse e-mail.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Veuillez entrer une adresse e-mail valide.');
            return;
        }

        // Simulation API call pour la demande de récupération
        setError('');
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white max-w-md w-full rounded-2xl shadow-lg border border-sage-light/20 p-8"
            >
                <button
                    className="mb-8 cursor-pointer text-sage-light hover:text-sage transition-colors inline-flex items-center text-sm font-medium focus:outline-none"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la connexion
                </button>

                {isSubmitted ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <div className="mx-auto w-16 h-16 bg-[#E8F3EB] rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8 text-[#2D5A3A]" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-sage-dark">Vérifiez vos e-mails</h2>
                        <p className="text-sage-light leading-relaxed">
                            Nous avons envoyé un lien de réinitialisation à l'adresse
                            <span className="font-semibold text-sage block mt-1">{email}</span>
                        </p>
                        <p className="text-sm text-sage-light mt-4">Veuillez vérifier votre boîte de réception (et vos spams).</p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 text-sm text-sage font-bold hover:underline focus:outline-none"
                        >
                            Vous n'avez rien reçu ? Réessayer
                        </button>
                    </motion.div>
                ) : (
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-sage-dark mb-3">Mot de passe oublié ?</h2>
                        <p className="text-sage-light mb-8">
                            Saisissez l'adresse e-mail associée à votre compte pour recevoir un lien de réinitialisation sécurisé.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-sage-dark" htmlFor="email">
                                    Adresse e-mail
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sage-light">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-400 focus:ring-red-400' : 'border-sage/20 focus:border-sage focus:ring-1 focus:ring-sage'} rounded-xl bg-transparent text-sage-dark placeholder-sage-light/50 focus:outline-none transition-all`}
                                        placeholder="prenom.nom@exemple.com"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3.5 rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2"
                            >
                                Envoyer le lien de réinitialisation
                            </button>
                        </form>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
