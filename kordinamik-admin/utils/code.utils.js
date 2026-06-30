/**
 * Generate a random alphanumeric code of specified length
 * @param {Number} length - Length of the code
 * @returns {String} Random code
 */
const generateRandomCode = (length = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing characters like I, O, 0, 1
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Generate an approval code for dealer applications
 * @param {Number} length - Length of the code
 * @returns {String} Approval code
 */
const generateApprovalCode = (length = 8) => {
  // Add prefix to distinguish approval codes
  return 'BYI-' + generateRandomCode(length);
};

module.exports = {
  generateRandomCode,
  generateApprovalCode
};
