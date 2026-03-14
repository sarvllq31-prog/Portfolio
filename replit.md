# Sarah Alqahtani — Portfolio

## Overview
A premium, fully bilingual (Arabic/English) portfolio website with a secure admin dashboard. Built with React + Vite + Tailwind CSS + Framer Motion.

## Tech Stack
- **Frontend**: React 18, Vite 5
- **Styling**: Tailwind CSS 3 with custom design system
- **Animations**: Framer Motion 11
- **Routing**: React Router 6
- **Backend**: Supabase (auth + database + storage)

## Project Structure
```
src/
  lib/supabase.js          — Supabase client
  contexts/
    LanguageContext.jsx    — AR/EN bilingual, RTL toggle
    AuthContext.jsx        — Supabase auth session management
  components/
    layout/Navbar.jsx      — Responsive navbar with dark/lang/admin controls
    portfolio/             — Hero, About, Skills, Certificates, Projects, Education, Contact
    admin/
      Login.jsx            — Admin login page
      Dashboard.jsx        — Sidebar + tabbed content
      sections/            — CRUD sections for each content type
    ui/
      Modal.jsx            — Reusable modal with animations
      AnimatedSection.jsx  — Scroll-triggered entrance animations
  pages/
    Portfolio.jsx          — Main portfolio page
    Admin.jsx              — Admin routes wrapper
```

## Running
Workflow `Start application` runs:
```
npm run dev  (Vite on port 5000, host 0.0.0.0)
```

## Routes
- `/` — Portfolio (public)
- `/admin/login` — Admin login
- `/admin` — Dashboard (protected, requires Supabase auth)

## Supabase Database Tables
- `about` — About text (text_en, text_ar)
- `interests` — Interest items (icon, title_en, title_ar, display_order)
- `skills` — Skills (name_en, name_ar, percentage, skill_type, display_order)
- `certificates` — Certificates (title_en, title_ar, organization_en, organization_ar, file_url, display_order)
- `projects` — Projects (title_en, title_ar, short_desc_en/ar, full_desc_en/ar, tools[], github_url, demo_url, image_urls[], display_order)
- `education` — Education (degree_en/ar, organization_en/ar, start_date, end_date, display_order)
- `contact` — Contact info (email, phone, github_url, linkedin_url)

## Supabase Storage Buckets
- `certificates` — Certificate files (PDF/image)
- `project-images` — Project images

## Deployment
Static deployment: `npm run build` → `dist/`
