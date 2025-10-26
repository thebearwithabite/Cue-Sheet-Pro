
import React, { useState, useRef } from 'react';
import { FileData } from '../types';

interface FileUploadProps {
  label: string;
  accept: string;
  onFileChange: (fileData: FileData | null) => void;
  isLoading: boolean;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileChange, isLoading, required = false }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(',')[1] || '';
      onFileChange({
        base64: base64String,
        mimeType: file.type,
        name: file.name,
      });
      setFileName(file.name);
    };
    reader.onerror = () => {
      onFileChange(null);
      setFileName(null);
      alert('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.match(new RegExp(`^(${accept.split(',').map(t => t.trim().replace(/\*/g, '.*')).join('|')})$`))) {
        alert(`Invalid file type. Please upload a ${accept} file.`);
        event.target.value = ''; // Clear the input
        onFileChange(null);
        setFileName(null);
        return;
      }
      handleFileRead(file);
    } else {
      onFileChange(null);
      setFileName(null);
    }
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName(null);
    onFileChange(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <label htmlFor={label.replace(/\s/g, '-').toLowerCase() + '-upload'} className="block text-xl font-semibold text-primary-dark mb-4">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        <input
          id={label.replace(/\s/g, '-').toLowerCase() + '-upload'}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-light file:text-primary-dark
            hover:file:bg-indigo-50 transition-colors
            disabled:opacity-50"
          ref={fileInputRef}
          disabled={isLoading}
        />
        {fileName && (
          <button
            onClick={clearFile}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            Clear
          </button>
        )}
      </div>
      {fileName && <p className="mt-2 text-sm text-gray-600">Selected: {fileName}</p>}
    </div>
  );
};

export default FileUpload;
