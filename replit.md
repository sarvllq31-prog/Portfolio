# Portfolio - Sarah Ali Alqahtani

## Overview
A personal portfolio website for Sarah Ali Alqahtani. Static site (HTML/CSS/JS) with Supabase for backend data storage.

## Project Structure
- `index.html` - Main portfolio page
- `style.css` - Main stylesheet
- `script.js` - Main JavaScript logic
- `admin.html` - Admin panel
- `admin-script.js` - Admin panel JavaScript
- `admin-style.css` - Admin panel styles
- `config.js` - Supabase configuration (URL and anon key)

## Tech Stack
- **Frontend**: Plain HTML, CSS, JavaScript
- **Backend**: Supabase (hosted, external)
- **Server**: `npx serve` static file server

## Running the App
The workflow `Start application` runs:
```
npx serve . -l 5000
```
This serves all static files on port 5000.

## Deployment
Configured as a **static** deployment with `publicDir: "."`.

## External Services
- **Supabase**: Project URL configured in `config.js`. Uses the public anon key for client-side access.
