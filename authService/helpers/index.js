export const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialChars = '@$!%*?&';
    const allChars = uppercase + lowercase + digits + specialChars;

    let password = '';
    // Ensure at least one character from each required category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password with random characters
    for (let i = 4; i < 8; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    password = password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return password;
};
