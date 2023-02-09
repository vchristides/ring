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
//import { createOutputDirectory, outputDirectory, nextDirectory, getUpdatedDate, logfile_name } from './util'
var operators_1 = require("rxjs/operators");
var fs_1 = require("fs");
var path = require("path");
var util_1 = require("util");
/**
 * This example records a 10 second video clip to output/example.mp4
 **/
var now = new Date();
var logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth() + 1) + "-" + 0 + now.getDate() + " " + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
var outputDirectory = path.join(__dirname, 'output');
var nextDirectory = path.join(outputDirectory, logfile_name);
function getUpdatedDate() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            now = new Date();
            //logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth() + 1) + "-" + 0 +now.getDate() + " " + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
            logfile_name = now.getFullYear() + "-" + 0 + (now.getMonth()) + "-" + 0 + now.getDate() + " " + now.getHours() + "h" + now.getMinutes() + "m" + now.getSeconds() + "s" + now.getMilliseconds() + "ms";
            nextDirectory = path.join(outputDirectory, logfile_name);
            now = new Date();
            return [2 /*return*/];
        });
    });
}
function createOutputDirectory() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            getUpdatedDate();
            (0, util_1.promisify)(fs_1.mkdir)(nextDirectory);
            return [2 /*return*/];
        });
    });
}
function example_test() {
    return __awaiter(this, void 0, void 0, function () {
        var ringApi, locations, cameras, front, side, _loop_1, _i, locations_1, location_1, _a, locations_2, location_2, cameras_2, devices, _b, cameras_1, camera;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ringApi = new ring_client_api_1.RingApi({
                        // Replace with your refresh token
                        refreshToken: process.env.RING_REFRESH_TOKEN,
                        debug: true
                    });
                    return [4 /*yield*/, ringApi.getLocations()];
                case 1:
                    locations = _c.sent();
                    return [4 /*yield*/, ringApi.getCameras()];
                case 2:
                    cameras = _c.sent(), front = cameras[0], side = cameras[1];
                    console.log("Found ".concat(locations.length, " location(s) with ").concat(cameras.length, " camera(s)."));
                    _loop_1 = function (location_1) {
                        location_1.onConnected.pipe((0, operators_1.skip)(1)).subscribe(function (connected) {
                            var status = connected ? 'Connected to' : 'Disconnected from';
                            console.log("**** ".concat(status, " location ").concat(location_1.name, " - ").concat(location_1.id));
                            getUpdatedDate();
                        });
                    };
                    for (_i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                        location_1 = locations_1[_i];
                        _loop_1(location_1);
                    }
                    _a = 0, locations_2 = locations;
                    _c.label = 3;
                case 3:
                    if (!(_a < locations_2.length)) return [3 /*break*/, 6];
                    location_2 = locations_2[_a];
                    cameras_2 = location_2.cameras;
                    return [4 /*yield*/, location_2.getDevices()];
                case 4:
                    devices = _c.sent();
                    getUpdatedDate();
                    console.log("\nLocation ".concat(location_2.name, " (").concat(location_2.id, ") has the following ").concat(cameras_2.length, " camera(s):"));
                    for (_b = 0, cameras_1 = cameras_2; _b < cameras_1.length; _b++) {
                        camera = cameras_1[_b];
                        console.log("- ".concat(camera.id, ": ").concat(camera.name, " (").concat(camera.deviceType, ")"));
                    }
                    _c.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    if (cameras.length) {
                        cameras.forEach(function (camera) {
                            camera.onNewNotification.subscribe(function (notification) {
                                var event = notification.action === ring_client_api_1.PushNotificationAction.Motion
                                    ? 'Motion detected'
                                    : notification.action === ring_client_api_1.PushNotificationAction.Ding
                                        ? 'Doorbell pressed'
                                        : "Video started (".concat(notification.action, ")");
                                console.log("".concat(event, " on ").concat(camera.name, " camera. Ding id ").concat(notification.ding.id, ".  Received at ").concat(new Date()));
                                getUpdatedDate();
                                createOutputDirectory();
                                console.log("Starting Video from ".concat(front.name, "..."));
                                front.recordToFile(path.join(nextDirectory, 'front.mp4'), 15);
                                console.log('Done recording video');
                                console.log("Starting Video from ".concat(side.name, "..."));
                                side.recordToFile(path.join(nextDirectory, 'side.mp4'), 15);
                                console.log('Done recording video');
                            });
                        });
                        console.log('Listening for motion and doorbell presses on your cameras.');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
example_test()["catch"](function (e) {
    console.error(e);
    process.exit(1);
});
