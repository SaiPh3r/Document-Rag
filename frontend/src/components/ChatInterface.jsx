import { useState, useRef, useEffect } from 'react'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'assistant', content: data.answer }])
      } else {
        const errorData = await response.json()
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: errorData.error || 'Sorry, there was an error processing your question.' 
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Sorry, I cannot connect to the server. Please make sure the backend is running.' 
      }])
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '20px',
      height: '650px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        color: '#ffffff',
        padding: '24px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700',
          margin: '0 0 8px 0',
          letterSpacing: '-0.025em'
        }}>
          Chat with your document
        </h2>
        <p style={{ 
          fontSize: '16px', 
          margin: '0',
          opacity: '0.9',
          fontWeight: '400'
        }}>
          Ask questions about the uploaded PDF
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              border: '3px solid #e5e7eb'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#7c3aed',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                AI
              </div>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Ready to help!
            </h3>
            <p style={{
              fontSize: '16px',
              margin: '0',
              color: '#6b7280',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              Start a conversation by asking a question about your document
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.3s ease-in'
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '16px 20px',
                  borderRadius: message.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  backgroundColor: message.type === 'user' ? '#7c3aed' : '#ffffff',
                  color: message.type === 'user' ? '#ffffff' : '#374151',
                  border: message.type === 'user' ? 'none' : '1px solid #e5e7eb',
                  boxShadow: message.type === 'user' ? '0 4px 14px 0 rgba(124, 58, 237, 0.3)' : '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  wordWrap: 'break-word'
                }}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              backgroundColor: '#ffffff',
              color: '#6b7280',
              maxWidth: '200px',
              padding: '16px 20px',
              borderRadius: '20px 20px 20px 4px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>AI is thinking</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#7c3aed',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite both'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#7c3aed',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite both',
                  animationDelay: '0.16s'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#7c3aed',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite both',
                  animationDelay: '0.32s'
                }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '24px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your document..."
              style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                color: '#374151',
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px 20px',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease',
                resize: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.backgroundColor = '#f9fafb'
                e.target.style.boxShadow = 'none'
              }}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            style={{
              backgroundColor: isLoading ? '#f3f4f6' : '#7c3aed',
              color: isLoading ? '#9ca3af' : '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isLoading ? 'none' : '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#6d28d9'
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 6px 20px 0 rgba(124, 58, 237, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#7c3aed'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 14px 0 rgba(124, 58, 237, 0.3)'
              }
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default ChatInterface