from fastapi import FastAPI, UploadFile, File , Request
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI , GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel
import io
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class QuestionRequest(BaseModel):
    question:str

retrieval = None # ✅ Declare globally so it’s accessible to both routes
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
prompt = PromptTemplate(
    template="""
        Answer the user's question below in a clear, concise, and informative way.
        If the answer cannot be found in the context, simply say:
        I am  not sure based on the given document.
        {context}
        Question:{question}
        """ , 
    input_variables=["context" , "question"]
    )
@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    # Read the uploaded PDF bytes
    global retrieval
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

    retrieval = vector_db.as_retriever(search_type = "similarity" , search_kwargs = {"k":2})
    
    return {"message": "PDF processed successfully", "total_chunks": len(texts)}

@app.post("/ask")
async def ask(data:QuestionRequest):
    global retrieval  # access the retrieval set by upload()

    if retrieval is None:
        return {"error": "No document uploaded yet!"}

    question = data.question
    
    retrieverDocs = retrieval.invoke(question)
    context_text = "".join([doc.page_content for doc in retrieverDocs])

    final_prompt = prompt.format(context=context_text, question=question)
    response = llm.invoke(final_prompt)

    return {"answer": response.content}






