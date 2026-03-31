import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { format, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

// Eviter la recréation de l'objet Date à chaque rendu pour ne pas causer de boucle infinie
const defaultTargetDate = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000);

const AppointmentCountdown = ({
    targetDate = defaultTargetDate, // Défaut: +15 jours
    doctorName = "Dr. Bennani",
    specialty = "Cardiologie",
    location = "Clinique RBH - Casablanca"
}) => {
    const [timeLeft, setTimeLeft] = useState({ months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            if (targetDate <= now) {
                return { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            const months = differenceInMonths(targetDate, now);
            const afterMonths = new Date(now).setMonth(now.getMonth() + months);

            const weeks = differenceInWeeks(targetDate, afterMonths);
            const afterWeeks = new Date(afterMonths).setDate(new Date(afterMonths).getDate() + weeks * 7);

            const days = differenceInDays(targetDate, afterWeeks);
            const afterDays = new Date(afterWeeks).setDate(new Date(afterWeeks).getDate() + days);

            const hours = differenceInHours(targetDate, afterDays);
            const afterHours = new Date(afterDays).setHours(new Date(afterDays).getHours() + hours);

            const minutes = differenceInMinutes(targetDate, afterHours);
            const afterMinutes = new Date(afterHours).setMinutes(new Date(afterHours).getMinutes() + minutes);

            const seconds = differenceInSeconds(targetDate, afterMinutes);

            return { months, weeks, days, hours, minutes, seconds };
        };

        setTimeLeft(calculateTimeLeft());
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate ? new Date(targetDate).getTime() : 0]);

    const TimeBlock = ({ value, label }) => (
        <div className="flex flex-col items-center justify-center py-3 px-4 bg-white rounded-2xl shadow-sm border border-sage/10 min-w-[5rem]">
            <span className="text-3xl font-bold font-serif text-sage-dark tabular-nums leading-none">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-sage-light uppercase tracking-widest mt-2">{label}</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cream p-7 sm:p-9 rounded-[32px] shadow-sm border border-sage/20 max-w-2xl mx-auto w-full"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="font-serif text-2xl font-bold text-sage mb-2">Votre prochain rendez-vous</h3>
                    <p className="text-sage-light font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(targetDate, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </p>
                </div>
                <div className="bg-white/80 px-4 py-2 rounded-full border border-sage/10 flex items-center gap-2 text-sm text-sage-dark font-bold shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                    Confirmé
                </div>
            </div>

            {/* Le Compteur */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mb-10">
                {timeLeft.months > 0 && <TimeBlock value={timeLeft.months} label="Mois" />}
                {(timeLeft.weeks > 0 || timeLeft.months > 0) && <TimeBlock value={timeLeft.weeks} label="Sem." />}
                <TimeBlock value={timeLeft.days} label="Jours" />
                <TimeBlock value={timeLeft.hours} label="Heures" />
                <TimeBlock value={timeLeft.minutes} label="Min." />
                <TimeBlock value={timeLeft.seconds} label="Sec." />
            </div>

            {/* Détails du RDV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white px-5 py-4 rounded-2xl flex items-center gap-4 border border-sage-light/10 hover:border-sage/30 transition-colors">
                    <div className="bg-cream p-3 rounded-full text-sage">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-sage-light font-bold uppercase tracking-wider">Médecin Externe / Spécialiste</p>
                        <p className="font-bold text-sage-dark text-lg leading-tight mt-1">{doctorName}</p>
                        <p className="text-sm text-sage-light">{specialty}</p>
                    </div>
                </div>

                <div className="bg-white px-5 py-4 rounded-2xl flex items-center gap-4 border border-sage-light/10 hover:border-sage/30 transition-colors">
                    <div className="bg-cream p-3 rounded-full text-sage">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-sage-light font-bold uppercase tracking-wider">Lieu de consultation</p>
                        <p className="font-bold text-sage-dark text-lg leading-tight mt-1 truncate max-w-[180px]" title={location}>{location}</p>
                        <button className="text-xs text-sage font-bold hover:underline mt-1 focus:outline-none">S'y rendre avec Maps</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AppointmentCountdown;
