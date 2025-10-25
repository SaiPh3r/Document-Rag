import { useState, useRef } from 'react'

const DocumentUpload = ({ onDocumentUploaded, onUploadStart, onUploadEnd, isUploading }) => {
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef(null)

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setUploadStatus('Please upload a PDF file only.')
      return
    }

    onUploadStart()
    setUploadStatus('Uploading and processing document...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/upload_pdf/', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadStatus('Document uploaded and processed successfully!')
        setTimeout(() => {
          onDocumentUploaded()
        }, 1500)
      } else {
        setUploadStatus('Error uploading document. Please try again.')
      }
    } catch (error) {
      setUploadStatus('Error connecting to server. Please make sure the backend is running.')
      console.error('Upload error:', error)
    } finally {
      onUploadEnd()
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease'
    }}>
      <h2 style={{ 
        fontSize: '28px', 
        fontWeight: '600',
        color: '#4c1d95',
        margin: '0 0 16px 0'
      }}>
        Upload PDF Document
      </h2>
      
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        margin: '0 0 32px 0',
        lineHeight: '1.5'
      }}>
        Select a PDF file to start chatting with your document
      </p>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={isUploading}
      />
      
      <button
        onClick={openFileDialog}
        disabled={isUploading}
        style={{
          backgroundColor: isUploading ? '#f3f4f6' : '#7c3aed',
          color: isUploading ? '#9ca3af' : '#ffffff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isUploading ? 'none' : '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
          transform: isUploading ? 'none' : 'translateY(0)',
          minWidth: '180px'
        }}
        onMouseEnter={(e) => {
          if (!isUploading) {
            e.target.style.backgroundColor = '#6d28d9'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 20px 0 rgba(124, 58, 237, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isUploading) {
            e.target.style.backgroundColor = '#7c3aed'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 14px 0 rgba(124, 58, 237, 0.3)'
          }
        }}
      >
        {isUploading ? 'Processing...' : 'Choose PDF File'}
      </button>
      
      {uploadStatus && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: uploadStatus.includes('Error') || uploadStatus.includes('Please upload') ? '#fef2f2' : '#f0fdf4',
          color: uploadStatus.includes('Error') || uploadStatus.includes('Please upload') ? '#dc2626' : '#16a34a',
          border: `1px solid ${uploadStatus.includes('Error') || uploadStatus.includes('Please upload') ? '#fecaca' : '#bbf7d0'}`,
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {uploadStatus}
        </div>
      )}
    </div>
  )
}

export default DocumentUpload