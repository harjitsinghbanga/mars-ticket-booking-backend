"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUser {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, plainPassword) {
        // 1. Find the user
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password.');
        }
        // 2. Check if the password matches the hash
        const isMatch = await bcryptjs_1.default.compare(plainPassword, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password.');
        }
        // 3. Generate the JWT (The Digital Badge)
        const secret = process.env.JWT_SECRET || 'mars_super_secret_key_123';
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '1h' });
        return token;
    }
}
exports.LoginUser = LoginUser;
