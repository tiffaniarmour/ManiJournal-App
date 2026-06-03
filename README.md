# ✨ ManiJournal

ManiJournal is a full-stack manifestation and personal growth application built with React, Vite, Supabase, and PostgreSQL.

The project combines mindset tools, journaling, manifestation tracking, goal planning, affirmations, future-self exercises, and vision boarding into a single platform designed to help users intentionally create the life they want while tracking personal growth over time.

This project also serves as a practical learning journey in modern web development, covering React, authentication, databases, CRUD operations, routing, and full-stack application architecture.

---

## 🌟 Features

### 🔐 Authentication

- User registration
- User login
- Secure Supabase authentication
- User-specific data storage

### 📖 Journal

- Create journal entries
- Edit journal entries
- Delete journal entries
- Search entries
- Filter by mood
- Sort by date
- Track mood and energy levels

### 🎯 Goal Planner

- Create manifestation goals
- Progress tracking
- Status tracking
- Target dates
- Personal motivation notes

### ✨ Manifestation Tracker

- Track desires
- Capture evidence of movement
- Mark manifestations as completed
- Review manifestation history

### 💎 Affirmation Bank

- Store affirmations
- Organize by category
- Favorite important affirmations
- Personal affirmation library

### 🏆 Wins Tracker

- Record victories and achievements
- Celebrate progress
- Track milestones
- Build evidence of success

### 🌸 Future Self Letters

- Write letters to your future self
- Set opening dates
- Track opened letters
- Future-focused reflection practice

### 🖼 Vision Board

- Create visual manifestation boards
- Save inspirational images
- Categorize vision board items
- Store personal notes for each image

### 📊 Dashboard

- Personal growth overview
- Journal statistics
- Goal statistics
- Manifestation statistics
- Wellness tracking snapshots

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- React Router

### Backend

- Supabase
- PostgreSQL

### Styling

- Custom CSS
- AyreVerse Luxe Sticker Book Design System

### Authentication

- Supabase Auth

### Hosting (Planned)

- Vercel

---

## 🗄 Database Tables

### journal_entries

Stores journal entries, moods, and energy levels.

### manifestation_goals

Stores goals, progress, target dates, and motivations.

### manifestations

Stores desires, evidence, and manifestation completion tracking.

### affirmations

Stores categorized affirmations and favorites.

### wins

Stores achievements, victories, and celebration levels.

### future_self_letters

Stores future-self journaling exercises and opening dates.

### vision_board_items

Stores vision board images, categories, and notes.

---

## 🎨 Design Philosophy

ManiJournal intentionally avoids the cold corporate feel common in productivity software.

The visual direction is inspired by:

- Luxury journals
- Vision boards
- Sticker books
- Creative planners
- Warm, uplifting personal development tools

The current aesthetic is known internally as:

**AyreVerse Luxe Sticker Book**

Featuring:

- Moroccan Blue
- Fuchsia
- Gold
- Warm Ivory
- Soft Copper

---

## 🚀 Local Development

Clone the repository:

```bash
git clone https://github.com/tiffaniarmour/ManiJournal-App.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit your `.env` file to GitHub.

---

## 📚 Learning Goals

This project was intentionally built as a learn-by-building experience focused on:

- React Fundamentals
- State Management
- Forms
- Routing
- Authentication
- Database Design
- CRUD Operations
- Search & Filtering
- Full-Stack Development
- Deployment Workflows

---

## 🛣 Roadmap

### Current

- ✅ Authentication
- ✅ Journal CRUD
- ✅ Goals Planner
- ✅ Manifestation Tracker
- ✅ Affirmation Bank
- ✅ Wins Tracker
- ✅ Future Self Letters
- ✅ Vision Board MVP

### In Progress

- 🔄 Dashboard Redesign
- 🔄 Enhanced Vision Board Experience

### Planned

- 📌 Daily Affirmation Widget
- 📌 Vision Board Categories
- 📌 Image Uploads via Supabase Storage
- 📌 Drag-and-Drop Vision Board
- 📌 Learning Path Page
- 📌 Dashboard Intelligence Widgets
- 📌 Vercel Deployment

---

## 👩🏾‍💻 About the Creator

Built by **Tiffani Armour**.

ManiJournal combines personal growth, manifestation practices, and modern web development into a single project that serves both as a practical wellness tool and a portfolio-quality full-stack application.

---

## 📄 License

This project is currently for personal use and educational purposes.