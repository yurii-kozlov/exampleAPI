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
const user_service_1 = __importDefault(require("../service/user-service"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const api_error_1 = __importDefault(require("../exceptions/api-error"));
dotenv_1.default.config();
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(api_error_1.default.BadRequest('Validation Error', errors.array()));
                }
                const { email, password } = req.body;
                const userData = yield user_service_1.default.registration(email, password);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield user_service_1.default.login(email, password);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const token = yield user_service_1.default.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.json(token);
            }
            catch (error) {
                next(error);
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                yield user_service_1.default.activate(activationLink);
                return res.redirect(`${process.env.CLIENT_URL}/signIn`);
            }
            catch (error) {
                next(error);
            }
        });
    }
    setPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, plan } = req.body;
                const user = yield user_service_1.default.setPlan(plan, email);
                return res.json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addMovieToWatchLaterList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { watchLaterMovie, email } = req.body;
                yield user_service_1.default.addMovieToWatchLaterList(watchLaterMovie, email);
                return res.json(watchLaterMovie);
            }
            catch (error) {
                next(error);
            }
        });
    }
    addMovieToLikedList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { likedMovie, email } = req.body;
                yield user_service_1.default.addMovieToLikedList(likedMovie, email);
                return res.json(likedMovie);
            }
            catch (error) {
                next(error);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const userData = yield user_service_1.default.refresh(refreshToken);
                res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getAllUsers();
                return res.json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user-controller.js.map