import { useState } from 'react'
import DocumentUpload from './components/DocumentUpload'
import ChatInterface from './components/ChatInterface'

function App() {
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDocumentUploaded = () => {
    setIsDocumentUploaded(true)
  }

  const handleUploadStart = () => {
    setIsUploading(true)
  }

  const handleUploadEnd = () => {
    setIsUploading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      color: '#4c1d95',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '700',
            color: '#4c1d95',
            margin: '0 0 10px 0',
            letterSpacing: '-0.025em'
          }}>
            Document RAG Chatbot
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b46c1',
            margin: '0',
            fontWeight: '400'
          }}>
            Upload a PDF and ask intelligent questions
          </p>
        </div>
        
        {!isDocumentUploaded ? (
          <DocumentUpload 
            onDocumentUploaded={handleDocumentUploaded}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
            isUploading={isUploading}
          />
        ) : (
          <ChatInterface />
        )}
      </div>
    </div>
  )
}

export default App