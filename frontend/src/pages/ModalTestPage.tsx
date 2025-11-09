import { useState } from 'react'
import PdfUploadModal from '../PdfUploadModal'

function ModalTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleUpload = (file: File) => {
    setUploadedFile(file)
    console.log('File uploaded:', file.name)
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Modal Test Page</h1>
      <p style={{ marginBottom: '32px', color: '#6b7280' }}>
        Test the PDF upload modal component
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#ffffff',
          backgroundColor: '#2563eb',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1d4ed8'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb'
        }}
      >
        Open Upload Modal
      </button>

      {uploadedFile && (
        <div
          style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            maxWidth: '500px',
            margin: '32px auto 0',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#166534' }}>
            File Selected in Modal
          </h3>
          <p style={{ margin: 0, color: '#15803d' }}>
            <strong>Name:</strong> {uploadedFile.name}
          </p>
          <p style={{ margin: 0, color: '#15803d' }}>
            <strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p style={{ margin: 0, color: '#15803d' }}>
            <strong>Type:</strong> {uploadedFile.type}
          </p>
        </div>
      )}

      <PdfUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  )
}

export default ModalTestPage
