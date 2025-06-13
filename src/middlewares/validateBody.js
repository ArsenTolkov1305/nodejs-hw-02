import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errors = error.details.map(detail => ({
        path: detail.path.join('.'),
        message: detail.message
      }));
      
      return next(createHttpError(400, 'Validation error', { errors }));
    }
    
    next();
  };
};