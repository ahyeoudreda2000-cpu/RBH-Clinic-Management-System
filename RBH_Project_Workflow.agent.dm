# Role: Senior Full-Stack Architect & Security Expert
# Project: RBH Clinic Management System (French Language)
# Inspiration: Parsley Health (High-End Aesthetic)
# Stack: React, Tailwind CSS, MongoDB Atlas, Cloudflare Pages (Serverless)

## 1. Project Identity & Credentials
- **Project Name:** RBH Clinic Management System.
- **Default Admin Credentials:**
    - **Username:** `ADMIN`
    - **Password:** `RBH2026@project`
- **Language:** UI and System messages must be 100% French.

## 2. Advanced MVC Architecture (Layered Design)
- **Model (DAO):** MongoDB schemas (User, Appointment, Log, ActiveSession).
- **Controller (Business Logic):** Service layer for CRUD, Moroccan-specific validation (+212 phone, Moroccan cities).
- **View (Presentation):** React components styled with Parsley Health aesthetic (Sage Green, Cream, Serif fonts).

## 3. Core Technical Requirements
- **Authentication & Session Management:**
    - HTTP-only cookie session system.
    - **HTTPSessionListener Simulation:** Track "Active Users" via a `last_seen` timestamp in MongoDB.
- **Security & Password Management:**
    - **Admin/User Edit:** Allow password changes from the profile/dashboard.
    - **Forgot Password:** Implement a recovery method (Email-based or Security Question).
- **Global Logger (Filter-based):** Middleware to record every request to a `Logs` collection:
    - Format: `[Date/Heure] | Utilisateur: {Email/ID} | Action: {Method} | URL: {Path}`.
- **Search & Filter:** Keyword search input on the Admin Dashboard (Search by Name, Date, or City).

## 4. UI/UX Design (Parsley Health Style)
- **Visuals:** Use professional clinical imagery (Doctors, high-tech equipment, kids/adults).
- **Navigation:** Navbar, Hero section with "Prendre RDV", and "À propos de nous" (featuring the 3 student creators).
- **User Dashboard:** 
    - Welcome message + Profile view.
    - **Countdown Timer:** Real-time display (Mois, Semaines, Jours, Heures) for upcoming appointments.
- **Admin Dashboard:** Hidden at `/adminlog`.
    - Real-time "Active Users" counter.
    - Comprehensive list of appointments with "Modifier" and "Supprimer" buttons.

## Implementation Tasks for Gemini:
1. Generate the `Folder Structure` following MVC principles in `/src` and `/functions`.
2. Create the `AuthMiddleware.js` (Session restriction, Admin check, and Request Logging).
3. Provide the `DashboardAdmin.jsx` with the Keyword Search and Active User counter.
4. Build the `ForgotPassword.jsx` component and the logic for password recovery.
5. Write the `AppointmentCountdown.jsx` React logic for the user profile.