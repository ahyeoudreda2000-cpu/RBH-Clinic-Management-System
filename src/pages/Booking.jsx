import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay, addDays, getDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppointmentCountdown from '../components/AppointmentCountdown';

const Booking = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [city, setCity] = useState('Casablanca');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [existingAppointment, setExistingAppointment] = useState(null);
    const [checkingAppointment, setCheckingAppointment] = useState(true);

    useEffect(() => {
        try {
            const rawUser = localStorage.getItem('user');
            const rawToken = localStorage.getItem('token');
            const rawAuth = localStorage.getItem('isAuthenticated');

            if (!rawToken || !rawAuth || rawAuth !== 'true') {
                navigate('/login');
                return;
            }

            if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
                const parsed = JSON.parse(rawUser);
                setUser(parsed);
                fetchUserAppointment(`${parsed.firstName} ${parsed.lastName}`);
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Booking Init Error:', err);
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserAppointment = async (fullName) => {
        try {
            const response = await fetch(`/api/appointments/my/${encodeURIComponent(fullName)}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setExistingAppointment(data[0]);
                }
            }
        } catch (err) {
            console.error('Erreur lors de la récupération du RDV:', err);
        } finally {
            setCheckingAppointment(false);
        }
    };

    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    const days = currentMonth ? eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    }) : [];

    const firstDayOffset = days.length > 0 ? (getDay(days[0]) + 6) % 7 : 0;

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            setError('Veuillez choisir une date et une heure.');
            return;
        }

        setLoading(true);
        setError('');

        const appointmentDate = `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`;

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: `${user.firstName} ${user.lastName}`,
                    date: appointmentDate,
                    city: city
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 3000);
            } else {
                const data = await response.json();
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-sage animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-sans p-6 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 bg-white rounded-2xl border border-sage/10 text-sage hover:bg-sage/5 transition-all outline-none"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-sage-dark">Mon Espace Santé</h1>
                        <p className="text-sage-light">Bonjour {user.firstName}, bienvenue sur votre portail.</p>
                    </div>
                </div>

                {existingAppointment ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-sage/10 p-6 rounded-[2rem] border border-sage/20 text-center">
                            <p className="text-sage font-bold">Vous avez un rendez-vous programmé.</p>
                        </div>

                        <AppointmentCountdown
                            targetDate={new Date(existingAppointment.date.replace(' ', 'T'))}
                            location={`Clinique RBH - ${existingAppointment.city}`}
                        />

                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => setExistingAppointment(null)}
                                className="px-8 py-4 bg-white border border-sage/20 text-sage rounded-2xl font-bold hover:bg-sage/5 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <CalendarIcon className="w-5 h-5" /> Prendre un autre rendez-vous
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {!checkingAppointment && (
                            <div className="bg-white/50 p-6 rounded-[2rem] border border-dashed border-sage/30 text-center">
                                <p className="text-sage-light font-medium italic">
                                    "Vous n'avez pas encore de rendez-vous. Prenez-en un dès maintenant pour assurer votre suivi médical."
                                </p>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Calendar Column */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sage/10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="font-bold text-sage-dark text-xl flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-sage" />
                                        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-cream rounded-full transition-colors text-sage-dark outline-none"><ChevronLeft className="w-5 h-5" /></button>
                                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-cream rounded-full transition-colors text-sage-dark outline-none"><ChevronRight className="w-5 h-5" /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[10px] font-bold uppercase text-sage-light tracking-widest">
                                    {['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'].map(d => <div key={d}>{d}</div>)}
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                                    {days.map((day, idx) => {
                                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                                        const isPast = isBefore(day, startOfDay(new Date()));
                                        const isWeekend = getDay(day) === 0 || getDay(day) === 6;
                                        return (
                                            <button
                                                key={idx}
                                                disabled={isPast || isWeekend}
                                                onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                                                className={`aspect-square rounded-2xl flex items-center justify-center font-bold text-sm transition-all relative outline-none ${isSelected ? 'bg-sage text-white shadow-lg shadow-sage/30 scale-105' : isPast || isWeekend ? 'text-sage-light/30 cursor-not-allowed' : 'hover:bg-cream text-sage-dark'}`}
                                            >
                                                {format(day, 'd')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Selection Column */}
                            <div className="space-y-6">
                                <AnimatePresence mode='wait'>
                                    {selectedDate ? (
                                        <motion.div key="time" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-sage/10">
                                            <h3 className="font-bold text-sage-dark text-xl mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-sage" /> Heures Disponibles</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {timeSlots.map(time => (
                                                    <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-2xl font-bold text-sm transition-all outline-none ${selectedTime === time ? 'bg-sage text-white shadow-md' : 'bg-cream/50 text-sage-dark hover:bg-cream'}`}>{time}</button>
                                                ))}
                                            </div>
                                            <div className="mt-8">
                                                <label className="block text-sm font-bold text-sage-dark mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-sage" /> Ville</label>
                                                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-4 bg-cream/30 border border-sage-light/30 rounded-2xl text-sage-dark font-medium focus:ring-2 focus:ring-sage outline-none transition-all">
                                                    <option value="Casablanca">Casablanca</option>
                                                    <option value="Rabat">Rabat</option>
                                                    <option value="Marrakech">Marrakech</option>
                                                    <option value="Tanger">Tanger</option>
                                                </select>
                                            </div>
                                            {error && <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-3"><AlertCircle className="w-5 h-5" />{error}</div>}
                                            <button disabled={loading || !selectedTime} onClick={handleBooking} className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2 outline-none ${loading || !selectedTime ? 'bg-sage/40 text-white cursor-not-allowed' : 'bg-sage text-white hover:bg-sage-dark active:scale-[0.98]'}`}>
                                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirmer le Rendez-vous</>}
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className="bg-sage/5 rounded-[2.5rem] p-12 border border-dashed border-sage/30 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6"><CalendarIcon className="w-10 h-10 text-sage/30" /></div>
                                            <h3 className="text-xl font-bold text-sage-dark mb-2">Aucune date choisie</h3>
                                            <p className="text-sage-light max-w-[240px]">Sélectionnez un jour sur le calendrier pour voir les créneaux.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-sage-dark/60 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-green-500" /></div>
                            <h2 className="text-3xl font-serif font-bold text-sage-dark mb-4">C'est confirmé !</h2>
                            <p className="text-sage-light mb-8">Votre rendez-vous a été enregistré avec succès.</p>
                            <div className="bg-cream rounded-3xl p-6 text-left space-y-3 mb-8 text-sage-dark font-bold">
                                <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-sage" />{selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : ''}</div>
                                <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-sage" />{selectedTime}</div>
                                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-sage" />Clinique RBH - {city}</div>
                            </div>
                            <p className="text-xs text-sage-light animate-pulse">Redirection vers l'accueil...</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Booking;
