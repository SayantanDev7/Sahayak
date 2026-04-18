/**
 * Specialized service function to handle document uploads using Multipart/Form-Data.
 * Mock Implementation: Simulates network lag using setTimeout and Promise.
 *
 * @param {File} file - The file to upload.
 * @param {Object} metadata - Additional data (e.g., document type/category).
 * @returns {Promise<Object>} The simulated server response.
 */
export const uploadDocument = async (file, metadata = {}) => {
  return new Promise((resolve, reject) => {
    // Validate if the file is passed
    if (!file) {
      return reject(new Error("No file provided"));
    }

    // Creating form data - as it would be done for a real backend
    const formData = new FormData();
    formData.append('document', file);
    
    // Append any metadata
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    console.log("Mock Uploading form data:");
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }

    // Simulate network lag (1.5 seconds)
    setTimeout(() => {
      // Simulate a successful upload 90% of the time
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        resolve({
          success: true,
          message: "Document uploaded successfully",
          data: {
            id: Math.random().toString(36).substr(2, 9),
            fileName: file.name,
            size: file.size,
            type: file.type,
            uploadTime: new Date().toISOString()
          }
        });
      } else {
        reject(new Error("Failed to upload document. Please try again."));
      }
    }, 1500);
  });
};
