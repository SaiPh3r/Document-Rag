from fastapi import FastAPI, UploadFile, File
from PyPDF2 import PdfReader
import io

app = FastAPI()

@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    # Read the uploaded PDF bytes
    pdf_bytes = await file.read()
    
    # Convert bytes to a readable PDF object
    pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    
    return {"message": "PDF processed successfully", "text_preview": text[:300]}

