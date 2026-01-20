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
        
        case 'prepTime': {
            if (!value) return 'Prep time is required';
            const time = Number(value);
            if (isNaN(time) || time < 1 || time > 600) return 'Prep time must be 1-600 minutes';
            return '';
        }
        
        case 'cookTime': {
            if (!value) return 'Cook time is required';
            const time = Number(value);
            if (isNaN(time) || time < 1 || time > 600) return 'Cook time must be 1-600 minutes';
            return '';
        }
        
        case 'directions':
            if (!value) return 'Directions are required';
            if (value.length < 10) return 'Directions must be at least 10 characters';
            return '';
        
        case 'difficulty':
            return !value ? 'Difficulty is required' : '';
        
        case 'category':
            return !value ? 'Category is required' : '';
        
        case 'cuisine':
            return !value ? 'Cuisine type is required' : '';
        
        case 'imageUrl':
            if (!value) return 'Image URL is required';
            try {
                new URL(value);
                return '';
            } catch {
                return 'Please enter a valid URL';
            }
        
        default:
            return '';
    }
};

export const validateIngredient = (ingredient) => {
    const errors = {};
    
    // Validate ingredient name
    if (!ingredient.name || ingredient.name.trim() === '') {
        errors.name = 'Name is required';
    } else if (ingredient.name.length < 2 || ingredient.name.length > 50) {
        errors.name = 'Name must be 2-50 characters';
    }
    
    // Validate quantity
    if (!ingredient.quantity || ingredient.quantity.trim() === '') {
        errors.quantity = 'Quantity is required';
    } else {
        const qty = Number(ingredient.quantity);
        if (isNaN(qty) || qty < 0.1 || qty > 1000) {
            errors.quantity = 'Quantity must be 0.1-1000';
        }
    }
    
    // Validate unit
    if (!ingredient.unit || ingredient.unit.trim() === '') {
        errors.unit = 'Unit is required';
    }
    
    return errors;
};

export const validateForm = (formData) => {
    const newErrors = {};
    
    // Validate basic form fields (excluding ingredients)
    Object.keys(formData).forEach(key => {
        if (key !== 'ingredients') {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        }
    });

    // Validate each ingredient
    if (formData.ingredients && Array.isArray(formData.ingredients)) {
        formData.ingredients.forEach((ingredient, index) => {
            const ingredientErrors = validateIngredient(ingredient);
            
            // Add each ingredient error with indexed key
            Object.keys(ingredientErrors).forEach(field => {
                newErrors[`ingredient_${index}_${field}`] = ingredientErrors[field];
            });
        });
    }

    return newErrors;
};