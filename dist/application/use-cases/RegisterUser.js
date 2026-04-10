"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegisterUser {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // We omit the passwordHash from the return value so it NEVER gets sent back to the browser
    async execute(userData) {
        // 1. Check if email is already taken
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email is already registered.');
        }
        // 2. Hash the password (encrypt it)
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(userData.passwordHash, salt);
        // 3. Create the secure user object
        const newUser = {
            email: userData.email,
            passwordHash: hashedPassword,
            role: userData.role || 'Customer',
            createdAt: new Date()
        };
        // 4. Save to the database
        const savedUser = await this.userRepository.create(newUser);
        // 5. Strip the password before returning the result
        const { passwordHash, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
}
exports.RegisterUser = RegisterUser;
