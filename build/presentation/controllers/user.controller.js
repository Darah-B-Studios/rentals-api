"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const user_1 = require("../../domain/models/user");
const user_usecase_1 = require("../../domain/usecases/user.usecase");
const user_repository_1 = require("../../data/repositories/impl/user.repository");
const mapper_1 = require("../mappers/mapper");
const user_request_dto_1 = require("../dtos/user-request.dto");
const class_validator_1 = require("class-validator");
const displayValidationErrors_1 = require("../../utils/displayValidationErrors");
const user_2 = require("../../data/entities/user");
const role_1 = require("../../data/entities/role");
const userRepository = new user_repository_1.UserRepository();
const userUseCase = new user_usecase_1.UserUseCase(userRepository);
const userMapper = new mapper_1.UserMapper();
class UsersController {
    async createUser(req, res) {
        const dto = new user_request_dto_1.UserRequestDto(req.body);
        const validationErrors = await (0, class_validator_1.validate)(dto);
        if (validationErrors.length > 0) {
            res.status(400).json({
                validationErrors: (0, displayValidationErrors_1.displayValidationErrors)(validationErrors),
                success: false,
                data: null,
                message: "Attention!",
            });
        }
        else {
            try {
                const userResponse = await userUseCase.createUser(dto.toData());
                res.status(201).json({
                    data: userResponse.toJSON(),
                    message: "User created Successfully!",
                    validationErrors: [],
                    success: true,
                });
            }
            catch (error) {
                res.status(400).json({
                    data: null,
                    message: error.message,
                    validationErrors: [],
                    success: false,
                });
            }
        }
    }
    async getAll(req, res) {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        try {
            const { rows, count } = await userUseCase.getAll(page, pageSize);
            const usersDTO = userMapper.toDTOs(rows);
            // total pages
            const totalPages = Math.ceil(count / pageSize);
            res.json({
                data: usersDTO,
                message: "Success",
                validationErrors: [],
                success: true,
                currentPage: page,
                totalPages,
            });
        }
        catch (error) {
            res.status(400).json({
                data: null,
                message: error.message,
                validationErrors: [error],
                success: false,
            });
        }
    }
    async updateUser(req, res) {
        const dto = new user_request_dto_1.UserRequestDto(req.body);
        const validationErrors = await (0, class_validator_1.validate)(dto);
        if (validationErrors.length > 0) {
            res.status(400).json({
                validationErrors: (0, displayValidationErrors_1.displayValidationErrors)(validationErrors),
                success: false,
                data: null,
                message: "Attention!",
            });
        }
        else {
            try {
                const id = req.params.id;
                const obj = {
                    ...user_1.emptyUser,
                    ...req.body,
                    id: id,
                };
                const updatedUser = await userUseCase.updateUser(obj);
                const userDto = userMapper.toDTO(updatedUser);
                res.json({
                    data: userDto,
                    message: "User Updated Successfully!",
                    validationErrors: [],
                    success: true,
                });
            }
            catch (error) {
                res.status(400).json({
                    data: null,
                    message: error.message,
                    validationErrors: [error],
                    success: false,
                });
            }
        }
    }
    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            await userUseCase.deleteUser(id);
            res.status(204).json({
                message: `Operation successfully completed!`,
                validationErrors: [],
                success: true,
                data: null,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
                data: null,
                validationErrors: [error],
                success: true,
            });
        }
    }
    async uploadAvatar(req, res) {
        const user = req.user;
        const { filename } = req.file;
        try {
            await userUseCase.updateAvatar(user.id, filename);
            res.json({
                message: "User Avatar uploaded Successfully!",
                success: true,
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
                success: false,
            });
        }
    }
    // Add a role to a user
    async addUserRole(req, res) {
        try {
            const userId = Number(req.params.userId);
            const roleId = Number(req.params.roleId);
            // Find the user and role using their IDs
            const user = await user_2.User.findByPk(userId);
            const role = await role_1.Role.findByPk(roleId);
            if (!user || !role) {
                res
                    .status(404)
                    .json({ message: "User or role not found", success: false });
                return;
            }
            // Add the role to the user using Sequelize association methods
            await user.$add("role", role);
            res.status(200).json({
                message: "Role added to the user successfully",
                success: true,
                validationErrors: [],
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
                data: null,
                validationErrors: [error],
                success: false,
            });
        }
    }
}
exports.UsersController = UsersController;
