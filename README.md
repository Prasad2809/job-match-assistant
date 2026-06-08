# 🤖 AI Job Match Assistant

An AI-powered web app that scores your resume against any job description, finds missing keywords, and rewrites your bullet points using GPT. Built for freshers applying to software jobs in Germany.

**Tech stack:** Python · FastAPI · React · OpenAI API

---

## 📁 Project Structure

```
job-match-assistant/
├── backend/
│   ├── main.py            ← FastAPI server + all AI logic
│   ├── requirements.txt   ← Python dependencies
│   ├── .env               ← Your OpenAI API key (never upload this)
│   └── .gitignore
└── frontend/
    ├── public/
    │   └── index.html     ← HTML entry point
    ├── src/
    │   ├── index.js       ← React entry point
    │   ├── index.css      ← Global styles
    │   ├── App.js         ← Main React component
    │   └── App.css        ← Component styles
    ├── .env               ← Frontend API URL config
    └── package.json       ← Node dependencies
```

---

## 🛠️ LOCAL SETUP (Step by Step)

### Prerequisites — install these first

| Tool         | Download                      | Check installed    |
| ------------ | ----------------------------- | ------------------ |
| Python 3.11+ | https://python.org/downloads  | `python --version` |
| Node.js 18+  | https://nodejs.org            | `node --version`   |
| VS Code      | https://code.visualstudio.com | open it            |
| Git          | https://git-scm.com           | `git --version`    |

---

### STEP 1 — Clone or download this project

```bash
# Option A: Clone with Git
git clone https://github.com/YOUR_USERNAME/job-match-assistant.git
cd job-match-assistant

# Option B: Just create the folder manually and paste the files
mkdir job-match-assistant
cd job-match-assistant
```

---

### STEP 2 — Get your free OpenAI API key

1. Go to https://platform.openai.com/signup
2. Create a free account (you get $5 free credits)
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key" → copy the key

---

### STEP 3 — Set up the Backend

Open Terminal (or Command Prompt on Windows):

```bash
# Go into backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate it — WINDOWS:
venv\Scripts\activate

# Activate it — MAC/LINUX:
source venv/bin/activate

# You should now see (venv) at the start of your terminal line

# Install all required packages
pip install -r requirements.txt
```

**Set your API key:**

Open the file `backend/.env` in VS Code and replace the placeholder:

```
OPENAI_API_KEY=sk-your-actual-key-here
```

**Start the backend server:**

```bash
uvicorn main:app --reload
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Open http://localhost:8000 in your browser — you should see `{"status":"running"}`.

✅ **Backend is working!** Keep this terminal open.

---

### STEP 4 — Set up the Frontend

Open a **NEW terminal window** (keep the backend one running):

```bash
# Go into frontend folder
cd frontend

# Install all Node packages (takes 2-3 minutes first time)
npm install

# Start the React development server
npm start
```

Your browser will automatically open http://localhost:3000

✅ **Frontend is working!** You should see the app UI.

---

### STEP 5 — Test the full project

1. Open http://localhost:3000
2. Paste a job description from LinkedIn (search "Software Engineer Germany")
3. Upload your resume as a PDF
4. Click "Analyze My Resume"
5. Wait 10-20 seconds for the AI response

You should get:

- ATS match score (0-100)
- Missing keywords list
- Rewritten bullet points
- Skills gap analysis
- Overall verdict

---

## 🚀 DEPLOY FOR FREE (Share with Recruiters)

### Deploy Backend on Render.com (free)

1. Go to https://render.com — sign up with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Set these settings:
   - **Root directory:** `backend`
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Under "Environment Variables", add:
   - Key: `OPENAI_API_KEY`
   - Value: your actual API key
6. Click "Deploy"

You get a URL like: `https://your-app.onrender.com`

---

### Deploy Frontend on Vercel (free)

1. Go to https://vercel.com — sign up with GitHub
2. Click "New Project" → import your repo
3. Set **Root Directory** to `frontend`
4. Under "Environment Variables", add:
   - Key: `REACT_APP_API_URL`
   - Value: your Render backend URL (e.g. `https://your-app.onrender.com`)
5. Click "Deploy"

You get a live URL like: `https://job-match-assistant.vercel.app`

---

## 🔒 Security Notes

- Never share your `.env` file
- Never upload `.env` to GitHub
- The `.gitignore` files already protect you from this
- Your resume PDFs are processed in memory and never saved to disk

---

## 💼 How to List This on Your CV

```
AI Resume Match Assistant | FastAPI · React · OpenAI GPT API · Python
- Built a full-stack AI web app that scores resumes against job descriptions using GPT-3.5
- Implemented PDF parsing, ATS keyword extraction, and automated bullet-point rewriting
- Deployed backend on Render.com and frontend on Vercel with CI/CD via GitHub
- Live demo: https://your-app.vercel.app | Code: https://github.com/you/job-match-assistant
```

---

## 🤝 Built by

[Prasad Shinde] — fresher software developer 
