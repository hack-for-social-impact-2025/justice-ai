from fastapi import APIRouter, UploadFile, HTTPException
from ..services.gcs_client import upload_file as gcs_upload_file, list_files as gcs_list_files

router = APIRouter(prefix="/file", tags=["File"])

@router.post("/upload")
async def upload_file_route(file: UploadFile):
    """
    Upload a file to Google Cloud Storage
    """
    try:
        # Generate a safe filename
        destination_name = file.filename
        
        # Upload the file to GCS
        url = gcs_upload_file(file.file, destination_name)
        
        return {
            "success": True,
            "filename": file.filename,
            "file_size": file.size,
            "content_type": file.content_type,
            "url": url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_files_route():
    """
    List all files stored in Google Cloud Storage
    """
    try:
        files = gcs_list_files()
        return {
            "success": True,
            "files": files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
