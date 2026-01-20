import React, { useState } from 'react';
import { validateField, validateIngredient, validateForm } from '../utils/validation';
import './RecipeSubmissionForm.css';

export default function RecipeSubmissionForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        servings: '',
        difficulty: '',
        category: '',
        cuisine: '',
        imageUrl: '',
        prepTime: '',
        cookTime: '',
        directions: '',
        ingredients: [{ name: '', quantity: '', unit: '' }]
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submittedRecipe, setSubmittedRecipe] = useState(null);

    // Dropdown options
    const units = ['cups', 'tablespoons', 'teaspoons', 'ounces', 'pounds', 'grams', 'pieces', 'milliliters', 'liters'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const categories = ['Appetizer', 'Main Course', 'Dessert', 'Side Dish', 'Beverage'];
    const cuisines = ['American', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Other'];

    // Handle basic input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Real-time validation
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Handle ingredient field changes
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));

        // Real-time validation for ingredients
        const ingredientErrors = validateIngredient(newIngredients[index]);
        setErrors(prev => ({
            ...prev,
            [`ingredient_${index}_${field}`]: ingredientErrors[field] || ''
        }));
    };

    // Add new ingredient
    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }]
        }));
    };

    // Remove ingredient
    const removeIngredient = (index) => {
        if (formData.ingredients.length > 1) {
            const newIngredients = formData.ingredients.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate entire form
        const newErrors = validateForm(formData);
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Success - show recipe card
        setSubmittedRecipe(formData);
        setSubmitted(true);
        
        // Reset form
        setFormData({
            title: '',
            description: '',
            servings: '',
            difficulty: '',
            category: '',
            cuisine: '',
            imageUrl: '',
            prepTime: '',
            cookTime: '',
            directions: '',
            ingredients: [{ name: '', quantity: '', unit: '' }]
        });
        setErrors({});
    };

    // Reset to form view
    const handleNewRecipe = () => {
        setSubmitted(false);
        setSubmittedRecipe(null);
    };

    // Calculate total time
    const calculateTotalTime = () => {
        const prep = parseInt(submittedRecipe?.prepTime) || 0;
        const cook = parseInt(submittedRecipe?.cookTime) || 0;
        return prep + cook;
    };

    // Success view - Recipe card display
if (submitted && submittedRecipe) {
    const totalTime = calculateTotalTime();
    
    return (
        <div className="success-container">
            <div className="success-wrapper">
                <div className="success-card">
                    <div className="recipe-image-container">
                        <img 
                            src={submittedRecipe.imageUrl} 
                            alt={submittedRecipe.title}
                            className="recipe-image"
                        />
                        <div className="image-overlay"></div>
                        <div className="recipe-header">
                            {/* Single transparent white box for title, category, and metadata */}
                            <div className="recipe-title-box">
                                <h1 className="recipe-name">{submittedRecipe.title}</h1>
                                <p className="recipe-category">{submittedRecipe.category}</p>
                                
                                <div className="recipe-meta">
                                    <span className="recipe-meta-item">
                                        🍽️ {submittedRecipe.servings} {submittedRecipe.servings === "1" ? "Serving" : "Servings"}
                                    </span>
                                    <span className="recipe-meta-separator">|</span>
                                    <span className="recipe-meta-item">
                                        📊 {submittedRecipe.difficulty}
                                    </span>
                                    <span className="recipe-meta-separator">|</span>
                                    <span className="recipe-meta-item">
                                        🌍 {submittedRecipe.cuisine}
                                    </span>
                                    <span className="recipe-meta-separator">|</span>
                                    <span className="recipe-meta-item">
                                        ⏱️ Prep: {submittedRecipe.prepTime} min
                                    </span>
                                    <span className="recipe-meta-separator">|</span>
                                    <span className="recipe-meta-item">
                                        👨‍🍳 Cook: {submittedRecipe.cookTime} min
                                    </span>
                                    <span className="recipe-meta-separator">|</span>
                                    <span className="recipe-meta-item">
                                        🎯 Ready in: {totalTime} min
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="recipe-content">
                        <div className="recipe-description">
                            <p>{submittedRecipe.description}</p>
                        </div>

                        {/* Ingredients and Directions Grid */}
                        <div className="recipe-content-grid">
                            {/* Ingredients Column */}
                            <div className="ingredients-display">
                                <h2>Ingredients</h2>
                                <ul className="ingredients-list">
                                    {submittedRecipe.ingredients.map((ing, idx) => (
                                        <li key={idx}>
                                            <span className="ingredient-bullet">•</span>
                                            <span>{ing.quantity} {ing.unit} {ing.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Directions Column */}
                            <div className="directions-display">
                                <h2>Directions</h2>
                                {submittedRecipe.directions.split('\n').map((line, idx) => (
                                    <p key={idx}>{line}</p>
                                ))}
                            </div>
                        </div>

                        {/* Submit Another Recipe Button */}
                        <button onClick={handleNewRecipe} className="new-recipe-btn">
                            Submit Another Recipe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

    // Form view
    return (
        <div className="recipe-container">
            <div className="recipe-wrapper">
                <div className="recipe-card">
                    <h1 className="recipe-title">Share Your Recipe</h1>
                    <p className="recipe-subtitle">Tell us about your delicious creation</p>

                    <form className="form-section" onSubmit={handleSubmit}>
                        {/* Recipe Title */}
                        <div className="form-group">
                            <label className="form-label">Recipe Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Good Old-Fashioned Pancakes"
                            />
                            {errors.title && <p className="error-message">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="form-textarea"
                                placeholder="This is a great recipe that I have..."
                            />
                            {errors.description && <p className="error-message">{errors.description}</p>}
                        </div>

                        {/* Servings, Difficulty, Category */}
                        <div className="form-grid form-grid-3">
                            <div className="form-group">
                                <label className="form-label">Servings *</label>
                                <input
                                    type="number"
                                    name="servings"
                                    value={formData.servings}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="4"
                                    min="1"
                                    max="20"
                                />
                                {errors.servings && <p className="error-message">{errors.servings}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Difficulty *</label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Select...</option>
                                    {difficulties.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                {errors.difficulty && <p className="error-message">{errors.difficulty}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Select...</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="error-message">{errors.category}</p>}
                            </div>
                        </div>

                        {/* Prep and Cook Time */}
                        <div className="time-grid">
                            <div className="form-group">
                                <label className="form-label">Prep Time (minutes) *</label>
                                <input
                                    type="number"
                                    name="prepTime"
                                    value={formData.prepTime}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="15"
                                    min="1"
                                    max="600"
                                />
                                {errors.prepTime && <p className="error-message">{errors.prepTime}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cook Time (minutes) *</label>
                                <input
                                    type="number"
                                    name="cookTime"
                                    value={formData.cookTime}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="20"
                                    min="1"
                                    max="600"
                                />
                                {errors.cookTime && <p className="error-message">{errors.cookTime}</p>}
                            </div>
                        </div>

                        {/* Cuisine Type */}
                        <div className="form-group">
                            <label className="form-label">Cuisine Type *</label>
                            <select
                                name="cuisine"
                                value={formData.cuisine}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="">Select...</option>
                                {cuisines.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            {errors.cuisine && <p className="error-message">{errors.cuisine}</p>}
                        </div>

                        {/* Image URL */}
                        <div className="form-group">
                            <label className="form-label">Recipe Image URL *</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.imageUrl && <p className="error-message">{errors.imageUrl}</p>}
                        </div>

                        {/* Directions */}
                        <div className="directions-section">
                            <h2 className="directions-title">Directions *</h2>
                            <textarea
                                name="directions"
                                value={formData.directions}
                                onChange={handleInputChange}
                                className="directions-input"
                                placeholder="1. In a large bowl, sift together the flour, baking powder, salt and sugar...
2. Heat a lightly oiled griddle or frying pan over medium high heat..."
                            />
                            {errors.directions && <p className="error-message">{errors.directions}</p>}
                        </div>

                        {/* Ingredients Section */}
                        <div className="ingredients-section">
                            <h2 className="ingredients-title">Ingredients</h2>
                            
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="ingredient-card">
                                    <div className="ingredient-header">
                                        <span className="ingredient-label">Ingredient {index + 1}</span>
                                        {formData.ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="remove-btn"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="ingredient-inputs">
                                        <div className="ingredient-name">
                                            <input
                                                type="text"
                                                value={ingredient.name}
                                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                                placeholder="Name"
                                                className="form-input"
                                            />
                                            {errors[`ingredient_${index}_name`] && (
                                                <p className="error-message">{errors[`ingredient_${index}_name`]}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <input
                                                type="number"
                                                value={ingredient.quantity}
                                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                                placeholder="Quantity"
                                                step="0.1"
                                                className="form-input"
                                            />
                                            {errors[`ingredient_${index}_quantity`] && (
                                                <p className="error-message">{errors[`ingredient_${index}_quantity`]}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <select
                                                value={ingredient.unit}
                                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                                className="form-select"
                                            >
                                                <option value="">Unit</option>
                                                {units.map(u => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
                                            </select>
                                            {errors[`ingredient_${index}_unit`] && (
                                                <p className="error-message">{errors[`ingredient_${index}_unit`]}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="add-ingredient-btn"
                            >
                                + Add Ingredient
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-btn">
                            Submit Recipe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}