import joi from "joi";

const schema1 = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        image: joi.string().allow("", null),
        price: joi.number().min(0).required(), // Corrected to validate as a number
        location: joi.string().required(),
        country: joi.string().required()
    }).required() // Ensure the listing object itself is required
});

export default schema1;