"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.plan = model.plan;
        this.watchLaterMovies = model.watchLaterMovies;
        this.likedMovies = model.likedMovies;
    }
}
exports.default = UserDto;
//# sourceMappingURL=user-dto.js.map