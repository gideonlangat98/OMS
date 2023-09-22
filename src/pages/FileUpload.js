import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ['image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    multiple: true,
    onDrop,
    maxFiles: 3,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag and drop files here or click to browse</p>
    </div>
  );
};

export default FileUpload;
