# 📄 Document Q&A Assistant (FastAPI + FAISS + Gemini)

An intelligent question-answering system built with **FastAPI**, **LangChain**, **FAISS**, and **Google Gemini (or HuggingFace)**.  
Upload a document (e.g., a PDF or text), and the app lets you ask natural language questions — powered by RAG (Retrieval-Augmented Generation).

---

## 🚀 Features

- 🧠 Uses **Retrieval-Augmented Generation (RAG)** for accurate answers  
- 📄 Upload and process documents for Q&A  
- ⚡ Built with **FastAPI** for backend APIs  
- 🔍 **FAISS vector store** for efficient similarity search  
- 🤖 **Google Gemini** or **HuggingFace** embeddings  
- 💬 Handles both **document-based** and **general** queries (“Hello”, “Who are you?”, etc.)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | FastAPI |
| LLM | Google Gemini (ChatGoogleGenerativeAI) |
| Embeddings | Gemini / HuggingFace / OpenAI |
| Vector Store | FAISS |
| Framework | LangChain |
| Frontend (optional) | React (for upload + chat UI) |

---

## 📦 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/document-qa-fastapi.git
cd document-qa-fastapi
python -m venv env
source env/bin/activate  # Mac/Linux
env\Scripts\activate     # Windows
pip install -r requirements.txt
GOOGLE_API_KEY=your_gemini_api_key
