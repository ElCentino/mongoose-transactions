"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = require("../src/main");
var mongoose = require("mongoose");
// mongoose.Promise = global.Promise
describe('Transaction using DB ', function () {
    var options = {
        useMongoClient: true
    };
    mongoose.connection
        .on('error', function (err) { return console.warn('Warning', err); });
    var transaction;
    var personSchema = new mongoose.Schema({
        age: Number,
        name: String
    });
    var carSchema = new mongoose.Schema({
        age: Number,
        name: String
    });
    var Person = mongoose.model('Person', personSchema);
    var Car = mongoose.model('Car', carSchema);
    function dropCollections() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Person.remove({})];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Car.remove({})];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * connect to database
     */
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose.connect("mongodb://localhost/mongoose-transactions", options)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * drop database collections
     * create new Transaction using database storage
     */
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var useDB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dropCollections()];
                case 1:
                    _a.sent();
                    useDB = true;
                    transaction = new main_1.default(useDB);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * drop database collections
     * close database connection
     */
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dropCollections()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mongoose.connection.close()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * remove transactions collection from database
     */
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transaction.removeDbTransaction()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('should create new transaction and remove it', function () { return __awaiter(_this, void 0, void 0, function () {
        var person, transId, trans, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    person = 'Person';
                    return [4 /*yield*/, transaction.createTransaction()];
                case 1:
                    transId = _b.sent();
                    return [4 /*yield*/, transaction.loadDbTransaction(transId)];
                case 2:
                    trans = _b.sent();
                    expect(trans.status).toBe('pending');
                    return [4 /*yield*/, transaction.removeDbTransaction(transId)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, transaction.loadDbTransaction(transId)];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    test('should insert, update and run storing it in database', function () { return __awaiter(_this, void 0, void 0, function () {
        var person, transId, tonyObject, nicolaObject, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    person = 'Person';
                    return [4 /*yield*/, transaction.createTransaction()];
                case 1:
                    transId = _a.sent();
                    tonyObject = {
                        age: 28,
                        name: 'Tony'
                    };
                    nicolaObject = {
                        age: 32,
                        name: 'Nicola',
                    };
                    transaction.insert(person, tonyObject);
                    transaction.update(person, nicolaObject);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, transaction.run()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=db.spec.js.map