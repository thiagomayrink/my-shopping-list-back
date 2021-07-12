import joi from 'joi';

const itemSchema = joi.object({text: joi.string().min(1).required()})

export {itemSchema};