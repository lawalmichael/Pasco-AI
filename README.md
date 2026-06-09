# PascoPrep AI

> The intelligent WAEC exam preparation platform for African students.

---

## What is PascoPrep AI?

PascoPrep AI is an AI-powered study and learning platform built specifically for students preparing for the WAEC (West African Examinations Council) exams. Every year, approximately 2 million students in Nigeria alone sit for WAEC exams — most of them relying on physical booklets of past questions with no explanations, no interactivity, and no intelligence behind them.

PascoPrep AI changes that.

It combines a comprehensive database of WAEC past exam questions with an AI tutor that explains mistakes, answers follow-up questions, and helps students practice by topic — all from their phone.

---

## The Problem

Students preparing for WAEC currently rely on printed booklets of past questions distributed by their schools. These booklets:

- Are heavy and difficult to carry around
- Provide correct answers but **no explanations** for why an answer is right or wrong
- Cannot be searched or filtered by topic
- Are static — no interactivity, no personalization, no progress tracking
- Go out of date and are expensive to reprint every year

No existing digital platform solves all of these problems together. PascoPrep AI does.

---

## The Solution

PascoPrep AI is three things in one:

**1. A Complete Past Question Database**
Every WAEC past exam question across all core subjects, going back decades — organized, searchable, and filterable by subject, year, and topic.

**2. An Intelligent Practice Tool**
Students attempt questions directly in the app, get scored instantly, and see which topics they are weak in. Progress is tracked over time so students can see themselves improving.

**3. An AI Tutor**
When a student gets a question wrong, the AI explains exactly why — breaking down the concept in clear, simple language. The AI tutor is also fully conversational: students can ask follow-up questions, request different explanations, or start a fresh conversation about any topic they are struggling with. It is like having a personal WAEC tutor available 24/7.

---

## Core Features

- **Full past question bank** — all subjects, all years, fully tagged by topic
- **Practice mode** — attempt questions, get scored, review performance
- **Wrong answer explainer** — AI breaks down every mistake in plain language
- **Topic-based practice** — type any topic and get all past questions on that topic from every available year
- **Conversational AI tutor** — ask anything, get intelligent responses, continue the conversation naturally
- **Progress tracking** — dashboard showing scores over time, weak subjects, questions attempted
- **Student accounts** — personalized experience saved across sessions

---

## Target Users

| User | How They Use PascoPrep AI |
|---|---|
| **Students** | Practice past questions, get AI explanations, track progress |
| **Parents** | Monitor their child's preparation and performance |
| **Schools** | Bulk licenses for SS3 classes, teacher dashboards, class analytics |

---

## Subjects Covered

- Mathematics
- English Language
- Biology
- Chemistry
- Physics
- Economics
- Government
- Literature in English
- Geography
- Christian Religious Studies / Islamic Religious Studies

*(Additional subjects to be added progressively)*

---

## Monetization

| Plan | Price | Features |
|---|---|---|
| **Basic** | ₦2,000/month | Limited past questions, basic practice mode |
| **Pro** | ₦5,000/month | Full database, unlimited AI tutor, topic practice, progress tracking |
| **School License** | ₦500K–₦1M/year | All students covered, teacher dashboard, class analytics |

Payments processed via **Paystack**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic API (Claude) |
| Authentication | Supabase Auth |
| Payments | Paystack |
| Hosting | Vercel (frontend) + Railway (backend) |

---

## Database Schema

Every question in the database is structured as follows:

```
id                — unique identifier
subject           — e.g. "Mathematics"
year              — e.g. 2020
question_number   — e.g. 14
question_text     — the full question
option_a          — first option
option_b          — second option
option_c          — third option
option_d          — fourth option
correct_answer    — e.g. "B"
topic             — e.g. "Quadratic Equations"
exam_type         — e.g. "WAEC"
country           — e.g. "Nigeria"
```

The schema is intentionally exam-agnostic to support future expansion beyond WAEC.

---

## Roadmap

**Phase 1 — WAEC Nigeria (Current)**
Launch with full WAEC past question database and AI tutor targeting Nigerian secondary school students.

**Phase 2 — West Africa**
Expand to Ghana, Sierra Leone, The Gambia, and Liberia — all of whom share the WAEC system. Database is largely transferable.

**Phase 3 — Nigerian Exam Expansion**
Add JAMB/UTME (university entrance), NECO, and Common Entrance exams — dramatically expanding the addressable market within Nigeria alone.

**Phase 4 — East and Southern Africa**
Add KCSE (Kenya), ZIMSEC (Zimbabwe), UACE (Uganda), NECTA (Tanzania), and BGCSE (Botswana).

**Phase 5 — Francophone Africa**
Add Baccalauréat equivalent exams across Côte d'Ivoire, Senegal, and Cameroon with French language support.

---

## Market Opportunity

| Exam | Annual Candidates | Countries |
|---|---|---|
| WAEC | ~4 million | 5 countries |
| JAMB | ~1.8 million | Nigeria |
| NECO | ~1.5 million | Nigeria |
| KCSE | ~900,000 | Kenya |
| ZIMSEC O-Level | ~300,000 | Zimbabwe |

**Total addressable market: 10+ million students annually** sitting high-stakes secondary exams across Africa — the majority of them underserved by quality, AI-powered preparation tools.

---

## Development Stages

**Stage 1 — Foundation (Week 1–2)**
Database setup, question extraction pipeline, first 150 Math questions imported into Supabase.

**Stage 2 — Demo Build (Week 3–6)**
Working web app with practice loop and AI explanation feature. Live shareable link.

**Stage 3 — Full Product (Week 7–14)**
User accounts, progress tracking, all subjects, topic-based practice, mobile optimization, Paystack integration.

**Stage 4 — Launch (Week 15–16)**
Marketing, school outreach, beta users, public launch.

---

## Vision

PascoPrep AI is not just an exam prep tool. It is the foundation of a pan-African education platform — one that meets African students where they are, speaks their language, understands their exams, and gives every student access to the kind of intelligent, personalized tutoring that was previously only available to those who could afford private lessons.

Every student deserves to walk into their exam prepared. PascoPrep AI makes that possible.

---

## Contact

Built by Michael Lawal  
[GitHub] | [Instagram: @pascoprepai] | [TikTok: @pascoprepai]
