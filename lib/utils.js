"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExists = exports.error = void 0;
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
exports.error = (message) => {
    console.log(chalk_1.default.red(message));
};
exports.fileExists = async (path) => {
    try {
        await fs_1.promises.access(path, fs_1.constants.F_OK);
        return true;
    }
    catch (_a) {
        return false;
    }
};
