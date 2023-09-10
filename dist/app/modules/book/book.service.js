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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.create({
        data: payload,
        include: { category: true },
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { search, minPrice, maxPrice, category } = filters, filtersData = __rest(filters, ["search", "minPrice", "maxPrice", "category"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: ['title', 'author', 'genre'].map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (minPrice) {
        andConditions.push({
            AND: {
                price: {
                    gte: Number(minPrice),
                },
            },
        });
    }
    if (maxPrice) {
        andConditions.push({
            AND: {
                price: {
                    lte: Number(maxPrice),
                },
            },
        });
    }
    if (category) {
        andConditions.push({
            AND: {
                categoryId: category,
            },
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: {
                    equals: filtersData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.book.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include: { category: true },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.book.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);
    return {
        meta: {
            page,
            size: limit,
            total,
            totalPages,
        },
        data: result,
    };
});
const getByCategory = (id, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const result = yield prisma_1.default.book.findMany({
        where: { categoryId: id },
        skip,
        take: limit,
        include: { category: true },
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.book.count({ where: { categoryId: id } });
    const totalPages = Math.ceil(total / limit);
    return {
        meta: {
            page,
            size: limit,
            total,
            totalPages,
        },
        data: result,
    };
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: {
            id: id,
        },
    });
    return result;
});
const updateById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExists = yield prisma_1.default.book.findUnique({
        where: {
            id: id,
        },
    });
    if (!isBookExists)
        throw new ApiError_1.default(http_status_1.default.NOT_EXTENDED, 'Book not found with this id');
    const result = yield prisma_1.default.book.update({
        where: { id: id },
        data: payload,
    });
    return result;
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExists = yield prisma_1.default.book.findUnique({
        where: {
            id: id,
        },
    });
    if (!isBookExists)
        throw new ApiError_1.default(http_status_1.default.NOT_EXTENDED, 'Book not found with this id');
    const result = yield prisma_1.default.book.delete({
        where: { id: id },
        select: {
            id: true,
            title: true,
            author: true,
            genre: true,
            price: true,
            publicationDate: true,
            categoryId: true,
        },
    });
    return result;
});
exports.BookService = {
    insertIntoDB,
    getAllFromDB,
    getByCategory,
    getById,
    updateById,
    deleteById,
};
