export const validateField = (name, value) => {
    switch (name) {
        case 'title':
        if (!value) return 'Title is required';
        if (value.length < 3 || value.length > 50) return 'Title must be 3-50 characters';
        return '';
        case 'description':
        if (!value) return 'Description is required';
        if (value.length < 10 || value.length > 500) return 'Description must be 10-500 characters';
        return '';
        case 'servings': {
        if (!value) return 'Servings is required';
        const servings = Number(value);
        if (isNaN(servings) || servings < 1 || servings > 20) return 'Servings must be 1-20';
        return '';
        }
        case 'difficulty':
        case 'category':
        case 'cuisine':
        return !value ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '';
        case 'imageUrl':
        if (!value) return 'Image URL is required';
        return '';
        default:
        return '';
    }
    };

    export const validateIngredient = (ingredient) => {
    const errors = {};
    if (!ingredient.name || ingredient.name.length < 2 || ingredient.name.length > 50) {
        errors.name = 'Name must be 2-50 characters';
    }
    if (!ingredient.quantity) {
        errors.quantity = 'Quantity is required';
    } else {
        const qty = Number(ingredient.quantity);
        if (isNaN(qty) || qty < 0.1 || qty > 1000) {
        errors.quantity = 'Quantity must be 0.1-1000';
        }
    }
    if (!ingredient.unit) {
        errors.unit = 'Unit is required';
    }
    return errors;
    };

    export const validateForm = (formData) => {
    const newErrors = {};
    
    // Validate basic form fields
    Object.keys(formData).forEach(key => {
        if (key !== 'ingredients') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
        }
    });

    // Validate ingredients
    formData.ingredients.forEach((ingredient, index) => {
        const ingredientErrors = validateIngredient(ingredient);
        Object.keys(ingredientErrors).forEach(field => {
        newErrors[`ingredient_${index}_${field}`] = ingredientErrors[field];
        });
    });

    return newErrors;
};