import { useState, type ChangeEvent, type FormEvent } from "react";
import { generateParoleSummary, type ParoleSummaryResponse } from "./services/api";

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: ParoleSummaryResponse) => void;
}

function PdfUploadModal({ isOpen, onClose, onUpload }: PdfUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null); // Clear any previous errors
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateParoleSummary(selectedFile);
      onUpload(result);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process PDF");
      console.error("Error uploading PDF:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        onClick={handleClose}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          onClick={e => e.stopPropagation()}
        >
          <h2
            style={{
              margin: "0 0 24px 0",
              fontSize: "24px",
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            Upload PDF File
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="pdf-file"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a4a4a",
                }}
              >
                Select PDF File
              </label>
              <input
                id="pdf-file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={isLoading}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  fontSize: "14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
              {selectedFile && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#059669",
                  }}
                >
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {error && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#dc2626",
                    backgroundColor: "#fef2f2",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #fecaca",
                  }}
                >
                  {error}
                </p>
              )}
              {isLoading && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid #e5e7eb",
                      borderTop: "2px solid #2563eb",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Processing PDF... This may take a few moments.
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#4a4a4a",
                  backgroundColor: isLoading ? "#f9fafb" : "#f3f4f6",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={e => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                  }
                }}
                onMouseLeave={e => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isLoading}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ffffff",
                  backgroundColor: selectedFile && !isLoading ? "#2563eb" : "#9ca3af",
                  border: "none",
                  borderRadius: "6px",
                  cursor: selectedFile && !isLoading ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={e => {
                  if (selectedFile && !isLoading) {
                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                  }
                }}
                onMouseLeave={e => {
                  if (selectedFile && !isLoading) {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                  }
                }}
              >
                {isLoading ? "Processing..." : "Upload & Analyze"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PdfUploadModal;
