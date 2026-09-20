# Deroua Services (خدمات الدروة)

A modern, responsive community services directory and emergency portal for **Deroua** (Province of Berrechid, Casablanca-Settat, Morocco), rewritten from Android Capacitor to a fast React + TypeScript + Tailwind application.

## Overview

Deroua Services connects residents, workers, and visitors of Deroua with vital everyday contacts, municipal authorities, public utilities, emergency teams, and local craftspeople.

### Key Features

- 🚨 **Emergency Quick Dial**: One-tap access to Civil Protection / Firefighters (15), Royal Gendarmerie Deroua (177), SAMU Ambulance (141), and local stations.
- 💊 **Guard Pharmacy Roster (صيدليات الحراسة)**: Live active pharmacy on duty with 24/7 hours, address, direct telephone call, WhatsApp, and Google Maps directions.
- 🏛️ **Municipal & Public Services (المصالح الإدارية والعمومية)**: Deroua City Hall (Commune Urbaine), Post Office (Barid Al Maghrib), ONEE Water & Electricity branches.
- 🛠️ **Verified Local Artisans (حرفيو ومهنيو الدروة)**: Plumbing, electrical, air conditioning, aluminum carpentry, emergency locksmith 24/7, and vehicle towing on Route Nationale 9.
- 🚖 **Transport & Mobility Guide**: Grand Taxi routes and fares connecting Deroua to Casablanca (Sidi Maarouf, Oasis), Berrechid, and Mohammed V International Airport (CMN), plus local bus lines.
- 📢 **Community Notice Board**: Official administrative updates, water maintenance announcements, and local public alerts.
- ➕ **Add / Register Service**: Allows local businesses and craftsmen to register their contact details with neighborhood tagging.
- 🌐 **Multilingual & Full RTL Support**: Arabic (العربية) with native RTL layout and typography, French (Français), and English.
- 🌓 **Dark & Light Themes**: Comfortable day and night reading modes.
- 💾 **Offline-Ready Resilience**: Caches numbers and user favorites in localStorage so essential contacts remain available without an active internet connection.
- 🔒 **Privacy First**: Fully compliant with Play Store data safety standards — zero tracking, zero unnecessary device permissions.

## Architecture

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with RTL styling
- **Icons**: Lucide React
- **Persistence**: Local browser storage & offline state caching
- **Port**: Serves on port 3000 (host `0.0.0.0`)
