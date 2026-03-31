import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Calendar, Activity, Users, ArrowLeft, Mail, Phone, Clock, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'users'
    const [activeUsersCount, setActiveUsersCount] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Redirection stricte vers le login administrateur
    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuth');
        if (isAuth !== 'true') {
            navigate('/admin-login');
        }
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch appointments
            const resAppt = await fetch('/api/appointments');
            if (resAppt.ok) {
                const dataAppt = await resAppt.json();
                setAppointments(dataAppt);
            }

            // Fetch users
            const resUsers = await fetch('/api/auth/users');
            if (resUsers.ok) {
                const dataUsers = await resUsers.json();
                setUsers(dataUsers);
            }

            // Fetch active stats
            const resStats = await fetch('/api/status/active-users');
            if (resStats.ok) {
                const dataStats = await resStats.json();
                // Somme des visiteurs et des patients pour le total "Actifs"
                setActiveUsersCount(dataStats.visitors + dataStats.patients);
            }
        } catch (error) {
            console.error("Data fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => setSearchKeyword(e.target.value);

    const handleDeleteAppointment = async (id) => {
        if (window.confirm("Supprimer ce rendez-vous ?")) {
            setAppointments(appointments.filter(app => app.id !== id));
            try {
                await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
            } catch (error) { }
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const term = searchKeyword.toLowerCase();
        return app.name.toLowerCase().includes(term) || app.city.toLowerCase().includes(term);
    });

    const filteredUsers = users.filter(user => {
        const term = searchKeyword.toLowerCase();
        return (
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.phone.includes(term)
        );
    });

    return (
        <div className="min-h-screen bg-cream font-sans text-sage-dark p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="pt-4 flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sage-dark hover:text-sage font-bold transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Accueil
                    </button>
                    <div className="text-xs font-bold text-sage-light uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-sage/10">
                        Mode Administrateur
                    </div>
                </div>

                {/* Stat Cards */}
                <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-sage/10 flex items-center gap-6">
                        <div className="bg-sage/10 p-4 rounded-2xl text-sage"><Activity className="w-8 h-8" /></div>
                        <div>
                            <p className="text-xs font-bold text-sage-light uppercase">Actifs</p>
                            <p className="text-3xl font-bold">{activeUsersCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-sage/10 flex items-center gap-6">
                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-500"><Calendar className="w-8 h-8" /></div>
                        <div>
                            <p className="text-xs font-bold text-sage-light uppercase">Rendez-vous</p>
                            <p className="text-3xl font-bold">{appointments.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-sage/10 flex items-center gap-6">
                        <div className="bg-green-50 p-4 rounded-2xl text-green-500"><Users className="w-8 h-8" /></div>
                        <div>
                            <p className="text-xs font-bold text-sage-light uppercase">Utilisateurs</p>
                            <p className="text-3xl font-bold">{users.length}</p>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-sage/10 w-fit">
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'appointments' ? 'bg-sage text-white shadow-md' : 'text-sage-light hover:text-sage'}`}
                    >
                        Rendez-vous
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-sage text-white shadow-md' : 'text-sage-light hover:text-sage'}`}
                    >
                        Utilisateurs
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 pl-6 rounded-2xl shadow-sm border border-sage/20 flex items-center gap-4">
                    <Search className="w-5 h-5 text-sage-light" />
                    <input
                        type="text"
                        placeholder={activeTab === 'appointments' ? "Rechercher un patient..." : "Rechercher un utilisateur (nom, email, tel)..."}
                        className="flex-1 bg-transparent border-none outline-none font-medium"
                        value={searchKeyword}
                        onChange={handleSearch}
                    />
                </div>

                {/* Content */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-sage/10 overflow-hidden">
                    <AnimatePresence mode='wait'>
                        {activeTab === 'appointments' ? (
                            <motion.div key="appt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="p-8 border-b border-sage/5 bg-sage/5 flex items-center justify-between">
                                    <h2 className="text-2xl font-serif font-bold flex items-center gap-3"><Calendar className="w-6 h-6 text-sage" /> Gestion des RDV</h2>
                                    <span className="text-sm font-bold bg-white px-4 py-1.5 rounded-full border border-sage/10 text-sage">{filteredAppointments.length} RDV</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] uppercase tracking-widest text-sage-light border-b border-sage/5 font-bold">
                                                <th className="px-8 py-6">Patient</th>
                                                <th className="px-8 py-6">Date & Heure</th>
                                                <th className="px-8 py-6">Ville</th>
                                                <th className="px-8 py-6">Statut</th>
                                                <th className="px-8 py-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sage/5">
                                            {filteredAppointments.map(app => (
                                                <tr key={app.id} className="hover:bg-cream/30 transition-colors group">
                                                    <td className="px-8 py-6 font-bold">{app.name}</td>
                                                    <td className="px-8 py-6 text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-sage-light" /> {app.date}</td>
                                                    <td className="px-8 py-6 text-sm">{app.city}</td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'Confirmé' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button onClick={() => handleDeleteAppointment(app.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="p-8 border-b border-sage/5 bg-sage/5 flex items-center justify-between">
                                    <h2 className="text-2xl font-serif font-bold flex items-center gap-3"><Users className="w-6 h-6 text-sage" /> Répertoire des Patients</h2>
                                    <span className="text-sm font-bold bg-white px-4 py-1.5 rounded-full border border-sage/10 text-sage">{filteredUsers.length} Patients</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] uppercase tracking-widest text-sage-light border-b border-sage/5 font-bold">
                                                <th className="px-8 py-6">Nom Complet</th>
                                                <th className="px-8 py-6">Contact</th>
                                                <th className="px-8 py-6">Inscrit le</th>
                                                <th className="px-8 py-6">Rôle</th>
                                                <th className="px-8 py-6 text-right">Profil</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-sage/5">
                                            {filteredUsers.map(user => (
                                                <tr key={user._id} className="hover:bg-cream/30 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center font-bold text-sage">
                                                                {user.firstName[0]}{user.lastName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold leading-none">{user.firstName} {user.lastName}</p>
                                                                <p className="text-xs text-sage-light mt-1">ID: {user._id.substring(0, 8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 space-y-1">
                                                        <p className="text-sm flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-sage-light" /> {user.email}</p>
                                                        <p className="text-sm flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-sage-light" /> {user.phone}</p>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-sage-light">
                                                        {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2 text-sage hover:bg-sage/10 rounded-xl transition-all" title="Détails du dossier">
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
