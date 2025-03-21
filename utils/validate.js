const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false});

// job title,job description,job salary,job location,job category,job contact,job vacancies,job company,job duration,job type
const createJobSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    showSalary: Joi.boolean().required(),
    salaryDetails: Joi.string().when("showSalary", {
        is: true,
        then: Joi.string().pattern(/^\d{2,}$/).required(), // at least 2 digits in salary
        otherwise: Joi.string().allow(null)
    }),
    location: Joi.string().required(),
    category: Joi.string().required(),
    email: Joi.string().required(),
    vacancies: Joi.number().required(),
    company: Joi.string().required(),
    jobType: Joi.string().required().valid('Full-time', 'Part-time', 'Internship'),
    duration: Joi.string().when("jobType", {
        is: "Full-time", 
        then: Joi.optional().allow(null),
        otherwise: Joi.string().required() // duration is must if part-time or internship
    })
});

exports.validateCreateJob = validator(createJobSchema);