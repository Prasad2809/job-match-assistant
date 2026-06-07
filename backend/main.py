from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import PyPDF2
import io
import re
import requests

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI(title="Job Match Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


@app.get("/")
def root():
    return {"status": "running", "message": "Job Match Assistant API is live"}


@app.post("/analyze")
async def analyze(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    pdf_bytes = await resume.read()
    resume_text = extract_text_from_pdf(pdf_bytes)

    if not resume_text.strip():
        return {"error": "Could not read your PDF. Make sure it is a text-based PDF."}

    prompt = f"""You are an expert ATS resume coach helping a fresher apply for software jobs in Germany.

JOB DESCRIPTION:
{job_description}

CANDIDATE RESUME TEXT:
{resume_text}

Analyze the resume against the job description and respond in this EXACT format:

## ATS Match Score
[Give a score like: 72/100]

## Score Explanation
[2 sentences explaining why this score was given]

## Missing Keywords
- keyword 1
- keyword 2
- keyword 3
- keyword 4
- keyword 5

## Rewritten Resume Bullets
Original: [original bullet from resume]
Improved: [improved bullet with job keywords]

Original: [original bullet from resume]
Improved: [improved bullet with job keywords]

Original: [original bullet from resume]
Improved: [improved bullet with job keywords]

## Skills Gap
- skill 1
- skill 2
- skill 3

## Overall Verdict
[Strong Match / Needs Work / Poor Match]

## Recommended Job Title
[Best job title to use on resume]

## Top Tip for Germany
[One specific tip for applying in Germany]"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 1500,
        "temperature": 0.7
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=body,
            timeout=30
        )
        data = response.json()
        print("GROQ RESPONSE STATUS:", response.status_code)

        if response.status_code != 200:
            error_msg = data.get("error", {}).get("message", str(data))
            return {"error": f"Groq error: {error_msg}"}

        result_text = data["choices"][0]["message"]["content"]

    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}

    score = None
    match = re.search(r'(\d+)\s*/\s*100', result_text)
    if match:
        score = int(match.group(1))

    return {
        "result": result_text,
        "score": score
    }