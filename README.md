<div align="center">



\# 🚀 SmartHire AI



\### AI-Powered Resume Analyzer \& Job Matching Platform



\*Stop guessing if your resume passes the robots. Know your score.\*



\[!\[Live Demo](https://img.shields.io/badge/Live-Demo-00FFB2?style=for-the-badge)](https://smart-hire-ai-frontend-mu.vercel.app)

\[!\[API](https://img.shields.io/badge/API-Live-7B61FF?style=for-the-badge)](https://smart-hire-ai-backend.onrender.com)

\[!\[GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/gayathri703-ok)

\[!\[MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/atlas)

\[!\[Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge\&logo=vercel\&logoColor=white)](https://vercel.com)

\[!\[Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge\&logo=render\&logoColor=white)](https://render.com)



\*\*\[🌐 Live App](https://smart-hire-ai-frontend-mu.vercel.app)\*\* · \*\*\[📡 API](https://smart-hire-ai-backend.onrender.com)\*\* · \*\*\[💻 Source Code](https://github.com/gayathri703-ok)\*\*



</div>



\---



\## 📌 Table of Contents



\- \[Overview](#-overview)

\- \[Live Demo](#-live-demo)

\- \[Screenshots](#-screenshots)

\- \[Features](#-features)

\- \[The ATS Scoring Algorithm](#-the-ats-scoring-algorithm)

\- \[Tech Stack](#-tech-stack)

\- \[Project Workflow](#-project-workflow)

\- \[Modules](#-project-modules)

\- \[Installation](#️-installation)

\- \[Environment Variables](#-environment-variables)

\- \[Skills Demonstrated](#-skills-demonstrated)

\- \[Future Enhancements](#-future-enhancements)

\- \[Author](#-author)



\---



\## 📖 Overview



Job seekers send out hundreds of resumes and hear nothing back — not because they're unqualified, but because \*\*Applicant Tracking Systems (ATS)\*\* silently filter resumes before a human ever sees them. Most candidates have no idea why they're being rejected.



\*\*SmartHire AI closes that black box.\*\* It's a two-sided platform where:



\- 📄 \*\*Candidates\*\* upload a resume, paste any job description, and get an instant, transparent, weighted ATS score

\- 🎯 \*\*Candidates\*\* see exactly which skills are matched vs. missing, with actionable suggestions to fix the gap

\- 💼 \*\*Candidates\*\* browse and apply to live job postings, tracked end-to-end with status updates

\- 🏢 \*\*Recruiters\*\* post jobs and review applicants ranked automatically by ATS fit

\- 📧 \*\*Both sides\*\* get notified by email as applications move through the pipeline



Built as a real-world full-stack project demonstrating a production-grade scoring engine, role-based auth, and a live deployment pipeline.



\---



\## 🚀 Live Demo



| Resource | Link |

|---|---|

| 🌐 Live Application (Frontend) | \[smart-hire-ai-frontend-mu.vercel.app](https://smart-hire-ai-frontend-mu.vercel.app) |

| 📡 Live API (Backend) | \[smart-hire-ai-backend.onrender.com](https://smart-hire-ai-backend.onrender.com) |

| 💻 GitHub Repository | \[github.com/gayathri703-ok](https://github.com/gayathri703-ok) |



\---



\## 📸 Screenshots



<table>

<tr>

<td width="50%"><b>🔐 Candidate Login</b><br/><img src="./uploads/candidate-Login page.png" alt="Candidate Login" width="100%"/></td>

<td width="50%"><b>🏠 Candidate Dashboard</b><br/><img src="./uploads/candidate-dashboard.png" alt="Candidate Dashboard" width="100%"/></td>

</tr>

<tr>

<td width="50%"><b>📄 Resume Upload \& Parsing</b><br/><img src="./uploads/candidate-resume.png" alt="Resume Upload" width="100%"/></td>

<td width="50%"><b>⚡ Job Match Analyzer — Real-Time ATS Scoring</b><br/><img src="./uploads/candidate-jobmatch analyzer.png" alt="Job Match Analyzer" width="100%"/></td>

</tr>

<tr>

<td width="50%"><b>💼 Job Board with Advanced Filters</b><br/><img src="./uploads/candidate-job board.png" alt="Job Board" width="100%"/></td>

<td width="50%"><b>📋 My Applications — Status Tracking</b><br/><img src="./uploads/candidate-myapplication.png" alt="My Applications" width="100%"/></td>

</tr>

<tr>

<td width="50%"><b>📊 Analytics — Score Trends \& Skill Gaps</b><br/><img src="./uploads/candidate-Analytics.png" alt="Analytics Dashboard" width="100%"/></td>

<td width="50%"><b>📥 Downloadable ATS Report</b><br/><img src="./uploads/candidate-ATS report.png" alt="ATS PDF Report" width="100%"/></td>

</tr>

<tr>

<td width="50%"><b>🔐 Recruiter Login</b><br/><img src="./uploads/Recruiter-login.png" alt="Recruiter Login" width="100%"/></td>

<td width="50%"><b>🏢 Recruiter Dashboard</b><br/><img src="./uploads/Recruiter dashboard.png" alt="Recruiter Dashboard" width="100%"/></td>

</tr>

<tr>

<td width="50%"><b>➕ Post a New Job</b><br/><img src="./uploads/Recruiter-post a new job.png" alt="Post New Job" width="100%"/></td>

<td width="50%"><b>🗂️ Manage Posted Jobs</b><br/><img src="./uploads/Recruiter-my jobs.png" alt="Manage Jobs" width="100%"/></td>

</tr>

<tr>

<td colspan="2"><b>👥 Candidate Evaluation — ATS Breakdown per Applicant</b><br/><img src="./uploads/Recruiter-candidates list.png" alt="Candidate List" width="100%"/></td>

</tr>

</table>



\### 📱 Mobile Responsive View



> SmartHire AI is fully responsive across breakpoints — candidates and recruiters get the full feature set on mobile.



<div align="center">

<b>Mobile Responsive Layout</b><br/>

<img src="./uploads/Mobile-responsive view.png" alt="Mobile Responsive View" width="300"/>

</div>



> 📁 Screenshots live in the `/uploads` folder at the project root. GitHub renders them automatically — click any filename in the file tree to preview it directly.



\---



\## ✨ Features



\### 👤 Candidate Experience

\- 🔐 Secure registration \& login (JWT + bcrypt)

\- 📄 PDF resume upload with automatic text extraction \& skill detection

\- ⚡ Instant ATS analysis against any pasted job description

\- 🎯 Matched vs. missing skills, visually color-coded

\- 💡 Actionable improvement suggestions

\- 📥 One-click downloadable ATS report (branded HTML)

\- 💼 Searchable job board with live match scores per job

\- 🔍 Advanced filters — location, salary range, minimum ATS score, job type

\- 📋 Application tracking with real-time status updates

\- 📊 Personal analytics — score trends, skill-gap charts, application funnel

\- 📧 Automatic email notifications when a recruiter responds



\### 🏢 Recruiter Experience

\- ➕ Post jobs with structured requirements (skills, salary, experience level)

\- 🗂️ Manage active/inactive postings

\- 👥 View every applicant ranked by ATS score

\- 🔬 Drill into any candidate's full skill breakdown

\- ✅ Accept / 👁️ Review / ❌ Reject with one click

\- 📝 Attach recruiter notes — auto-included in candidate's email

\- 📈 Recruiter dashboard with hiring funnel metrics



\### 📱 Fully Responsive

\- Optimized for Desktop, Tablet, and Mobile



\---



\## 🧠 The ATS Scoring Algorithm



This isn't a random number generator — it's a real weighted matching engine:



```

ATS Score = (Skill Match × 50%) + (Keyword Overlap × 30%) + (Experience Fit × 20%)

```



\*\*Skill Match\*\* — Detects 60+ technical skills (languages, frameworks, cloud platforms, tools) in both the resume and job description, then calculates overlap.



\*\*Keyword Overlap\*\* — Strips stop-words and compares meaningful vocabulary between resume and job posting — the same literal-matching behavior real ATS software uses.



\*\*Experience Fit\*\* — Extracts years of experience from both documents (handles formats like "5+ years" and "2020–Present") and scores how closely they align.



The result: a score that moves predictably as relevant skills are added — validated through side-by-side testing during development, where adding matching keywords raised scores in controlled before/after comparisons.



\---



\## 🛠 Tech Stack



<div align="center">



| Frontend | Backend | Database | Security \& Auth | File \& Email | Deployment |

|:---:|:---:|:---:|:---:|:---:|:---:|

| !\[React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=black) | !\[Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white) | !\[MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&logoColor=white) | !\[JWT](https://img.shields.io/badge/JWT-black?logo=jsonwebtokens) | !\[Multer](https://img.shields.io/badge/Multer-FF6C37) | !\[Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel\&logoColor=white) |

| React Router | !\[Express](https://img.shields.io/badge/Express.js-000000?logo=express\&logoColor=white) | Mongoose ODM | !\[bcrypt](https://img.shields.io/badge/bcrypt-338?logo=letsencrypt\&logoColor=white) | pdf-parse | !\[Render](https://img.shields.io/badge/Render-46E3B7?logo=render\&logoColor=white) |

| Axios | | | | Nodemailer | !\[GitHub](https://img.shields.io/badge/GitHub-181717?logo=github\&logoColor=white) |

| Custom CSS (responsive, dark theme) | | | | | |



</div>



\---



\## 📂 Project Workflow



```

Candidate Uploads Resume (Multer + pdf-parse)

&#x20;       │

&#x20;       ▼

Skills \& Experience Auto-Extracted

&#x20;       │

&#x20;       ▼

Resume Data Saved to MongoDB Atlas

&#x20;       │

&#x20;       ▼

Candidate Pastes Job Description / Browses Job Board

&#x20;       │

&#x20;       ▼

ATS Engine Calculates Weighted Score

&#x20;       │

&#x20;       ▼

Candidate Applies (One-Click, ATS Score Attached)

&#x20;       │

&#x20;       ▼

Recruiter Reviews via Dashboard (JWT Protected)

&#x20;       │

&#x20;       ├──► In Review

&#x20;       │

&#x20;       ├──► Accepted ──► Email Notification Sent (Nodemailer)

&#x20;       │

&#x20;       └──► Rejected ──► Email Notification Sent (Nodemailer)

```



\---



\## 📊 Project Modules



| Module | Description | Status |

|---|---|:---:|

| 🔐 Authentication System | Register/login as Candidate or Recruiter, JWT + bcrypt | ✅ Complete |

| 📄 Resume Management | PDF upload, text extraction, skill \& experience detection | ✅ Complete |

| 🧠 ATS Matching Engine | Weighted scoring algorithm (skills + keywords + experience) | ✅ Complete |

| 💼 Job Board | Search, filters, sort, live ATS score per listing | ✅ Complete |

| 📋 Application System | One-click apply, status tracking, withdraw option | ✅ Complete |

| 🏢 Recruiter Panel | Post/manage jobs, review applicants, accept/reject/notes | ✅ Complete |

| 📊 Analytics Dashboard | Score trends, status breakdown, skill-gap analysis | ✅ Complete |

| 💡 AI Suggestions Engine | Rule-based improvement tips, skill breakdown | ✅ Complete |

| 📥 PDF Report Export | Branded downloadable HTML report | ✅ Complete |

| 📧 Email Notifications | Auto-email on accept/reject/review, with recruiter notes | ✅ Complete |

| 📱 Responsive Design | Mobile, tablet, desktop optimized | ✅ Complete |

| 🚀 Deployment | Frontend on Vercel, backend on Render, DB on Atlas | ✅ Complete |

| 🤖 AI Resume Feedback (OpenAI) | Code complete, pending API billing | ⏸️ Paused |



\---



\## ⚙️ Installation



\### Prerequisites

\- Node.js ≥ 18

\- MongoDB Atlas account (free tier works)

\- Gmail account for email notifications (with App Password)



```bash

\# 1. Clone the repositories

git clone https://github.com/gayathri703-ok/Smart-Hire-AI-Backend.git

git clone https://github.com/gayathri703-ok/Smart-Hire-AI-Frontend.git



\# 2. Install backend dependencies

cd Smart-Hire-AI-Backend \&\& npm install



\# 3. Install frontend dependencies

cd ../Smart-Hire-AI-Frontend \&\& npm install



\# 4. Create your .env file in the backend folder (see below)



\# 5. Start both servers

\# Terminal 1

cd ../Smart-Hire-AI-Backend \&\& npm run dev     # → http://localhost:5000



\# Terminal 2

cd ../Smart-Hire-AI-Frontend \&\& npm start      # → http://localhost:3000

```



\---



\## 🔐 Environment Variables



Create a `.env` file in the backend root directory:



```env

PORT=5000

MONGO\_URI=your\_mongodb\_atlas\_connection\_string

JWT\_SECRET=your\_random\_secret\_key

JWT\_EXPIRE=7d

NODE\_ENV=development

EMAIL\_USER=your\_gmail\_address

EMAIL\_PASS=your\_gmail\_app\_password

```



> ⚠️ \*\*Never commit your real `.env` file to GitHub.\*\* Add it to `.gitignore`.



\---



\## 🎯 Skills Demonstrated



\- \*\*Frontend Development\*\* — React component architecture, React Router, responsive dark-themed UI

\- \*\*Backend Development\*\* — RESTful API design with Express.js, file handling with Multer

\- \*\*Database Management\*\* — MongoDB schema design, Mongoose ODM, Atlas cloud hosting

\- \*\*Algorithm Design\*\* — weighted multi-factor scoring engine built from scratch

\- \*\*Security\*\* — JWT authentication, bcrypt password hashing, role-based middleware

\- \*\*DevOps \& Deployment\*\* — environment configuration, CI deploys on Vercel + Render, cross-platform debugging



\---



\## 🔮 Future Enhancements



\- \[ ] 🤖 AI-powered resume feedback via OpenAI (code complete, pending API billing)

\- \[ ] 🔔 In-app notification center alongside email

\- \[ ] 📤 Export candidate shortlist as CSV for recruiters

\- \[ ] 🌙 Light mode theme toggle

\- \[ ] 🌐 Multi-language support



\---



\## 👩‍💻 Author



\*\*Gayathri\*\* — Full-stack project built end-to-end: backend API, React frontend, ATS algorithm, deployment pipeline, and production debugging across Windows/Linux environments.



\[!\[GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/gayathri703-ok)



\---



\## 📄 License



This project is built for educational and portfolio purposes.



\---



<div align="center">



\### 🚀 SmartHire AI



\*Closing the ATS black box — one transparent score at a time.\*



\*\*⭐ If this project helped you understand ATS systems or full-stack deployment, consider starring the repo!\*\*



</div>

