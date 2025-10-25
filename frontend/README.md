# Document RAG Chatbot Frontend

A modern React frontend for the Document RAG Chatbot application built with Vite and Tailwind CSS.

## Features

- **Document Upload**: Drag and drop PDF file upload with visual feedback
- **Chat Interface**: Interactive chat interface for asking questions about uploaded documents
- **Responsive Design**: Mobile-friendly design that works on all screen sizes
- **Real-time Processing**: Live status updates during document processing
- **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your backend server is running on `http://localhost:8000`

4. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`)

## Usage

1. Upload a PDF document using the drag-and-drop interface
2. Wait for the document to be processed
3. Start asking questions about the document content
4. The AI will provide answers based on the document content

## API Integration

The frontend integrates with the following backend endpoints:
- `POST /upload_pdf/` - Upload and process PDF documents
- `POST /ask` - Ask questions about uploaded documents

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.