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
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid order request');
    if (!payload.orderedBooks)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid order request');
    const oderData = {
        userId: user.userId,
        orderedBooks: payload.orderedBooks,
    };
    const result = yield prisma_1.default.order.create({
        data: oderData,
    });
    return result;
});
const getAllFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    if (user.role === 'admin') {
        const result = yield prisma_1.default.order.findMany();
        return result;
    }
    if (user.role === 'customer') {
        const result = yield prisma_1.default.order.findMany({
            where: {
                userId: user.userId,
            },
        });
        return result;
    }
});
const getById = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    if (user.role === 'admin') {
        const result = yield prisma_1.default.order.findUnique({
            where: {
                id: id,
            },
        });
        return result;
    }
    if (user.role === 'customer') {
        const result = yield prisma_1.default.order.findUniqueOrThrow({
            where: {
                id: id,
                userId: user.userId,
            },
        });
        return result;
    }
});
exports.OrderService = {
    insertIntoDB,
    getAllFromDB,
    getById,
};
