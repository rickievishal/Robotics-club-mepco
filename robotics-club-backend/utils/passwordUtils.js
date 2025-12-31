const bcrypt = require('bcrypt');

// Hash password with salt rounds
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Verify password against hash
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Password strength validation
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const checks = {
        length: password.length >= minLength,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    const strength = Object.values(checks).filter(Boolean).length;
    let strengthText = '';
    let strengthColor = '';
    
    if (strength < 3) {
        strengthText = 'Weak';
        strengthColor = 'red';
    } else if (strength < 4) {
        strengthText = 'Fair';
        strengthColor = 'yellow';
    } else if (strength < 5) {
        strengthText = 'Good';
        strengthColor = 'blue';
    } else {
        strengthText = 'Strong';
        strengthColor = 'green';
    }
    
    return {
        checks,
        strength,
        strengthText,
        strengthColor,
        isValid: strength >= 3 // At least Fair strength required
    };
};

module.exports = {
    hashPassword,
    verifyPassword,
    validatePasswordStrength
};
