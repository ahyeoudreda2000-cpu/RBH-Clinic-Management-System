import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Heart, PhoneCall, ChevronRight, Activity, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const [statusData, setStatusData] = useState({ visitors: 1, patients: 0 });

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/status/active-users', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStatusData(data);
                }
            } catch (err) {
                console.error('Error fetching online users:', err);
            }
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 15000); // Update every 15s
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-cream font-sans text-sage-dark overflow-x-hidden selection:bg-sage/20">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-sage/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center shadow-lg shadow-sage/30">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <span className="font-serif text-2xl font-bold text-sage-dark tracking-tight">
                            Clinique <span className="text-sage">RBH</span>
                        </span>

                        <div className="hidden lg:flex items-center gap-4 ml-4 border-l border-sage/10 pl-4 py-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse outline outline-2 outline-green-500/20"></div>
                                <span className="text-[10px] font-bold text-sage-dark uppercase tracking-widest">{statusData.patients} <span className="text-sage-light font-normal text-[8px]">Patients</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-sage-light/30"></div>
                                <span className="text-[10px] font-bold text-sage-light uppercase tracking-widest">{statusData.visitors} <span className="text-sage-light font-normal text-[8px]">Visiteurs</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold">
                        <a href="#services" className="text-sage-dark hover:text-sage transition-colors">Services</a>
                        <a href="#doctors" className="text-sage-dark hover:text-sage transition-colors">Nos Médecins</a>
                        {isAuthenticated && (
                            <Link to="/booking" className="text-sage font-bold hover:underline">Mes Rendez-vous</Link>
                        )}
                        <Link to={isAuthenticated ? "/booking" : "/login"} className="px-6 py-2.5 bg-sage text-white rounded-full hover:bg-sage-dark hover:shadow-lg hover:shadow-sage/20 transition-all active:scale-95">
                            {isAuthenticated ? "Mon Espace" : "Portail Patient"}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-sage/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-sage/5 rounded-full blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="space-y-8 relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sage/10 shadow-sm text-xs font-bold text-sage uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Soins Médicaux d'Excellence
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-sage-dark leading-[1.1]">
                            Votre Santé, Notre <span className="text-sage relative">
                                Priorité
                                <svg className="absolute -bottom-2 w-full h-3 text-sage/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg text-sage-light max-w-lg leading-relaxed">
                            Découvrez une approche médicale humaine, moderne et personnalisée. Notre équipe de spécialistes dévoués vous accompagne à chaque étape de votre vie.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link to={isAuthenticated ? "/booking" : "/register"} className="px-8 py-4 bg-sage text-white font-bold rounded-full hover:bg-sage-dark hover:shadow-xl hover:shadow-sage/20 transition-all active:scale-95 flex items-center gap-2 group">
                                Prendre Rendez-vous
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#services" className="px-8 py-4 bg-white text-sage font-bold rounded-full border border-sage/10 hover:border-sage/30 hover:bg-sage/5 transition-all">
                                Nos Services
                            </a>
                        </div>

                        <div className="pt-8 flex items-center gap-6 border-t border-sage/10">
                            <div className="flex items-center -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-cream bg-sage/10 flex items-center justify-center font-bold text-xs text-sage z-[${10 - i}]`}>
                                        <Users className="w-4 h-4 opacity-50" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-sage-dark">Plus de 10,000 patients</p>
                                <p className="text-sage-light">Nous font confiance chaque année</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                            {/* URL placeholder till I embed the image */}
                            <img
                                src="/images/clinic_hero.png"
                                alt="Équipe médicale de la clinique RBH"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/60 via-transparent to-transparent"></div>

                            {/* Floating info card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-sage" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sage-dark text-lg">Urgences 24/7</p>
                                        <p className="text-sm text-sage-light">Notre service d'urgence est toujours disponible.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[radial-gradient(circle,_#8C6018_2px,_transparent_2px)] bg-[size:8px_8px] opacity-20"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sage rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
                    </motion.div>
                </div>
            </section>

            {/* Pourquoi Nous Choisir */}
            <section id="services" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-sage font-bold tracking-widest uppercase text-xs mb-3 block">Pourquoi RBH ?</span>
                        <h2 className="text-4xl font-serif font-bold text-sage-dark mb-6">L'Excellence Médicale à Votre Portée</h2>
                        <p className="text-sage-light">Nous combinons l'expertise de nos spécialistes avec des technologies de pointe pour vous offrir les meilleurs soins possibles.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Sécurité & Qualité", desc: "Nos protocoles stricts garantissent votre sécurité avec des équipements de dernière génération." },
                            { icon: Heart, title: "Soins Personnalisés", desc: "Chaque patient est unique. Nous adaptons nos traitements à vos besoins spécifiques." },
                            { icon: Calendar, title: "Prise de RDV Facile", desc: "Gérez vos rendez-vous médicaux en quelques clics via notre portail en ligne." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-cream/50 p-8 rounded-[2rem] border border-sage/10 hover:border-sage/30 hover:bg-cream transition-all group"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-sage" />
                                </div>
                                <h3 className="text-xl font-bold text-sage-dark mb-3">{feature.title}</h3>
                                <p className="text-sage-light leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Famille (Image générée 2) */}
            <section className="py-24 bg-sage-dark relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-5 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1 relative"
                    >
                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                            {/* L'image de la famille patient et medecin sera placée ici */}
                            <img
                                src="/images/clinic_family.png"
                                id="family-image-placeholder"
                                alt="Pédiatrie de la clinique RBH avec une famille heureuse"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative Badge */}
                        <div className="absolute -top-6 -left-6 bg-white text-sage-dark p-6 rounded-3xl shadow-xl max-w-[200px]">
                            <Heart className="w-8 h-8 text-red-400 mb-3" />
                            <p className="font-bold text-lg leading-tight">Des soins pour toute la famille</p>
                        </div>
                    </motion.div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <span className="text-[#E8F3EB] font-bold tracking-widest uppercase text-xs mb-3 block">Pôle Pédiatrique & Familial</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">La Santé de vos Proches entre de Bonnes Mains</h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Nous comprenons que rien n'est plus important que la santé de votre famille. Notre département de pédiatrie et de médecine générale offre un environnement rassurant et chaleureux pour les petits comme pour les grands.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Consultations pédiatriques spécialisées",
                                "Espaces de jeu et salles d'attente dédiées aux enfants",
                                "Bilans de santé familiaux complets",
                                "Accompagnement parental expert"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/90">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer Demos */}
            <footer className="bg-white pt-20 pb-10 border-t border-sage/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center">
                                    <Activity className="text-white w-6 h-6" />
                                </div>
                                <span className="font-serif text-2xl font-bold text-sage-dark">
                                    Clinique RBH
                                </span>
                            </div>
                            <p className="text-sage-light max-w-md mb-6 leading-relaxed">
                                Votre centre d'excellence médicale à Casablanca. Nous offrons des soins innovants avec compassion et dévouement professionnel.
                            </p>
                            <div className="flex items-center gap-4 text-sage-dark font-bold">
                                <PhoneCall className="w-5 h-5 text-sage" />
                                +212 522 00 00 00
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-sage-dark mb-6">Liens de Navigation</h4>
                            <ul className="space-y-4 text-sage-light">
                                <li><a href="#services" className="hover:text-sage transition-colors">Services</a></li>
                                <li><a href="#doctors" className="hover:text-sage transition-colors">Équipe Médicale</a></li>
                                <li><a href="#about" className="hover:text-sage transition-colors">À Propos de Nous</a></li>
                                <li><a href="#contact" className="hover:text-sage transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-sage-dark mb-6">Mon Compte</h4>
                            <ul className="space-y-4">
                                {isAuthenticated ? (
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="text-red-500 font-bold hover:underline flex items-center gap-2"
                                        >
                                            <ChevronRight className="w-4 h-4" /> Déconnexion
                                        </button>
                                    </li>
                                ) : (
                                    <li>
                                        <Link to="/login" className="text-sage font-bold hover:underline flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4" /> Espace Patient (Connexion)
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-sage/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-sage-light gap-4">
                        <p>© 2026 Clinique RBH System. Tous droits réservés.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-sage transition-colors">Politique de Confidentialité</a>
                            <a href="#" className="hover:text-sage transition-colors">Mentions Légales</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
