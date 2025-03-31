import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { getUserFiles, uploadFile, downloadFile } from '../services/fileService';

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await getUserFiles();
      setFiles(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load files');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return setError('Please select a file to upload');
    }
    
    try {
      setError('');
      setSuccess('');
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      await uploadFile(formData);
      
      setSuccess('File uploaded successfully');
      setSelectedFile(null);
      e.target.reset();
      
      fetchFiles();
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      await downloadFile(fileId);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="file-management-container">
      <h2 className="mb-4">File Management</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Upload New File</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                required
              />
              <Form.Text className="text-muted">
                Supported file types: PDF, Excel, Word, TXT (Max: 10MB)
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={uploading || !selectedFile}
            >
              {uploading ? <Spinner animation="border" size="sm" /> : 'Upload File'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          <Card.Title>Your Files</Card.Title>
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" />
            </div>
          ) : files.length > 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file._id}>
                    <td>{file.originalFilename}</td>
                    <td>{file.fileType}</td>
                    <td>{formatDate(file.uploadDate)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleDownload(file._id)}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center my-3">No files uploaded yet</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FileManagement;
