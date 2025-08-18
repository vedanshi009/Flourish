// src/components/UploadForm.jsx
import React, { useState, useRef, useEffect } from "react";

const UploadForm = ({ onImageUpload, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const MAX_MB = 10;

  // Handle file validation
  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image (JPG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_MB} MB`);
      return;
    }
    setError("");
    setFile(file);

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Pass to parent
    onImageUpload(file);
  };

  // Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  // Clean up preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearSelection = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragActive ? "border-green-400 bg-green-50" : "border-green-200 hover:border-green-300"
        } ${isAnalyzing ? "opacity-60 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-700">Analyzing your plant...</h3>
            <p className="text-sm text-gray-500">This may take a few seconds</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <h3 className="text-lg font-semibold text-gray-700">Upload Plant Photo</h3>
            <p className="text-sm text-gray-500">Drag & drop or click to select</p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to {MAX_MB}MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: "none" }}
          disabled={isAnalyzing}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Preview */}
      {previewUrl && !isAnalyzing && (
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
              <button
                type="button"
                onClick={clearSelection}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove image"
              >
                ✖
              </button>
            </div>

            <img
              src={previewUrl}
              alt="Selected plant preview"
              className="w-full max-h-96 object-contain rounded-xl"
            />

            <div className="mt-4 text-center">
              <button
                onClick={() => onImageUpload(file, "analyze")}
                disabled={!file}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
              >
                Analyze Plant Health
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
