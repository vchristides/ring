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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv/config");
var ring_client_api_1 = require("../ring-client-api");
var util_1 = require("./util");
var path = require("path");
/**
 * This example records a 10 second video clip to output/example.mp4
 **/
function example() {
    return __awaiter(this, void 0, void 0, function () {
        var ringApi, cameras, front, side;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ringApi = new ring_client_api_1.RingApi({
                        // Replace with your refresh token
                        refreshToken: process.env.RING_REFRESH_TOKEN,
                        debug: true
                    });
                    return [4 /*yield*/, ringApi.getCameras()];
                case 1:
                    cameras = _a.sent(), front = cameras[0], side = cameras[1];
                    if (!front) {
                        console.log('No cameras found');
                        return [2 /*return*/];
                    }
                    // clean/create the output directory
                    return [4 /*yield*/, (0, util_1.cleanOutputDirectory)()];
                case 2:
                    // clean/create the output directory
                    _a.sent();
                    console.log("Starting Video from ".concat(front.name, " ..."));
                    return [4 /*yield*/, front.recordToFile(path.join(util_1.outputDirectory, 'front.mp4'), 10)];
                case 3:
                    _a.sent();
                    console.log('Done recording video');
                    console.log("Starting Video from ".concat(side.name, " ..."));
                    return [4 /*yield*/, side.recordToFile(path.join(util_1.outputDirectory, 'side.mp4'), 10)];
                case 4:
                    _a.sent();
                    console.log('Done recording video');
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
example()["catch"](function (e) {
    console.error(e);
    process.exit(1);
});
