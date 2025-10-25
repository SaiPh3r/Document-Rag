from fastapi import FastAPI, UploadFile, File
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI , GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
import io
from dotenv import load_dotenv
load_dotenv()

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

    # have got the text from the pdf , now lets form chunks 
    splitter = RecursiveCharacterTextSplitter(chunk_size = 1000 , chunk_overlap=100)
    texts = splitter.create_documents([text])

    # return {"message": "PDF processed successfully", "text_preview": texts[0].page_content[:300] , "total_chunks": len(texts)}
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    vector_db = FAISS.from_documents(texts , embeddings)

    # #testng the vector db
    # query = "summary of the document"
    # results = vector_db.similarity_search(query, k=2)

    # # Return diagnostic info
    # return {
    #     "message": "PDF processed and indexed successfully!",
    #     "total_chunks": len(texts),
    #     "sample_result": results[0].page_content[:300] if results else "No match found",
    # }

    

