import { useState } from 'react'
import PdfUploadModal from '../PdfUploadModal'
import { type ParoleSummaryResponse } from '../services/api'

function ModalTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedData, setUploadedData] = useState<ParoleSummaryResponse | null>(null)

  const handleUpload = (data: ParoleSummaryResponse) => {
    setUploadedData(data)
    console.log('PDF processed:', data.filename)
  }

  return (
    <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
      <h1>Modal Test Page</h1>
      <p style={{ marginBottom: 'var(--spacing-2xl)', color: 'var(--text-gray)' }}>
        Test the PDF upload modal component
      </p>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: 'var(--spacing-sm) var(--spacing-xl)',
          fontSize: 'var(--font-size-md)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--white)',
          backgroundColor: 'var(--primary-blue)',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          transition: 'background-color var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-blue-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-blue)'
        }}
      >
        Open Upload Modal
      </button>

      {uploadedData && (
        <div
          style={{
            marginTop: 'var(--spacing-2xl)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            margin: 'var(--spacing-2xl) auto 0',
          }}
        >
          <h3 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--success-heading)' }}>
            PDF Processed Successfully
          </h3>
          <p style={{ margin: 0, color: 'var(--success-text)' }}>
            <strong>File:</strong> {uploadedData.filename}
          </p>
          <p style={{ margin: 0, color: 'var(--success-text)' }}>
            <strong>Size:</strong> {(uploadedData.file_size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p style={{ margin: 0, color: 'var(--success-text)' }}>
            <strong>Summary Length:</strong> {uploadedData.markdown_summary.length} characters
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
