import React, { useState, useRef, useEffect } from "react";

const UploadForm = ({ onImageUpload, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const MAX_MB = 10;

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
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // This was changed to prevent immediate analysis on selection
    // onImageUpload(file); 
  };

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
        // --- FIXES APPLIED HERE ---
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer 
          bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md
          ${
            dragActive 
              ? "border-green-500" 
              : "border-green-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-gray-500"
          } 
          ${isAnalyzing ? "opacity-60 pointer-events-none" : ""}`
        }
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Analyzing your plant...</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This may take a few seconds</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Upload Plant Photo</h3>
            {/* --- FIXES APPLIED HERE (Text Colors) --- */}
            <p className="text-sm text-gray-700 dark:text-gray-300">Drag & drop or click to select</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">PNG, JPG, WEBP up to {MAX_MB}MB</p>
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
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Preview */}
      {previewUrl && !isAnalyzing && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h3>
              <button
                type="button"
                onClick={clearSelection}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors text-xl"
                title="Remove image"
              >
                &times;
              </button>
            </div>

            <img
              src={previewUrl}
              alt="Selected plant preview"
              className="w-full max-h-96 object-contain rounded-xl bg-black/10"
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
