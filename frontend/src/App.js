import { useState, useRef } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

function ScoreBar({ score }) {
  const level = score >= 70 ? "high" : score >= 40 ? "mid" : "low";
  const label = score >= 70 ? "Strong Match" : score >= 40 ? "Needs Work" : "Poor Match";
  const emoji = score >= 70 ? "✅" : score >= 40 ? "⚠️" : "❌";

  return (
    <div className="score-card">
      <div className={`score-circle ${level}`}>
        <span className="score-num">{score}</span>
        <span className="score-label">/ 100</span>
      </div>
      <div className="score-info progress-wrap">
        <h3>{emoji} {label}</h3>
        <p>ATS compatibility score for this job description</p>
        <div className="progress-bar-bg">
          <div
            className={`progress-bar-fill ${level}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ResultContent({ text }) {
  const lines = text.split("\n");

  return (
    <div className="result-content">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return <h2 key={i}>{line.replace("## ", "")}</h2>;
        }
        if (line.startsWith("- ")) {
          return (
            <ul key={i}>
              <li>{line.replace("- ", "")}</li>
            </ul>
          );
        }
        if (line.trim() === "") {
          return <br key={i} />;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i}><strong>{line.replace(/\*\*/g, "")}</strong></p>;
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async () => {
    if (!jobDesc.trim()) {
      setError("Please paste the job description.");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your resume PDF.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setScore(null);

    const formData = new FormData();
    formData.append("job_description", jobDesc);
    formData.append("resume", resumeFile);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        setScore(data.score);
        setTimeout(() => {
          document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      setError("Could not connect to backend. Make sure uvicorn is running at " + API_URL);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setJobDesc("");
    setResumeFile(null);
    setResult(null);
    setScore(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">🤖</div>
          <span className="header-title">Job Match Assistant</span>
        </div>
        <span className="header-badge">AI Powered · Free</span>
      </header>

      {/* ── Main ── */}
      <main className="main">

        {/* Hero */}
        <div className="hero">
          <h1>Score your resume against <span>any job</span></h1>
          <p>
            Paste a job description, upload your resume PDF, and get an instant
            ATS match score, missing keywords, and rewritten bullet points — powered by GPT.
          </p>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <h2>
            <span className="step-badge">1</span>
            Paste the job description
          </h2>
          <div className="field">
            <label>Job description text</label>
            <textarea
              rows={10}
              placeholder="Copy and paste the full job description from LinkedIn, Indeed, or any company website here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="form-card">
          <h2>
            <span className="step-badge">2</span>
            Upload your resume
          </h2>

          <div
            className={`upload-area ${dragOver ? "drag-over" : ""} ${resumeFile ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="upload-icon">{resumeFile ? "📄" : "⬆️"}</div>
            <div className="upload-label">
              {resumeFile ? "Resume uploaded!" : "Click or drag & drop your resume PDF"}
            </div>
            {resumeFile ? (
              <div className="upload-filename">✓ {resumeFile.name}</div>
            ) : (
              <div className="upload-sub">PDF files only · max 10MB</div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-msg">
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn-analyze"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Analyzing your resume...
            </>
          ) : (
            "🔍 Analyze My Resume"
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="results" id="results-section" style={{ marginTop: 36 }}>
            {score !== null && <ScoreBar score={score} />}

            <div className="result-card">
              <h2>📊 Full Analysis</h2>
              <ResultContent text={result} />
            </div>

            <button className="btn-reset" onClick={handleReset}>
              ← Analyze another job
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        Built with FastAPI + React + OpenAI GPT · Free to use · Your resume is never stored
      </footer>
    </div>
  );
}