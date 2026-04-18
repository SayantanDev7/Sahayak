/**
 * Mock AI Document Verification Service
 * Simulates a TensorFlow backend that validates uploaded documents.
 * 
 * In production, this would POST the file to your ML endpoint.
 */

// Simulated AI processing delay (2-4 seconds)
const AI_PROCESSING_TIME = 2500;

/**
 * Verifies a document using the mock AI/TensorFlow backend.
 * @param {File} file - The uploaded file to verify.
 * @returns {Promise<{valid: boolean, confidence: number, message: string}>}
 */
export const verifyDocument = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate validation logic based on file properties
      const validExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
      const ext = file.name.split('.').pop().toLowerCase();
      const isValidFormat = validExtensions.includes(ext);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max

      if (!isValidFormat) {
        return resolve({
          valid: false,
          confidence: 0,
          message: 'Galat format — sirf PDF, JPG, PNG allowed hai.'
        });
      }

      if (!isValidSize) {
        return resolve({
          valid: false,
          confidence: 0,
          message: 'File bahut badi hai — 5MB se chhoti honi chahiye.'
        });
      }

      // 85% success rate for realistic demo
      const passesAI = Math.random() > 0.15;
      const confidence = passesAI
        ? Math.floor(Math.random() * 10 + 90) // 90-99%
        : Math.floor(Math.random() * 30 + 20); // 20-49%

      resolve({
        valid: passesAI,
        confidence,
        message: passesAI
          ? `Document verified ✅ (${confidence}% confidence)`
          : 'AI ko document mein gadbad mili — kripya dubara upload karein.'
      });
    }, AI_PROCESSING_TIME);
  });
};