const Joi = require('joi');

// Middleware genérico de validación
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
        
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Esquemas de validación para usuarios
const userSchemas = {
  // Validación para login
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es requerida'
      })
  }),

  // Validación para crear usuario
  create: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es requerida'
      }),
    rol: Joi.string()
      .valid('administrador', 'jefe_departamento', 'tecnico')
      .required()
      .messages({
        'any.only': 'El rol debe ser: administrador, jefe_departamento o tecnico',
        'any.required': 'El rol es requerido'
      }),
    departamento_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'El departamento debe ser un número válido',
        'number.positive': 'El departamento debe ser un número positivo',
        'any.required': 'El departamento es requerido'
      }),
    telefono: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .allow('')
      .messages({
        'string.pattern.base': 'El teléfono solo puede contener números, espacios y los caracteres +, -, (, )'
      }),
    activo: Joi.boolean()
      .default(true)
  }),

  // Validación para actualizar usuario
  update: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres'
      }),
    email: Joi.string()
      .email()
      .messages({
        'string.email': 'El email debe tener un formato válido'
      }),
    rol: Joi.string()
      .valid('administrador', 'jefe_departamento', 'tecnico')
      .messages({
        'any.only': 'El rol debe ser: administrador, jefe_departamento o tecnico'
      }),
    departamento_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El departamento debe ser un número válido',
        'number.positive': 'El departamento debe ser un número positivo'
      }),
    telefono: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .allow('')
      .messages({
        'string.pattern.base': 'El teléfono solo puede contener números, espacios y los caracteres +, -, (, )'
      }),
    activo: Joi.boolean()
  })
};

// Esquemas de validación para incidencias
const incidentSchemas = {
  create: Joi.object({
    titulo: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'El título debe tener al menos 5 caracteres',
        'string.max': 'El título no puede exceder 200 caracteres',
        'any.required': 'El título es requerido'
      }),
    descripcion: Joi.string()
      .min(10)
      .required()
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'any.required': 'La descripción es requerida'
      }),
    prioridad: Joi.string()
      .valid('baja', 'media', 'alta', 'critica')
      .required()
      .messages({
        'any.only': 'La prioridad debe ser: baja, media, alta o critica',
        'any.required': 'La prioridad es requerida'
      }),
    categoria: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.max': 'La categoría no puede exceder 50 caracteres',
        'any.required': 'La categoría es requerida'
      }),
    departamento_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'El departamento debe ser un número válido',
        'number.positive': 'El departamento debe ser un número positivo',
        'any.required': 'El departamento es requerido'
      })
  }),

  update: Joi.object({
    titulo: Joi.string()
      .min(5)
      .max(200)
      .messages({
        'string.min': 'El título debe tener al menos 5 caracteres',
        'string.max': 'El título no puede exceder 200 caracteres'
      }),
    descripcion: Joi.string()
      .min(10)
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres'
      }),
    prioridad: Joi.string()
      .valid('baja', 'media', 'alta', 'critica')
      .messages({
        'any.only': 'La prioridad debe ser: baja, media, alta o critica'
      }),
    estado: Joi.string()
      .valid('abierta', 'en_progreso', 'en_espera', 'cerrada')
      .messages({
        'any.only': 'El estado debe ser: abierta, en_progreso, en_espera o cerrada'
      }),
    categoria: Joi.string()
      .max(50)
      .messages({
        'string.max': 'La categoría no puede exceder 50 caracteres'
      }),
    asignado_a: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .messages({
        'number.base': 'El usuario asignado debe ser un número válido',
        'number.positive': 'El usuario asignado debe ser un número positivo'
      })
  })
};

module.exports = {
  validate,
  userSchemas,
  incidentSchemas
};