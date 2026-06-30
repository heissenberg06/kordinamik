const db = require('../config/db');
const logger = require('../config/logger');

/**
 * Determine action type based on HTTP method
 * @param {String} method - HTTP method
 * @returns {String} Action type
 */
const determineAction = (method) => {
  switch (method.toUpperCase()) {
    case 'POST': return 'CREATE';
    case 'PUT': return 'UPDATE';
    case 'PATCH': return 'UPDATE';
    case 'DELETE': return 'DELETE';
    case 'GET': return 'READ';
    default: return 'OTHER';
  }
};

/**
 * Create audit middleware for specific entity type
 * @param {String} entityType - Type of entity being audited (e.g., 'product', 'category')
 * @returns {Function} Express middleware
 */
const createAuditMiddleware = (entityType) => {
  return async (req, res, next) => {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;
    
    // Capture request data for audit
    const requestData = {
      adminId: req.admin ? req.admin.id : null,
      entityType,
      entityId: req.params.id,
      action: determineAction(req.method),
      oldValues: null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    // For updates and deletes, get the old entity state if we have an ID
    if (['PUT', 'PATCH', 'DELETE'].includes(req.method) && req.params.id) {
      try {
        // This assumes we have access to the model, which would need to be passed in or determined
        // For now, we'll just store the ID and let the service layer handle the old values
        requestData.oldValues = { id: req.params.id };
      } catch (error) {
        logger.error('Error capturing audit old values:', error);
      }
    }
    
    // Override response methods to capture the result
    res.json = function(data) {
      // Create audit log after successful operation
      if (res.statusCode >= 200 && res.statusCode < 300) {
        createAuditLog({
          ...requestData,
          newValues: data
        }).catch(err => logger.error('Audit logging error:', err));
      }
      
      // Call original method
      return originalJson.call(this, data);
    };
    
    res.send = function(data) {
      // Create audit log after successful operation
      if (res.statusCode >= 200 && res.statusCode < 300) {
        createAuditLog({
          ...requestData,
          newValues: typeof data === 'string' ? { data } : data
        }).catch(err => logger.error('Audit logging error:', err));
      }
      
      // Call original method
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Create an audit log entry
 * @param {Object} auditData - Audit data to log
 * @returns {Promise} Promise resolving to created audit log
 */
const createAuditLog = async (auditData) => {
  try {
    const { AuditLog } = db.initModels();
    return await AuditLog.create({
      admin_id: auditData.adminId,
      action: auditData.action,
      entity_type: auditData.entityType,
      entity_id: auditData.entityId,
      old_values: auditData.oldValues,
      new_values: auditData.newValues,
      ip_address: auditData.ipAddress,
      user_agent: auditData.userAgent
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error);
    throw error;
  }
};

/**
 * Manual audit logging function for complex operations
 * @param {Object} req - Express request object
 * @param {String} action - Action being performed
 * @param {String} entityType - Type of entity
 * @param {Number|String} entityId - ID of entity
 * @param {Object} oldValues - Previous state of entity
 * @param {Object} newValues - New state of entity
 * @returns {Promise} Promise resolving to created audit log
 */
const logAudit = async (req, action, entityType, entityId, oldValues, newValues) => {
  return createAuditLog({
    adminId: req.admin ? req.admin.id : null,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });
};

module.exports = {
  createAuditMiddleware,
  logAudit
};


