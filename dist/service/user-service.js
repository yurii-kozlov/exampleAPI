"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user-model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const mail_service_1 = __importDefault(require("../service/mail-service"));
const token_service_1 = __importDefault(require("../service/token-service"));
const user_dto_1 = __importDefault(require("../dtos/user-dto"));
const api_error_1 = __importDefault(require("../exceptions/api-error"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_2 = __importDefault(require("../models/user-model"));
dotenv_1.default.config();
class UserService {
    registration(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield user_model_1.default.findOne({ email });
            if (candidate) {
                throw api_error_1.default.BadRequest(`The user with the email ${email} already exists`);
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const user = yield user_model_1.default.create({
                email,
                password: hashPassword,
                activationLink
            });
            yield mail_service_1.default.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
            const userDto = new user_dto_1.default(user);
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userDto));
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ activationLink });
            if (!user) {
                throw api_error_1.default.BadRequest('Invalid activation link');
            }
            user.isActivated = true;
            yield user.save();
        });
    }
    setPlan(plan, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest(`The user with the email ${email} doesn't exist. Please register first`);
            }
            user.plan = plan;
            yield user.save();
            const userDto = new user_dto_1.default(user);
            return userDto;
        });
    }
    addMovieToWatchLaterList(movie, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest(`The user with the email ${email} doesn't exist. Please register first`);
            }
            user.watchLaterMovies = [...user.watchLaterMovies, movie];
            yield user.save();
        });
    }
    addMovieToLikedList(movie, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest(`The user with the email ${email} doesn't exist. Please register first`);
            }
            user.likedMovies = [...user.likedMovies, movie];
            yield user.save();
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_2.default.findOne({ email });
            if (!user) {
                throw api_error_1.default.BadRequest('The user with the indicated email hasn\'t been found');
            }
            const arePasswordsEqual = yield bcrypt_1.default.compare(password, user.password);
            if (!arePasswordsEqual) {
                throw api_error_1.default.BadRequest('The password is wrong');
            }
            const userDto = new user_dto_1.default(user);
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userDto));
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield token_service_1.default.removeToken(refreshToken);
            return token;
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_1.default.UnathorizedError();
            }
            const userData = token_service_1.default.validateRefreshToken(refreshToken);
            const tokenFromDb = yield token_service_1.default.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw api_error_1.default.UnathorizedError();
            }
            const user = yield user_model_2.default.findById(userData.id);
            const userDto = new user_dto_1.default(user);
            const tokens = token_service_1.default.generateTokens(Object.assign({}, userDto));
            yield token_service_1.default.saveToken(userDto.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user: userDto });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_2.default.find();
            return users;
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user-service.js.map