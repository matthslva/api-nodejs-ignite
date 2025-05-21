"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/tarn/dist/TimeoutError.js
var require_TimeoutError = __commonJS({
  "node_modules/tarn/dist/TimeoutError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var TimeoutError = class extends Error {
    };
    exports2.TimeoutError = TimeoutError;
  }
});

// node_modules/tarn/dist/PromiseInspection.js
var require_PromiseInspection = __commonJS({
  "node_modules/tarn/dist/PromiseInspection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var PromiseInspection = class {
      constructor(args) {
        this._value = args.value;
        this._error = args.error;
      }
      value() {
        return this._value;
      }
      reason() {
        return this._error;
      }
      isRejected() {
        return !!this._error;
      }
      isFulfilled() {
        return !!this._value;
      }
    };
    exports2.PromiseInspection = PromiseInspection;
  }
});

// node_modules/tarn/dist/utils.js
var require_utils = __commonJS({
  "node_modules/tarn/dist/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var PromiseInspection_1 = require_PromiseInspection();
    function defer() {
      let resolve = null;
      let reject = null;
      const promise = new Promise((resolver, rejecter) => {
        resolve = resolver;
        reject = rejecter;
      });
      return {
        promise,
        resolve,
        reject
      };
    }
    exports2.defer = defer;
    function now() {
      return Date.now();
    }
    exports2.now = now;
    function duration(t1, t2) {
      return Math.abs(t2 - t1);
    }
    exports2.duration = duration;
    function checkOptionalTime(time) {
      if (typeof time === "undefined") {
        return true;
      }
      return checkRequiredTime(time);
    }
    exports2.checkOptionalTime = checkOptionalTime;
    function checkRequiredTime(time) {
      return typeof time === "number" && time === Math.round(time) && time > 0;
    }
    exports2.checkRequiredTime = checkRequiredTime;
    function delay(millis) {
      return new Promise((resolve) => setTimeout(resolve, millis));
    }
    exports2.delay = delay;
    function reflect(promise) {
      return promise.then((value) => {
        return new PromiseInspection_1.PromiseInspection({ value });
      }).catch((error) => {
        return new PromiseInspection_1.PromiseInspection({ error });
      });
    }
    exports2.reflect = reflect;
    function tryPromise(cb) {
      try {
        const result = cb();
        return Promise.resolve(result);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    exports2.tryPromise = tryPromise;
  }
});

// node_modules/tarn/dist/PendingOperation.js
var require_PendingOperation = __commonJS({
  "node_modules/tarn/dist/PendingOperation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var TimeoutError_1 = require_TimeoutError();
    var utils_1 = require_utils();
    var PendingOperation = class {
      constructor(timeoutMillis) {
        this.timeoutMillis = timeoutMillis;
        this.deferred = utils_1.defer();
        this.possibleTimeoutCause = null;
        this.isRejected = false;
        this.promise = timeout(this.deferred.promise, timeoutMillis).catch((err) => {
          if (err instanceof TimeoutError_1.TimeoutError) {
            if (this.possibleTimeoutCause) {
              err = new TimeoutError_1.TimeoutError(this.possibleTimeoutCause.message);
            } else {
              err = new TimeoutError_1.TimeoutError("operation timed out for an unknown reason");
            }
          }
          this.isRejected = true;
          return Promise.reject(err);
        });
      }
      abort() {
        this.reject(new Error("aborted"));
      }
      reject(err) {
        this.deferred.reject(err);
      }
      resolve(value) {
        this.deferred.resolve(value);
      }
    };
    exports2.PendingOperation = PendingOperation;
    function timeout(promise, time) {
      return new Promise((resolve, reject) => {
        const timeoutHandle = setTimeout(() => reject(new TimeoutError_1.TimeoutError()), time);
        promise.then((result) => {
          clearTimeout(timeoutHandle);
          resolve(result);
        }).catch((err) => {
          clearTimeout(timeoutHandle);
          reject(err);
        });
      });
    }
  }
});

// node_modules/tarn/dist/Resource.js
var require_Resource = __commonJS({
  "node_modules/tarn/dist/Resource.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var utils_1 = require_utils();
    var Resource = class _Resource {
      constructor(resource) {
        this.resource = resource;
        this.resource = resource;
        this.timestamp = utils_1.now();
        this.deferred = utils_1.defer();
      }
      get promise() {
        return this.deferred.promise;
      }
      resolve() {
        this.deferred.resolve(void 0);
        return new _Resource(this.resource);
      }
    };
    exports2.Resource = Resource;
  }
});

// node_modules/tarn/dist/Pool.js
var require_Pool = __commonJS({
  "node_modules/tarn/dist/Pool.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var PendingOperation_1 = require_PendingOperation();
    var Resource_1 = require_Resource();
    var utils_1 = require_utils();
    var events_1 = require("events");
    var timers_1 = require("timers");
    var Pool = class {
      constructor(opt) {
        this.destroyed = false;
        this.emitter = new events_1.EventEmitter();
        opt = opt || {};
        if (!opt.create) {
          throw new Error("Tarn: opt.create function most be provided");
        }
        if (!opt.destroy) {
          throw new Error("Tarn: opt.destroy function most be provided");
        }
        if (typeof opt.min !== "number" || opt.min < 0 || opt.min !== Math.round(opt.min)) {
          throw new Error("Tarn: opt.min must be an integer >= 0");
        }
        if (typeof opt.max !== "number" || opt.max <= 0 || opt.max !== Math.round(opt.max)) {
          throw new Error("Tarn: opt.max must be an integer > 0");
        }
        if (opt.min > opt.max) {
          throw new Error("Tarn: opt.max is smaller than opt.min");
        }
        if (!utils_1.checkOptionalTime(opt.acquireTimeoutMillis)) {
          throw new Error("Tarn: invalid opt.acquireTimeoutMillis " + JSON.stringify(opt.acquireTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.createTimeoutMillis)) {
          throw new Error("Tarn: invalid opt.createTimeoutMillis " + JSON.stringify(opt.createTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.destroyTimeoutMillis)) {
          throw new Error("Tarn: invalid opt.destroyTimeoutMillis " + JSON.stringify(opt.destroyTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.idleTimeoutMillis)) {
          throw new Error("Tarn: invalid opt.idleTimeoutMillis " + JSON.stringify(opt.idleTimeoutMillis));
        }
        if (!utils_1.checkOptionalTime(opt.reapIntervalMillis)) {
          throw new Error("Tarn: invalid opt.reapIntervalMillis " + JSON.stringify(opt.reapIntervalMillis));
        }
        if (!utils_1.checkOptionalTime(opt.createRetryIntervalMillis)) {
          throw new Error("Tarn: invalid opt.createRetryIntervalMillis " + JSON.stringify(opt.createRetryIntervalMillis));
        }
        const allowedKeys = {
          create: true,
          validate: true,
          destroy: true,
          log: true,
          min: true,
          max: true,
          acquireTimeoutMillis: true,
          createTimeoutMillis: true,
          destroyTimeoutMillis: true,
          idleTimeoutMillis: true,
          reapIntervalMillis: true,
          createRetryIntervalMillis: true,
          propagateCreateError: true
        };
        for (const key of Object.keys(opt)) {
          if (!allowedKeys[key]) {
            throw new Error(`Tarn: unsupported option opt.${key}`);
          }
        }
        this.creator = opt.create;
        this.destroyer = opt.destroy;
        this.validate = typeof opt.validate === "function" ? opt.validate : () => true;
        this.log = opt.log || (() => {
        });
        this.acquireTimeoutMillis = opt.acquireTimeoutMillis || 3e4;
        this.createTimeoutMillis = opt.createTimeoutMillis || 3e4;
        this.destroyTimeoutMillis = opt.destroyTimeoutMillis || 5e3;
        this.idleTimeoutMillis = opt.idleTimeoutMillis || 3e4;
        this.reapIntervalMillis = opt.reapIntervalMillis || 1e3;
        this.createRetryIntervalMillis = opt.createRetryIntervalMillis || 200;
        this.propagateCreateError = !!opt.propagateCreateError;
        this.min = opt.min;
        this.max = opt.max;
        this.used = [];
        this.free = [];
        this.pendingCreates = [];
        this.pendingAcquires = [];
        this.pendingDestroys = [];
        this.pendingValidations = [];
        this.destroyed = false;
        this.interval = null;
        this.eventId = 1;
      }
      numUsed() {
        return this.used.length;
      }
      numFree() {
        return this.free.length;
      }
      numPendingAcquires() {
        return this.pendingAcquires.length;
      }
      numPendingValidations() {
        return this.pendingValidations.length;
      }
      numPendingCreates() {
        return this.pendingCreates.length;
      }
      acquire() {
        const eventId = this.eventId++;
        this._executeEventHandlers("acquireRequest", eventId);
        const pendingAcquire = new PendingOperation_1.PendingOperation(this.acquireTimeoutMillis);
        this.pendingAcquires.push(pendingAcquire);
        pendingAcquire.promise = pendingAcquire.promise.then((resource) => {
          this._executeEventHandlers("acquireSuccess", eventId, resource);
          return resource;
        }).catch((err) => {
          this._executeEventHandlers("acquireFail", eventId, err);
          remove(this.pendingAcquires, pendingAcquire);
          return Promise.reject(err);
        });
        this._tryAcquireOrCreate();
        return pendingAcquire;
      }
      release(resource) {
        this._executeEventHandlers("release", resource);
        for (let i = 0, l = this.used.length; i < l; ++i) {
          const used = this.used[i];
          if (used.resource === resource) {
            this.used.splice(i, 1);
            this.free.push(used.resolve());
            this._tryAcquireOrCreate();
            return true;
          }
        }
        return false;
      }
      isEmpty() {
        return [
          this.numFree(),
          this.numUsed(),
          this.numPendingAcquires(),
          this.numPendingValidations(),
          this.numPendingCreates()
        ].reduce((total, value) => total + value) === 0;
      }
      /**
       * Reaping cycle.
       */
      check() {
        const timestamp = utils_1.now();
        const newFree = [];
        const minKeep = this.min - this.used.length;
        const maxDestroy = this.free.length - minKeep;
        let numDestroyed = 0;
        this.free.forEach((free) => {
          if (utils_1.duration(timestamp, free.timestamp) >= this.idleTimeoutMillis && numDestroyed < maxDestroy) {
            numDestroyed++;
            this._destroy(free.resource);
          } else {
            newFree.push(free);
          }
        });
        this.free = newFree;
        if (this.isEmpty()) {
          this._stopReaping();
        }
      }
      destroy() {
        const eventId = this.eventId++;
        this._executeEventHandlers("poolDestroyRequest", eventId);
        this._stopReaping();
        this.destroyed = true;
        return utils_1.reflect(Promise.all(this.pendingCreates.map((create) => utils_1.reflect(create.promise))).then(() => {
          return new Promise((resolve, reject) => {
            if (this.numPendingValidations() === 0) {
              resolve();
              return;
            }
            const interval = setInterval(() => {
              if (this.numPendingValidations() === 0) {
                timers_1.clearInterval(interval);
                resolve();
              }
            }, 100);
          });
        }).then(() => {
          return Promise.all(this.used.map((used) => utils_1.reflect(used.promise)));
        }).then(() => {
          return Promise.all(this.pendingAcquires.map((acquire) => {
            acquire.abort();
            return utils_1.reflect(acquire.promise);
          }));
        }).then(() => {
          return Promise.all(this.free.map((free) => utils_1.reflect(this._destroy(free.resource))));
        }).then(() => {
          return Promise.all(this.pendingDestroys.map((pd) => pd.promise));
        }).then(() => {
          this.free = [];
          this.pendingAcquires = [];
        })).then((res) => {
          this._executeEventHandlers("poolDestroySuccess", eventId);
          this.emitter.removeAllListeners();
          return res;
        });
      }
      on(event, listener) {
        this.emitter.on(event, listener);
      }
      removeListener(event, listener) {
        this.emitter.removeListener(event, listener);
      }
      removeAllListeners(event) {
        this.emitter.removeAllListeners(event);
      }
      /**
       * The most important method that is called always when resources
       * are created / destroyed / acquired / released. In other words
       * every time when resources are moved from used to free or vice
       * versa.
       *
       * Either assigns free resources to pendingAcquires or creates new
       * resources if there is room for it in the pool.
       */
      _tryAcquireOrCreate() {
        if (this.destroyed) {
          return;
        }
        if (this._hasFreeResources()) {
          this._doAcquire();
        } else if (this._shouldCreateMoreResources()) {
          this._doCreate();
        }
      }
      _hasFreeResources() {
        return this.free.length > 0;
      }
      _doAcquire() {
        while (this._canAcquire()) {
          const pendingAcquire = this.pendingAcquires.shift();
          const free = this.free.pop();
          if (free === void 0 || pendingAcquire === void 0) {
            const errMessage = "this.free was empty while trying to acquire resource";
            this.log(`Tarn: ${errMessage}`, "warn");
            throw new Error(`Internal error, should never happen. ${errMessage}`);
          }
          this.pendingValidations.push(pendingAcquire);
          this.used.push(free);
          const abortAbleValidation = new PendingOperation_1.PendingOperation(this.acquireTimeoutMillis);
          pendingAcquire.promise.catch((err) => {
            abortAbleValidation.abort();
          });
          abortAbleValidation.promise.catch((err) => {
            this.log("Tarn: resource validator threw an exception " + err.stack, "warn");
            return false;
          }).then((validationSuccess) => {
            try {
              if (validationSuccess && !pendingAcquire.isRejected) {
                this._startReaping();
                pendingAcquire.resolve(free.resource);
              } else {
                remove(this.used, free);
                if (!validationSuccess) {
                  this._destroy(free.resource);
                  setTimeout(() => {
                    this._tryAcquireOrCreate();
                  }, 0);
                } else {
                  this.free.push(free);
                }
                if (!pendingAcquire.isRejected) {
                  this.pendingAcquires.unshift(pendingAcquire);
                }
              }
            } finally {
              remove(this.pendingValidations, pendingAcquire);
            }
          });
          this._validateResource(free.resource).then((validationSuccess) => {
            abortAbleValidation.resolve(validationSuccess);
          }).catch((err) => {
            abortAbleValidation.reject(err);
          });
        }
      }
      _canAcquire() {
        return this.free.length > 0 && this.pendingAcquires.length > 0;
      }
      _validateResource(resource) {
        try {
          return Promise.resolve(this.validate(resource));
        } catch (err) {
          return Promise.reject(err);
        }
      }
      _shouldCreateMoreResources() {
        return this.used.length + this.pendingCreates.length < this.max && this.pendingCreates.length < this.pendingAcquires.length;
      }
      _doCreate() {
        const pendingAcquiresBeforeCreate = this.pendingAcquires.slice();
        const pendingCreate = this._create();
        pendingCreate.promise.then(() => {
          this._tryAcquireOrCreate();
          return null;
        }).catch((err) => {
          if (this.propagateCreateError && this.pendingAcquires.length !== 0) {
            this.pendingAcquires[0].reject(err);
          }
          pendingAcquiresBeforeCreate.forEach((pendingAcquire) => {
            pendingAcquire.possibleTimeoutCause = err;
          });
          utils_1.delay(this.createRetryIntervalMillis).then(() => this._tryAcquireOrCreate());
        });
      }
      _create() {
        const eventId = this.eventId++;
        this._executeEventHandlers("createRequest", eventId);
        const pendingCreate = new PendingOperation_1.PendingOperation(this.createTimeoutMillis);
        pendingCreate.promise = pendingCreate.promise.catch((err) => {
          if (remove(this.pendingCreates, pendingCreate)) {
            this._executeEventHandlers("createFail", eventId, err);
          }
          throw err;
        });
        this.pendingCreates.push(pendingCreate);
        callbackOrPromise(this.creator).then((resource) => {
          if (pendingCreate.isRejected) {
            this.destroyer(resource);
            return null;
          }
          remove(this.pendingCreates, pendingCreate);
          this.free.push(new Resource_1.Resource(resource));
          pendingCreate.resolve(resource);
          this._executeEventHandlers("createSuccess", eventId, resource);
          return null;
        }).catch((err) => {
          if (pendingCreate.isRejected) {
            return null;
          }
          if (remove(this.pendingCreates, pendingCreate)) {
            this._executeEventHandlers("createFail", eventId, err);
          }
          pendingCreate.reject(err);
          return null;
        });
        return pendingCreate;
      }
      _destroy(resource) {
        const eventId = this.eventId++;
        this._executeEventHandlers("destroyRequest", eventId, resource);
        const pendingDestroy = new PendingOperation_1.PendingOperation(this.destroyTimeoutMillis);
        const retVal = Promise.resolve().then(() => this.destroyer(resource));
        retVal.then(() => {
          pendingDestroy.resolve(resource);
        }).catch((err) => {
          pendingDestroy.reject(err);
        });
        this.pendingDestroys.push(pendingDestroy);
        return pendingDestroy.promise.then((res) => {
          this._executeEventHandlers("destroySuccess", eventId, resource);
          return res;
        }).catch((err) => this._logDestroyerError(eventId, resource, err)).then((res) => {
          const index = this.pendingDestroys.findIndex((pd) => pd === pendingDestroy);
          this.pendingDestroys.splice(index, 1);
          return res;
        });
      }
      _logDestroyerError(eventId, resource, err) {
        this._executeEventHandlers("destroyFail", eventId, resource, err);
        this.log("Tarn: resource destroyer threw an exception " + err.stack, "warn");
      }
      _startReaping() {
        if (!this.interval) {
          this._executeEventHandlers("startReaping");
          this.interval = setInterval(() => this.check(), this.reapIntervalMillis);
        }
      }
      _stopReaping() {
        if (this.interval !== null) {
          this._executeEventHandlers("stopReaping");
          timers_1.clearInterval(this.interval);
        }
        this.interval = null;
      }
      _executeEventHandlers(eventName, ...args) {
        const listeners = this.emitter.listeners(eventName);
        listeners.forEach((listener) => {
          try {
            listener(...args);
          } catch (err) {
            this.log(`Tarn: event handler "${eventName}" threw an exception ${err.stack}`, "warn");
          }
        });
      }
    };
    exports2.Pool = Pool;
    function remove(arr, item) {
      const idx = arr.indexOf(item);
      if (idx === -1) {
        return false;
      } else {
        arr.splice(idx, 1);
        return true;
      }
    }
    function callbackOrPromise(func) {
      return new Promise((resolve, reject) => {
        const callback = (err, resource) => {
          if (err) {
            reject(err);
          } else {
            resolve(resource);
          }
        };
        utils_1.tryPromise(() => func(callback)).then((res) => {
          if (res) {
            resolve(res);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    }
  }
});

// node_modules/tarn/dist/tarn.js
var require_tarn = __commonJS({
  "node_modules/tarn/dist/tarn.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Pool_1 = require_Pool();
    exports2.Pool = Pool_1.Pool;
    var TimeoutError_1 = require_TimeoutError();
    exports2.TimeoutError = TimeoutError_1.TimeoutError;
    module2.exports = {
      Pool: Pool_1.Pool,
      TimeoutError: TimeoutError_1.TimeoutError
    };
  }
});

// node_modules/knex/lib/util/string.js
var require_string = __commonJS({
  "node_modules/knex/lib/util/string.js"(exports2, module2) {
    "use strict";
    var charsRegex = /[\0\b\t\n\r\x1a"'\\]/g;
    var charsMap = {
      "\0": "\\0",
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\r": "\\r",
      "": "\\Z",
      '"': '\\"',
      "'": "\\'",
      "\\": "\\\\"
    };
    function wrapEscape(escapeFn) {
      return function finalEscape(val, ctx = {}) {
        return escapeFn(val, finalEscape, ctx);
      };
    }
    function makeEscape(config3 = {}) {
      const finalEscapeDate = config3.escapeDate || dateToString;
      const finalEscapeArray = config3.escapeArray || arrayToList;
      const finalEscapeBuffer = config3.escapeBuffer || bufferToString;
      const finalEscapeString = config3.escapeString || escapeString;
      const finalEscapeObject = config3.escapeObject || escapeObject;
      const finalWrap = config3.wrap || wrapEscape;
      function escapeFn(val, finalEscape, ctx) {
        if (val === void 0 || val === null) {
          return "NULL";
        }
        switch (typeof val) {
          case "boolean":
            return val ? "true" : "false";
          case "number":
            return val + "";
          case "object":
            if (val instanceof Date) {
              val = finalEscapeDate(val, finalEscape, ctx);
            } else if (Array.isArray(val)) {
              return finalEscapeArray(val, finalEscape, ctx);
            } else if (Buffer.isBuffer(val)) {
              return finalEscapeBuffer(val, finalEscape, ctx);
            } else {
              return finalEscapeObject(val, finalEscape, ctx);
            }
        }
        return finalEscapeString(val, finalEscape, ctx);
      }
      return finalWrap ? finalWrap(escapeFn) : escapeFn;
    }
    function escapeObject(val, finalEscape, ctx) {
      if (val && typeof val.toSQL === "function") {
        return val.toSQL(ctx);
      } else {
        return JSON.stringify(val);
      }
    }
    function arrayToList(array, finalEscape, ctx) {
      let sql = "";
      for (let i = 0; i < array.length; i++) {
        const val = array[i];
        if (Array.isArray(val)) {
          sql += (i === 0 ? "" : ", ") + "(" + arrayToList(val, finalEscape, ctx) + ")";
        } else {
          sql += (i === 0 ? "" : ", ") + finalEscape(val, ctx);
        }
      }
      return sql;
    }
    function bufferToString(buffer) {
      return "X" + escapeString(buffer.toString("hex"));
    }
    function escapeString(val, finalEscape, ctx) {
      let chunkIndex = charsRegex.lastIndex = 0;
      let escapedVal = "";
      let match;
      while (match = charsRegex.exec(val)) {
        escapedVal += val.slice(chunkIndex, match.index) + charsMap[match[0]];
        chunkIndex = charsRegex.lastIndex;
      }
      if (chunkIndex === 0) {
        return "'" + val + "'";
      }
      if (chunkIndex < val.length) {
        return "'" + escapedVal + val.slice(chunkIndex) + "'";
      }
      return "'" + escapedVal + "'";
    }
    function dateToString(date, finalEscape, ctx = {}) {
      const timeZone = ctx.timeZone || "local";
      const dt = new Date(date);
      let year;
      let month;
      let day;
      let hour;
      let minute;
      let second;
      let millisecond;
      if (timeZone === "local") {
        year = dt.getFullYear();
        month = dt.getMonth() + 1;
        day = dt.getDate();
        hour = dt.getHours();
        minute = dt.getMinutes();
        second = dt.getSeconds();
        millisecond = dt.getMilliseconds();
      } else {
        const tz = convertTimezone(timeZone);
        if (tz !== false && tz !== 0) {
          dt.setTime(dt.getTime() + tz * 6e4);
        }
        year = dt.getUTCFullYear();
        month = dt.getUTCMonth() + 1;
        day = dt.getUTCDate();
        hour = dt.getUTCHours();
        minute = dt.getUTCMinutes();
        second = dt.getUTCSeconds();
        millisecond = dt.getUTCMilliseconds();
      }
      return zeroPad(year, 4) + "-" + zeroPad(month, 2) + "-" + zeroPad(day, 2) + " " + zeroPad(hour, 2) + ":" + zeroPad(minute, 2) + ":" + zeroPad(second, 2) + "." + zeroPad(millisecond, 3);
    }
    function zeroPad(number, length) {
      number = number.toString();
      while (number.length < length) {
        number = "0" + number;
      }
      return number;
    }
    function convertTimezone(tz) {
      if (tz === "Z") {
        return 0;
      }
      const m = tz.match(/([+\-\s])(\d\d):?(\d\d)?/);
      if (m) {
        return (m[1] == "-" ? -1 : 1) * (parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) : 0) / 60) * 60;
      }
      return false;
    }
    module2.exports = {
      arrayToList,
      bufferToString,
      dateToString,
      escapeString,
      charsRegex,
      charsMap,
      escapeObject,
      makeEscape
    };
  }
});

// node_modules/lodash/_listCacheClear.js
var require_listCacheClear = __commonJS({
  "node_modules/lodash/_listCacheClear.js"(exports2, module2) {
    "use strict";
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    module2.exports = listCacheClear;
  }
});

// node_modules/lodash/eq.js
var require_eq = __commonJS({
  "node_modules/lodash/eq.js"(exports2, module2) {
    "use strict";
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    module2.exports = eq;
  }
});

// node_modules/lodash/_assocIndexOf.js
var require_assocIndexOf = __commonJS({
  "node_modules/lodash/_assocIndexOf.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    module2.exports = assocIndexOf;
  }
});

// node_modules/lodash/_listCacheDelete.js
var require_listCacheDelete = __commonJS({
  "node_modules/lodash/_listCacheDelete.js"(exports2, module2) {
    "use strict";
    var assocIndexOf = require_assocIndexOf();
    var arrayProto = Array.prototype;
    var splice = arrayProto.splice;
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    module2.exports = listCacheDelete;
  }
});

// node_modules/lodash/_listCacheGet.js
var require_listCacheGet = __commonJS({
  "node_modules/lodash/_listCacheGet.js"(exports2, module2) {
    "use strict";
    var assocIndexOf = require_assocIndexOf();
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    module2.exports = listCacheGet;
  }
});

// node_modules/lodash/_listCacheHas.js
var require_listCacheHas = __commonJS({
  "node_modules/lodash/_listCacheHas.js"(exports2, module2) {
    "use strict";
    var assocIndexOf = require_assocIndexOf();
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    module2.exports = listCacheHas;
  }
});

// node_modules/lodash/_listCacheSet.js
var require_listCacheSet = __commonJS({
  "node_modules/lodash/_listCacheSet.js"(exports2, module2) {
    "use strict";
    var assocIndexOf = require_assocIndexOf();
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    module2.exports = listCacheSet;
  }
});

// node_modules/lodash/_ListCache.js
var require_ListCache = __commonJS({
  "node_modules/lodash/_ListCache.js"(exports2, module2) {
    "use strict";
    var listCacheClear = require_listCacheClear();
    var listCacheDelete = require_listCacheDelete();
    var listCacheGet = require_listCacheGet();
    var listCacheHas = require_listCacheHas();
    var listCacheSet = require_listCacheSet();
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    module2.exports = ListCache;
  }
});

// node_modules/lodash/_stackClear.js
var require_stackClear = __commonJS({
  "node_modules/lodash/_stackClear.js"(exports2, module2) {
    "use strict";
    var ListCache = require_ListCache();
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    module2.exports = stackClear;
  }
});

// node_modules/lodash/_stackDelete.js
var require_stackDelete = __commonJS({
  "node_modules/lodash/_stackDelete.js"(exports2, module2) {
    "use strict";
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    module2.exports = stackDelete;
  }
});

// node_modules/lodash/_stackGet.js
var require_stackGet = __commonJS({
  "node_modules/lodash/_stackGet.js"(exports2, module2) {
    "use strict";
    function stackGet(key) {
      return this.__data__.get(key);
    }
    module2.exports = stackGet;
  }
});

// node_modules/lodash/_stackHas.js
var require_stackHas = __commonJS({
  "node_modules/lodash/_stackHas.js"(exports2, module2) {
    "use strict";
    function stackHas(key) {
      return this.__data__.has(key);
    }
    module2.exports = stackHas;
  }
});

// node_modules/lodash/_freeGlobal.js
var require_freeGlobal = __commonJS({
  "node_modules/lodash/_freeGlobal.js"(exports2, module2) {
    "use strict";
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    module2.exports = freeGlobal;
  }
});

// node_modules/lodash/_root.js
var require_root = __commonJS({
  "node_modules/lodash/_root.js"(exports2, module2) {
    "use strict";
    var freeGlobal = require_freeGlobal();
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    module2.exports = root;
  }
});

// node_modules/lodash/_Symbol.js
var require_Symbol = __commonJS({
  "node_modules/lodash/_Symbol.js"(exports2, module2) {
    "use strict";
    var root = require_root();
    var Symbol2 = root.Symbol;
    module2.exports = Symbol2;
  }
});

// node_modules/lodash/_getRawTag.js
var require_getRawTag = __commonJS({
  "node_modules/lodash/_getRawTag.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    module2.exports = getRawTag;
  }
});

// node_modules/lodash/_objectToString.js
var require_objectToString = __commonJS({
  "node_modules/lodash/_objectToString.js"(exports2, module2) {
    "use strict";
    var objectProto = Object.prototype;
    var nativeObjectToString = objectProto.toString;
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    module2.exports = objectToString;
  }
});

// node_modules/lodash/_baseGetTag.js
var require_baseGetTag = __commonJS({
  "node_modules/lodash/_baseGetTag.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var getRawTag = require_getRawTag();
    var objectToString = require_objectToString();
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    module2.exports = baseGetTag;
  }
});

// node_modules/lodash/isObject.js
var require_isObject = __commonJS({
  "node_modules/lodash/isObject.js"(exports2, module2) {
    "use strict";
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module2.exports = isObject;
  }
});

// node_modules/lodash/isFunction.js
var require_isFunction = __commonJS({
  "node_modules/lodash/isFunction.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isObject = require_isObject();
    var asyncTag = "[object AsyncFunction]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var proxyTag = "[object Proxy]";
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    module2.exports = isFunction;
  }
});

// node_modules/lodash/_coreJsData.js
var require_coreJsData = __commonJS({
  "node_modules/lodash/_coreJsData.js"(exports2, module2) {
    "use strict";
    var root = require_root();
    var coreJsData = root["__core-js_shared__"];
    module2.exports = coreJsData;
  }
});

// node_modules/lodash/_isMasked.js
var require_isMasked = __commonJS({
  "node_modules/lodash/_isMasked.js"(exports2, module2) {
    "use strict";
    var coreJsData = require_coreJsData();
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    module2.exports = isMasked;
  }
});

// node_modules/lodash/_toSource.js
var require_toSource = __commonJS({
  "node_modules/lodash/_toSource.js"(exports2, module2) {
    "use strict";
    var funcProto = Function.prototype;
    var funcToString = funcProto.toString;
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    module2.exports = toSource;
  }
});

// node_modules/lodash/_baseIsNative.js
var require_baseIsNative = __commonJS({
  "node_modules/lodash/_baseIsNative.js"(exports2, module2) {
    "use strict";
    var isFunction = require_isFunction();
    var isMasked = require_isMasked();
    var isObject = require_isObject();
    var toSource = require_toSource();
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    module2.exports = baseIsNative;
  }
});

// node_modules/lodash/_getValue.js
var require_getValue = __commonJS({
  "node_modules/lodash/_getValue.js"(exports2, module2) {
    "use strict";
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    module2.exports = getValue;
  }
});

// node_modules/lodash/_getNative.js
var require_getNative = __commonJS({
  "node_modules/lodash/_getNative.js"(exports2, module2) {
    "use strict";
    var baseIsNative = require_baseIsNative();
    var getValue = require_getValue();
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    module2.exports = getNative;
  }
});

// node_modules/lodash/_Map.js
var require_Map = __commonJS({
  "node_modules/lodash/_Map.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var Map2 = getNative(root, "Map");
    module2.exports = Map2;
  }
});

// node_modules/lodash/_nativeCreate.js
var require_nativeCreate = __commonJS({
  "node_modules/lodash/_nativeCreate.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var nativeCreate = getNative(Object, "create");
    module2.exports = nativeCreate;
  }
});

// node_modules/lodash/_hashClear.js
var require_hashClear = __commonJS({
  "node_modules/lodash/_hashClear.js"(exports2, module2) {
    "use strict";
    var nativeCreate = require_nativeCreate();
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    module2.exports = hashClear;
  }
});

// node_modules/lodash/_hashDelete.js
var require_hashDelete = __commonJS({
  "node_modules/lodash/_hashDelete.js"(exports2, module2) {
    "use strict";
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    module2.exports = hashDelete;
  }
});

// node_modules/lodash/_hashGet.js
var require_hashGet = __commonJS({
  "node_modules/lodash/_hashGet.js"(exports2, module2) {
    "use strict";
    var nativeCreate = require_nativeCreate();
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    module2.exports = hashGet;
  }
});

// node_modules/lodash/_hashHas.js
var require_hashHas = __commonJS({
  "node_modules/lodash/_hashHas.js"(exports2, module2) {
    "use strict";
    var nativeCreate = require_nativeCreate();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    module2.exports = hashHas;
  }
});

// node_modules/lodash/_hashSet.js
var require_hashSet = __commonJS({
  "node_modules/lodash/_hashSet.js"(exports2, module2) {
    "use strict";
    var nativeCreate = require_nativeCreate();
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    module2.exports = hashSet;
  }
});

// node_modules/lodash/_Hash.js
var require_Hash = __commonJS({
  "node_modules/lodash/_Hash.js"(exports2, module2) {
    "use strict";
    var hashClear = require_hashClear();
    var hashDelete = require_hashDelete();
    var hashGet = require_hashGet();
    var hashHas = require_hashHas();
    var hashSet = require_hashSet();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    module2.exports = Hash;
  }
});

// node_modules/lodash/_mapCacheClear.js
var require_mapCacheClear = __commonJS({
  "node_modules/lodash/_mapCacheClear.js"(exports2, module2) {
    "use strict";
    var Hash = require_Hash();
    var ListCache = require_ListCache();
    var Map2 = require_Map();
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    module2.exports = mapCacheClear;
  }
});

// node_modules/lodash/_isKeyable.js
var require_isKeyable = __commonJS({
  "node_modules/lodash/_isKeyable.js"(exports2, module2) {
    "use strict";
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    module2.exports = isKeyable;
  }
});

// node_modules/lodash/_getMapData.js
var require_getMapData = __commonJS({
  "node_modules/lodash/_getMapData.js"(exports2, module2) {
    "use strict";
    var isKeyable = require_isKeyable();
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    module2.exports = getMapData;
  }
});

// node_modules/lodash/_mapCacheDelete.js
var require_mapCacheDelete = __commonJS({
  "node_modules/lodash/_mapCacheDelete.js"(exports2, module2) {
    "use strict";
    var getMapData = require_getMapData();
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    module2.exports = mapCacheDelete;
  }
});

// node_modules/lodash/_mapCacheGet.js
var require_mapCacheGet = __commonJS({
  "node_modules/lodash/_mapCacheGet.js"(exports2, module2) {
    "use strict";
    var getMapData = require_getMapData();
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    module2.exports = mapCacheGet;
  }
});

// node_modules/lodash/_mapCacheHas.js
var require_mapCacheHas = __commonJS({
  "node_modules/lodash/_mapCacheHas.js"(exports2, module2) {
    "use strict";
    var getMapData = require_getMapData();
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    module2.exports = mapCacheHas;
  }
});

// node_modules/lodash/_mapCacheSet.js
var require_mapCacheSet = __commonJS({
  "node_modules/lodash/_mapCacheSet.js"(exports2, module2) {
    "use strict";
    var getMapData = require_getMapData();
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    module2.exports = mapCacheSet;
  }
});

// node_modules/lodash/_MapCache.js
var require_MapCache = __commonJS({
  "node_modules/lodash/_MapCache.js"(exports2, module2) {
    "use strict";
    var mapCacheClear = require_mapCacheClear();
    var mapCacheDelete = require_mapCacheDelete();
    var mapCacheGet = require_mapCacheGet();
    var mapCacheHas = require_mapCacheHas();
    var mapCacheSet = require_mapCacheSet();
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    module2.exports = MapCache;
  }
});

// node_modules/lodash/_stackSet.js
var require_stackSet = __commonJS({
  "node_modules/lodash/_stackSet.js"(exports2, module2) {
    "use strict";
    var ListCache = require_ListCache();
    var Map2 = require_Map();
    var MapCache = require_MapCache();
    var LARGE_ARRAY_SIZE = 200;
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    module2.exports = stackSet;
  }
});

// node_modules/lodash/_Stack.js
var require_Stack = __commonJS({
  "node_modules/lodash/_Stack.js"(exports2, module2) {
    "use strict";
    var ListCache = require_ListCache();
    var stackClear = require_stackClear();
    var stackDelete = require_stackDelete();
    var stackGet = require_stackGet();
    var stackHas = require_stackHas();
    var stackSet = require_stackSet();
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    module2.exports = Stack;
  }
});

// node_modules/lodash/_arrayEach.js
var require_arrayEach = __commonJS({
  "node_modules/lodash/_arrayEach.js"(exports2, module2) {
    "use strict";
    function arrayEach(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    module2.exports = arrayEach;
  }
});

// node_modules/lodash/_defineProperty.js
var require_defineProperty = __commonJS({
  "node_modules/lodash/_defineProperty.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e) {
      }
    }();
    module2.exports = defineProperty;
  }
});

// node_modules/lodash/_baseAssignValue.js
var require_baseAssignValue = __commonJS({
  "node_modules/lodash/_baseAssignValue.js"(exports2, module2) {
    "use strict";
    var defineProperty = require_defineProperty();
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    module2.exports = baseAssignValue;
  }
});

// node_modules/lodash/_assignValue.js
var require_assignValue = __commonJS({
  "node_modules/lodash/_assignValue.js"(exports2, module2) {
    "use strict";
    var baseAssignValue = require_baseAssignValue();
    var eq = require_eq();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    module2.exports = assignValue;
  }
});

// node_modules/lodash/_copyObject.js
var require_copyObject = __commonJS({
  "node_modules/lodash/_copyObject.js"(exports2, module2) {
    "use strict";
    var assignValue = require_assignValue();
    var baseAssignValue = require_baseAssignValue();
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    module2.exports = copyObject;
  }
});

// node_modules/lodash/_baseTimes.js
var require_baseTimes = __commonJS({
  "node_modules/lodash/_baseTimes.js"(exports2, module2) {
    "use strict";
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    module2.exports = baseTimes;
  }
});

// node_modules/lodash/isObjectLike.js
var require_isObjectLike = __commonJS({
  "node_modules/lodash/isObjectLike.js"(exports2, module2) {
    "use strict";
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    module2.exports = isObjectLike;
  }
});

// node_modules/lodash/_baseIsArguments.js
var require_baseIsArguments = __commonJS({
  "node_modules/lodash/_baseIsArguments.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    module2.exports = baseIsArguments;
  }
});

// node_modules/lodash/isArguments.js
var require_isArguments = __commonJS({
  "node_modules/lodash/isArguments.js"(exports2, module2) {
    "use strict";
    var baseIsArguments = require_baseIsArguments();
    var isObjectLike = require_isObjectLike();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    module2.exports = isArguments;
  }
});

// node_modules/lodash/isArray.js
var require_isArray = __commonJS({
  "node_modules/lodash/isArray.js"(exports2, module2) {
    "use strict";
    var isArray = Array.isArray;
    module2.exports = isArray;
  }
});

// node_modules/lodash/stubFalse.js
var require_stubFalse = __commonJS({
  "node_modules/lodash/stubFalse.js"(exports2, module2) {
    "use strict";
    function stubFalse() {
      return false;
    }
    module2.exports = stubFalse;
  }
});

// node_modules/lodash/isBuffer.js
var require_isBuffer = __commonJS({
  "node_modules/lodash/isBuffer.js"(exports2, module2) {
    "use strict";
    var root = require_root();
    var stubFalse = require_stubFalse();
    var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var isBuffer = nativeIsBuffer || stubFalse;
    module2.exports = isBuffer;
  }
});

// node_modules/lodash/_isIndex.js
var require_isIndex = __commonJS({
  "node_modules/lodash/_isIndex.js"(exports2, module2) {
    "use strict";
    var MAX_SAFE_INTEGER = 9007199254740991;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    module2.exports = isIndex;
  }
});

// node_modules/lodash/isLength.js
var require_isLength = __commonJS({
  "node_modules/lodash/isLength.js"(exports2, module2) {
    "use strict";
    var MAX_SAFE_INTEGER = 9007199254740991;
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    module2.exports = isLength;
  }
});

// node_modules/lodash/_baseIsTypedArray.js
var require_baseIsTypedArray = __commonJS({
  "node_modules/lodash/_baseIsTypedArray.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isLength = require_isLength();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    module2.exports = baseIsTypedArray;
  }
});

// node_modules/lodash/_baseUnary.js
var require_baseUnary = __commonJS({
  "node_modules/lodash/_baseUnary.js"(exports2, module2) {
    "use strict";
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    module2.exports = baseUnary;
  }
});

// node_modules/lodash/_nodeUtil.js
var require_nodeUtil = __commonJS({
  "node_modules/lodash/_nodeUtil.js"(exports2, module2) {
    "use strict";
    var freeGlobal = require_freeGlobal();
    var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    module2.exports = nodeUtil;
  }
});

// node_modules/lodash/isTypedArray.js
var require_isTypedArray = __commonJS({
  "node_modules/lodash/isTypedArray.js"(exports2, module2) {
    "use strict";
    var baseIsTypedArray = require_baseIsTypedArray();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    module2.exports = isTypedArray;
  }
});

// node_modules/lodash/_arrayLikeKeys.js
var require_arrayLikeKeys = __commonJS({
  "node_modules/lodash/_arrayLikeKeys.js"(exports2, module2) {
    "use strict";
    var baseTimes = require_baseTimes();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isIndex = require_isIndex();
    var isTypedArray = require_isTypedArray();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    module2.exports = arrayLikeKeys;
  }
});

// node_modules/lodash/_isPrototype.js
var require_isPrototype = __commonJS({
  "node_modules/lodash/_isPrototype.js"(exports2, module2) {
    "use strict";
    var objectProto = Object.prototype;
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    module2.exports = isPrototype;
  }
});

// node_modules/lodash/_overArg.js
var require_overArg = __commonJS({
  "node_modules/lodash/_overArg.js"(exports2, module2) {
    "use strict";
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    module2.exports = overArg;
  }
});

// node_modules/lodash/_nativeKeys.js
var require_nativeKeys = __commonJS({
  "node_modules/lodash/_nativeKeys.js"(exports2, module2) {
    "use strict";
    var overArg = require_overArg();
    var nativeKeys = overArg(Object.keys, Object);
    module2.exports = nativeKeys;
  }
});

// node_modules/lodash/_baseKeys.js
var require_baseKeys = __commonJS({
  "node_modules/lodash/_baseKeys.js"(exports2, module2) {
    "use strict";
    var isPrototype = require_isPrototype();
    var nativeKeys = require_nativeKeys();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    module2.exports = baseKeys;
  }
});

// node_modules/lodash/isArrayLike.js
var require_isArrayLike = __commonJS({
  "node_modules/lodash/isArrayLike.js"(exports2, module2) {
    "use strict";
    var isFunction = require_isFunction();
    var isLength = require_isLength();
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    module2.exports = isArrayLike;
  }
});

// node_modules/lodash/keys.js
var require_keys = __commonJS({
  "node_modules/lodash/keys.js"(exports2, module2) {
    "use strict";
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeys = require_baseKeys();
    var isArrayLike = require_isArrayLike();
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    module2.exports = keys;
  }
});

// node_modules/lodash/_baseAssign.js
var require_baseAssign = __commonJS({
  "node_modules/lodash/_baseAssign.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var keys = require_keys();
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    module2.exports = baseAssign;
  }
});

// node_modules/lodash/_nativeKeysIn.js
var require_nativeKeysIn = __commonJS({
  "node_modules/lodash/_nativeKeysIn.js"(exports2, module2) {
    "use strict";
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    module2.exports = nativeKeysIn;
  }
});

// node_modules/lodash/_baseKeysIn.js
var require_baseKeysIn = __commonJS({
  "node_modules/lodash/_baseKeysIn.js"(exports2, module2) {
    "use strict";
    var isObject = require_isObject();
    var isPrototype = require_isPrototype();
    var nativeKeysIn = require_nativeKeysIn();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    module2.exports = baseKeysIn;
  }
});

// node_modules/lodash/keysIn.js
var require_keysIn = __commonJS({
  "node_modules/lodash/keysIn.js"(exports2, module2) {
    "use strict";
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeysIn = require_baseKeysIn();
    var isArrayLike = require_isArrayLike();
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    module2.exports = keysIn;
  }
});

// node_modules/lodash/_baseAssignIn.js
var require_baseAssignIn = __commonJS({
  "node_modules/lodash/_baseAssignIn.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var keysIn = require_keysIn();
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }
    module2.exports = baseAssignIn;
  }
});

// node_modules/lodash/_cloneBuffer.js
var require_cloneBuffer = __commonJS({
  "node_modules/lodash/_cloneBuffer.js"(exports2, module2) {
    "use strict";
    var root = require_root();
    var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    module2.exports = cloneBuffer;
  }
});

// node_modules/lodash/_copyArray.js
var require_copyArray = __commonJS({
  "node_modules/lodash/_copyArray.js"(exports2, module2) {
    "use strict";
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    module2.exports = copyArray;
  }
});

// node_modules/lodash/_arrayFilter.js
var require_arrayFilter = __commonJS({
  "node_modules/lodash/_arrayFilter.js"(exports2, module2) {
    "use strict";
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    module2.exports = arrayFilter;
  }
});

// node_modules/lodash/stubArray.js
var require_stubArray = __commonJS({
  "node_modules/lodash/stubArray.js"(exports2, module2) {
    "use strict";
    function stubArray() {
      return [];
    }
    module2.exports = stubArray;
  }
});

// node_modules/lodash/_getSymbols.js
var require_getSymbols = __commonJS({
  "node_modules/lodash/_getSymbols.js"(exports2, module2) {
    "use strict";
    var arrayFilter = require_arrayFilter();
    var stubArray = require_stubArray();
    var objectProto = Object.prototype;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    module2.exports = getSymbols;
  }
});

// node_modules/lodash/_copySymbols.js
var require_copySymbols = __commonJS({
  "node_modules/lodash/_copySymbols.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var getSymbols = require_getSymbols();
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    module2.exports = copySymbols;
  }
});

// node_modules/lodash/_arrayPush.js
var require_arrayPush = __commonJS({
  "node_modules/lodash/_arrayPush.js"(exports2, module2) {
    "use strict";
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    module2.exports = arrayPush;
  }
});

// node_modules/lodash/_getPrototype.js
var require_getPrototype = __commonJS({
  "node_modules/lodash/_getPrototype.js"(exports2, module2) {
    "use strict";
    var overArg = require_overArg();
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    module2.exports = getPrototype;
  }
});

// node_modules/lodash/_getSymbolsIn.js
var require_getSymbolsIn = __commonJS({
  "node_modules/lodash/_getSymbolsIn.js"(exports2, module2) {
    "use strict";
    var arrayPush = require_arrayPush();
    var getPrototype = require_getPrototype();
    var getSymbols = require_getSymbols();
    var stubArray = require_stubArray();
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };
    module2.exports = getSymbolsIn;
  }
});

// node_modules/lodash/_copySymbolsIn.js
var require_copySymbolsIn = __commonJS({
  "node_modules/lodash/_copySymbolsIn.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var getSymbolsIn = require_getSymbolsIn();
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }
    module2.exports = copySymbolsIn;
  }
});

// node_modules/lodash/_baseGetAllKeys.js
var require_baseGetAllKeys = __commonJS({
  "node_modules/lodash/_baseGetAllKeys.js"(exports2, module2) {
    "use strict";
    var arrayPush = require_arrayPush();
    var isArray = require_isArray();
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    module2.exports = baseGetAllKeys;
  }
});

// node_modules/lodash/_getAllKeys.js
var require_getAllKeys = __commonJS({
  "node_modules/lodash/_getAllKeys.js"(exports2, module2) {
    "use strict";
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbols = require_getSymbols();
    var keys = require_keys();
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    module2.exports = getAllKeys;
  }
});

// node_modules/lodash/_getAllKeysIn.js
var require_getAllKeysIn = __commonJS({
  "node_modules/lodash/_getAllKeysIn.js"(exports2, module2) {
    "use strict";
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbolsIn = require_getSymbolsIn();
    var keysIn = require_keysIn();
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }
    module2.exports = getAllKeysIn;
  }
});

// node_modules/lodash/_DataView.js
var require_DataView = __commonJS({
  "node_modules/lodash/_DataView.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var DataView = getNative(root, "DataView");
    module2.exports = DataView;
  }
});

// node_modules/lodash/_Promise.js
var require_Promise = __commonJS({
  "node_modules/lodash/_Promise.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var Promise2 = getNative(root, "Promise");
    module2.exports = Promise2;
  }
});

// node_modules/lodash/_Set.js
var require_Set = __commonJS({
  "node_modules/lodash/_Set.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var Set2 = getNative(root, "Set");
    module2.exports = Set2;
  }
});

// node_modules/lodash/_WeakMap.js
var require_WeakMap = __commonJS({
  "node_modules/lodash/_WeakMap.js"(exports2, module2) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var WeakMap = getNative(root, "WeakMap");
    module2.exports = WeakMap;
  }
});

// node_modules/lodash/_getTag.js
var require_getTag = __commonJS({
  "node_modules/lodash/_getTag.js"(exports2, module2) {
    "use strict";
    var DataView = require_DataView();
    var Map2 = require_Map();
    var Promise2 = require_Promise();
    var Set2 = require_Set();
    var WeakMap = require_WeakMap();
    var baseGetTag = require_baseGetTag();
    var toSource = require_toSource();
    var mapTag = "[object Map]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var setTag = "[object Set]";
    var weakMapTag = "[object WeakMap]";
    var dataViewTag = "[object DataView]";
    var dataViewCtorString = toSource(DataView);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap);
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    module2.exports = getTag;
  }
});

// node_modules/lodash/_initCloneArray.js
var require_initCloneArray = __commonJS({
  "node_modules/lodash/_initCloneArray.js"(exports2, module2) {
    "use strict";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function initCloneArray(array) {
      var length = array.length, result = new array.constructor(length);
      if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }
    module2.exports = initCloneArray;
  }
});

// node_modules/lodash/_Uint8Array.js
var require_Uint8Array = __commonJS({
  "node_modules/lodash/_Uint8Array.js"(exports2, module2) {
    "use strict";
    var root = require_root();
    var Uint8Array2 = root.Uint8Array;
    module2.exports = Uint8Array2;
  }
});

// node_modules/lodash/_cloneArrayBuffer.js
var require_cloneArrayBuffer = __commonJS({
  "node_modules/lodash/_cloneArrayBuffer.js"(exports2, module2) {
    "use strict";
    var Uint8Array2 = require_Uint8Array();
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    module2.exports = cloneArrayBuffer;
  }
});

// node_modules/lodash/_cloneDataView.js
var require_cloneDataView = __commonJS({
  "node_modules/lodash/_cloneDataView.js"(exports2, module2) {
    "use strict";
    var cloneArrayBuffer = require_cloneArrayBuffer();
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    module2.exports = cloneDataView;
  }
});

// node_modules/lodash/_cloneRegExp.js
var require_cloneRegExp = __commonJS({
  "node_modules/lodash/_cloneRegExp.js"(exports2, module2) {
    "use strict";
    var reFlags = /\w*$/;
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    module2.exports = cloneRegExp;
  }
});

// node_modules/lodash/_cloneSymbol.js
var require_cloneSymbol = __commonJS({
  "node_modules/lodash/_cloneSymbol.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    module2.exports = cloneSymbol;
  }
});

// node_modules/lodash/_cloneTypedArray.js
var require_cloneTypedArray = __commonJS({
  "node_modules/lodash/_cloneTypedArray.js"(exports2, module2) {
    "use strict";
    var cloneArrayBuffer = require_cloneArrayBuffer();
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    module2.exports = cloneTypedArray;
  }
});

// node_modules/lodash/_initCloneByTag.js
var require_initCloneByTag = __commonJS({
  "node_modules/lodash/_initCloneByTag.js"(exports2, module2) {
    "use strict";
    var cloneArrayBuffer = require_cloneArrayBuffer();
    var cloneDataView = require_cloneDataView();
    var cloneRegExp = require_cloneRegExp();
    var cloneSymbol = require_cloneSymbol();
    var cloneTypedArray = require_cloneTypedArray();
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
          return new Ctor(+object);
        case dataViewTag:
          return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);
        case mapTag:
          return new Ctor();
        case numberTag:
        case stringTag:
          return new Ctor(object);
        case regexpTag:
          return cloneRegExp(object);
        case setTag:
          return new Ctor();
        case symbolTag:
          return cloneSymbol(object);
      }
    }
    module2.exports = initCloneByTag;
  }
});

// node_modules/lodash/_baseCreate.js
var require_baseCreate = __commonJS({
  "node_modules/lodash/_baseCreate.js"(exports2, module2) {
    "use strict";
    var isObject = require_isObject();
    var objectCreate = Object.create;
    var baseCreate = /* @__PURE__ */ function() {
      function object() {
      }
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    module2.exports = baseCreate;
  }
});

// node_modules/lodash/_initCloneObject.js
var require_initCloneObject = __commonJS({
  "node_modules/lodash/_initCloneObject.js"(exports2, module2) {
    "use strict";
    var baseCreate = require_baseCreate();
    var getPrototype = require_getPrototype();
    var isPrototype = require_isPrototype();
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    module2.exports = initCloneObject;
  }
});

// node_modules/lodash/_baseIsMap.js
var require_baseIsMap = __commonJS({
  "node_modules/lodash/_baseIsMap.js"(exports2, module2) {
    "use strict";
    var getTag = require_getTag();
    var isObjectLike = require_isObjectLike();
    var mapTag = "[object Map]";
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }
    module2.exports = baseIsMap;
  }
});

// node_modules/lodash/isMap.js
var require_isMap = __commonJS({
  "node_modules/lodash/isMap.js"(exports2, module2) {
    "use strict";
    var baseIsMap = require_baseIsMap();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsMap = nodeUtil && nodeUtil.isMap;
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
    module2.exports = isMap;
  }
});

// node_modules/lodash/_baseIsSet.js
var require_baseIsSet = __commonJS({
  "node_modules/lodash/_baseIsSet.js"(exports2, module2) {
    "use strict";
    var getTag = require_getTag();
    var isObjectLike = require_isObjectLike();
    var setTag = "[object Set]";
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }
    module2.exports = baseIsSet;
  }
});

// node_modules/lodash/isSet.js
var require_isSet = __commonJS({
  "node_modules/lodash/isSet.js"(exports2, module2) {
    "use strict";
    var baseIsSet = require_baseIsSet();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsSet = nodeUtil && nodeUtil.isSet;
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
    module2.exports = isSet;
  }
});

// node_modules/lodash/_baseClone.js
var require_baseClone = __commonJS({
  "node_modules/lodash/_baseClone.js"(exports2, module2) {
    "use strict";
    var Stack = require_Stack();
    var arrayEach = require_arrayEach();
    var assignValue = require_assignValue();
    var baseAssign = require_baseAssign();
    var baseAssignIn = require_baseAssignIn();
    var cloneBuffer = require_cloneBuffer();
    var copyArray = require_copyArray();
    var copySymbols = require_copySymbols();
    var copySymbolsIn = require_copySymbolsIn();
    var getAllKeys = require_getAllKeys();
    var getAllKeysIn = require_getAllKeysIn();
    var getTag = require_getTag();
    var initCloneArray = require_initCloneArray();
    var initCloneByTag = require_initCloneByTag();
    var initCloneObject = require_initCloneObject();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isMap = require_isMap();
    var isObject = require_isObject();
    var isSet = require_isSet();
    var keys = require_keys();
    var keysIn = require_keysIn();
    var CLONE_DEEP_FLAG = 1;
    var CLONE_FLAT_FLAG = 2;
    var CLONE_SYMBOLS_FLAG = 4;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== void 0) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          result = isFlat || isFunc ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      stack || (stack = new Stack());
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);
      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key2) {
          result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
      }
      var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
      var props = isArr ? void 0 : keysFunc(value);
      arrayEach(props || value, function(subValue, key2) {
        if (props) {
          key2 = subValue;
          subValue = value[key2];
        }
        assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
      return result;
    }
    module2.exports = baseClone;
  }
});

// node_modules/lodash/cloneDeep.js
var require_cloneDeep = __commonJS({
  "node_modules/lodash/cloneDeep.js"(exports2, module2) {
    "use strict";
    var baseClone = require_baseClone();
    var CLONE_DEEP_FLAG = 1;
    var CLONE_SYMBOLS_FLAG = 4;
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }
    module2.exports = cloneDeep;
  }
});

// node_modules/lodash/identity.js
var require_identity = __commonJS({
  "node_modules/lodash/identity.js"(exports2, module2) {
    "use strict";
    function identity(value) {
      return value;
    }
    module2.exports = identity;
  }
});

// node_modules/lodash/_apply.js
var require_apply = __commonJS({
  "node_modules/lodash/_apply.js"(exports2, module2) {
    "use strict";
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    module2.exports = apply;
  }
});

// node_modules/lodash/_overRest.js
var require_overRest = __commonJS({
  "node_modules/lodash/_overRest.js"(exports2, module2) {
    "use strict";
    var apply = require_apply();
    var nativeMax = Math.max;
    function overRest(func, start, transform) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    module2.exports = overRest;
  }
});

// node_modules/lodash/constant.js
var require_constant = __commonJS({
  "node_modules/lodash/constant.js"(exports2, module2) {
    "use strict";
    function constant(value) {
      return function() {
        return value;
      };
    }
    module2.exports = constant;
  }
});

// node_modules/lodash/_baseSetToString.js
var require_baseSetToString = __commonJS({
  "node_modules/lodash/_baseSetToString.js"(exports2, module2) {
    "use strict";
    var constant = require_constant();
    var defineProperty = require_defineProperty();
    var identity = require_identity();
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    module2.exports = baseSetToString;
  }
});

// node_modules/lodash/_shortOut.js
var require_shortOut = __commonJS({
  "node_modules/lodash/_shortOut.js"(exports2, module2) {
    "use strict";
    var HOT_COUNT = 800;
    var HOT_SPAN = 16;
    var nativeNow = Date.now;
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    module2.exports = shortOut;
  }
});

// node_modules/lodash/_setToString.js
var require_setToString = __commonJS({
  "node_modules/lodash/_setToString.js"(exports2, module2) {
    "use strict";
    var baseSetToString = require_baseSetToString();
    var shortOut = require_shortOut();
    var setToString = shortOut(baseSetToString);
    module2.exports = setToString;
  }
});

// node_modules/lodash/_baseRest.js
var require_baseRest = __commonJS({
  "node_modules/lodash/_baseRest.js"(exports2, module2) {
    "use strict";
    var identity = require_identity();
    var overRest = require_overRest();
    var setToString = require_setToString();
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + "");
    }
    module2.exports = baseRest;
  }
});

// node_modules/lodash/_isIterateeCall.js
var require_isIterateeCall = __commonJS({
  "node_modules/lodash/_isIterateeCall.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var isArrayLike = require_isArrayLike();
    var isIndex = require_isIndex();
    var isObject = require_isObject();
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    module2.exports = isIterateeCall;
  }
});

// node_modules/lodash/defaults.js
var require_defaults = __commonJS({
  "node_modules/lodash/defaults.js"(exports2, module2) {
    "use strict";
    var baseRest = require_baseRest();
    var eq = require_eq();
    var isIterateeCall = require_isIterateeCall();
    var keysIn = require_keysIn();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var defaults = baseRest(function(object, sources) {
      object = Object(object);
      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }
      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;
        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];
          if (value === void 0 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
            object[key] = source[key];
          }
        }
      }
      return object;
    });
    module2.exports = defaults;
  }
});

// node_modules/lodash/_arrayMap.js
var require_arrayMap = __commonJS({
  "node_modules/lodash/_arrayMap.js"(exports2, module2) {
    "use strict";
    function arrayMap(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    module2.exports = arrayMap;
  }
});

// node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS({
  "node_modules/lodash/isSymbol.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var symbolTag = "[object Symbol]";
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }
    module2.exports = isSymbol;
  }
});

// node_modules/lodash/_baseToString.js
var require_baseToString = __commonJS({
  "node_modules/lodash/_baseToString.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var arrayMap = require_arrayMap();
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isArray(value)) {
        return arrayMap(value, baseToString) + "";
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module2.exports = baseToString;
  }
});

// node_modules/lodash/toString.js
var require_toString = __commonJS({
  "node_modules/lodash/toString.js"(exports2, module2) {
    "use strict";
    var baseToString = require_baseToString();
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    module2.exports = toString;
  }
});

// node_modules/lodash/uniqueId.js
var require_uniqueId = __commonJS({
  "node_modules/lodash/uniqueId.js"(exports2, module2) {
    "use strict";
    var toString = require_toString();
    var idCounter = 0;
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }
    module2.exports = uniqueId;
  }
});

// node_modules/knex/lib/util/timeout.js
var require_timeout = __commonJS({
  "node_modules/knex/lib/util/timeout.js"(exports2, module2) {
    "use strict";
    var KnexTimeoutError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "KnexTimeoutError";
      }
    };
    function timeout(promise, ms) {
      return new Promise(function(resolve, reject) {
        const id = setTimeout(function() {
          reject(new KnexTimeoutError("operation timed out"));
        }, ms);
        function wrappedResolve(value) {
          clearTimeout(id);
          resolve(value);
        }
        function wrappedReject(err) {
          clearTimeout(id);
          reject(err);
        }
        promise.then(wrappedResolve, wrappedReject);
      });
    }
    module2.exports.KnexTimeoutError = KnexTimeoutError;
    module2.exports.timeout = timeout;
  }
});

// node_modules/knex/lib/execution/internal/ensure-connection-callback.js
var require_ensure_connection_callback = __commonJS({
  "node_modules/knex/lib/execution/internal/ensure-connection-callback.js"(exports2, module2) {
    "use strict";
    function ensureConnectionCallback(runner) {
      runner.client.emit("start", runner.builder);
      runner.builder.emit("start", runner.builder);
      const sql = runner.builder.toSQL();
      if (runner.builder._debug) {
        runner.client.logger.debug(sql);
      }
      if (Array.isArray(sql)) {
        return runner.queryArray(sql);
      }
      return runner.query(sql);
    }
    function ensureConnectionStreamCallback(runner, params) {
      try {
        const sql = runner.builder.toSQL();
        if (Array.isArray(sql) && params.hasHandler) {
          throw new Error(
            "The stream may only be used with a single query statement."
          );
        }
        return runner.client.stream(
          runner.connection,
          sql,
          params.stream,
          params.options
        );
      } catch (e) {
        params.stream.emit("error", e);
        throw e;
      }
    }
    module2.exports = {
      ensureConnectionCallback,
      ensureConnectionStreamCallback
    };
  }
});

// node_modules/knex/lib/execution/runner.js
var require_runner = __commonJS({
  "node_modules/knex/lib/execution/runner.js"(exports2, module2) {
    "use strict";
    var { KnexTimeoutError } = require_timeout();
    var { timeout } = require_timeout();
    var {
      ensureConnectionCallback,
      ensureConnectionStreamCallback
    } = require_ensure_connection_callback();
    var Transform;
    var Runner = class _Runner {
      constructor(client, builder) {
        this.client = client;
        this.builder = builder;
        this.queries = [];
        this.connection = void 0;
      }
      // "Run" the target, calling "toSQL" on the builder, returning
      // an object or array of queries to run, each of which are run on
      // a single connection.
      async run() {
        const runner = this;
        try {
          const res = await this.ensureConnection(ensureConnectionCallback);
          runner.builder.emit("end");
          return res;
        } catch (err) {
          if (runner.builder._events && runner.builder._events.error) {
            runner.builder.emit("error", err);
          }
          throw err;
        }
      }
      // Stream the result set, by passing through to the dialect's streaming
      // capabilities. If the options are
      stream(optionsOrHandler, handlerOrNil) {
        const firstOptionIsHandler = typeof optionsOrHandler === "function" && arguments.length === 1;
        const options = firstOptionIsHandler ? {} : optionsOrHandler;
        const handler = firstOptionIsHandler ? optionsOrHandler : handlerOrNil;
        const hasHandler = typeof handler === "function";
        Transform = Transform || require("stream").Transform;
        const queryContext = this.builder.queryContext();
        const stream = new Transform({
          objectMode: true,
          transform: (chunk, _, callback) => {
            callback(null, this.client.postProcessResponse(chunk, queryContext));
          }
        });
        stream.on("close", () => {
          this.client.releaseConnection(this.connection);
        });
        stream.on("pipe", (sourceStream) => {
          const cleanSourceStream = () => {
            if (!sourceStream.closed) {
              sourceStream.destroy();
            }
          };
          if (stream.closed) {
            cleanSourceStream();
          } else {
            stream.on("close", cleanSourceStream);
          }
        });
        const connectionAcquirePromise = this.ensureConnection(
          ensureConnectionStreamCallback,
          {
            options,
            hasHandler,
            stream
          }
        ).catch((err) => {
          if (!this.connection) {
            stream.emit("error", err);
          }
        });
        if (hasHandler) {
          handler(stream);
          return connectionAcquirePromise;
        }
        return stream;
      }
      // Allow you to pipe the stream to a writable stream.
      pipe(writable, options) {
        return this.stream(options).pipe(writable);
      }
      // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
      // to run in sequence, and on the same connection, especially helpful when schema building
      // and dealing with foreign key constraints, etc.
      async query(obj) {
        const { __knexUid, __knexTxId } = this.connection;
        this.builder.emit("query", Object.assign({ __knexUid, __knexTxId }, obj));
        const runner = this;
        const queryContext = this.builder.queryContext();
        if (obj !== null && typeof obj === "object") {
          obj.queryContext = queryContext;
        }
        let queryPromise = this.client.query(this.connection, obj);
        if (obj.timeout) {
          queryPromise = timeout(queryPromise, obj.timeout);
        }
        return queryPromise.then((resp) => this.client.processResponse(resp, runner)).then((processedResponse) => {
          const postProcessedResponse = this.client.postProcessResponse(
            processedResponse,
            queryContext
          );
          this.builder.emit(
            "query-response",
            postProcessedResponse,
            Object.assign({ __knexUid, __knexTxId }, obj),
            this.builder
          );
          this.client.emit(
            "query-response",
            postProcessedResponse,
            Object.assign({ __knexUid, __knexTxId }, obj),
            this.builder
          );
          return postProcessedResponse;
        }).catch((error) => {
          if (!(error instanceof KnexTimeoutError)) {
            return Promise.reject(error);
          }
          const { timeout: timeout2, sql, bindings } = obj;
          let cancelQuery;
          if (obj.cancelOnTimeout) {
            cancelQuery = this.client.cancelQuery(this.connection);
          } else {
            this.connection.__knex__disposed = error;
            cancelQuery = Promise.resolve();
          }
          return cancelQuery.catch((cancelError) => {
            this.connection.__knex__disposed = error;
            throw Object.assign(cancelError, {
              message: `After query timeout of ${timeout2}ms exceeded, cancelling of query failed.`,
              sql,
              bindings,
              timeout: timeout2
            });
          }).then(() => {
            throw Object.assign(error, {
              message: `Defined query timeout of ${timeout2}ms exceeded when running query.`,
              sql,
              bindings,
              timeout: timeout2
            });
          });
        }).catch((error) => {
          this.builder.emit(
            "query-error",
            error,
            Object.assign({ __knexUid, __knexTxId, queryContext }, obj)
          );
          throw error;
        });
      }
      // In the case of the "schema builder" we call `queryArray`, which runs each
      // of the queries in sequence.
      async queryArray(queries) {
        if (queries.length === 1) {
          const query = queries[0];
          if (!query.statementsProducer) {
            return this.query(query);
          }
          const statements = await query.statementsProducer(
            void 0,
            this.connection
          );
          const sqlQueryObjects = statements.sql.map((statement) => ({
            sql: statement,
            bindings: query.bindings
          }));
          const preQueryObjects = statements.pre.map((statement) => ({
            sql: statement,
            bindings: query.bindings
          }));
          const postQueryObjects = statements.post.map((statement) => ({
            sql: statement,
            bindings: query.bindings
          }));
          let results2 = [];
          await this.queryArray(preQueryObjects);
          try {
            await this.client.transaction(
              async (trx) => {
                const transactionRunner = new _Runner(trx.client, this.builder);
                transactionRunner.connection = this.connection;
                results2 = await transactionRunner.queryArray(sqlQueryObjects);
                if (statements.check) {
                  const foreignViolations = await trx.raw(statements.check);
                  if (foreignViolations.length > 0) {
                    throw new Error("FOREIGN KEY constraint failed");
                  }
                }
              },
              { connection: this.connection }
            );
          } finally {
            await this.queryArray(postQueryObjects);
          }
          return results2;
        }
        const results = [];
        for (const query of queries) {
          results.push(await this.queryArray([query]));
        }
        return results;
      }
      // Check whether there's a transaction flag, and that it has a connection.
      async ensureConnection(cb, cbParams) {
        if (this.builder._connection) {
          this.connection = this.builder._connection;
        }
        if (this.connection) {
          return cb(this, cbParams);
        }
        let acquiredConnection;
        try {
          acquiredConnection = await this.client.acquireConnection();
        } catch (error) {
          if (!(error instanceof KnexTimeoutError)) {
            return Promise.reject(error);
          }
          if (this.builder) {
            error.sql = this.builder.sql;
            error.bindings = this.builder.bindings;
          }
          throw error;
        }
        try {
          this.connection = acquiredConnection;
          return await cb(this, cbParams);
        } finally {
          await this.client.releaseConnection(acquiredConnection);
        }
      }
    };
    module2.exports = Runner;
  }
});

// node_modules/knex/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/knex/node_modules/ms/index.js"(exports2, module2) {
    "use strict";
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/knex/node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/knex/node_modules/debug/src/common.js"(exports2, module2) {
    "use strict";
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/knex/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/knex/node_modules/debug/src/browser.js"(exports2, module2) {
    "use strict";
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env2.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env2) || env2.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/knex/node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/knex/node_modules/debug/src/node.js"(exports2, module2) {
    "use strict";
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/knex/node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/knex/node_modules/debug/src/index.js"(exports2, module2) {
    "use strict";
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/lodash/_setCacheAdd.js
var require_setCacheAdd = __commonJS({
  "node_modules/lodash/_setCacheAdd.js"(exports2, module2) {
    "use strict";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    module2.exports = setCacheAdd;
  }
});

// node_modules/lodash/_setCacheHas.js
var require_setCacheHas = __commonJS({
  "node_modules/lodash/_setCacheHas.js"(exports2, module2) {
    "use strict";
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    module2.exports = setCacheHas;
  }
});

// node_modules/lodash/_SetCache.js
var require_SetCache = __commonJS({
  "node_modules/lodash/_SetCache.js"(exports2, module2) {
    "use strict";
    var MapCache = require_MapCache();
    var setCacheAdd = require_setCacheAdd();
    var setCacheHas = require_setCacheHas();
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    module2.exports = SetCache;
  }
});

// node_modules/lodash/_baseFindIndex.js
var require_baseFindIndex = __commonJS({
  "node_modules/lodash/_baseFindIndex.js"(exports2, module2) {
    "use strict";
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    module2.exports = baseFindIndex;
  }
});

// node_modules/lodash/_baseIsNaN.js
var require_baseIsNaN = __commonJS({
  "node_modules/lodash/_baseIsNaN.js"(exports2, module2) {
    "use strict";
    function baseIsNaN(value) {
      return value !== value;
    }
    module2.exports = baseIsNaN;
  }
});

// node_modules/lodash/_strictIndexOf.js
var require_strictIndexOf = __commonJS({
  "node_modules/lodash/_strictIndexOf.js"(exports2, module2) {
    "use strict";
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    module2.exports = strictIndexOf;
  }
});

// node_modules/lodash/_baseIndexOf.js
var require_baseIndexOf = __commonJS({
  "node_modules/lodash/_baseIndexOf.js"(exports2, module2) {
    "use strict";
    var baseFindIndex = require_baseFindIndex();
    var baseIsNaN = require_baseIsNaN();
    var strictIndexOf = require_strictIndexOf();
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    module2.exports = baseIndexOf;
  }
});

// node_modules/lodash/_arrayIncludes.js
var require_arrayIncludes = __commonJS({
  "node_modules/lodash/_arrayIncludes.js"(exports2, module2) {
    "use strict";
    var baseIndexOf = require_baseIndexOf();
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    module2.exports = arrayIncludes;
  }
});

// node_modules/lodash/_arrayIncludesWith.js
var require_arrayIncludesWith = __commonJS({
  "node_modules/lodash/_arrayIncludesWith.js"(exports2, module2) {
    "use strict";
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    module2.exports = arrayIncludesWith;
  }
});

// node_modules/lodash/_cacheHas.js
var require_cacheHas = __commonJS({
  "node_modules/lodash/_cacheHas.js"(exports2, module2) {
    "use strict";
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    module2.exports = cacheHas;
  }
});

// node_modules/lodash/_baseDifference.js
var require_baseDifference = __commonJS({
  "node_modules/lodash/_baseDifference.js"(exports2, module2) {
    "use strict";
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var arrayMap = require_arrayMap();
    var baseUnary = require_baseUnary();
    var cacheHas = require_cacheHas();
    var LARGE_ARRAY_SIZE = 200;
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      } else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee == null ? value : iteratee(value);
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
      return result;
    }
    module2.exports = baseDifference;
  }
});

// node_modules/lodash/_isFlattenable.js
var require_isFlattenable = __commonJS({
  "node_modules/lodash/_isFlattenable.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    module2.exports = isFlattenable;
  }
});

// node_modules/lodash/_baseFlatten.js
var require_baseFlatten = __commonJS({
  "node_modules/lodash/_baseFlatten.js"(exports2, module2) {
    "use strict";
    var arrayPush = require_arrayPush();
    var isFlattenable = require_isFlattenable();
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    module2.exports = baseFlatten;
  }
});

// node_modules/lodash/isArrayLikeObject.js
var require_isArrayLikeObject = __commonJS({
  "node_modules/lodash/isArrayLikeObject.js"(exports2, module2) {
    "use strict";
    var isArrayLike = require_isArrayLike();
    var isObjectLike = require_isObjectLike();
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    module2.exports = isArrayLikeObject;
  }
});

// node_modules/lodash/last.js
var require_last = __commonJS({
  "node_modules/lodash/last.js"(exports2, module2) {
    "use strict";
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : void 0;
    }
    module2.exports = last;
  }
});

// node_modules/lodash/differenceWith.js
var require_differenceWith = __commonJS({
  "node_modules/lodash/differenceWith.js"(exports2, module2) {
    "use strict";
    var baseDifference = require_baseDifference();
    var baseFlatten = require_baseFlatten();
    var baseRest = require_baseRest();
    var isArrayLikeObject = require_isArrayLikeObject();
    var last = require_last();
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = void 0;
      }
      return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), void 0, comparator) : [];
    });
    module2.exports = differenceWith;
  }
});

// node_modules/lodash/_isKey.js
var require_isKey = __commonJS({
  "node_modules/lodash/_isKey.js"(exports2, module2) {
    "use strict";
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    module2.exports = isKey;
  }
});

// node_modules/lodash/memoize.js
var require_memoize = __commonJS({
  "node_modules/lodash/memoize.js"(exports2, module2) {
    "use strict";
    var MapCache = require_MapCache();
    var FUNC_ERROR_TEXT = "Expected a function";
    function memoize(func, resolver) {
      if (typeof func != "function" || resolver != null && typeof resolver != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    }
    memoize.Cache = MapCache;
    module2.exports = memoize;
  }
});

// node_modules/lodash/_memoizeCapped.js
var require_memoizeCapped = __commonJS({
  "node_modules/lodash/_memoizeCapped.js"(exports2, module2) {
    "use strict";
    var memoize = require_memoize();
    var MAX_MEMOIZE_SIZE = 500;
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });
      var cache = result.cache;
      return result;
    }
    module2.exports = memoizeCapped;
  }
});

// node_modules/lodash/_stringToPath.js
var require_stringToPath = __commonJS({
  "node_modules/lodash/_stringToPath.js"(exports2, module2) {
    "use strict";
    var memoizeCapped = require_memoizeCapped();
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46) {
        result.push("");
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
      });
      return result;
    });
    module2.exports = stringToPath;
  }
});

// node_modules/lodash/_castPath.js
var require_castPath = __commonJS({
  "node_modules/lodash/_castPath.js"(exports2, module2) {
    "use strict";
    var isArray = require_isArray();
    var isKey = require_isKey();
    var stringToPath = require_stringToPath();
    var toString = require_toString();
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }
    module2.exports = castPath;
  }
});

// node_modules/lodash/_toKey.js
var require_toKey = __commonJS({
  "node_modules/lodash/_toKey.js"(exports2, module2) {
    "use strict";
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    function toKey(value) {
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module2.exports = toKey;
  }
});

// node_modules/lodash/_baseGet.js
var require_baseGet = __commonJS({
  "node_modules/lodash/_baseGet.js"(exports2, module2) {
    "use strict";
    var castPath = require_castPath();
    var toKey = require_toKey();
    function baseGet(object, path) {
      path = castPath(path, object);
      var index = 0, length = path.length;
      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return index && index == length ? object : void 0;
    }
    module2.exports = baseGet;
  }
});

// node_modules/lodash/get.js
var require_get = __commonJS({
  "node_modules/lodash/get.js"(exports2, module2) {
    "use strict";
    var baseGet = require_baseGet();
    function get(object, path, defaultValue) {
      var result = object == null ? void 0 : baseGet(object, path);
      return result === void 0 ? defaultValue : result;
    }
    module2.exports = get;
  }
});

// node_modules/lodash/isEmpty.js
var require_isEmpty = __commonJS({
  "node_modules/lodash/isEmpty.js"(exports2, module2) {
    "use strict";
    var baseKeys = require_baseKeys();
    var getTag = require_getTag();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isArrayLike = require_isArrayLike();
    var isBuffer = require_isBuffer();
    var isPrototype = require_isPrototype();
    var isTypedArray = require_isTypedArray();
    var mapTag = "[object Map]";
    var setTag = "[object Set]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }
    module2.exports = isEmpty;
  }
});

// node_modules/lodash/_baseExtremum.js
var require_baseExtremum = __commonJS({
  "node_modules/lodash/_baseExtremum.js"(exports2, module2) {
    "use strict";
    var isSymbol = require_isSymbol();
    function baseExtremum(array, iteratee, comparator) {
      var index = -1, length = array.length;
      while (++index < length) {
        var value = array[index], current = iteratee(value);
        if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) {
          var computed = current, result = value;
        }
      }
      return result;
    }
    module2.exports = baseExtremum;
  }
});

// node_modules/lodash/_baseGt.js
var require_baseGt = __commonJS({
  "node_modules/lodash/_baseGt.js"(exports2, module2) {
    "use strict";
    function baseGt(value, other) {
      return value > other;
    }
    module2.exports = baseGt;
  }
});

// node_modules/lodash/max.js
var require_max = __commonJS({
  "node_modules/lodash/max.js"(exports2, module2) {
    "use strict";
    var baseExtremum = require_baseExtremum();
    var baseGt = require_baseGt();
    var identity = require_identity();
    function max(array) {
      return array && array.length ? baseExtremum(array, identity, baseGt) : void 0;
    }
    module2.exports = max;
  }
});

// node_modules/knex/lib/migrations/migrate/table-resolver.js
var require_table_resolver = __commonJS({
  "node_modules/knex/lib/migrations/migrate/table-resolver.js"(exports2, module2) {
    "use strict";
    function getTableName(tableName, schemaName) {
      return schemaName ? `${schemaName}.${tableName}` : tableName;
    }
    function getTable(trxOrKnex, tableName, schemaName) {
      return schemaName ? trxOrKnex(tableName).withSchema(schemaName) : trxOrKnex(tableName);
    }
    function getLockTableName(tableName) {
      return tableName + "_lock";
    }
    function getLockTableNameWithSchema(tableName, schemaName) {
      return schemaName ? schemaName + "." + getLockTableName(tableName) : getLockTableName(tableName);
    }
    module2.exports = {
      getLockTableName,
      getLockTableNameWithSchema,
      getTable,
      getTableName
    };
  }
});

// node_modules/knex/lib/migrations/migrate/table-creator.js
var require_table_creator = __commonJS({
  "node_modules/knex/lib/migrations/migrate/table-creator.js"(exports2, module2) {
    "use strict";
    var {
      getTable,
      getLockTableName,
      getLockTableNameWithSchema,
      getTableName
    } = require_table_resolver();
    function ensureTable(tableName, schemaName, trxOrKnex) {
      const lockTable = getLockTableName(tableName);
      return getSchemaBuilder(trxOrKnex, schemaName).hasTable(tableName).then((exists) => {
        return !exists && _createMigrationTable(tableName, schemaName, trxOrKnex);
      }).then(() => {
        return getSchemaBuilder(trxOrKnex, schemaName).hasTable(lockTable);
      }).then((exists) => {
        return !exists && _createMigrationLockTable(lockTable, schemaName, trxOrKnex);
      }).then(() => {
        return getTable(trxOrKnex, lockTable, schemaName).select("*");
      }).then((data) => {
        return !data.length && _insertLockRowIfNeeded(tableName, schemaName, trxOrKnex);
      });
    }
    function _createMigrationTable(tableName, schemaName, trxOrKnex) {
      return getSchemaBuilder(trxOrKnex, schemaName).createTable(
        getTableName(tableName),
        function(t) {
          t.increments();
          t.string("name");
          t.integer("batch");
          t.timestamp("migration_time");
        }
      );
    }
    function _createMigrationLockTable(tableName, schemaName, trxOrKnex) {
      return getSchemaBuilder(trxOrKnex, schemaName).createTable(
        tableName,
        function(t) {
          t.increments("index").primary();
          t.integer("is_locked");
        }
      );
    }
    function _insertLockRowIfNeeded(tableName, schemaName, trxOrKnex) {
      const lockTableWithSchema = getLockTableNameWithSchema(tableName, schemaName);
      return trxOrKnex.select("*").from(lockTableWithSchema).then((data) => {
        return !data.length ? trxOrKnex.from(lockTableWithSchema).insert({ is_locked: 0 }) : null;
      });
    }
    function getSchemaBuilder(trxOrKnex, schemaName) {
      return schemaName ? trxOrKnex.schema.withSchema(schemaName) : trxOrKnex.schema;
    }
    module2.exports = {
      ensureTable,
      getSchemaBuilder
    };
  }
});

// node_modules/knex/lib/migrations/migrate/migration-list-resolver.js
var require_migration_list_resolver = __commonJS({
  "node_modules/knex/lib/migrations/migrate/migration-list-resolver.js"(exports2, module2) {
    "use strict";
    var { getTableName } = require_table_resolver();
    var { ensureTable } = require_table_creator();
    function listAll(migrationSource, loadExtensions) {
      return migrationSource.getMigrations(loadExtensions);
    }
    async function listCompleted(tableName, schemaName, trxOrKnex) {
      await ensureTable(tableName, schemaName, trxOrKnex);
      return await trxOrKnex.from(getTableName(tableName, schemaName)).orderBy("id").select("name");
    }
    function listAllAndCompleted(config3, trxOrKnex) {
      return Promise.all([
        listAll(config3.migrationSource, config3.loadExtensions),
        listCompleted(config3.tableName, config3.schemaName, trxOrKnex)
      ]);
    }
    module2.exports = {
      listAll,
      listAllAndCompleted,
      listCompleted
    };
  }
});

// node_modules/lodash/_createAssigner.js
var require_createAssigner = __commonJS({
  "node_modules/lodash/_createAssigner.js"(exports2, module2) {
    "use strict";
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    module2.exports = createAssigner;
  }
});

// node_modules/lodash/assignInWith.js
var require_assignInWith = __commonJS({
  "node_modules/lodash/assignInWith.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var createAssigner = require_createAssigner();
    var keysIn = require_keysIn();
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });
    module2.exports = assignInWith;
  }
});

// node_modules/lodash/isPlainObject.js
var require_isPlainObject = __commonJS({
  "node_modules/lodash/isPlainObject.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var getPrototype = require_getPrototype();
    var isObjectLike = require_isObjectLike();
    var objectTag = "[object Object]";
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module2.exports = isPlainObject;
  }
});

// node_modules/lodash/isError.js
var require_isError = __commonJS({
  "node_modules/lodash/isError.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var isPlainObject = require_isPlainObject();
    var domExcTag = "[object DOMException]";
    var errorTag = "[object Error]";
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
    }
    module2.exports = isError;
  }
});

// node_modules/lodash/attempt.js
var require_attempt = __commonJS({
  "node_modules/lodash/attempt.js"(exports2, module2) {
    "use strict";
    var apply = require_apply();
    var baseRest = require_baseRest();
    var isError = require_isError();
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, void 0, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });
    module2.exports = attempt;
  }
});

// node_modules/lodash/_baseValues.js
var require_baseValues = __commonJS({
  "node_modules/lodash/_baseValues.js"(exports2, module2) {
    "use strict";
    var arrayMap = require_arrayMap();
    function baseValues(object, props) {
      return arrayMap(props, function(key) {
        return object[key];
      });
    }
    module2.exports = baseValues;
  }
});

// node_modules/lodash/_customDefaultsAssignIn.js
var require_customDefaultsAssignIn = __commonJS({
  "node_modules/lodash/_customDefaultsAssignIn.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === void 0 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
        return srcValue;
      }
      return objValue;
    }
    module2.exports = customDefaultsAssignIn;
  }
});

// node_modules/lodash/_escapeStringChar.js
var require_escapeStringChar = __commonJS({
  "node_modules/lodash/_escapeStringChar.js"(exports2, module2) {
    "use strict";
    var stringEscapes = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    };
    function escapeStringChar(chr) {
      return "\\" + stringEscapes[chr];
    }
    module2.exports = escapeStringChar;
  }
});

// node_modules/lodash/_reInterpolate.js
var require_reInterpolate = __commonJS({
  "node_modules/lodash/_reInterpolate.js"(exports2, module2) {
    "use strict";
    var reInterpolate = /<%=([\s\S]+?)%>/g;
    module2.exports = reInterpolate;
  }
});

// node_modules/lodash/_basePropertyOf.js
var require_basePropertyOf = __commonJS({
  "node_modules/lodash/_basePropertyOf.js"(exports2, module2) {
    "use strict";
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? void 0 : object[key];
      };
    }
    module2.exports = basePropertyOf;
  }
});

// node_modules/lodash/_escapeHtmlChar.js
var require_escapeHtmlChar = __commonJS({
  "node_modules/lodash/_escapeHtmlChar.js"(exports2, module2) {
    "use strict";
    var basePropertyOf = require_basePropertyOf();
    var htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    module2.exports = escapeHtmlChar;
  }
});

// node_modules/lodash/escape.js
var require_escape = __commonJS({
  "node_modules/lodash/escape.js"(exports2, module2) {
    "use strict";
    var escapeHtmlChar = require_escapeHtmlChar();
    var toString = require_toString();
    var reUnescapedHtml = /[&<>"']/g;
    var reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    function escape(string) {
      string = toString(string);
      return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
    }
    module2.exports = escape;
  }
});

// node_modules/lodash/_reEscape.js
var require_reEscape = __commonJS({
  "node_modules/lodash/_reEscape.js"(exports2, module2) {
    "use strict";
    var reEscape = /<%-([\s\S]+?)%>/g;
    module2.exports = reEscape;
  }
});

// node_modules/lodash/_reEvaluate.js
var require_reEvaluate = __commonJS({
  "node_modules/lodash/_reEvaluate.js"(exports2, module2) {
    "use strict";
    var reEvaluate = /<%([\s\S]+?)%>/g;
    module2.exports = reEvaluate;
  }
});

// node_modules/lodash/templateSettings.js
var require_templateSettings = __commonJS({
  "node_modules/lodash/templateSettings.js"(exports2, module2) {
    "use strict";
    var escape = require_escape();
    var reEscape = require_reEscape();
    var reEvaluate = require_reEvaluate();
    var reInterpolate = require_reInterpolate();
    var templateSettings = {
      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      "escape": reEscape,
      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      "evaluate": reEvaluate,
      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      "interpolate": reInterpolate,
      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      "variable": "",
      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      "imports": {
        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        "_": { "escape": escape }
      }
    };
    module2.exports = templateSettings;
  }
});

// node_modules/lodash/template.js
var require_template = __commonJS({
  "node_modules/lodash/template.js"(exports2, module2) {
    "use strict";
    var assignInWith = require_assignInWith();
    var attempt = require_attempt();
    var baseValues = require_baseValues();
    var customDefaultsAssignIn = require_customDefaultsAssignIn();
    var escapeStringChar = require_escapeStringChar();
    var isError = require_isError();
    var isIterateeCall = require_isIterateeCall();
    var keys = require_keys();
    var reInterpolate = require_reInterpolate();
    var templateSettings = require_templateSettings();
    var toString = require_toString();
    var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
    var reEmptyStringLeading = /\b__p \+= '';/g;
    var reEmptyStringMiddle = /\b(__p \+=) '' \+/g;
    var reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function template(string, options, guard) {
      var settings = templateSettings.imports._.templateSettings || templateSettings;
      if (guard && isIterateeCall(string, options, guard)) {
        options = void 0;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);
      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
      var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
        "g"
      );
      var sourceURL = hasOwnProperty.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;
        return match;
      });
      source += "';\n";
      var variable = hasOwnProperty.call(options, "variable") && options.variable;
      if (!variable) {
        source = "with (obj) {\n" + source + "\n}\n";
      } else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }
      source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
      source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
      var result = attempt(function() {
        return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
      });
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }
    module2.exports = template;
  }
});

// node_modules/lodash/flatten.js
var require_flatten = __commonJS({
  "node_modules/lodash/flatten.js"(exports2, module2) {
    "use strict";
    var baseFlatten = require_baseFlatten();
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }
    module2.exports = flatten;
  }
});

// node_modules/knex/lib/migrations/util/fs.js
var require_fs = __commonJS({
  "node_modules/knex/lib/migrations/util/fs.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var flatten = require_flatten();
    var os = require("os");
    var path = require("path");
    var { promisify } = require("util");
    var stat = promisify(fs.stat);
    var readFile = promisify(fs.readFile);
    var writeFile = promisify(fs.writeFile);
    var readdir = promisify(fs.readdir);
    var mkdir = promisify(fs.mkdir);
    function existsSync(path2) {
      try {
        fs.accessSync(path2);
        return true;
      } catch (e) {
        return false;
      }
    }
    function createTemp() {
      return promisify(fs.mkdtemp)(`${os.tmpdir()}${path.sep}`);
    }
    function ensureDirectoryExists(dir) {
      return stat(dir).catch(() => mkdir(dir, { recursive: true }));
    }
    async function getFilepathsInFolder(dir, recursive = false) {
      const pathsList = await readdir(dir);
      return flatten(
        await Promise.all(
          pathsList.sort().map(async (currentPath) => {
            const currentFile = path.resolve(dir, currentPath);
            const statFile = await stat(currentFile);
            if (statFile && statFile.isDirectory()) {
              if (recursive) {
                return await getFilepathsInFolder(currentFile, true);
              }
              return [];
            }
            return [currentFile];
          })
        )
      );
    }
    module2.exports = {
      existsSync,
      stat,
      readdir,
      readFile,
      writeFile,
      createTemp,
      ensureDirectoryExists,
      getFilepathsInFolder
    };
  }
});

// node_modules/knex/lib/migrations/util/template.js
var require_template2 = __commonJS({
  "node_modules/knex/lib/migrations/util/template.js"(exports2, module2) {
    "use strict";
    var template = require_template();
    var { readFile, writeFile } = require_fs();
    var jsSourceTemplate = (content, options) => template(content, {
      interpolate: /<%=([\s\S]+?)%>/g,
      ...options
    });
    var jsFileTemplate = async (filePath, options) => {
      const contentBuffer = await readFile(filePath);
      return jsSourceTemplate(contentBuffer.toString(), options);
    };
    var writeJsFileUsingTemplate = async (targetFilePath, sourceFilePath, options, variables) => writeFile(
      targetFilePath,
      (await jsFileTemplate(sourceFilePath, options))(variables)
    );
    module2.exports = {
      jsSourceTemplate,
      jsFileTemplate,
      writeJsFileUsingTemplate
    };
  }
});

// node_modules/lodash/_arraySome.js
var require_arraySome = __commonJS({
  "node_modules/lodash/_arraySome.js"(exports2, module2) {
    "use strict";
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    module2.exports = arraySome;
  }
});

// node_modules/lodash/_equalArrays.js
var require_equalArrays = __commonJS({
  "node_modules/lodash/_equalArrays.js"(exports2, module2) {
    "use strict";
    var SetCache = require_SetCache();
    var arraySome = require_arraySome();
    var cacheHas = require_cacheHas();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    module2.exports = equalArrays;
  }
});

// node_modules/lodash/_mapToArray.js
var require_mapToArray = __commonJS({
  "node_modules/lodash/_mapToArray.js"(exports2, module2) {
    "use strict";
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    module2.exports = mapToArray;
  }
});

// node_modules/lodash/_setToArray.js
var require_setToArray = __commonJS({
  "node_modules/lodash/_setToArray.js"(exports2, module2) {
    "use strict";
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    module2.exports = setToArray;
  }
});

// node_modules/lodash/_equalByTag.js
var require_equalByTag = __commonJS({
  "node_modules/lodash/_equalByTag.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var Uint8Array2 = require_Uint8Array();
    var eq = require_eq();
    var equalArrays = require_equalArrays();
    var mapToArray = require_mapToArray();
    var setToArray = require_setToArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    module2.exports = equalByTag;
  }
});

// node_modules/lodash/_equalObjects.js
var require_equalObjects = __commonJS({
  "node_modules/lodash/_equalObjects.js"(exports2, module2) {
    "use strict";
    var getAllKeys = require_getAllKeys();
    var COMPARE_PARTIAL_FLAG = 1;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    module2.exports = equalObjects;
  }
});

// node_modules/lodash/_baseIsEqualDeep.js
var require_baseIsEqualDeep = __commonJS({
  "node_modules/lodash/_baseIsEqualDeep.js"(exports2, module2) {
    "use strict";
    var Stack = require_Stack();
    var equalArrays = require_equalArrays();
    var equalByTag = require_equalByTag();
    var equalObjects = require_equalObjects();
    var getTag = require_getTag();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isTypedArray = require_isTypedArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var objectTag = "[object Object]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    module2.exports = baseIsEqualDeep;
  }
});

// node_modules/lodash/_baseIsEqual.js
var require_baseIsEqual = __commonJS({
  "node_modules/lodash/_baseIsEqual.js"(exports2, module2) {
    "use strict";
    var baseIsEqualDeep = require_baseIsEqualDeep();
    var isObjectLike = require_isObjectLike();
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    module2.exports = baseIsEqual;
  }
});

// node_modules/lodash/_baseIsMatch.js
var require_baseIsMatch = __commonJS({
  "node_modules/lodash/_baseIsMatch.js"(exports2, module2) {
    "use strict";
    var Stack = require_Stack();
    var baseIsEqual = require_baseIsEqual();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length, length = index, noCustomizer = !customizer;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (noCustomizer && data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    module2.exports = baseIsMatch;
  }
});

// node_modules/lodash/_isStrictComparable.js
var require_isStrictComparable = __commonJS({
  "node_modules/lodash/_isStrictComparable.js"(exports2, module2) {
    "use strict";
    var isObject = require_isObject();
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }
    module2.exports = isStrictComparable;
  }
});

// node_modules/lodash/_getMatchData.js
var require_getMatchData = __commonJS({
  "node_modules/lodash/_getMatchData.js"(exports2, module2) {
    "use strict";
    var isStrictComparable = require_isStrictComparable();
    var keys = require_keys();
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    module2.exports = getMatchData;
  }
});

// node_modules/lodash/_matchesStrictComparable.js
var require_matchesStrictComparable = __commonJS({
  "node_modules/lodash/_matchesStrictComparable.js"(exports2, module2) {
    "use strict";
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
      };
    }
    module2.exports = matchesStrictComparable;
  }
});

// node_modules/lodash/_baseMatches.js
var require_baseMatches = __commonJS({
  "node_modules/lodash/_baseMatches.js"(exports2, module2) {
    "use strict";
    var baseIsMatch = require_baseIsMatch();
    var getMatchData = require_getMatchData();
    var matchesStrictComparable = require_matchesStrictComparable();
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }
    module2.exports = baseMatches;
  }
});

// node_modules/lodash/_baseHasIn.js
var require_baseHasIn = __commonJS({
  "node_modules/lodash/_baseHasIn.js"(exports2, module2) {
    "use strict";
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }
    module2.exports = baseHasIn;
  }
});

// node_modules/lodash/_hasPath.js
var require_hasPath = __commonJS({
  "node_modules/lodash/_hasPath.js"(exports2, module2) {
    "use strict";
    var castPath = require_castPath();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isIndex = require_isIndex();
    var isLength = require_isLength();
    var toKey = require_toKey();
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);
      var index = -1, length = path.length, result = false;
      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    }
    module2.exports = hasPath;
  }
});

// node_modules/lodash/hasIn.js
var require_hasIn = __commonJS({
  "node_modules/lodash/hasIn.js"(exports2, module2) {
    "use strict";
    var baseHasIn = require_baseHasIn();
    var hasPath = require_hasPath();
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }
    module2.exports = hasIn;
  }
});

// node_modules/lodash/_baseMatchesProperty.js
var require_baseMatchesProperty = __commonJS({
  "node_modules/lodash/_baseMatchesProperty.js"(exports2, module2) {
    "use strict";
    var baseIsEqual = require_baseIsEqual();
    var get = require_get();
    var hasIn = require_hasIn();
    var isKey = require_isKey();
    var isStrictComparable = require_isStrictComparable();
    var matchesStrictComparable = require_matchesStrictComparable();
    var toKey = require_toKey();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }
    module2.exports = baseMatchesProperty;
  }
});

// node_modules/lodash/_baseProperty.js
var require_baseProperty = __commonJS({
  "node_modules/lodash/_baseProperty.js"(exports2, module2) {
    "use strict";
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    module2.exports = baseProperty;
  }
});

// node_modules/lodash/_basePropertyDeep.js
var require_basePropertyDeep = __commonJS({
  "node_modules/lodash/_basePropertyDeep.js"(exports2, module2) {
    "use strict";
    var baseGet = require_baseGet();
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }
    module2.exports = basePropertyDeep;
  }
});

// node_modules/lodash/property.js
var require_property = __commonJS({
  "node_modules/lodash/property.js"(exports2, module2) {
    "use strict";
    var baseProperty = require_baseProperty();
    var basePropertyDeep = require_basePropertyDeep();
    var isKey = require_isKey();
    var toKey = require_toKey();
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }
    module2.exports = property;
  }
});

// node_modules/lodash/_baseIteratee.js
var require_baseIteratee = __commonJS({
  "node_modules/lodash/_baseIteratee.js"(exports2, module2) {
    "use strict";
    var baseMatches = require_baseMatches();
    var baseMatchesProperty = require_baseMatchesProperty();
    var identity = require_identity();
    var isArray = require_isArray();
    var property = require_property();
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    module2.exports = baseIteratee;
  }
});

// node_modules/lodash/_createBaseFor.js
var require_createBaseFor = __commonJS({
  "node_modules/lodash/_createBaseFor.js"(exports2, module2) {
    "use strict";
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    module2.exports = createBaseFor;
  }
});

// node_modules/lodash/_baseFor.js
var require_baseFor = __commonJS({
  "node_modules/lodash/_baseFor.js"(exports2, module2) {
    "use strict";
    var createBaseFor = require_createBaseFor();
    var baseFor = createBaseFor();
    module2.exports = baseFor;
  }
});

// node_modules/lodash/_baseForOwn.js
var require_baseForOwn = __commonJS({
  "node_modules/lodash/_baseForOwn.js"(exports2, module2) {
    "use strict";
    var baseFor = require_baseFor();
    var keys = require_keys();
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }
    module2.exports = baseForOwn;
  }
});

// node_modules/lodash/_createBaseEach.js
var require_createBaseEach = __commonJS({
  "node_modules/lodash/_createBaseEach.js"(exports2, module2) {
    "use strict";
    var isArrayLike = require_isArrayLike();
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
        while (fromRight ? index-- : ++index < length) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }
    module2.exports = createBaseEach;
  }
});

// node_modules/lodash/_baseEach.js
var require_baseEach = __commonJS({
  "node_modules/lodash/_baseEach.js"(exports2, module2) {
    "use strict";
    var baseForOwn = require_baseForOwn();
    var createBaseEach = require_createBaseEach();
    var baseEach = createBaseEach(baseForOwn);
    module2.exports = baseEach;
  }
});

// node_modules/lodash/_baseMap.js
var require_baseMap = __commonJS({
  "node_modules/lodash/_baseMap.js"(exports2, module2) {
    "use strict";
    var baseEach = require_baseEach();
    var isArrayLike = require_isArrayLike();
    function baseMap(collection, iteratee) {
      var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
      baseEach(collection, function(value, key, collection2) {
        result[++index] = iteratee(value, key, collection2);
      });
      return result;
    }
    module2.exports = baseMap;
  }
});

// node_modules/lodash/_baseSortBy.js
var require_baseSortBy = __commonJS({
  "node_modules/lodash/_baseSortBy.js"(exports2, module2) {
    "use strict";
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    module2.exports = baseSortBy;
  }
});

// node_modules/lodash/_compareAscending.js
var require_compareAscending = __commonJS({
  "node_modules/lodash/_compareAscending.js"(exports2, module2) {
    "use strict";
    var isSymbol = require_isSymbol();
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
        var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
        if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
          return 1;
        }
        if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }
    module2.exports = compareAscending;
  }
});

// node_modules/lodash/_compareMultiple.js
var require_compareMultiple = __commonJS({
  "node_modules/lodash/_compareMultiple.js"(exports2, module2) {
    "use strict";
    var compareAscending = require_compareAscending();
    function compareMultiple(object, other, orders) {
      var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == "desc" ? -1 : 1);
        }
      }
      return object.index - other.index;
    }
    module2.exports = compareMultiple;
  }
});

// node_modules/lodash/_baseOrderBy.js
var require_baseOrderBy = __commonJS({
  "node_modules/lodash/_baseOrderBy.js"(exports2, module2) {
    "use strict";
    var arrayMap = require_arrayMap();
    var baseGet = require_baseGet();
    var baseIteratee = require_baseIteratee();
    var baseMap = require_baseMap();
    var baseSortBy = require_baseSortBy();
    var baseUnary = require_baseUnary();
    var compareMultiple = require_compareMultiple();
    var identity = require_identity();
    var isArray = require_isArray();
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            };
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }
      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
      var result = baseMap(collection, function(value, key, collection2) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { "criteria": criteria, "index": ++index, "value": value };
      });
      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }
    module2.exports = baseOrderBy;
  }
});

// node_modules/lodash/sortBy.js
var require_sortBy = __commonJS({
  "node_modules/lodash/sortBy.js"(exports2, module2) {
    "use strict";
    var baseFlatten = require_baseFlatten();
    var baseOrderBy = require_baseOrderBy();
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });
    module2.exports = sortBy;
  }
});

// node_modules/get-package-type/is-node-modules.cjs
var require_is_node_modules = __commonJS({
  "node_modules/get-package-type/is-node-modules.cjs"(exports2, module2) {
    "use strict";
    var path = require("path");
    function isNodeModules(directory) {
      let basename = path.basename(directory);
      if (path.sep === "\\") {
        basename = basename.toLowerCase();
      }
      return basename === "node_modules";
    }
    module2.exports = isNodeModules;
  }
});

// node_modules/get-package-type/cache.cjs
var require_cache = __commonJS({
  "node_modules/get-package-type/cache.cjs"(exports2, module2) {
    "use strict";
    module2.exports = /* @__PURE__ */ new Map();
  }
});

// node_modules/get-package-type/async.cjs
var require_async = __commonJS({
  "node_modules/get-package-type/async.cjs"(exports2, module2) {
    "use strict";
    var path = require("path");
    var { promisify } = require("util");
    var readFile = promisify(require("fs").readFile);
    var isNodeModules = require_is_node_modules();
    var resultsCache = require_cache();
    var promiseCache = /* @__PURE__ */ new Map();
    async function getDirectoryTypeActual(directory) {
      if (isNodeModules(directory)) {
        return "commonjs";
      }
      try {
        return JSON.parse(await readFile(path.resolve(directory, "package.json"))).type || "commonjs";
      } catch (_) {
      }
      const parent = path.dirname(directory);
      if (parent === directory) {
        return "commonjs";
      }
      return getDirectoryType(parent);
    }
    async function getDirectoryType(directory) {
      if (resultsCache.has(directory)) {
        return resultsCache.get(directory);
      }
      if (promiseCache.has(directory)) {
        return promiseCache.get(directory);
      }
      const promise = getDirectoryTypeActual(directory);
      promiseCache.set(directory, promise);
      const result = await promise;
      resultsCache.set(directory, result);
      promiseCache.delete(directory);
      return result;
    }
    function getPackageType(filename) {
      return getDirectoryType(path.resolve(path.dirname(filename)));
    }
    module2.exports = getPackageType;
  }
});

// node_modules/get-package-type/sync.cjs
var require_sync = __commonJS({
  "node_modules/get-package-type/sync.cjs"(exports2, module2) {
    "use strict";
    var path = require("path");
    var { readFileSync } = require("fs");
    var isNodeModules = require_is_node_modules();
    var resultsCache = require_cache();
    function getDirectoryTypeActual(directory) {
      if (isNodeModules(directory)) {
        return "commonjs";
      }
      try {
        return JSON.parse(readFileSync(path.resolve(directory, "package.json"))).type || "commonjs";
      } catch (_) {
      }
      const parent = path.dirname(directory);
      if (parent === directory) {
        return "commonjs";
      }
      return getDirectoryType(parent);
    }
    function getDirectoryType(directory) {
      if (resultsCache.has(directory)) {
        return resultsCache.get(directory);
      }
      const result = getDirectoryTypeActual(directory);
      resultsCache.set(directory, result);
      return result;
    }
    function getPackageTypeSync(filename) {
      return getDirectoryType(path.resolve(path.dirname(filename)));
    }
    module2.exports = getPackageTypeSync;
  }
});

// node_modules/get-package-type/index.cjs
var require_get_package_type = __commonJS({
  "node_modules/get-package-type/index.cjs"(exports2, module2) {
    "use strict";
    var getPackageType = require_async();
    var getPackageTypeSync = require_sync();
    module2.exports = (filename) => getPackageType(filename);
    module2.exports.sync = getPackageTypeSync;
  }
});

// node_modules/knex/lib/migrations/util/is-module-type.js
var require_is_module_type = __commonJS({
  "node_modules/knex/lib/migrations/util/is-module-type.js"(exports2, module2) {
    "use strict";
    var getPackageType = require_get_package_type();
    module2.exports = async function isModuleType(filepath) {
      return filepath.endsWith(".mjs") || !filepath.endsWith(".cjs") && await getPackageType(filepath) === "module";
    };
  }
});

// node_modules/knex/lib/migrations/util/import-file.js
var require_import_file = __commonJS({
  "node_modules/knex/lib/migrations/util/import-file.js"(exports2, module2) {
    "use strict";
    var isModuleType = require_is_module_type();
    module2.exports = async function importFile(filepath) {
      return await isModuleType(filepath) ? import(require("url").pathToFileURL(filepath)) : require(filepath);
    };
  }
});

// node_modules/knex/lib/migrations/common/MigrationsLoader.js
var require_MigrationsLoader = __commonJS({
  "node_modules/knex/lib/migrations/common/MigrationsLoader.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var DEFAULT_LOAD_EXTENSIONS = Object.freeze([
      ".co",
      ".coffee",
      ".eg",
      ".iced",
      ".js",
      ".cjs",
      ".litcoffee",
      ".ls",
      ".ts"
    ]);
    var AbstractMigrationsLoader = class {
      constructor(migrationDirectories, sortDirsSeparately, loadExtensions) {
        this.sortDirsSeparately = sortDirsSeparately;
        if (!Array.isArray(migrationDirectories)) {
          migrationDirectories = [migrationDirectories];
        }
        this.migrationsPaths = migrationDirectories;
        this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
      }
      getFile(migrationsInfo) {
        const absoluteDir = path.resolve(process.cwd(), migrationsInfo.directory);
        const _path = path.join(absoluteDir, migrationsInfo.file);
        const importFile = require_import_file();
        return importFile(_path);
      }
    };
    module2.exports = {
      DEFAULT_LOAD_EXTENSIONS,
      AbstractMigrationsLoader
    };
  }
});

// node_modules/knex/lib/migrations/migrate/sources/fs-migrations.js
var require_fs_migrations = __commonJS({
  "node_modules/knex/lib/migrations/migrate/sources/fs-migrations.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var sortBy = require_sortBy();
    var { readdir } = require_fs();
    var { AbstractMigrationsLoader } = require_MigrationsLoader();
    var FsMigrations = class extends AbstractMigrationsLoader {
      /**
       * Gets the migration names
       * @returns Promise<string[]>
       */
      getMigrations(loadExtensions) {
        const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
          const absoluteDir = path.resolve(process.cwd(), configDir);
          return readdir(absoluteDir).then((files) => ({
            files,
            configDir,
            absoluteDir
          }));
        });
        return Promise.all(readMigrationsPromises).then((allMigrations) => {
          const migrations = allMigrations.reduce((acc, migrationDirectory) => {
            if (this.sortDirsSeparately) {
              migrationDirectory.files = migrationDirectory.files.sort();
            }
            migrationDirectory.files.forEach(
              (file) => acc.push({ file, directory: migrationDirectory.configDir })
            );
            return acc;
          }, []);
          if (this.sortDirsSeparately) {
            return filterMigrations(
              this,
              migrations,
              loadExtensions || this.loadExtensions
            );
          }
          return filterMigrations(
            this,
            sortBy(migrations, "file"),
            loadExtensions || this.loadExtensions
          );
        });
      }
      getMigrationName(migration) {
        return migration.file;
      }
      getMigration(migrationInfo) {
        return this.getFile(migrationInfo);
      }
    };
    function filterMigrations(migrationSource, migrations, loadExtensions) {
      return migrations.filter((migration) => {
        const migrationName = migrationSource.getMigrationName(migration);
        const extension = path.extname(migrationName);
        return loadExtensions.includes(extension);
      });
    }
    module2.exports = {
      FsMigrations
    };
  }
});

// node_modules/colorette/index.cjs
var require_colorette = __commonJS({
  "node_modules/colorette/index.cjs"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tty = require("tty");
    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var tty__namespace = /* @__PURE__ */ _interopNamespace(tty);
    var {
      env: env2 = {},
      argv = [],
      platform = ""
    } = typeof process === "undefined" ? {} : process;
    var isDisabled = "NO_COLOR" in env2 || argv.includes("--no-color");
    var isForced = "FORCE_COLOR" in env2 || argv.includes("--color");
    var isWindows = platform === "win32";
    var isDumbTerminal = env2.TERM === "dumb";
    var isCompatibleTerminal = tty__namespace && tty__namespace.isatty && tty__namespace.isatty(1) && env2.TERM && !isDumbTerminal;
    var isCI = "CI" in env2 && ("GITHUB_ACTIONS" in env2 || "GITLAB_CI" in env2 || "CIRCLECI" in env2);
    var isColorSupported = !isDisabled && (isForced || isWindows && !isDumbTerminal || isCompatibleTerminal || isCI);
    var replaceClose = (index, string, close, replace, head = string.substring(0, index) + replace, tail = string.substring(index + close.length), next = tail.indexOf(close)) => head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
    var clearBleed = (index, string, open, close, replace) => index < 0 ? open + string + close : open + replaceClose(index, string, close, replace) + close;
    var filterEmpty = (open, close, replace = open, at = open.length + 1) => (string) => string || !(string === "" || string === void 0) ? clearBleed(
      ("" + string).indexOf(close, at),
      string,
      open,
      close,
      replace
    ) : "";
    var init = (open, close, replace) => filterEmpty(`\x1B[${open}m`, `\x1B[${close}m`, replace);
    var colors = {
      reset: init(0, 0),
      bold: init(1, 22, "\x1B[22m\x1B[1m"),
      dim: init(2, 22, "\x1B[22m\x1B[2m"),
      italic: init(3, 23),
      underline: init(4, 24),
      inverse: init(7, 27),
      hidden: init(8, 28),
      strikethrough: init(9, 29),
      black: init(30, 39),
      red: init(31, 39),
      green: init(32, 39),
      yellow: init(33, 39),
      blue: init(34, 39),
      magenta: init(35, 39),
      cyan: init(36, 39),
      white: init(37, 39),
      gray: init(90, 39),
      bgBlack: init(40, 49),
      bgRed: init(41, 49),
      bgGreen: init(42, 49),
      bgYellow: init(43, 49),
      bgBlue: init(44, 49),
      bgMagenta: init(45, 49),
      bgCyan: init(46, 49),
      bgWhite: init(47, 49),
      blackBright: init(90, 39),
      redBright: init(91, 39),
      greenBright: init(92, 39),
      yellowBright: init(93, 39),
      blueBright: init(94, 39),
      magentaBright: init(95, 39),
      cyanBright: init(96, 39),
      whiteBright: init(97, 39),
      bgBlackBright: init(100, 49),
      bgRedBright: init(101, 49),
      bgGreenBright: init(102, 49),
      bgYellowBright: init(103, 49),
      bgBlueBright: init(104, 49),
      bgMagentaBright: init(105, 49),
      bgCyanBright: init(106, 49),
      bgWhiteBright: init(107, 49)
    };
    var createColors = ({ useColor = isColorSupported } = {}) => useColor ? colors : Object.keys(colors).reduce(
      (colors2, key) => ({ ...colors2, [key]: String }),
      {}
    );
    var {
      reset,
      bold,
      dim,
      italic,
      underline,
      inverse,
      hidden,
      strikethrough,
      black,
      red,
      green,
      yellow,
      blue,
      magenta,
      cyan,
      white,
      gray,
      bgBlack,
      bgRed,
      bgGreen,
      bgYellow,
      bgBlue,
      bgMagenta,
      bgCyan,
      bgWhite,
      blackBright,
      redBright,
      greenBright,
      yellowBright,
      blueBright,
      magentaBright,
      cyanBright,
      whiteBright,
      bgBlackBright,
      bgRedBright,
      bgGreenBright,
      bgYellowBright,
      bgBlueBright,
      bgMagentaBright,
      bgCyanBright,
      bgWhiteBright
    } = createColors();
    exports2.bgBlack = bgBlack;
    exports2.bgBlackBright = bgBlackBright;
    exports2.bgBlue = bgBlue;
    exports2.bgBlueBright = bgBlueBright;
    exports2.bgCyan = bgCyan;
    exports2.bgCyanBright = bgCyanBright;
    exports2.bgGreen = bgGreen;
    exports2.bgGreenBright = bgGreenBright;
    exports2.bgMagenta = bgMagenta;
    exports2.bgMagentaBright = bgMagentaBright;
    exports2.bgRed = bgRed;
    exports2.bgRedBright = bgRedBright;
    exports2.bgWhite = bgWhite;
    exports2.bgWhiteBright = bgWhiteBright;
    exports2.bgYellow = bgYellow;
    exports2.bgYellowBright = bgYellowBright;
    exports2.black = black;
    exports2.blackBright = blackBright;
    exports2.blue = blue;
    exports2.blueBright = blueBright;
    exports2.bold = bold;
    exports2.createColors = createColors;
    exports2.cyan = cyan;
    exports2.cyanBright = cyanBright;
    exports2.dim = dim;
    exports2.gray = gray;
    exports2.green = green;
    exports2.greenBright = greenBright;
    exports2.hidden = hidden;
    exports2.inverse = inverse;
    exports2.isColorSupported = isColorSupported;
    exports2.italic = italic;
    exports2.magenta = magenta;
    exports2.magentaBright = magentaBright;
    exports2.red = red;
    exports2.redBright = redBright;
    exports2.reset = reset;
    exports2.strikethrough = strikethrough;
    exports2.underline = underline;
    exports2.white = white;
    exports2.whiteBright = whiteBright;
    exports2.yellow = yellow;
    exports2.yellowBright = yellowBright;
  }
});

// node_modules/knex/lib/util/is.js
var require_is = __commonJS({
  "node_modules/knex/lib/util/is.js"(exports2, module2) {
    "use strict";
    function isString(value) {
      return typeof value === "string";
    }
    function isNumber(value) {
      return typeof value === "number";
    }
    function isBoolean(value) {
      return typeof value === "boolean";
    }
    function isUndefined(value) {
      return typeof value === "undefined";
    }
    function isObject(value) {
      return typeof value === "object" && value !== null;
    }
    function isFunction(value) {
      return typeof value === "function";
    }
    module2.exports = {
      isString,
      isNumber,
      isBoolean,
      isUndefined,
      isObject,
      isFunction
    };
  }
});

// node_modules/knex/lib/logger.js
var require_logger = __commonJS({
  "node_modules/knex/lib/logger.js"(exports2, module2) {
    "use strict";
    var color = require_colorette();
    var { inspect } = require("util");
    var { isString, isFunction } = require_is();
    var Logger = class {
      constructor(config3 = {}) {
        const {
          log: {
            debug,
            warn,
            error,
            deprecate,
            inspectionDepth,
            enableColors
          } = {}
        } = config3;
        this._inspectionDepth = inspectionDepth || 5;
        this._enableColors = resolveIsEnabledColors(enableColors);
        this._debug = debug;
        this._warn = warn;
        this._error = error;
        this._deprecate = deprecate;
      }
      _log(message, userFn, colorFn) {
        if (userFn != null && !isFunction(userFn)) {
          throw new TypeError("Extensions to knex logger must be functions!");
        }
        if (isFunction(userFn)) {
          userFn(message);
          return;
        }
        if (!isString(message)) {
          message = inspect(message, {
            depth: this._inspectionDepth,
            colors: this._enableColors
          });
        }
        console.log(colorFn ? colorFn(message) : message);
      }
      debug(message) {
        this._log(message, this._debug);
      }
      warn(message) {
        this._log(message, this._warn, color.yellow);
      }
      error(message) {
        this._log(message, this._error, color.red);
      }
      deprecate(method, alternative) {
        const message = `${method} is deprecated, please use ${alternative}`;
        this._log(message, this._deprecate, color.yellow);
      }
    };
    function resolveIsEnabledColors(enableColorsParam) {
      if (enableColorsParam != null) {
        return enableColorsParam;
      }
      if (process && process.stdout) {
        return process.stdout.isTTY;
      }
      return false;
    }
    module2.exports = Logger;
  }
});

// node_modules/knex/lib/migrations/migrate/migrator-configuration-merger.js
var require_migrator_configuration_merger = __commonJS({
  "node_modules/knex/lib/migrations/migrate/migrator-configuration-merger.js"(exports2, module2) {
    "use strict";
    var { FsMigrations } = require_fs_migrations();
    var Logger = require_logger();
    var { DEFAULT_LOAD_EXTENSIONS } = require_MigrationsLoader();
    var defaultLogger = new Logger();
    var CONFIG_DEFAULT = Object.freeze({
      extension: "js",
      loadExtensions: DEFAULT_LOAD_EXTENSIONS,
      tableName: "knex_migrations",
      schemaName: null,
      directory: "./migrations",
      disableTransactions: false,
      disableMigrationsListValidation: false,
      sortDirsSeparately: false
    });
    function getMergedConfig(config3, currentConfig, logger = defaultLogger) {
      const mergedConfig = Object.assign(
        {},
        CONFIG_DEFAULT,
        currentConfig || {},
        config3
      );
      if (config3 && // If user specifies any FS related config,
      // clear specified migrationSource to avoid ambiguity
      (config3.directory || config3.sortDirsSeparately !== void 0 || config3.loadExtensions)) {
        if (config3.migrationSource) {
          logger.warn(
            "FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations"
          );
        }
        mergedConfig.migrationSource = null;
      }
      if (!mergedConfig.migrationSource) {
        mergedConfig.migrationSource = new FsMigrations(
          mergedConfig.directory,
          mergedConfig.sortDirsSeparately,
          mergedConfig.loadExtensions
        );
      }
      return mergedConfig;
    }
    module2.exports = {
      getMergedConfig
    };
  }
});

// node_modules/knex/lib/migrations/util/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/knex/lib/migrations/util/timestamp.js"(exports2, module2) {
    "use strict";
    function yyyymmddhhmmss() {
      const now = /* @__PURE__ */ new Date();
      return now.getUTCFullYear().toString() + (now.getUTCMonth() + 1).toString().padStart(2, "0") + now.getUTCDate().toString().padStart(2, "0") + now.getUTCHours().toString().padStart(2, "0") + now.getUTCMinutes().toString().padStart(2, "0") + now.getUTCSeconds().toString().padStart(2, "0");
    }
    module2.exports = { yyyymmddhhmmss };
  }
});

// node_modules/knex/lib/migrations/migrate/MigrationGenerator.js
var require_MigrationGenerator = __commonJS({
  "node_modules/knex/lib/migrations/migrate/MigrationGenerator.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var { writeJsFileUsingTemplate } = require_template2();
    var { getMergedConfig } = require_migrator_configuration_merger();
    var { ensureDirectoryExists } = require_fs();
    var { yyyymmddhhmmss } = require_timestamp();
    var MigrationGenerator = class {
      constructor(migrationConfig, logger) {
        this.config = getMergedConfig(migrationConfig, void 0, logger);
      }
      // Creates a new migration, with a given name.
      async make(name, config3, logger) {
        this.config = getMergedConfig(config3, this.config, logger);
        if (!name) {
          return Promise.reject(
            new Error("A name must be specified for the generated migration")
          );
        }
        await this._ensureFolder();
        const createdMigrationFilePath = await this._writeNewMigration(name);
        return createdMigrationFilePath;
      }
      // Ensures a folder for the migrations exist, dependent on the migration
      // config settings.
      _ensureFolder() {
        const dirs = this._absoluteConfigDirs();
        const promises = dirs.map(ensureDirectoryExists);
        return Promise.all(promises);
      }
      _getStubPath() {
        return this.config.stub || path.join(__dirname, "stub", this.config.extension + ".stub");
      }
      _getNewMigrationName(name) {
        if (name[0] === "-") name = name.slice(1);
        return yyyymmddhhmmss() + "_" + name + "." + this.config.extension.split("-")[0];
      }
      _getNewMigrationPath(name) {
        const fileName = this._getNewMigrationName(name);
        const dirs = this._absoluteConfigDirs();
        const dir = dirs.slice(-1)[0];
        return path.join(dir, fileName);
      }
      // Write a new migration to disk, using the config and generated filename,
      // passing any `variables` given in the config to the template.
      async _writeNewMigration(name) {
        const migrationPath = this._getNewMigrationPath(name);
        await writeJsFileUsingTemplate(
          migrationPath,
          this._getStubPath(),
          { variable: "d" },
          this.config.variables || {}
        );
        return migrationPath;
      }
      _absoluteConfigDirs() {
        const directories = Array.isArray(this.config.directory) ? this.config.directory : [this.config.directory];
        return directories.map((directory) => {
          if (!directory) {
            console.warn(
              "Failed to resolve config file, knex cannot determine where to generate migrations"
            );
          }
          return path.resolve(process.cwd(), directory);
        });
      }
    };
    module2.exports = MigrationGenerator;
  }
});

// node_modules/knex/lib/migrations/migrate/Migrator.js
var require_Migrator = __commonJS({
  "node_modules/knex/lib/migrations/migrate/Migrator.js"(exports2, module2) {
    "use strict";
    var differenceWith = require_differenceWith();
    var get = require_get();
    var isEmpty = require_isEmpty();
    var max = require_max();
    var {
      getLockTableName,
      getTable,
      getTableName
    } = require_table_resolver();
    var { getSchemaBuilder } = require_table_creator();
    var migrationListResolver = require_migration_list_resolver();
    var MigrationGenerator = require_MigrationGenerator();
    var { getMergedConfig } = require_migrator_configuration_merger();
    var { isBoolean, isFunction } = require_is();
    var LockError = class extends Error {
      constructor(msg) {
        super(msg);
        this.name = "MigrationLocked";
      }
    };
    var Migrator = class {
      constructor(knex2) {
        if (isFunction(knex2)) {
          if (!knex2.isTransaction) {
            this.knex = knex2.withUserParams({
              ...knex2.userParams
            });
          } else {
            this.knex = knex2;
          }
        } else {
          this.knex = Object.assign({}, knex2);
          this.knex.userParams = this.knex.userParams || {};
        }
        this.config = getMergedConfig(
          this.knex.client.config.migrations,
          void 0,
          this.knex.client.logger
        );
        this.generator = new MigrationGenerator(
          this.knex.client.config.migrations,
          this.knex.client.logger
        );
        this._activeMigration = {
          fileName: null
        };
      }
      // Migrators to the latest configuration.
      async latest(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        const allAndCompleted = await migrationListResolver.listAllAndCompleted(
          this.config,
          this.knex
        );
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, allAndCompleted);
        }
        const [all, completed] = allAndCompleted;
        const migrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );
        const transactionForAll = !this.config.disableTransactions && !(await Promise.all(
          migrations.map(async (migration) => {
            const migrationContents = await this.config.migrationSource.getMigration(migration);
            return !this._useTransaction(migrationContents);
          })
        )).some((isTransactionUsed) => isTransactionUsed);
        if (transactionForAll) {
          return this.knex.transaction((trx) => {
            return this._runBatch(migrations, "up", trx);
          });
        } else {
          return this._runBatch(migrations, "up");
        }
      }
      // Runs the next migration that has not yet been run
      async up(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        const allAndCompleted = await migrationListResolver.listAllAndCompleted(
          this.config,
          this.knex
        );
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, allAndCompleted);
        }
        const [all, completed] = allAndCompleted;
        const newMigrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );
        let migrationToRun;
        const name = this.config.name;
        if (name) {
          if (!completed.includes(name)) {
            migrationToRun = newMigrations.find((migration) => {
              return this.config.migrationSource.getMigrationName(migration) === name;
            });
            if (!migrationToRun) {
              throw new Error(`Migration "${name}" not found.`);
            }
          }
        } else {
          migrationToRun = newMigrations[0];
        }
        const useTransaction = !migrationToRun || this._useTransaction(
          await this.config.migrationSource.getMigration(migrationToRun)
        );
        const migrationsToRun = [];
        if (migrationToRun) {
          migrationsToRun.push(migrationToRun);
        }
        const transactionForAll = !this.config.disableTransactions && (!migrationToRun || useTransaction);
        if (transactionForAll) {
          return await this.knex.transaction((trx) => {
            return this._runBatch(migrationsToRun, "up", trx);
          });
        } else {
          return await this._runBatch(migrationsToRun, "up");
        }
      }
      // Rollback the last "batch", or all, of migrations that were run.
      rollback(config3, all = false) {
        this._disableProcessing();
        return new Promise((resolve, reject) => {
          try {
            this.config = getMergedConfig(
              config3,
              this.config,
              this.knex.client.logger
            );
          } catch (e) {
            reject(e);
          }
          migrationListResolver.listAllAndCompleted(this.config, this.knex).then((value) => {
            if (!this.config.disableMigrationsListValidation) {
              validateMigrationList(this.config.migrationSource, value);
            }
            return value;
          }).then((val) => {
            const [allMigrations, completedMigrations] = val;
            return all ? allMigrations.filter((migration) => {
              return completedMigrations.map((migration2) => migration2.name).includes(
                this.config.migrationSource.getMigrationName(migration)
              );
            }).reverse() : this._getLastBatch(val);
          }).then((migrations) => {
            return this._runBatch(migrations, "down");
          }).then(resolve, reject);
        });
      }
      down(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        return migrationListResolver.listAllAndCompleted(this.config, this.knex).then((value) => {
          if (!this.config.disableMigrationsListValidation) {
            validateMigrationList(this.config.migrationSource, value);
          }
          return value;
        }).then(([all, completed]) => {
          const completedMigrations = all.filter((migration) => {
            return completed.map((migration2) => migration2.name).includes(this.config.migrationSource.getMigrationName(migration));
          });
          let migrationToRun;
          const name = this.config.name;
          if (name) {
            migrationToRun = completedMigrations.find((migration) => {
              return this.config.migrationSource.getMigrationName(migration) === name;
            });
            if (!migrationToRun) {
              throw new Error(`Migration "${name}" was not run.`);
            }
          } else {
            migrationToRun = completedMigrations[completedMigrations.length - 1];
          }
          const migrationsToRun = [];
          if (migrationToRun) {
            migrationsToRun.push(migrationToRun);
          }
          return this._runBatch(migrationsToRun, "down");
        });
      }
      status(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        return Promise.all([
          getTable(this.knex, this.config.tableName, this.config.schemaName).select(
            "*"
          ),
          migrationListResolver.listAll(this.config.migrationSource)
        ]).then(([db, code]) => db.length - code.length);
      }
      // Retrieves and returns the current migration version we're on, as a promise.
      // If no migrations have been run yet, return "none".
      currentVersion(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        return migrationListResolver.listCompleted(this.config.tableName, this.config.schemaName, this.knex).then((completed) => {
          const val = max(completed.map((value) => value.name.split("_")[0]));
          return val === void 0 ? "none" : val;
        });
      }
      // list all migrations
      async list(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        const [all, completed] = await migrationListResolver.listAllAndCompleted(
          this.config,
          this.knex
        );
        if (!this.config.disableMigrationsListValidation) {
          validateMigrationList(this.config.migrationSource, [all, completed]);
        }
        const newMigrations = getNewMigrations(
          this.config.migrationSource,
          all,
          completed
        );
        return [completed, newMigrations];
      }
      async forceFreeMigrationsLock(config3) {
        this._disableProcessing();
        this.config = getMergedConfig(config3, this.config, this.knex.client.logger);
        const { schemaName, tableName } = this.config;
        const lockTableName = getLockTableName(tableName);
        const { knex: knex2 } = this;
        const getLockTable = () => getTable(knex2, lockTableName, schemaName);
        const tableExists = await getSchemaBuilder(knex2, schemaName).hasTable(
          lockTableName
        );
        if (tableExists) {
          await getLockTable().del();
          await getLockTable().insert({
            is_locked: 0
          });
        }
      }
      // Creates a new migration, with a given name.
      make(name, config3) {
        return this.generator.make(name, config3, this.knex.client.logger);
      }
      _disableProcessing() {
        if (this.knex.disableProcessing) {
          this.knex.disableProcessing();
        }
      }
      _lockMigrations(trx) {
        const tableName = getLockTableName(this.config.tableName);
        return getTable(this.knex, tableName, this.config.schemaName).transacting(trx).where("is_locked", "=", 0).update({ is_locked: 1 }).then((rowCount) => {
          if (rowCount !== 1) {
            throw new Error("Migration table is already locked");
          }
        });
      }
      _getLock(trx) {
        const transact = trx ? (fn) => fn(trx) : (fn) => this.knex.transaction(fn);
        return transact((trx2) => {
          return this._lockMigrations(trx2);
        }).catch((err) => {
          throw new LockError(err.message);
        });
      }
      _freeLock(trx = this.knex) {
        const tableName = getLockTableName(this.config.tableName);
        return getTable(trx, tableName, this.config.schemaName).update({
          is_locked: 0
        });
      }
      // Run a batch of current migrations, in sequence.
      async _runBatch(migrations, direction, trx) {
        const canGetLockInTransaction = this.knex.client.driverName !== "cockroachdb";
        try {
          await this._getLock(canGetLockInTransaction ? trx : void 0);
          const completed = trx ? await migrationListResolver.listCompleted(
            this.config.tableName,
            this.config.schemaName,
            trx
          ) : [];
          migrations = getNewMigrations(
            this.config.migrationSource,
            migrations,
            completed
          );
          await Promise.all(
            migrations.map(this._validateMigrationStructure.bind(this))
          );
          let batchNo = await this._latestBatchNumber(trx);
          if (direction === "up") batchNo++;
          const res = await this._waterfallBatch(
            batchNo,
            migrations,
            direction,
            trx
          );
          await this._freeLock(canGetLockInTransaction ? trx : void 0);
          return res;
        } catch (error) {
          let cleanupReady = Promise.resolve();
          if (error instanceof LockError) {
            this.knex.client.logger.warn(
              `Can't take lock to run migrations: ${error.message}`
            );
            this.knex.client.logger.warn(
              "If you are sure migrations are not running you can release the lock manually by running 'knex migrate:unlock'"
            );
          } else {
            if (this._activeMigration.fileName) {
              this.knex.client.logger.warn(
                `migration file "${this._activeMigration.fileName}" failed`
              );
            }
            this.knex.client.logger.warn(
              `migration failed with error: ${error.message}`
            );
            cleanupReady = this._freeLock(
              canGetLockInTransaction ? trx : void 0
            );
          }
          try {
            await cleanupReady;
          } catch (e) {
          }
          throw error;
        }
      }
      // Validates some migrations by requiring and checking for an `up` and `down`
      // function.
      async _validateMigrationStructure(migration) {
        const migrationName = this.config.migrationSource.getMigrationName(migration);
        const migrationContent = await this.config.migrationSource.getMigration(
          migration
        );
        if (typeof migrationContent.up !== "function" || typeof migrationContent.down !== "function") {
          throw new Error(
            `Invalid migration: ${migrationName} must have both an up and down function`
          );
        }
        return migration;
      }
      // Get the last batch of migrations, by name, ordered by insert id in reverse
      // order.
      async _getLastBatch([allMigrations]) {
        const { tableName, schemaName } = this.config;
        const migrationNames = await getTable(this.knex, tableName, schemaName).where("batch", function(qb) {
          qb.max("batch").from(getTableName(tableName, schemaName));
        }).orderBy("id", "desc");
        const lastBatchMigrations = migrationNames.map((migration) => {
          return allMigrations.find((entry) => {
            return this.config.migrationSource.getMigrationName(entry) === migration.name;
          });
        });
        return Promise.all(lastBatchMigrations);
      }
      // Returns the latest batch number.
      _latestBatchNumber(trx = this.knex) {
        return trx.from(getTableName(this.config.tableName, this.config.schemaName)).max("batch as max_batch").then((obj) => obj[0].max_batch || 0);
      }
      // If transaction config for a single migration is defined, use that.
      // Otherwise, rely on the common config. This allows enabling/disabling
      // transaction for a single migration at will, regardless of the common
      // config.
      _useTransaction(migrationContent, allTransactionsDisabled) {
        const singleTransactionValue = get(migrationContent, "config.transaction");
        return isBoolean(singleTransactionValue) ? singleTransactionValue : !allTransactionsDisabled;
      }
      // Runs a batch of `migrations` in a specified `direction`, saving the
      // appropriate database information as the migrations are run.
      _waterfallBatch(batchNo, migrations, direction, trx) {
        const trxOrKnex = trx || this.knex;
        const { tableName, schemaName, disableTransactions } = this.config;
        let current = Promise.resolve();
        const log = [];
        migrations.forEach((migration) => {
          const name = this.config.migrationSource.getMigrationName(migration);
          this._activeMigration.fileName = name;
          const migrationContent = this.config.migrationSource.getMigration(migration);
          current = current.then(async () => await migrationContent).then((migrationContent2) => {
            this._activeMigration.fileName = name;
            if (!trx && this._useTransaction(migrationContent2, disableTransactions)) {
              this.knex.enableProcessing();
              return this._transaction(
                this.knex,
                migrationContent2,
                direction,
                name
              );
            }
            trxOrKnex.enableProcessing();
            return checkPromise(
              this.knex.client.logger,
              migrationContent2[direction](trxOrKnex),
              name
            );
          }).then(() => {
            trxOrKnex.disableProcessing();
            this.knex.disableProcessing();
            log.push(name);
            if (direction === "up") {
              return trxOrKnex.into(getTableName(tableName, schemaName)).insert({
                name,
                batch: batchNo,
                migration_time: /* @__PURE__ */ new Date()
              });
            }
            if (direction === "down") {
              return trxOrKnex.from(getTableName(tableName, schemaName)).where({ name }).del();
            }
          });
        });
        return current.then(() => [batchNo, log]);
      }
      _transaction(knex2, migrationContent, direction, name) {
        return knex2.transaction((trx) => {
          return checkPromise(
            knex2.client.logger,
            migrationContent[direction](trx),
            name,
            () => {
              trx.commit();
            }
          );
        });
      }
    };
    function validateMigrationList(migrationSource, migrations) {
      const [all, completed] = migrations;
      const diff = getMissingMigrations(migrationSource, completed, all);
      if (!isEmpty(diff)) {
        const names = diff.map((d) => d.name);
        throw new Error(
          `The migration directory is corrupt, the following files are missing: ${names.join(
            ", "
          )}`
        );
      }
    }
    function getMissingMigrations(migrationSource, completed, all) {
      return differenceWith(completed, all, (c, a) => {
        return c.name === migrationSource.getMigrationName(a);
      });
    }
    function getNewMigrations(migrationSource, all, completed) {
      return differenceWith(all, completed, (a, c) => {
        return c.name === migrationSource.getMigrationName(a);
      });
    }
    function checkPromise(logger, migrationPromise, name, commitFn) {
      if (!migrationPromise || typeof migrationPromise.then !== "function") {
        logger.warn(`migration ${name} did not return a promise`);
        if (commitFn) {
          commitFn();
        }
      }
      return migrationPromise;
    }
    module2.exports = {
      Migrator
    };
  }
});

// node_modules/lodash/isString.js
var require_isString = __commonJS({
  "node_modules/lodash/isString.js"(exports2, module2) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isArray = require_isArray();
    var isObjectLike = require_isObjectLike();
    var stringTag = "[object String]";
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
    }
    module2.exports = isString;
  }
});

// node_modules/lodash/_trimmedEndIndex.js
var require_trimmedEndIndex = __commonJS({
  "node_modules/lodash/_trimmedEndIndex.js"(exports2, module2) {
    "use strict";
    var reWhitespace = /\s/;
    function trimmedEndIndex(string) {
      var index = string.length;
      while (index-- && reWhitespace.test(string.charAt(index))) {
      }
      return index;
    }
    module2.exports = trimmedEndIndex;
  }
});

// node_modules/lodash/_baseTrim.js
var require_baseTrim = __commonJS({
  "node_modules/lodash/_baseTrim.js"(exports2, module2) {
    "use strict";
    var trimmedEndIndex = require_trimmedEndIndex();
    var reTrimStart = /^\s+/;
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
    }
    module2.exports = baseTrim;
  }
});

// node_modules/lodash/toNumber.js
var require_toNumber = __commonJS({
  "node_modules/lodash/toNumber.js"(exports2, module2) {
    "use strict";
    var baseTrim = require_baseTrim();
    var isObject = require_isObject();
    var isSymbol = require_isSymbol();
    var NAN = 0 / 0;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = toNumber;
  }
});

// node_modules/lodash/toFinite.js
var require_toFinite = __commonJS({
  "node_modules/lodash/toFinite.js"(exports2, module2) {
    "use strict";
    var toNumber = require_toNumber();
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    module2.exports = toFinite;
  }
});

// node_modules/lodash/toInteger.js
var require_toInteger = __commonJS({
  "node_modules/lodash/toInteger.js"(exports2, module2) {
    "use strict";
    var toFinite = require_toFinite();
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    module2.exports = toInteger;
  }
});

// node_modules/lodash/values.js
var require_values = __commonJS({
  "node_modules/lodash/values.js"(exports2, module2) {
    "use strict";
    var baseValues = require_baseValues();
    var keys = require_keys();
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }
    module2.exports = values;
  }
});

// node_modules/lodash/includes.js
var require_includes = __commonJS({
  "node_modules/lodash/includes.js"(exports2, module2) {
    "use strict";
    var baseIndexOf = require_baseIndexOf();
    var isArrayLike = require_isArrayLike();
    var isString = require_isString();
    var toInteger = require_toInteger();
    var values = require_values();
    var nativeMax = Math.max;
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
    }
    module2.exports = includes;
  }
});

// node_modules/knex/lib/migrations/seed/sources/fs-seeds.js
var require_fs_seeds = __commonJS({
  "node_modules/knex/lib/migrations/seed/sources/fs-seeds.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var flatten = require_flatten();
    var includes = require_includes();
    var { AbstractMigrationsLoader } = require_MigrationsLoader();
    var { getFilepathsInFolder } = require_fs();
    var filterByLoadExtensions = (extensions) => (value) => {
      const extension = path.extname(value);
      return includes(extensions, extension);
    };
    var FsSeeds = class extends AbstractMigrationsLoader {
      _getConfigDirectories(logger) {
        const directories = this.migrationsPaths;
        return directories.map((directory) => {
          if (!directory) {
            logger.warn(
              "Empty value passed as a directory for Seeder, this is not supported."
            );
          }
          return path.resolve(process.cwd(), directory);
        });
      }
      async getSeeds(config3) {
        const { loadExtensions, recursive, specific } = config3;
        const seeds = flatten(
          await Promise.all(
            this._getConfigDirectories(config3.logger).map(
              (d) => getFilepathsInFolder(d, recursive)
            )
          )
        );
        let files = seeds.filter(filterByLoadExtensions(loadExtensions));
        if (!this.sortDirsSeparately) {
          files.sort();
        }
        if (specific) {
          files = files.filter((file) => path.basename(file) === specific);
          if (files.length === 0) {
            throw new Error(
              `Invalid argument provided: the specific seed "${specific}" does not exist.`
            );
          }
        }
        return files;
      }
      async getSeed(filepath) {
        const importFile = require_import_file();
        const seed = await importFile(filepath);
        return seed;
      }
    };
    module2.exports = {
      FsSeeds
    };
  }
});

// node_modules/knex/lib/migrations/seed/seeder-configuration-merger.js
var require_seeder_configuration_merger = __commonJS({
  "node_modules/knex/lib/migrations/seed/seeder-configuration-merger.js"(exports2, module2) {
    "use strict";
    var { FsSeeds } = require_fs_seeds();
    var Logger = require_logger();
    var { DEFAULT_LOAD_EXTENSIONS } = require_MigrationsLoader();
    var defaultLogger = new Logger();
    var CONFIG_DEFAULT = Object.freeze({
      extension: "js",
      directory: "./seeds",
      loadExtensions: DEFAULT_LOAD_EXTENSIONS,
      specific: null,
      timestampFilenamePrefix: false,
      recursive: false,
      sortDirsSeparately: false
    });
    function getMergedConfig(config3, currentConfig, logger = defaultLogger) {
      const mergedConfig = Object.assign(
        {},
        CONFIG_DEFAULT,
        currentConfig || {},
        config3,
        {
          logger
        }
      );
      if (config3 && // If user specifies any FS related config,
      // clear specified migrationSource to avoid ambiguity
      (config3.directory || config3.sortDirsSeparately !== void 0 || config3.loadExtensions)) {
        if (config3.seedSource) {
          logger.warn(
            "FS-related option specified for seed configuration. This resets seedSource to default FsMigrations"
          );
        }
        mergedConfig.seedSource = null;
      }
      if (!mergedConfig.seedSource) {
        mergedConfig.seedSource = new FsSeeds(
          mergedConfig.directory,
          mergedConfig.sortDirsSeparately,
          mergedConfig.loadExtensions
        );
      }
      return mergedConfig;
    }
    module2.exports = {
      getMergedConfig
    };
  }
});

// node_modules/knex/lib/migrations/seed/Seeder.js
var require_Seeder = __commonJS({
  "node_modules/knex/lib/migrations/seed/Seeder.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var { ensureDirectoryExists } = require_fs();
    var { writeJsFileUsingTemplate } = require_template2();
    var { yyyymmddhhmmss } = require_timestamp();
    var { getMergedConfig } = require_seeder_configuration_merger();
    var Seeder = class {
      constructor(knex2) {
        this.knex = knex2;
        this.config = this.resolveConfig(knex2.client.config.seeds);
      }
      // Runs seed files for the given environment.
      async run(config3) {
        this.config = this.resolveConfig(config3);
        const files = await this.config.seedSource.getSeeds(this.config);
        return this._runSeeds(files);
      }
      // Creates a new seed file, with a given name.
      async make(name, config3) {
        this.config = this.resolveConfig(config3);
        if (!name)
          throw new Error("A name must be specified for the generated seed");
        await this._ensureFolder(config3);
        const seedPath = await this._writeNewSeed(name);
        return seedPath;
      }
      // Ensures a folder for the seeds exist, dependent on the
      // seed config settings.
      _ensureFolder() {
        const dirs = this.config.seedSource._getConfigDirectories(
          this.config.logger
        );
        const promises = dirs.map(ensureDirectoryExists);
        return Promise.all(promises);
      }
      // Run seed files, in sequence.
      async _runSeeds(seeds) {
        for (const seed of seeds) {
          await this._validateSeedStructure(seed);
        }
        return this._waterfallBatch(seeds);
      }
      async _validateSeedStructure(filepath) {
        const seed = await this.config.seedSource.getSeed(filepath);
        if (typeof seed.seed !== "function") {
          throw new Error(
            `Invalid seed file: ${filepath} must have a seed function`
          );
        }
        return filepath;
      }
      _getStubPath() {
        return this.config.stub || path.join(__dirname, "stub", this.config.extension + ".stub");
      }
      _getNewStubFileName(name) {
        if (name[0] === "-") name = name.slice(1);
        if (this.config.timestampFilenamePrefix === true) {
          name = `${yyyymmddhhmmss()}_${name}`;
        }
        return `${name}.${this.config.extension}`;
      }
      _getNewStubFilePath(name) {
        const fileName = this._getNewStubFileName(name);
        const dirs = this.config.seedSource._getConfigDirectories(
          this.config.logger
        );
        const dir = dirs.slice(-1)[0];
        return path.join(dir, fileName);
      }
      // Write a new seed to disk, using the config and generated filename,
      // passing any `variables` given in the config to the template.
      async _writeNewSeed(name) {
        const seedPath = this._getNewStubFilePath(name);
        await writeJsFileUsingTemplate(
          seedPath,
          this._getStubPath(),
          { variable: "d" },
          this.config.variables || {}
        );
        return seedPath;
      }
      async _listAll(config3) {
        this.config = this.resolveConfig(config3);
        return this.config.seedSource.getSeeds(this.config);
      }
      // Runs a batch of seed files.
      async _waterfallBatch(seeds) {
        const { knex: knex2 } = this;
        const log = [];
        for (const seedPath of seeds) {
          const seed = await this.config.seedSource.getSeed(seedPath);
          try {
            await seed.seed(knex2);
            log.push(seedPath);
          } catch (originalError) {
            const error = new Error(
              `Error while executing "${seedPath}" seed: ${originalError.message}`
            );
            error.original = originalError;
            error.stack = error.stack.split("\n").slice(0, 2).join("\n") + "\n" + originalError.stack;
            throw error;
          }
        }
        return [log];
      }
      resolveConfig(config3) {
        return getMergedConfig(config3, this.config, this.knex.client.logger);
      }
    };
    module2.exports = Seeder;
  }
});

// node_modules/knex/lib/knex-builder/FunctionHelper.js
var require_FunctionHelper = __commonJS({
  "node_modules/knex/lib/knex-builder/FunctionHelper.js"(exports2, module2) {
    "use strict";
    var FunctionHelper = class {
      constructor(client) {
        this.client = client;
      }
      now(precision) {
        if (typeof precision === "number") {
          return this.client.raw(`CURRENT_TIMESTAMP(${precision})`);
        }
        return this.client.raw("CURRENT_TIMESTAMP");
      }
      uuid() {
        switch (this.client.driverName) {
          case "sqlite3":
          case "better-sqlite3":
            return this.client.raw(
              "(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"
            );
          case "mssql":
            return this.client.raw("(NEWID())");
          case "pg":
          case "pgnative":
          case "cockroachdb":
            return this.client.raw("(gen_random_uuid())");
          case "oracle":
          case "oracledb":
            return this.client.raw("(random_uuid())");
          case "mysql":
          case "mysql2":
            return this.client.raw("(UUID())");
          default:
            throw new Error(
              `${this.client.driverName} does not have a uuid function`
            );
        }
      }
      uuidToBin(uuid, ordered = true) {
        const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
        return ordered ? Buffer.concat([
          buf.slice(6, 8),
          buf.slice(4, 6),
          buf.slice(0, 4),
          buf.slice(8, 16)
        ]) : Buffer.concat([
          buf.slice(0, 4),
          buf.slice(4, 6),
          buf.slice(6, 8),
          buf.slice(8, 16)
        ]);
      }
      binToUuid(bin, ordered = true) {
        const buf = Buffer.from(bin, "hex");
        return ordered ? [
          buf.toString("hex", 4, 8),
          buf.toString("hex", 2, 4),
          buf.toString("hex", 0, 2),
          buf.toString("hex", 8, 10),
          buf.toString("hex", 10, 16)
        ].join("-") : [
          buf.toString("hex", 0, 4),
          buf.toString("hex", 4, 6),
          buf.toString("hex", 6, 8),
          buf.toString("hex", 8, 10),
          buf.toString("hex", 10, 16)
        ].join("-");
      }
    };
    module2.exports = FunctionHelper;
  }
});

// node_modules/knex/lib/query/method-constants.js
var require_method_constants = __commonJS({
  "node_modules/knex/lib/query/method-constants.js"(exports2, module2) {
    "use strict";
    module2.exports = [
      "with",
      "withRecursive",
      "withMaterialized",
      "withNotMaterialized",
      "select",
      "as",
      "columns",
      "column",
      "from",
      "fromJS",
      "fromRaw",
      "into",
      "withSchema",
      "table",
      "distinct",
      "join",
      "joinRaw",
      "innerJoin",
      "leftJoin",
      "leftOuterJoin",
      "rightJoin",
      "rightOuterJoin",
      "outerJoin",
      "fullOuterJoin",
      "crossJoin",
      "where",
      "andWhere",
      "orWhere",
      "whereNot",
      "orWhereNot",
      "whereLike",
      "andWhereLike",
      "orWhereLike",
      "whereILike",
      "andWhereILike",
      "orWhereILike",
      "whereRaw",
      "whereWrapped",
      "havingWrapped",
      "orWhereRaw",
      "whereExists",
      "orWhereExists",
      "whereNotExists",
      "orWhereNotExists",
      "whereIn",
      "orWhereIn",
      "whereNotIn",
      "orWhereNotIn",
      "whereNull",
      "orWhereNull",
      "whereNotNull",
      "orWhereNotNull",
      "whereBetween",
      "whereNotBetween",
      "andWhereBetween",
      "andWhereNotBetween",
      "orWhereBetween",
      "orWhereNotBetween",
      "groupBy",
      "groupByRaw",
      "orderBy",
      "orderByRaw",
      "union",
      "unionAll",
      "intersect",
      "except",
      "having",
      "havingRaw",
      "orHaving",
      "orHavingRaw",
      "offset",
      "limit",
      "count",
      "countDistinct",
      "min",
      "max",
      "sum",
      "sumDistinct",
      "avg",
      "avgDistinct",
      "increment",
      "decrement",
      "first",
      "debug",
      "pluck",
      "clearSelect",
      "clearWhere",
      "clearGroup",
      "clearOrder",
      "clearHaving",
      "insert",
      "update",
      "returning",
      "del",
      "delete",
      "truncate",
      "transacting",
      "connection",
      // JSON methods
      // Json manipulation functions
      "jsonExtract",
      "jsonSet",
      "jsonInsert",
      "jsonRemove",
      // Wheres Json
      "whereJsonObject",
      "orWhereJsonObject",
      "andWhereJsonObject",
      "whereNotJsonObject",
      "orWhereNotJsonObject",
      "andWhereNotJsonObject",
      "whereJsonPath",
      "orWhereJsonPath",
      "andWhereJsonPath",
      "whereJsonSupersetOf",
      "orWhereJsonSupersetOf",
      "andWhereJsonSupersetOf",
      "whereJsonNotSupersetOf",
      "orWhereJsonNotSupersetOf",
      "andWhereJsonNotSupersetOf",
      "whereJsonSubsetOf",
      "orWhereJsonSubsetOf",
      "andWhereJsonSubsetOf",
      "whereJsonNotSubsetOf",
      "orWhereJsonNotSubsetOf",
      "andWhereJsonNotSubsetOf"
    ];
  }
});

// node_modules/lodash/_assignMergeValue.js
var require_assignMergeValue = __commonJS({
  "node_modules/lodash/_assignMergeValue.js"(exports2, module2) {
    "use strict";
    var baseAssignValue = require_baseAssignValue();
    var eq = require_eq();
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    module2.exports = assignMergeValue;
  }
});

// node_modules/lodash/_safeGet.js
var require_safeGet = __commonJS({
  "node_modules/lodash/_safeGet.js"(exports2, module2) {
    "use strict";
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    module2.exports = safeGet;
  }
});

// node_modules/lodash/toPlainObject.js
var require_toPlainObject = __commonJS({
  "node_modules/lodash/toPlainObject.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var keysIn = require_keysIn();
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    module2.exports = toPlainObject;
  }
});

// node_modules/lodash/_baseMergeDeep.js
var require_baseMergeDeep = __commonJS({
  "node_modules/lodash/_baseMergeDeep.js"(exports2, module2) {
    "use strict";
    var assignMergeValue = require_assignMergeValue();
    var cloneBuffer = require_cloneBuffer();
    var cloneTypedArray = require_cloneTypedArray();
    var copyArray = require_copyArray();
    var initCloneObject = require_initCloneObject();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isArrayLikeObject = require_isArrayLikeObject();
    var isBuffer = require_isBuffer();
    var isFunction = require_isFunction();
    var isObject = require_isObject();
    var isPlainObject = require_isPlainObject();
    var isTypedArray = require_isTypedArray();
    var safeGet = require_safeGet();
    var toPlainObject = require_toPlainObject();
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    module2.exports = baseMergeDeep;
  }
});

// node_modules/lodash/_baseMerge.js
var require_baseMerge = __commonJS({
  "node_modules/lodash/_baseMerge.js"(exports2, module2) {
    "use strict";
    var Stack = require_Stack();
    var assignMergeValue = require_assignMergeValue();
    var baseFor = require_baseFor();
    var baseMergeDeep = require_baseMergeDeep();
    var isObject = require_isObject();
    var keysIn = require_keysIn();
    var safeGet = require_safeGet();
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack());
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    module2.exports = baseMerge;
  }
});

// node_modules/lodash/merge.js
var require_merge = __commonJS({
  "node_modules/lodash/merge.js"(exports2, module2) {
    "use strict";
    var baseMerge = require_baseMerge();
    var createAssigner = require_createAssigner();
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    module2.exports = merge;
  }
});

// node_modules/lodash/_baseSlice.js
var require_baseSlice = __commonJS({
  "node_modules/lodash/_baseSlice.js"(exports2, module2) {
    "use strict";
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    module2.exports = baseSlice;
  }
});

// node_modules/lodash/chunk.js
var require_chunk = __commonJS({
  "node_modules/lodash/chunk.js"(exports2, module2) {
    "use strict";
    var baseSlice = require_baseSlice();
    var isIterateeCall = require_isIterateeCall();
    var toInteger = require_toInteger();
    var nativeCeil = Math.ceil;
    var nativeMax = Math.max;
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size === void 0) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0, resIndex = 0, result = Array(nativeCeil(length / size));
      while (index < length) {
        result[resIndex++] = baseSlice(array, index, index += size);
      }
      return result;
    }
    module2.exports = chunk;
  }
});

// node_modules/knex/lib/execution/internal/delay.js
var require_delay = __commonJS({
  "node_modules/knex/lib/execution/internal/delay.js"(exports2, module2) {
    "use strict";
    module2.exports = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  }
});

// node_modules/knex/lib/execution/batch-insert.js
var require_batch_insert = __commonJS({
  "node_modules/knex/lib/execution/batch-insert.js"(exports2, module2) {
    "use strict";
    var chunk = require_chunk();
    var flatten = require_flatten();
    var delay = require_delay();
    var { isNumber } = require_is();
    function batchInsert(client, tableName, batch, chunkSize = 1e3) {
      let returning = void 0;
      let transaction = null;
      if (!isNumber(chunkSize) || chunkSize < 1) {
        throw new TypeError(`Invalid chunkSize: ${chunkSize}`);
      }
      if (!Array.isArray(batch)) {
        throw new TypeError(`Invalid batch: Expected array, got ${typeof batch}`);
      }
      const chunks = chunk(batch, chunkSize);
      const runInTransaction = (cb) => {
        if (transaction) {
          return cb(transaction);
        }
        return client.transaction(cb);
      };
      return Object.assign(
        Promise.resolve().then(async () => {
          await delay(1);
          return runInTransaction(async (tr) => {
            const chunksResults = [];
            for (const items of chunks) {
              chunksResults.push(await tr(tableName).insert(items, returning));
            }
            return flatten(chunksResults);
          });
        }),
        {
          returning(columns) {
            returning = columns;
            return this;
          },
          transacting(tr) {
            transaction = tr;
            return this;
          }
        }
      );
    }
    module2.exports = batchInsert;
  }
});

// node_modules/knex/lib/util/security.js
var require_security = __commonJS({
  "node_modules/knex/lib/util/security.js"(exports2, module2) {
    "use strict";
    function setHiddenProperty(target, source, propertyName = "password") {
      if (!source) {
        source = target;
      }
      Object.defineProperty(target, propertyName, {
        enumerable: false,
        value: source[propertyName]
      });
    }
    module2.exports = {
      setHiddenProperty
    };
  }
});

// node_modules/knex/lib/knex-builder/make-knex.js
var require_make_knex = __commonJS({
  "node_modules/knex/lib/knex-builder/make-knex.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("events");
    var { Migrator } = require_Migrator();
    var Seeder = require_Seeder();
    var FunctionHelper = require_FunctionHelper();
    var QueryInterface = require_method_constants();
    var merge = require_merge();
    var batchInsert = require_batch_insert();
    var { isObject } = require_is();
    var { setHiddenProperty } = require_security();
    var KNEX_PROPERTY_DEFINITIONS = {
      client: {
        get() {
          return this.context.client;
        },
        set(client) {
          this.context.client = client;
        },
        configurable: true
      },
      userParams: {
        get() {
          return this.context.userParams;
        },
        set(userParams) {
          this.context.userParams = userParams;
        },
        configurable: true
      },
      schema: {
        get() {
          return this.client.schemaBuilder();
        },
        configurable: true
      },
      migrate: {
        get() {
          return new Migrator(this);
        },
        configurable: true
      },
      seed: {
        get() {
          return new Seeder(this);
        },
        configurable: true
      },
      fn: {
        get() {
          return new FunctionHelper(this.client);
        },
        configurable: true
      }
    };
    var CONTEXT_METHODS = [
      "raw",
      "batchInsert",
      "transaction",
      "transactionProvider",
      "initialize",
      "destroy",
      "ref",
      "withUserParams",
      "queryBuilder",
      "disableProcessing",
      "enableProcessing"
    ];
    for (const m of CONTEXT_METHODS) {
      KNEX_PROPERTY_DEFINITIONS[m] = {
        value: function(...args) {
          return this.context[m](...args);
        },
        configurable: true
      };
    }
    function makeKnex(client) {
      function knex2(tableName, options) {
        return createQueryBuilder(knex2.context, tableName, options);
      }
      redefineProperties(knex2, client);
      return knex2;
    }
    function initContext(knexFn) {
      const knexContext = knexFn.context || {};
      Object.assign(knexContext, {
        queryBuilder() {
          return this.client.queryBuilder();
        },
        raw() {
          return this.client.raw.apply(this.client, arguments);
        },
        batchInsert(table, batch, chunkSize = 1e3) {
          return batchInsert(this, table, batch, chunkSize);
        },
        // Creates a new transaction.
        // If container is provided, returns a promise for when the transaction is resolved.
        // If container is not provided, returns a promise with a transaction that is resolved
        // when transaction is ready to be used.
        transaction(container, _config) {
          if (!_config && isObject(container)) {
            _config = container;
            container = null;
          }
          const config3 = Object.assign({}, _config);
          config3.userParams = this.userParams || {};
          if (config3.doNotRejectOnRollback === void 0) {
            config3.doNotRejectOnRollback = true;
          }
          return this._transaction(container, config3);
        },
        // Internal method that actually establishes the Transaction.  It makes no assumptions
        // about the `config` or `outerTx`, and expects the caller to handle these details.
        _transaction(container, config3, outerTx = null) {
          if (container) {
            const trx = this.client.transaction(container, config3, outerTx);
            return trx;
          } else {
            return new Promise((resolve, reject) => {
              this.client.transaction(resolve, config3, outerTx).catch(reject);
            });
          }
        },
        transactionProvider(config3) {
          let trx;
          return () => {
            if (!trx) {
              trx = this.transaction(void 0, config3);
            }
            return trx;
          };
        },
        // Typically never needed, initializes the pool for a knex client.
        initialize(config3) {
          return this.client.initializePool(config3);
        },
        // Convenience method for tearing down the pool.
        destroy(callback) {
          return this.client.destroy(callback);
        },
        ref(ref) {
          return this.client.ref(ref);
        },
        // Do not document this as public API until naming and API is improved for general consumption
        // This method exists to disable processing of internal queries in migrations
        disableProcessing() {
          if (this.userParams.isProcessingDisabled) {
            return;
          }
          this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
          this.userParams.postProcessResponse = this.client.config.postProcessResponse;
          this.client.config.wrapIdentifier = null;
          this.client.config.postProcessResponse = null;
          this.userParams.isProcessingDisabled = true;
        },
        // Do not document this as public API until naming and API is improved for general consumption
        // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
        enableProcessing() {
          if (!this.userParams.isProcessingDisabled) {
            return;
          }
          this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
          this.client.config.postProcessResponse = this.userParams.postProcessResponse;
          this.userParams.isProcessingDisabled = false;
        },
        withUserParams(params) {
          const knexClone = shallowCloneFunction(knexFn);
          if (this.client) {
            knexClone.client = Object.create(this.client.constructor.prototype);
            merge(knexClone.client, this.client);
            knexClone.client.config = Object.assign({}, this.client.config);
            if (this.client.config.password) {
              setHiddenProperty(knexClone.client.config, this.client.config);
            }
          }
          redefineProperties(knexClone, knexClone.client);
          _copyEventListeners("query", knexFn, knexClone);
          _copyEventListeners("query-error", knexFn, knexClone);
          _copyEventListeners("query-response", knexFn, knexClone);
          _copyEventListeners("start", knexFn, knexClone);
          knexClone.userParams = params;
          return knexClone;
        }
      });
      if (!knexFn.context) {
        knexFn.context = knexContext;
      }
    }
    function _copyEventListeners(eventName, sourceKnex, targetKnex) {
      const listeners = sourceKnex.listeners(eventName);
      listeners.forEach((listener) => {
        targetKnex.on(eventName, listener);
      });
    }
    function redefineProperties(knex2, client) {
      for (let i = 0; i < QueryInterface.length; i++) {
        const method = QueryInterface[i];
        knex2[method] = function() {
          const builder = this.queryBuilder();
          return builder[method].apply(builder, arguments);
        };
      }
      Object.defineProperties(knex2, KNEX_PROPERTY_DEFINITIONS);
      initContext(knex2);
      knex2.client = client;
      knex2.userParams = {};
      const ee = new EventEmitter();
      for (const key in ee) {
        knex2[key] = ee[key];
      }
      if (knex2._internalListeners) {
        knex2._internalListeners.forEach(({ eventName, listener }) => {
          knex2.client.removeListener(eventName, listener);
        });
      }
      knex2._internalListeners = [];
      _addInternalListener(knex2, "start", (obj) => {
        knex2.emit("start", obj);
      });
      _addInternalListener(knex2, "query", (obj) => {
        knex2.emit("query", obj);
      });
      _addInternalListener(knex2, "query-error", (err, obj) => {
        knex2.emit("query-error", err, obj);
      });
      _addInternalListener(knex2, "query-response", (response, obj, builder) => {
        knex2.emit("query-response", response, obj, builder);
      });
    }
    function _addInternalListener(knex2, eventName, listener) {
      knex2.client.on(eventName, listener);
      knex2._internalListeners.push({
        eventName,
        listener
      });
    }
    function createQueryBuilder(knexContext, tableName, options) {
      const qb = knexContext.queryBuilder();
      if (!tableName)
        knexContext.client.logger.warn(
          "calling knex without a tableName is deprecated. Use knex.queryBuilder() instead."
        );
      return tableName ? qb.table(tableName, options) : qb;
    }
    function shallowCloneFunction(originalFunction) {
      const fnContext = Object.create(
        Object.getPrototypeOf(originalFunction),
        Object.getOwnPropertyDescriptors(originalFunction)
      );
      const knexContext = {};
      const knexFnWrapper = (tableName, options) => {
        return createQueryBuilder(knexContext, tableName, options);
      };
      const clonedFunction = knexFnWrapper.bind(fnContext);
      Object.assign(clonedFunction, originalFunction);
      clonedFunction.context = knexContext;
      return clonedFunction;
    }
    module2.exports = makeKnex;
  }
});

// node_modules/knex/lib/util/noop.js
var require_noop = __commonJS({
  "node_modules/knex/lib/util/noop.js"(exports2, module2) {
    "use strict";
    module2.exports = function() {
    };
  }
});

// node_modules/knex/lib/util/finally-mixin.js
var require_finally_mixin = __commonJS({
  "node_modules/knex/lib/util/finally-mixin.js"(exports2, module2) {
    "use strict";
    var noop = require_noop();
    var finallyMixin = (prototype) => Object.assign(prototype, {
      finally(onFinally) {
        return this.then().finally(onFinally);
      }
    });
    module2.exports = Promise.prototype.finally ? finallyMixin : noop;
  }
});

// node_modules/knex/lib/execution/transaction.js
var require_transaction = __commonJS({
  "node_modules/knex/lib/execution/transaction.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("events");
    var Debug = require_src();
    var uniqueId = require_uniqueId();
    var { callbackify } = require("util");
    var makeKnex = require_make_knex();
    var { timeout, KnexTimeoutError } = require_timeout();
    var finallyMixin = require_finally_mixin();
    var debug = Debug("knex:tx");
    function DEFAULT_CONFIG() {
      return {
        userParams: {},
        doNotRejectOnRollback: true
      };
    }
    var validIsolationLevels = [
      // Doesn't really work in postgres, it treats it as read committed
      "read uncommitted",
      "read committed",
      "snapshot",
      // snapshot and repeatable read are basically the same, most "repeatable
      // read" implementations are actually "snapshot" also known as Multi Version
      // Concurrency Control (MVCC). Mssql's repeatable read doesn't stop
      // repeated reads for inserts as it uses a pessimistic locking system so
      // you should probably use 'snapshot' to stop read skew.
      "repeatable read",
      // mysql pretends to have serializable, but it is not
      "serializable"
    ];
    var Transaction = class extends EventEmitter {
      constructor(client, container, config3 = DEFAULT_CONFIG(), outerTx = null) {
        super();
        this.userParams = config3.userParams;
        this.doNotRejectOnRollback = config3.doNotRejectOnRollback;
        const txid = this.txid = uniqueId("trx");
        this.client = client;
        this.logger = client.logger;
        this.outerTx = outerTx;
        this.trxClient = void 0;
        this._completed = false;
        this._debug = client.config && client.config.debug;
        this.readOnly = config3.readOnly;
        if (config3.isolationLevel) {
          this.setIsolationLevel(config3.isolationLevel);
        }
        debug(
          "%s: Starting %s transaction",
          txid,
          outerTx ? "nested" : "top level"
        );
        this._lastChild = Promise.resolve();
        const _previousSibling = outerTx ? outerTx._lastChild : Promise.resolve();
        const basePromise = _previousSibling.then(
          () => this._evaluateContainer(config3, container)
        );
        this._promise = basePromise.then((x) => x);
        if (outerTx) {
          outerTx._lastChild = basePromise.catch(() => {
          });
        }
      }
      isCompleted() {
        return this._completed || this.outerTx && this.outerTx.isCompleted() || false;
      }
      begin(conn) {
        const trxMode = [
          this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : "",
          this.readOnly ? "READ ONLY" : ""
        ].join(" ").trim();
        if (trxMode.length === 0) {
          return this.query(conn, "BEGIN;");
        }
        return this.query(conn, `SET TRANSACTION ${trxMode};`).then(
          () => this.query(conn, "BEGIN;")
        );
      }
      savepoint(conn) {
        return this.query(conn, `SAVEPOINT ${this.txid};`);
      }
      commit(conn, value) {
        return this.query(conn, "COMMIT;", 1, value);
      }
      release(conn, value) {
        return this.query(conn, `RELEASE SAVEPOINT ${this.txid};`, 1, value);
      }
      setIsolationLevel(isolationLevel) {
        if (!validIsolationLevels.includes(isolationLevel)) {
          throw new Error(
            `Invalid isolationLevel, supported isolation levels are: ${JSON.stringify(
              validIsolationLevels
            )}`
          );
        }
        this.isolationLevel = isolationLevel;
        return this;
      }
      rollback(conn, error) {
        return timeout(this.query(conn, "ROLLBACK", 2, error), 5e3).catch(
          (err) => {
            if (!(err instanceof KnexTimeoutError)) {
              return Promise.reject(err);
            }
            this._rejecter(error);
          }
        );
      }
      rollbackTo(conn, error) {
        return timeout(
          this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, 2, error),
          5e3
        ).catch((err) => {
          if (!(err instanceof KnexTimeoutError)) {
            return Promise.reject(err);
          }
          this._rejecter(error);
        });
      }
      query(conn, sql, status, value) {
        const q = this.trxClient.query(conn, sql).catch((err) => {
          status = 2;
          value = err;
          this._completed = true;
          debug("%s error running transaction query", this.txid);
        }).then((res) => {
          if (status === 1) {
            this._resolver(value);
          }
          if (status === 2) {
            if (value === void 0) {
              if (this.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
                this._resolver();
                return;
              }
              value = new Error(`Transaction rejected with non-error: ${value}`);
            }
            this._rejecter(value);
          }
          return res;
        });
        if (status === 1 || status === 2) {
          this._completed = true;
        }
        return q;
      }
      debug(enabled) {
        this._debug = arguments.length ? enabled : true;
        return this;
      }
      async _evaluateContainer(config3, container) {
        return this.acquireConnection(config3, (connection) => {
          const trxClient = this.trxClient = makeTxClient(
            this,
            this.client,
            connection
          );
          const init = this.client.transacting ? this.savepoint(connection) : this.begin(connection);
          const executionPromise = new Promise((resolver, rejecter) => {
            this._resolver = resolver;
            this._rejecter = rejecter;
          });
          init.then(() => {
            return makeTransactor(this, connection, trxClient);
          }).then((transactor) => {
            this.transactor = transactor;
            if (this.outerTx) {
              transactor.parentTransaction = this.outerTx.transactor;
            }
            transactor.executionPromise = executionPromise;
            let result;
            try {
              result = container(transactor);
            } catch (err) {
              result = Promise.reject(err);
            }
            if (result && result.then && typeof result.then === "function") {
              result.then((val) => {
                return transactor.commit(val);
              }).catch((err) => {
                return transactor.rollback(err);
              });
            }
            return null;
          }).catch((e) => {
            return this._rejecter(e);
          });
          return executionPromise;
        });
      }
      // Acquire a connection and create a disposer - either using the one passed
      // via config or getting one off the client. The disposer will be called once
      // the original promise is marked completed.
      async acquireConnection(config3, cb) {
        const configConnection = config3 && config3.connection;
        const connection = configConnection || await this.client.acquireConnection();
        try {
          connection.__knexTxId = this.txid;
          return await cb(connection);
        } finally {
          if (!configConnection) {
            debug("%s: releasing connection", this.txid);
            this.client.releaseConnection(connection);
          } else {
            debug("%s: not releasing external connection", this.txid);
          }
        }
      }
      then(onResolve, onReject) {
        return this._promise.then(onResolve, onReject);
      }
      catch(...args) {
        return this._promise.catch(...args);
      }
      asCallback(cb) {
        callbackify(() => this._promise)(cb);
        return this._promise;
      }
    };
    finallyMixin(Transaction.prototype);
    function makeTransactor(trx, connection, trxClient) {
      const transactor = makeKnex(trxClient);
      transactor.context.withUserParams = () => {
        throw new Error(
          "Cannot set user params on a transaction - it can only inherit params from main knex instance"
        );
      };
      transactor.isTransaction = true;
      transactor.userParams = trx.userParams || {};
      transactor.context.transaction = function(container, options) {
        if (!options) {
          options = { doNotRejectOnRollback: true };
        } else if (options.doNotRejectOnRollback === void 0) {
          options.doNotRejectOnRollback = true;
        }
        return this._transaction(container, options, trx);
      };
      transactor.savepoint = function(container, options) {
        return transactor.transaction(container, options);
      };
      if (trx.client.transacting) {
        transactor.commit = (value) => trx.release(connection, value);
        transactor.rollback = (error) => trx.rollbackTo(connection, error);
      } else {
        transactor.commit = (value) => trx.commit(connection, value);
        transactor.rollback = (error) => trx.rollback(connection, error);
      }
      transactor.isCompleted = () => trx.isCompleted();
      return transactor;
    }
    function makeTxClient(trx, client, connection) {
      const trxClient = Object.create(client.constructor.prototype);
      trxClient.version = client.version;
      trxClient.config = client.config;
      trxClient.driver = client.driver;
      trxClient.connectionSettings = client.connectionSettings;
      trxClient.transacting = true;
      trxClient.valueForUndefined = client.valueForUndefined;
      trxClient.logger = client.logger;
      trxClient.on("start", function(arg) {
        trx.emit("start", arg);
        client.emit("start", arg);
      });
      trxClient.on("query", function(arg) {
        trx.emit("query", arg);
        client.emit("query", arg);
      });
      trxClient.on("query-error", function(err, obj) {
        trx.emit("query-error", err, obj);
        client.emit("query-error", err, obj);
      });
      trxClient.on("query-response", function(response, obj, builder) {
        trx.emit("query-response", response, obj, builder);
        client.emit("query-response", response, obj, builder);
      });
      const _query = trxClient.query;
      trxClient.query = function(conn, obj) {
        const completed = trx.isCompleted();
        return new Promise(function(resolve, reject) {
          try {
            if (conn !== connection)
              throw new Error("Invalid connection for transaction query.");
            if (completed) completedError(trx, obj);
            resolve(_query.call(trxClient, conn, obj));
          } catch (e) {
            reject(e);
          }
        });
      };
      const _stream = trxClient.stream;
      trxClient.stream = function(conn, obj, stream, options) {
        const completed = trx.isCompleted();
        return new Promise(function(resolve, reject) {
          try {
            if (conn !== connection)
              throw new Error("Invalid connection for transaction query.");
            if (completed) completedError(trx, obj);
            resolve(_stream.call(trxClient, conn, obj, stream, options));
          } catch (e) {
            reject(e);
          }
        });
      };
      trxClient.acquireConnection = function() {
        return Promise.resolve(connection);
      };
      trxClient.releaseConnection = function() {
        return Promise.resolve();
      };
      return trxClient;
    }
    function completedError(trx, obj) {
      const sql = typeof obj === "string" ? obj : obj && obj.sql;
      debug("%s: Transaction completed: %s", trx.txid, sql);
      throw new Error(
        "Transaction query already complete, run with DEBUG=knex:tx for more info"
      );
    }
    module2.exports = Transaction;
  }
});

// node_modules/knex/lib/execution/internal/query-executioner.js
var require_query_executioner = __commonJS({
  "node_modules/knex/lib/execution/internal/query-executioner.js"(exports2, module2) {
    "use strict";
    var _debugQuery = require_src()("knex:query");
    var debugBindings = require_src()("knex:bindings");
    var debugQuery = (sql, txId) => _debugQuery(sql.replace(/%/g, "%%"), txId);
    var { isString } = require_is();
    function formatQuery(sql, bindings, timeZone, client) {
      bindings = bindings == null ? [] : [].concat(bindings);
      let index = 0;
      return sql.replace(/\\?\?/g, (match) => {
        if (match === "\\?") {
          return "?";
        }
        if (index === bindings.length) {
          return match;
        }
        const value = bindings[index++];
        return client._escapeBinding(value, { timeZone });
      });
    }
    function enrichQueryObject(connection, queryParam, client) {
      const queryObject = isString(queryParam) ? { sql: queryParam } : queryParam;
      queryObject.bindings = client.prepBindings(queryObject.bindings);
      queryObject.sql = client.positionBindings(queryObject.sql);
      const { __knexUid, __knexTxId } = connection;
      client.emit("query", Object.assign({ __knexUid, __knexTxId }, queryObject));
      debugQuery(queryObject.sql, __knexTxId);
      debugBindings(queryObject.bindings, __knexTxId);
      return queryObject;
    }
    function executeQuery(connection, queryObject, client) {
      return client._query(connection, queryObject).catch((err) => {
        if (client.config && client.config.compileSqlOnError === false) {
          err.message = queryObject.sql + " - " + err.message;
        } else {
          err.message = formatQuery(queryObject.sql, queryObject.bindings, void 0, client) + " - " + err.message;
        }
        client.emit(
          "query-error",
          err,
          Object.assign(
            { __knexUid: connection.__knexUid, __knexTxId: connection.__knexUid },
            queryObject
          )
        );
        throw err;
      });
    }
    module2.exports = {
      enrichQueryObject,
      executeQuery,
      formatQuery
    };
  }
});

// node_modules/lodash/assign.js
var require_assign = __commonJS({
  "node_modules/lodash/assign.js"(exports2, module2) {
    "use strict";
    var assignValue = require_assignValue();
    var copyObject = require_copyObject();
    var createAssigner = require_createAssigner();
    var isArrayLike = require_isArrayLike();
    var isPrototype = require_isPrototype();
    var keys = require_keys();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });
    module2.exports = assign;
  }
});

// node_modules/lodash/clone.js
var require_clone = __commonJS({
  "node_modules/lodash/clone.js"(exports2, module2) {
    "use strict";
    var baseClone = require_baseClone();
    var CLONE_SYMBOLS_FLAG = 4;
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }
    module2.exports = clone;
  }
});

// node_modules/lodash/_castFunction.js
var require_castFunction = __commonJS({
  "node_modules/lodash/_castFunction.js"(exports2, module2) {
    "use strict";
    var identity = require_identity();
    function castFunction(value) {
      return typeof value == "function" ? value : identity;
    }
    module2.exports = castFunction;
  }
});

// node_modules/lodash/forEach.js
var require_forEach = __commonJS({
  "node_modules/lodash/forEach.js"(exports2, module2) {
    "use strict";
    var arrayEach = require_arrayEach();
    var baseEach = require_baseEach();
    var castFunction = require_castFunction();
    var isArray = require_isArray();
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, castFunction(iteratee));
    }
    module2.exports = forEach;
  }
});

// node_modules/lodash/each.js
var require_each = __commonJS({
  "node_modules/lodash/each.js"(exports2, module2) {
    "use strict";
    module2.exports = require_forEach();
  }
});

// node_modules/lodash/_baseFilter.js
var require_baseFilter = __commonJS({
  "node_modules/lodash/_baseFilter.js"(exports2, module2) {
    "use strict";
    var baseEach = require_baseEach();
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection2) {
        if (predicate(value, index, collection2)) {
          result.push(value);
        }
      });
      return result;
    }
    module2.exports = baseFilter;
  }
});

// node_modules/lodash/negate.js
var require_negate = __commonJS({
  "node_modules/lodash/negate.js"(exports2, module2) {
    "use strict";
    var FUNC_ERROR_TEXT = "Expected a function";
    function negate(predicate) {
      if (typeof predicate != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0:
            return !predicate.call(this);
          case 1:
            return !predicate.call(this, args[0]);
          case 2:
            return !predicate.call(this, args[0], args[1]);
          case 3:
            return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }
    module2.exports = negate;
  }
});

// node_modules/lodash/reject.js
var require_reject = __commonJS({
  "node_modules/lodash/reject.js"(exports2, module2) {
    "use strict";
    var arrayFilter = require_arrayFilter();
    var baseFilter = require_baseFilter();
    var baseIteratee = require_baseIteratee();
    var isArray = require_isArray();
    var negate = require_negate();
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(baseIteratee(predicate, 3)));
    }
    module2.exports = reject;
  }
});

// node_modules/lodash/tail.js
var require_tail = __commonJS({
  "node_modules/lodash/tail.js"(exports2, module2) {
    "use strict";
    var baseSlice = require_baseSlice();
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }
    module2.exports = tail;
  }
});

// node_modules/lodash/_iteratorToArray.js
var require_iteratorToArray = __commonJS({
  "node_modules/lodash/_iteratorToArray.js"(exports2, module2) {
    "use strict";
    function iteratorToArray(iterator) {
      var data, result = [];
      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }
    module2.exports = iteratorToArray;
  }
});

// node_modules/lodash/_asciiToArray.js
var require_asciiToArray = __commonJS({
  "node_modules/lodash/_asciiToArray.js"(exports2, module2) {
    "use strict";
    function asciiToArray(string) {
      return string.split("");
    }
    module2.exports = asciiToArray;
  }
});

// node_modules/lodash/_hasUnicode.js
var require_hasUnicode = __commonJS({
  "node_modules/lodash/_hasUnicode.js"(exports2, module2) {
    "use strict";
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsZWJ = "\\u200d";
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    module2.exports = hasUnicode;
  }
});

// node_modules/lodash/_unicodeToArray.js
var require_unicodeToArray = __commonJS({
  "node_modules/lodash/_unicodeToArray.js"(exports2, module2) {
    "use strict";
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsCombo = "[" + rsComboRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    module2.exports = unicodeToArray;
  }
});

// node_modules/lodash/_stringToArray.js
var require_stringToArray = __commonJS({
  "node_modules/lodash/_stringToArray.js"(exports2, module2) {
    "use strict";
    var asciiToArray = require_asciiToArray();
    var hasUnicode = require_hasUnicode();
    var unicodeToArray = require_unicodeToArray();
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    module2.exports = stringToArray;
  }
});

// node_modules/lodash/toArray.js
var require_toArray = __commonJS({
  "node_modules/lodash/toArray.js"(exports2, module2) {
    "use strict";
    var Symbol2 = require_Symbol();
    var copyArray = require_copyArray();
    var getTag = require_getTag();
    var isArrayLike = require_isArrayLike();
    var isString = require_isString();
    var iteratorToArray = require_iteratorToArray();
    var mapToArray = require_mapToArray();
    var setToArray = require_setToArray();
    var stringToArray = require_stringToArray();
    var values = require_values();
    var mapTag = "[object Map]";
    var setTag = "[object Set]";
    var symIterator = Symbol2 ? Symbol2.iterator : void 0;
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
      return func(value);
    }
    module2.exports = toArray;
  }
});

// node_modules/knex/lib/constants.js
var require_constants = __commonJS({
  "node_modules/knex/lib/constants.js"(exports2, module2) {
    "use strict";
    var CLIENT_ALIASES = Object.freeze({
      pg: "postgres",
      postgresql: "postgres",
      sqlite: "sqlite3"
    });
    var SUPPORTED_CLIENTS = Object.freeze(
      [
        "mssql",
        "mysql",
        "mysql2",
        "oracledb",
        "postgres",
        "pgnative",
        "redshift",
        "sqlite3",
        "cockroachdb",
        "better-sqlite3"
      ].concat(Object.keys(CLIENT_ALIASES))
    );
    var DRIVER_NAMES = Object.freeze({
      MsSQL: "mssql",
      MySQL: "mysql",
      MySQL2: "mysql2",
      Oracle: "oracledb",
      PostgreSQL: "pg",
      PgNative: "pgnative",
      Redshift: "pg-redshift",
      SQLite: "sqlite3",
      CockroachDB: "cockroachdb",
      BetterSQLite3: "better-sqlite3"
    });
    var POOL_CONFIG_OPTIONS = Object.freeze([
      "maxWaitingClients",
      "testOnBorrow",
      "fifo",
      "priorityRange",
      "autostart",
      "evictionRunIntervalMillis",
      "numTestsPerRun",
      "softIdleTimeoutMillis",
      "Promise"
    ]);
    var COMMA_NO_PAREN_REGEX = /,[\s](?![^(]*\))/g;
    module2.exports = {
      CLIENT_ALIASES,
      SUPPORTED_CLIENTS,
      POOL_CONFIG_OPTIONS,
      COMMA_NO_PAREN_REGEX,
      DRIVER_NAMES
    };
  }
});

// node_modules/knex/lib/util/helpers.js
var require_helpers = __commonJS({
  "node_modules/knex/lib/util/helpers.js"(exports2, module2) {
    "use strict";
    var isPlainObject = require_isPlainObject();
    var isTypedArray = require_isTypedArray();
    var { CLIENT_ALIASES } = require_constants();
    var { isFunction } = require_is();
    function normalizeArr(...args) {
      if (Array.isArray(args[0])) {
        return args[0];
      }
      return args;
    }
    function containsUndefined(mixed) {
      let argContainsUndefined = false;
      if (isTypedArray(mixed)) return false;
      if (mixed && isFunction(mixed.toSQL)) {
        return argContainsUndefined;
      }
      if (Array.isArray(mixed)) {
        for (let i = 0; i < mixed.length; i++) {
          if (argContainsUndefined) break;
          argContainsUndefined = containsUndefined(mixed[i]);
        }
      } else if (isPlainObject(mixed)) {
        Object.keys(mixed).forEach((key) => {
          if (!argContainsUndefined) {
            argContainsUndefined = containsUndefined(mixed[key]);
          }
        });
      } else {
        argContainsUndefined = mixed === void 0;
      }
      return argContainsUndefined;
    }
    function getUndefinedIndices(mixed) {
      const indices = [];
      if (Array.isArray(mixed)) {
        mixed.forEach((item, index) => {
          if (containsUndefined(item)) {
            indices.push(index);
          }
        });
      } else if (isPlainObject(mixed)) {
        Object.keys(mixed).forEach((key) => {
          if (containsUndefined(mixed[key])) {
            indices.push(key);
          }
        });
      } else {
        indices.push(0);
      }
      return indices;
    }
    function addQueryContext(Target) {
      Target.prototype.queryContext = function(context) {
        if (context === void 0) {
          return this._queryContext;
        }
        this._queryContext = context;
        return this;
      };
    }
    function resolveClientNameWithAliases(clientName) {
      return CLIENT_ALIASES[clientName] || clientName;
    }
    function toNumber(val, fallback) {
      if (val === void 0 || val === null) return fallback;
      const number = parseInt(val, 10);
      return isNaN(number) ? fallback : number;
    }
    module2.exports = {
      addQueryContext,
      containsUndefined,
      getUndefinedIndices,
      normalizeArr,
      resolveClientNameWithAliases,
      toNumber
    };
  }
});

// node_modules/knex/lib/query/joinclause.js
var require_joinclause = __commonJS({
  "node_modules/knex/lib/query/joinclause.js"(exports2, module2) {
    "use strict";
    var assert = require("assert");
    function getClauseFromArguments(compilerType, bool, first, operator, second) {
      if (typeof first === "function") {
        return {
          type: "onWrapped",
          value: first,
          bool
        };
      }
      switch (arguments.length) {
        case 3:
          return { type: "onRaw", value: first, bool };
        case 4:
          return {
            type: compilerType,
            column: first,
            operator: "=",
            value: operator,
            bool
          };
        default:
          return {
            type: compilerType,
            column: first,
            operator,
            value: second,
            bool
          };
      }
    }
    var JoinClause = class {
      constructor(table, type, schema) {
        this.schema = schema;
        this.table = table;
        this.joinType = type;
        this.and = this;
        this.clauses = [];
      }
      get or() {
        return this._bool("or");
      }
      // Adds an "on" clause to the current join object.
      on(first) {
        if (typeof first === "object" && typeof first.toSQL !== "function") {
          const keys = Object.keys(first);
          let i = -1;
          const method = this._bool() === "or" ? "orOn" : "on";
          while (++i < keys.length) {
            this[method](keys[i], first[keys[i]]);
          }
          return this;
        }
        const data = getClauseFromArguments("onBasic", this._bool(), ...arguments);
        if (data) {
          this.clauses.push(data);
        }
        return this;
      }
      // Adds an "or on" clause to the current join object.
      orOn(first, operator, second) {
        return this._bool("or").on.apply(this, arguments);
      }
      onJsonPathEquals(columnFirst, jsonPathFirst, columnSecond, jsonPathSecond) {
        this.clauses.push({
          type: "onJsonPathEquals",
          columnFirst,
          jsonPathFirst,
          columnSecond,
          jsonPathSecond,
          bool: this._bool(),
          not: this._not()
        });
        return this;
      }
      orOnJsonPathEquals(columnFirst, jsonPathFirst, columnSecond, jsonPathSecond) {
        return this._bool("or").onJsonPathEquals.apply(this, arguments);
      }
      // Adds a "using" clause to the current join.
      using(column) {
        return this.clauses.push({ type: "onUsing", column, bool: this._bool() });
      }
      onVal(first) {
        if (typeof first === "object" && typeof first.toSQL !== "function") {
          const keys = Object.keys(first);
          let i = -1;
          const method = this._bool() === "or" ? "orOnVal" : "onVal";
          while (++i < keys.length) {
            this[method](keys[i], first[keys[i]]);
          }
          return this;
        }
        const data = getClauseFromArguments("onVal", this._bool(), ...arguments);
        if (data) {
          this.clauses.push(data);
        }
        return this;
      }
      andOnVal() {
        return this.onVal(...arguments);
      }
      orOnVal() {
        return this._bool("or").onVal(...arguments);
      }
      onBetween(column, values) {
        assert(
          Array.isArray(values),
          "The second argument to onBetween must be an array."
        );
        assert(
          values.length === 2,
          "You must specify 2 values for the onBetween clause"
        );
        this.clauses.push({
          type: "onBetween",
          column,
          value: values,
          bool: this._bool(),
          not: this._not()
        });
        return this;
      }
      onNotBetween(column, values) {
        return this._not(true).onBetween(column, values);
      }
      orOnBetween(column, values) {
        return this._bool("or").onBetween(column, values);
      }
      orOnNotBetween(column, values) {
        return this._bool("or")._not(true).onBetween(column, values);
      }
      onIn(column, values) {
        if (Array.isArray(values) && values.length === 0) return this.on(1, "=", 0);
        this.clauses.push({
          type: "onIn",
          column,
          value: values,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      onNotIn(column, values) {
        return this._not(true).onIn(column, values);
      }
      orOnIn(column, values) {
        return this._bool("or").onIn(column, values);
      }
      orOnNotIn(column, values) {
        return this._bool("or")._not(true).onIn(column, values);
      }
      onNull(column) {
        this.clauses.push({
          type: "onNull",
          column,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      orOnNull(callback) {
        return this._bool("or").onNull(callback);
      }
      onNotNull(callback) {
        return this._not(true).onNull(callback);
      }
      orOnNotNull(callback) {
        return this._not(true)._bool("or").onNull(callback);
      }
      onExists(callback) {
        this.clauses.push({
          type: "onExists",
          value: callback,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      orOnExists(callback) {
        return this._bool("or").onExists(callback);
      }
      onNotExists(callback) {
        return this._not(true).onExists(callback);
      }
      orOnNotExists(callback) {
        return this._not(true)._bool("or").onExists(callback);
      }
      // Explicitly set the type of join, useful within a function when creating a grouped join.
      type(type) {
        this.joinType = type;
        return this;
      }
      _bool(bool) {
        if (arguments.length === 1) {
          this._boolFlag = bool;
          return this;
        }
        const ret = this._boolFlag || "and";
        this._boolFlag = "and";
        return ret;
      }
      _not(val) {
        if (arguments.length === 1) {
          this._notFlag = val;
          return this;
        }
        const ret = this._notFlag;
        this._notFlag = false;
        return ret;
      }
    };
    Object.assign(JoinClause.prototype, {
      grouping: "join"
    });
    JoinClause.prototype.andOn = JoinClause.prototype.on;
    JoinClause.prototype.andOnIn = JoinClause.prototype.onIn;
    JoinClause.prototype.andOnNotIn = JoinClause.prototype.onNotIn;
    JoinClause.prototype.andOnNull = JoinClause.prototype.onNull;
    JoinClause.prototype.andOnNotNull = JoinClause.prototype.onNotNull;
    JoinClause.prototype.andOnExists = JoinClause.prototype.onExists;
    JoinClause.prototype.andOnNotExists = JoinClause.prototype.onNotExists;
    JoinClause.prototype.andOnBetween = JoinClause.prototype.onBetween;
    JoinClause.prototype.andOnNotBetween = JoinClause.prototype.onNotBetween;
    JoinClause.prototype.andOnJsonPathEquals = JoinClause.prototype.onJsonPathEquals;
    module2.exports = JoinClause;
  }
});

// node_modules/knex/lib/query/analytic.js
var require_analytic = __commonJS({
  "node_modules/knex/lib/query/analytic.js"(exports2, module2) {
    "use strict";
    var assert = require("assert");
    var Analytic = class {
      constructor(method, schema, alias, orderBy, partitions) {
        this.schema = schema;
        this.type = "analytic";
        this.method = method;
        this.order = orderBy || [];
        this.partitions = partitions || [];
        this.alias = alias;
        this.and = this;
        this.grouping = "columns";
      }
      partitionBy(column, direction) {
        assert(
          Array.isArray(column) || typeof column === "string",
          `The argument to an analytic partitionBy function must be either a string
            or an array of string.`
        );
        if (Array.isArray(column)) {
          this.partitions = this.partitions.concat(column);
        } else {
          this.partitions.push({ column, order: direction });
        }
        return this;
      }
      orderBy(column, direction) {
        assert(
          Array.isArray(column) || typeof column === "string",
          `The argument to an analytic orderBy function must be either a string
            or an array of string.`
        );
        if (Array.isArray(column)) {
          this.order = this.order.concat(column);
        } else {
          this.order.push({ column, order: direction });
        }
        return this;
      }
    };
    module2.exports = Analytic;
  }
});

// node_modules/knex/lib/util/save-async-stack.js
var require_save_async_stack = __commonJS({
  "node_modules/knex/lib/util/save-async-stack.js"(exports2, module2) {
    "use strict";
    module2.exports = function saveAsyncStack(instance, lines) {
      if (instance.client.config.asyncStackTraces) {
        instance._asyncStack = {
          error: new Error(),
          lines
        };
      }
    };
  }
});

// node_modules/knex/lib/query/constants.js
var require_constants2 = __commonJS({
  "node_modules/knex/lib/query/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      lockMode: {
        forShare: "forShare",
        forUpdate: "forUpdate",
        forNoKeyUpdate: "forNoKeyUpdate",
        forKeyShare: "forKeyShare"
      },
      waitMode: {
        skipLocked: "skipLocked",
        noWait: "noWait"
      }
    };
  }
});

// node_modules/knex/lib/builder-interface-augmenter.js
var require_builder_interface_augmenter = __commonJS({
  "node_modules/knex/lib/builder-interface-augmenter.js"(exports2, module2) {
    "use strict";
    var clone = require_clone();
    var isEmpty = require_isEmpty();
    var { callbackify } = require("util");
    var finallyMixin = require_finally_mixin();
    var { formatQuery } = require_query_executioner();
    function augmentWithBuilderInterface(Target) {
      Target.prototype.toQuery = function(tz) {
        let data = this.toSQL(this._method, tz);
        if (!Array.isArray(data)) data = [data];
        if (!data.length) {
          return "";
        }
        return data.map((statement) => {
          return formatQuery(statement.sql, statement.bindings, tz, this.client);
        }).reduce((a, c) => a.concat(a.endsWith(";") ? "\n" : ";\n", c));
      };
      Target.prototype.then = function() {
        let result = this.client.runner(this).run();
        if (this.client.config.asyncStackTraces) {
          result = result.catch((err) => {
            err.originalStack = err.stack;
            const firstLine = err.stack.split("\n")[0];
            const { error, lines } = this._asyncStack;
            const stackByLines = error.stack.split("\n");
            const asyncStack = stackByLines.slice(lines);
            asyncStack.unshift(firstLine);
            err.stack = asyncStack.join("\n");
            throw err;
          });
        }
        return result.then.apply(result, arguments);
      };
      Target.prototype.options = function(opts) {
        this._options = this._options || [];
        this._options.push(clone(opts) || {});
        return this;
      };
      Target.prototype.connection = function(connection) {
        this._connection = connection;
        this.client.processPassedConnection(connection);
        return this;
      };
      Target.prototype.debug = function(enabled) {
        this._debug = arguments.length ? enabled : true;
        return this;
      };
      Target.prototype.transacting = function(transaction) {
        if (transaction && transaction.client) {
          if (!transaction.client.transacting) {
            transaction.client.logger.warn(
              `Invalid transaction value: ${transaction.client}`
            );
          } else {
            this.client = transaction.client;
          }
        }
        if (isEmpty(transaction)) {
          this.client.logger.error(
            "Invalid value on transacting call, potential bug"
          );
          throw Error(
            "Invalid transacting value (null, undefined or empty object)"
          );
        }
        return this;
      };
      Target.prototype.stream = function(options) {
        return this.client.runner(this).stream(options);
      };
      Target.prototype.pipe = function(writable, options) {
        return this.client.runner(this).pipe(writable, options);
      };
      Target.prototype.asCallback = function(cb) {
        const promise = this.then();
        callbackify(() => promise)(cb);
        return promise;
      };
      Target.prototype.catch = function(onReject) {
        return this.then().catch(onReject);
      };
      Object.defineProperty(Target.prototype, Symbol.toStringTag, {
        get: () => "object"
      });
      finallyMixin(Target.prototype);
    }
    module2.exports = {
      augmentWithBuilderInterface
    };
  }
});

// node_modules/knex/lib/query/querybuilder.js
var require_querybuilder = __commonJS({
  "node_modules/knex/lib/query/querybuilder.js"(exports2, module2) {
    "use strict";
    var assert = require("assert");
    var { EventEmitter } = require("events");
    var assign = require_assign();
    var clone = require_clone();
    var each = require_each();
    var isEmpty = require_isEmpty();
    var isPlainObject = require_isPlainObject();
    var last = require_last();
    var reject = require_reject();
    var tail = require_tail();
    var toArray = require_toArray();
    var { addQueryContext, normalizeArr } = require_helpers();
    var JoinClause = require_joinclause();
    var Analytic = require_analytic();
    var saveAsyncStack = require_save_async_stack();
    var {
      isBoolean,
      isNumber,
      isObject,
      isString,
      isFunction
    } = require_is();
    var { lockMode, waitMode } = require_constants2();
    var {
      augmentWithBuilderInterface
    } = require_builder_interface_augmenter();
    var SELECT_COMMANDS = /* @__PURE__ */ new Set(["pluck", "first", "select"]);
    var CLEARABLE_STATEMENTS = /* @__PURE__ */ new Set([
      "with",
      "select",
      "columns",
      "hintComments",
      "where",
      "union",
      "join",
      "group",
      "order",
      "having",
      "limit",
      "offset",
      "counter",
      "counters"
    ]);
    var LOCK_MODES = /* @__PURE__ */ new Set([
      lockMode.forShare,
      lockMode.forUpdate,
      lockMode.forNoKeyUpdate,
      lockMode.forKeyShare
    ]);
    var Builder = class _Builder extends EventEmitter {
      constructor(client) {
        super();
        this.client = client;
        this.and = this;
        this._single = {};
        this._comments = [];
        this._statements = [];
        this._method = "select";
        if (client.config) {
          saveAsyncStack(this, 5);
          this._debug = client.config.debug;
        }
        this._joinFlag = "inner";
        this._boolFlag = "and";
        this._notFlag = false;
        this._asColumnFlag = false;
      }
      toString() {
        return this.toQuery();
      }
      // Convert the current query "toSQL"
      toSQL(method, tz) {
        return this.client.queryCompiler(this).toSQL(method || this._method, tz);
      }
      // Create a shallow clone of the current query builder.
      clone() {
        const cloned = new this.constructor(this.client);
        cloned._method = this._method;
        cloned._single = clone(this._single);
        cloned._comments = clone(this._comments);
        cloned._statements = clone(this._statements);
        cloned._debug = this._debug;
        if (this._options !== void 0) {
          cloned._options = clone(this._options);
        }
        if (this._queryContext !== void 0) {
          cloned._queryContext = clone(this._queryContext);
        }
        if (this._connection !== void 0) {
          cloned._connection = this._connection;
        }
        return cloned;
      }
      timeout(ms, { cancel } = {}) {
        if (isNumber(ms) && ms > 0) {
          this._timeout = ms;
          if (cancel) {
            this.client.assertCanCancelQuery();
            this._cancelOnTimeout = true;
          }
        }
        return this;
      }
      // With
      // ------
      isValidStatementArg(statement) {
        return typeof statement === "function" || statement instanceof _Builder || statement && statement.isRawInstance;
      }
      _validateWithArgs(alias, statementOrColumnList, nothingOrStatement, method) {
        const [query, columnList] = typeof nothingOrStatement === "undefined" ? [statementOrColumnList, void 0] : [nothingOrStatement, statementOrColumnList];
        if (typeof alias !== "string") {
          throw new Error(`${method}() first argument must be a string`);
        }
        if (this.isValidStatementArg(query) && typeof columnList === "undefined") {
          return;
        }
        const isNonEmptyNameList = Array.isArray(columnList) && columnList.length > 0 && columnList.every((it) => typeof it === "string");
        if (!isNonEmptyNameList) {
          throw new Error(
            `${method}() second argument must be a statement or non-empty column name list.`
          );
        }
        if (this.isValidStatementArg(query)) {
          return;
        }
        throw new Error(
          `${method}() third argument must be a function / QueryBuilder or a raw when its second argument is a column name list`
        );
      }
      with(alias, statementOrColumnList, nothingOrStatement) {
        this._validateWithArgs(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          "with"
        );
        return this.withWrapped(alias, statementOrColumnList, nothingOrStatement);
      }
      withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
        throw new Error("With materialized is not supported by this dialect");
      }
      withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
        throw new Error("With materialized is not supported by this dialect");
      }
      // Helper for compiling any advanced `with` queries.
      withWrapped(alias, statementOrColumnList, nothingOrStatement, materialized) {
        const [query, columnList] = typeof nothingOrStatement === "undefined" ? [statementOrColumnList, void 0] : [nothingOrStatement, statementOrColumnList];
        const statement = {
          grouping: "with",
          type: "withWrapped",
          alias,
          columnList,
          value: query
        };
        if (materialized !== void 0) {
          statement.materialized = materialized;
        }
        this._statements.push(statement);
        return this;
      }
      // With Recursive
      // ------
      withRecursive(alias, statementOrColumnList, nothingOrStatement) {
        this._validateWithArgs(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          "withRecursive"
        );
        return this.withRecursiveWrapped(
          alias,
          statementOrColumnList,
          nothingOrStatement
        );
      }
      // Helper for compiling any advanced `withRecursive` queries.
      withRecursiveWrapped(alias, statementOrColumnList, nothingOrStatement) {
        this.withWrapped(alias, statementOrColumnList, nothingOrStatement);
        this._statements[this._statements.length - 1].recursive = true;
        return this;
      }
      // Select
      // ------
      // Adds a column or columns to the list of "columns"
      // being selected on the query.
      columns(column) {
        if (!column && column !== 0) return this;
        this._statements.push({
          grouping: "columns",
          value: normalizeArr(...arguments)
        });
        return this;
      }
      // Adds a comment to the query
      comment(txt) {
        if (!isString(txt)) {
          throw new Error("Comment must be a string");
        }
        const forbiddenChars = ["/*", "*/", "?"];
        if (forbiddenChars.some((chars) => txt.includes(chars))) {
          throw new Error(`Cannot include ${forbiddenChars.join(", ")} in comment`);
        }
        this._comments.push({
          comment: txt
        });
        return this;
      }
      // Allow for a sub-select to be explicitly aliased as a column,
      // without needing to compile the query in a where.
      as(column) {
        this._single.as = column;
        return this;
      }
      // Adds a single hint or an array of hits to the list of "hintComments" on the query.
      hintComment(hints) {
        hints = Array.isArray(hints) ? hints : [hints];
        if (hints.some((hint) => !isString(hint))) {
          throw new Error("Hint comment must be a string");
        }
        if (hints.some((hint) => hint.includes("/*") || hint.includes("*/"))) {
          throw new Error('Hint comment cannot include "/*" or "*/"');
        }
        if (hints.some((hint) => hint.includes("?"))) {
          throw new Error('Hint comment cannot include "?"');
        }
        this._statements.push({
          grouping: "hintComments",
          value: hints
        });
        return this;
      }
      // Prepends the `schemaName` on `tableName` defined by `.table` and `.join`.
      withSchema(schemaName) {
        this._single.schema = schemaName;
        return this;
      }
      // Sets the `tableName` on the query.
      // Alias to "from" for select and "into" for insert statements
      // e.g. builder.insert({a: value}).into('tableName')
      // `options`: options object containing keys:
      //   - `only`: whether the query should use SQL's ONLY to not return
      //           inheriting table data. Defaults to false.
      table(tableName, options = {}) {
        this._single.table = tableName;
        this._single.only = options.only === true;
        return this;
      }
      // Adds a `distinct` clause to the query.
      distinct(...args) {
        this._statements.push({
          grouping: "columns",
          value: normalizeArr(...args),
          distinct: true
        });
        return this;
      }
      distinctOn(...args) {
        if (isEmpty(args)) {
          throw new Error("distinctOn requires at least on argument");
        }
        this._statements.push({
          grouping: "columns",
          value: normalizeArr(...args),
          distinctOn: true
        });
        return this;
      }
      // Adds a join clause to the query, allowing for advanced joins
      // with an anonymous function as the second argument.
      join(table, first, ...args) {
        let join;
        const schema = table instanceof _Builder || typeof table === "function" ? void 0 : this._single.schema;
        const joinType = this._joinType();
        if (typeof first === "function") {
          join = new JoinClause(table, joinType, schema);
          first.call(join, join);
        } else if (joinType === "raw") {
          join = new JoinClause(this.client.raw(table, first), "raw");
        } else {
          join = new JoinClause(table, joinType, schema);
          if (first) {
            join.on(first, ...args);
          }
        }
        this._statements.push(join);
        return this;
      }
      using(tables) {
        throw new Error(
          "'using' function is only available in PostgreSQL dialect with Delete statements."
        );
      }
      // JOIN blocks:
      innerJoin(...args) {
        return this._joinType("inner").join(...args);
      }
      leftJoin(...args) {
        return this._joinType("left").join(...args);
      }
      leftOuterJoin(...args) {
        return this._joinType("left outer").join(...args);
      }
      rightJoin(...args) {
        return this._joinType("right").join(...args);
      }
      rightOuterJoin(...args) {
        return this._joinType("right outer").join(...args);
      }
      outerJoin(...args) {
        return this._joinType("outer").join(...args);
      }
      fullOuterJoin(...args) {
        return this._joinType("full outer").join(...args);
      }
      crossJoin(...args) {
        return this._joinType("cross").join(...args);
      }
      joinRaw(...args) {
        return this._joinType("raw").join(...args);
      }
      // Where modifiers:
      get or() {
        return this._bool("or");
      }
      get not() {
        return this._not(true);
      }
      // The where function can be used in several ways:
      // The most basic is `where(key, value)`, which expands to
      // where key = value.
      where(column, operator, value) {
        const argsLength = arguments.length;
        if (column === false || column === true) {
          return this.where(1, "=", column ? 1 : 0);
        }
        if (typeof column === "function") {
          return this.whereWrapped(column);
        }
        if (isObject(column) && !column.isRawInstance)
          return this._objectWhere(column);
        if (column && column.isRawInstance && argsLength === 1)
          return this.whereRaw(column);
        if (argsLength === 2) {
          value = operator;
          operator = "=";
          if (value === null) {
            return this.whereNull(column);
          }
        }
        const checkOperator = `${operator}`.toLowerCase().trim();
        if (argsLength === 3) {
          if (checkOperator === "in" || checkOperator === "not in") {
            return this._not(checkOperator === "not in").whereIn(column, value);
          }
          if (checkOperator === "between" || checkOperator === "not between") {
            return this._not(checkOperator === "not between").whereBetween(
              column,
              value
            );
          }
        }
        if (value === null) {
          if (checkOperator === "is" || checkOperator === "is not") {
            return this._not(checkOperator === "is not").whereNull(column);
          }
        }
        this._statements.push({
          grouping: "where",
          type: "whereBasic",
          column,
          operator,
          value,
          not: this._not(),
          bool: this._bool(),
          asColumn: this._asColumnFlag
        });
        return this;
      }
      whereColumn(...args) {
        this._asColumnFlag = true;
        this.where(...args);
        this._asColumnFlag = false;
        return this;
      }
      // Adds an `or where` clause to the query.
      orWhere(column, ...args) {
        this._bool("or");
        const obj = column;
        if (isObject(obj) && !obj.isRawInstance) {
          return this.whereWrapped(function() {
            for (const key in obj) {
              this.andWhere(key, obj[key]);
            }
          });
        }
        return this.where(column, ...args);
      }
      orWhereColumn(column, ...args) {
        this._bool("or");
        const obj = column;
        if (isObject(obj) && !obj.isRawInstance) {
          return this.whereWrapped(function() {
            for (const key in obj) {
              this.andWhereColumn(key, "=", obj[key]);
            }
          });
        }
        return this.whereColumn(column, ...args);
      }
      // Adds an `not where` clause to the query.
      whereNot(column, ...args) {
        if (args.length >= 2) {
          if (args[0] === "in" || args[0] === "between") {
            this.client.logger.warn(
              'whereNot is not suitable for "in" and "between" type subqueries. You should use "not in" and "not between" instead.'
            );
          }
        }
        return this._not(true).where(column, ...args);
      }
      whereNotColumn(...args) {
        return this._not(true).whereColumn(...args);
      }
      // Adds an `or not where` clause to the query.
      orWhereNot(...args) {
        return this._bool("or").whereNot(...args);
      }
      orWhereNotColumn(...args) {
        return this._bool("or").whereNotColumn(...args);
      }
      // Processes an object literal provided in a "where" clause.
      _objectWhere(obj) {
        const boolVal = this._bool();
        const notVal = this._not() ? "Not" : "";
        for (const key in obj) {
          this[boolVal + "Where" + notVal](key, obj[key]);
        }
        return this;
      }
      // Adds a raw `where` clause to the query.
      whereRaw(sql, bindings) {
        const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
        this._statements.push({
          grouping: "where",
          type: "whereRaw",
          value: raw,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      orWhereRaw(sql, bindings) {
        return this._bool("or").whereRaw(sql, bindings);
      }
      // Helper for compiling any advanced `where` queries.
      whereWrapped(callback) {
        this._statements.push({
          grouping: "where",
          type: "whereWrapped",
          value: callback,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      // Adds a `where exists` clause to the query.
      whereExists(callback) {
        this._statements.push({
          grouping: "where",
          type: "whereExists",
          value: callback,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      // Adds an `or where exists` clause to the query.
      orWhereExists(callback) {
        return this._bool("or").whereExists(callback);
      }
      // Adds a `where not exists` clause to the query.
      whereNotExists(callback) {
        return this._not(true).whereExists(callback);
      }
      // Adds a `or where not exists` clause to the query.
      orWhereNotExists(callback) {
        return this._bool("or").whereNotExists(callback);
      }
      // Adds a `where in` clause to the query.
      whereIn(column, values) {
        if (Array.isArray(values) && isEmpty(values))
          return this.where(this._not());
        this._statements.push({
          grouping: "where",
          type: "whereIn",
          column,
          value: values,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      // Adds a `or where in` clause to the query.
      orWhereIn(column, values) {
        return this._bool("or").whereIn(column, values);
      }
      // Adds a `where not in` clause to the query.
      whereNotIn(column, values) {
        return this._not(true).whereIn(column, values);
      }
      // Adds a `or where not in` clause to the query.
      orWhereNotIn(column, values) {
        return this._bool("or")._not(true).whereIn(column, values);
      }
      // Adds a `where null` clause to the query.
      whereNull(column) {
        this._statements.push({
          grouping: "where",
          type: "whereNull",
          column,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      // Adds a `or where null` clause to the query.
      orWhereNull(column) {
        return this._bool("or").whereNull(column);
      }
      // Adds a `where not null` clause to the query.
      whereNotNull(column) {
        return this._not(true).whereNull(column);
      }
      // Adds a `or where not null` clause to the query.
      orWhereNotNull(column) {
        return this._bool("or").whereNotNull(column);
      }
      // Adds a `where between` clause to the query.
      whereBetween(column, values) {
        assert(
          Array.isArray(values),
          "The second argument to whereBetween must be an array."
        );
        assert(
          values.length === 2,
          "You must specify 2 values for the whereBetween clause"
        );
        this._statements.push({
          grouping: "where",
          type: "whereBetween",
          column,
          value: values,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      // Adds a `where not between` clause to the query.
      whereNotBetween(column, values) {
        return this._not(true).whereBetween(column, values);
      }
      // Adds a `or where between` clause to the query.
      orWhereBetween(column, values) {
        return this._bool("or").whereBetween(column, values);
      }
      // Adds a `or where not between` clause to the query.
      orWhereNotBetween(column, values) {
        return this._bool("or").whereNotBetween(column, values);
      }
      _whereLike(type, column, value) {
        this._statements.push({
          grouping: "where",
          type,
          column,
          value,
          not: this._not(),
          bool: this._bool(),
          asColumn: this._asColumnFlag
        });
        return this;
      }
      // Adds a `where like` clause to the query.
      whereLike(column, value) {
        return this._whereLike("whereLike", column, value);
      }
      // Adds a `or where like` clause to the query.
      orWhereLike(column, value) {
        return this._bool("or")._whereLike("whereLike", column, value);
      }
      // Adds a `where ilike` clause to the query.
      whereILike(column, value) {
        return this._whereLike("whereILike", column, value);
      }
      // Adds a `or where ilike` clause to the query.
      orWhereILike(column, value) {
        return this._bool("or")._whereLike("whereILike", column, value);
      }
      // Adds a `group by` clause to the query.
      groupBy(item) {
        if (item && item.isRawInstance) {
          return this.groupByRaw.apply(this, arguments);
        }
        this._statements.push({
          grouping: "group",
          type: "groupByBasic",
          value: normalizeArr(...arguments)
        });
        return this;
      }
      // Adds a raw `group by` clause to the query.
      groupByRaw(sql, bindings) {
        const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
        this._statements.push({
          grouping: "group",
          type: "groupByRaw",
          value: raw
        });
        return this;
      }
      // Adds a `order by` clause to the query.
      orderBy(column, direction, nulls = "") {
        if (Array.isArray(column)) {
          return this._orderByArray(column);
        }
        this._statements.push({
          grouping: "order",
          type: "orderByBasic",
          value: column,
          direction,
          nulls
        });
        return this;
      }
      // Adds a `order by` with multiple columns to the query.
      _orderByArray(columnDefs) {
        for (let i = 0; i < columnDefs.length; i++) {
          const columnInfo = columnDefs[i];
          if (isObject(columnInfo)) {
            this._statements.push({
              grouping: "order",
              type: "orderByBasic",
              value: columnInfo["column"],
              direction: columnInfo["order"],
              nulls: columnInfo["nulls"]
            });
          } else if (isString(columnInfo) || isNumber(columnInfo)) {
            this._statements.push({
              grouping: "order",
              type: "orderByBasic",
              value: columnInfo
            });
          }
        }
        return this;
      }
      // Add a raw `order by` clause to the query.
      orderByRaw(sql, bindings) {
        const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
        this._statements.push({
          grouping: "order",
          type: "orderByRaw",
          value: raw
        });
        return this;
      }
      _union(clause, args) {
        let callbacks = args[0];
        let wrap = args[1];
        if (args.length === 1 || args.length === 2 && isBoolean(wrap)) {
          if (!Array.isArray(callbacks)) {
            callbacks = [callbacks];
          }
          for (let i = 0, l = callbacks.length; i < l; i++) {
            this._statements.push({
              grouping: "union",
              clause,
              value: callbacks[i],
              wrap: wrap || false
            });
          }
        } else {
          callbacks = toArray(args).slice(0, args.length - 1);
          wrap = args[args.length - 1];
          if (!isBoolean(wrap)) {
            callbacks.push(wrap);
            wrap = false;
          }
          this._union(clause, [callbacks, wrap]);
        }
        return this;
      }
      // Add a union statement to the query.
      union(...args) {
        return this._union("union", args);
      }
      // Adds a union all statement to the query.
      unionAll(...args) {
        return this._union("union all", args);
      }
      intersect(...args) {
        return this._union("intersect", args);
      }
      except(...args) {
        return this._union("except", args);
      }
      // Adds a `having` clause to the query.
      having(column, operator, value) {
        if (column.isRawInstance && arguments.length === 1) {
          return this.havingRaw(column);
        }
        if (typeof column === "function") {
          return this.havingWrapped(column);
        }
        this._statements.push({
          grouping: "having",
          type: "havingBasic",
          column,
          operator,
          value,
          bool: this._bool(),
          not: this._not()
        });
        return this;
      }
      orHaving(column, ...args) {
        this._bool("or");
        const obj = column;
        if (isObject(obj) && !obj.isRawInstance) {
          return this.havingWrapped(function() {
            for (const key in obj) {
              this.andHaving(key, obj[key]);
            }
          });
        }
        return this.having(column, ...args);
      }
      // Helper for compiling any advanced `having` queries.
      havingWrapped(callback) {
        this._statements.push({
          grouping: "having",
          type: "havingWrapped",
          value: callback,
          bool: this._bool(),
          not: this._not()
        });
        return this;
      }
      havingNull(column) {
        this._statements.push({
          grouping: "having",
          type: "havingNull",
          column,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      orHavingNull(callback) {
        return this._bool("or").havingNull(callback);
      }
      havingNotNull(callback) {
        return this._not(true).havingNull(callback);
      }
      orHavingNotNull(callback) {
        return this._not(true)._bool("or").havingNull(callback);
      }
      havingExists(callback) {
        this._statements.push({
          grouping: "having",
          type: "havingExists",
          value: callback,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      orHavingExists(callback) {
        return this._bool("or").havingExists(callback);
      }
      havingNotExists(callback) {
        return this._not(true).havingExists(callback);
      }
      orHavingNotExists(callback) {
        return this._not(true)._bool("or").havingExists(callback);
      }
      havingBetween(column, values) {
        assert(
          Array.isArray(values),
          "The second argument to havingBetween must be an array."
        );
        assert(
          values.length === 2,
          "You must specify 2 values for the havingBetween clause"
        );
        this._statements.push({
          grouping: "having",
          type: "havingBetween",
          column,
          value: values,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      orHavingBetween(column, values) {
        return this._bool("or").havingBetween(column, values);
      }
      havingNotBetween(column, values) {
        return this._not(true).havingBetween(column, values);
      }
      orHavingNotBetween(column, values) {
        return this._not(true)._bool("or").havingBetween(column, values);
      }
      havingIn(column, values) {
        if (Array.isArray(values) && isEmpty(values))
          return this.where(this._not());
        this._statements.push({
          grouping: "having",
          type: "havingIn",
          column,
          value: values,
          not: this._not(),
          bool: this._bool()
        });
        return this;
      }
      // Adds a `or where in` clause to the query.
      orHavingIn(column, values) {
        return this._bool("or").havingIn(column, values);
      }
      // Adds a `where not in` clause to the query.
      havingNotIn(column, values) {
        return this._not(true).havingIn(column, values);
      }
      // Adds a `or where not in` clause to the query.
      orHavingNotIn(column, values) {
        return this._bool("or")._not(true).havingIn(column, values);
      }
      // Adds a raw `having` clause to the query.
      havingRaw(sql, bindings) {
        const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
        this._statements.push({
          grouping: "having",
          type: "havingRaw",
          value: raw,
          bool: this._bool(),
          not: this._not()
        });
        return this;
      }
      orHavingRaw(sql, bindings) {
        return this._bool("or").havingRaw(sql, bindings);
      }
      // set the skip binding parameter (= insert the raw value in the query) for an attribute.
      _setSkipBinding(attribute, options) {
        let skipBinding = options;
        if (isObject(options)) {
          skipBinding = options.skipBinding;
        }
        this._single.skipBinding = this._single.skipBinding || {};
        this._single.skipBinding[attribute] = skipBinding;
      }
      // Only allow a single "offset" to be set for the current query.
      offset(value, options) {
        if (value == null || value.isRawInstance || value instanceof _Builder) {
          this._single.offset = value;
        } else {
          const val = parseInt(value, 10);
          if (isNaN(val)) {
            this.client.logger.warn("A valid integer must be provided to offset");
          } else if (val < 0) {
            throw new Error(`A non-negative integer must be provided to offset.`);
          } else {
            this._single.offset = val;
          }
        }
        this._setSkipBinding("offset", options);
        return this;
      }
      // Only allow a single "limit" to be set for the current query.
      limit(value, options) {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
          this.client.logger.warn("A valid integer must be provided to limit");
        } else {
          this._single.limit = val;
          this._setSkipBinding("limit", options);
        }
        return this;
      }
      // Retrieve the "count" result of the query.
      count(column, options) {
        return this._aggregate("count", column || "*", options);
      }
      // Retrieve the minimum value of a given column.
      min(column, options) {
        return this._aggregate("min", column, options);
      }
      // Retrieve the maximum value of a given column.
      max(column, options) {
        return this._aggregate("max", column, options);
      }
      // Retrieve the sum of the values of a given column.
      sum(column, options) {
        return this._aggregate("sum", column, options);
      }
      // Retrieve the average of the values of a given column.
      avg(column, options) {
        return this._aggregate("avg", column, options);
      }
      // Retrieve the "count" of the distinct results of the query.
      countDistinct(...columns) {
        let options;
        if (columns.length > 1 && isPlainObject(last(columns))) {
          [options] = columns.splice(columns.length - 1, 1);
        }
        if (!columns.length) {
          columns = "*";
        } else if (columns.length === 1) {
          columns = columns[0];
        }
        return this._aggregate("count", columns, { ...options, distinct: true });
      }
      // Retrieve the sum of the distinct values of a given column.
      sumDistinct(column, options) {
        return this._aggregate("sum", column, { ...options, distinct: true });
      }
      // Retrieve the vg of the distinct results of the query.
      avgDistinct(column, options) {
        return this._aggregate("avg", column, { ...options, distinct: true });
      }
      // Increments a column's value by the specified amount.
      increment(column, amount = 1) {
        if (isObject(column)) {
          for (const key in column) {
            this._counter(key, column[key]);
          }
          return this;
        }
        return this._counter(column, amount);
      }
      // Decrements a column's value by the specified amount.
      decrement(column, amount = 1) {
        if (isObject(column)) {
          for (const key in column) {
            this._counter(key, -column[key]);
          }
          return this;
        }
        return this._counter(column, -amount);
      }
      // Clears increments/decrements
      clearCounters() {
        this._single.counter = {};
        return this;
      }
      // Sets the values for a `select` query, informing that only the first
      // row should be returned (limit 1).
      first(...args) {
        if (this._method && this._method !== "select") {
          throw new Error(`Cannot chain .first() on "${this._method}" query`);
        }
        this.select(normalizeArr(...args));
        this._method = "first";
        this.limit(1);
        return this;
      }
      // Use existing connection to execute the query
      // Same value that client.acquireConnection() for an according client returns should be passed
      connection(_connection) {
        this._connection = _connection;
        this.client.processPassedConnection(_connection);
        return this;
      }
      // Pluck a column from a query.
      pluck(column) {
        if (this._method && this._method !== "select") {
          throw new Error(`Cannot chain .pluck() on "${this._method}" query`);
        }
        this._method = "pluck";
        this._single.pluck = column;
        this._statements.push({
          grouping: "columns",
          type: "pluck",
          value: column
        });
        return this;
      }
      // Deprecated. Remove everything from select clause
      clearSelect() {
        this._clearGrouping("columns");
        return this;
      }
      // Deprecated. Remove everything from where clause
      clearWhere() {
        this._clearGrouping("where");
        return this;
      }
      // Deprecated. Remove everything from group clause
      clearGroup() {
        this._clearGrouping("group");
        return this;
      }
      // Deprecated. Remove everything from order clause
      clearOrder() {
        this._clearGrouping("order");
        return this;
      }
      // Deprecated. Remove everything from having clause
      clearHaving() {
        this._clearGrouping("having");
        return this;
      }
      // Remove everything from statement clause
      clear(statement) {
        if (!CLEARABLE_STATEMENTS.has(statement))
          throw new Error(`Knex Error: unknown statement '${statement}'`);
        if (statement.startsWith("counter")) return this.clearCounters();
        if (statement === "select") {
          statement = "columns";
        }
        this._clearGrouping(statement);
        return this;
      }
      // Insert & Update
      // ------
      // Sets the values for an `insert` query.
      insert(values, returning, options) {
        this._method = "insert";
        if (!isEmpty(returning)) this.returning(returning, options);
        this._single.insert = values;
        return this;
      }
      // Sets the values for an `update`, allowing for both
      // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
      update(values, returning, options) {
        let ret;
        const obj = this._single.update || {};
        this._method = "update";
        if (isString(values)) {
          if (isPlainObject(returning)) {
            obj[values] = JSON.stringify(returning);
          } else {
            obj[values] = returning;
          }
          if (arguments.length > 2) {
            ret = arguments[2];
          }
        } else {
          const keys = Object.keys(values);
          if (this._single.update) {
            this.client.logger.warn("Update called multiple times with objects.");
          }
          let i = -1;
          while (++i < keys.length) {
            obj[keys[i]] = values[keys[i]];
          }
          ret = arguments[1];
        }
        if (!isEmpty(ret)) this.returning(ret, options);
        this._single.update = obj;
        return this;
      }
      // Sets the returning value for the query.
      returning(returning, options) {
        this._single.returning = returning;
        this._single.options = options;
        return this;
      }
      onConflict(columns) {
        if (typeof columns === "string") {
          columns = [columns];
        }
        return new OnConflictBuilder(this, columns || true);
      }
      // Delete
      // ------
      // Executes a delete statement on the query;
      delete(ret, options) {
        this._method = "del";
        if (!isEmpty(ret)) this.returning(ret, options);
        return this;
      }
      // Truncates a table, ends the query chain.
      truncate(tableName) {
        this._method = "truncate";
        if (tableName) {
          this._single.table = tableName;
        }
        return this;
      }
      // Retrieves columns for the table specified by `knex(tableName)`
      columnInfo(column) {
        this._method = "columnInfo";
        this._single.columnInfo = column;
        return this;
      }
      // Set a lock for update constraint.
      forUpdate(...tables) {
        this._single.lock = lockMode.forUpdate;
        if (tables.length === 1 && Array.isArray(tables[0])) {
          this._single.lockTables = tables[0];
        } else {
          this._single.lockTables = tables;
        }
        return this;
      }
      // Set a lock for share constraint.
      forShare(...tables) {
        this._single.lock = lockMode.forShare;
        this._single.lockTables = tables;
        return this;
      }
      // Set a lock for no key update constraint.
      forNoKeyUpdate(...tables) {
        this._single.lock = lockMode.forNoKeyUpdate;
        this._single.lockTables = tables;
        return this;
      }
      // Set a lock for key share constraint.
      forKeyShare(...tables) {
        this._single.lock = lockMode.forKeyShare;
        this._single.lockTables = tables;
        return this;
      }
      // Skips locked rows when using a lock constraint.
      skipLocked() {
        if (!this._isSelectQuery()) {
          throw new Error(`Cannot chain .skipLocked() on "${this._method}" query!`);
        }
        if (!this._hasLockMode()) {
          throw new Error(
            ".skipLocked() can only be used after a call to .forShare() or .forUpdate()!"
          );
        }
        if (this._single.waitMode === waitMode.noWait) {
          throw new Error(".skipLocked() cannot be used together with .noWait()!");
        }
        this._single.waitMode = waitMode.skipLocked;
        return this;
      }
      // Causes error when acessing a locked row instead of waiting for it to be released.
      noWait() {
        if (!this._isSelectQuery()) {
          throw new Error(`Cannot chain .noWait() on "${this._method}" query!`);
        }
        if (!this._hasLockMode()) {
          throw new Error(
            ".noWait() can only be used after a call to .forShare() or .forUpdate()!"
          );
        }
        if (this._single.waitMode === waitMode.skipLocked) {
          throw new Error(".noWait() cannot be used together with .skipLocked()!");
        }
        this._single.waitMode = waitMode.noWait;
        return this;
      }
      // Takes a JS object of methods to call and calls them
      fromJS(obj) {
        each(obj, (val, key) => {
          if (typeof this[key] !== "function") {
            this.client.logger.warn(`Knex Error: unknown key ${key}`);
          }
          if (Array.isArray(val)) {
            this[key].apply(this, val);
          } else {
            this[key](val);
          }
        });
        return this;
      }
      fromRaw(sql, bindings) {
        const raw = sql.isRawInstance ? sql : this.client.raw(sql, bindings);
        return this.from(raw);
      }
      // Passes query to provided callback function, useful for e.g. composing
      // domain-specific helpers
      modify(callback) {
        callback.apply(this, [this].concat(tail(arguments)));
        return this;
      }
      upsert(values, returning, options) {
        throw new Error(
          `Upsert is not yet supported for dialect ${this.client.dialect}`
        );
      }
      // JSON support functions
      _json(nameFunction, params) {
        this._statements.push({
          grouping: "columns",
          type: "json",
          method: nameFunction,
          params
        });
        return this;
      }
      jsonExtract() {
        const column = arguments[0];
        let path;
        let alias;
        let singleValue = true;
        if (arguments.length >= 2) {
          path = arguments[1];
        }
        if (arguments.length >= 3) {
          alias = arguments[2];
        }
        if (arguments.length === 4) {
          singleValue = arguments[3];
        }
        if (arguments.length === 2 && Array.isArray(arguments[0]) && isBoolean(arguments[1])) {
          singleValue = arguments[1];
        }
        return this._json("jsonExtract", {
          column,
          path,
          alias,
          singleValue
          // boolean used only in MSSQL to use function for extract value instead of object/array.
        });
      }
      jsonSet(column, path, value, alias) {
        return this._json("jsonSet", {
          column,
          path,
          value,
          alias
        });
      }
      jsonInsert(column, path, value, alias) {
        return this._json("jsonInsert", {
          column,
          path,
          value,
          alias
        });
      }
      jsonRemove(column, path, alias) {
        return this._json("jsonRemove", {
          column,
          path,
          alias
        });
      }
      // Wheres for JSON
      _isJsonObject(jsonValue) {
        return isObject(jsonValue) && !(jsonValue instanceof _Builder);
      }
      _whereJsonWrappedValue(type, column, value) {
        const whereJsonClause = {
          grouping: "where",
          type,
          column,
          value,
          not: this._not(),
          bool: this._bool(),
          asColumn: this._asColumnFlag
        };
        if (arguments[3]) {
          whereJsonClause.operator = arguments[3];
        }
        if (arguments[4]) {
          whereJsonClause.jsonPath = arguments[4];
        }
        this._statements.push(whereJsonClause);
      }
      whereJsonObject(column, value) {
        this._whereJsonWrappedValue("whereJsonObject", column, value);
        return this;
      }
      orWhereJsonObject(column, value) {
        return this._bool("or").whereJsonObject(column, value);
      }
      whereNotJsonObject(column, value) {
        return this._not(true).whereJsonObject(column, value);
      }
      orWhereNotJsonObject(column, value) {
        return this._bool("or").whereNotJsonObject(column, value);
      }
      whereJsonPath(column, path, operator, value) {
        this._whereJsonWrappedValue("whereJsonPath", column, value, operator, path);
        return this;
      }
      orWhereJsonPath(column, path, operator, value) {
        return this._bool("or").whereJsonPath(column, path, operator, value);
      }
      // Json superset wheres
      whereJsonSupersetOf(column, value) {
        this._whereJsonWrappedValue("whereJsonSupersetOf", column, value);
        return this;
      }
      whereJsonNotSupersetOf(column, value) {
        return this._not(true).whereJsonSupersetOf(column, value);
      }
      orWhereJsonSupersetOf(column, value) {
        return this._bool("or").whereJsonSupersetOf(column, value);
      }
      orWhereJsonNotSupersetOf(column, value) {
        return this._bool("or").whereJsonNotSupersetOf(column, value);
      }
      // Json subset wheres
      whereJsonSubsetOf(column, value) {
        this._whereJsonWrappedValue("whereJsonSubsetOf", column, value);
        return this;
      }
      whereJsonNotSubsetOf(column, value) {
        return this._not(true).whereJsonSubsetOf(column, value);
      }
      orWhereJsonSubsetOf(column, value) {
        return this._bool("or").whereJsonSubsetOf(column, value);
      }
      orWhereJsonNotSubsetOf(column, value) {
        return this._bool("or").whereJsonNotSubsetOf(column, value);
      }
      whereJsonHasNone(column, values) {
        this._not(true).whereJsonHasAll(column, values);
        return this;
      }
      // end of wheres for JSON
      _analytic(alias, second, third) {
        let analytic;
        const { schema } = this._single;
        const method = this._analyticMethod();
        alias = typeof alias === "string" ? alias : null;
        assert(
          typeof second === "function" || second.isRawInstance || Array.isArray(second) || typeof second === "string" || typeof second === "object",
          `The second argument to an analytic function must be either a function, a raw,
       an array of string or object, an object or a single string.`
        );
        if (third) {
          assert(
            Array.isArray(third) || typeof third === "string" || typeof third === "object",
            "The third argument to an analytic function must be either a string, an array of string or object or an object."
          );
        }
        if (isFunction(second)) {
          analytic = new Analytic(method, schema, alias);
          second.call(analytic, analytic);
        } else if (second.isRawInstance) {
          const raw = second;
          analytic = {
            grouping: "columns",
            type: "analytic",
            method,
            raw,
            alias
          };
        } else {
          const order = !Array.isArray(second) ? [second] : second;
          let partitions = third || [];
          partitions = !Array.isArray(partitions) ? [partitions] : partitions;
          analytic = {
            grouping: "columns",
            type: "analytic",
            method,
            order,
            alias,
            partitions
          };
        }
        this._statements.push(analytic);
        return this;
      }
      rank(...args) {
        return this._analyticMethod("rank")._analytic(...args);
      }
      denseRank(...args) {
        return this._analyticMethod("dense_rank")._analytic(...args);
      }
      rowNumber(...args) {
        return this._analyticMethod("row_number")._analytic(...args);
      }
      // ----------------------------------------------------------------------
      // Helper for the incrementing/decrementing queries.
      _counter(column, amount) {
        amount = parseFloat(amount);
        this._method = "update";
        this._single.counter = this._single.counter || {};
        this._single.counter[column] = amount;
        return this;
      }
      // Helper to get or set the "boolFlag" value.
      _bool(val) {
        if (arguments.length === 1) {
          this._boolFlag = val;
          return this;
        }
        const ret = this._boolFlag;
        this._boolFlag = "and";
        return ret;
      }
      // Helper to get or set the "notFlag" value.
      _not(val) {
        if (arguments.length === 1) {
          this._notFlag = val;
          return this;
        }
        const ret = this._notFlag;
        this._notFlag = false;
        return ret;
      }
      // Helper to get or set the "joinFlag" value.
      _joinType(val) {
        if (arguments.length === 1) {
          this._joinFlag = val;
          return this;
        }
        const ret = this._joinFlag || "inner";
        this._joinFlag = "inner";
        return ret;
      }
      _analyticMethod(val) {
        if (arguments.length === 1) {
          this._analyticFlag = val;
          return this;
        }
        return this._analyticFlag || "row_number";
      }
      // Helper for compiling any aggregate queries.
      _aggregate(method, column, options = {}) {
        this._statements.push({
          grouping: "columns",
          type: column.isRawInstance ? "aggregateRaw" : "aggregate",
          method,
          value: column,
          aggregateDistinct: options.distinct || false,
          alias: options.as
        });
        return this;
      }
      // Helper function for clearing or reseting a grouping type from the builder
      _clearGrouping(grouping) {
        if (grouping in this._single) {
          this._single[grouping] = void 0;
        } else {
          this._statements = reject(this._statements, { grouping });
        }
      }
      // Helper function that checks if the builder will emit a select query
      _isSelectQuery() {
        return SELECT_COMMANDS.has(this._method);
      }
      // Helper function that checks if the query has a lock mode set
      _hasLockMode() {
        return LOCK_MODES.has(this._single.lock);
      }
    };
    Builder.prototype.select = Builder.prototype.columns;
    Builder.prototype.column = Builder.prototype.columns;
    Builder.prototype.andWhereNot = Builder.prototype.whereNot;
    Builder.prototype.andWhereNotColumn = Builder.prototype.whereNotColumn;
    Builder.prototype.andWhere = Builder.prototype.where;
    Builder.prototype.andWhereColumn = Builder.prototype.whereColumn;
    Builder.prototype.andWhereRaw = Builder.prototype.whereRaw;
    Builder.prototype.andWhereBetween = Builder.prototype.whereBetween;
    Builder.prototype.andWhereNotBetween = Builder.prototype.whereNotBetween;
    Builder.prototype.andWhereJsonObject = Builder.prototype.whereJsonObject;
    Builder.prototype.andWhereNotJsonObject = Builder.prototype.whereNotJsonObject;
    Builder.prototype.andWhereJsonPath = Builder.prototype.whereJsonPath;
    Builder.prototype.andWhereLike = Builder.prototype.whereLike;
    Builder.prototype.andWhereILike = Builder.prototype.whereILike;
    Builder.prototype.andHaving = Builder.prototype.having;
    Builder.prototype.andHavingIn = Builder.prototype.havingIn;
    Builder.prototype.andHavingNotIn = Builder.prototype.havingNotIn;
    Builder.prototype.andHavingNull = Builder.prototype.havingNull;
    Builder.prototype.andHavingNotNull = Builder.prototype.havingNotNull;
    Builder.prototype.andHavingExists = Builder.prototype.havingExists;
    Builder.prototype.andHavingNotExists = Builder.prototype.havingNotExists;
    Builder.prototype.andHavingBetween = Builder.prototype.havingBetween;
    Builder.prototype.andHavingNotBetween = Builder.prototype.havingNotBetween;
    Builder.prototype.from = Builder.prototype.table;
    Builder.prototype.into = Builder.prototype.table;
    Builder.prototype.del = Builder.prototype.delete;
    augmentWithBuilderInterface(Builder);
    addQueryContext(Builder);
    Builder.extend = (methodName, fn) => {
      if (Object.prototype.hasOwnProperty.call(Builder.prototype, methodName)) {
        throw new Error(
          `Can't extend QueryBuilder with existing method ('${methodName}').`
        );
      }
      assign(Builder.prototype, { [methodName]: fn });
    };
    var OnConflictBuilder = class {
      constructor(builder, columns) {
        this.builder = builder;
        this._columns = columns;
      }
      // Sets insert query to ignore conflicts
      ignore() {
        this.builder._single.onConflict = this._columns;
        this.builder._single.ignore = true;
        return this.builder;
      }
      // Sets insert query to update on conflict
      merge(updates) {
        this.builder._single.onConflict = this._columns;
        this.builder._single.merge = { updates };
        return this.builder;
      }
      // Prevent
      then() {
        throw new Error(
          "Incomplete onConflict clause. .onConflict() must be directly followed by either .merge() or .ignore()"
        );
      }
    };
    module2.exports = Builder;
  }
});

// node_modules/lodash/_arrayReduce.js
var require_arrayReduce = __commonJS({
  "node_modules/lodash/_arrayReduce.js"(exports2, module2) {
    "use strict";
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    module2.exports = arrayReduce;
  }
});

// node_modules/lodash/_baseReduce.js
var require_baseReduce = __commonJS({
  "node_modules/lodash/_baseReduce.js"(exports2, module2) {
    "use strict";
    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function(value, index, collection2) {
        accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
      });
      return accumulator;
    }
    module2.exports = baseReduce;
  }
});

// node_modules/lodash/reduce.js
var require_reduce = __commonJS({
  "node_modules/lodash/reduce.js"(exports2, module2) {
    "use strict";
    var arrayReduce = require_arrayReduce();
    var baseEach = require_baseEach();
    var baseIteratee = require_baseIteratee();
    var baseReduce = require_baseReduce();
    var isArray = require_isArray();
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
      return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }
    module2.exports = reduce;
  }
});

// node_modules/lodash/transform.js
var require_transform = __commonJS({
  "node_modules/lodash/transform.js"(exports2, module2) {
    "use strict";
    var arrayEach = require_arrayEach();
    var baseCreate = require_baseCreate();
    var baseForOwn = require_baseForOwn();
    var baseIteratee = require_baseIteratee();
    var getPrototype = require_getPrototype();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isFunction = require_isFunction();
    var isObject = require_isObject();
    var isTypedArray = require_isTypedArray();
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
      iteratee = baseIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor() : [];
        } else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        } else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
        return iteratee(accumulator, value, index, object2);
      });
      return accumulator;
    }
    module2.exports = transform;
  }
});

// node_modules/knex/lib/formatter/formatterUtils.js
var require_formatterUtils = __commonJS({
  "node_modules/knex/lib/formatter/formatterUtils.js"(exports2, module2) {
    "use strict";
    var { isObject } = require_is();
    function compileCallback(callback, method, client, bindingsHolder) {
      const builder = client.queryBuilder();
      callback.call(builder, builder);
      const compiler = client.queryCompiler(builder, bindingsHolder.bindings);
      return compiler.toSQL(method || builder._method || "select");
    }
    function wrapAsIdentifier(value, builder, client) {
      const queryContext = builder.queryContext();
      return client.wrapIdentifier((value || "").trim(), queryContext);
    }
    function formatDefault(value, type, client) {
      if (value === void 0) {
        return "";
      } else if (value === null) {
        return "null";
      } else if (value && value.isRawInstance) {
        return value.toQuery();
      } else if (type === "bool") {
        if (value === "false") value = 0;
        return `'${value ? 1 : 0}'`;
      } else if ((type === "json" || type === "jsonb") && isObject(value)) {
        return `'${JSON.stringify(value)}'`;
      } else {
        return client._escapeBinding(value.toString());
      }
    }
    module2.exports = {
      compileCallback,
      wrapAsIdentifier,
      formatDefault
    };
  }
});

// node_modules/knex/lib/formatter/wrappingFormatter.js
var require_wrappingFormatter = __commonJS({
  "node_modules/knex/lib/formatter/wrappingFormatter.js"(exports2, module2) {
    "use strict";
    var transform = require_transform();
    var QueryBuilder = require_querybuilder();
    var { compileCallback, wrapAsIdentifier } = require_formatterUtils();
    var orderBys = ["asc", "desc"];
    var operators = transform(
      [
        "=",
        "<",
        ">",
        "<=",
        ">=",
        "<>",
        "!=",
        "like",
        "not like",
        "between",
        "not between",
        "ilike",
        "not ilike",
        "exists",
        "not exist",
        "rlike",
        "not rlike",
        "regexp",
        "not regexp",
        "match",
        "&",
        "|",
        "^",
        "<<",
        ">>",
        "~",
        "~=",
        "~*",
        "!~",
        "!~*",
        "#",
        "&&",
        "@>",
        "<@",
        "||",
        "&<",
        "&>",
        "-|-",
        "@@",
        "!!",
        ["?", "\\?"],
        ["?|", "\\?|"],
        ["?&", "\\?&"]
      ],
      (result, key) => {
        if (Array.isArray(key)) {
          result[key[0]] = key[1];
        } else {
          result[key] = key;
        }
      },
      {}
    );
    function columnize(target, builder, client, bindingHolder) {
      const columns = Array.isArray(target) ? target : [target];
      let str = "", i = -1;
      while (++i < columns.length) {
        if (i > 0) str += ", ";
        str += wrap(columns[i], void 0, builder, client, bindingHolder);
      }
      return str;
    }
    function wrap(value, isParameter, builder, client, bindingHolder) {
      const raw = unwrapRaw(value, isParameter, builder, client, bindingHolder);
      if (raw) return raw;
      switch (typeof value) {
        case "function":
          return outputQuery(
            compileCallback(value, void 0, client, bindingHolder),
            true,
            builder,
            client
          );
        case "object":
          return parseObject(value, builder, client, bindingHolder);
        case "number":
          return value;
        default:
          return wrapString(value + "", builder, client);
      }
    }
    function unwrapRaw(value, isParameter, builder, client, bindingsHolder) {
      let query;
      if (value instanceof QueryBuilder) {
        query = client.queryCompiler(value).toSQL();
        if (query.bindings) {
          bindingsHolder.bindings.push(...query.bindings);
        }
        return outputQuery(query, isParameter, builder, client);
      }
      if (value && value.isRawInstance) {
        value.client = client;
        if (builder._queryContext) {
          value.queryContext = () => {
            return builder._queryContext;
          };
        }
        query = value.toSQL();
        if (query.bindings) {
          bindingsHolder.bindings.push(...query.bindings);
        }
        return query.sql;
      }
      if (isParameter) {
        bindingsHolder.bindings.push(value);
      }
    }
    function operator(value, builder, client, bindingsHolder) {
      const raw = unwrapRaw(value, void 0, builder, client, bindingsHolder);
      if (raw) return raw;
      const operator2 = operators[(value || "").toLowerCase()];
      if (!operator2) {
        throw new TypeError(`The operator "${value}" is not permitted`);
      }
      return operator2;
    }
    function wrapString(value, builder, client) {
      const asIndex = value.toLowerCase().indexOf(" as ");
      if (asIndex !== -1) {
        const first = value.slice(0, asIndex);
        const second = value.slice(asIndex + 4);
        return client.alias(
          wrapString(first, builder, client),
          wrapAsIdentifier(second, builder, client)
        );
      }
      const wrapped = [];
      let i = -1;
      const segments = value.split(".");
      while (++i < segments.length) {
        value = segments[i];
        if (i === 0 && segments.length > 1) {
          wrapped.push(wrapString((value || "").trim(), builder, client));
        } else {
          wrapped.push(wrapAsIdentifier(value, builder, client));
        }
      }
      return wrapped.join(".");
    }
    function parseObject(obj, builder, client, formatter) {
      const ret = [];
      for (const alias in obj) {
        const queryOrIdentifier = obj[alias];
        if (typeof queryOrIdentifier === "function") {
          const compiled = compileCallback(
            queryOrIdentifier,
            void 0,
            client,
            formatter
          );
          compiled.as = alias;
          ret.push(outputQuery(compiled, true, builder, client));
        } else if (queryOrIdentifier instanceof QueryBuilder) {
          ret.push(
            client.alias(
              `(${wrap(queryOrIdentifier, void 0, builder, client, formatter)})`,
              wrapAsIdentifier(alias, builder, client)
            )
          );
        } else {
          ret.push(
            client.alias(
              wrap(queryOrIdentifier, void 0, builder, client, formatter),
              wrapAsIdentifier(alias, builder, client)
            )
          );
        }
      }
      return ret.join(", ");
    }
    function outputQuery(compiled, isParameter, builder, client) {
      let sql = compiled.sql || "";
      if (sql) {
        if ((compiled.method === "select" || compiled.method === "first") && (isParameter || compiled.as)) {
          sql = `(${sql})`;
          if (compiled.as)
            return client.alias(sql, wrapString(compiled.as, builder, client));
        }
      }
      return sql;
    }
    function rawOrFn(value, method, builder, client, bindingHolder) {
      if (typeof value === "function") {
        return outputQuery(
          compileCallback(value, method, client, bindingHolder),
          void 0,
          builder,
          client
        );
      }
      return unwrapRaw(value, void 0, builder, client, bindingHolder) || "";
    }
    function direction(value, builder, client, bindingsHolder) {
      const raw = unwrapRaw(value, void 0, builder, client, bindingsHolder);
      if (raw) return raw;
      return orderBys.indexOf((value || "").toLowerCase()) !== -1 ? value : "asc";
    }
    module2.exports = {
      columnize,
      direction,
      operator,
      outputQuery,
      rawOrFn,
      unwrapRaw,
      wrap,
      wrapString
    };
  }
});

// node_modules/knex/lib/formatter/rawFormatter.js
var require_rawFormatter = __commonJS({
  "node_modules/knex/lib/formatter/rawFormatter.js"(exports2, module2) {
    "use strict";
    var { columnize } = require_wrappingFormatter();
    function replaceRawArrBindings(raw, client) {
      const bindingsHolder = {
        bindings: []
      };
      const builder = raw;
      const expectedBindings = raw.bindings.length;
      const values = raw.bindings;
      let index = 0;
      const sql = raw.sql.replace(/\\?\?\??/g, function(match) {
        if (match === "\\?") {
          return match;
        }
        const value = values[index++];
        if (match === "??") {
          return columnize(value, builder, client, bindingsHolder);
        }
        return client.parameter(value, builder, bindingsHolder);
      });
      if (expectedBindings !== index) {
        throw new Error(`Expected ${expectedBindings} bindings, saw ${index}`);
      }
      return {
        method: "raw",
        sql,
        bindings: bindingsHolder.bindings
      };
    }
    function replaceKeyBindings(raw, client) {
      const bindingsHolder = {
        bindings: []
      };
      const builder = raw;
      const values = raw.bindings;
      const regex = /\\?(:(\w+):(?=::)|:(\w+):(?!:)|:(\w+))/g;
      const sql = raw.sql.replace(regex, function(match, p1, p2, p3, p4) {
        if (match !== p1) {
          return p1;
        }
        const part = p2 || p3 || p4;
        const key = match.trim();
        const isIdentifier = key[key.length - 1] === ":";
        const value = values[part];
        if (value === void 0) {
          if (Object.prototype.hasOwnProperty.call(values, part)) {
            bindingsHolder.bindings.push(value);
          }
          return match;
        }
        if (isIdentifier) {
          return match.replace(
            p1,
            columnize(value, builder, client, bindingsHolder)
          );
        }
        return match.replace(p1, client.parameter(value, builder, bindingsHolder));
      });
      return {
        method: "raw",
        sql,
        bindings: bindingsHolder.bindings
      };
    }
    module2.exports = {
      replaceKeyBindings,
      replaceRawArrBindings
    };
  }
});

// node_modules/knex/lib/util/nanoid.js
var require_nanoid = __commonJS({
  "node_modules/knex/lib/util/nanoid.js"(exports2, module2) {
    "use strict";
    var urlAlphabet = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
    var numberAlphabet = "0123456789";
    function nanoid(size = 21) {
      let id = "";
      let i = size;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    }
    function nanonum(size = 21) {
      let id = "";
      let i = size;
      while (i--) {
        id += numberAlphabet[Math.random() * 10 | 0];
      }
      return id;
    }
    module2.exports = { nanoid, nanonum };
  }
});

// node_modules/knex/lib/raw.js
var require_raw = __commonJS({
  "node_modules/knex/lib/raw.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("events");
    var debug = require_src();
    var assign = require_assign();
    var isPlainObject = require_isPlainObject();
    var reduce = require_reduce();
    var {
      replaceRawArrBindings,
      replaceKeyBindings
    } = require_rawFormatter();
    var helpers = require_helpers();
    var saveAsyncStack = require_save_async_stack();
    var { nanoid } = require_nanoid();
    var { isNumber, isObject } = require_is();
    var {
      augmentWithBuilderInterface
    } = require_builder_interface_augmenter();
    var debugBindings = debug("knex:bindings");
    var Raw = class extends EventEmitter {
      constructor(client) {
        super();
        this.client = client;
        this.sql = "";
        this.bindings = [];
        this._wrappedBefore = void 0;
        this._wrappedAfter = void 0;
        if (client && client.config) {
          this._debug = client.config.debug;
          saveAsyncStack(this, 4);
        }
      }
      set(sql, bindings) {
        this.sql = sql;
        this.bindings = isObject(bindings) && !bindings.toSQL || bindings === void 0 ? bindings : [bindings];
        return this;
      }
      timeout(ms, { cancel } = {}) {
        if (isNumber(ms) && ms > 0) {
          this._timeout = ms;
          if (cancel) {
            this.client.assertCanCancelQuery();
            this._cancelOnTimeout = true;
          }
        }
        return this;
      }
      // Wraps the current sql with `before` and `after`.
      wrap(before, after) {
        this._wrappedBefore = before;
        this._wrappedAfter = after;
        return this;
      }
      // Calls `toString` on the Knex object.
      toString() {
        return this.toQuery();
      }
      // Returns the raw sql for the query.
      toSQL(method, tz) {
        let obj;
        if (Array.isArray(this.bindings)) {
          obj = replaceRawArrBindings(this, this.client);
        } else if (this.bindings && isPlainObject(this.bindings)) {
          obj = replaceKeyBindings(this, this.client);
        } else {
          obj = {
            method: "raw",
            sql: this.sql,
            bindings: this.bindings === void 0 ? [] : [this.bindings]
          };
        }
        if (this._wrappedBefore) {
          obj.sql = this._wrappedBefore + obj.sql;
        }
        if (this._wrappedAfter) {
          obj.sql = obj.sql + this._wrappedAfter;
        }
        obj.options = reduce(this._options, assign, {});
        if (this._timeout) {
          obj.timeout = this._timeout;
          if (this._cancelOnTimeout) {
            obj.cancelOnTimeout = this._cancelOnTimeout;
          }
        }
        obj.bindings = obj.bindings || [];
        if (helpers.containsUndefined(obj.bindings)) {
          const undefinedBindingIndices = helpers.getUndefinedIndices(
            this.bindings
          );
          debugBindings(obj.bindings);
          throw new Error(
            `Undefined binding(s) detected for keys [${undefinedBindingIndices}] when compiling RAW query: ${obj.sql}`
          );
        }
        obj.__knexQueryUid = nanoid();
        Object.defineProperties(obj, {
          toNative: {
            value: () => ({
              sql: this.client.positionBindings(obj.sql),
              bindings: this.client.prepBindings(obj.bindings)
            }),
            enumerable: false
          }
        });
        return obj;
      }
    };
    Raw.prototype.isRawInstance = true;
    augmentWithBuilderInterface(Raw);
    helpers.addQueryContext(Raw);
    module2.exports = Raw;
  }
});

// node_modules/lodash/compact.js
var require_compact = __commonJS({
  "node_modules/lodash/compact.js"(exports2, module2) {
    "use strict";
    function compact(array) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    module2.exports = compact;
  }
});

// node_modules/lodash/_arrayAggregator.js
var require_arrayAggregator = __commonJS({
  "node_modules/lodash/_arrayAggregator.js"(exports2, module2) {
    "use strict";
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }
    module2.exports = arrayAggregator;
  }
});

// node_modules/lodash/_baseAggregator.js
var require_baseAggregator = __commonJS({
  "node_modules/lodash/_baseAggregator.js"(exports2, module2) {
    "use strict";
    var baseEach = require_baseEach();
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection2) {
        setter(accumulator, value, iteratee(value), collection2);
      });
      return accumulator;
    }
    module2.exports = baseAggregator;
  }
});

// node_modules/lodash/_createAggregator.js
var require_createAggregator = __commonJS({
  "node_modules/lodash/_createAggregator.js"(exports2, module2) {
    "use strict";
    var arrayAggregator = require_arrayAggregator();
    var baseAggregator = require_baseAggregator();
    var baseIteratee = require_baseIteratee();
    var isArray = require_isArray();
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
        return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
      };
    }
    module2.exports = createAggregator;
  }
});

// node_modules/lodash/groupBy.js
var require_groupBy = __commonJS({
  "node_modules/lodash/groupBy.js"(exports2, module2) {
    "use strict";
    var baseAssignValue = require_baseAssignValue();
    var createAggregator = require_createAggregator();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });
    module2.exports = groupBy;
  }
});

// node_modules/lodash/_baseHas.js
var require_baseHas = __commonJS({
  "node_modules/lodash/_baseHas.js"(exports2, module2) {
    "use strict";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }
    module2.exports = baseHas;
  }
});

// node_modules/lodash/has.js
var require_has = __commonJS({
  "node_modules/lodash/has.js"(exports2, module2) {
    "use strict";
    var baseHas = require_baseHas();
    var hasPath = require_hasPath();
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }
    module2.exports = has;
  }
});

// node_modules/lodash/map.js
var require_map = __commonJS({
  "node_modules/lodash/map.js"(exports2, module2) {
    "use strict";
    var arrayMap = require_arrayMap();
    var baseIteratee = require_baseIteratee();
    var baseMap = require_baseMap();
    var isArray = require_isArray();
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, baseIteratee(iteratee, 3));
    }
    module2.exports = map;
  }
});

// node_modules/lodash/_baseSet.js
var require_baseSet = __commonJS({
  "node_modules/lodash/_baseSet.js"(exports2, module2) {
    "use strict";
    var assignValue = require_assignValue();
    var castPath = require_castPath();
    var isIndex = require_isIndex();
    var isObject = require_isObject();
    var toKey = require_toKey();
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);
      var index = -1, length = path.length, lastIndex = length - 1, nested = object;
      while (nested != null && ++index < length) {
        var key = toKey(path[index]), newValue = value;
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          return object;
        }
        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : void 0;
          if (newValue === void 0) {
            newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }
    module2.exports = baseSet;
  }
});

// node_modules/lodash/_basePickBy.js
var require_basePickBy = __commonJS({
  "node_modules/lodash/_basePickBy.js"(exports2, module2) {
    "use strict";
    var baseGet = require_baseGet();
    var baseSet = require_baseSet();
    var castPath = require_castPath();
    function basePickBy(object, paths, predicate) {
      var index = -1, length = paths.length, result = {};
      while (++index < length) {
        var path = paths[index], value = baseGet(object, path);
        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }
    module2.exports = basePickBy;
  }
});

// node_modules/lodash/pickBy.js
var require_pickBy = __commonJS({
  "node_modules/lodash/pickBy.js"(exports2, module2) {
    "use strict";
    var arrayMap = require_arrayMap();
    var baseIteratee = require_baseIteratee();
    var basePickBy = require_basePickBy();
    var getAllKeysIn = require_getAllKeysIn();
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = baseIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }
    module2.exports = pickBy;
  }
});

// node_modules/lodash/omitBy.js
var require_omitBy = __commonJS({
  "node_modules/lodash/omitBy.js"(exports2, module2) {
    "use strict";
    var baseIteratee = require_baseIteratee();
    var negate = require_negate();
    var pickBy = require_pickBy();
    function omitBy(object, predicate) {
      return pickBy(object, negate(baseIteratee(predicate)));
    }
    module2.exports = omitBy;
  }
});

// node_modules/knex/lib/query/querycompiler.js
var require_querycompiler = __commonJS({
  "node_modules/knex/lib/query/querycompiler.js"(exports2, module2) {
    "use strict";
    var helpers = require_helpers();
    var Raw = require_raw();
    var QueryBuilder = require_querybuilder();
    var JoinClause = require_joinclause();
    var debug = require_src();
    var assign = require_assign();
    var compact = require_compact();
    var groupBy = require_groupBy();
    var has = require_has();
    var isEmpty = require_isEmpty();
    var map = require_map();
    var omitBy = require_omitBy();
    var reduce = require_reduce();
    var { nanoid } = require_nanoid();
    var { isString, isUndefined } = require_is();
    var {
      columnize: columnize_,
      direction: direction_,
      operator: operator_,
      wrap: wrap_,
      unwrapRaw: unwrapRaw_,
      rawOrFn: rawOrFn_
    } = require_wrappingFormatter();
    var debugBindings = debug("knex:bindings");
    var components = [
      "comments",
      "columns",
      "join",
      "where",
      "union",
      "group",
      "having",
      "order",
      "limit",
      "offset",
      "lock",
      "waitMode"
    ];
    var QueryCompiler = class {
      constructor(client, builder, bindings) {
        this.client = client;
        this.method = builder._method || "select";
        this.options = builder._options;
        this.single = builder._single;
        this.queryComments = builder._comments;
        this.timeout = builder._timeout || false;
        this.cancelOnTimeout = builder._cancelOnTimeout || false;
        this.grouped = groupBy(builder._statements, "grouping");
        this.formatter = client.formatter(builder);
        this._emptyInsertValue = "default values";
        this.first = this.select;
        this.bindings = bindings || [];
        this.formatter.bindings = this.bindings;
        this.bindingsHolder = this;
        this.builder = this.formatter.builder;
      }
      // Collapse the builder into a single object
      toSQL(method, tz) {
        this._undefinedInWhereClause = false;
        this.undefinedBindingsInfo = [];
        method = method || this.method;
        const val = this[method]() || "";
        const query = {
          method,
          options: reduce(this.options, assign, {}),
          timeout: this.timeout,
          cancelOnTimeout: this.cancelOnTimeout,
          bindings: this.bindingsHolder.bindings || [],
          __knexQueryUid: nanoid()
        };
        Object.defineProperties(query, {
          toNative: {
            value: () => {
              return {
                sql: this.client.positionBindings(query.sql),
                bindings: this.client.prepBindings(query.bindings)
              };
            },
            enumerable: false
          }
        });
        if (isString(val)) {
          query.sql = val;
        } else {
          assign(query, val);
        }
        if (method === "select" || method === "first") {
          if (this.single.as) {
            query.as = this.single.as;
          }
        }
        if (this._undefinedInWhereClause) {
          debugBindings(query.bindings);
          throw new Error(
            `Undefined binding(s) detected when compiling ${method.toUpperCase()}. Undefined column(s): [${this.undefinedBindingsInfo.join(
              ", "
            )}] query: ${query.sql}`
          );
        }
        return query;
      }
      // Compiles the `select` statement, or nested sub-selects by calling each of
      // the component compilers, trimming out the empties, and returning a
      // generated query string.
      select() {
        let sql = this.with();
        let unionStatement = "";
        const firstStatements = [];
        const endStatements = [];
        components.forEach((component) => {
          const statement = this[component](this);
          switch (component) {
            case "union":
              unionStatement = statement;
              break;
            case "comments":
            case "columns":
            case "join":
            case "where":
              firstStatements.push(statement);
              break;
            default:
              endStatements.push(statement);
              break;
          }
        });
        const wrapMainQuery = this.grouped.union && this.grouped.union.map((u) => u.wrap).some((u) => u);
        if (this.onlyUnions()) {
          const statements = compact(firstStatements.concat(endStatements)).join(
            " "
          );
          sql += unionStatement + (statements ? " " + statements : "");
        } else {
          const allStatements = (wrapMainQuery ? "(" : "") + compact(firstStatements).join(" ") + (wrapMainQuery ? ")" : "");
          const endStat = compact(endStatements).join(" ");
          sql += allStatements + (unionStatement ? " " + unionStatement : "") + (endStat ? " " + endStat : endStat);
        }
        return sql;
      }
      pluck() {
        let toPluck = this.single.pluck;
        if (toPluck.indexOf(".") !== -1) {
          toPluck = toPluck.split(".").slice(-1)[0];
        }
        return {
          sql: this.select(),
          pluck: toPluck
        };
      }
      // Compiles an "insert" query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        const insertValues = this.single.insert || [];
        const sql = this.with() + `insert into ${this.tableName} `;
        const body = this._insertBody(insertValues);
        return body === "" ? "" : sql + body;
      }
      _onConflictClause(columns) {
        return columns instanceof Raw ? this.formatter.wrap(columns) : `(${this.formatter.columnize(columns)})`;
      }
      _buildInsertValues(insertData) {
        let sql = "";
        let i = -1;
        while (++i < insertData.values.length) {
          if (i !== 0) sql += "), (";
          sql += this.client.parameterize(
            insertData.values[i],
            this.client.valueForUndefined,
            this.builder,
            this.bindingsHolder
          );
        }
        return sql;
      }
      _insertBody(insertValues) {
        let sql = "";
        if (Array.isArray(insertValues)) {
          if (insertValues.length === 0) {
            return "";
          }
        } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
          return sql + this._emptyInsertValue;
        }
        const insertData = this._prepInsert(insertValues);
        if (typeof insertData === "string") {
          sql += insertData;
        } else {
          if (insertData.columns.length) {
            sql += `(${columnize_(
              insertData.columns,
              this.builder,
              this.client,
              this.bindingsHolder
            )}`;
            sql += ") values (" + this._buildInsertValues(insertData) + ")";
          } else if (insertValues.length === 1 && insertValues[0]) {
            sql += this._emptyInsertValue;
          } else {
            sql = "";
          }
        }
        return sql;
      }
      // Compiles the "update" query.
      update() {
        const withSQL = this.with();
        const { tableName } = this;
        const updateData = this._prepUpdate(this.single.update);
        const wheres = this.where();
        return withSQL + `update ${this.single.only ? "only " : ""}${tableName} set ` + updateData.join(", ") + (wheres ? ` ${wheres}` : "");
      }
      _hintComments() {
        let hints = this.grouped.hintComments || [];
        hints = hints.map((hint) => compact(hint.value).join(" "));
        hints = compact(hints).join(" ");
        return hints ? `/*+ ${hints} */ ` : "";
      }
      // Compiles the columns in the query, specifying if an item was distinct.
      columns() {
        let distinctClause = "";
        if (this.onlyUnions()) return "";
        const hints = this._hintComments();
        const columns = this.grouped.columns || [];
        let i = -1, sql = [];
        if (columns) {
          while (++i < columns.length) {
            const stmt = columns[i];
            if (stmt.distinct) distinctClause = "distinct ";
            if (stmt.distinctOn) {
              distinctClause = this.distinctOn(stmt.value);
              continue;
            }
            if (stmt.type === "aggregate") {
              sql.push(...this.aggregate(stmt));
            } else if (stmt.type === "aggregateRaw") {
              sql.push(this.aggregateRaw(stmt));
            } else if (stmt.type === "analytic") {
              sql.push(this.analytic(stmt));
            } else if (stmt.type === "json") {
              sql.push(this.json(stmt));
            } else if (stmt.value && stmt.value.length > 0) {
              sql.push(
                columnize_(
                  stmt.value,
                  this.builder,
                  this.client,
                  this.bindingsHolder
                )
              );
            }
          }
        }
        if (sql.length === 0) sql = ["*"];
        const select = this.onlyJson() ? "" : "select ";
        return `${select}${hints}${distinctClause}` + sql.join(", ") + (this.tableName ? ` from ${this.single.only ? "only " : ""}${this.tableName}` : "");
      }
      // Add comments to the query
      comments() {
        if (!this.queryComments.length) return "";
        return this.queryComments.map((comment) => `/* ${comment.comment} */`).join(" ");
      }
      _aggregate(stmt, { aliasSeparator = " as ", distinctParentheses } = {}) {
        const value = stmt.value;
        const method = stmt.method;
        const distinct = stmt.aggregateDistinct ? "distinct " : "";
        const wrap = (identifier) => wrap_(
          identifier,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
        const addAlias = (value2, alias2) => {
          if (alias2) {
            return value2 + aliasSeparator + wrap(alias2);
          }
          return value2;
        };
        const aggregateArray = (value2, alias2) => {
          let columns = value2.map(wrap).join(", ");
          if (distinct) {
            const openParen = distinctParentheses ? "(" : " ";
            const closeParen = distinctParentheses ? ")" : "";
            columns = distinct.trim() + openParen + columns + closeParen;
          }
          const aggregated = `${method}(${columns})`;
          return addAlias(aggregated, alias2);
        };
        const aggregateString = (value2, alias2) => {
          const aggregated = `${method}(${distinct + wrap(value2)})`;
          return addAlias(aggregated, alias2);
        };
        if (Array.isArray(value)) {
          return [aggregateArray(value)];
        }
        if (typeof value === "object") {
          if (stmt.alias) {
            throw new Error("When using an object explicit alias can not be used");
          }
          return Object.entries(value).map(([alias2, column2]) => {
            if (Array.isArray(column2)) {
              return aggregateArray(column2, alias2);
            }
            return aggregateString(column2, alias2);
          });
        }
        const splitOn = value.toLowerCase().indexOf(" as ");
        let column = value;
        let { alias } = stmt;
        if (splitOn !== -1) {
          column = value.slice(0, splitOn);
          if (alias) {
            throw new Error(`Found multiple aliases for same column: ${column}`);
          }
          alias = value.slice(splitOn + 4);
        }
        return [aggregateString(column, alias)];
      }
      aggregate(stmt) {
        return this._aggregate(stmt);
      }
      aggregateRaw(stmt) {
        const distinct = stmt.aggregateDistinct ? "distinct " : "";
        return `${stmt.method}(${distinct + unwrapRaw_(
          stmt.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        )})`;
      }
      _joinTable(join) {
        return join.schema && !(join.table instanceof Raw) ? `${join.schema}.${join.table}` : join.table;
      }
      // Compiles all each of the `join` clauses on the query,
      // including any nested join queries.
      join() {
        let sql = "";
        let i = -1;
        const joins = this.grouped.join;
        if (!joins) return "";
        while (++i < joins.length) {
          const join = joins[i];
          const table = this._joinTable(join);
          if (i > 0) sql += " ";
          if (join.joinType === "raw") {
            sql += unwrapRaw_(
              join.table,
              void 0,
              this.builder,
              this.client,
              this.bindingsHolder
            );
          } else {
            sql += join.joinType + " join " + wrap_(
              table,
              void 0,
              this.builder,
              this.client,
              this.bindingsHolder
            );
            let ii = -1;
            while (++ii < join.clauses.length) {
              const clause = join.clauses[ii];
              if (ii > 0) {
                sql += ` ${clause.bool} `;
              } else {
                sql += ` ${clause.type === "onUsing" ? "using" : "on"} `;
              }
              const val = this[clause.type](clause);
              if (val) {
                sql += val;
              }
            }
          }
        }
        return sql;
      }
      onBetween(statement) {
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this._not(statement, "between") + " " + statement.value.map(
          (value) => this.client.parameter(value, this.builder, this.bindingsHolder)
        ).join(" and ");
      }
      onNull(statement) {
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " is " + this._not(statement, "null");
      }
      onExists(statement) {
        return this._not(statement, "exists") + " (" + rawOrFn_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ")";
      }
      onIn(statement) {
        if (Array.isArray(statement.column)) return this.multiOnIn(statement);
        let values;
        if (statement.value instanceof Raw) {
          values = this.client.parameter(
            statement.value,
            this.builder,
            this.formatter
          );
        } else {
          values = this.client.parameterize(
            statement.value,
            void 0,
            this.builder,
            this.bindingsHolder
          );
        }
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this._not(statement, "in ") + this.wrap(values);
      }
      multiOnIn(statement) {
        let i = -1, sql = `(${columnize_(
          statement.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )}) `;
        sql += this._not(statement, "in ") + "((";
        while (++i < statement.value.length) {
          if (i !== 0) sql += "),(";
          sql += this.client.parameterize(
            statement.value[i],
            void 0,
            this.builder,
            this.bindingsHolder
          );
        }
        return sql + "))";
      }
      // Compiles all `where` statements on the query.
      where() {
        const wheres = this.grouped.where;
        if (!wheres) return;
        const sql = [];
        let i = -1;
        while (++i < wheres.length) {
          const stmt = wheres[i];
          if (Object.prototype.hasOwnProperty.call(stmt, "value") && helpers.containsUndefined(stmt.value)) {
            this.undefinedBindingsInfo.push(stmt.column);
            this._undefinedInWhereClause = true;
          }
          const val = this[stmt.type](stmt);
          if (val) {
            if (sql.length === 0) {
              sql[0] = "where";
            } else {
              sql.push(stmt.bool);
            }
            sql.push(val);
          }
        }
        return sql.length > 1 ? sql.join(" ") : "";
      }
      group() {
        return this._groupsOrders("group");
      }
      order() {
        return this._groupsOrders("order");
      }
      // Compiles the `having` statements.
      having() {
        const havings = this.grouped.having;
        if (!havings) return "";
        const sql = ["having"];
        for (let i = 0, l = havings.length; i < l; i++) {
          const s = havings[i];
          const val = this[s.type](s);
          if (val) {
            if (sql.length === 0) {
              sql[0] = "where";
            }
            if (sql.length > 1 || sql.length === 1 && sql[0] !== "having") {
              sql.push(s.bool);
            }
            sql.push(val);
          }
        }
        return sql.length > 1 ? sql.join(" ") : "";
      }
      havingRaw(statement) {
        return this._not(statement, "") + unwrapRaw_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
      }
      havingWrapped(statement) {
        const val = rawOrFn_(
          statement.value,
          "where",
          this.builder,
          this.client,
          this.bindingsHolder
        );
        return val && this._not(statement, "") + "(" + val.slice(6) + ")" || "";
      }
      havingBasic(statement) {
        return this._not(statement, "") + wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + operator_(
          statement.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this.client.parameter(statement.value, this.builder, this.bindingsHolder);
      }
      havingNull(statement) {
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " is " + this._not(statement, "null");
      }
      havingExists(statement) {
        return this._not(statement, "exists") + " (" + rawOrFn_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ")";
      }
      havingBetween(statement) {
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this._not(statement, "between") + " " + statement.value.map(
          (value) => this.client.parameter(value, this.builder, this.bindingsHolder)
        ).join(" and ");
      }
      havingIn(statement) {
        if (Array.isArray(statement.column)) return this.multiHavingIn(statement);
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this._not(statement, "in ") + this.wrap(
          this.client.parameterize(
            statement.value,
            void 0,
            this.builder,
            this.bindingsHolder
          )
        );
      }
      multiHavingIn(statement) {
        return this.multiOnIn(statement);
      }
      // Compile the "union" queries attached to the main query.
      union() {
        const onlyUnions = this.onlyUnions();
        const unions = this.grouped.union;
        if (!unions) return "";
        let sql = "";
        for (let i = 0, l = unions.length; i < l; i++) {
          const union = unions[i];
          if (i > 0) sql += " ";
          if (i > 0 || !onlyUnions) sql += union.clause + " ";
          const statement = rawOrFn_(
            union.value,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          );
          if (statement) {
            const wrap = union.wrap;
            if (wrap) sql += "(";
            sql += statement;
            if (wrap) sql += ")";
          }
        }
        return sql;
      }
      // If we haven't specified any columns or a `tableName`, we're assuming this
      // is only being used for unions.
      onlyUnions() {
        return (!this.grouped.columns || !!this.grouped.columns[0].value) && this.grouped.union && !this.tableName;
      }
      _getValueOrParameterFromAttribute(attribute, rawValue) {
        if (this.single.skipBinding[attribute] === true) {
          return rawValue !== void 0 && rawValue !== null ? rawValue : this.single[attribute];
        }
        return this.client.parameter(
          this.single[attribute],
          this.builder,
          this.bindingsHolder
        );
      }
      onlyJson() {
        return !this.tableName && this.grouped.columns && this.grouped.columns.length === 1 && this.grouped.columns[0].type === "json";
      }
      limit() {
        const noLimit = !this.single.limit && this.single.limit !== 0;
        if (noLimit) return "";
        return `limit ${this._getValueOrParameterFromAttribute("limit")}`;
      }
      offset() {
        if (!this.single.offset) return "";
        return `offset ${this._getValueOrParameterFromAttribute("offset")}`;
      }
      // Compiles a `delete` query.
      del() {
        const { tableName } = this;
        const withSQL = this.with();
        const wheres = this.where();
        const joins = this.join();
        const deleteSelector = joins ? tableName + " " : "";
        return withSQL + `delete ${deleteSelector}from ${this.single.only ? "only " : ""}${tableName}` + (joins ? ` ${joins}` : "") + (wheres ? ` ${wheres}` : "");
      }
      // Compiles a `truncate` query.
      truncate() {
        return `truncate ${this.tableName}`;
      }
      // Compiles the "locks".
      lock() {
        if (this.single.lock) {
          return this[this.single.lock]();
        }
      }
      // Compiles the wait mode on the locks.
      waitMode() {
        if (this.single.waitMode) {
          return this[this.single.waitMode]();
        }
      }
      // Fail on unsupported databases
      skipLocked() {
        throw new Error(
          ".skipLocked() is currently only supported on MySQL 8.0+ and PostgreSQL 9.5+"
        );
      }
      // Fail on unsupported databases
      noWait() {
        throw new Error(
          ".noWait() is currently only supported on MySQL 8.0+, MariaDB 10.3.0+ and PostgreSQL 9.5+"
        );
      }
      distinctOn(value) {
        throw new Error(".distinctOn() is currently only supported on PostgreSQL");
      }
      // On Clause
      // ------
      onWrapped(clause) {
        const self2 = this;
        const wrapJoin = new JoinClause();
        clause.value.call(wrapJoin, wrapJoin);
        let sql = "";
        for (let ii = 0; ii < wrapJoin.clauses.length; ii++) {
          const wrapClause = wrapJoin.clauses[ii];
          if (ii > 0) {
            sql += ` ${wrapClause.bool} `;
          }
          const val = self2[wrapClause.type](wrapClause);
          if (val) {
            sql += val;
          }
        }
        if (sql.length) {
          return `(${sql})`;
        }
        return "";
      }
      onBasic(clause) {
        const toWrap = clause.value instanceof QueryBuilder;
        return wrap_(
          clause.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + operator_(
          clause.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + (toWrap ? "(" : "") + wrap_(
          clause.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + (toWrap ? ")" : "");
      }
      onVal(clause) {
        return wrap_(
          clause.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + operator_(
          clause.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this.client.parameter(clause.value, this.builder, this.bindingsHolder);
      }
      onRaw(clause) {
        return unwrapRaw_(
          clause.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
      }
      onUsing(clause) {
        return "(" + columnize_(
          clause.column,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ")";
      }
      // Where Clause
      // ------
      _valueClause(statement) {
        return statement.asColumn ? wrap_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) : this.client.parameter(
          statement.value,
          this.builder,
          this.bindingsHolder
        );
      }
      _columnClause(statement) {
        let columns;
        if (Array.isArray(statement.column)) {
          columns = `(${columnize_(
            statement.column,
            this.builder,
            this.client,
            this.bindingsHolder
          )})`;
        } else {
          columns = wrap_(
            statement.column,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          );
        }
        return columns;
      }
      whereIn(statement) {
        const values = this.client.values(
          statement.value,
          this.builder,
          this.bindingsHolder
        );
        return `${this._columnClause(statement)} ${this._not(
          statement,
          "in "
        )}${values}`;
      }
      whereLike(statement) {
        return `${this._columnClause(statement)} ${this._not(
          statement,
          "like "
        )}${this._valueClause(statement)}`;
      }
      whereILike(statement) {
        return `${this._columnClause(statement)} ${this._not(
          statement,
          "ilike "
        )}${this._valueClause(statement)}`;
      }
      whereNull(statement) {
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " is " + this._not(statement, "null");
      }
      // Compiles a basic "where" clause.
      whereBasic(statement) {
        return this._not(statement, "") + wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + operator_(
          statement.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this._valueClause(statement);
      }
      whereExists(statement) {
        return this._not(statement, "exists") + " (" + rawOrFn_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ")";
      }
      whereWrapped(statement) {
        const val = rawOrFn_(
          statement.value,
          "where",
          this.builder,
          this.client,
          this.bindingsHolder
        );
        return val && this._not(statement, "") + "(" + val.slice(6) + ")" || "";
      }
      whereBetween(statement) {
        return wrap_(
          statement.column,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + " " + this._not(statement, "between") + " " + statement.value.map(
          (value) => this.client.parameter(value, this.builder, this.bindingsHolder)
        ).join(" and ");
      }
      // Compiles a "whereRaw" query.
      whereRaw(statement) {
        return this._not(statement, "") + unwrapRaw_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
      }
      _jsonWrapValue(jsonValue) {
        if (!this.builder._isJsonObject(jsonValue)) {
          try {
            return JSON.stringify(JSON.parse(jsonValue.replace(/\n|\t/g, "")));
          } catch (e) {
            return jsonValue;
          }
        }
        return JSON.stringify(jsonValue);
      }
      _jsonValueClause(statement) {
        statement.value = this._jsonWrapValue(statement.value);
        return this._valueClause(statement);
      }
      whereJsonObject(statement) {
        return `${this._columnClause(statement)} ${statement.not ? "!=" : "="} ${this._jsonValueClause(statement)}`;
      }
      wrap(str) {
        if (str.charAt(0) !== "(") return `(${str})`;
        return str;
      }
      json(stmt) {
        return this[stmt.method](stmt.params);
      }
      analytic(stmt) {
        let sql = "";
        const self2 = this;
        sql += stmt.method + "() over (";
        if (stmt.raw) {
          sql += stmt.raw;
        } else {
          if (stmt.partitions.length) {
            sql += "partition by ";
            sql += map(stmt.partitions, function(partition) {
              if (isString(partition)) {
                return self2.formatter.columnize(partition);
              } else return self2.formatter.columnize(partition.column) + (partition.order ? " " + partition.order : "");
            }).join(", ") + " ";
          }
          sql += "order by ";
          sql += map(stmt.order, function(order) {
            if (isString(order)) {
              return self2.formatter.columnize(order);
            } else return self2.formatter.columnize(order.column) + (order.order ? " " + order.order : "");
          }).join(", ");
        }
        sql += ")";
        if (stmt.alias) {
          sql += " as " + stmt.alias;
        }
        return sql;
      }
      // Compiles all `with` statements on the query.
      with() {
        if (!this.grouped.with || !this.grouped.with.length) {
          return "";
        }
        const withs = this.grouped.with;
        if (!withs) return;
        const sql = [];
        let i = -1;
        let isRecursive = false;
        while (++i < withs.length) {
          const stmt = withs[i];
          if (stmt.recursive) {
            isRecursive = true;
          }
          const val = this[stmt.type](stmt);
          sql.push(val);
        }
        return `with ${isRecursive ? "recursive " : ""}${sql.join(", ")} `;
      }
      withWrapped(statement) {
        const val = rawOrFn_(
          statement.value,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
        const columnList = statement.columnList ? "(" + columnize_(
          statement.columnList,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ")" : "";
        const materialized = statement.materialized === void 0 ? "" : statement.materialized ? "materialized " : "not materialized ";
        return val && columnize_(
          statement.alias,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + columnList + " as " + materialized + "(" + val + ")" || "";
      }
      // Determines whether to add a "not" prefix to the where clause.
      _not(statement, str) {
        if (statement.not) return `not ${str}`;
        return str;
      }
      _prepInsert(data) {
        const isRaw = rawOrFn_(
          data,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        );
        if (isRaw) return isRaw;
        let columns = [];
        const values = [];
        if (!Array.isArray(data)) data = data ? [data] : [];
        let i = -1;
        while (++i < data.length) {
          if (data[i] == null) break;
          if (i === 0) columns = Object.keys(data[i]).sort();
          const row = new Array(columns.length);
          const keys = Object.keys(data[i]);
          let j = -1;
          while (++j < keys.length) {
            const key = keys[j];
            let idx = columns.indexOf(key);
            if (idx === -1) {
              columns = columns.concat(key).sort();
              idx = columns.indexOf(key);
              let k = -1;
              while (++k < values.length) {
                values[k].splice(idx, 0, void 0);
              }
              row.splice(idx, 0, void 0);
            }
            row[idx] = data[i][key];
          }
          values.push(row);
        }
        return {
          columns,
          values
        };
      }
      // "Preps" the update.
      _prepUpdate(data = {}) {
        const { counter = {} } = this.single;
        for (const column of Object.keys(counter)) {
          if (has(data, column)) {
            this.client.logger.warn(
              `increment/decrement called for a column that has already been specified in main .update() call. Ignoring increment/decrement and using value from .update() call.`
            );
            continue;
          }
          let value = counter[column];
          const symbol = value < 0 ? "-" : "+";
          if (symbol === "-") {
            value = -value;
          }
          data[column] = this.client.raw(`?? ${symbol} ?`, [column, value]);
        }
        data = omitBy(data, isUndefined);
        const vals = [];
        const columns = Object.keys(data);
        let i = -1;
        while (++i < columns.length) {
          vals.push(
            wrap_(
              columns[i],
              void 0,
              this.builder,
              this.client,
              this.bindingsHolder
            ) + " = " + this.client.parameter(
              data[columns[i]],
              this.builder,
              this.bindingsHolder
            )
          );
        }
        if (isEmpty(vals)) {
          throw new Error(
            [
              "Empty .update() call detected!",
              "Update data does not contain any values to update.",
              "This will result in a faulty query.",
              this.single.table ? `Table: ${this.single.table}.` : "",
              this.single.update ? `Columns: ${Object.keys(this.single.update)}.` : ""
            ].join(" ")
          );
        }
        return vals;
      }
      _formatGroupsItemValue(value, nulls) {
        const { formatter } = this;
        let nullOrder = "";
        if (nulls === "last") {
          nullOrder = " is null";
        } else if (nulls === "first") {
          nullOrder = " is not null";
        }
        let groupOrder;
        if (value instanceof Raw) {
          groupOrder = unwrapRaw_(
            value,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          );
        } else if (value instanceof QueryBuilder || nulls) {
          groupOrder = "(" + formatter.columnize(value) + nullOrder + ")";
        } else {
          groupOrder = formatter.columnize(value);
        }
        return groupOrder;
      }
      _basicGroupOrder(item, type) {
        const column = this._formatGroupsItemValue(item.value, item.nulls);
        const direction = type === "order" && item.type !== "orderByRaw" ? ` ${direction_(
          item.direction,
          this.builder,
          this.client,
          this.bindingsHolder
        )}` : "";
        return column + direction;
      }
      _groupOrder(item, type) {
        return this._basicGroupOrder(item, type);
      }
      _groupOrderNulls(item, type) {
        const column = this._formatGroupsItemValue(item.value);
        const direction = type === "order" && item.type !== "orderByRaw" ? ` ${direction_(
          item.direction,
          this.builder,
          this.client,
          this.bindingsHolder
        )}` : "";
        if (item.nulls && !(item.value instanceof Raw)) {
          return `${column}${direction ? direction : ""} nulls ${item.nulls}`;
        }
        return column + direction;
      }
      // Compiles the `order by` statements.
      _groupsOrders(type) {
        const items = this.grouped[type];
        if (!items) return "";
        const sql = items.map((item) => {
          return this._groupOrder(item, type);
        });
        return sql.length ? type + " by " + sql.join(", ") : "";
      }
      // Get the table name, wrapping it if necessary.
      // Implemented as a property to prevent ordering issues as described in #704.
      get tableName() {
        if (!this._tableName) {
          let tableName = this.single.table;
          const schemaName = this.single.schema;
          if (tableName && schemaName) {
            const isQueryBuilder = tableName instanceof QueryBuilder;
            const isRawQuery = tableName instanceof Raw;
            const isFunction = typeof tableName === "function";
            if (!isQueryBuilder && !isRawQuery && !isFunction) {
              tableName = `${schemaName}.${tableName}`;
            }
          }
          this._tableName = tableName ? (
            // Wrap subQuery with parenthesis, #3485
            wrap_(
              tableName,
              tableName instanceof QueryBuilder,
              this.builder,
              this.client,
              this.bindingsHolder
            )
          ) : "";
        }
        return this._tableName;
      }
      _jsonPathWrap(extraction) {
        return this.client.parameter(
          extraction.path || extraction[1],
          this.builder,
          this.bindingsHolder
        );
      }
      // Json common functions
      _jsonExtract(nameFunction, params) {
        let extractions;
        if (Array.isArray(params.column)) {
          extractions = params.column;
        } else {
          extractions = [params];
        }
        if (!Array.isArray(nameFunction)) {
          nameFunction = [nameFunction];
        }
        return extractions.map((extraction) => {
          let jsonCol = `${columnize_(
            extraction.column || extraction[0],
            this.builder,
            this.client,
            this.bindingsHolder
          )}, ${this._jsonPathWrap(extraction)}`;
          nameFunction.forEach((f) => {
            jsonCol = f + "(" + jsonCol + ")";
          });
          const alias = extraction.alias || extraction[2];
          return alias ? this.client.alias(jsonCol, this.formatter.wrap(alias)) : jsonCol;
        }).join(", ");
      }
      _jsonSet(nameFunction, params) {
        const jsonSet = `${nameFunction}(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )}, ${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )}, ${this.client.parameter(
          params.value,
          this.builder,
          this.bindingsHolder
        )})`;
        return params.alias ? this.client.alias(jsonSet, this.formatter.wrap(params.alias)) : jsonSet;
      }
      _whereJsonPath(nameFunction, statement) {
        return `${nameFunction}(${this._columnClause(
          statement
        )}, ${this._jsonPathWrap({ path: statement.jsonPath })}) ${operator_(
          statement.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        )} ${this._jsonValueClause(statement)}`;
      }
      _onJsonPathEquals(nameJoinFunction, clause) {
        return nameJoinFunction + "(" + wrap_(
          clause.columnFirst,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ", " + this.client.parameter(
          clause.jsonPathFirst,
          this.builder,
          this.bindingsHolder
        ) + ") = " + nameJoinFunction + "(" + wrap_(
          clause.columnSecond,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ", " + this.client.parameter(
          clause.jsonPathSecond,
          this.builder,
          this.bindingsHolder
        ) + ")";
      }
    };
    module2.exports = QueryCompiler;
  }
});

// node_modules/knex/lib/schema/builder.js
var require_builder = __commonJS({
  "node_modules/knex/lib/schema/builder.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("events");
    var toArray = require_toArray();
    var assign = require_assign();
    var { addQueryContext } = require_helpers();
    var saveAsyncStack = require_save_async_stack();
    var {
      augmentWithBuilderInterface
    } = require_builder_interface_augmenter();
    var SchemaBuilder = class extends EventEmitter {
      constructor(client) {
        super();
        this.client = client;
        this._sequence = [];
        if (client.config) {
          this._debug = client.config.debug;
          saveAsyncStack(this, 4);
        }
      }
      withSchema(schemaName) {
        this._schema = schemaName;
        return this;
      }
      toString() {
        return this.toQuery();
      }
      toSQL() {
        return this.client.schemaCompiler(this).toSQL();
      }
      async generateDdlCommands() {
        return await this.client.schemaCompiler(this).generateDdlCommands();
      }
    };
    [
      "createTable",
      "createTableIfNotExists",
      "createTableLike",
      "createView",
      "createViewOrReplace",
      "createMaterializedView",
      "refreshMaterializedView",
      "dropView",
      "dropViewIfExists",
      "dropMaterializedView",
      "dropMaterializedViewIfExists",
      "createSchema",
      "createSchemaIfNotExists",
      "dropSchema",
      "dropSchemaIfExists",
      "createExtension",
      "createExtensionIfNotExists",
      "dropExtension",
      "dropExtensionIfExists",
      "table",
      "alterTable",
      "view",
      "alterView",
      "hasTable",
      "hasColumn",
      "dropTable",
      "renameTable",
      "renameView",
      "dropTableIfExists",
      "raw"
    ].forEach(function(method) {
      SchemaBuilder.prototype[method] = function() {
        if (method === "createTableIfNotExists") {
          this.client.logger.warn(
            [
              "Use async .hasTable to check if table exists and then use plain .createTable. Since ",
              '.createTableIfNotExists actually just generates plain "CREATE TABLE IF NOT EXIST..." ',
              "query it will not work correctly if there are any alter table queries generated for ",
              "columns afterwards. To not break old migrations this function is left untouched for now",
              ", but it should not be used when writing new code and it is removed from documentation."
            ].join("")
          );
        }
        if (method === "table") method = "alterTable";
        if (method === "view") method = "alterView";
        this._sequence.push({
          method,
          args: toArray(arguments)
        });
        return this;
      };
    });
    SchemaBuilder.extend = (methodName, fn) => {
      if (Object.prototype.hasOwnProperty.call(SchemaBuilder.prototype, methodName)) {
        throw new Error(
          `Can't extend SchemaBuilder with existing method ('${methodName}').`
        );
      }
      assign(SchemaBuilder.prototype, { [methodName]: fn });
    };
    augmentWithBuilderInterface(SchemaBuilder);
    addQueryContext(SchemaBuilder);
    module2.exports = SchemaBuilder;
  }
});

// node_modules/knex/lib/schema/internal/helpers.js
var require_helpers2 = __commonJS({
  "node_modules/knex/lib/schema/internal/helpers.js"(exports2, module2) {
    "use strict";
    var tail = require_tail();
    var { isString } = require_is();
    function pushQuery(query) {
      if (!query) return;
      if (isString(query)) {
        query = { sql: query };
      }
      if (!query.bindings) {
        query.bindings = this.bindingsHolder.bindings;
      }
      this.sequence.push(query);
      this.formatter = this.client.formatter(this._commonBuilder);
      this.bindings = [];
      this.formatter.bindings = this.bindings;
    }
    function pushAdditional(fn) {
      const child = new this.constructor(
        this.client,
        this.tableCompiler,
        this.columnBuilder
      );
      fn.call(child, tail(arguments));
      this.sequence.additional = (this.sequence.additional || []).concat(
        child.sequence
      );
    }
    function unshiftQuery(query) {
      if (!query) return;
      if (isString(query)) {
        query = { sql: query };
      }
      if (!query.bindings) {
        query.bindings = this.bindingsHolder.bindings;
      }
      this.sequence.unshift(query);
      this.formatter = this.client.formatter(this._commonBuilder);
      this.bindings = [];
      this.formatter.bindings = this.bindings;
    }
    module2.exports = {
      pushAdditional,
      pushQuery,
      unshiftQuery
    };
  }
});

// node_modules/knex/lib/schema/compiler.js
var require_compiler = __commonJS({
  "node_modules/knex/lib/schema/compiler.js"(exports2, module2) {
    "use strict";
    var {
      pushQuery,
      pushAdditional,
      unshiftQuery
    } = require_helpers2();
    var SchemaCompiler = class {
      constructor(client, builder) {
        this.builder = builder;
        this._commonBuilder = this.builder;
        this.client = client;
        this.schema = builder._schema;
        this.bindings = [];
        this.bindingsHolder = this;
        this.formatter = client.formatter(builder);
        this.formatter.bindings = this.bindings;
        this.sequence = [];
      }
      createSchema() {
        throwOnlyPGError("createSchema");
      }
      createSchemaIfNotExists() {
        throwOnlyPGError("createSchemaIfNotExists");
      }
      dropSchema() {
        throwOnlyPGError("dropSchema");
      }
      dropSchemaIfExists() {
        throwOnlyPGError("dropSchemaIfExists");
      }
      dropTable(tableName) {
        this.pushQuery(
          this.dropTablePrefix + this.formatter.wrap(prefixedTableName(this.schema, tableName))
        );
      }
      dropTableIfExists(tableName) {
        this.pushQuery(
          this.dropTablePrefix + "if exists " + this.formatter.wrap(prefixedTableName(this.schema, tableName))
        );
      }
      dropView(viewName) {
        this._dropView(viewName, false, false);
      }
      dropViewIfExists(viewName) {
        this._dropView(viewName, true, false);
      }
      dropMaterializedView(viewName) {
        throw new Error("materialized views are not supported by this dialect.");
      }
      dropMaterializedViewIfExists(viewName) {
        throw new Error("materialized views are not supported by this dialect.");
      }
      renameView(from, to) {
        throw new Error(
          "rename view is not supported by this dialect (instead drop then create another view)."
        );
      }
      refreshMaterializedView() {
        throw new Error("materialized views are not supported by this dialect.");
      }
      _dropView(viewName, ifExists, materialized) {
        this.pushQuery(
          (materialized ? this.dropMaterializedViewPrefix : this.dropViewPrefix) + (ifExists ? "if exists " : "") + this.formatter.wrap(prefixedTableName(this.schema, viewName))
        );
      }
      raw(sql, bindings) {
        this.sequence.push(this.client.raw(sql, bindings).toSQL());
      }
      toSQL() {
        const sequence = this.builder._sequence;
        for (let i = 0, l = sequence.length; i < l; i++) {
          const query = sequence[i];
          this[query.method].apply(this, query.args);
        }
        return this.sequence;
      }
      async generateDdlCommands() {
        const generatedCommands = this.toSQL();
        return {
          pre: [],
          sql: Array.isArray(generatedCommands) ? generatedCommands : [generatedCommands],
          check: null,
          post: []
        };
      }
    };
    SchemaCompiler.prototype.dropTablePrefix = "drop table ";
    SchemaCompiler.prototype.dropViewPrefix = "drop view ";
    SchemaCompiler.prototype.dropMaterializedViewPrefix = "drop materialized view ";
    SchemaCompiler.prototype.alterViewPrefix = "alter view ";
    SchemaCompiler.prototype.alterTable = buildTable("alter");
    SchemaCompiler.prototype.createTable = buildTable("create");
    SchemaCompiler.prototype.createTableIfNotExists = buildTable("createIfNot");
    SchemaCompiler.prototype.createTableLike = buildTable("createLike");
    SchemaCompiler.prototype.createView = buildView("create");
    SchemaCompiler.prototype.createViewOrReplace = buildView("createOrReplace");
    SchemaCompiler.prototype.createMaterializedView = buildView(
      "createMaterializedView"
    );
    SchemaCompiler.prototype.alterView = buildView("alter");
    SchemaCompiler.prototype.pushQuery = pushQuery;
    SchemaCompiler.prototype.pushAdditional = pushAdditional;
    SchemaCompiler.prototype.unshiftQuery = unshiftQuery;
    function build(builder) {
      const queryContext = this.builder.queryContext();
      if (queryContext !== void 0 && builder.queryContext() === void 0) {
        builder.queryContext(queryContext);
      }
      builder.setSchema(this.schema);
      const sql = builder.toSQL();
      for (let i = 0, l = sql.length; i < l; i++) {
        this.sequence.push(sql[i]);
      }
    }
    function buildTable(type) {
      if (type === "createLike") {
        return function(tableName, tableNameLike, fn) {
          const builder = this.client.tableBuilder(
            type,
            tableName,
            tableNameLike,
            fn
          );
          build.call(this, builder);
        };
      } else {
        return function(tableName, fn) {
          const builder = this.client.tableBuilder(type, tableName, null, fn);
          build.call(this, builder);
        };
      }
    }
    function buildView(type) {
      return function(viewName, fn) {
        const builder = this.client.viewBuilder(type, viewName, fn);
        build.call(this, builder);
      };
    }
    function prefixedTableName(prefix, table) {
      return prefix ? `${prefix}.${table}` : table;
    }
    function throwOnlyPGError(operationName) {
      throw new Error(
        `${operationName} is not supported for this dialect (only PostgreSQL supports it currently).`
      );
    }
    module2.exports = SchemaCompiler;
  }
});

// node_modules/lodash/assignIn.js
var require_assignIn = __commonJS({
  "node_modules/lodash/assignIn.js"(exports2, module2) {
    "use strict";
    var copyObject = require_copyObject();
    var createAssigner = require_createAssigner();
    var keysIn = require_keysIn();
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });
    module2.exports = assignIn;
  }
});

// node_modules/lodash/extend.js
var require_extend = __commonJS({
  "node_modules/lodash/extend.js"(exports2, module2) {
    "use strict";
    module2.exports = require_assignIn();
  }
});

// node_modules/knex/lib/schema/tablebuilder.js
var require_tablebuilder = __commonJS({
  "node_modules/knex/lib/schema/tablebuilder.js"(exports2, module2) {
    "use strict";
    var each = require_each();
    var extend = require_extend();
    var assign = require_assign();
    var toArray = require_toArray();
    var helpers = require_helpers();
    var { isString, isFunction, isObject } = require_is();
    var TableBuilder = class {
      constructor(client, method, tableName, tableNameLike, fn) {
        this.client = client;
        this._fn = fn;
        this._method = method;
        this._schemaName = void 0;
        this._tableName = tableName;
        this._tableNameLike = tableNameLike;
        this._statements = [];
        this._single = {};
        if (!tableNameLike && !isFunction(this._fn)) {
          throw new TypeError(
            "A callback function must be supplied to calls against `.createTable` and `.table`"
          );
        }
      }
      setSchema(schemaName) {
        this._schemaName = schemaName;
      }
      // Convert the current tableBuilder object "toSQL"
      // giving us additional methods if we're altering
      // rather than creating the table.
      toSQL() {
        if (this._method === "alter") {
          extend(this, AlterMethods);
        }
        if (this._fn) {
          this._fn.call(this, this);
        }
        return this.client.tableCompiler(this).toSQL();
      }
      // The "timestamps" call is really just sets the `created_at` and `updated_at` columns.
      timestamps(useTimestamps, defaultToNow, useCamelCase) {
        if (isObject(useTimestamps)) {
          ({ useTimestamps, defaultToNow, useCamelCase } = useTimestamps);
        }
        const method = useTimestamps === true ? "timestamp" : "datetime";
        const createdAt = this[method](useCamelCase ? "createdAt" : "created_at");
        const updatedAt = this[method](useCamelCase ? "updatedAt" : "updated_at");
        if (defaultToNow === true) {
          const now = this.client.raw("CURRENT_TIMESTAMP");
          createdAt.notNullable().defaultTo(now);
          updatedAt.notNullable().defaultTo(now);
        }
      }
      // Set the comment value for a table, they're only allowed to be called
      // once per table.
      comment(value) {
        if (typeof value !== "string") {
          throw new TypeError("Table comment must be string");
        }
        this._single.comment = value;
      }
      // Set a foreign key on the table, calling
      // `table.foreign('column_name').references('column').on('table').onDelete()...
      // Also called from the ColumnBuilder context when chaining.
      foreign(column, keyName) {
        const foreignData = { column, keyName };
        this._statements.push({
          grouping: "alterTable",
          method: "foreign",
          args: [foreignData]
        });
        let returnObj = {
          references(tableColumn) {
            let pieces;
            if (isString(tableColumn)) {
              pieces = tableColumn.split(".");
            }
            if (!pieces || pieces.length === 1) {
              foreignData.references = pieces ? pieces[0] : tableColumn;
              return {
                on(tableName) {
                  if (typeof tableName !== "string") {
                    throw new TypeError(
                      `Expected tableName to be a string, got: ${typeof tableName}`
                    );
                  }
                  foreignData.inTable = tableName;
                  return returnObj;
                },
                inTable() {
                  return this.on.apply(this, arguments);
                }
              };
            }
            foreignData.inTable = pieces[0];
            foreignData.references = pieces[1];
            return returnObj;
          },
          withKeyName(keyName2) {
            foreignData.keyName = keyName2;
            return returnObj;
          },
          onUpdate(statement) {
            foreignData.onUpdate = statement;
            return returnObj;
          },
          onDelete(statement) {
            foreignData.onDelete = statement;
            return returnObj;
          },
          deferrable: (type) => {
            const unSupported = [
              "mysql",
              "mssql",
              "redshift",
              "mysql2",
              "oracledb"
            ];
            if (unSupported.indexOf(this.client.dialect) !== -1) {
              throw new Error(`${this.client.dialect} does not support deferrable`);
            }
            foreignData.deferrable = type;
            return returnObj;
          },
          _columnBuilder(builder) {
            extend(builder, returnObj);
            returnObj = builder;
            return builder;
          }
        };
        return returnObj;
      }
      check(checkPredicate, bindings, constraintName) {
        this._statements.push({
          grouping: "checks",
          args: [checkPredicate, bindings, constraintName]
        });
        return this;
      }
    };
    [
      // Each of the index methods can be called individually, with the
      // column name to be used, e.g. table.unique('column').
      "index",
      "primary",
      "unique",
      // Key specific
      "dropPrimary",
      "dropUnique",
      "dropIndex",
      "dropForeign"
    ].forEach((method) => {
      TableBuilder.prototype[method] = function() {
        this._statements.push({
          grouping: "alterTable",
          method,
          args: toArray(arguments)
        });
        return this;
      };
    });
    var specialMethods = {
      mysql: ["engine", "charset", "collate"],
      postgresql: ["inherits"]
    };
    each(specialMethods, function(methods, dialect) {
      methods.forEach(function(method) {
        TableBuilder.prototype[method] = function(value) {
          if (this.client.dialect !== dialect) {
            throw new Error(
              `Knex only supports ${method} statement with ${dialect}.`
            );
          }
          if (this._method === "alter") {
            throw new Error(
              `Knex does not support altering the ${method} outside of create table, please use knex.raw statement.`
            );
          }
          this._single[method] = value;
        };
      });
    });
    helpers.addQueryContext(TableBuilder);
    var columnTypes = [
      // Numeric
      "tinyint",
      "smallint",
      "mediumint",
      "int",
      "bigint",
      "decimal",
      "float",
      "double",
      "real",
      "bit",
      "boolean",
      "serial",
      // Date / Time
      "date",
      "datetime",
      "timestamp",
      "time",
      "year",
      // Geometry
      "geometry",
      "geography",
      "point",
      // String
      "char",
      "varchar",
      "tinytext",
      "tinyText",
      "text",
      "mediumtext",
      "mediumText",
      "longtext",
      "longText",
      "binary",
      "varbinary",
      "tinyblob",
      "tinyBlob",
      "mediumblob",
      "mediumBlob",
      "blob",
      "longblob",
      "longBlob",
      "enum",
      "set",
      // Increments, Aliases, and Additional
      "bool",
      "dateTime",
      "increments",
      "bigincrements",
      "bigIncrements",
      "integer",
      "biginteger",
      "bigInteger",
      "string",
      "json",
      "jsonb",
      "uuid",
      "enu",
      "specificType"
    ];
    columnTypes.forEach((type) => {
      TableBuilder.prototype[type] = function() {
        const args = toArray(arguments);
        const builder = this.client.columnBuilder(this, type, args);
        this._statements.push({
          grouping: "columns",
          builder
        });
        return builder;
      };
    });
    var AlterMethods = {
      // Renames the current column `from` the current
      // TODO: this.column(from).rename(to)
      renameColumn(from, to) {
        this._statements.push({
          grouping: "alterTable",
          method: "renameColumn",
          args: [from, to]
        });
        return this;
      },
      dropTimestamps() {
        return this.dropColumns(
          arguments[0] === true ? ["createdAt", "updatedAt"] : ["created_at", "updated_at"]
        );
      },
      setNullable(column) {
        this._statements.push({
          grouping: "alterTable",
          method: "setNullable",
          args: [column]
        });
        return this;
      },
      check(checkPredicate, bindings, constraintName) {
        this._statements.push({
          grouping: "alterTable",
          method: "check",
          args: [checkPredicate, bindings, constraintName]
        });
      },
      dropChecks() {
        this._statements.push({
          grouping: "alterTable",
          method: "dropChecks",
          args: toArray(arguments)
        });
      },
      dropNullable(column) {
        this._statements.push({
          grouping: "alterTable",
          method: "dropNullable",
          args: [column]
        });
        return this;
      }
      // TODO: changeType
    };
    AlterMethods.dropColumn = AlterMethods.dropColumns = function() {
      this._statements.push({
        grouping: "alterTable",
        method: "dropColumn",
        args: toArray(arguments)
      });
      return this;
    };
    TableBuilder.extend = (methodName, fn) => {
      if (Object.prototype.hasOwnProperty.call(TableBuilder.prototype, methodName)) {
        throw new Error(
          `Can't extend TableBuilder with existing method ('${methodName}').`
        );
      }
      assign(TableBuilder.prototype, { [methodName]: fn });
    };
    module2.exports = TableBuilder;
  }
});

// node_modules/lodash/indexOf.js
var require_indexOf = __commonJS({
  "node_modules/lodash/indexOf.js"(exports2, module2) {
    "use strict";
    var baseIndexOf = require_baseIndexOf();
    var toInteger = require_toInteger();
    var nativeMax = Math.max;
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }
    module2.exports = indexOf;
  }
});

// node_modules/knex/lib/schema/tablecompiler.js
var require_tablecompiler = __commonJS({
  "node_modules/knex/lib/schema/tablecompiler.js"(exports2, module2) {
    "use strict";
    var {
      pushAdditional,
      pushQuery,
      unshiftQuery
    } = require_helpers2();
    var helpers = require_helpers();
    var groupBy = require_groupBy();
    var indexOf = require_indexOf();
    var isEmpty = require_isEmpty();
    var tail = require_tail();
    var { normalizeArr } = require_helpers();
    var TableCompiler = class {
      constructor(client, tableBuilder) {
        this.client = client;
        this.tableBuilder = tableBuilder;
        this._commonBuilder = this.tableBuilder;
        this.method = tableBuilder._method;
        this.schemaNameRaw = tableBuilder._schemaName;
        this.tableNameRaw = tableBuilder._tableName;
        this.tableNameLikeRaw = tableBuilder._tableNameLike;
        this.single = tableBuilder._single;
        this.grouped = groupBy(tableBuilder._statements, "grouping");
        this.formatter = client.formatter(tableBuilder);
        this.bindings = [];
        this.formatter.bindings = this.bindings;
        this.bindingsHolder = this;
        this.sequence = [];
        this._formatting = client.config && client.config.formatting;
        this.checksCount = 0;
      }
      // Convert the tableCompiler toSQL
      toSQL() {
        this[this.method]();
        return this.sequence;
      }
      // Column Compilation
      // -------
      // If this is a table "creation", we need to first run through all
      // of the columns to build them into a single string,
      // and then run through anything else and push it to the query sequence.
      create(ifNot, like) {
        const columnBuilders = this.getColumns();
        const columns = columnBuilders.map((col) => col.toSQL());
        const columnTypes = this.getColumnTypes(columns);
        if (this.createAlterTableMethods) {
          this.alterTableForCreate(columnTypes);
        }
        this.createQuery(columnTypes, ifNot, like);
        this.columnQueries(columns);
        delete this.single.comment;
        this.alterTable();
      }
      // Only create the table if it doesn't exist.
      createIfNot() {
        this.create(true);
      }
      createLike() {
        this.create(false, true);
      }
      createLikeIfNot() {
        this.create(true, true);
      }
      // If we're altering the table, we need to one-by-one
      // go through and handle each of the queries associated
      // with altering the table's schema.
      alter() {
        const addColBuilders = this.getColumns();
        const addColumns = addColBuilders.map((col) => col.toSQL());
        const alterColBuilders = this.getColumns("alter");
        const alterColumns = alterColBuilders.map((col) => col.toSQL());
        const addColumnTypes = this.getColumnTypes(addColumns);
        const alterColumnTypes = this.getColumnTypes(alterColumns);
        this.addColumns(addColumnTypes);
        this.alterColumns(alterColumnTypes, alterColBuilders);
        this.columnQueries(addColumns);
        this.columnQueries(alterColumns);
        this.alterTable();
      }
      foreign(foreignData) {
        if (foreignData.inTable && foreignData.references) {
          const keyName = foreignData.keyName ? this.formatter.wrap(foreignData.keyName) : this._indexCommand("foreign", this.tableNameRaw, foreignData.column);
          const column = this.formatter.columnize(foreignData.column);
          const references = this.formatter.columnize(foreignData.references);
          const inTable = this.formatter.wrap(foreignData.inTable);
          const onUpdate = foreignData.onUpdate ? (this.lowerCase ? " on update " : " ON UPDATE ") + foreignData.onUpdate : "";
          const onDelete = foreignData.onDelete ? (this.lowerCase ? " on delete " : " ON DELETE ") + foreignData.onDelete : "";
          const deferrable = foreignData.deferrable ? this.lowerCase ? ` deferrable initially ${foreignData.deferrable.toLowerCase()} ` : ` DEFERRABLE INITIALLY ${foreignData.deferrable.toUpperCase()} ` : "";
          if (this.lowerCase) {
            this.pushQuery(
              (!this.forCreate ? `alter table ${this.tableName()} add ` : "") + "constraint " + keyName + " foreign key (" + column + ") references " + inTable + " (" + references + ")" + onUpdate + onDelete + deferrable
            );
          } else {
            this.pushQuery(
              (!this.forCreate ? `ALTER TABLE ${this.tableName()} ADD ` : "") + "CONSTRAINT " + keyName + " FOREIGN KEY (" + column + ") REFERENCES " + inTable + " (" + references + ")" + onUpdate + onDelete + deferrable
            );
          }
        }
      }
      // Get all of the column sql & bindings individually for building the table queries.
      getColumnTypes(columns) {
        return columns.reduce(
          function(memo, columnSQL) {
            const column = columnSQL[0];
            memo.sql.push(column.sql);
            memo.bindings.concat(column.bindings);
            return memo;
          },
          { sql: [], bindings: [] }
        );
      }
      // Adds all of the additional queries from the "column"
      columnQueries(columns) {
        const queries = columns.reduce(function(memo, columnSQL) {
          const column = tail(columnSQL);
          if (!isEmpty(column)) return memo.concat(column);
          return memo;
        }, []);
        for (const q of queries) {
          this.pushQuery(q);
        }
      }
      // All of the columns to "add" for the query
      addColumns(columns, prefix) {
        prefix = prefix || this.addColumnsPrefix;
        if (columns.sql.length > 0) {
          const columnSql = columns.sql.map((column) => {
            return prefix + column;
          });
          this.pushQuery({
            sql: (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + columnSql.join(", "),
            bindings: columns.bindings
          });
        }
      }
      alterColumns(columns, colBuilders) {
        if (columns.sql.length > 0) {
          this.addColumns(columns, this.alterColumnsPrefix, colBuilders);
        }
      }
      // Compile the columns as needed for the current create or alter table
      getColumns(method) {
        const columns = this.grouped.columns || [];
        method = method || "add";
        const queryContext = this.tableBuilder.queryContext();
        return columns.filter((column) => column.builder._method === method).map((column) => {
          if (queryContext !== void 0 && column.builder.queryContext() === void 0) {
            column.builder.queryContext(queryContext);
          }
          return this.client.columnCompiler(this, column.builder);
        });
      }
      tableName() {
        const name = this.schemaNameRaw ? `${this.schemaNameRaw}.${this.tableNameRaw}` : this.tableNameRaw;
        return this.formatter.wrap(name);
      }
      tableNameLike() {
        const name = this.schemaNameRaw ? `${this.schemaNameRaw}.${this.tableNameLikeRaw}` : this.tableNameLikeRaw;
        return this.formatter.wrap(name);
      }
      // Generate all of the alter column statements necessary for the query.
      alterTable() {
        const alterTable = this.grouped.alterTable || [];
        for (let i = 0, l = alterTable.length; i < l; i++) {
          const statement = alterTable[i];
          if (this[statement.method]) {
            this[statement.method].apply(this, statement.args);
          } else {
            this.client.logger.error(`Debug: ${statement.method} does not exist`);
          }
        }
        for (const item in this.single) {
          if (typeof this[item] === "function") this[item](this.single[item]);
        }
      }
      alterTableForCreate(columnTypes) {
        this.forCreate = true;
        const savedSequence = this.sequence;
        const alterTable = this.grouped.alterTable || [];
        this.grouped.alterTable = [];
        for (let i = 0, l = alterTable.length; i < l; i++) {
          const statement = alterTable[i];
          if (indexOf(this.createAlterTableMethods, statement.method) < 0) {
            this.grouped.alterTable.push(statement);
            continue;
          }
          if (this[statement.method]) {
            this.sequence = [];
            this[statement.method].apply(this, statement.args);
            columnTypes.sql.push(this.sequence[0].sql);
          } else {
            this.client.logger.error(`Debug: ${statement.method} does not exist`);
          }
        }
        this.sequence = savedSequence;
        this.forCreate = false;
      }
      // Drop the index on the current table.
      dropIndex(value) {
        this.pushQuery(`drop index${value}`);
      }
      dropUnique() {
        throw new Error("Method implemented in the dialect driver");
      }
      dropForeign() {
        throw new Error("Method implemented in the dialect driver");
      }
      dropColumn() {
        const columns = helpers.normalizeArr.apply(null, arguments);
        const drops = (Array.isArray(columns) ? columns : [columns]).map(
          (column) => {
            return this.dropColumnPrefix + this.formatter.wrap(column);
          }
        );
        this.pushQuery(
          (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + drops.join(", ")
        );
      }
      //Default implementation of setNullable. Overwrite on dialect-specific tablecompiler when needed
      //(See postgres/mssql for reference)
      _setNullableState(column, nullable) {
        const tableName = this.tableName();
        const columnName = this.formatter.columnize(column);
        const alterColumnPrefix = this.alterColumnsPrefix;
        return this.pushQuery({
          sql: "SELECT 1",
          output: () => {
            return this.client.queryBuilder().from(this.tableNameRaw).columnInfo(column).then((columnInfo) => {
              if (isEmpty(columnInfo)) {
                throw new Error(
                  `.setNullable: Column ${columnName} does not exist in table ${tableName}.`
                );
              }
              const nullableType = nullable ? "null" : "not null";
              const columnType = columnInfo.type + (columnInfo.maxLength ? `(${columnInfo.maxLength})` : "");
              const defaultValue = columnInfo.defaultValue !== null && columnInfo.defaultValue !== void 0 ? `default '${columnInfo.defaultValue}'` : "";
              const sql = `alter table ${tableName} ${alterColumnPrefix} ${columnName} ${columnType} ${nullableType} ${defaultValue}`;
              return this.client.raw(sql);
            });
          }
        });
      }
      setNullable(column) {
        return this._setNullableState(column, true);
      }
      dropNullable(column) {
        return this._setNullableState(column, false);
      }
      dropChecks(checkConstraintNames) {
        if (checkConstraintNames === void 0) return "";
        checkConstraintNames = normalizeArr(checkConstraintNames);
        const tableName = this.tableName();
        const sql = `alter table ${tableName} ${checkConstraintNames.map((constraint) => `drop constraint ${constraint}`).join(", ")}`;
        this.pushQuery(sql);
      }
      check(checkPredicate, bindings, constraintName) {
        const tableName = this.tableName();
        let checkConstraint = constraintName;
        if (!checkConstraint) {
          this.checksCount++;
          checkConstraint = tableName + "_" + this.checksCount;
        }
        const sql = `alter table ${tableName} add constraint ${checkConstraint} check(${checkPredicate})`;
        this.pushQuery(sql);
      }
      _addChecks() {
        if (this.grouped.checks) {
          return ", " + this.grouped.checks.map((c) => {
            return `${c.args[2] ? "constraint " + c.args[2] + " " : ""}check (${this.client.raw(c.args[0], c.args[1])})`;
          }).join(", ");
        }
        return "";
      }
      // If no name was specified for this index, we will create one using a basic
      // convention of the table name, followed by the columns, followed by an
      // index type, such as primary or index, which makes the index unique.
      _indexCommand(type, tableName, columns) {
        if (!Array.isArray(columns)) columns = columns ? [columns] : [];
        const table = tableName.replace(/\.|-/g, "_");
        const indexName = (table + "_" + columns.join("_") + "_" + type).toLowerCase();
        return this.formatter.wrap(indexName);
      }
      _getPrimaryKeys() {
        return (this.grouped.alterTable || []).filter((a) => a.method === "primary").flatMap((a) => a.args).flat();
      }
      _canBeAddPrimaryKey(options) {
        return options.primaryKey && this._getPrimaryKeys().length === 0;
      }
      _getIncrementsColumnNames() {
        return this.grouped.columns.filter((c) => c.builder._type === "increments").map((c) => c.builder._args[0]);
      }
      _getBigIncrementsColumnNames() {
        return this.grouped.columns.filter((c) => c.builder._type === "bigincrements").map((c) => c.builder._args[0]);
      }
    };
    TableCompiler.prototype.pushQuery = pushQuery;
    TableCompiler.prototype.pushAdditional = pushAdditional;
    TableCompiler.prototype.unshiftQuery = unshiftQuery;
    TableCompiler.prototype.lowerCase = true;
    TableCompiler.prototype.createAlterTableMethods = null;
    TableCompiler.prototype.addColumnsPrefix = "add column ";
    TableCompiler.prototype.alterColumnsPrefix = "alter column ";
    TableCompiler.prototype.modifyColumnPrefix = "modify column ";
    TableCompiler.prototype.dropColumnPrefix = "drop column ";
    module2.exports = TableCompiler;
  }
});

// node_modules/knex/lib/schema/columnbuilder.js
var require_columnbuilder = __commonJS({
  "node_modules/knex/lib/schema/columnbuilder.js"(exports2, module2) {
    "use strict";
    var extend = require_extend();
    var assign = require_assign();
    var toArray = require_toArray();
    var { addQueryContext } = require_helpers();
    var ColumnBuilder = class {
      constructor(client, tableBuilder, type, args) {
        this.client = client;
        this._method = "add";
        this._single = {};
        this._modifiers = {};
        this._statements = [];
        this._type = columnAlias[type] || type;
        this._args = args;
        this._tableBuilder = tableBuilder;
        if (tableBuilder._method === "alter") {
          extend(this, AlterMethods);
        }
      }
      // Specify that the current column "references" a column,
      // which may be tableName.column or just "column"
      references(value) {
        return this._tableBuilder.foreign.call(this._tableBuilder, this._args[0], void 0, this)._columnBuilder(this).references(value);
      }
    };
    var modifiers = [
      "default",
      "defaultsTo",
      "defaultTo",
      "unsigned",
      "nullable",
      "first",
      "after",
      "comment",
      "collate",
      "check",
      "checkPositive",
      "checkNegative",
      "checkIn",
      "checkNotIn",
      "checkBetween",
      "checkLength",
      "checkRegex"
    ];
    var aliasMethod = {
      default: "defaultTo",
      defaultsTo: "defaultTo"
    };
    modifiers.forEach(function(method) {
      const key = aliasMethod[method] || method;
      ColumnBuilder.prototype[method] = function() {
        this._modifiers[key] = toArray(arguments);
        return this;
      };
    });
    addQueryContext(ColumnBuilder);
    ColumnBuilder.prototype.notNull = ColumnBuilder.prototype.notNullable = function notNullable() {
      return this.nullable(false);
    };
    ["index", "primary", "unique"].forEach(function(method) {
      ColumnBuilder.prototype[method] = function() {
        if (this._type.toLowerCase().indexOf("increments") === -1) {
          this._tableBuilder[method].apply(
            this._tableBuilder,
            [this._args[0]].concat(toArray(arguments))
          );
        }
        return this;
      };
    });
    ColumnBuilder.extend = (methodName, fn) => {
      if (Object.prototype.hasOwnProperty.call(ColumnBuilder.prototype, methodName)) {
        throw new Error(
          `Can't extend ColumnBuilder with existing method ('${methodName}').`
        );
      }
      assign(ColumnBuilder.prototype, { [methodName]: fn });
    };
    var AlterMethods = {};
    AlterMethods.drop = function() {
      this._single.drop = true;
      return this;
    };
    AlterMethods.alterType = function(type) {
      this._statements.push({
        grouping: "alterType",
        value: type
      });
      return this;
    };
    AlterMethods.alter = function({
      alterNullable = true,
      alterType = true
    } = {}) {
      this._method = "alter";
      this.alterNullable = alterNullable;
      this.alterType = alterType;
      return this;
    };
    var columnAlias = {
      float: "floating",
      enum: "enu",
      boolean: "bool",
      string: "varchar",
      bigint: "bigInteger"
    };
    module2.exports = ColumnBuilder;
  }
});

// node_modules/lodash/head.js
var require_head = __commonJS({
  "node_modules/lodash/head.js"(exports2, module2) {
    "use strict";
    function head(array) {
      return array && array.length ? array[0] : void 0;
    }
    module2.exports = head;
  }
});

// node_modules/lodash/first.js
var require_first = __commonJS({
  "node_modules/lodash/first.js"(exports2, module2) {
    "use strict";
    module2.exports = require_head();
  }
});

// node_modules/knex/lib/schema/columncompiler.js
var require_columncompiler = __commonJS({
  "node_modules/knex/lib/schema/columncompiler.js"(exports2, module2) {
    "use strict";
    var helpers = require_helpers2();
    var groupBy = require_groupBy();
    var first = require_first();
    var has = require_has();
    var tail = require_tail();
    var { toNumber } = require_helpers();
    var { formatDefault } = require_formatterUtils();
    var { operator: operator_ } = require_wrappingFormatter();
    var ColumnCompiler = class {
      constructor(client, tableCompiler, columnBuilder) {
        this.client = client;
        this.tableCompiler = tableCompiler;
        this.columnBuilder = columnBuilder;
        this._commonBuilder = this.columnBuilder;
        this.args = columnBuilder._args;
        this.type = columnBuilder._type.toLowerCase();
        this.grouped = groupBy(columnBuilder._statements, "grouping");
        this.modified = columnBuilder._modifiers;
        this.isIncrements = this.type.indexOf("increments") !== -1;
        this.formatter = client.formatter(columnBuilder);
        this.bindings = [];
        this.formatter.bindings = this.bindings;
        this.bindingsHolder = this;
        this.sequence = [];
        this.modifiers = [];
        this.checksCount = 0;
      }
      _addCheckModifiers() {
        this.modifiers.push(
          "check",
          "checkPositive",
          "checkNegative",
          "checkIn",
          "checkNotIn",
          "checkBetween",
          "checkLength",
          "checkRegex"
        );
      }
      defaults(label) {
        if (Object.prototype.hasOwnProperty.call(this._defaultMap, label)) {
          return this._defaultMap[label].bind(this)();
        } else {
          throw new Error(
            `There is no default for the specified identifier ${label}`
          );
        }
      }
      // To convert to sql, we first go through and build the
      // column as it would be in the insert statement
      toSQL() {
        this.pushQuery(this.compileColumn());
        if (this.sequence.additional) {
          this.sequence = this.sequence.concat(this.sequence.additional);
        }
        return this.sequence;
      }
      // Compiles a column.
      compileColumn() {
        return this.formatter.wrap(this.getColumnName()) + " " + this.getColumnType() + this.getModifiers();
      }
      // Assumes the autoincrementing key is named `id` if not otherwise specified.
      getColumnName() {
        const value = first(this.args);
        return value || this.defaults("columnName");
      }
      getColumnType() {
        if (!this._columnType) {
          const type = this[this.type];
          this._columnType = typeof type === "function" ? type.apply(this, tail(this.args)) : type;
        }
        return this._columnType;
      }
      getModifiers() {
        const modifiers = [];
        for (let i = 0, l = this.modifiers.length; i < l; i++) {
          const modifier = this.modifiers[i];
          if (!this.isIncrements || this.isIncrements && modifier === "comment") {
            if (has(this.modified, modifier)) {
              const val = this[modifier].apply(this, this.modified[modifier]);
              if (val) modifiers.push(val);
            }
          }
        }
        return modifiers.length > 0 ? ` ${modifiers.join(" ")}` : "";
      }
      // Types
      // ------
      varchar(length) {
        return `varchar(${toNumber(length, 255)})`;
      }
      floating(precision, scale) {
        return `float(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
      }
      decimal(precision, scale) {
        if (precision === null) {
          throw new Error(
            "Specifying no precision on decimal columns is not supported for that SQL dialect."
          );
        }
        return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
      }
      // Used to support custom types
      specifictype(type) {
        return type;
      }
      // Modifiers
      // -------
      nullable(nullable) {
        return nullable === false ? "not null" : "null";
      }
      notNullable() {
        return this.nullable(false);
      }
      defaultTo(value) {
        return `default ${formatDefault(value, this.type, this.client)}`;
      }
      increments(options = { primaryKey: true }) {
        return "integer not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "") + " autoincrement";
      }
      bigincrements(options = { primaryKey: true }) {
        return this.increments(options);
      }
      _pushAlterCheckQuery(checkPredicate, constraintName) {
        let checkName = constraintName;
        if (!checkName) {
          this.checksCount++;
          checkName = this.tableCompiler.tableNameRaw + "_" + this.getColumnName() + "_" + this.checksCount;
        }
        this.pushAdditional(function() {
          this.pushQuery(
            `alter table ${this.tableCompiler.tableName()} add constraint ${checkName} check(${checkPredicate})`
          );
        });
      }
      _checkConstraintName(constraintName) {
        return constraintName ? `constraint ${constraintName} ` : "";
      }
      _check(checkPredicate, constraintName) {
        if (this.columnBuilder._method === "alter") {
          this._pushAlterCheckQuery(checkPredicate, constraintName);
          return "";
        }
        return `${this._checkConstraintName(
          constraintName
        )}check (${checkPredicate})`;
      }
      checkPositive(constraintName) {
        return this._check(
          `${this.formatter.wrap(this.getColumnName())} ${operator_(
            ">",
            this.columnBuilder,
            this.bindingsHolder
          )} 0`,
          constraintName
        );
      }
      checkNegative(constraintName) {
        return this._check(
          `${this.formatter.wrap(this.getColumnName())} ${operator_(
            "<",
            this.columnBuilder,
            this.bindingsHolder
          )} 0`,
          constraintName
        );
      }
      _checkIn(values, constraintName, not) {
        return this._check(
          `${this.formatter.wrap(this.getColumnName())} ${not ? "not " : ""}in (${values.map((v) => this.client._escapeBinding(v)).join(",")})`,
          constraintName
        );
      }
      checkIn(values, constraintName) {
        return this._checkIn(values, constraintName);
      }
      checkNotIn(values, constraintName) {
        return this._checkIn(values, constraintName, true);
      }
      checkBetween(intervals, constraintName) {
        if (intervals.length === 2 && !Array.isArray(intervals[0]) && !Array.isArray(intervals[1])) {
          intervals = [intervals];
        }
        const intervalChecks = intervals.map((interval) => {
          return `${this.formatter.wrap(
            this.getColumnName()
          )} between ${this.client._escapeBinding(
            interval[0]
          )} and ${this.client._escapeBinding(interval[1])}`;
        }).join(" or ");
        return this._check(intervalChecks, constraintName);
      }
      checkLength(operator, length, constraintName) {
        return this._check(
          `length(${this.formatter.wrap(this.getColumnName())}) ${operator_(
            operator,
            this.columnBuilder,
            this.bindingsHolder
          )} ${toNumber(length)}`,
          constraintName
        );
      }
    };
    ColumnCompiler.prototype.binary = "blob";
    ColumnCompiler.prototype.bool = "boolean";
    ColumnCompiler.prototype.date = "date";
    ColumnCompiler.prototype.datetime = "datetime";
    ColumnCompiler.prototype.time = "time";
    ColumnCompiler.prototype.timestamp = "timestamp";
    ColumnCompiler.prototype.geometry = "geometry";
    ColumnCompiler.prototype.geography = "geography";
    ColumnCompiler.prototype.point = "point";
    ColumnCompiler.prototype.enu = "varchar";
    ColumnCompiler.prototype.bit = ColumnCompiler.prototype.json = "text";
    ColumnCompiler.prototype.uuid = ({
      useBinaryUuid = false,
      primaryKey = false
    } = {}) => useBinaryUuid ? "binary(16)" : "char(36)";
    ColumnCompiler.prototype.integer = ColumnCompiler.prototype.smallint = ColumnCompiler.prototype.mediumint = "integer";
    ColumnCompiler.prototype.biginteger = "bigint";
    ColumnCompiler.prototype.text = "text";
    ColumnCompiler.prototype.tinyint = "tinyint";
    ColumnCompiler.prototype.pushQuery = helpers.pushQuery;
    ColumnCompiler.prototype.pushAdditional = helpers.pushAdditional;
    ColumnCompiler.prototype.unshiftQuery = helpers.unshiftQuery;
    ColumnCompiler.prototype._defaultMap = {
      columnName: function() {
        if (!this.isIncrements) {
          throw new Error(
            `You did not specify a column name for the ${this.type} column.`
          );
        }
        return "id";
      }
    };
    module2.exports = ColumnCompiler;
  }
});

// node_modules/knex/lib/ref.js
var require_ref = __commonJS({
  "node_modules/knex/lib/ref.js"(exports2, module2) {
    "use strict";
    var Raw = require_raw();
    var Ref = class extends Raw {
      constructor(client, ref) {
        super(client);
        this.ref = ref;
        this._schema = null;
        this._alias = null;
      }
      withSchema(schema) {
        this._schema = schema;
        return this;
      }
      as(alias) {
        this._alias = alias;
        return this;
      }
      toSQL() {
        const string = this._schema ? `${this._schema}.${this.ref}` : this.ref;
        const formatter = this.client.formatter(this);
        const ref = formatter.columnize(string);
        const sql = this._alias ? `${ref} as ${formatter.wrap(this._alias)}` : ref;
        this.set(sql, []);
        return super.toSQL(...arguments);
      }
    };
    module2.exports = Ref;
  }
});

// node_modules/knex/lib/formatter.js
var require_formatter = __commonJS({
  "node_modules/knex/lib/formatter.js"(exports2, module2) {
    "use strict";
    var {
      columnize: columnize_,
      wrap: wrap_
    } = require_wrappingFormatter();
    var Formatter = class {
      constructor(client, builder) {
        this.client = client;
        this.builder = builder;
        this.bindings = [];
      }
      // Accepts a string or array of columns to wrap as appropriate.
      columnize(target) {
        return columnize_(target, this.builder, this.client, this);
      }
      // Puts the appropriate wrapper around a value depending on the database
      // engine, unless it's a knex.raw value, in which case it's left alone.
      wrap(value, isParameter) {
        return wrap_(value, isParameter, this.builder, this.client, this);
      }
    };
    module2.exports = Formatter;
  }
});

// node_modules/knex/lib/schema/viewbuilder.js
var require_viewbuilder = __commonJS({
  "node_modules/knex/lib/schema/viewbuilder.js"(exports2, module2) {
    "use strict";
    var helpers = require_helpers();
    var extend = require_extend();
    var assign = require_assign();
    var ViewBuilder = class {
      constructor(client, method, viewName, fn) {
        this.client = client;
        this._method = method;
        this._schemaName = void 0;
        this._columns = void 0;
        this._fn = fn;
        this._viewName = viewName;
        this._statements = [];
        this._single = {};
      }
      setSchema(schemaName) {
        this._schemaName = schemaName;
      }
      columns(columns) {
        this._columns = columns;
      }
      as(selectQuery) {
        this._selectQuery = selectQuery;
      }
      checkOption() {
        throw new Error(
          "check option definition is not supported by this dialect."
        );
      }
      localCheckOption() {
        throw new Error(
          "check option definition is not supported by this dialect."
        );
      }
      cascadedCheckOption() {
        throw new Error(
          "check option definition is not supported by this dialect."
        );
      }
      toSQL() {
        if (this._method === "alter") {
          extend(this, AlterMethods);
        }
        this._fn.call(this, this);
        return this.client.viewCompiler(this).toSQL();
      }
    };
    var AlterMethods = {
      column(column) {
        const self2 = this;
        return {
          rename: function(newName) {
            self2._statements.push({
              grouping: "alterView",
              method: "renameColumn",
              args: [column, newName]
            });
            return this;
          },
          defaultTo: function(defaultValue) {
            self2._statements.push({
              grouping: "alterView",
              method: "defaultTo",
              args: [column, defaultValue]
            });
            return this;
          }
        };
      }
    };
    helpers.addQueryContext(ViewBuilder);
    ViewBuilder.extend = (methodName, fn) => {
      if (Object.prototype.hasOwnProperty.call(ViewBuilder.prototype, methodName)) {
        throw new Error(
          `Can't extend ViewBuilder with existing method ('${methodName}').`
        );
      }
      assign(ViewBuilder.prototype, { [methodName]: fn });
    };
    module2.exports = ViewBuilder;
  }
});

// node_modules/knex/lib/schema/viewcompiler.js
var require_viewcompiler = __commonJS({
  "node_modules/knex/lib/schema/viewcompiler.js"(exports2, module2) {
    "use strict";
    var { pushQuery } = require_helpers2();
    var groupBy = require_groupBy();
    var { columnize: columnize_ } = require_wrappingFormatter();
    var ViewCompiler = class {
      constructor(client, viewBuilder) {
        this.client = client;
        this.viewBuilder = viewBuilder;
        this._commonBuilder = this.viewBuilder;
        this.method = viewBuilder._method;
        this.schemaNameRaw = viewBuilder._schemaName;
        this.viewNameRaw = viewBuilder._viewName;
        this.single = viewBuilder._single;
        this.selectQuery = viewBuilder._selectQuery;
        this.columns = viewBuilder._columns;
        this.grouped = groupBy(viewBuilder._statements, "grouping");
        this.formatter = client.formatter(viewBuilder);
        this.bindings = [];
        this.formatter.bindings = this.bindings;
        this.bindingsHolder = this;
        this.sequence = [];
      }
      // Convert the tableCompiler toSQL
      toSQL() {
        this[this.method]();
        return this.sequence;
      }
      // Column Compilation
      // -------
      create() {
        this.createQuery(this.columns, this.selectQuery);
      }
      createOrReplace() {
        throw new Error("replace views is not supported by this dialect.");
      }
      createMaterializedView() {
        throw new Error("materialized views are not supported by this dialect.");
      }
      createQuery(columns, selectQuery, materialized, replace) {
        const createStatement = "create " + (materialized ? "materialized " : "") + (replace ? "or replace " : "") + "view ";
        const columnList = columns ? " (" + columnize_(
          columns,
          this.viewBuilder,
          this.client,
          this.bindingsHolder
        ) + ")" : "";
        let sql = createStatement + this.viewName() + columnList;
        sql += " as ";
        sql += selectQuery.toString();
        switch (this.single.checkOption) {
          case "default_option":
            sql += " with check option";
            break;
          case "local":
            sql += " with local check option";
            break;
          case "cascaded":
            sql += " with cascaded check option";
            break;
          default:
            break;
        }
        this.pushQuery({
          sql
        });
      }
      renameView(from, to) {
        throw new Error(
          "rename view is not supported by this dialect (instead drop, then create another view)."
        );
      }
      refreshMaterializedView() {
        throw new Error("materialized views are not supported by this dialect.");
      }
      alter() {
        this.alterView();
      }
      alterView() {
        const alterView = this.grouped.alterView || [];
        for (let i = 0, l = alterView.length; i < l; i++) {
          const statement = alterView[i];
          if (this[statement.method]) {
            this[statement.method].apply(this, statement.args);
          } else {
            this.client.logger.error(`Debug: ${statement.method} does not exist`);
          }
        }
        for (const item in this.single) {
          if (typeof this[item] === "function") this[item](this.single[item]);
        }
      }
      renameColumn(from, to) {
        throw new Error("rename column of views is not supported by this dialect.");
      }
      defaultTo(column, defaultValue) {
        throw new Error(
          "change default values of views is not supported by this dialect."
        );
      }
      viewName() {
        const name = this.schemaNameRaw ? `${this.schemaNameRaw}.${this.viewNameRaw}` : this.viewNameRaw;
        return this.formatter.wrap(name);
      }
    };
    ViewCompiler.prototype.pushQuery = pushQuery;
    module2.exports = ViewCompiler;
  }
});

// node_modules/knex/lib/client.js
var require_client = __commonJS({
  "node_modules/knex/lib/client.js"(exports2, module2) {
    "use strict";
    var { Pool, TimeoutError } = require_tarn();
    var { EventEmitter } = require("events");
    var { promisify } = require("util");
    var { makeEscape } = require_string();
    var cloneDeep = require_cloneDeep();
    var defaults = require_defaults();
    var uniqueId = require_uniqueId();
    var Runner = require_runner();
    var Transaction = require_transaction();
    var {
      executeQuery,
      enrichQueryObject
    } = require_query_executioner();
    var QueryBuilder = require_querybuilder();
    var QueryCompiler = require_querycompiler();
    var SchemaBuilder = require_builder();
    var SchemaCompiler = require_compiler();
    var TableBuilder = require_tablebuilder();
    var TableCompiler = require_tablecompiler();
    var ColumnBuilder = require_columnbuilder();
    var ColumnCompiler = require_columncompiler();
    var { KnexTimeoutError } = require_timeout();
    var { outputQuery, unwrapRaw } = require_wrappingFormatter();
    var { compileCallback } = require_formatterUtils();
    var Raw = require_raw();
    var Ref = require_ref();
    var Formatter = require_formatter();
    var Logger = require_logger();
    var { POOL_CONFIG_OPTIONS } = require_constants();
    var ViewBuilder = require_viewbuilder();
    var ViewCompiler = require_viewcompiler();
    var isPlainObject = require_isPlainObject();
    var { setHiddenProperty } = require_security();
    var debug = require_src()("knex:client");
    var Client = class extends EventEmitter {
      constructor(config3 = {}) {
        super();
        this.config = config3;
        this.logger = new Logger(config3);
        if (this.config.connection && this.config.connection.password) {
          setHiddenProperty(this.config.connection);
        }
        if (this.dialect && !this.config.client) {
          this.logger.warn(
            `Using 'this.dialect' to identify the client is deprecated and support for it will be removed in the future. Please use configuration option 'client' instead.`
          );
        }
        const dbClient = this.config.client || this.dialect;
        if (!dbClient) {
          throw new Error(
            `knex: Required configuration option 'client' is missing.`
          );
        }
        if (config3.version) {
          this.version = config3.version;
        }
        if (config3.connection && config3.connection instanceof Function) {
          this.connectionConfigProvider = config3.connection;
          this.connectionConfigExpirationChecker = () => true;
        } else {
          this.connectionSettings = cloneDeep(config3.connection || {});
          if (config3.connection && config3.connection.password) {
            setHiddenProperty(this.connectionSettings, config3.connection);
          }
          this.connectionConfigExpirationChecker = null;
        }
        if (this.driverName && config3.connection) {
          this.initializeDriver();
          if (!config3.pool || config3.pool && config3.pool.max !== 0) {
            this.initializePool(config3);
          }
        }
        this.valueForUndefined = this.raw("DEFAULT");
        if (config3.useNullAsDefault) {
          this.valueForUndefined = null;
        }
      }
      formatter(builder) {
        return new Formatter(this, builder);
      }
      queryBuilder() {
        return new QueryBuilder(this);
      }
      queryCompiler(builder, formatter) {
        return new QueryCompiler(this, builder, formatter);
      }
      schemaBuilder() {
        return new SchemaBuilder(this);
      }
      schemaCompiler(builder) {
        return new SchemaCompiler(this, builder);
      }
      tableBuilder(type, tableName, tableNameLike, fn) {
        return new TableBuilder(this, type, tableName, tableNameLike, fn);
      }
      viewBuilder(type, viewBuilder, fn) {
        return new ViewBuilder(this, type, viewBuilder, fn);
      }
      tableCompiler(tableBuilder) {
        return new TableCompiler(this, tableBuilder);
      }
      viewCompiler(viewCompiler) {
        return new ViewCompiler(this, viewCompiler);
      }
      columnBuilder(tableBuilder, type, args) {
        return new ColumnBuilder(this, tableBuilder, type, args);
      }
      columnCompiler(tableBuilder, columnBuilder) {
        return new ColumnCompiler(this, tableBuilder, columnBuilder);
      }
      runner(builder) {
        return new Runner(this, builder);
      }
      transaction(container, config3, outerTx) {
        return new Transaction(this, container, config3, outerTx);
      }
      raw() {
        return new Raw(this).set(...arguments);
      }
      ref() {
        return new Ref(this, ...arguments);
      }
      query(connection, queryParam) {
        const queryObject = enrichQueryObject(connection, queryParam, this);
        return executeQuery(connection, queryObject, this);
      }
      stream(connection, queryParam, stream, options) {
        const queryObject = enrichQueryObject(connection, queryParam, this);
        return this._stream(connection, queryObject, stream, options);
      }
      prepBindings(bindings) {
        return bindings;
      }
      positionBindings(sql) {
        return sql;
      }
      postProcessResponse(resp, queryContext) {
        if (this.config.postProcessResponse) {
          return this.config.postProcessResponse(resp, queryContext);
        }
        return resp;
      }
      wrapIdentifier(value, queryContext) {
        return this.customWrapIdentifier(
          value,
          this.wrapIdentifierImpl,
          queryContext
        );
      }
      customWrapIdentifier(value, origImpl, queryContext) {
        if (this.config.wrapIdentifier) {
          return this.config.wrapIdentifier(value, origImpl, queryContext);
        }
        return origImpl(value);
      }
      wrapIdentifierImpl(value) {
        return value !== "*" ? `"${value.replace(/"/g, '""')}"` : "*";
      }
      initializeDriver() {
        try {
          this.driver = this._driver();
        } catch (e) {
          const message = `Knex: run
$ npm install ${this.driverName} --save`;
          this.logger.error(`${message}
${e.message}
${e.stack}`);
          throw new Error(`${message}
${e.message}`);
        }
      }
      poolDefaults() {
        return { min: 2, max: 10, propagateCreateError: true };
      }
      getPoolSettings(poolConfig) {
        poolConfig = defaults({}, poolConfig, this.poolDefaults());
        POOL_CONFIG_OPTIONS.forEach((option) => {
          if (option in poolConfig) {
            this.logger.warn(
              [
                `Pool config option "${option}" is no longer supported.`,
                `See https://github.com/Vincit/tarn.js for possible pool config options.`
              ].join(" ")
            );
          }
        });
        const DEFAULT_ACQUIRE_TIMEOUT = 6e4;
        const timeouts = [
          this.config.acquireConnectionTimeout,
          poolConfig.acquireTimeoutMillis
        ].filter((timeout) => timeout !== void 0);
        if (!timeouts.length) {
          timeouts.push(DEFAULT_ACQUIRE_TIMEOUT);
        }
        poolConfig.acquireTimeoutMillis = Math.min(...timeouts);
        const updatePoolConnectionSettingsFromProvider = async () => {
          if (!this.connectionConfigProvider) {
            return;
          }
          if (!this.connectionConfigExpirationChecker || !this.connectionConfigExpirationChecker()) {
            return;
          }
          const providerResult = await this.connectionConfigProvider();
          if (providerResult.expirationChecker) {
            this.connectionConfigExpirationChecker = providerResult.expirationChecker;
            delete providerResult.expirationChecker;
          } else {
            this.connectionConfigExpirationChecker = null;
          }
          this.connectionSettings = providerResult;
        };
        return Object.assign(poolConfig, {
          create: async () => {
            await updatePoolConnectionSettingsFromProvider();
            const connection = await this.acquireRawConnection();
            connection.__knexUid = uniqueId("__knexUid");
            if (poolConfig.afterCreate) {
              await promisify(poolConfig.afterCreate)(connection);
            }
            return connection;
          },
          destroy: (connection) => {
            if (connection !== void 0) {
              return this.destroyRawConnection(connection);
            }
          },
          validate: (connection) => {
            if (connection.__knex__disposed) {
              this.logger.warn(`Connection Error: ${connection.__knex__disposed}`);
              return false;
            }
            return this.validateConnection(connection);
          }
        });
      }
      initializePool(config3 = this.config) {
        if (this.pool) {
          this.logger.warn("The pool has already been initialized");
          return;
        }
        const tarnPoolConfig = {
          ...this.getPoolSettings(config3.pool)
        };
        if (tarnPoolConfig.afterCreate) {
          delete tarnPoolConfig.afterCreate;
        }
        this.pool = new Pool(tarnPoolConfig);
      }
      validateConnection(connection) {
        return true;
      }
      // Acquire a connection from the pool.
      async acquireConnection() {
        if (!this.pool) {
          throw new Error("Unable to acquire a connection");
        }
        try {
          const connection = await this.pool.acquire().promise;
          debug("acquired connection from pool: %s", connection.__knexUid);
          if (connection.config) {
            if (connection.config.password) {
              setHiddenProperty(connection.config);
            }
            if (connection.config.authentication && connection.config.authentication.options && connection.config.authentication.options.password) {
              setHiddenProperty(connection.config.authentication.options);
            }
          }
          return connection;
        } catch (error) {
          let convertedError = error;
          if (error instanceof TimeoutError) {
            convertedError = new KnexTimeoutError(
              "Knex: Timeout acquiring a connection. The pool is probably full. Are you missing a .transacting(trx) call?"
            );
          }
          throw convertedError;
        }
      }
      // Releases a connection back to the connection pool,
      // returning a promise resolved when the connection is released.
      releaseConnection(connection) {
        debug("releasing connection to pool: %s", connection.__knexUid);
        const didRelease = this.pool.release(connection);
        if (!didRelease) {
          debug("pool refused connection: %s", connection.__knexUid);
        }
        return Promise.resolve();
      }
      // Destroy the current connection pool for the client.
      async destroy(callback) {
        try {
          if (this.pool && this.pool.destroy) {
            await this.pool.destroy();
          }
          this.pool = void 0;
          if (typeof callback === "function") {
            callback();
          }
        } catch (err) {
          if (typeof callback === "function") {
            return callback(err);
          }
          throw err;
        }
      }
      // Return the database being used by this client.
      database() {
        return this.connectionSettings.database;
      }
      toString() {
        return "[object KnexClient]";
      }
      assertCanCancelQuery() {
        if (!this.canCancelQuery) {
          throw new Error("Query cancelling not supported for this dialect");
        }
      }
      cancelQuery() {
        throw new Error("Query cancelling not supported for this dialect");
      }
      // Formatter part
      alias(first, second) {
        return first + " as " + second;
      }
      // Checks whether a value is a function... if it is, we compile it
      // otherwise we check whether it's a raw
      parameter(value, builder, bindingsHolder) {
        if (typeof value === "function") {
          return outputQuery(
            compileCallback(value, void 0, this, bindingsHolder),
            true,
            builder,
            this
          );
        }
        return unwrapRaw(value, true, builder, this, bindingsHolder) || "?";
      }
      // Turns a list of values into a list of ?'s, joining them with commas unless
      // a "joining" value is specified (e.g. ' and ')
      parameterize(values, notSetValue, builder, bindingsHolder) {
        if (typeof values === "function")
          return this.parameter(values, builder, bindingsHolder);
        values = Array.isArray(values) ? values : [values];
        let str = "", i = -1;
        while (++i < values.length) {
          if (i > 0) str += ", ";
          let value = values[i];
          if (isPlainObject(value)) {
            value = JSON.stringify(value);
          }
          str += this.parameter(
            value === void 0 ? notSetValue : value,
            builder,
            bindingsHolder
          );
        }
        return str;
      }
      // Formats `values` into a parenthesized list of parameters for a `VALUES`
      // clause.
      //
      // [1, 2]                  -> '(?, ?)'
      // [[1, 2], [3, 4]]        -> '((?, ?), (?, ?))'
      // knex('table')           -> '(select * from "table")'
      // knex.raw('select ?', 1) -> '(select ?)'
      //
      values(values, builder, bindingsHolder) {
        if (Array.isArray(values)) {
          if (Array.isArray(values[0])) {
            return `(${values.map(
              (value) => `(${this.parameterize(
                value,
                void 0,
                builder,
                bindingsHolder
              )})`
            ).join(", ")})`;
          }
          return `(${this.parameterize(
            values,
            void 0,
            builder,
            bindingsHolder
          )})`;
        }
        if (values && values.isRawInstance) {
          return `(${this.parameter(values, builder, bindingsHolder)})`;
        }
        return this.parameter(values, builder, bindingsHolder);
      }
      processPassedConnection(connection) {
      }
      toPathForJson(jsonPath) {
        return jsonPath;
      }
    };
    Object.assign(Client.prototype, {
      _escapeBinding: makeEscape({
        escapeString(str) {
          return `'${str.replace(/'/g, "''")}'`;
        }
      }),
      canCancelQuery: false
    });
    module2.exports = Client;
  }
});

// node_modules/pg-connection-string/index.js
var require_pg_connection_string = __commonJS({
  "node_modules/pg-connection-string/index.js"(exports2, module2) {
    "use strict";
    function parse(str) {
      if (str.charAt(0) === "/") {
        const config4 = str.split(" ");
        return { host: config4[0], database: config4[1] };
      }
      const config3 = {};
      let result;
      let dummyHost = false;
      if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
        str = encodeURI(str).replace(/\%25(\d\d)/g, "%$1");
      }
      try {
        result = new URL(str, "postgres://base");
      } catch (e) {
        result = new URL(str.replace("@/", "@___DUMMY___/"), "postgres://base");
        dummyHost = true;
      }
      for (const entry of result.searchParams.entries()) {
        config3[entry[0]] = entry[1];
      }
      config3.user = config3.user || decodeURIComponent(result.username);
      config3.password = config3.password || decodeURIComponent(result.password);
      if (result.protocol == "socket:") {
        config3.host = decodeURI(result.pathname);
        config3.database = result.searchParams.get("db");
        config3.client_encoding = result.searchParams.get("encoding");
        return config3;
      }
      const hostname = dummyHost ? "" : result.hostname;
      if (!config3.host) {
        config3.host = decodeURIComponent(hostname);
      } else if (hostname && /^%2f/i.test(hostname)) {
        result.pathname = hostname + result.pathname;
      }
      if (!config3.port) {
        config3.port = result.port;
      }
      const pathname = result.pathname.slice(1) || null;
      config3.database = pathname ? decodeURI(pathname) : null;
      if (config3.ssl === "true" || config3.ssl === "1") {
        config3.ssl = true;
      }
      if (config3.ssl === "0") {
        config3.ssl = false;
      }
      if (config3.sslcert || config3.sslkey || config3.sslrootcert || config3.sslmode) {
        config3.ssl = {};
      }
      const fs = config3.sslcert || config3.sslkey || config3.sslrootcert ? require("fs") : null;
      if (config3.sslcert) {
        config3.ssl.cert = fs.readFileSync(config3.sslcert).toString();
      }
      if (config3.sslkey) {
        config3.ssl.key = fs.readFileSync(config3.sslkey).toString();
      }
      if (config3.sslrootcert) {
        config3.ssl.ca = fs.readFileSync(config3.sslrootcert).toString();
      }
      switch (config3.sslmode) {
        case "disable": {
          config3.ssl = false;
          break;
        }
        case "prefer":
        case "require":
        case "verify-ca":
        case "verify-full": {
          break;
        }
        case "no-verify": {
          config3.ssl.rejectUnauthorized = false;
          break;
        }
      }
      return config3;
    }
    module2.exports = parse;
    parse.parse = parse;
  }
});

// node_modules/knex/lib/knex-builder/internal/parse-connection.js
var require_parse_connection = __commonJS({
  "node_modules/knex/lib/knex-builder/internal/parse-connection.js"(exports2, module2) {
    "use strict";
    var { parse } = require_pg_connection_string();
    var parsePG = parse;
    var isWindows = process && process.platform && process.platform === "win32";
    function tryParse(str) {
      try {
        return new URL(str);
      } catch (e) {
        return null;
      }
    }
    module2.exports = function parseConnectionString(str) {
      const parsed = tryParse(str);
      const isDriveLetter = isWindows && parsed && parsed.protocol.length === 2;
      if (!parsed || isDriveLetter) {
        return {
          client: "sqlite3",
          connection: {
            filename: str
          }
        };
      }
      let { protocol } = parsed;
      if (protocol.slice(-1) === ":") {
        protocol = protocol.slice(0, -1);
      }
      const isPG = ["postgresql", "postgres"].includes(protocol);
      return {
        client: protocol,
        connection: isPG ? parsePG(str) : connectionObject(parsed)
      };
    };
    function connectionObject(parsed) {
      const connection = {};
      let db = parsed.pathname;
      if (db[0] === "/") {
        db = db.slice(1);
      }
      connection.database = db;
      if (parsed.hostname) {
        if (parsed.protocol.indexOf("mssql") === 0) {
          connection.server = parsed.hostname;
        } else {
          connection.host = parsed.hostname;
        }
      }
      if (parsed.port) {
        connection.port = parsed.port;
      }
      if (parsed.username || parsed.password) {
        connection.user = decodeURIComponent(parsed.username);
      }
      if (parsed.password) {
        connection.password = decodeURIComponent(parsed.password);
      }
      if (parsed.searchParams) {
        for (const [key, value] of parsed.searchParams.entries()) {
          const isNestedConfigSupported = ["mysql:", "mariadb:", "mssql:"].includes(
            parsed.protocol
          );
          if (isNestedConfigSupported) {
            try {
              connection[key] = JSON.parse(value);
            } catch (err) {
              connection[key] = value;
            }
          } else {
            connection[key] = value;
          }
        }
      }
      return connection;
    }
  }
});

// node_modules/knex/lib/dialects/sqlite3/execution/sqlite-transaction.js
var require_sqlite_transaction = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/execution/sqlite-transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    var Transaction_Sqlite = class extends Transaction {
      begin(conn) {
        if (this.isolationLevel) {
          this.client.logger.warn(
            "sqlite3 only supports serializable transactions, ignoring the isolation level param"
          );
        }
        if (this.readOnly) {
          this.client.logger.warn(
            "sqlite3 implicitly handles read vs write transactions"
          );
        }
        return this.query(conn, "BEGIN;");
      }
    };
    module2.exports = Transaction_Sqlite;
  }
});

// node_modules/knex/lib/dialects/sqlite3/query/sqlite-querycompiler.js
var require_sqlite_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/query/sqlite-querycompiler.js"(exports2, module2) {
    "use strict";
    var constant = require_constant();
    var each = require_each();
    var identity = require_identity();
    var isEmpty = require_isEmpty();
    var reduce = require_reduce();
    var QueryCompiler = require_querycompiler();
    var noop = require_noop();
    var { isString } = require_is();
    var {
      wrapString,
      columnize: columnize_
    } = require_wrappingFormatter();
    var emptyStr = constant("");
    var QueryCompiler_SQLite3 = class extends QueryCompiler {
      constructor(client, builder, formatter) {
        super(client, builder, formatter);
        this.forShare = emptyStr;
        this.forKeyShare = emptyStr;
        this.forUpdate = emptyStr;
        this.forNoKeyUpdate = emptyStr;
      }
      // SQLite requires us to build the multi-row insert as a listing of select with
      // unions joining them together. So we'll build out this list of columns and
      // then join them all together with select unions to complete the queries.
      insert() {
        const insertValues = this.single.insert || [];
        let sql = this.with() + `insert into ${this.tableName} `;
        if (Array.isArray(insertValues)) {
          if (insertValues.length === 0) {
            return "";
          } else if (insertValues.length === 1 && insertValues[0] && isEmpty(insertValues[0])) {
            return {
              sql: sql + this._emptyInsertValue
            };
          }
        } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
          return {
            sql: sql + this._emptyInsertValue
          };
        }
        const insertData = this._prepInsert(insertValues);
        if (isString(insertData)) {
          return {
            sql: sql + insertData
          };
        }
        if (insertData.columns.length === 0) {
          return {
            sql: ""
          };
        }
        sql += `(${this.formatter.columnize(insertData.columns)})`;
        if (this.client.valueForUndefined !== null) {
          insertData.values.forEach((bindings) => {
            each(bindings, (binding) => {
              if (binding === void 0)
                throw new TypeError(
                  "`sqlite` does not support inserting default values. Specify values explicitly or use the `useNullAsDefault` config flag. (see docs https://knexjs.org/guide/query-builder.html#insert)."
                );
            });
          });
        }
        if (insertData.values.length === 1) {
          const parameters = this.client.parameterize(
            insertData.values[0],
            this.client.valueForUndefined,
            this.builder,
            this.bindingsHolder
          );
          sql += ` values (${parameters})`;
          const { onConflict: onConflict2, ignore: ignore2, merge: merge2 } = this.single;
          if (onConflict2 && ignore2) sql += this._ignore(onConflict2);
          else if (onConflict2 && merge2) {
            sql += this._merge(merge2.updates, onConflict2, insertValues);
            const wheres = this.where();
            if (wheres) sql += ` ${wheres}`;
          }
          const { returning: returning2 } = this.single;
          if (returning2) {
            sql += this._returning(returning2);
          }
          return {
            sql,
            returning: returning2
          };
        }
        const blocks = [];
        let i = -1;
        while (++i < insertData.values.length) {
          let i2 = -1;
          const block = blocks[i] = [];
          let current = insertData.values[i];
          current = current === void 0 ? this.client.valueForUndefined : current;
          while (++i2 < insertData.columns.length) {
            block.push(
              this.client.alias(
                this.client.parameter(
                  current[i2],
                  this.builder,
                  this.bindingsHolder
                ),
                this.formatter.wrap(insertData.columns[i2])
              )
            );
          }
          blocks[i] = block.join(", ");
        }
        sql += " select " + blocks.join(" union all select ");
        const { onConflict, ignore, merge } = this.single;
        if (onConflict && ignore) sql += " where true" + this._ignore(onConflict);
        else if (onConflict && merge) {
          sql += " where true" + this._merge(merge.updates, onConflict, insertValues);
        }
        const { returning } = this.single;
        if (returning) sql += this._returning(returning);
        return {
          sql,
          returning
        };
      }
      // Compiles an `update` query, allowing for a return value.
      update() {
        const withSQL = this.with();
        const updateData = this._prepUpdate(this.single.update);
        const wheres = this.where();
        const { returning } = this.single;
        return {
          sql: withSQL + `update ${this.single.only ? "only " : ""}${this.tableName} set ${updateData.join(", ")}` + (wheres ? ` ${wheres}` : "") + this._returning(returning),
          returning
        };
      }
      _ignore(columns) {
        if (columns === true) {
          return " on conflict do nothing";
        }
        return ` on conflict ${this._onConflictClause(columns)} do nothing`;
      }
      _merge(updates, columns, insert) {
        let sql = ` on conflict ${this._onConflictClause(columns)} do update set `;
        if (updates && Array.isArray(updates)) {
          sql += updates.map(
            (column) => wrapString(
              column.split(".").pop(),
              this.formatter.builder,
              this.client,
              this.formatter
            )
          ).map((column) => `${column} = excluded.${column}`).join(", ");
          return sql;
        } else if (updates && typeof updates === "object") {
          const updateData = this._prepUpdate(updates);
          if (typeof updateData === "string") {
            sql += updateData;
          } else {
            sql += updateData.join(",");
          }
          return sql;
        } else {
          const insertData = this._prepInsert(insert);
          if (typeof insertData === "string") {
            throw new Error(
              "If using merge with a raw insert query, then updates must be provided"
            );
          }
          sql += insertData.columns.map(
            (column) => wrapString(column.split(".").pop(), this.builder, this.client)
          ).map((column) => `${column} = excluded.${column}`).join(", ");
          return sql;
        }
      }
      _returning(value) {
        return value ? ` returning ${this.formatter.columnize(value)}` : "";
      }
      // Compile a truncate table statement into SQL.
      truncate() {
        const { table } = this.single;
        return {
          sql: `delete from ${this.tableName}`,
          output() {
            return this.query({
              sql: `delete from sqlite_sequence where name = '${table}'`
            }).catch(noop);
          }
        };
      }
      // Compiles a `columnInfo` query
      columnInfo() {
        const column = this.single.columnInfo;
        const table = this.client.customWrapIdentifier(this.single.table, identity);
        return {
          sql: `PRAGMA table_info(\`${table}\`)`,
          output(resp) {
            const maxLengthRegex = /.*\((\d+)\)/;
            const out = reduce(
              resp,
              function(columns, val) {
                let { type } = val;
                let maxLength = type.match(maxLengthRegex);
                if (maxLength) {
                  maxLength = maxLength[1];
                }
                type = maxLength ? type.split("(")[0] : type;
                columns[val.name] = {
                  type: type.toLowerCase(),
                  maxLength,
                  nullable: !val.notnull,
                  defaultValue: val.dflt_value
                };
                return columns;
              },
              {}
            );
            return column && out[column] || out;
          }
        };
      }
      limit() {
        const noLimit = !this.single.limit && this.single.limit !== 0;
        if (noLimit && !this.single.offset) return "";
        this.single.limit = noLimit ? -1 : this.single.limit;
        return `limit ${this._getValueOrParameterFromAttribute("limit")}`;
      }
      // Json functions
      jsonExtract(params) {
        return this._jsonExtract("json_extract", params);
      }
      jsonSet(params) {
        return this._jsonSet("json_set", params);
      }
      jsonInsert(params) {
        return this._jsonSet("json_insert", params);
      }
      jsonRemove(params) {
        const jsonCol = `json_remove(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )},${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )})`;
        return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
      }
      whereJsonPath(statement) {
        return this._whereJsonPath("json_extract", statement);
      }
      whereJsonSupersetOf(statement) {
        throw new Error(
          "Json superset where clause not actually supported by SQLite"
        );
      }
      whereJsonSubsetOf(statement) {
        throw new Error(
          "Json subset where clause not actually supported by SQLite"
        );
      }
      onJsonPathEquals(clause) {
        return this._onJsonPathEquals("json_extract", clause);
      }
    };
    module2.exports = QueryCompiler_SQLite3;
  }
});

// node_modules/lodash/_baseSome.js
var require_baseSome = __commonJS({
  "node_modules/lodash/_baseSome.js"(exports2, module2) {
    "use strict";
    var baseEach = require_baseEach();
    function baseSome(collection, predicate) {
      var result;
      baseEach(collection, function(value, index, collection2) {
        result = predicate(value, index, collection2);
        return !result;
      });
      return !!result;
    }
    module2.exports = baseSome;
  }
});

// node_modules/lodash/some.js
var require_some = __commonJS({
  "node_modules/lodash/some.js"(exports2, module2) {
    "use strict";
    var arraySome = require_arraySome();
    var baseIteratee = require_baseIteratee();
    var baseSome = require_baseSome();
    var isArray = require_isArray();
    var isIterateeCall = require_isIterateeCall();
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = void 0;
      }
      return func(collection, baseIteratee(predicate, 3));
    }
    module2.exports = some;
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/sqlite-compiler.js
var require_sqlite_compiler = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/sqlite-compiler.js"(exports2, module2) {
    "use strict";
    var SchemaCompiler = require_compiler();
    var some = require_some();
    var SchemaCompiler_SQLite3 = class extends SchemaCompiler {
      constructor(client, builder) {
        super(client, builder);
      }
      // Compile the query to determine if a table exists.
      hasTable(tableName) {
        const sql = `select * from sqlite_master where type = 'table' and name = ${this.client.parameter(
          this.formatter.wrap(tableName).replace(/`/g, ""),
          this.builder,
          this.bindingsHolder
        )}`;
        this.pushQuery({ sql, output: (resp) => resp.length > 0 });
      }
      // Compile the query to determine if a column exists.
      hasColumn(tableName, column) {
        this.pushQuery({
          sql: `PRAGMA table_info(${this.formatter.wrap(tableName)})`,
          output(resp) {
            return some(resp, (col) => {
              return this.client.wrapIdentifier(col.name.toLowerCase()) === this.client.wrapIdentifier(column.toLowerCase());
            });
          }
        });
      }
      // Compile a rename table command.
      renameTable(from, to) {
        this.pushQuery(
          `alter table ${this.formatter.wrap(from)} rename to ${this.formatter.wrap(
            to
          )}`
        );
      }
      async generateDdlCommands() {
        const sequence = this.builder._sequence;
        for (let i = 0, l = sequence.length; i < l; i++) {
          const query = sequence[i];
          this[query.method].apply(this, query.args);
        }
        const commandSources = this.sequence;
        if (commandSources.length === 1 && commandSources[0].statementsProducer) {
          return commandSources[0].statementsProducer();
        } else {
          const result = [];
          for (const commandSource of commandSources) {
            const command = commandSource.sql;
            if (Array.isArray(command)) {
              result.push(...command);
            } else {
              result.push(command);
            }
          }
          return { pre: [], sql: result, check: null, post: [] };
        }
      }
    };
    module2.exports = SchemaCompiler_SQLite3;
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/sqlite-columncompiler.js
var require_sqlite_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/sqlite-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler = require_columncompiler();
    var ColumnCompiler_SQLite3 = class extends ColumnCompiler {
      constructor() {
        super(...arguments);
        this.modifiers = ["nullable", "defaultTo"];
        this._addCheckModifiers();
      }
      // Types
      // -------
      enu(allowed) {
        return `text check (${this.formatter.wrap(
          this.args[0]
        )} in ('${allowed.join("', '")}'))`;
      }
      _pushAlterCheckQuery(checkPredicate, constraintName) {
        throw new Error(
          `Alter table with to add constraints is not permitted in SQLite`
        );
      }
      checkRegex(regexes, constraintName) {
        return this._check(
          `${this.formatter.wrap(
            this.getColumnName()
          )} REGEXP ${this.client._escapeBinding(regexes)}`,
          constraintName
        );
      }
    };
    ColumnCompiler_SQLite3.prototype.json = "json";
    ColumnCompiler_SQLite3.prototype.jsonb = "json";
    ColumnCompiler_SQLite3.prototype.double = ColumnCompiler_SQLite3.prototype.decimal = ColumnCompiler_SQLite3.prototype.floating = "float";
    ColumnCompiler_SQLite3.prototype.timestamp = "datetime";
    ColumnCompiler_SQLite3.prototype.increments = ColumnCompiler_SQLite3.prototype.bigincrements = "integer not null primary key autoincrement";
    module2.exports = ColumnCompiler_SQLite3;
  }
});

// node_modules/lodash/filter.js
var require_filter = __commonJS({
  "node_modules/lodash/filter.js"(exports2, module2) {
    "use strict";
    var arrayFilter = require_arrayFilter();
    var baseFilter = require_baseFilter();
    var baseIteratee = require_baseIteratee();
    var isArray = require_isArray();
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, baseIteratee(predicate, 3));
    }
    module2.exports = filter;
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/sqlite-tablecompiler.js
var require_sqlite_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/sqlite-tablecompiler.js"(exports2, module2) {
    "use strict";
    var filter = require_filter();
    var values = require_values();
    var identity = require_identity();
    var { isObject } = require_is();
    var TableCompiler = require_tablecompiler();
    var { formatDefault } = require_formatterUtils();
    var TableCompiler_SQLite3 = class extends TableCompiler {
      constructor() {
        super(...arguments);
      }
      // Create a new table.
      createQuery(columns, ifNot, like) {
        const createStatement = ifNot ? "create table if not exists " : "create table ";
        let sql = createStatement + this.tableName();
        if (like && this.tableNameLike()) {
          sql += " as select * from " + this.tableNameLike() + " where 0=1";
        } else {
          sql += " (" + columns.sql.join(", ");
          sql += this.foreignKeys() || "";
          sql += this.primaryKeys() || "";
          sql += this._addChecks();
          sql += ")";
        }
        this.pushQuery(sql);
        if (like) {
          this.addColumns(columns, this.addColumnsPrefix);
        }
      }
      addColumns(columns, prefix, colCompilers) {
        if (prefix === this.alterColumnsPrefix) {
          const compiler = this;
          const columnsInfo = colCompilers.map((col) => {
            const name = this.client.customWrapIdentifier(
              col.getColumnName(),
              identity,
              col.columnBuilder.queryContext()
            );
            const type = col.getColumnType();
            const defaultTo = col.modified["defaultTo"] ? formatDefault(col.modified["defaultTo"][0], col.type, this.client) : null;
            const notNull = col.modified["nullable"] && col.modified["nullable"][0] === false;
            return { name, type, defaultTo, notNull };
          });
          this.pushQuery({
            sql: `PRAGMA table_info(${this.tableName()})`,
            statementsProducer(pragma, connection) {
              return compiler.client.ddl(compiler, pragma, connection).alterColumn(columnsInfo);
            }
          });
        } else {
          for (let i = 0, l = columns.sql.length; i < l; i++) {
            this.pushQuery({
              sql: `alter table ${this.tableName()} add column ${columns.sql[i]}`,
              bindings: columns.bindings[i]
            });
          }
        }
      }
      // Compile a drop unique key command.
      dropUnique(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        this.pushQuery(`drop index ${indexName}`);
      }
      // Compile a drop foreign key command.
      dropForeign(columns, indexName) {
        const compiler = this;
        columns = Array.isArray(columns) ? columns : [columns];
        columns = columns.map(
          (column) => this.client.customWrapIdentifier(column, identity)
        );
        indexName = this.client.customWrapIdentifier(indexName, identity);
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          output(pragma) {
            return compiler.client.ddl(compiler, pragma, this.connection).dropForeign(columns, indexName);
          }
        });
      }
      // Compile a drop primary key command.
      dropPrimary(constraintName) {
        const compiler = this;
        constraintName = this.client.customWrapIdentifier(constraintName, identity);
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          output(pragma) {
            return compiler.client.ddl(compiler, pragma, this.connection).dropPrimary(constraintName);
          }
        });
      }
      dropIndex(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        this.pushQuery(`drop index ${indexName}`);
      }
      // Compile a unique key command.
      unique(columns, indexName) {
        let deferrable;
        let predicate;
        if (isObject(indexName)) {
          ({ indexName, deferrable, predicate } = indexName);
        }
        if (deferrable && deferrable !== "not deferrable") {
          this.client.logger.warn(
            `sqlite3: unique index \`${indexName}\` will not be deferrable ${deferrable} because sqlite3 does not support deferred constraints.`
          );
        }
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        columns = this.formatter.columnize(columns);
        const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
        this.pushQuery(
          `create unique index ${indexName} on ${this.tableName()} (${columns})${predicateQuery}`
        );
      }
      // Compile a plain index key command.
      index(columns, indexName, options) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        columns = this.formatter.columnize(columns);
        let predicate;
        if (isObject(options)) {
          ({ predicate } = options);
        }
        const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
        this.pushQuery(
          `create index ${indexName} on ${this.tableName()} (${columns})${predicateQuery}`
        );
      }
      /**
       * Add a primary key to an existing table.
       *
       * @NOTE The `createQuery` method above handles table creation. Don't do anything regarding table
       *       creation in this method
       *
       * @param {string | string[]} columns - Column name(s) to assign as primary keys
       * @param {string} [constraintName] - Custom name for the PK constraint
       */
      primary(columns, constraintName) {
        const compiler = this;
        columns = Array.isArray(columns) ? columns : [columns];
        columns = columns.map(
          (column) => this.client.customWrapIdentifier(column, identity)
        );
        let deferrable;
        if (isObject(constraintName)) {
          ({ constraintName, deferrable } = constraintName);
        }
        if (deferrable && deferrable !== "not deferrable") {
          this.client.logger.warn(
            `sqlite3: primary key constraint \`${constraintName}\` will not be deferrable ${deferrable} because sqlite3 does not support deferred constraints.`
          );
        }
        constraintName = this.client.customWrapIdentifier(constraintName, identity);
        if (this.method !== "create" && this.method !== "createIfNot") {
          this.pushQuery({
            sql: `PRAGMA table_info(${this.tableName()})`,
            output(pragma) {
              return compiler.client.ddl(compiler, pragma, this.connection).primary(columns, constraintName);
            }
          });
        }
      }
      /**
       * Add a foreign key constraint to an existing table
       *
       * @NOTE The `createQuery` method above handles foreign key constraints on table creation. Don't do
       *       anything regarding table creation in this method
       *
       * @param {object} foreignInfo - Information about the current column foreign setup
       * @param {string | string[]} [foreignInfo.column] - Column in the current constraint
       * @param {string | undefined} foreignInfo.keyName - Name of the foreign key constraint
       * @param {string | string[]} foreignInfo.references - What column it references in the other table
       * @param {string} foreignInfo.inTable - What table is referenced in this constraint
       * @param {string} [foreignInfo.onUpdate] - What to do on updates
       * @param {string} [foreignInfo.onDelete] - What to do on deletions
       */
      foreign(foreignInfo) {
        const compiler = this;
        if (this.method !== "create" && this.method !== "createIfNot") {
          foreignInfo.column = Array.isArray(foreignInfo.column) ? foreignInfo.column : [foreignInfo.column];
          foreignInfo.column = foreignInfo.column.map(
            (column) => this.client.customWrapIdentifier(column, identity)
          );
          foreignInfo.inTable = this.client.customWrapIdentifier(
            foreignInfo.inTable,
            identity
          );
          foreignInfo.references = Array.isArray(foreignInfo.references) ? foreignInfo.references : [foreignInfo.references];
          foreignInfo.references = foreignInfo.references.map(
            (column) => this.client.customWrapIdentifier(column, identity)
          );
          this.pushQuery({
            sql: `PRAGMA table_info(${this.tableName()})`,
            statementsProducer(pragma, connection) {
              return compiler.client.ddl(compiler, pragma, connection).foreign(foreignInfo);
            }
          });
        }
      }
      primaryKeys() {
        const pks = filter(this.grouped.alterTable || [], { method: "primary" });
        if (pks.length > 0 && pks[0].args.length > 0) {
          const columns = pks[0].args[0];
          let constraintName = pks[0].args[1] || "";
          if (constraintName) {
            constraintName = " constraint " + this.formatter.wrap(constraintName);
          }
          const needUniqueCols = this.grouped.columns.filter((t) => t.builder._type === "increments").length > 0;
          return `,${constraintName} ${needUniqueCols ? "unique" : "primary key"} (${this.formatter.columnize(columns)})`;
        }
      }
      foreignKeys() {
        let sql = "";
        const foreignKeys = filter(this.grouped.alterTable || [], {
          method: "foreign"
        });
        for (let i = 0, l = foreignKeys.length; i < l; i++) {
          const foreign = foreignKeys[i].args[0];
          const column = this.formatter.columnize(foreign.column);
          const references = this.formatter.columnize(foreign.references);
          const foreignTable = this.formatter.wrap(foreign.inTable);
          let constraintName = foreign.keyName || "";
          if (constraintName) {
            constraintName = " constraint " + this.formatter.wrap(constraintName);
          }
          sql += `,${constraintName} foreign key(${column}) references ${foreignTable}(${references})`;
          if (foreign.onDelete) sql += ` on delete ${foreign.onDelete}`;
          if (foreign.onUpdate) sql += ` on update ${foreign.onUpdate}`;
        }
        return sql;
      }
      createTableBlock() {
        return this.getColumns().concat().join(",");
      }
      renameColumn(from, to) {
        this.pushQuery({
          sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
            from
          )} to ${this.formatter.wrap(to)}`
        });
      }
      _setNullableState(column, isNullable) {
        const compiler = this;
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          statementsProducer(pragma, connection) {
            return compiler.client.ddl(compiler, pragma, connection).setNullable(column, isNullable);
          }
        });
      }
      dropColumn() {
        const compiler = this;
        const columns = values(arguments);
        const columnsWrapped = columns.map(
          (column) => this.client.customWrapIdentifier(column, identity)
        );
        this.pushQuery({
          sql: `PRAGMA table_info(${this.tableName()})`,
          output(pragma) {
            return compiler.client.ddl(compiler, pragma, this.connection).dropColumn(columnsWrapped);
          }
        });
      }
    };
    module2.exports = TableCompiler_SQLite3;
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/sqlite-viewcompiler.js
var require_sqlite_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/sqlite-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler = require_viewcompiler();
    var {
      columnize: columnize_
    } = require_wrappingFormatter();
    var ViewCompiler_SQLite3 = class extends ViewCompiler {
      constructor(client, viewCompiler) {
        super(client, viewCompiler);
      }
      createOrReplace() {
        const columns = this.columns;
        const selectQuery = this.selectQuery.toString();
        const viewName = this.viewName();
        const columnList = columns ? " (" + columnize_(
          columns,
          this.viewBuilder,
          this.client,
          this.bindingsHolder
        ) + ")" : "";
        const dropSql = `drop view if exists ${viewName}`;
        const createSql = `create view ${viewName}${columnList} as ${selectQuery}`;
        this.pushQuery({
          sql: dropSql
        });
        this.pushQuery({
          sql: createSql
        });
      }
    };
    module2.exports = ViewCompiler_SQLite3;
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/internal/sqlite-ddl-operations.js
var require_sqlite_ddl_operations = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/internal/sqlite-ddl-operations.js"(exports2, module2) {
    "use strict";
    function copyData(sourceTable, targetTable, columns) {
      return `INSERT INTO "${targetTable}" SELECT ${columns === void 0 ? "*" : columns.map((column) => `"${column}"`).join(", ")} FROM "${sourceTable}";`;
    }
    function dropOriginal(tableName) {
      return `DROP TABLE "${tableName}"`;
    }
    function renameTable(tableName, alteredName) {
      return `ALTER TABLE "${tableName}" RENAME TO "${alteredName}"`;
    }
    function getTableSql(tableName) {
      return `SELECT type, sql FROM sqlite_master WHERE (type='table' OR (type='index' AND sql IS NOT NULL)) AND lower(tbl_name)='${tableName.toLowerCase()}'`;
    }
    function isForeignCheckEnabled() {
      return `PRAGMA foreign_keys`;
    }
    function setForeignCheck(enable) {
      return `PRAGMA foreign_keys = ${enable ? "ON" : "OFF"}`;
    }
    function executeForeignCheck() {
      return `PRAGMA foreign_key_check`;
    }
    module2.exports = {
      copyData,
      dropOriginal,
      renameTable,
      getTableSql,
      isForeignCheckEnabled,
      setForeignCheck,
      executeForeignCheck
    };
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/internal/tokenizer.js
var require_tokenizer = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/internal/tokenizer.js"(exports2, module2) {
    "use strict";
    function tokenize(text, tokens) {
      const compiledRegex = new RegExp(
        Object.entries(tokens).map(([type, regex]) => `(?<${type}>${regex.source})`).join("|"),
        "yi"
      );
      let index = 0;
      const ast = [];
      while (index < text.length) {
        compiledRegex.lastIndex = index;
        const result = text.match(compiledRegex);
        if (result !== null) {
          const [type, text2] = Object.entries(result.groups).find(
            ([name, group]) => group !== void 0
          );
          index += text2.length;
          if (!type.startsWith("_")) {
            ast.push({ type, text: text2 });
          }
        } else {
          throw new Error(
            `No matching tokenizer rule found at: [${text.substring(index)}]`
          );
        }
      }
      return ast;
    }
    module2.exports = {
      tokenize
    };
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/internal/parser-combinator.js
var require_parser_combinator = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/internal/parser-combinator.js"(exports2, module2) {
    "use strict";
    function s(sequence, post = (v) => v) {
      return function({ index = 0, input }) {
        let position = index;
        const ast = [];
        for (const parser of sequence) {
          const result = parser({ index: position, input });
          if (result.success) {
            position = result.index;
            ast.push(result.ast);
          } else {
            return result;
          }
        }
        return { success: true, ast: post(ast), index: position, input };
      };
    }
    function a(alternative, post = (v) => v) {
      return function({ index = 0, input }) {
        for (const parser of alternative) {
          const result = parser({ index, input });
          if (result.success) {
            return {
              success: true,
              ast: post(result.ast),
              index: result.index,
              input
            };
          }
        }
        return { success: false, ast: null, index, input };
      };
    }
    function m(many, post = (v) => v) {
      return function({ index = 0, input }) {
        let result = {};
        let position = index;
        const ast = [];
        do {
          result = many({ index: position, input });
          if (result.success) {
            position = result.index;
            ast.push(result.ast);
          }
        } while (result.success);
        if (ast.length > 0) {
          return { success: true, ast: post(ast), index: position, input };
        } else {
          return { success: false, ast: null, index: position, input };
        }
      };
    }
    function o(optional, post = (v) => v) {
      return function({ index = 0, input }) {
        const result = optional({ index, input });
        if (result.success) {
          return {
            success: true,
            ast: post(result.ast),
            index: result.index,
            input
          };
        } else {
          return { success: true, ast: post(null), index, input };
        }
      };
    }
    function l(lookahead, post = (v) => v) {
      return function({ index = 0, input }) {
        const result = lookahead.do({ index, input });
        if (result.success) {
          const resultNext = lookahead.next({ index: result.index, input });
          if (resultNext.success) {
            return {
              success: true,
              ast: post(result.ast),
              index: result.index,
              input
            };
          }
        }
        return { success: false, ast: null, index, input };
      };
    }
    function n(negative, post = (v) => v) {
      return function({ index = 0, input }) {
        const result = negative.do({ index, input });
        if (result.success) {
          const resultNot = negative.not({ index, input });
          if (!resultNot.success) {
            return {
              success: true,
              ast: post(result.ast),
              index: result.index,
              input
            };
          }
        }
        return { success: false, ast: null, index, input };
      };
    }
    function t(token, post = (v) => v.text) {
      return function({ index = 0, input }) {
        const result = input[index];
        if (result !== void 0 && (token.type === void 0 || token.type === result.type) && (token.text === void 0 || token.text.toUpperCase() === result.text.toUpperCase())) {
          return {
            success: true,
            ast: post(result),
            index: index + 1,
            input
          };
        } else {
          return { success: false, ast: null, index, input };
        }
      };
    }
    var e = function({ index = 0, input }) {
      return { success: true, ast: null, index, input };
    };
    var f = function({ index = 0, input }) {
      return { success: index === input.length, ast: null, index, input };
    };
    module2.exports = { s, a, m, o, l, n, t, e, f };
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/internal/parser.js
var require_parser = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/internal/parser.js"(exports2, module2) {
    "use strict";
    var { tokenize } = require_tokenizer();
    var { s, a, m, o, l, n, t, e, f } = require_parser_combinator();
    var TOKENS = {
      keyword: /(?:ABORT|ACTION|ADD|AFTER|ALL|ALTER|ALWAYS|ANALYZE|AND|AS|ASC|ATTACH|AUTOINCREMENT|BEFORE|BEGIN|BETWEEN|BY|CASCADE|CASE|CAST|CHECK|COLLATE|COLUMN|COMMIT|CONFLICT|CONSTRAINT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|DATABASE|DEFAULT|DEFERRED|DEFERRABLE|DELETE|DESC|DETACH|DISTINCT|DO|DROP|END|EACH|ELSE|ESCAPE|EXCEPT|EXCLUSIVE|EXCLUDE|EXISTS|EXPLAIN|FAIL|FILTER|FIRST|FOLLOWING|FOR|FOREIGN|FROM|FULL|GENERATED|GLOB|GROUP|GROUPS|HAVING|IF|IGNORE|IMMEDIATE|IN|INDEX|INDEXED|INITIALLY|INNER|INSERT|INSTEAD|INTERSECT|INTO|IS|ISNULL|JOIN|KEY|LAST|LEFT|LIKE|LIMIT|MATCH|MATERIALIZED|NATURAL|NO|NOT|NOTHING|NOTNULL|NULL|NULLS|OF|OFFSET|ON|OR|ORDER|OTHERS|OUTER|OVER|PARTITION|PLAN|PRAGMA|PRECEDING|PRIMARY|QUERY|RAISE|RANGE|RECURSIVE|REFERENCES|REGEXP|REINDEX|RELEASE|RENAME|REPLACE|RESTRICT|RETURNING|RIGHT|ROLLBACK|ROW|ROWS|SAVEPOINT|SELECT|SET|TABLE|TEMP|TEMPORARY|THEN|TIES|TO|TRANSACTION|TRIGGER|UNBOUNDED|UNION|UNIQUE|UPDATE|USING|VACUUM|VALUES|VIEW|VIRTUAL|WHEN|WHERE|WINDOW|WITH|WITHOUT)(?=\s+|-|\(|\)|;|\+|\*|\/|%|==|=|<=|<>|<<|<|>=|>>|>|!=|,|&|~|\|\||\||\.)/,
      id: /"[^"]*(?:""[^"]*)*"|`[^`]*(?:``[^`]*)*`|\[[^[\]]*\]|[a-z_][a-z0-9_$]*/,
      string: /'[^']*(?:''[^']*)*'/,
      blob: /x'(?:[0-9a-f][0-9a-f])+'/,
      numeric: /(?:\d+(?:\.\d*)?|\.\d+)(?:e(?:\+|-)?\d+)?|0x[0-9a-f]+/,
      variable: /\?\d*|[@$:][a-z0-9_$]+/,
      operator: /-|\(|\)|;|\+|\*|\/|%|==|=|<=|<>|<<|<|>=|>>|>|!=|,|&|~|\|\||\||\./,
      _ws: /\s+/
    };
    function parseCreateTable(sql) {
      const result = createTable({ input: tokenize(sql, TOKENS) });
      if (!result.success) {
        throw new Error(
          `Parsing CREATE TABLE failed at [${result.input.slice(result.index).map((t2) => t2.text).join(" ")}] of "${sql}"`
        );
      }
      return result.ast;
    }
    function parseCreateIndex(sql) {
      const result = createIndex({ input: tokenize(sql, TOKENS) });
      if (!result.success) {
        throw new Error(
          `Parsing CREATE INDEX failed at [${result.input.slice(result.index).map((t2) => t2.text).join(" ")}] of "${sql}"`
        );
      }
      return result.ast;
    }
    function createTable(ctx) {
      return s(
        [
          t({ text: "CREATE" }, (v) => null),
          temporary,
          t({ text: "TABLE" }, (v) => null),
          exists,
          schema,
          table,
          t({ text: "(" }, (v) => null),
          columnDefinitionList,
          tableConstraintList,
          t({ text: ")" }, (v) => null),
          rowid,
          f
        ],
        (v) => Object.assign({}, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function temporary(ctx) {
      return a([t({ text: "TEMP" }), t({ text: "TEMPORARY" }), e], (v) => ({
        temporary: v !== null
      }))(ctx);
    }
    function rowid(ctx) {
      return o(s([t({ text: "WITHOUT" }), t({ text: "ROWID" })]), (v) => ({
        rowid: v !== null
      }))(ctx);
    }
    function columnDefinitionList(ctx) {
      return a([
        s([columnDefinition, t({ text: "," }), columnDefinitionList], (v) => ({
          columns: [v[0]].concat(v[2].columns)
        })),
        s([columnDefinition], (v) => ({ columns: [v[0]] }))
      ])(ctx);
    }
    function columnDefinition(ctx) {
      return s(
        [s([identifier], (v) => ({ name: v[0] })), typeName, columnConstraintList],
        (v) => Object.assign({}, ...v)
      )(ctx);
    }
    function typeName(ctx) {
      return o(
        s(
          [
            m(t({ type: "id" })),
            a([
              s(
                [
                  t({ text: "(" }),
                  signedNumber,
                  t({ text: "," }),
                  signedNumber,
                  t({ text: ")" })
                ],
                (v) => `(${v[1]}, ${v[3]})`
              ),
              s(
                [t({ text: "(" }), signedNumber, t({ text: ")" })],
                (v) => `(${v[1]})`
              ),
              e
            ])
          ],
          (v) => `${v[0].join(" ")}${v[1] || ""}`
        ),
        (v) => ({ type: v })
      )(ctx);
    }
    function columnConstraintList(ctx) {
      return o(m(columnConstraint), (v) => ({
        constraints: Object.assign(
          {
            primary: null,
            notnull: null,
            null: null,
            unique: null,
            check: null,
            default: null,
            collate: null,
            references: null,
            as: null
          },
          ...v || []
        )
      }))(ctx);
    }
    function columnConstraint(ctx) {
      return a([
        primaryColumnConstraint,
        notnullColumnConstraint,
        nullColumnConstraint,
        uniqueColumnConstraint,
        checkColumnConstraint,
        defaultColumnConstraint,
        collateColumnConstraint,
        referencesColumnConstraint,
        asColumnConstraint
      ])(ctx);
    }
    function primaryColumnConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "PRIMARY" }, (v) => null),
          t({ text: "KEY" }, (v) => null),
          order,
          conflictClause,
          autoincrement
        ],
        (v) => ({ primary: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function autoincrement(ctx) {
      return o(t({ text: "AUTOINCREMENT" }), (v) => ({
        autoincrement: v !== null
      }))(ctx);
    }
    function notnullColumnConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "NOT" }, (v) => null),
          t({ text: "NULL" }, (v) => null),
          conflictClause
        ],
        (v) => ({ notnull: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function nullColumnConstraint(ctx) {
      return s(
        [constraintName, t({ text: "NULL" }, (v) => null), conflictClause],
        (v) => ({ null: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function uniqueColumnConstraint(ctx) {
      return s(
        [constraintName, t({ text: "UNIQUE" }, (v) => null), conflictClause],
        (v) => ({ unique: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function checkColumnConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "CHECK" }, (v) => null),
          t({ text: "(" }, (v) => null),
          s([expression], (v) => ({ expression: v[0] })),
          t({ text: ")" }, (v) => null)
        ],
        (v) => ({ check: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function defaultColumnConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "DEFAULT" }, (v) => null),
          a([
            s([t({ text: "(" }), expression, t({ text: ")" })], (v) => ({
              value: v[1],
              expression: true
            })),
            s([literalValue], (v) => ({ value: v[0], expression: false })),
            s([signedNumber], (v) => ({ value: v[0], expression: false }))
          ])
        ],
        (v) => ({ default: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function collateColumnConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "COLLATE" }, (v) => null),
          t({ type: "id" }, (v) => ({ collation: v.text }))
        ],
        (v) => ({ collate: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function referencesColumnConstraint(ctx) {
      return s(
        [constraintName, s([foreignKeyClause], (v) => v[0].references)],
        (v) => ({
          references: Object.assign({}, ...v.filter((x) => x !== null))
        })
      )(ctx);
    }
    function asColumnConstraint(ctx) {
      return s(
        [
          constraintName,
          o(s([t({ text: "GENERATED" }), t({ text: "ALWAYS" })]), (v) => ({
            generated: v !== null
          })),
          t({ text: "AS" }, (v) => null),
          t({ text: "(" }, (v) => null),
          s([expression], (v) => ({ expression: v[0] })),
          t({ text: ")" }, (v) => null),
          a([t({ text: "STORED" }), t({ text: "VIRTUAL" }), e], (v) => ({
            mode: v ? v.toUpperCase() : null
          }))
        ],
        (v) => ({ as: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function tableConstraintList(ctx) {
      return o(m(s([t({ text: "," }), tableConstraint], (v) => v[1])), (v) => ({
        constraints: v || []
      }))(ctx);
    }
    function tableConstraint(ctx) {
      return a([
        primaryTableConstraint,
        uniqueTableConstraint,
        checkTableConstraint,
        foreignTableConstraint
      ])(ctx);
    }
    function primaryTableConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "PRIMARY" }, (v) => null),
          t({ text: "KEY" }, (v) => null),
          t({ text: "(" }, (v) => null),
          indexedColumnList,
          t({ text: ")" }, (v) => null),
          conflictClause
        ],
        (v) => Object.assign({ type: "PRIMARY KEY" }, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function uniqueTableConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "UNIQUE" }, (v) => null),
          t({ text: "(" }, (v) => null),
          indexedColumnList,
          t({ text: ")" }, (v) => null),
          conflictClause
        ],
        (v) => Object.assign({ type: "UNIQUE" }, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function conflictClause(ctx) {
      return o(
        s(
          [
            t({ text: "ON" }),
            t({ text: "CONFLICT" }),
            a([
              t({ text: "ROLLBACK" }),
              t({ text: "ABORT" }),
              t({ text: "FAIL" }),
              t({ text: "IGNORE" }),
              t({ text: "REPLACE" })
            ])
          ],
          (v) => v[2]
        ),
        (v) => ({ conflict: v ? v.toUpperCase() : null })
      )(ctx);
    }
    function checkTableConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "CHECK" }, (v) => null),
          t({ text: "(" }, (v) => null),
          s([expression], (v) => ({ expression: v[0] })),
          t({ text: ")" }, (v) => null)
        ],
        (v) => Object.assign({ type: "CHECK" }, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function foreignTableConstraint(ctx) {
      return s(
        [
          constraintName,
          t({ text: "FOREIGN" }, (v) => null),
          t({ text: "KEY" }, (v) => null),
          t({ text: "(" }, (v) => null),
          columnNameList,
          t({ text: ")" }, (v) => null),
          foreignKeyClause
        ],
        (v) => Object.assign({ type: "FOREIGN KEY" }, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function foreignKeyClause(ctx) {
      return s(
        [
          t({ text: "REFERENCES" }, (v) => null),
          table,
          columnNameListOptional,
          o(
            m(a([deleteReference, updateReference, matchReference])),
            (v) => Object.assign({ delete: null, update: null, match: null }, ...v || [])
          ),
          deferrable
        ],
        (v) => ({ references: Object.assign({}, ...v.filter((x) => x !== null)) })
      )(ctx);
    }
    function columnNameListOptional(ctx) {
      return o(
        s([t({ text: "(" }), columnNameList, t({ text: ")" })], (v) => v[1]),
        (v) => ({ columns: v ? v.columns : [] })
      )(ctx);
    }
    function columnNameList(ctx) {
      return s(
        [
          o(
            m(s([identifier, t({ text: "," })], (v) => v[0])),
            (v) => v !== null ? v : []
          ),
          identifier
        ],
        (v) => ({ columns: v[0].concat([v[1]]) })
      )(ctx);
    }
    function deleteReference(ctx) {
      return s([t({ text: "ON" }), t({ text: "DELETE" }), onAction], (v) => ({
        delete: v[2]
      }))(ctx);
    }
    function updateReference(ctx) {
      return s([t({ text: "ON" }), t({ text: "UPDATE" }), onAction], (v) => ({
        update: v[2]
      }))(ctx);
    }
    function matchReference(ctx) {
      return s(
        [t({ text: "MATCH" }), a([t({ type: "keyword" }), t({ type: "id" })])],
        (v) => ({ match: v[1] })
      )(ctx);
    }
    function deferrable(ctx) {
      return o(
        s([
          o(t({ text: "NOT" })),
          t({ text: "DEFERRABLE" }),
          o(
            s(
              [
                t({ text: "INITIALLY" }),
                a([t({ text: "DEFERRED" }), t({ text: "IMMEDIATE" })])
              ],
              (v) => v[1].toUpperCase()
            )
          )
        ]),
        (v) => ({ deferrable: v ? { not: v[0] !== null, initially: v[2] } : null })
      )(ctx);
    }
    function constraintName(ctx) {
      return o(
        s([t({ text: "CONSTRAINT" }), identifier], (v) => v[1]),
        (v) => ({ name: v })
      )(ctx);
    }
    function createIndex(ctx) {
      return s(
        [
          t({ text: "CREATE" }, (v) => null),
          unique,
          t({ text: "INDEX" }, (v) => null),
          exists,
          schema,
          index,
          t({ text: "ON" }, (v) => null),
          table,
          t({ text: "(" }, (v) => null),
          indexedColumnList,
          t({ text: ")" }, (v) => null),
          where,
          f
        ],
        (v) => Object.assign({}, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function unique(ctx) {
      return o(t({ text: "UNIQUE" }), (v) => ({ unique: v !== null }))(ctx);
    }
    function exists(ctx) {
      return o(
        s([t({ text: "IF" }), t({ text: "NOT" }), t({ text: "EXISTS" })]),
        (v) => ({ exists: v !== null })
      )(ctx);
    }
    function schema(ctx) {
      return o(
        s([identifier, t({ text: "." })], (v) => v[0]),
        (v) => ({ schema: v })
      )(ctx);
    }
    function index(ctx) {
      return s([identifier], (v) => ({ index: v[0] }))(ctx);
    }
    function table(ctx) {
      return s([identifier], (v) => ({ table: v[0] }))(ctx);
    }
    function where(ctx) {
      return o(
        s([t({ text: "WHERE" }), expression], (v) => v[1]),
        (v) => ({ where: v })
      )(ctx);
    }
    function indexedColumnList(ctx) {
      return a([
        s([indexedColumn, t({ text: "," }), indexedColumnList], (v) => ({
          columns: [v[0]].concat(v[2].columns)
        })),
        s([indexedColumnExpression, t({ text: "," }), indexedColumnList], (v) => ({
          columns: [v[0]].concat(v[2].columns)
        })),
        l({ do: indexedColumn, next: t({ text: ")" }) }, (v) => ({
          columns: [v]
        })),
        l({ do: indexedColumnExpression, next: t({ text: ")" }) }, (v) => ({
          columns: [v]
        }))
      ])(ctx);
    }
    function indexedColumn(ctx) {
      return s(
        [
          s([identifier], (v) => ({ name: v[0], expression: false })),
          collation,
          order
        ],
        (v) => Object.assign({}, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function indexedColumnExpression(ctx) {
      return s(
        [
          s([indexedExpression], (v) => ({ name: v[0], expression: true })),
          collation,
          order
        ],
        (v) => Object.assign({}, ...v.filter((x) => x !== null))
      )(ctx);
    }
    function collation(ctx) {
      return o(
        s([t({ text: "COLLATE" }), t({ type: "id" })], (v) => v[1]),
        (v) => ({ collation: v })
      )(ctx);
    }
    function order(ctx) {
      return a([t({ text: "ASC" }), t({ text: "DESC" }), e], (v) => ({
        order: v ? v.toUpperCase() : null
      }))(ctx);
    }
    function indexedExpression(ctx) {
      return m(
        a([
          n({
            do: t({ type: "keyword" }),
            not: a([
              t({ text: "COLLATE" }),
              t({ text: "ASC" }),
              t({ text: "DESC" })
            ])
          }),
          t({ type: "id" }),
          t({ type: "string" }),
          t({ type: "blob" }),
          t({ type: "numeric" }),
          t({ type: "variable" }),
          n({
            do: t({ type: "operator" }),
            not: a([t({ text: "(" }), t({ text: ")" }), t({ text: "," })])
          }),
          s([t({ text: "(" }), o(expression), t({ text: ")" })], (v) => v[1] || [])
        ])
      )(ctx);
    }
    function expression(ctx) {
      return m(
        a([
          t({ type: "keyword" }),
          t({ type: "id" }),
          t({ type: "string" }),
          t({ type: "blob" }),
          t({ type: "numeric" }),
          t({ type: "variable" }),
          n({
            do: t({ type: "operator" }),
            not: a([t({ text: "(" }), t({ text: ")" })])
          }),
          s([t({ text: "(" }), o(expression), t({ text: ")" })], (v) => v[1] || [])
        ])
      )(ctx);
    }
    function identifier(ctx) {
      return a(
        [t({ type: "id" }), t({ type: "string" })],
        (v) => /^["`['][^]*["`\]']$/.test(v) ? v.substring(1, v.length - 1) : v
      )(ctx);
    }
    function onAction(ctx) {
      return a(
        [
          s([t({ text: "SET" }), t({ text: "NULL" })], (v) => `${v[0]} ${v[1]}`),
          s([t({ text: "SET" }), t({ text: "DEFAULT" })], (v) => `${v[0]} ${v[1]}`),
          t({ text: "CASCADE" }),
          t({ text: "RESTRICT" }),
          s([t({ text: "NO" }), t({ text: "ACTION" })], (v) => `${v[0]} ${v[1]}`)
        ],
        (v) => v.toUpperCase()
      )(ctx);
    }
    function literalValue(ctx) {
      return a([
        t({ type: "numeric" }),
        t({ type: "string" }),
        t({ type: "id" }),
        t({ type: "blob" }),
        t({ text: "NULL" }),
        t({ text: "TRUE" }),
        t({ text: "FALSE" }),
        t({ text: "CURRENT_TIME" }),
        t({ text: "CURRENT_DATE" }),
        t({ text: "CURRENT_TIMESTAMP" })
      ])(ctx);
    }
    function signedNumber(ctx) {
      return s(
        [a([t({ text: "+" }), t({ text: "-" }), e]), t({ type: "numeric" })],
        (v) => `${v[0] || ""}${v[1]}`
      )(ctx);
    }
    module2.exports = {
      parseCreateTable,
      parseCreateIndex
    };
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/internal/compiler.js
var require_compiler2 = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/internal/compiler.js"(exports2, module2) {
    "use strict";
    function compileCreateTable(ast, wrap = (v) => v) {
      return createTable(ast, wrap);
    }
    function compileCreateIndex(ast, wrap = (v) => v) {
      return createIndex(ast, wrap);
    }
    function createTable(ast, wrap) {
      return `CREATE${temporary(ast, wrap)} TABLE${exists(ast, wrap)} ${schema(
        ast,
        wrap
      )}${table(ast, wrap)} (${columnDefinitionList(
        ast,
        wrap
      )}${tableConstraintList(ast, wrap)})${rowid(ast, wrap)}`;
    }
    function temporary(ast, wrap) {
      return ast.temporary ? " TEMP" : "";
    }
    function rowid(ast, wrap) {
      return ast.rowid ? " WITHOUT ROWID" : "";
    }
    function columnDefinitionList(ast, wrap) {
      return ast.columns.map((column) => columnDefinition(column, wrap)).join(", ");
    }
    function columnDefinition(ast, wrap) {
      return `${identifier(ast.name, wrap)}${typeName(
        ast,
        wrap
      )}${columnConstraintList(ast.constraints, wrap)}`;
    }
    function typeName(ast, wrap) {
      return ast.type !== null ? ` ${ast.type}` : "";
    }
    function columnConstraintList(ast, wrap) {
      return `${primaryColumnConstraint(ast, wrap)}${notnullColumnConstraint(
        ast,
        wrap
      )}${nullColumnConstraint(ast, wrap)}${uniqueColumnConstraint(
        ast,
        wrap
      )}${checkColumnConstraint(ast, wrap)}${defaultColumnConstraint(
        ast,
        wrap
      )}${collateColumnConstraint(ast, wrap)}${referencesColumnConstraint(
        ast,
        wrap
      )}${asColumnConstraint(ast, wrap)}`;
    }
    function primaryColumnConstraint(ast, wrap) {
      return ast.primary !== null ? ` ${constraintName(ast.primary, wrap)}PRIMARY KEY${order(
        ast.primary,
        wrap
      )}${conflictClause(ast.primary, wrap)}${autoincrement(ast.primary, wrap)}` : "";
    }
    function autoincrement(ast, wrap) {
      return ast.autoincrement ? " AUTOINCREMENT" : "";
    }
    function notnullColumnConstraint(ast, wrap) {
      return ast.notnull !== null ? ` ${constraintName(ast.notnull, wrap)}NOT NULL${conflictClause(
        ast.notnull,
        wrap
      )}` : "";
    }
    function nullColumnConstraint(ast, wrap) {
      return ast.null !== null ? ` ${constraintName(ast.null, wrap)}NULL${conflictClause(ast.null, wrap)}` : "";
    }
    function uniqueColumnConstraint(ast, wrap) {
      return ast.unique !== null ? ` ${constraintName(ast.unique, wrap)}UNIQUE${conflictClause(
        ast.unique,
        wrap
      )}` : "";
    }
    function checkColumnConstraint(ast, wrap) {
      return ast.check !== null ? ` ${constraintName(ast.check, wrap)}CHECK (${expression(
        ast.check.expression,
        wrap
      )})` : "";
    }
    function defaultColumnConstraint(ast, wrap) {
      return ast.default !== null ? ` ${constraintName(ast.default, wrap)}DEFAULT ${!ast.default.expression ? ast.default.value : `(${expression(ast.default.value, wrap)})`}` : "";
    }
    function collateColumnConstraint(ast, wrap) {
      return ast.collate !== null ? ` ${constraintName(ast.collate, wrap)}COLLATE ${ast.collate.collation}` : "";
    }
    function referencesColumnConstraint(ast, wrap) {
      return ast.references !== null ? ` ${constraintName(ast.references, wrap)}${foreignKeyClause(
        ast.references,
        wrap
      )}` : "";
    }
    function asColumnConstraint(ast, wrap) {
      return ast.as !== null ? ` ${constraintName(ast.as, wrap)}${ast.as.generated ? "GENERATED ALWAYS " : ""}AS (${expression(ast.as.expression, wrap)})${ast.as.mode !== null ? ` ${ast.as.mode}` : ""}` : "";
    }
    function tableConstraintList(ast, wrap) {
      return ast.constraints.reduce(
        (constraintList, constraint) => `${constraintList}, ${tableConstraint(constraint, wrap)}`,
        ""
      );
    }
    function tableConstraint(ast, wrap) {
      switch (ast.type) {
        case "PRIMARY KEY":
          return primaryTableConstraint(ast, wrap);
        case "UNIQUE":
          return uniqueTableConstraint(ast, wrap);
        case "CHECK":
          return checkTableConstraint(ast, wrap);
        case "FOREIGN KEY":
          return foreignTableConstraint(ast, wrap);
      }
    }
    function primaryTableConstraint(ast, wrap) {
      return `${constraintName(ast, wrap)}PRIMARY KEY (${indexedColumnList(
        ast,
        wrap
      )})${conflictClause(ast, wrap)}`;
    }
    function uniqueTableConstraint(ast, wrap) {
      return `${constraintName(ast, wrap)}UNIQUE (${indexedColumnList(
        ast,
        wrap
      )})${conflictClause(ast, wrap)}`;
    }
    function conflictClause(ast, wrap) {
      return ast.conflict !== null ? ` ON CONFLICT ${ast.conflict}` : "";
    }
    function checkTableConstraint(ast, wrap) {
      return `${constraintName(ast, wrap)}CHECK (${expression(
        ast.expression,
        wrap
      )})`;
    }
    function foreignTableConstraint(ast, wrap) {
      return `${constraintName(ast, wrap)}FOREIGN KEY (${columnNameList(
        ast,
        wrap
      )}) ${foreignKeyClause(ast.references, wrap)}`;
    }
    function foreignKeyClause(ast, wrap) {
      return `REFERENCES ${table(ast, wrap)}${columnNameListOptional(
        ast,
        wrap
      )}${deleteUpdateMatchList(ast, wrap)}${deferrable(ast.deferrable, wrap)}`;
    }
    function columnNameListOptional(ast, wrap) {
      return ast.columns.length > 0 ? ` (${columnNameList(ast, wrap)})` : "";
    }
    function columnNameList(ast, wrap) {
      return ast.columns.map((column) => identifier(column, wrap)).join(", ");
    }
    function deleteUpdateMatchList(ast, wrap) {
      return `${deleteReference(ast, wrap)}${updateReference(
        ast,
        wrap
      )}${matchReference(ast, wrap)}`;
    }
    function deleteReference(ast, wrap) {
      return ast.delete !== null ? ` ON DELETE ${ast.delete}` : "";
    }
    function updateReference(ast, wrap) {
      return ast.update !== null ? ` ON UPDATE ${ast.update}` : "";
    }
    function matchReference(ast, wrap) {
      return ast.match !== null ? ` MATCH ${ast.match}` : "";
    }
    function deferrable(ast, wrap) {
      return ast !== null ? ` ${ast.not ? "NOT " : ""}DEFERRABLE${ast.initially !== null ? ` INITIALLY ${ast.initially}` : ""}` : "";
    }
    function constraintName(ast, wrap) {
      return ast.name !== null ? `CONSTRAINT ${identifier(ast.name, wrap)} ` : "";
    }
    function createIndex(ast, wrap) {
      return `CREATE${unique(ast, wrap)} INDEX${exists(ast, wrap)} ${schema(
        ast,
        wrap
      )}${index(ast, wrap)} on ${table(ast, wrap)} (${indexedColumnList(
        ast,
        wrap
      )})${where(ast, wrap)}`;
    }
    function unique(ast, wrap) {
      return ast.unique ? " UNIQUE" : "";
    }
    function exists(ast, wrap) {
      return ast.exists ? " IF NOT EXISTS" : "";
    }
    function schema(ast, wrap) {
      return ast.schema !== null ? `${identifier(ast.schema, wrap)}.` : "";
    }
    function index(ast, wrap) {
      return identifier(ast.index, wrap);
    }
    function table(ast, wrap) {
      return identifier(ast.table, wrap);
    }
    function where(ast, wrap) {
      return ast.where !== null ? ` where ${expression(ast.where)}` : "";
    }
    function indexedColumnList(ast, wrap) {
      return ast.columns.map(
        (column) => !column.expression ? indexedColumn(column, wrap) : indexedColumnExpression(column, wrap)
      ).join(", ");
    }
    function indexedColumn(ast, wrap) {
      return `${identifier(ast.name, wrap)}${collation(ast, wrap)}${order(
        ast,
        wrap
      )}`;
    }
    function indexedColumnExpression(ast, wrap) {
      return `${indexedExpression(ast.name, wrap)}${collation(ast, wrap)}${order(
        ast,
        wrap
      )}`;
    }
    function collation(ast, wrap) {
      return ast.collation !== null ? ` COLLATE ${ast.collation}` : "";
    }
    function order(ast, wrap) {
      return ast.order !== null ? ` ${ast.order}` : "";
    }
    function indexedExpression(ast, wrap) {
      return expression(ast, wrap);
    }
    function expression(ast, wrap) {
      return ast.reduce(
        (expr, e) => Array.isArray(e) ? `${expr}(${expression(e)})` : !expr ? e : `${expr} ${e}`,
        ""
      );
    }
    function identifier(ast, wrap) {
      return wrap(ast);
    }
    module2.exports = {
      compileCreateTable,
      compileCreateIndex
    };
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/internal/utils.js
var require_utils2 = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/internal/utils.js"(exports2, module2) {
    "use strict";
    function isEqualId(first, second) {
      return first.toLowerCase() === second.toLowerCase();
    }
    function includesId(list, id) {
      return list.some((item) => isEqualId(item, id));
    }
    module2.exports = {
      isEqualId,
      includesId
    };
  }
});

// node_modules/knex/lib/dialects/sqlite3/schema/ddl.js
var require_ddl = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/schema/ddl.js"(exports2, module2) {
    "use strict";
    var identity = require_identity();
    var { nanonum } = require_nanoid();
    var {
      copyData,
      dropOriginal,
      renameTable,
      getTableSql,
      isForeignCheckEnabled,
      setForeignCheck,
      executeForeignCheck
    } = require_sqlite_ddl_operations();
    var { parseCreateTable, parseCreateIndex } = require_parser();
    var {
      compileCreateTable,
      compileCreateIndex
    } = require_compiler2();
    var { isEqualId, includesId } = require_utils2();
    var SQLite3_DDL = class {
      constructor(client, tableCompiler, pragma, connection) {
        this.client = client;
        this.tableCompiler = tableCompiler;
        this.pragma = pragma;
        this.tableNameRaw = this.tableCompiler.tableNameRaw;
        this.alteredName = `_knex_temp_alter${nanonum(3)}`;
        this.connection = connection;
        this.formatter = (value) => this.client.customWrapIdentifier(value, identity);
        this.wrap = (value) => this.client.wrapIdentifierImpl(value);
      }
      tableName() {
        return this.formatter(this.tableNameRaw);
      }
      getTableSql() {
        const tableName = this.tableName();
        return this.client.transaction(
          async (trx) => {
            trx.disableProcessing();
            const result = await trx.raw(getTableSql(tableName));
            trx.enableProcessing();
            return {
              createTable: result.filter((create) => create.type === "table")[0].sql,
              createIndices: result.filter((create) => create.type === "index").map((create) => create.sql)
            };
          },
          { connection: this.connection }
        );
      }
      async isForeignCheckEnabled() {
        const result = await this.client.raw(isForeignCheckEnabled()).connection(this.connection);
        return result[0].foreign_keys === 1;
      }
      async setForeignCheck(enable) {
        await this.client.raw(setForeignCheck(enable)).connection(this.connection);
      }
      renameTable(trx) {
        return trx.raw(renameTable(this.alteredName, this.tableName()));
      }
      dropOriginal(trx) {
        return trx.raw(dropOriginal(this.tableName()));
      }
      copyData(trx, columns) {
        return trx.raw(copyData(this.tableName(), this.alteredName, columns));
      }
      async alterColumn(columns) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        parsedTable.columns = parsedTable.columns.map((column) => {
          const newColumnInfo = columns.find((c) => isEqualId(c.name, column.name));
          if (newColumnInfo) {
            column.type = newColumnInfo.type;
            column.constraints.default = newColumnInfo.defaultTo !== null ? {
              name: null,
              value: newColumnInfo.defaultTo,
              expression: false
            } : null;
            column.constraints.notnull = newColumnInfo.notNull ? { name: null, conflict: null } : null;
            column.constraints.null = newColumnInfo.notNull ? null : column.constraints.null;
          }
          return column;
        });
        const newTable = compileCreateTable(parsedTable, this.wrap);
        return this.generateAlterCommands(newTable, createIndices);
      }
      async dropColumn(columns) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        parsedTable.columns = parsedTable.columns.filter(
          (parsedColumn) => parsedColumn.expression || !includesId(columns, parsedColumn.name)
        );
        if (parsedTable.columns.length === 0) {
          throw new Error("Unable to drop last column from table");
        }
        parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
          if (constraint.type === "PRIMARY KEY" || constraint.type === "UNIQUE") {
            return constraint.columns.every(
              (constraintColumn) => constraintColumn.expression || !includesId(columns, constraintColumn.name)
            );
          } else if (constraint.type === "FOREIGN KEY") {
            return constraint.columns.every(
              (constraintColumnName) => !includesId(columns, constraintColumnName)
            ) && (constraint.references.table !== parsedTable.table || constraint.references.columns.every(
              (referenceColumnName) => !includesId(columns, referenceColumnName)
            ));
          } else {
            return true;
          }
        });
        const newColumns = parsedTable.columns.map((column) => column.name);
        const newTable = compileCreateTable(parsedTable, this.wrap);
        const newIndices = [];
        for (const createIndex of createIndices) {
          const parsedIndex = parseCreateIndex(createIndex);
          parsedIndex.columns = parsedIndex.columns.filter(
            (parsedColumn) => parsedColumn.expression || !includesId(columns, parsedColumn.name)
          );
          if (parsedIndex.columns.length > 0) {
            newIndices.push(compileCreateIndex(parsedIndex, this.wrap));
          }
        }
        return this.alter(newTable, newIndices, newColumns);
      }
      async dropForeign(columns, foreignKeyName) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        if (!foreignKeyName) {
          parsedTable.columns = parsedTable.columns.map((column) => ({
            ...column,
            references: includesId(columns, column.name) ? null : column.references
          }));
        }
        parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
          if (constraint.type === "FOREIGN KEY") {
            if (foreignKeyName) {
              return !constraint.name || !isEqualId(constraint.name, foreignKeyName);
            }
            return constraint.columns.every(
              (constraintColumnName) => !includesId(columns, constraintColumnName)
            );
          } else {
            return true;
          }
        });
        const newTable = compileCreateTable(parsedTable, this.wrap);
        return this.alter(newTable, createIndices);
      }
      async dropPrimary(constraintName) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        parsedTable.columns = parsedTable.columns.map((column) => ({
          ...column,
          primary: null
        }));
        parsedTable.constraints = parsedTable.constraints.filter((constraint) => {
          if (constraint.type === "PRIMARY KEY") {
            if (constraintName) {
              return !constraint.name || !isEqualId(constraint.name, constraintName);
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
        const newTable = compileCreateTable(parsedTable, this.wrap);
        return this.alter(newTable, createIndices);
      }
      async primary(columns, constraintName) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        parsedTable.columns = parsedTable.columns.map((column) => ({
          ...column,
          primary: null
        }));
        parsedTable.constraints = parsedTable.constraints.filter(
          (constraint) => constraint.type !== "PRIMARY KEY"
        );
        parsedTable.constraints.push({
          type: "PRIMARY KEY",
          name: constraintName || null,
          columns: columns.map((column) => ({
            name: column,
            expression: false,
            collation: null,
            order: null
          })),
          conflict: null
        });
        const newTable = compileCreateTable(parsedTable, this.wrap);
        return this.alter(newTable, createIndices);
      }
      async foreign(foreignInfo) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        parsedTable.constraints.push({
          type: "FOREIGN KEY",
          name: foreignInfo.keyName || null,
          columns: foreignInfo.column,
          references: {
            table: foreignInfo.inTable,
            columns: foreignInfo.references,
            delete: foreignInfo.onDelete || null,
            update: foreignInfo.onUpdate || null,
            match: null,
            deferrable: null
          }
        });
        const newTable = compileCreateTable(parsedTable, this.wrap);
        return this.generateAlterCommands(newTable, createIndices);
      }
      async setNullable(column, isNullable) {
        const { createTable, createIndices } = await this.getTableSql();
        const parsedTable = parseCreateTable(createTable);
        parsedTable.table = this.alteredName;
        const parsedColumn = parsedTable.columns.find(
          (c) => isEqualId(column, c.name)
        );
        if (!parsedColumn) {
          throw new Error(
            `.setNullable: Column ${column} does not exist in table ${this.tableName()}.`
          );
        }
        parsedColumn.constraints.notnull = isNullable ? null : { name: null, conflict: null };
        parsedColumn.constraints.null = isNullable ? parsedColumn.constraints.null : null;
        const newTable = compileCreateTable(parsedTable, this.wrap);
        return this.generateAlterCommands(newTable, createIndices);
      }
      async alter(newSql, createIndices, columns) {
        const wasForeignCheckEnabled = await this.isForeignCheckEnabled();
        if (wasForeignCheckEnabled) {
          await this.setForeignCheck(false);
        }
        try {
          await this.client.transaction(
            async (trx) => {
              await trx.raw(newSql);
              await this.copyData(trx, columns);
              await this.dropOriginal(trx);
              await this.renameTable(trx);
              for (const createIndex of createIndices) {
                await trx.raw(createIndex);
              }
              if (wasForeignCheckEnabled) {
                const foreignViolations = await trx.raw(executeForeignCheck());
                if (foreignViolations.length > 0) {
                  throw new Error("FOREIGN KEY constraint failed");
                }
              }
            },
            { connection: this.connection }
          );
        } finally {
          if (wasForeignCheckEnabled) {
            await this.setForeignCheck(true);
          }
        }
      }
      async generateAlterCommands(newSql, createIndices, columns) {
        const sql = [];
        const pre = [];
        const post = [];
        let check = null;
        sql.push(newSql);
        sql.push(copyData(this.tableName(), this.alteredName, columns));
        sql.push(dropOriginal(this.tableName()));
        sql.push(renameTable(this.alteredName, this.tableName()));
        for (const createIndex of createIndices) {
          sql.push(createIndex);
        }
        const isForeignCheckEnabled2 = await this.isForeignCheckEnabled();
        if (isForeignCheckEnabled2) {
          pre.push(setForeignCheck(false));
          post.push(setForeignCheck(true));
          check = executeForeignCheck();
        }
        return { pre, sql, check, post };
      }
    };
    module2.exports = SQLite3_DDL;
  }
});

// node_modules/knex/lib/dialects/sqlite3/query/sqlite-querybuilder.js
var require_sqlite_querybuilder = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/query/sqlite-querybuilder.js"(exports2, module2) {
    "use strict";
    var QueryBuilder = require_querybuilder();
    module2.exports = class QueryBuilder_SQLite3 extends QueryBuilder {
      withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
        this._validateWithArgs(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          "with"
        );
        return this.withWrapped(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          true
        );
      }
      withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
        this._validateWithArgs(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          "with"
        );
        return this.withWrapped(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          false
        );
      }
    };
  }
});

// node_modules/knex/lib/dialects/sqlite3/index.js
var require_sqlite3 = __commonJS({
  "node_modules/knex/lib/dialects/sqlite3/index.js"(exports2, module2) {
    "use strict";
    var defaults = require_defaults();
    var map = require_map();
    var { promisify } = require("util");
    var Client = require_client();
    var Raw = require_raw();
    var Transaction = require_sqlite_transaction();
    var SqliteQueryCompiler = require_sqlite_querycompiler();
    var SchemaCompiler = require_sqlite_compiler();
    var ColumnCompiler = require_sqlite_columncompiler();
    var TableCompiler = require_sqlite_tablecompiler();
    var ViewCompiler = require_sqlite_viewcompiler();
    var SQLite3_DDL = require_ddl();
    var Formatter = require_formatter();
    var QueryBuilder = require_sqlite_querybuilder();
    var Client_SQLite3 = class extends Client {
      constructor(config3) {
        super(config3);
        if (config3.connection && config3.connection.filename === void 0) {
          this.logger.warn(
            "Could not find `connection.filename` in config. Please specify the database path and name to avoid errors. (see docs https://knexjs.org/guide/#configuration-options)"
          );
        }
        if (config3.useNullAsDefault === void 0) {
          this.logger.warn(
            "sqlite does not support inserting default values. Set the `useNullAsDefault` flag to hide this warning. (see docs https://knexjs.org/guide/query-builder.html#insert)."
          );
        }
      }
      _driver() {
        return require("sqlite3");
      }
      schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
      }
      transaction() {
        return new Transaction(this, ...arguments);
      }
      queryCompiler(builder, formatter) {
        return new SqliteQueryCompiler(this, builder, formatter);
      }
      queryBuilder() {
        return new QueryBuilder(this);
      }
      viewCompiler(builder, formatter) {
        return new ViewCompiler(this, builder, formatter);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      ddl(compiler, pragma, connection) {
        return new SQLite3_DDL(this, compiler, pragma, connection);
      }
      wrapIdentifierImpl(value) {
        return value !== "*" ? `\`${value.replace(/`/g, "``")}\`` : "*";
      }
      // Get a raw connection from the database, returning a promise with the connection object.
      acquireRawConnection() {
        return new Promise((resolve, reject) => {
          let flags = this.driver.OPEN_READWRITE | this.driver.OPEN_CREATE;
          if (this.connectionSettings.flags) {
            if (!Array.isArray(this.connectionSettings.flags)) {
              throw new Error(`flags must be an array of strings`);
            }
            this.connectionSettings.flags.forEach((_flag) => {
              if (!_flag.startsWith("OPEN_") || !this.driver[_flag]) {
                throw new Error(`flag ${_flag} not supported by node-sqlite3`);
              }
              flags = flags | this.driver[_flag];
            });
          }
          const db = new this.driver.Database(
            this.connectionSettings.filename,
            flags,
            (err) => {
              if (err) {
                return reject(err);
              }
              resolve(db);
            }
          );
        });
      }
      // Used to explicitly close a connection, called internally by the pool when
      // a connection times out or the pool is shutdown.
      async destroyRawConnection(connection) {
        const close = promisify((cb) => connection.close(cb));
        return close();
      }
      // Runs the query on the specified connection, providing the bindings and any
      // other necessary prep work.
      _query(connection, obj) {
        if (!obj.sql) throw new Error("The query is empty");
        const { method } = obj;
        let callMethod;
        switch (method) {
          case "insert":
          case "update":
            callMethod = obj.returning ? "all" : "run";
            break;
          case "counter":
          case "del":
            callMethod = "run";
            break;
          default:
            callMethod = "all";
        }
        return new Promise(function(resolver, rejecter) {
          if (!connection || !connection[callMethod]) {
            return rejecter(
              new Error(`Error calling ${callMethod} on connection.`)
            );
          }
          connection[callMethod](obj.sql, obj.bindings, function(err, response) {
            if (err) return rejecter(err);
            obj.response = response;
            obj.context = this;
            return resolver(obj);
          });
        });
      }
      _stream(connection, obj, stream) {
        if (!obj.sql) throw new Error("The query is empty");
        const client = this;
        return new Promise(function(resolver, rejecter) {
          stream.on("error", rejecter);
          stream.on("end", resolver);
          return client._query(connection, obj).then((obj2) => obj2.response).then((rows) => rows.forEach((row) => stream.write(row))).catch(function(err) {
            stream.emit("error", err);
          }).then(function() {
            stream.end();
          });
        });
      }
      // Ensures the response is returned in the same format as other clients.
      processResponse(obj, runner) {
        const ctx = obj.context;
        const { response, returning } = obj;
        if (obj.output) return obj.output.call(runner, response);
        switch (obj.method) {
          case "select":
            return response;
          case "first":
            return response[0];
          case "pluck":
            return map(response, obj.pluck);
          case "insert": {
            if (returning) {
              if (response) {
                return response;
              }
            }
            return [ctx.lastID];
          }
          case "update": {
            if (returning) {
              if (response) {
                return response;
              }
            }
            return ctx.changes;
          }
          case "del":
          case "counter":
            return ctx.changes;
          default: {
            return response;
          }
        }
      }
      poolDefaults() {
        return defaults({ min: 1, max: 1 }, super.poolDefaults());
      }
      formatter(builder) {
        return new Formatter(this, builder);
      }
      values(values, builder, formatter) {
        if (Array.isArray(values)) {
          if (Array.isArray(values[0])) {
            return `( values ${values.map(
              (value) => `(${this.parameterize(value, void 0, builder, formatter)})`
            ).join(", ")})`;
          }
          return `(${this.parameterize(values, void 0, builder, formatter)})`;
        }
        if (values instanceof Raw) {
          return `(${this.parameter(values, builder, formatter)})`;
        }
        return this.parameter(values, builder, formatter);
      }
    };
    Object.assign(Client_SQLite3.prototype, {
      dialect: "sqlite3",
      driverName: "sqlite3"
    });
    module2.exports = Client_SQLite3;
  }
});

// node_modules/knex/lib/dialects/better-sqlite3/index.js
var require_better_sqlite3 = __commonJS({
  "node_modules/knex/lib/dialects/better-sqlite3/index.js"(exports2, module2) {
    "use strict";
    var Client_SQLite3 = require_sqlite3();
    var Client_BetterSQLite3 = class extends Client_SQLite3 {
      _driver() {
        return require("better-sqlite3");
      }
      // Get a raw connection from the database, returning a promise with the connection object.
      async acquireRawConnection() {
        const options = this.connectionSettings.options || {};
        return new this.driver(this.connectionSettings.filename, {
          nativeBinding: options.nativeBinding,
          readonly: !!options.readonly
        });
      }
      // Used to explicitly close a connection, called internally by the pool when
      // a connection times out or the pool is shutdown.
      async destroyRawConnection(connection) {
        return connection.close();
      }
      // Runs the query on the specified connection, providing the bindings and any
      // other necessary prep work.
      async _query(connection, obj) {
        if (!obj.sql) throw new Error("The query is empty");
        if (!connection) {
          throw new Error("No connection provided");
        }
        const statement = connection.prepare(obj.sql);
        const bindings = this._formatBindings(obj.bindings);
        if (statement.reader) {
          const response2 = await statement.all(bindings);
          obj.response = response2;
          return obj;
        }
        const response = await statement.run(bindings);
        obj.response = response;
        obj.context = {
          lastID: response.lastInsertRowid,
          changes: response.changes
        };
        return obj;
      }
      _formatBindings(bindings) {
        if (!bindings) {
          return [];
        }
        return bindings.map((binding) => {
          if (binding instanceof Date) {
            return binding.valueOf();
          }
          if (typeof binding === "boolean") {
            return Number(binding);
          }
          return binding;
        });
      }
    };
    Object.assign(Client_BetterSQLite3.prototype, {
      // The "dialect", for reference .
      driverName: "better-sqlite3"
    });
    module2.exports = Client_BetterSQLite3;
  }
});

// node_modules/knex/lib/dialects/postgres/execution/pg-transaction.js
var require_pg_transaction = __commonJS({
  "node_modules/knex/lib/dialects/postgres/execution/pg-transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    var Transaction_PG = class extends Transaction {
      begin(conn) {
        const trxMode = [
          this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : "",
          this.readOnly ? "READ ONLY" : ""
        ].join(" ").trim();
        if (trxMode.length === 0) {
          return this.query(conn, "BEGIN;");
        }
        return this.query(conn, `BEGIN TRANSACTION ${trxMode};`);
      }
    };
    module2.exports = Transaction_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/query/pg-querycompiler.js
var require_pg_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/postgres/query/pg-querycompiler.js"(exports2, module2) {
    "use strict";
    var identity = require_identity();
    var reduce = require_reduce();
    var QueryCompiler = require_querycompiler();
    var {
      wrapString,
      columnize: columnize_,
      operator: operator_,
      wrap: wrap_
    } = require_wrappingFormatter();
    var QueryCompiler_PG = class extends QueryCompiler {
      constructor(client, builder, formatter) {
        super(client, builder, formatter);
        this._defaultInsertValue = "default";
      }
      // Compiles a truncate query.
      truncate() {
        return `truncate ${this.tableName} restart identity`;
      }
      // is used if the an array with multiple empty values supplied
      // Compiles an `insert` query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        let sql = super.insert();
        if (sql === "") return sql;
        const { returning, onConflict, ignore, merge, insert } = this.single;
        if (onConflict && ignore) sql += this._ignore(onConflict);
        if (onConflict && merge) {
          sql += this._merge(merge.updates, onConflict, insert);
          const wheres = this.where();
          if (wheres) sql += ` ${wheres}`;
        }
        if (returning) sql += this._returning(returning);
        return {
          sql,
          returning
        };
      }
      // Compiles an `update` query, allowing for a return value.
      update() {
        const withSQL = this.with();
        const updateData = this._prepUpdate(this.single.update);
        const wheres = this.where();
        const { returning, updateFrom } = this.single;
        return {
          sql: withSQL + `update ${this.single.only ? "only " : ""}${this.tableName} set ${updateData.join(", ")}` + this._updateFrom(updateFrom) + (wheres ? ` ${wheres}` : "") + this._returning(returning),
          returning
        };
      }
      using() {
        const usingTables = this.single.using;
        if (!usingTables) return;
        let sql = "using ";
        if (Array.isArray(usingTables)) {
          sql += usingTables.map((table) => {
            return this.formatter.wrap(table);
          }).join(",");
        } else {
          sql += this.formatter.wrap(usingTables);
        }
        return sql;
      }
      // Compiles an `delete` query, allowing for a return value.
      del() {
        const { tableName } = this;
        const withSQL = this.with();
        let wheres = this.where() || "";
        let using = this.using() || "";
        const joins = this.grouped.join;
        const tableJoins = [];
        if (Array.isArray(joins)) {
          for (const join of joins) {
            tableJoins.push(
              wrap_(
                this._joinTable(join),
                void 0,
                this.builder,
                this.client,
                this.bindingsHolder
              )
            );
            const joinWheres = [];
            for (const clause of join.clauses) {
              joinWheres.push(
                this.whereBasic({
                  column: clause.column,
                  operator: "=",
                  value: clause.value,
                  asColumn: true
                })
              );
            }
            if (joinWheres.length > 0) {
              wheres += (wheres ? " and " : "where ") + joinWheres.join(" and ");
            }
          }
          if (tableJoins.length > 0) {
            using += (using ? "," : "using ") + tableJoins.join(",");
          }
        }
        const sql = withSQL + `delete from ${this.single.only ? "only " : ""}${tableName}` + (using ? ` ${using}` : "") + (wheres ? ` ${wheres}` : "");
        const { returning } = this.single;
        return {
          sql: sql + this._returning(returning),
          returning
        };
      }
      aggregate(stmt) {
        return this._aggregate(stmt, { distinctParentheses: true });
      }
      _returning(value) {
        return value ? ` returning ${this.formatter.columnize(value)}` : "";
      }
      _updateFrom(name) {
        return name ? ` from ${this.formatter.wrap(name)}` : "";
      }
      _ignore(columns) {
        if (columns === true) {
          return " on conflict do nothing";
        }
        return ` on conflict ${this._onConflictClause(columns)} do nothing`;
      }
      _merge(updates, columns, insert) {
        let sql = ` on conflict ${this._onConflictClause(columns)} do update set `;
        if (updates && Array.isArray(updates)) {
          sql += updates.map(
            (column) => wrapString(
              column.split(".").pop(),
              this.formatter.builder,
              this.client,
              this.formatter
            )
          ).map((column) => `${column} = excluded.${column}`).join(", ");
          return sql;
        } else if (updates && typeof updates === "object") {
          const updateData = this._prepUpdate(updates);
          if (typeof updateData === "string") {
            sql += updateData;
          } else {
            sql += updateData.join(",");
          }
          return sql;
        } else {
          const insertData = this._prepInsert(insert);
          if (typeof insertData === "string") {
            throw new Error(
              "If using merge with a raw insert query, then updates must be provided"
            );
          }
          sql += insertData.columns.map(
            (column) => wrapString(column.split(".").pop(), this.builder, this.client)
          ).map((column) => `${column} = excluded.${column}`).join(", ");
          return sql;
        }
      }
      // Join array of table names and apply default schema.
      _tableNames(tables) {
        const schemaName = this.single.schema;
        const sql = [];
        for (let i = 0; i < tables.length; i++) {
          let tableName = tables[i];
          if (tableName) {
            if (schemaName) {
              tableName = `${schemaName}.${tableName}`;
            }
            sql.push(this.formatter.wrap(tableName));
          }
        }
        return sql.join(", ");
      }
      _lockingClause(lockMode) {
        const tables = this.single.lockTables || [];
        return lockMode + (tables.length ? " of " + this._tableNames(tables) : "");
      }
      _groupOrder(item, type) {
        return super._groupOrderNulls(item, type);
      }
      forUpdate() {
        return this._lockingClause("for update");
      }
      forShare() {
        return this._lockingClause("for share");
      }
      forNoKeyUpdate() {
        return this._lockingClause("for no key update");
      }
      forKeyShare() {
        return this._lockingClause("for key share");
      }
      skipLocked() {
        return "skip locked";
      }
      noWait() {
        return "nowait";
      }
      // Compiles a columnInfo query
      columnInfo() {
        const column = this.single.columnInfo;
        let schema = this.single.schema;
        const table = this.client.customWrapIdentifier(this.single.table, identity);
        if (schema) {
          schema = this.client.customWrapIdentifier(schema, identity);
        }
        const sql = "select * from information_schema.columns where table_name = ? and table_catalog = current_database()";
        const bindings = [table];
        return this._buildColumnInfoQuery(schema, sql, bindings, column);
      }
      _buildColumnInfoQuery(schema, sql, bindings, column) {
        if (schema) {
          sql += " and table_schema = ?";
          bindings.push(schema);
        } else {
          sql += " and table_schema = current_schema()";
        }
        return {
          sql,
          bindings,
          output(resp) {
            const out = reduce(
              resp.rows,
              function(columns, val) {
                columns[val.column_name] = {
                  type: val.data_type,
                  maxLength: val.character_maximum_length,
                  nullable: val.is_nullable === "YES",
                  defaultValue: val.column_default
                };
                return columns;
              },
              {}
            );
            return column && out[column] || out;
          }
        };
      }
      distinctOn(value) {
        return "distinct on (" + this.formatter.columnize(value) + ") ";
      }
      // Json functions
      jsonExtract(params) {
        return this._jsonExtract("jsonb_path_query", params);
      }
      jsonSet(params) {
        return this._jsonSet(
          "jsonb_set",
          Object.assign({}, params, {
            path: this.client.toPathForJson(params.path)
          })
        );
      }
      jsonInsert(params) {
        return this._jsonSet(
          "jsonb_insert",
          Object.assign({}, params, {
            path: this.client.toPathForJson(params.path)
          })
        );
      }
      jsonRemove(params) {
        const jsonCol = `${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )} #- ${this.client.parameter(
          this.client.toPathForJson(params.path),
          this.builder,
          this.bindingsHolder
        )}`;
        return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
      }
      whereJsonPath(statement) {
        let castValue = "";
        if (!isNaN(statement.value) && parseInt(statement.value)) {
          castValue = "::int";
        } else if (!isNaN(statement.value) && parseFloat(statement.value)) {
          castValue = "::float";
        } else {
          castValue = " #>> '{}'";
        }
        return `jsonb_path_query_first(${this._columnClause(
          statement
        )}, ${this.client.parameter(
          statement.jsonPath,
          this.builder,
          this.bindingsHolder
        )})${castValue} ${operator_(
          statement.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        )} ${this._jsonValueClause(statement)}`;
      }
      whereJsonSupersetOf(statement) {
        return this._not(
          statement,
          `${wrap_(
            statement.column,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          )} @> ${this._jsonValueClause(statement)}`
        );
      }
      whereJsonSubsetOf(statement) {
        return this._not(
          statement,
          `${columnize_(
            statement.column,
            this.builder,
            this.client,
            this.bindingsHolder
          )} <@ ${this._jsonValueClause(statement)}`
        );
      }
      onJsonPathEquals(clause) {
        return this._onJsonPathEquals("jsonb_path_query_first", clause);
      }
    };
    module2.exports = QueryCompiler_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/query/pg-querybuilder.js
var require_pg_querybuilder = __commonJS({
  "node_modules/knex/lib/dialects/postgres/query/pg-querybuilder.js"(exports2, module2) {
    "use strict";
    var QueryBuilder = require_querybuilder();
    module2.exports = class QueryBuilder_PostgreSQL extends QueryBuilder {
      updateFrom(name) {
        this._single.updateFrom = name;
        return this;
      }
      using(tables) {
        this._single.using = tables;
        return this;
      }
      withMaterialized(alias, statementOrColumnList, nothingOrStatement) {
        this._validateWithArgs(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          "with"
        );
        return this.withWrapped(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          true
        );
      }
      withNotMaterialized(alias, statementOrColumnList, nothingOrStatement) {
        this._validateWithArgs(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          "with"
        );
        return this.withWrapped(
          alias,
          statementOrColumnList,
          nothingOrStatement,
          false
        );
      }
    };
  }
});

// node_modules/knex/lib/dialects/postgres/schema/pg-columncompiler.js
var require_pg_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/postgres/schema/pg-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler = require_columncompiler();
    var { isObject } = require_is();
    var { toNumber } = require_helpers();
    var commentEscapeRegex = /(?<!')'(?!')/g;
    var ColumnCompiler_PG = class extends ColumnCompiler {
      constructor(client, tableCompiler, columnBuilder) {
        super(client, tableCompiler, columnBuilder);
        this.modifiers = ["nullable", "defaultTo", "comment"];
        this._addCheckModifiers();
      }
      // Types
      // ------
      bit(column) {
        return column.length !== false ? `bit(${column.length})` : "bit";
      }
      // Create the column definition for an enum type.
      // Using method "2" here: http://stackoverflow.com/a/10984951/525714
      enu(allowed, options) {
        options = options || {};
        const values = options.useNative && options.existingType ? void 0 : allowed.join("', '");
        if (options.useNative) {
          let enumName = "";
          const schemaName = options.schemaName || this.tableCompiler.schemaNameRaw;
          if (schemaName) {
            enumName += `"${schemaName}".`;
          }
          enumName += `"${options.enumName}"`;
          if (!options.existingType) {
            this.tableCompiler.unshiftQuery(
              `create type ${enumName} as enum ('${values}')`
            );
          }
          return enumName;
        }
        return `text check (${this.formatter.wrap(this.args[0])} in ('${values}'))`;
      }
      decimal(precision, scale) {
        if (precision === null) return "decimal";
        return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
      }
      json(jsonb) {
        if (jsonb) this.client.logger.deprecate("json(true)", "jsonb()");
        return jsonColumn(this.client, jsonb);
      }
      jsonb() {
        return jsonColumn(this.client, true);
      }
      checkRegex(regex, constraintName) {
        return this._check(
          `${this.formatter.wrap(
            this.getColumnName()
          )} ~ ${this.client._escapeBinding(regex)}`,
          constraintName
        );
      }
      datetime(withoutTz = false, precision) {
        let useTz;
        if (isObject(withoutTz)) {
          ({ useTz, precision } = withoutTz);
        } else {
          useTz = !withoutTz;
        }
        useTz = typeof useTz === "boolean" ? useTz : true;
        precision = precision !== void 0 && precision !== null ? "(" + precision + ")" : "";
        return `${useTz ? "timestamptz" : "timestamp"}${precision}`;
      }
      timestamp(withoutTz = false, precision) {
        return this.datetime(withoutTz, precision);
      }
      // Modifiers:
      // ------
      comment(comment) {
        const columnName = this.args[0] || this.defaults("columnName");
        const escapedComment = comment ? `'${comment.replace(commentEscapeRegex, "''")}'` : "NULL";
        this.pushAdditional(function() {
          this.pushQuery(
            `comment on column ${this.tableCompiler.tableName()}.` + this.formatter.wrap(columnName) + ` is ${escapedComment}`
          );
        }, comment);
      }
      increments(options = { primaryKey: true }) {
        return "serial" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
      bigincrements(options = { primaryKey: true }) {
        return "bigserial" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
      uuid(options = { primaryKey: false }) {
        return "uuid" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
    };
    ColumnCompiler_PG.prototype.bigint = "bigint";
    ColumnCompiler_PG.prototype.binary = "bytea";
    ColumnCompiler_PG.prototype.bool = "boolean";
    ColumnCompiler_PG.prototype.double = "double precision";
    ColumnCompiler_PG.prototype.floating = "real";
    ColumnCompiler_PG.prototype.smallint = "smallint";
    ColumnCompiler_PG.prototype.tinyint = "smallint";
    function jsonColumn(client, jsonb) {
      if (!client.version || client.config.client === "cockroachdb" || client.config.jsonbSupport === true || parseFloat(client.version) >= 9.2) {
        return jsonb ? "jsonb" : "json";
      }
      return "text";
    }
    module2.exports = ColumnCompiler_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/schema/pg-tablecompiler.js
var require_pg_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/postgres/schema/pg-tablecompiler.js"(exports2, module2) {
    "use strict";
    var has = require_has();
    var TableCompiler = require_tablecompiler();
    var { isObject, isString } = require_is();
    var TableCompiler_PG = class extends TableCompiler {
      constructor(client, tableBuilder) {
        super(client, tableBuilder);
      }
      // Compile a rename column command.
      renameColumn(from, to) {
        return this.pushQuery({
          sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
            from
          )} to ${this.formatter.wrap(to)}`
        });
      }
      _setNullableState(column, isNullable) {
        const constraintAction = isNullable ? "drop not null" : "set not null";
        const sql = `alter table ${this.tableName()} alter column ${this.formatter.wrap(
          column
        )} ${constraintAction}`;
        return this.pushQuery({
          sql
        });
      }
      compileAdd(builder) {
        const table = this.formatter.wrap(builder);
        const columns = this.prefixArray("add column", this.getColumns(builder));
        return this.pushQuery({
          sql: `alter table ${table} ${columns.join(", ")}`
        });
      }
      // Adds the "create" query to the query sequence.
      createQuery(columns, ifNot, like) {
        const createStatement = ifNot ? "create table if not exists " : "create table ";
        const columnsSql = ` (${columns.sql.join(", ")}${this.primaryKeys() || ""}${this._addChecks()})`;
        let sql = createStatement + this.tableName() + (like && this.tableNameLike() ? " (like " + this.tableNameLike() + " including all" + (columns.sql.length ? ", " + columns.sql.join(", ") : "") + ")" : columnsSql);
        if (this.single.inherits)
          sql += ` inherits (${this.formatter.wrap(this.single.inherits)})`;
        this.pushQuery({
          sql,
          bindings: columns.bindings
        });
        const hasComment = has(this.single, "comment");
        if (hasComment) this.comment(this.single.comment);
      }
      primaryKeys() {
        const pks = (this.grouped.alterTable || []).filter(
          (k) => k.method === "primary"
        );
        if (pks.length > 0 && pks[0].args.length > 0) {
          const columns = pks[0].args[0];
          let constraintName = pks[0].args[1] || "";
          let deferrable;
          if (isObject(constraintName)) {
            ({ constraintName, deferrable } = constraintName);
          }
          deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
          constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
          return `, constraint ${constraintName} primary key (${this.formatter.columnize(
            columns
          )})${deferrable}`;
        }
      }
      addColumns(columns, prefix, colCompilers) {
        if (prefix === this.alterColumnsPrefix) {
          for (const col of colCompilers) {
            this._addColumn(col);
          }
        } else {
          super.addColumns(columns, prefix);
        }
      }
      _addColumn(col) {
        const quotedTableName = this.tableName();
        const type = col.getColumnType();
        const colName = this.client.wrapIdentifier(
          col.getColumnName(),
          col.columnBuilder.queryContext()
        );
        const isEnum = col.type === "enu";
        this.pushQuery({
          sql: `alter table ${quotedTableName} alter column ${colName} drop default`,
          bindings: []
        });
        const alterNullable = col.columnBuilder.alterNullable;
        if (alterNullable) {
          this.pushQuery({
            sql: `alter table ${quotedTableName} alter column ${colName} drop not null`,
            bindings: []
          });
        }
        const alterType = col.columnBuilder.alterType;
        if (alterType) {
          this.pushQuery({
            sql: `alter table ${quotedTableName} alter column ${colName} type ${type} using (${colName}${isEnum ? "::text::" : "::"}${type})`,
            bindings: []
          });
        }
        const defaultTo = col.modified["defaultTo"];
        if (defaultTo) {
          const modifier = col.defaultTo.apply(col, defaultTo);
          this.pushQuery({
            sql: `alter table ${quotedTableName} alter column ${colName} set ${modifier}`,
            bindings: []
          });
        }
        if (alterNullable) {
          const nullable = col.modified["nullable"];
          if (nullable && nullable[0] === false) {
            this.pushQuery({
              sql: `alter table ${quotedTableName} alter column ${colName} set not null`,
              bindings: []
            });
          }
        }
      }
      // Compiles the comment on the table.
      comment(comment) {
        this.pushQuery(
          `comment on table ${this.tableName()} is '${this.single.comment}'`
        );
      }
      // Indexes:
      // -------
      primary(columns, constraintName) {
        let deferrable;
        if (isObject(constraintName)) {
          ({ constraintName, deferrable } = constraintName);
        }
        deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
        if (this.method !== "create" && this.method !== "createIfNot") {
          this.pushQuery(
            `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
              columns
            )})${deferrable}`
          );
        }
      }
      unique(columns, indexName) {
        let deferrable;
        let useConstraint = true;
        let predicate;
        if (isObject(indexName)) {
          ({ indexName, deferrable, useConstraint, predicate } = indexName);
          if (useConstraint === void 0) {
            useConstraint = !!deferrable || !predicate;
          }
        }
        if (!useConstraint && deferrable && deferrable !== "not deferrable") {
          throw new Error("postgres cannot create deferrable index");
        }
        if (useConstraint && predicate) {
          throw new Error("postgres cannot create constraint with predicate");
        }
        deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        if (useConstraint) {
          this.pushQuery(
            `alter table ${this.tableName()} add constraint ${indexName} unique (` + this.formatter.columnize(columns) + ")" + deferrable
          );
        } else {
          const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
          this.pushQuery(
            `create unique index ${indexName} on ${this.tableName()} (${this.formatter.columnize(
              columns
            )})${predicateQuery}`
          );
        }
      }
      index(columns, indexName, options) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        let predicate;
        let storageEngineIndexType;
        let indexType;
        if (isString(options)) {
          storageEngineIndexType = options;
        } else if (isObject(options)) {
          ({ indexType, storageEngineIndexType, predicate } = options);
        }
        const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
        this.pushQuery(
          `create${typeof indexType === "string" && indexType.toLowerCase() === "unique" ? " unique" : ""} index ${indexName} on ${this.tableName()}${storageEngineIndexType && ` using ${storageEngineIndexType}` || ""} (` + this.formatter.columnize(columns) + `)${predicateQuery}`
        );
      }
      dropPrimary(constraintName) {
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(this.tableNameRaw + "_pkey");
        this.pushQuery(
          `alter table ${this.tableName()} drop constraint ${constraintName}`
        );
      }
      dropIndex(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        indexName = this.schemaNameRaw ? `${this.formatter.wrap(this.schemaNameRaw)}.${indexName}` : indexName;
        this.pushQuery(`drop index ${indexName}`);
      }
      dropUnique(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        this.pushQuery(
          `alter table ${this.tableName()} drop constraint ${indexName}`
        );
      }
      dropForeign(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
        this.pushQuery(
          `alter table ${this.tableName()} drop constraint ${indexName}`
        );
      }
    };
    module2.exports = TableCompiler_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/schema/pg-viewcompiler.js
var require_pg_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/postgres/schema/pg-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler = require_viewcompiler();
    var ViewCompiler_PG = class extends ViewCompiler {
      constructor(client, viewCompiler) {
        super(client, viewCompiler);
      }
      renameColumn(from, to) {
        return this.pushQuery({
          sql: `alter view ${this.viewName()} rename ${this.formatter.wrap(
            from
          )} to ${this.formatter.wrap(to)}`
        });
      }
      defaultTo(column, defaultValue) {
        return this.pushQuery({
          sql: `alter view ${this.viewName()} alter ${this.formatter.wrap(
            column
          )} set default ${defaultValue}`
        });
      }
      createOrReplace() {
        this.createQuery(this.columns, this.selectQuery, false, true);
      }
      createMaterializedView() {
        this.createQuery(this.columns, this.selectQuery, true);
      }
    };
    module2.exports = ViewCompiler_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/schema/pg-viewbuilder.js
var require_pg_viewbuilder = __commonJS({
  "node_modules/knex/lib/dialects/postgres/schema/pg-viewbuilder.js"(exports2, module2) {
    "use strict";
    var ViewBuilder = require_viewbuilder();
    var ViewBuilder_PG = class extends ViewBuilder {
      constructor() {
        super(...arguments);
      }
      checkOption() {
        this._single.checkOption = "default_option";
      }
      localCheckOption() {
        this._single.checkOption = "local";
      }
      cascadedCheckOption() {
        this._single.checkOption = "cascaded";
      }
    };
    module2.exports = ViewBuilder_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/schema/pg-compiler.js
var require_pg_compiler = __commonJS({
  "node_modules/knex/lib/dialects/postgres/schema/pg-compiler.js"(exports2, module2) {
    "use strict";
    var SchemaCompiler = require_compiler();
    var SchemaCompiler_PG = class extends SchemaCompiler {
      constructor(client, builder) {
        super(client, builder);
      }
      // Check whether the current table
      hasTable(tableName) {
        let sql = "select * from information_schema.tables where table_name = ?";
        const bindings = [tableName];
        if (this.schema) {
          sql += " and table_schema = ?";
          bindings.push(this.schema);
        } else {
          sql += " and table_schema = current_schema()";
        }
        this.pushQuery({
          sql,
          bindings,
          output(resp) {
            return resp.rows.length > 0;
          }
        });
      }
      // Compile the query to determine if a column exists in a table.
      hasColumn(tableName, columnName) {
        let sql = "select * from information_schema.columns where table_name = ? and column_name = ?";
        const bindings = [tableName, columnName];
        if (this.schema) {
          sql += " and table_schema = ?";
          bindings.push(this.schema);
        } else {
          sql += " and table_schema = current_schema()";
        }
        this.pushQuery({
          sql,
          bindings,
          output(resp) {
            return resp.rows.length > 0;
          }
        });
      }
      qualifiedTableName(tableName) {
        const name = this.schema ? `${this.schema}.${tableName}` : tableName;
        return this.formatter.wrap(name);
      }
      // Compile a rename table command.
      renameTable(from, to) {
        this.pushQuery(
          `alter table ${this.qualifiedTableName(
            from
          )} rename to ${this.formatter.wrap(to)}`
        );
      }
      createSchema(schemaName) {
        this.pushQuery(`create schema ${this.formatter.wrap(schemaName)}`);
      }
      createSchemaIfNotExists(schemaName) {
        this.pushQuery(
          `create schema if not exists ${this.formatter.wrap(schemaName)}`
        );
      }
      dropSchema(schemaName, cascade = false) {
        this.pushQuery(
          `drop schema ${this.formatter.wrap(schemaName)}${cascade ? " cascade" : ""}`
        );
      }
      dropSchemaIfExists(schemaName, cascade = false) {
        this.pushQuery(
          `drop schema if exists ${this.formatter.wrap(schemaName)}${cascade ? " cascade" : ""}`
        );
      }
      dropExtension(extensionName) {
        this.pushQuery(`drop extension ${this.formatter.wrap(extensionName)}`);
      }
      dropExtensionIfExists(extensionName) {
        this.pushQuery(
          `drop extension if exists ${this.formatter.wrap(extensionName)}`
        );
      }
      createExtension(extensionName) {
        this.pushQuery(`create extension ${this.formatter.wrap(extensionName)}`);
      }
      createExtensionIfNotExists(extensionName) {
        this.pushQuery(
          `create extension if not exists ${this.formatter.wrap(extensionName)}`
        );
      }
      renameView(from, to) {
        this.pushQuery(
          this.alterViewPrefix + `${this.formatter.wrap(from)} rename to ${this.formatter.wrap(to)}`
        );
      }
      refreshMaterializedView(viewName, concurrently = false) {
        this.pushQuery({
          sql: `refresh materialized view${concurrently ? " concurrently" : ""} ${this.formatter.wrap(viewName)}`
        });
      }
      dropMaterializedView(viewName) {
        this._dropView(viewName, false, true);
      }
      dropMaterializedViewIfExists(viewName) {
        this._dropView(viewName, true, true);
      }
    };
    module2.exports = SchemaCompiler_PG;
  }
});

// node_modules/knex/lib/dialects/postgres/index.js
var require_postgres = __commonJS({
  "node_modules/knex/lib/dialects/postgres/index.js"(exports2, module2) {
    "use strict";
    var extend = require_extend();
    var map = require_map();
    var { promisify } = require("util");
    var Client = require_client();
    var Transaction = require_pg_transaction();
    var QueryCompiler = require_pg_querycompiler();
    var QueryBuilder = require_pg_querybuilder();
    var ColumnCompiler = require_pg_columncompiler();
    var TableCompiler = require_pg_tablecompiler();
    var ViewCompiler = require_pg_viewcompiler();
    var ViewBuilder = require_pg_viewbuilder();
    var SchemaCompiler = require_pg_compiler();
    var { makeEscape } = require_string();
    var { isString } = require_is();
    var Client_PG = class extends Client {
      constructor(config3) {
        super(config3);
        if (config3.returning) {
          this.defaultReturning = config3.returning;
        }
        if (config3.searchPath) {
          this.searchPath = config3.searchPath;
        }
      }
      transaction() {
        return new Transaction(this, ...arguments);
      }
      queryBuilder() {
        return new QueryBuilder(this);
      }
      queryCompiler(builder, formatter) {
        return new QueryCompiler(this, builder, formatter);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      viewCompiler() {
        return new ViewCompiler(this, ...arguments);
      }
      viewBuilder() {
        return new ViewBuilder(this, ...arguments);
      }
      _driver() {
        return require("pg");
      }
      wrapIdentifierImpl(value) {
        if (value === "*") return value;
        let arrayAccessor = "";
        const arrayAccessorMatch = value.match(/(.*?)(\[[0-9]+\])/);
        if (arrayAccessorMatch) {
          value = arrayAccessorMatch[1];
          arrayAccessor = arrayAccessorMatch[2];
        }
        return `"${value.replace(/"/g, '""')}"${arrayAccessor}`;
      }
      _acquireOnlyConnection() {
        const connection = new this.driver.Client(this.connectionSettings);
        connection.on("error", (err) => {
          connection.__knex__disposed = err;
        });
        connection.on("end", (err) => {
          connection.__knex__disposed = err || "Connection ended unexpectedly";
        });
        return connection.connect().then(() => connection);
      }
      // Get a raw connection, called by the `pool` whenever a new
      // connection needs to be added to the pool.
      acquireRawConnection() {
        const client = this;
        return this._acquireOnlyConnection().then(function(connection) {
          if (!client.version) {
            return client.checkVersion(connection).then(function(version) {
              client.version = version;
              return connection;
            });
          }
          return connection;
        }).then(async function setSearchPath(connection) {
          await client.setSchemaSearchPath(connection);
          return connection;
        });
      }
      // Used to explicitly close a connection, called internally by the pool
      // when a connection times out or the pool is shutdown.
      async destroyRawConnection(connection) {
        const end = promisify((cb) => connection.end(cb));
        return end();
      }
      // In PostgreSQL, we need to do a version check to do some feature
      // checking on the database.
      checkVersion(connection) {
        return new Promise((resolve, reject) => {
          connection.query("select version();", (err, resp) => {
            if (err) return reject(err);
            resolve(this._parseVersion(resp.rows[0].version));
          });
        });
      }
      _parseVersion(versionString) {
        return /^PostgreSQL (.*?)( |$)/.exec(versionString)[1];
      }
      // Position the bindings for the query. The escape sequence for question mark
      // is \? (e.g. knex.raw("\\?") since javascript requires '\' to be escaped too...)
      positionBindings(sql) {
        let questionCount = 0;
        return sql.replace(/(\\*)(\?)/g, function(match, escapes) {
          if (escapes.length % 2) {
            return "?";
          } else {
            questionCount++;
            return `$${questionCount}`;
          }
        });
      }
      setSchemaSearchPath(connection, searchPath) {
        let path = searchPath || this.searchPath;
        if (!path) return Promise.resolve(true);
        if (!Array.isArray(path) && !isString(path)) {
          throw new TypeError(
            `knex: Expected searchPath to be Array/String, got: ${typeof path}`
          );
        }
        if (isString(path)) {
          if (path.includes(",")) {
            const parts = path.split(",");
            const arraySyntax = `[${parts.map((searchPath2) => `'${searchPath2}'`).join(", ")}]`;
            this.logger.warn(
              `Detected comma in searchPath "${path}".If you are trying to specify multiple schemas, use Array syntax: ${arraySyntax}`
            );
          }
          path = [path];
        }
        path = path.map((schemaName) => `"${schemaName}"`).join(",");
        return new Promise(function(resolver, rejecter) {
          connection.query(`set search_path to ${path}`, function(err) {
            if (err) return rejecter(err);
            resolver(true);
          });
        });
      }
      _stream(connection, obj, stream, options) {
        if (!obj.sql) throw new Error("The query is empty");
        const PGQueryStream = process.browser ? void 0 : require("pg-query-stream");
        const sql = obj.sql;
        return new Promise(function(resolver, rejecter) {
          const queryStream = connection.query(
            new PGQueryStream(sql, obj.bindings, options),
            (err) => {
              rejecter(err);
            }
          );
          queryStream.on("error", function(error) {
            rejecter(error);
            stream.emit("error", error);
          });
          stream.on("end", resolver);
          queryStream.pipe(stream);
        });
      }
      // Runs the query on the specified connection, providing the bindings
      // and any other necessary prep work.
      _query(connection, obj) {
        if (!obj.sql) throw new Error("The query is empty");
        let queryConfig = {
          text: obj.sql,
          values: obj.bindings || []
        };
        if (obj.options) {
          queryConfig = extend(queryConfig, obj.options);
        }
        return new Promise(function(resolver, rejecter) {
          connection.query(queryConfig, function(err, response) {
            if (err) return rejecter(err);
            obj.response = response;
            resolver(obj);
          });
        });
      }
      // Ensures the response is returned in the same format as other clients.
      processResponse(obj, runner) {
        const resp = obj.response;
        if (obj.output) return obj.output.call(runner, resp);
        if (obj.method === "raw") return resp;
        const { returning } = obj;
        if (resp.command === "SELECT") {
          if (obj.method === "first") return resp.rows[0];
          if (obj.method === "pluck") return map(resp.rows, obj.pluck);
          return resp.rows;
        }
        if (returning) {
          const returns = [];
          for (let i = 0, l = resp.rows.length; i < l; i++) {
            const row = resp.rows[i];
            returns[i] = row;
          }
          return returns;
        }
        if (resp.command === "UPDATE" || resp.command === "DELETE") {
          return resp.rowCount;
        }
        return resp;
      }
      async cancelQuery(connectionToKill) {
        const conn = await this.acquireRawConnection();
        try {
          return await this._wrappedCancelQueryCall(conn, connectionToKill);
        } finally {
          await this.destroyRawConnection(conn).catch((err) => {
            this.logger.warn(`Connection Error: ${err}`);
          });
        }
      }
      _wrappedCancelQueryCall(conn, connectionToKill) {
        return this._query(conn, {
          sql: "SELECT pg_cancel_backend($1);",
          bindings: [connectionToKill.processID],
          options: {}
        });
      }
      toPathForJson(jsonPath) {
        const PG_PATH_REGEX = /^{.*}$/;
        if (jsonPath.match(PG_PATH_REGEX)) {
          return jsonPath;
        }
        return "{" + jsonPath.replace(/^(\$\.)/, "").replace(".", ",").replace(/\[([0-9]+)]/, ",$1") + // transform [number] to ,number
        "}";
      }
    };
    Object.assign(Client_PG.prototype, {
      dialect: "postgresql",
      driverName: "pg",
      canCancelQuery: true,
      _escapeBinding: makeEscape({
        escapeArray(val, esc) {
          return esc(arrayString(val, esc));
        },
        escapeString(str) {
          let hasBackslash = false;
          let escaped = "'";
          for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (c === "'") {
              escaped += c + c;
            } else if (c === "\\") {
              escaped += c + c;
              hasBackslash = true;
            } else {
              escaped += c;
            }
          }
          escaped += "'";
          if (hasBackslash === true) {
            escaped = "E" + escaped;
          }
          return escaped;
        },
        escapeObject(val, prepareValue, timezone, seen = []) {
          if (val && typeof val.toPostgres === "function") {
            seen = seen || [];
            if (seen.indexOf(val) !== -1) {
              throw new Error(
                `circular reference detected while preparing "${val}" for query`
              );
            }
            seen.push(val);
            return prepareValue(val.toPostgres(prepareValue), seen);
          }
          return JSON.stringify(val);
        }
      })
    });
    function arrayString(arr, esc) {
      let result = "{";
      for (let i = 0; i < arr.length; i++) {
        if (i > 0) result += ",";
        const val = arr[i];
        if (val === null || typeof val === "undefined") {
          result += "NULL";
        } else if (Array.isArray(val)) {
          result += arrayString(val, esc);
        } else if (typeof val === "number") {
          result += val;
        } else {
          result += JSON.stringify(typeof val === "string" ? val : esc(val));
        }
      }
      return result + "}";
    }
    module2.exports = Client_PG;
  }
});

// node_modules/knex/lib/dialects/cockroachdb/crdb-querycompiler.js
var require_crdb_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/cockroachdb/crdb-querycompiler.js"(exports2, module2) {
    "use strict";
    var QueryCompiler_PG = require_pg_querycompiler();
    var {
      columnize: columnize_,
      wrap: wrap_,
      operator: operator_
    } = require_wrappingFormatter();
    var QueryCompiler_CRDB = class extends QueryCompiler_PG {
      truncate() {
        return `truncate ${this.tableName}`;
      }
      upsert() {
        let sql = this._upsert();
        if (sql === "") return sql;
        const { returning } = this.single;
        if (returning) sql += this._returning(returning);
        return {
          sql,
          returning
        };
      }
      _upsert() {
        const upsertValues = this.single.upsert || [];
        const sql = this.with() + `upsert into ${this.tableName} `;
        const body = this._insertBody(upsertValues);
        return body === "" ? "" : sql + body;
      }
      _groupOrder(item, type) {
        return this._basicGroupOrder(item, type);
      }
      whereJsonPath(statement) {
        let castValue = "";
        if (!isNaN(statement.value) && parseInt(statement.value)) {
          castValue = "::int";
        } else if (!isNaN(statement.value) && parseFloat(statement.value)) {
          castValue = "::float";
        } else {
          castValue = " #>> '{}'";
        }
        return `json_extract_path(${this._columnClause(
          statement
        )}, ${this.client.toArrayPathFromJsonPath(
          statement.jsonPath,
          this.builder,
          this.bindingsHolder
        )})${castValue} ${operator_(
          statement.operator,
          this.builder,
          this.client,
          this.bindingsHolder
        )} ${this._jsonValueClause(statement)}`;
      }
      // Json common functions
      _jsonExtract(nameFunction, params) {
        let extractions;
        if (Array.isArray(params.column)) {
          extractions = params.column;
        } else {
          extractions = [params];
        }
        return extractions.map((extraction) => {
          const jsonCol = `json_extract_path(${columnize_(
            extraction.column || extraction[0],
            this.builder,
            this.client,
            this.bindingsHolder
          )}, ${this.client.toArrayPathFromJsonPath(
            extraction.path || extraction[1],
            this.builder,
            this.bindingsHolder
          )})`;
          const alias = extraction.alias || extraction[2];
          return alias ? this.client.alias(jsonCol, this.formatter.wrap(alias)) : jsonCol;
        }).join(", ");
      }
      _onJsonPathEquals(nameJoinFunction, clause) {
        return "json_extract_path(" + wrap_(
          clause.columnFirst,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ", " + this.client.toArrayPathFromJsonPath(
          clause.jsonPathFirst,
          this.builder,
          this.bindingsHolder
        ) + ") = json_extract_path(" + wrap_(
          clause.columnSecond,
          void 0,
          this.builder,
          this.client,
          this.bindingsHolder
        ) + ", " + this.client.toArrayPathFromJsonPath(
          clause.jsonPathSecond,
          this.builder,
          this.bindingsHolder
        ) + ")";
      }
    };
    module2.exports = QueryCompiler_CRDB;
  }
});

// node_modules/knex/lib/dialects/cockroachdb/crdb-columncompiler.js
var require_crdb_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/cockroachdb/crdb-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler_PG = require_pg_columncompiler();
    var ColumnCompiler_CRDB = class extends ColumnCompiler_PG {
      uuid(options = { primaryKey: false }) {
        return "uuid" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key default gen_random_uuid()" : "");
      }
    };
    module2.exports = ColumnCompiler_CRDB;
  }
});

// node_modules/knex/lib/dialects/cockroachdb/crdb-tablecompiler.js
var require_crdb_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/cockroachdb/crdb-tablecompiler.js"(exports2, module2) {
    "use strict";
    var TableCompiler = require_pg_tablecompiler();
    var TableCompiler_CRDB = class extends TableCompiler {
      constructor(client, tableBuilder) {
        super(client, tableBuilder);
      }
      addColumns(columns, prefix, colCompilers) {
        if (prefix === this.alterColumnsPrefix) {
          for (const col of colCompilers) {
            this.client.logger.warn(
              "Experimental alter column in use, see issue: https://github.com/cockroachdb/cockroach/issues/49329"
            );
            this.pushQuery({
              sql: "SET enable_experimental_alter_column_type_general = true",
              bindings: []
            });
            super._addColumn(col);
          }
        } else {
          super.addColumns(columns, prefix);
        }
      }
      dropUnique(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        this.pushQuery(`drop index ${this.tableName()}@${indexName} cascade `);
      }
    };
    module2.exports = TableCompiler_CRDB;
  }
});

// node_modules/knex/lib/dialects/cockroachdb/crdb-viewcompiler.js
var require_crdb_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/cockroachdb/crdb-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler_PG = require_pg_viewcompiler();
    var ViewCompiler_CRDB = class extends ViewCompiler_PG {
      renameColumn(from, to) {
        throw new Error("rename column of views is not supported by this dialect.");
      }
      defaultTo(column, defaultValue) {
        throw new Error(
          "change default values of views is not supported by this dialect."
        );
      }
    };
    module2.exports = ViewCompiler_CRDB;
  }
});

// node_modules/knex/lib/dialects/cockroachdb/crdb-querybuilder.js
var require_crdb_querybuilder = __commonJS({
  "node_modules/knex/lib/dialects/cockroachdb/crdb-querybuilder.js"(exports2, module2) {
    "use strict";
    var QueryBuilder = require_querybuilder();
    var isEmpty = require_isEmpty();
    module2.exports = class QueryBuilder_CockroachDB extends QueryBuilder {
      upsert(values, returning, options) {
        this._method = "upsert";
        if (!isEmpty(returning)) this.returning(returning, options);
        this._single.upsert = values;
        return this;
      }
    };
  }
});

// node_modules/knex/lib/dialects/cockroachdb/index.js
var require_cockroachdb = __commonJS({
  "node_modules/knex/lib/dialects/cockroachdb/index.js"(exports2, module2) {
    "use strict";
    var Client_PostgreSQL = require_postgres();
    var Transaction = require_pg_transaction();
    var QueryCompiler = require_crdb_querycompiler();
    var ColumnCompiler = require_crdb_columncompiler();
    var TableCompiler = require_crdb_tablecompiler();
    var ViewCompiler = require_crdb_viewcompiler();
    var QueryBuilder = require_crdb_querybuilder();
    var Client_CockroachDB = class extends Client_PostgreSQL {
      transaction() {
        return new Transaction(this, ...arguments);
      }
      queryCompiler(builder, formatter) {
        return new QueryCompiler(this, builder, formatter);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      viewCompiler() {
        return new ViewCompiler(this, ...arguments);
      }
      queryBuilder() {
        return new QueryBuilder(this);
      }
      _parseVersion(versionString) {
        return versionString.split(" ")[2];
      }
      async cancelQuery(connectionToKill) {
        try {
          return await this._wrappedCancelQueryCall(null, connectionToKill);
        } catch (err) {
          this.logger.warn(`Connection Error: ${err}`);
          throw err;
        }
      }
      _wrappedCancelQueryCall(emptyConnection, connectionToKill) {
        if (connectionToKill.activeQuery.processID === 0 && connectionToKill.activeQuery.secretKey === 0) {
          return;
        }
        return connectionToKill.cancel(
          connectionToKill,
          connectionToKill.activeQuery
        );
      }
      toArrayPathFromJsonPath(jsonPath, builder, bindingsHolder) {
        return jsonPath.replace(/^(\$\.)/, "").replace(/\[([0-9]+)]/, ".$1").split(".").map(
          function(v) {
            return this.parameter(v, builder, bindingsHolder);
          }.bind(this)
        ).join(", ");
      }
    };
    Object.assign(Client_CockroachDB.prototype, {
      // The "dialect", for reference elsewhere.
      driverName: "cockroachdb"
    });
    module2.exports = Client_CockroachDB;
  }
});

// node_modules/lodash/isNil.js
var require_isNil = __commonJS({
  "node_modules/lodash/isNil.js"(exports2, module2) {
    "use strict";
    function isNil(value) {
      return value == null;
    }
    module2.exports = isNil;
  }
});

// node_modules/knex/lib/dialects/mssql/mssql-formatter.js
var require_mssql_formatter = __commonJS({
  "node_modules/knex/lib/dialects/mssql/mssql-formatter.js"(exports2, module2) {
    "use strict";
    var Formatter = require_formatter();
    var MSSQL_Formatter = class extends Formatter {
      // Accepts a string or array of columns to wrap as appropriate.
      columnizeWithPrefix(prefix, target) {
        const columns = typeof target === "string" ? [target] : target;
        let str = "", i = -1;
        while (++i < columns.length) {
          if (i > 0) str += ", ";
          str += prefix + this.wrap(columns[i]);
        }
        return str;
      }
      /**
       * Returns its argument with single quotes escaped, so it can be included into a single-quoted string.
       *
       * For example, it converts "has'quote" to "has''quote".
       *
       * This assumes QUOTED_IDENTIFIER ON so it is only ' that need escaping,
       * never ", because " cannot be used to quote a string when that's on;
       * otherwise we'd need to be aware of whether the string is quoted with " or '.
       *
       * This assumption is consistent with the SQL Knex generates.
       * @param {string} string
       * @returns {string}
       */
      escapingStringDelimiters(string) {
        return (string || "").replace(/'/g, "''");
      }
    };
    module2.exports = MSSQL_Formatter;
  }
});

// node_modules/knex/lib/dialects/mssql/transaction.js
var require_transaction2 = __commonJS({
  "node_modules/knex/lib/dialects/mssql/transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    var debug = require_src()("knex:tx");
    var Transaction_MSSQL = class extends Transaction {
      begin(conn) {
        debug("transaction::begin id=%s", this.txid);
        return new Promise((resolve, reject) => {
          conn.beginTransaction(
            (err) => {
              if (err) {
                debug(
                  "transaction::begin error id=%s message=%s",
                  this.txid,
                  err.message
                );
                return reject(err);
              }
              resolve();
            },
            this.outerTx ? this.txid : void 0,
            nameToIsolationLevelEnum(this.isolationLevel)
          );
        }).then(this._resolver, this._rejecter);
      }
      savepoint(conn) {
        debug("transaction::savepoint id=%s", this.txid);
        return new Promise((resolve, reject) => {
          conn.saveTransaction(
            (err) => {
              if (err) {
                debug(
                  "transaction::savepoint id=%s message=%s",
                  this.txid,
                  err.message
                );
                return reject(err);
              }
              this.trxClient.emit("query", {
                __knexUid: this.trxClient.__knexUid,
                __knexTxId: this.trxClient.__knexTxId,
                autogenerated: true,
                sql: this.outerTx ? `SAVE TRANSACTION [${this.txid}]` : `SAVE TRANSACTION`
              });
              resolve();
            },
            this.outerTx ? this.txid : void 0
          );
        });
      }
      commit(conn, value) {
        debug("transaction::commit id=%s", this.txid);
        return new Promise((resolve, reject) => {
          conn.commitTransaction(
            (err) => {
              if (err) {
                debug(
                  "transaction::commit error id=%s message=%s",
                  this.txid,
                  err.message
                );
                return reject(err);
              }
              this._completed = true;
              resolve(value);
            },
            this.outerTx ? this.txid : void 0
          );
        }).then(() => this._resolver(value), this._rejecter);
      }
      release(conn, value) {
        return this._resolver(value);
      }
      rollback(conn, error) {
        this._completed = true;
        debug("transaction::rollback id=%s", this.txid);
        return new Promise((_resolve, reject) => {
          if (!conn.inTransaction) {
            return reject(
              error || new Error("Transaction rejected with non-error: undefined")
            );
          }
          if (conn.state.name !== "LoggedIn") {
            return reject(
              new Error(
                "Can't rollback transaction. There is a request in progress"
              )
            );
          }
          conn.rollbackTransaction(
            (err) => {
              if (err) {
                debug(
                  "transaction::rollback error id=%s message=%s",
                  this.txid,
                  err.message
                );
              }
              reject(
                err || error || new Error("Transaction rejected with non-error: undefined")
              );
            },
            this.outerTx ? this.txid : void 0
          );
        }).catch((err) => {
          if (!error && this.doNotRejectOnRollback) {
            this._resolver();
            return;
          }
          if (error) {
            try {
              err.originalError = error;
            } catch (_err) {
            }
          }
          this._rejecter(err);
        });
      }
      rollbackTo(conn, error) {
        return this.rollback(conn, error).then(
          () => void this.trxClient.emit("query", {
            __knexUid: this.trxClient.__knexUid,
            __knexTxId: this.trxClient.__knexTxId,
            autogenerated: true,
            sql: `ROLLBACK TRANSACTION`
          })
        );
      }
    };
    module2.exports = Transaction_MSSQL;
    function nameToIsolationLevelEnum(level) {
      if (!level) return;
      level = level.toUpperCase().replace(" ", "_");
      const knownEnum = isolationEnum[level];
      if (!knownEnum) {
        throw new Error(
          `Unknown Isolation level, was expecting one of: ${JSON.stringify(
            humanReadableKeys
          )}`
        );
      }
      return knownEnum;
    }
    var isolationEnum = {
      READ_UNCOMMITTED: 1,
      READ_COMMITTED: 2,
      REPEATABLE_READ: 3,
      SERIALIZABLE: 4,
      SNAPSHOT: 5
    };
    var humanReadableKeys = Object.keys(isolationEnum).map(
      (key) => key.toLowerCase().replace("_", " ")
    );
  }
});

// node_modules/knex/lib/dialects/mssql/query/mssql-querycompiler.js
var require_mssql_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/mssql/query/mssql-querycompiler.js"(exports2, module2) {
    "use strict";
    var QueryCompiler = require_querycompiler();
    var compact = require_compact();
    var identity = require_identity();
    var isEmpty = require_isEmpty();
    var Raw = require_raw();
    var {
      columnize: columnize_
    } = require_wrappingFormatter();
    var components = [
      "comments",
      "columns",
      "join",
      "lock",
      "where",
      "union",
      "group",
      "having",
      "order",
      "limit",
      "offset"
    ];
    var QueryCompiler_MSSQL = class extends QueryCompiler {
      constructor(client, builder, formatter) {
        super(client, builder, formatter);
        const { onConflict } = this.single;
        if (onConflict) {
          throw new Error(".onConflict() is not supported for mssql.");
        }
        this._emptyInsertValue = "default values";
      }
      with() {
        const undoList = [];
        if (this.grouped.with) {
          for (const stmt of this.grouped.with) {
            if (stmt.recursive) {
              undoList.push(stmt);
              stmt.recursive = false;
            }
          }
        }
        const result = super.with();
        for (const stmt of undoList) {
          stmt.recursive = true;
        }
        return result;
      }
      select() {
        const sql = this.with();
        const statements = components.map((component) => this[component](this));
        return sql + compact(statements).join(" ");
      }
      //#region Insert
      // Compiles an "insert" query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        if (this.single.options && this.single.options.includeTriggerModifications) {
          return this.insertWithTriggers();
        } else {
          return this.standardInsert();
        }
      }
      insertWithTriggers() {
        const insertValues = this.single.insert || [];
        const { returning } = this.single;
        let sql = this.with() + `${this._buildTempTable(returning)}insert into ${this.tableName} `;
        const returningSql = returning ? this._returning("insert", returning, true) + " " : "";
        if (Array.isArray(insertValues)) {
          if (insertValues.length === 0) {
            return "";
          }
        } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
          return {
            sql: sql + returningSql + this._emptyInsertValue + this._buildReturningSelect(returning),
            returning
          };
        }
        sql += this._buildInsertData(insertValues, returningSql);
        if (returning) {
          sql += this._buildReturningSelect(returning);
        }
        return {
          sql,
          returning
        };
      }
      _buildInsertData(insertValues, returningSql) {
        let sql = "";
        const insertData = this._prepInsert(insertValues);
        if (typeof insertData === "string") {
          sql += insertData;
        } else {
          if (insertData.columns.length) {
            sql += `(${this.formatter.columnize(insertData.columns)}`;
            sql += `) ${returningSql}values (` + this._buildInsertValues(insertData) + ")";
          } else if (insertValues.length === 1 && insertValues[0]) {
            sql += returningSql + this._emptyInsertValue;
          } else {
            return "";
          }
        }
        return sql;
      }
      standardInsert() {
        const insertValues = this.single.insert || [];
        let sql = this.with() + `insert into ${this.tableName} `;
        const { returning } = this.single;
        const returningSql = returning ? this._returning("insert", returning) + " " : "";
        if (Array.isArray(insertValues)) {
          if (insertValues.length === 0) {
            return "";
          }
        } else if (typeof insertValues === "object" && isEmpty(insertValues)) {
          return {
            sql: sql + returningSql + this._emptyInsertValue,
            returning
          };
        }
        sql += this._buildInsertData(insertValues, returningSql);
        return {
          sql,
          returning
        };
      }
      //#endregion
      //#region Update
      // Compiles an `update` query, allowing for a return value.
      update() {
        if (this.single.options && this.single.options.includeTriggerModifications) {
          return this.updateWithTriggers();
        } else {
          return this.standardUpdate();
        }
      }
      updateWithTriggers() {
        const top = this.top();
        const withSQL = this.with();
        const updates = this._prepUpdate(this.single.update);
        const join = this.join();
        const where = this.where();
        const order = this.order();
        const { returning } = this.single;
        const declaredTemp = this._buildTempTable(returning);
        return {
          sql: withSQL + declaredTemp + `update ${top ? top + " " : ""}${this.tableName} set ` + updates.join(", ") + (returning ? ` ${this._returning("update", returning, true)}` : "") + (join ? ` from ${this.tableName} ${join}` : "") + (where ? ` ${where}` : "") + (order ? ` ${order}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : this._buildReturningSelect(returning)),
          returning: returning || "@@rowcount"
        };
      }
      _formatGroupsItemValue(value, nulls) {
        const column = super._formatGroupsItemValue(value);
        if (nulls && !(value instanceof Raw)) {
          const collNulls = `IIF(${column} is null,`;
          if (nulls === "first") {
            return `${collNulls}0,1)`;
          } else if (nulls === "last") {
            return `${collNulls}1,0)`;
          }
        }
        return column;
      }
      standardUpdate() {
        const top = this.top();
        const withSQL = this.with();
        const updates = this._prepUpdate(this.single.update);
        const join = this.join();
        const where = this.where();
        const order = this.order();
        const { returning } = this.single;
        return {
          sql: withSQL + `update ${top ? top + " " : ""}${this.tableName} set ` + updates.join(", ") + (returning ? ` ${this._returning("update", returning)}` : "") + (join ? ` from ${this.tableName} ${join}` : "") + (where ? ` ${where}` : "") + (order ? ` ${order}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : ""),
          returning: returning || "@@rowcount"
        };
      }
      //#endregion
      //#region Delete
      // Compiles a `delete` query.
      del() {
        if (this.single.options && this.single.options.includeTriggerModifications) {
          return this.deleteWithTriggers();
        } else {
          return this.standardDelete();
        }
      }
      deleteWithTriggers() {
        const withSQL = this.with();
        const { tableName } = this;
        const wheres = this.where();
        const joins = this.join();
        const { returning } = this.single;
        const returningStr = returning ? ` ${this._returning("del", returning, true)}` : "";
        const deleteSelector = joins ? `${tableName}${returningStr} ` : "";
        return {
          sql: withSQL + `${this._buildTempTable(
            returning
          )}delete ${deleteSelector}from ${tableName}` + (!joins ? returningStr : "") + (joins ? ` ${joins}` : "") + (wheres ? ` ${wheres}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : this._buildReturningSelect(returning)),
          returning: returning || "@@rowcount"
        };
      }
      standardDelete() {
        const withSQL = this.with();
        const { tableName } = this;
        const wheres = this.where();
        const joins = this.join();
        const { returning } = this.single;
        const returningStr = returning ? ` ${this._returning("del", returning)}` : "";
        const deleteSelector = joins ? `${tableName}${returningStr} ` : "";
        return {
          sql: withSQL + `delete ${deleteSelector}from ${tableName}` + (!joins ? returningStr : "") + (joins ? ` ${joins}` : "") + (wheres ? ` ${wheres}` : "") + (!returning ? this._returning("rowcount", "@@rowcount") : ""),
          returning: returning || "@@rowcount"
        };
      }
      //#endregion
      // Compiles the columns in the query, specifying if an item was distinct.
      columns() {
        let distinctClause = "";
        if (this.onlyUnions()) return "";
        const top = this.top();
        const hints = this._hintComments();
        const columns = this.grouped.columns || [];
        let i = -1, sql = [];
        if (columns) {
          while (++i < columns.length) {
            const stmt = columns[i];
            if (stmt.distinct) distinctClause = "distinct ";
            if (stmt.distinctOn) {
              distinctClause = this.distinctOn(stmt.value);
              continue;
            }
            if (stmt.type === "aggregate") {
              sql.push(...this.aggregate(stmt));
            } else if (stmt.type === "aggregateRaw") {
              sql.push(this.aggregateRaw(stmt));
            } else if (stmt.type === "analytic") {
              sql.push(this.analytic(stmt));
            } else if (stmt.type === "json") {
              sql.push(this.json(stmt));
            } else if (stmt.value && stmt.value.length > 0) {
              sql.push(this.formatter.columnize(stmt.value));
            }
          }
        }
        if (sql.length === 0) sql = ["*"];
        const select = this.onlyJson() ? "" : "select ";
        return `${select}${hints}${distinctClause}` + (top ? top + " " : "") + sql.join(", ") + (this.tableName ? ` from ${this.tableName}` : "");
      }
      _returning(method, value, withTrigger) {
        switch (method) {
          case "update":
          case "insert":
            return value ? `output ${this.formatter.columnizeWithPrefix("inserted.", value)}${withTrigger ? " into #out" : ""}` : "";
          case "del":
            return value ? `output ${this.formatter.columnizeWithPrefix("deleted.", value)}${withTrigger ? " into #out" : ""}` : "";
          case "rowcount":
            return value ? ";select @@rowcount" : "";
        }
      }
      _buildTempTable(values) {
        if (values && values.length > 0) {
          let selections = "";
          if (Array.isArray(values)) {
            selections = values.map((value) => `[t].${this.formatter.columnize(value)}`).join(",");
          } else {
            selections = `[t].${this.formatter.columnize(values)}`;
          }
          let sql = `select top(0) ${selections} into #out `;
          sql += `from ${this.tableName} as t `;
          sql += `left join ${this.tableName} on 0=1;`;
          return sql;
        }
        return "";
      }
      _buildReturningSelect(values) {
        if (values && values.length > 0) {
          let selections = "";
          if (Array.isArray(values)) {
            selections = values.map((value) => `${this.formatter.columnize(value)}`).join(",");
          } else {
            selections = this.formatter.columnize(values);
          }
          let sql = `; select ${selections} from #out; `;
          sql += `drop table #out;`;
          return sql;
        }
        return "";
      }
      // Compiles a `truncate` query.
      truncate() {
        return `truncate table ${this.tableName}`;
      }
      forUpdate() {
        return "with (UPDLOCK)";
      }
      forShare() {
        return "with (HOLDLOCK)";
      }
      // Compiles a `columnInfo` query.
      columnInfo() {
        const column = this.single.columnInfo;
        let schema = this.single.schema;
        const table = this.client.customWrapIdentifier(this.single.table, identity);
        if (schema) {
          schema = this.client.customWrapIdentifier(schema, identity);
        }
        let sql = `select [COLUMN_NAME], [COLUMN_DEFAULT], [DATA_TYPE], [CHARACTER_MAXIMUM_LENGTH], [IS_NULLABLE] from INFORMATION_SCHEMA.COLUMNS where table_name = ? and table_catalog = ?`;
        const bindings = [table, this.client.database()];
        if (schema) {
          sql += " and table_schema = ?";
          bindings.push(schema);
        } else {
          sql += ` and table_schema = 'dbo'`;
        }
        return {
          sql,
          bindings,
          output(resp) {
            const out = resp.reduce((columns, val) => {
              columns[val[0].value] = {
                defaultValue: val[1].value,
                type: val[2].value,
                maxLength: val[3].value,
                nullable: val[4].value === "YES"
              };
              return columns;
            }, {});
            return column && out[column] || out;
          }
        };
      }
      top() {
        const noLimit = !this.single.limit && this.single.limit !== 0;
        const noOffset = !this.single.offset;
        if (noLimit || !noOffset) return "";
        return `top (${this._getValueOrParameterFromAttribute("limit")})`;
      }
      limit() {
        return "";
      }
      offset() {
        const noLimit = !this.single.limit && this.single.limit !== 0;
        const noOffset = !this.single.offset;
        if (noOffset) return "";
        let offset = `offset ${noOffset ? "0" : this._getValueOrParameterFromAttribute("offset")} rows`;
        if (!noLimit) {
          offset += ` fetch next ${this._getValueOrParameterFromAttribute(
            "limit"
          )} rows only`;
        }
        return offset;
      }
      whereLike(statement) {
        return `${this._columnClause(
          statement
        )} collate SQL_Latin1_General_CP1_CS_AS ${this._not(
          statement,
          "like "
        )}${this._valueClause(statement)}`;
      }
      whereILike(statement) {
        return `${this._columnClause(
          statement
        )} collate SQL_Latin1_General_CP1_CI_AS ${this._not(
          statement,
          "like "
        )}${this._valueClause(statement)}`;
      }
      jsonExtract(params) {
        return this._jsonExtract(
          params.singleValue ? "JSON_VALUE" : "JSON_QUERY",
          params
        );
      }
      jsonSet(params) {
        return this._jsonSet("JSON_MODIFY", params);
      }
      jsonInsert(params) {
        return this._jsonSet("JSON_MODIFY", params);
      }
      jsonRemove(params) {
        const jsonCol = `JSON_MODIFY(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )},${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )}, NULL)`;
        return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
      }
      whereJsonPath(statement) {
        return this._whereJsonPath("JSON_VALUE", statement);
      }
      whereJsonSupersetOf(statement) {
        throw new Error(
          "Json superset where clause not actually supported by MSSQL"
        );
      }
      whereJsonSubsetOf(statement) {
        throw new Error("Json subset where clause not actually supported by MSSQL");
      }
      _getExtracts(statement, operator) {
        const column = columnize_(
          statement.column,
          this.builder,
          this.client,
          this.bindingsHolder
        );
        return (Array.isArray(statement.values) ? statement.values : [statement.values]).map(function(value) {
          return "JSON_VALUE(" + column + "," + this.client.parameter(value, this.builder, this.bindingsHolder) + ")";
        }, this).join(operator);
      }
      onJsonPathEquals(clause) {
        return this._onJsonPathEquals("JSON_VALUE", clause);
      }
    };
    module2.exports = QueryCompiler_MSSQL;
  }
});

// node_modules/knex/lib/dialects/mssql/schema/mssql-compiler.js
var require_mssql_compiler = __commonJS({
  "node_modules/knex/lib/dialects/mssql/schema/mssql-compiler.js"(exports2, module2) {
    "use strict";
    var SchemaCompiler = require_compiler();
    var SchemaCompiler_MSSQL = class extends SchemaCompiler {
      constructor(client, builder) {
        super(client, builder);
      }
      dropTableIfExists(tableName) {
        const name = this.formatter.wrap(prefixedTableName(this.schema, tableName));
        this.pushQuery(
          `if object_id('${name}', 'U') is not null DROP TABLE ${name}`
        );
      }
      dropViewIfExists(viewName) {
        const name = this.formatter.wrap(prefixedTableName(this.schema, viewName));
        this.pushQuery(
          `if object_id('${name}', 'V') is not null DROP VIEW ${name}`
        );
      }
      // Rename a table on the schema.
      renameTable(tableName, to) {
        this.pushQuery(
          `exec sp_rename ${this.client.parameter(
            prefixedTableName(this.schema, tableName),
            this.builder,
            this.bindingsHolder
          )}, ${this.client.parameter(to, this.builder, this.bindingsHolder)}`
        );
      }
      renameView(viewTable, to) {
        this.pushQuery(
          `exec sp_rename ${this.client.parameter(
            prefixedTableName(this.schema, viewTable),
            this.builder,
            this.bindingsHolder
          )}, ${this.client.parameter(to, this.builder, this.bindingsHolder)}`
        );
      }
      // Check whether a table exists on the query.
      hasTable(tableName) {
        const formattedTable = this.client.parameter(
          prefixedTableName(this.schema, tableName),
          this.builder,
          this.bindingsHolder
        );
        const bindings = [tableName];
        let sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ${formattedTable}`;
        if (this.schema) {
          sql += " AND TABLE_SCHEMA = ?";
          bindings.push(this.schema);
        }
        this.pushQuery({ sql, bindings, output: (resp) => resp.length > 0 });
      }
      // Check whether a column exists on the schema.
      hasColumn(tableName, column) {
        const formattedColumn = this.client.parameter(
          column,
          this.builder,
          this.bindingsHolder
        );
        const formattedTable = this.client.parameter(
          this.formatter.wrap(prefixedTableName(this.schema, tableName)),
          this.builder,
          this.bindingsHolder
        );
        const sql = `select object_id from sys.columns where name = ${formattedColumn} and object_id = object_id(${formattedTable})`;
        this.pushQuery({ sql, output: (resp) => resp.length > 0 });
      }
    };
    SchemaCompiler_MSSQL.prototype.dropTablePrefix = "DROP TABLE ";
    function prefixedTableName(prefix, table) {
      return prefix ? `${prefix}.${table}` : table;
    }
    module2.exports = SchemaCompiler_MSSQL;
  }
});

// node_modules/knex/lib/dialects/mssql/schema/mssql-tablecompiler.js
var require_mssql_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/mssql/schema/mssql-tablecompiler.js"(exports2, module2) {
    "use strict";
    var TableCompiler = require_tablecompiler();
    var helpers = require_helpers();
    var { isObject } = require_is();
    var TableCompiler_MSSQL = class extends TableCompiler {
      constructor(client, tableBuilder) {
        super(client, tableBuilder);
      }
      createQuery(columns, ifNot, like) {
        let createStatement = ifNot ? `if object_id('${this.tableName()}', 'U') is null ` : "";
        if (like) {
          createStatement += `SELECT * INTO ${this.tableName()} FROM ${this.tableNameLike()} WHERE 0=1`;
        } else {
          createStatement += "CREATE TABLE " + this.tableName() + (this._formatting ? " (\n    " : " (") + columns.sql.join(this._formatting ? ",\n    " : ", ") + this._addChecks() + ")";
        }
        this.pushQuery(createStatement);
        if (this.single.comment) {
          this.comment(this.single.comment);
        }
        if (like) {
          this.addColumns(columns, this.addColumnsPrefix);
        }
      }
      comment(comment) {
        if (!comment) {
          return;
        }
        if (comment.length > 7500 / 2) {
          this.client.logger.warn(
            "Your comment might be longer than the max comment length for MSSQL of 7,500 bytes."
          );
        }
        const value = this.formatter.escapingStringDelimiters(comment);
        const level0name = this.formatter.escapingStringDelimiters(
          this.schemaNameRaw || "dbo"
        );
        const level1name = this.formatter.escapingStringDelimiters(
          this.tableNameRaw
        );
        const args = `N'MS_Description', N'${value}', N'Schema', N'${level0name}', N'Table', N'${level1name}'`;
        const isAlreadyDefined = `EXISTS(SELECT * FROM sys.fn_listextendedproperty(N'MS_Description', N'Schema', N'${level0name}', N'Table', N'${level1name}', NULL, NULL))`;
        this.pushQuery(
          `IF ${isAlreadyDefined}
  EXEC sys.sp_updateextendedproperty ${args}
ELSE
  EXEC sys.sp_addextendedproperty ${args}`
        );
      }
      // Compiles column add.  Multiple columns need only one ADD clause (not one ADD per column) so core addColumns doesn't work.  #1348
      addColumns(columns, prefix) {
        prefix = prefix || this.addColumnsPrefix;
        if (columns.sql.length > 0) {
          this.pushQuery({
            sql: (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + prefix + columns.sql.join(", "),
            bindings: columns.bindings
          });
        }
      }
      alterColumns(columns, colBuilder) {
        for (let i = 0, l = colBuilder.length; i < l; i++) {
          const builder = colBuilder[i];
          if (builder.modified.defaultTo) {
            const schema = this.schemaNameRaw || "dbo";
            const baseQuery = `
              DECLARE @constraint varchar(100) = (SELECT default_constraints.name
                                                  FROM sys.all_columns
                                                  INNER JOIN sys.tables
                                                    ON all_columns.object_id = tables.object_id
                                                  INNER JOIN sys.schemas
                                                    ON tables.schema_id = schemas.schema_id
                                                  INNER JOIN sys.default_constraints
                                                    ON all_columns.default_object_id = default_constraints.object_id
                                                  WHERE schemas.name = '${schema}'
                                                  AND tables.name = '${this.tableNameRaw}'
                                                  AND all_columns.name = '${builder.getColumnName()}')

              IF @constraint IS NOT NULL EXEC('ALTER TABLE ${this.tableNameRaw} DROP CONSTRAINT ' + @constraint)`;
            this.pushQuery(baseQuery);
          }
        }
        columns.sql.forEach((sql) => {
          this.pushQuery({
            sql: (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + (this.lowerCase ? this.alterColumnPrefix.toLowerCase() : this.alterColumnPrefix) + sql,
            bindings: columns.bindings
          });
        });
      }
      // Compiles column drop.  Multiple columns need only one DROP clause (not one DROP per column) so core dropColumn doesn't work.  #1348
      dropColumn() {
        const _this2 = this;
        const columns = helpers.normalizeArr.apply(null, arguments);
        const columnsArray = Array.isArray(columns) ? columns : [columns];
        const drops = columnsArray.map((column) => _this2.formatter.wrap(column));
        const schema = this.schemaNameRaw || "dbo";
        for (const column of columns) {
          const baseQuery = `
              DECLARE @constraint varchar(100) = (SELECT default_constraints.name
                                                  FROM sys.all_columns
                                                  INNER JOIN sys.tables
                                                    ON all_columns.object_id = tables.object_id
                                                  INNER JOIN sys.schemas
                                                    ON tables.schema_id = schemas.schema_id
                                                  INNER JOIN sys.default_constraints
                                                    ON all_columns.default_object_id = default_constraints.object_id
                                                  WHERE schemas.name = '${schema}'
                                                  AND tables.name = '${this.tableNameRaw}'
                                                  AND all_columns.name = '${column}')

              IF @constraint IS NOT NULL EXEC('ALTER TABLE ${this.tableNameRaw} DROP CONSTRAINT ' + @constraint)`;
          this.pushQuery(baseQuery);
        }
        this.pushQuery(
          (this.lowerCase ? "alter table " : "ALTER TABLE ") + this.tableName() + " " + this.dropColumnPrefix + drops.join(", ")
        );
      }
      changeType() {
      }
      // Renames a column on the table.
      renameColumn(from, to) {
        this.pushQuery(
          `exec sp_rename ${this.client.parameter(
            this.tableName() + "." + from,
            this.tableBuilder,
            this.bindingsHolder
          )}, ${this.client.parameter(
            to,
            this.tableBuilder,
            this.bindingsHolder
          )}, 'COLUMN'`
        );
      }
      dropFKRefs(runner, refs) {
        const formatter = this.client.formatter(this.tableBuilder);
        return Promise.all(
          refs.map(function(ref) {
            const constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
            const tableName = formatter.wrap(ref.TABLE_NAME);
            return runner.query({
              sql: `ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`
            });
          })
        );
      }
      createFKRefs(runner, refs) {
        const formatter = this.client.formatter(this.tableBuilder);
        return Promise.all(
          refs.map(function(ref) {
            const tableName = formatter.wrap(ref.TABLE_NAME);
            const keyName = formatter.wrap(ref.CONSTRAINT_NAME);
            const column = formatter.columnize(ref.COLUMN_NAME);
            const references = formatter.columnize(ref.REFERENCED_COLUMN_NAME);
            const inTable = formatter.wrap(ref.REFERENCED_TABLE_NAME);
            const onUpdate = ` ON UPDATE ${ref.UPDATE_RULE}`;
            const onDelete = ` ON DELETE ${ref.DELETE_RULE}`;
            return runner.query({
              sql: `ALTER TABLE ${tableName} ADD CONSTRAINT ${keyName} FOREIGN KEY (` + column + ") REFERENCES " + inTable + " (" + references + ")" + onUpdate + onDelete
            });
          })
        );
      }
      index(columns, indexName, options) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        let predicate;
        if (isObject(options)) {
          ({ predicate } = options);
        }
        const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : "";
        this.pushQuery(
          `CREATE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
            columns
          )})${predicateQuery}`
        );
      }
      /**
       * Create a primary key.
       *
       * @param {undefined | string | string[]} columns
       * @param {string | {constraintName: string, deferrable?: 'not deferrable'|'deferred'|'immediate' }} constraintName
       */
      primary(columns, constraintName) {
        let deferrable;
        if (isObject(constraintName)) {
          ({ constraintName, deferrable } = constraintName);
        }
        if (deferrable && deferrable !== "not deferrable") {
          this.client.logger.warn(
            `mssql: primary key constraint [${constraintName}] will not be deferrable ${deferrable} because mssql does not support deferred constraints.`
          );
        }
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
        if (!this.forCreate) {
          this.pushQuery(
            `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
              columns
            )})`
          );
        } else {
          this.pushQuery(
            `CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
              columns
            )})`
          );
        }
      }
      /**
       * Create a unique index.
       *
       * @param {string | string[]} columns
       * @param {string | {indexName: undefined | string, deferrable?: 'not deferrable'|'deferred'|'immediate', useConstraint?: true|false, predicate?: QueryBuilder }} indexName
       */
      unique(columns, indexName) {
        let deferrable;
        let useConstraint = false;
        let predicate;
        if (isObject(indexName)) {
          ({ indexName, deferrable, useConstraint, predicate } = indexName);
        }
        if (deferrable && deferrable !== "not deferrable") {
          this.client.logger.warn(
            `mssql: unique index [${indexName}] will not be deferrable ${deferrable} because mssql does not support deferred constraints.`
          );
        }
        if (useConstraint && predicate) {
          throw new Error("mssql cannot create constraint with predicate");
        }
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        if (!Array.isArray(columns)) {
          columns = [columns];
        }
        if (useConstraint) {
          this.pushQuery(
            `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${indexName} UNIQUE (${this.formatter.columnize(
              columns
            )})`
          );
        } else {
          const predicateQuery = predicate ? " " + this.client.queryCompiler(predicate).where() : " WHERE " + columns.map((column) => this.formatter.columnize(column) + " IS NOT NULL").join(" AND ");
          this.pushQuery(
            `CREATE UNIQUE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
              columns
            )})${predicateQuery}`
          );
        }
      }
      // Compile a drop index command.
      dropIndex(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
      }
      // Compile a drop foreign key command.
      dropForeign(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
        this.pushQuery(
          `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${indexName}`
        );
      }
      // Compile a drop primary key command.
      dropPrimary(constraintName) {
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
        this.pushQuery(
          `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${constraintName}`
        );
      }
      // Compile a drop unique key command.
      dropUnique(column, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, column);
        this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
      }
    };
    TableCompiler_MSSQL.prototype.createAlterTableMethods = ["foreign", "primary"];
    TableCompiler_MSSQL.prototype.lowerCase = false;
    TableCompiler_MSSQL.prototype.addColumnsPrefix = "ADD ";
    TableCompiler_MSSQL.prototype.dropColumnPrefix = "DROP COLUMN ";
    TableCompiler_MSSQL.prototype.alterColumnPrefix = "ALTER COLUMN ";
    module2.exports = TableCompiler_MSSQL;
  }
});

// node_modules/knex/lib/dialects/mssql/schema/mssql-viewcompiler.js
var require_mssql_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/mssql/schema/mssql-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler = require_viewcompiler();
    var {
      columnize: columnize_
    } = require_wrappingFormatter();
    var ViewCompiler_MSSQL = class extends ViewCompiler {
      constructor(client, viewCompiler) {
        super(client, viewCompiler);
      }
      createQuery(columns, selectQuery, materialized, replace) {
        const createStatement = "CREATE " + (replace ? "OR ALTER " : "") + "VIEW ";
        let sql = createStatement + this.viewName();
        const columnList = columns ? " (" + columnize_(
          columns,
          this.viewBuilder,
          this.client,
          this.bindingsHolder
        ) + ")" : "";
        sql += columnList;
        sql += " AS ";
        sql += selectQuery.toString();
        this.pushQuery({
          sql
        });
      }
      renameColumn(from, to) {
        this.pushQuery(
          `exec sp_rename ${this.client.parameter(
            this.viewName() + "." + from,
            this.viewBuilder,
            this.bindingsHolder
          )}, ${this.client.parameter(
            to,
            this.viewBuilder,
            this.bindingsHolder
          )}, 'COLUMN'`
        );
      }
      createOrReplace() {
        this.createQuery(this.columns, this.selectQuery, false, true);
      }
    };
    module2.exports = ViewCompiler_MSSQL;
  }
});

// node_modules/knex/lib/dialects/mssql/schema/mssql-columncompiler.js
var require_mssql_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/mssql/schema/mssql-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler = require_columncompiler();
    var { toNumber } = require_helpers();
    var { formatDefault } = require_formatterUtils();
    var { operator: operator_ } = require_wrappingFormatter();
    var ColumnCompiler_MSSQL = class extends ColumnCompiler {
      constructor(client, tableCompiler, columnBuilder) {
        super(client, tableCompiler, columnBuilder);
        this.modifiers = ["nullable", "defaultTo", "first", "after", "comment"];
        this._addCheckModifiers();
      }
      // Types
      // ------
      double(precision, scale) {
        return "float";
      }
      floating(precision, scale) {
        return `float`;
      }
      integer() {
        return "int";
      }
      tinyint() {
        return "tinyint";
      }
      varchar(length) {
        return `nvarchar(${toNumber(length, 255)})`;
      }
      timestamp({ useTz = false } = {}) {
        return useTz ? "datetimeoffset" : "datetime2";
      }
      bit(length) {
        if (length > 1) {
          this.client.logger.warn("Bit field is exactly 1 bit length for MSSQL");
        }
        return "bit";
      }
      binary(length) {
        return length ? `varbinary(${toNumber(length)})` : "varbinary(max)";
      }
      // Modifiers
      // ------
      first() {
        this.client.logger.warn("Column first modifier not available for MSSQL");
        return "";
      }
      after(column) {
        this.client.logger.warn("Column after modifier not available for MSSQL");
        return "";
      }
      defaultTo(value, { constraintName } = {}) {
        const formattedValue = formatDefault(value, this.type, this.client);
        constraintName = typeof constraintName !== "undefined" ? constraintName : `${this.tableCompiler.tableNameRaw}_${this.getColumnName()}_default`.toLowerCase();
        if (this.columnBuilder._method === "alter") {
          this.pushAdditional(function() {
            this.pushQuery(
              `ALTER TABLE ${this.tableCompiler.tableName()} ADD CONSTRAINT ${this.formatter.wrap(
                constraintName
              )} DEFAULT ${formattedValue} FOR ${this.formatter.wrap(
                this.getColumnName()
              )}`
            );
          });
          return "";
        }
        if (!constraintName) {
          return `DEFAULT ${formattedValue}`;
        }
        return `CONSTRAINT ${this.formatter.wrap(
          constraintName
        )} DEFAULT ${formattedValue}`;
      }
      comment(comment) {
        if (!comment) {
          return;
        }
        if (comment && comment.length > 7500 / 2) {
          this.client.logger.warn(
            "Your comment might be longer than the max comment length for MSSQL of 7,500 bytes."
          );
        }
        const value = this.formatter.escapingStringDelimiters(comment);
        const level0name = this.tableCompiler.schemaNameRaw || "dbo";
        const level1name = this.formatter.escapingStringDelimiters(
          this.tableCompiler.tableNameRaw
        );
        const level2name = this.formatter.escapingStringDelimiters(
          this.args[0] || this.defaults("columnName")
        );
        const args = `N'MS_Description', N'${value}', N'Schema', N'${level0name}', N'Table', N'${level1name}', N'Column', N'${level2name}'`;
        this.pushAdditional(function() {
          const isAlreadyDefined = `EXISTS(SELECT * FROM sys.fn_listextendedproperty(N'MS_Description', N'Schema', N'${level0name}', N'Table', N'${level1name}', N'Column', N'${level2name}'))`;
          this.pushQuery(
            `IF ${isAlreadyDefined}
  EXEC sys.sp_updateextendedproperty ${args}
ELSE
  EXEC sys.sp_addextendedproperty ${args}`
          );
        });
        return "";
      }
      checkLength(operator, length, constraintName) {
        return this._check(
          `LEN(${this.formatter.wrap(this.getColumnName())}) ${operator_(
            operator,
            this.columnBuilder,
            this.bindingsHolder
          )} ${toNumber(length)}`,
          constraintName
        );
      }
      checkRegex(regex, constraintName) {
        return this._check(
          `${this.formatter.wrap(
            this.getColumnName()
          )} LIKE ${this.client._escapeBinding("%" + regex + "%")}`,
          constraintName
        );
      }
      increments(options = { primaryKey: true }) {
        return "int identity(1,1) not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
      bigincrements(options = { primaryKey: true }) {
        return "bigint identity(1,1) not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
    };
    ColumnCompiler_MSSQL.prototype.bigint = "bigint";
    ColumnCompiler_MSSQL.prototype.mediumint = "int";
    ColumnCompiler_MSSQL.prototype.smallint = "smallint";
    ColumnCompiler_MSSQL.prototype.text = "nvarchar(max)";
    ColumnCompiler_MSSQL.prototype.mediumtext = "nvarchar(max)";
    ColumnCompiler_MSSQL.prototype.longtext = "nvarchar(max)";
    ColumnCompiler_MSSQL.prototype.json = ColumnCompiler_MSSQL.prototype.jsonb = "nvarchar(max)";
    ColumnCompiler_MSSQL.prototype.enu = "nvarchar(100)";
    ColumnCompiler_MSSQL.prototype.uuid = ({ useBinaryUuid = false } = {}) => useBinaryUuid ? "binary(16)" : "uniqueidentifier";
    ColumnCompiler_MSSQL.prototype.datetime = "datetime2";
    ColumnCompiler_MSSQL.prototype.bool = "bit";
    module2.exports = ColumnCompiler_MSSQL;
  }
});

// node_modules/knex/lib/dialects/mssql/index.js
var require_mssql = __commonJS({
  "node_modules/knex/lib/dialects/mssql/index.js"(exports2, module2) {
    "use strict";
    var map = require_map();
    var isNil = require_isNil();
    var Client = require_client();
    var MSSQL_Formatter = require_mssql_formatter();
    var Transaction = require_transaction2();
    var QueryCompiler = require_mssql_querycompiler();
    var SchemaCompiler = require_mssql_compiler();
    var TableCompiler = require_mssql_tablecompiler();
    var ViewCompiler = require_mssql_viewcompiler();
    var ColumnCompiler = require_mssql_columncompiler();
    var QueryBuilder = require_querybuilder();
    var { setHiddenProperty } = require_security();
    var debug = require_src()("knex:mssql");
    var SQL_INT4 = { MIN: -2147483648, MAX: 2147483647 };
    var SQL_BIGINT_SAFE = { MIN: -9007199254740991, MAX: 9007199254740991 };
    var Client_MSSQL = class extends Client {
      constructor(config3 = {}) {
        super(config3);
      }
      /**
       * @param {import('knex').Config} options
       */
      _generateConnection() {
        const settings = this.connectionSettings;
        settings.options = settings.options || {};
        const cfg = {
          authentication: {
            type: settings.type || "default",
            options: {
              userName: settings.userName || settings.user,
              password: settings.password,
              domain: settings.domain,
              token: settings.token,
              clientId: settings.clientId,
              clientSecret: settings.clientSecret,
              tenantId: settings.tenantId,
              msiEndpoint: settings.msiEndpoint
            }
          },
          server: settings.server || settings.host,
          options: {
            database: settings.database,
            encrypt: settings.encrypt || false,
            port: settings.port || 1433,
            connectTimeout: settings.connectionTimeout || settings.timeout || 15e3,
            requestTimeout: !isNil(settings.requestTimeout) ? settings.requestTimeout : 15e3,
            rowCollectionOnDone: false,
            rowCollectionOnRequestCompletion: false,
            useColumnNames: false,
            tdsVersion: settings.options.tdsVersion || "7_4",
            appName: settings.options.appName || "knex",
            trustServerCertificate: false,
            ...settings.options
          }
        };
        if (cfg.authentication.options.password) {
          setHiddenProperty(cfg.authentication.options);
        }
        if (cfg.options.instanceName) delete cfg.options.port;
        if (isNaN(cfg.options.requestTimeout)) cfg.options.requestTimeout = 15e3;
        if (cfg.options.requestTimeout === Infinity) cfg.options.requestTimeout = 0;
        if (cfg.options.requestTimeout < 0) cfg.options.requestTimeout = 0;
        if (settings.debug) {
          cfg.options.debug = {
            packet: true,
            token: true,
            data: true,
            payload: true
          };
        }
        return cfg;
      }
      _driver() {
        const tds = require("tedious");
        return tds;
      }
      formatter() {
        return new MSSQL_Formatter(this, ...arguments);
      }
      transaction() {
        return new Transaction(this, ...arguments);
      }
      queryCompiler() {
        return new QueryCompiler(this, ...arguments);
      }
      schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      viewCompiler() {
        return new ViewCompiler(this, ...arguments);
      }
      queryBuilder() {
        const b = new QueryBuilder(this);
        return b;
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      wrapIdentifierImpl(value) {
        if (value === "*") {
          return "*";
        }
        return `[${value.replace(/[[\]]+/g, "")}]`;
      }
      // Get a raw connection, called by the `pool` whenever a new
      // connection needs to be added to the pool.
      acquireRawConnection() {
        return new Promise((resolver, rejecter) => {
          debug("connection::connection new connection requested");
          const Driver = this._driver();
          const settings = Object.assign({}, this._generateConnection());
          const connection = new Driver.Connection(settings);
          connection.connect((err) => {
            if (err) {
              debug("connection::connect error: %s", err.message);
              return rejecter(err);
            }
            debug("connection::connect connected to server");
            connection.connected = true;
            connection.on("error", (e) => {
              debug("connection::error message=%s", e.message);
              connection.__knex__disposed = e;
              connection.connected = false;
            });
            connection.once("end", () => {
              connection.connected = false;
              connection.__knex__disposed = "Connection to server was terminated.";
              debug("connection::end connection ended.");
            });
            return resolver(connection);
          });
        });
      }
      validateConnection(connection) {
        return connection && connection.connected;
      }
      // Used to explicitly close a connection, called internally by the pool
      // when a connection times out or the pool is shutdown.
      destroyRawConnection(connection) {
        debug("connection::destroy");
        return new Promise((resolve) => {
          connection.once("end", () => {
            resolve();
          });
          connection.close();
        });
      }
      // Position the bindings for the query.
      positionBindings(sql) {
        let questionCount = -1;
        return sql.replace(/\\?\?/g, (match) => {
          if (match === "\\?") {
            return "?";
          }
          questionCount += 1;
          return `@p${questionCount}`;
        });
      }
      _chomp(connection) {
        if (connection.state.name === "LoggedIn") {
          const nextRequest = this.requestQueue.pop();
          if (nextRequest) {
            debug(
              "connection::query executing query, %d more in queue",
              this.requestQueue.length
            );
            connection.execSql(nextRequest);
          }
        }
      }
      _enqueueRequest(request, connection) {
        this.requestQueue.push(request);
        this._chomp(connection);
      }
      _makeRequest(query, callback) {
        const Driver = this._driver();
        const sql = typeof query === "string" ? query : query.sql;
        let rowCount = 0;
        if (!sql) throw new Error("The query is empty");
        debug("request::request sql=%s", sql);
        const request = new Driver.Request(sql, (err, remoteRowCount) => {
          if (err) {
            debug("request::error message=%s", err.message);
            return callback(err);
          }
          rowCount = remoteRowCount;
          debug("request::callback rowCount=%d", rowCount);
        });
        request.on("prepared", () => {
          debug("request %s::request prepared", this.id);
        });
        request.on("done", (rowCount2, more) => {
          debug("request::done rowCount=%d more=%s", rowCount2, more);
        });
        request.on("doneProc", (rowCount2, more) => {
          debug(
            "request::doneProc id=%s rowCount=%d more=%s",
            request.id,
            rowCount2,
            more
          );
        });
        request.on("doneInProc", (rowCount2, more) => {
          debug(
            "request::doneInProc id=%s rowCount=%d more=%s",
            request.id,
            rowCount2,
            more
          );
        });
        request.once("requestCompleted", () => {
          debug("request::completed id=%s", request.id);
          return callback(null, rowCount);
        });
        request.on("error", (err) => {
          debug("request::error id=%s message=%s", request.id, err.message);
          return callback(err);
        });
        return request;
      }
      // Grab a connection, run the query via the MSSQL streaming interface,
      // and pass that through to the stream we've sent back to the client.
      _stream(connection, query, stream) {
        return new Promise((resolve, reject) => {
          const request = this._makeRequest(query, (err) => {
            if (err) {
              stream.emit("error", err);
              return reject(err);
            }
            resolve();
          });
          request.on("row", (row) => {
            stream.write(
              row.reduce(
                (prev, curr) => ({
                  ...prev,
                  [curr.metadata.colName]: curr.value
                }),
                {}
              )
            );
          });
          request.on("error", (err) => {
            stream.emit("error", err);
            reject(err);
          });
          request.once("requestCompleted", () => {
            stream.end();
            resolve();
          });
          this._assignBindings(request, query.bindings);
          this._enqueueRequest(request, connection);
        });
      }
      _assignBindings(request, bindings) {
        if (Array.isArray(bindings)) {
          for (let i = 0; i < bindings.length; i++) {
            const binding = bindings[i];
            this._setReqInput(request, i, binding);
          }
        }
      }
      _scaleForBinding(binding) {
        if (binding % 1 === 0) {
          throw new Error(`The binding value ${binding} must be a decimal number.`);
        }
        return { scale: 10 };
      }
      _typeForBinding(binding) {
        const Driver = this._driver();
        if (this.connectionSettings.options && this.connectionSettings.options.mapBinding) {
          const result = this.connectionSettings.options.mapBinding(binding);
          if (result) {
            return [result.value, result.type];
          }
        }
        switch (typeof binding) {
          case "string":
            return [binding, Driver.TYPES.NVarChar];
          case "boolean":
            return [binding, Driver.TYPES.Bit];
          case "number": {
            if (binding % 1 !== 0) {
              return [binding, Driver.TYPES.Float];
            }
            if (binding < SQL_INT4.MIN || binding > SQL_INT4.MAX) {
              if (binding < SQL_BIGINT_SAFE.MIN || binding > SQL_BIGINT_SAFE.MAX) {
                throw new Error(
                  `Bigint must be safe integer or must be passed as string, saw ${binding}`
                );
              }
              return [binding, Driver.TYPES.BigInt];
            }
            return [binding, Driver.TYPES.Int];
          }
          default: {
            if (binding instanceof Date) {
              return [binding, Driver.TYPES.DateTime];
            }
            if (binding instanceof Buffer) {
              return [binding, Driver.TYPES.VarBinary];
            }
            return [binding, Driver.TYPES.NVarChar];
          }
        }
      }
      // Runs the query on the specified connection, providing the bindings
      // and any other necessary prep work.
      _query(connection, query) {
        return new Promise((resolve, reject) => {
          const rows = [];
          const request = this._makeRequest(query, (err, count) => {
            if (err) {
              return reject(err);
            }
            query.response = rows;
            process.nextTick(() => this._chomp(connection));
            resolve(query);
          });
          request.on("row", (row) => {
            debug("request::row");
            rows.push(row);
          });
          this._assignBindings(request, query.bindings);
          this._enqueueRequest(request, connection);
        });
      }
      // sets a request input parameter. Detects bigints and decimals and sets type appropriately.
      _setReqInput(req, i, inputBinding) {
        const [binding, tediousType] = this._typeForBinding(inputBinding);
        const bindingName = "p".concat(i);
        let options;
        if (typeof binding === "number" && binding % 1 !== 0) {
          options = this._scaleForBinding(binding);
        }
        debug(
          "request::binding pos=%d type=%s value=%s",
          i,
          tediousType.name,
          binding
        );
        if (Buffer.isBuffer(binding)) {
          options = {
            length: "max"
          };
        }
        req.addParameter(bindingName, tediousType, binding, options);
      }
      // Process the response as returned from the query.
      processResponse(query, runner) {
        if (query == null) return;
        let { response } = query;
        const { method } = query;
        if (query.output) {
          return query.output.call(runner, response);
        }
        response = response.map(
          (row) => row.reduce((columns, r) => {
            const colName = r.metadata.colName;
            if (columns[colName]) {
              if (!Array.isArray(columns[colName])) {
                columns[colName] = [columns[colName]];
              }
              columns[colName].push(r.value);
            } else {
              columns[colName] = r.value;
            }
            return columns;
          }, {})
        );
        if (query.output) return query.output.call(runner, response);
        switch (method) {
          case "select":
            return response;
          case "first":
            return response[0];
          case "pluck":
            return map(response, query.pluck);
          case "insert":
          case "del":
          case "update":
          case "counter":
            if (query.returning) {
              if (query.returning === "@@rowcount") {
                return response[0][""];
              }
            }
            return response;
          default:
            return response;
        }
      }
    };
    Object.assign(Client_MSSQL.prototype, {
      requestQueue: [],
      dialect: "mssql",
      driverName: "mssql"
    });
    module2.exports = Client_MSSQL;
  }
});

// node_modules/lodash/_baseDelay.js
var require_baseDelay = __commonJS({
  "node_modules/lodash/_baseDelay.js"(exports2, module2) {
    "use strict";
    var FUNC_ERROR_TEXT = "Expected a function";
    function baseDelay(func, wait, args) {
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() {
        func.apply(void 0, args);
      }, wait);
    }
    module2.exports = baseDelay;
  }
});

// node_modules/lodash/defer.js
var require_defer = __commonJS({
  "node_modules/lodash/defer.js"(exports2, module2) {
    "use strict";
    var baseDelay = require_baseDelay();
    var baseRest = require_baseRest();
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });
    module2.exports = defer;
  }
});

// node_modules/knex/lib/dialects/mysql/transaction.js
var require_transaction3 = __commonJS({
  "node_modules/knex/lib/dialects/mysql/transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    var Debug = require_src();
    var debug = Debug("knex:tx");
    var Transaction_MySQL = class extends Transaction {
      query(conn, sql, status, value) {
        const t = this;
        const q = this.trxClient.query(conn, sql).catch((err) => {
          if (err.errno === 1305) {
            this.trxClient.logger.warn(
              "Transaction was implicitly committed, do not mix transactions and DDL with MySQL (#805)"
            );
            return;
          }
          status = 2;
          value = err;
          t._completed = true;
          debug("%s error running transaction query", t.txid);
        }).then(function(res) {
          if (status === 1) t._resolver(value);
          if (status === 2) {
            if (value === void 0) {
              if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
                t._resolver();
                return;
              }
              value = new Error(`Transaction rejected with non-error: ${value}`);
            }
            t._rejecter(value);
          }
          return res;
        });
        if (status === 1 || status === 2) {
          t._completed = true;
        }
        return q;
      }
    };
    module2.exports = Transaction_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/query/mysql-querybuilder.js
var require_mysql_querybuilder = __commonJS({
  "node_modules/knex/lib/dialects/mysql/query/mysql-querybuilder.js"(exports2, module2) {
    "use strict";
    var QueryBuilder = require_querybuilder();
    var isEmpty = require_isEmpty();
    module2.exports = class QueryBuilder_MySQL extends QueryBuilder {
      upsert(values, returning, options) {
        this._method = "upsert";
        if (!isEmpty(returning)) {
          this.returning(returning, options);
        }
        this._single.upsert = values;
        return this;
      }
    };
  }
});

// node_modules/knex/lib/dialects/mysql/query/mysql-querycompiler.js
var require_mysql_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/mysql/query/mysql-querycompiler.js"(exports2, module2) {
    "use strict";
    var assert = require("assert");
    var identity = require_identity();
    var isPlainObject = require_isPlainObject();
    var isEmpty = require_isEmpty();
    var QueryCompiler = require_querycompiler();
    var { wrapAsIdentifier } = require_formatterUtils();
    var {
      columnize: columnize_,
      wrap: wrap_
    } = require_wrappingFormatter();
    var isPlainObjectOrArray = (value) => isPlainObject(value) || Array.isArray(value);
    var QueryCompiler_MySQL = class extends QueryCompiler {
      constructor(client, builder, formatter) {
        super(client, builder, formatter);
        const { returning } = this.single;
        if (returning) {
          this.client.logger.warn(
            ".returning() is not supported by mysql and will not have any effect."
          );
        }
        this._emptyInsertValue = "() values ()";
      }
      // Compiles an `delete` allowing comments
      del() {
        const sql = super.del();
        if (sql === "") return sql;
        const comments = this.comments();
        return (comments === "" ? "" : comments + " ") + sql;
      }
      // Compiles an `insert` query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        let sql = super.insert();
        if (sql === "") return sql;
        const comments = this.comments();
        sql = (comments === "" ? "" : comments + " ") + sql;
        const { ignore, merge, insert } = this.single;
        if (ignore) sql = sql.replace("insert into", "insert ignore into");
        if (merge) {
          sql += this._merge(merge.updates, insert);
          const wheres = this.where();
          if (wheres) {
            throw new Error(
              ".onConflict().merge().where() is not supported for mysql"
            );
          }
        }
        return sql;
      }
      upsert() {
        const upsertValues = this.single.upsert || [];
        const sql = this.with() + `replace into ${this.tableName} `;
        const body = this._insertBody(upsertValues);
        return body === "" ? "" : sql + body;
      }
      // Compiles merge for onConflict, allowing for different merge strategies
      _merge(updates, insert) {
        const sql = " on duplicate key update ";
        if (updates && Array.isArray(updates)) {
          return sql + updates.map(
            (column) => wrapAsIdentifier(column, this.formatter.builder, this.client)
          ).map((column) => `${column} = values(${column})`).join(", ");
        } else if (updates && typeof updates === "object") {
          const updateData = this._prepUpdate(updates);
          return sql + updateData.join(",");
        } else {
          const insertData = this._prepInsert(insert);
          if (typeof insertData === "string") {
            throw new Error(
              "If using merge with a raw insert query, then updates must be provided"
            );
          }
          return sql + insertData.columns.map((column) => wrapAsIdentifier(column, this.builder, this.client)).map((column) => `${column} = values(${column})`).join(", ");
        }
      }
      // Update method, including joins, wheres, order & limits.
      update() {
        const comments = this.comments();
        const withSQL = this.with();
        const join = this.join();
        const updates = this._prepUpdate(this.single.update);
        const where = this.where();
        const order = this.order();
        const limit = this.limit();
        return (comments === "" ? "" : comments + " ") + withSQL + `update ${this.tableName}` + (join ? ` ${join}` : "") + " set " + updates.join(", ") + (where ? ` ${where}` : "") + (order ? ` ${order}` : "") + (limit ? ` ${limit}` : "");
      }
      forUpdate() {
        return "for update";
      }
      forShare() {
        return "lock in share mode";
      }
      // Only supported on MySQL 8.0+
      skipLocked() {
        return "skip locked";
      }
      // Supported on MySQL 8.0+ and MariaDB 10.3.0+
      noWait() {
        return "nowait";
      }
      // Compiles a `columnInfo` query.
      columnInfo() {
        const column = this.single.columnInfo;
        const table = this.client.customWrapIdentifier(this.single.table, identity);
        return {
          sql: "select * from information_schema.columns where table_name = ? and table_schema = ?",
          bindings: [table, this.client.database()],
          output(resp) {
            const out = resp.reduce(function(columns, val) {
              columns[val.COLUMN_NAME] = {
                defaultValue: val.COLUMN_DEFAULT === "NULL" ? null : val.COLUMN_DEFAULT,
                type: val.DATA_TYPE,
                maxLength: val.CHARACTER_MAXIMUM_LENGTH,
                nullable: val.IS_NULLABLE === "YES"
              };
              return columns;
            }, {});
            return column && out[column] || out;
          }
        };
      }
      limit() {
        const noLimit = !this.single.limit && this.single.limit !== 0;
        if (noLimit && !this.single.offset) return "";
        const limit = this.single.offset && noLimit ? "18446744073709551615" : this._getValueOrParameterFromAttribute("limit");
        return `limit ${limit}`;
      }
      whereBasic(statement) {
        assert(
          !isPlainObjectOrArray(statement.value),
          "The values in where clause must not be object or array."
        );
        return super.whereBasic(statement);
      }
      whereRaw(statement) {
        assert(
          isEmpty(statement.value.bindings) || !Object.values(statement.value.bindings).some(isPlainObjectOrArray),
          "The values in where clause must not be object or array."
        );
        return super.whereRaw(statement);
      }
      whereLike(statement) {
        return `${this._columnClause(statement)} ${this._not(
          statement,
          "like "
        )}${this._valueClause(statement)} COLLATE utf8_bin`;
      }
      whereILike(statement) {
        return `${this._columnClause(statement)} ${this._not(
          statement,
          "like "
        )}${this._valueClause(statement)}`;
      }
      // Json functions
      jsonExtract(params) {
        return this._jsonExtract(["json_extract", "json_unquote"], params);
      }
      jsonSet(params) {
        return this._jsonSet("json_set", params);
      }
      jsonInsert(params) {
        return this._jsonSet("json_insert", params);
      }
      jsonRemove(params) {
        const jsonCol = `json_remove(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )},${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )})`;
        return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
      }
      whereJsonObject(statement) {
        return this._not(
          statement,
          `json_contains(${this._columnClause(statement)}, ${this._jsonValueClause(
            statement
          )})`
        );
      }
      whereJsonPath(statement) {
        return this._whereJsonPath("json_extract", statement);
      }
      whereJsonSupersetOf(statement) {
        return this._not(
          statement,
          `json_contains(${wrap_(
            statement.column,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          )},${this._jsonValueClause(statement)})`
        );
      }
      whereJsonSubsetOf(statement) {
        return this._not(
          statement,
          `json_contains(${this._jsonValueClause(statement)},${wrap_(
            statement.column,
            void 0,
            this.builder,
            this.client,
            this.bindingsHolder
          )})`
        );
      }
      onJsonPathEquals(clause) {
        return this._onJsonPathEquals("json_extract", clause);
      }
    };
    module2.exports = QueryCompiler_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/schema/mysql-compiler.js
var require_mysql_compiler = __commonJS({
  "node_modules/knex/lib/dialects/mysql/schema/mysql-compiler.js"(exports2, module2) {
    "use strict";
    var SchemaCompiler = require_compiler();
    var SchemaCompiler_MySQL = class extends SchemaCompiler {
      constructor(client, builder) {
        super(client, builder);
      }
      // Rename a table on the schema.
      renameTable(tableName, to) {
        this.pushQuery(
          `rename table ${this.formatter.wrap(tableName)} to ${this.formatter.wrap(
            to
          )}`
        );
      }
      renameView(from, to) {
        this.renameTable(from, to);
      }
      // Check whether a table exists on the query.
      hasTable(tableName) {
        let sql = "select * from information_schema.tables where table_name = ?";
        const bindings = [tableName];
        if (this.schema) {
          sql += " and table_schema = ?";
          bindings.push(this.schema);
        } else {
          sql += " and table_schema = database()";
        }
        this.pushQuery({
          sql,
          bindings,
          output: function output(resp) {
            return resp.length > 0;
          }
        });
      }
      // Check whether a column exists on the schema.
      hasColumn(tableName, column) {
        this.pushQuery({
          sql: `show columns from ${this.formatter.wrap(tableName)}`,
          output(resp) {
            return resp.some((row) => {
              return this.client.wrapIdentifier(row.Field.toLowerCase()) === this.client.wrapIdentifier(column.toLowerCase());
            });
          }
        });
      }
    };
    module2.exports = SchemaCompiler_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/schema/mysql-tablecompiler.js
var require_mysql_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/mysql/schema/mysql-tablecompiler.js"(exports2, module2) {
    "use strict";
    var TableCompiler = require_tablecompiler();
    var { isObject, isString } = require_is();
    var TableCompiler_MySQL = class extends TableCompiler {
      constructor(client, tableBuilder) {
        super(client, tableBuilder);
      }
      createQuery(columns, ifNot, like) {
        const createStatement = ifNot ? "create table if not exists " : "create table ";
        const { client } = this;
        let conn = {};
        let columnsSql = " (" + columns.sql.join(", ");
        columnsSql += this.primaryKeys() || "";
        columnsSql += this._addChecks();
        columnsSql += ")";
        let sql = createStatement + this.tableName() + (like && this.tableNameLike() ? " like " + this.tableNameLike() : columnsSql);
        if (client.connectionSettings) {
          conn = client.connectionSettings;
        }
        const charset = this.single.charset || conn.charset || "";
        const collation = this.single.collate || conn.collate || "";
        const engine = this.single.engine || "";
        if (charset && !like) sql += ` default character set ${charset}`;
        if (collation) sql += ` collate ${collation}`;
        if (engine) sql += ` engine = ${engine}`;
        if (this.single.comment) {
          const comment = this.single.comment || "";
          const MAX_COMMENT_LENGTH = 1024;
          if (comment.length > MAX_COMMENT_LENGTH)
            this.client.logger.warn(
              `The max length for a table comment is ${MAX_COMMENT_LENGTH} characters`
            );
          sql += ` comment = '${comment}'`;
        }
        this.pushQuery(sql);
        if (like) {
          this.addColumns(columns, this.addColumnsPrefix);
        }
      }
      // Compiles the comment on the table.
      comment(comment) {
        this.pushQuery(`alter table ${this.tableName()} comment = '${comment}'`);
      }
      changeType() {
      }
      // Renames a column on the table.
      renameColumn(from, to) {
        const compiler = this;
        const table = this.tableName();
        const wrapped = this.formatter.wrap(from) + " " + this.formatter.wrap(to);
        this.pushQuery({
          sql: `show full fields from ${table} where field = ` + this.client.parameter(from, this.tableBuilder, this.bindingsHolder),
          output(resp) {
            const column = resp[0];
            const runner = this;
            return compiler.getFKRefs(runner).then(
              ([refs]) => new Promise((resolve, reject) => {
                try {
                  if (!refs.length) {
                    resolve();
                  }
                  resolve(compiler.dropFKRefs(runner, refs));
                } catch (e) {
                  reject(e);
                }
              }).then(function() {
                let sql = `alter table ${table} change ${wrapped} ${column.Type}`;
                if (String(column.Null).toUpperCase() !== "YES") {
                  sql += ` NOT NULL`;
                } else {
                  sql += ` NULL`;
                }
                if (column.Default !== void 0 && column.Default !== null) {
                  sql += ` DEFAULT '${column.Default}'`;
                }
                if (column.Collation !== void 0 && column.Collation !== null) {
                  sql += ` COLLATE '${column.Collation}'`;
                }
                if (column.Extra == "auto_increment") {
                  sql += ` AUTO_INCREMENT`;
                }
                return runner.query({
                  sql
                });
              }).then(function() {
                if (!refs.length) {
                  return;
                }
                return compiler.createFKRefs(
                  runner,
                  refs.map(function(ref) {
                    if (ref.REFERENCED_COLUMN_NAME === from) {
                      ref.REFERENCED_COLUMN_NAME = to;
                    }
                    if (ref.COLUMN_NAME === from) {
                      ref.COLUMN_NAME = to;
                    }
                    return ref;
                  })
                );
              })
            );
          }
        });
      }
      primaryKeys() {
        const pks = (this.grouped.alterTable || []).filter(
          (k) => k.method === "primary"
        );
        if (pks.length > 0 && pks[0].args.length > 0) {
          const columns = pks[0].args[0];
          let constraintName = pks[0].args[1] || "";
          if (constraintName) {
            constraintName = " constraint " + this.formatter.wrap(constraintName);
          }
          if (this.grouped.columns) {
            const incrementsCols = this._getIncrementsColumnNames();
            if (incrementsCols.length) {
              incrementsCols.forEach((c) => {
                if (!columns.includes(c)) {
                  columns.unshift(c);
                }
              });
            }
            const bigIncrementsCols = this._getBigIncrementsColumnNames();
            if (bigIncrementsCols.length) {
              bigIncrementsCols.forEach((c) => {
                if (!columns.includes(c)) {
                  columns.unshift(c);
                }
              });
            }
          }
          return `,${constraintName} primary key (${this.formatter.columnize(
            columns
          )})`;
        }
      }
      getFKRefs(runner) {
        const bindingsHolder = {
          bindings: []
        };
        const sql = "SELECT KCU.CONSTRAINT_NAME, KCU.TABLE_NAME, KCU.COLUMN_NAME,        KCU.REFERENCED_TABLE_NAME, KCU.REFERENCED_COLUMN_NAME,        RC.UPDATE_RULE, RC.DELETE_RULE FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC        USING(CONSTRAINT_NAME)WHERE KCU.REFERENCED_TABLE_NAME = " + this.client.parameter(
          this.tableNameRaw,
          this.tableBuilder,
          bindingsHolder
        ) + "   AND KCU.CONSTRAINT_SCHEMA = " + this.client.parameter(
          this.client.database(),
          this.tableBuilder,
          bindingsHolder
        ) + "   AND RC.CONSTRAINT_SCHEMA = " + this.client.parameter(
          this.client.database(),
          this.tableBuilder,
          bindingsHolder
        );
        return runner.query({
          sql,
          bindings: bindingsHolder.bindings
        });
      }
      dropFKRefs(runner, refs) {
        const formatter = this.client.formatter(this.tableBuilder);
        return Promise.all(
          refs.map(function(ref) {
            const constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
            const tableName = formatter.wrap(ref.TABLE_NAME);
            return runner.query({
              sql: `alter table ${tableName} drop foreign key ${constraintName}`
            });
          })
        );
      }
      createFKRefs(runner, refs) {
        const formatter = this.client.formatter(this.tableBuilder);
        return Promise.all(
          refs.map(function(ref) {
            const tableName = formatter.wrap(ref.TABLE_NAME);
            const keyName = formatter.wrap(ref.CONSTRAINT_NAME);
            const column = formatter.columnize(ref.COLUMN_NAME);
            const references = formatter.columnize(ref.REFERENCED_COLUMN_NAME);
            const inTable = formatter.wrap(ref.REFERENCED_TABLE_NAME);
            const onUpdate = ` ON UPDATE ${ref.UPDATE_RULE}`;
            const onDelete = ` ON DELETE ${ref.DELETE_RULE}`;
            return runner.query({
              sql: `alter table ${tableName} add constraint ${keyName} foreign key (` + column + ") references " + inTable + " (" + references + ")" + onUpdate + onDelete
            });
          })
        );
      }
      index(columns, indexName, options) {
        let storageEngineIndexType;
        let indexType;
        if (isString(options)) {
          indexType = options;
        } else if (isObject(options)) {
          ({ indexType, storageEngineIndexType } = options);
        }
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        storageEngineIndexType = storageEngineIndexType ? ` using ${storageEngineIndexType}` : "";
        this.pushQuery(
          `alter table ${this.tableName()} add${indexType ? ` ${indexType}` : ""} index ${indexName}(${this.formatter.columnize(
            columns
          )})${storageEngineIndexType}`
        );
      }
      primary(columns, constraintName) {
        let deferrable;
        if (isObject(constraintName)) {
          ({ constraintName, deferrable } = constraintName);
        }
        if (deferrable && deferrable !== "not deferrable") {
          this.client.logger.warn(
            `mysql: primary key constraint \`${constraintName}\` will not be deferrable ${deferrable} because mysql does not support deferred constraints.`
          );
        }
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
        const primaryCols = columns;
        let incrementsCols = [];
        let bigIncrementsCols = [];
        if (this.grouped.columns) {
          incrementsCols = this._getIncrementsColumnNames();
          if (incrementsCols) {
            incrementsCols.forEach((c) => {
              if (!primaryCols.includes(c)) {
                primaryCols.unshift(c);
              }
            });
          }
          bigIncrementsCols = this._getBigIncrementsColumnNames();
          if (bigIncrementsCols) {
            bigIncrementsCols.forEach((c) => {
              if (!primaryCols.includes(c)) {
                primaryCols.unshift(c);
              }
            });
          }
        }
        if (this.method !== "create" && this.method !== "createIfNot") {
          this.pushQuery(
            `alter table ${this.tableName()} add primary key ${constraintName}(${this.formatter.columnize(
              primaryCols
            )})`
          );
        }
        if (incrementsCols.length) {
          this.pushQuery(
            `alter table ${this.tableName()} modify column ${this.formatter.columnize(
              incrementsCols
            )} int unsigned not null auto_increment`
          );
        }
        if (bigIncrementsCols.length) {
          this.pushQuery(
            `alter table ${this.tableName()} modify column ${this.formatter.columnize(
              bigIncrementsCols
            )} bigint unsigned not null auto_increment`
          );
        }
      }
      unique(columns, indexName) {
        let storageEngineIndexType;
        let deferrable;
        if (isObject(indexName)) {
          ({ indexName, deferrable, storageEngineIndexType } = indexName);
        }
        if (deferrable && deferrable !== "not deferrable") {
          this.client.logger.warn(
            `mysql: unique index \`${indexName}\` will not be deferrable ${deferrable} because mysql does not support deferred constraints.`
          );
        }
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        storageEngineIndexType = storageEngineIndexType ? ` using ${storageEngineIndexType}` : "";
        this.pushQuery(
          `alter table ${this.tableName()} add unique ${indexName}(${this.formatter.columnize(
            columns
          )})${storageEngineIndexType}`
        );
      }
      // Compile a drop index command.
      dropIndex(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
      }
      // Compile a drop foreign key command.
      dropForeign(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
        this.pushQuery(
          `alter table ${this.tableName()} drop foreign key ${indexName}`
        );
      }
      // Compile a drop primary key command.
      dropPrimary() {
        this.pushQuery(`alter table ${this.tableName()} drop primary key`);
      }
      // Compile a drop unique key command.
      dropUnique(column, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, column);
        this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
      }
    };
    TableCompiler_MySQL.prototype.addColumnsPrefix = "add ";
    TableCompiler_MySQL.prototype.alterColumnsPrefix = "modify ";
    TableCompiler_MySQL.prototype.dropColumnPrefix = "drop ";
    module2.exports = TableCompiler_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/schema/mysql-columncompiler.js
var require_mysql_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/mysql/schema/mysql-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler = require_columncompiler();
    var { isObject } = require_is();
    var { toNumber } = require_helpers();
    var commentEscapeRegex = /(?<!\\)'/g;
    var ColumnCompiler_MySQL = class extends ColumnCompiler {
      constructor(client, tableCompiler, columnBuilder) {
        super(client, tableCompiler, columnBuilder);
        this.modifiers = [
          "unsigned",
          "nullable",
          "defaultTo",
          "comment",
          "collate",
          "first",
          "after"
        ];
        this._addCheckModifiers();
      }
      // Types
      // ------
      double(precision, scale) {
        if (!precision) return "double";
        return `double(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
      }
      integer(length) {
        length = length ? `(${toNumber(length, 11)})` : "";
        return `int${length}`;
      }
      tinyint(length) {
        length = length ? `(${toNumber(length, 1)})` : "";
        return `tinyint${length}`;
      }
      text(column) {
        switch (column) {
          case "medium":
          case "mediumtext":
            return "mediumtext";
          case "long":
          case "longtext":
            return "longtext";
          default:
            return "text";
        }
      }
      mediumtext() {
        return this.text("medium");
      }
      longtext() {
        return this.text("long");
      }
      enu(allowed) {
        return `enum('${allowed.join("', '")}')`;
      }
      datetime(precision) {
        if (isObject(precision)) {
          ({ precision } = precision);
        }
        return typeof precision === "number" ? `datetime(${precision})` : "datetime";
      }
      timestamp(precision) {
        if (isObject(precision)) {
          ({ precision } = precision);
        }
        return typeof precision === "number" ? `timestamp(${precision})` : "timestamp";
      }
      time(precision) {
        if (isObject(precision)) {
          ({ precision } = precision);
        }
        return typeof precision === "number" ? `time(${precision})` : "time";
      }
      bit(length) {
        return length ? `bit(${toNumber(length)})` : "bit";
      }
      binary(length) {
        return length ? `varbinary(${toNumber(length)})` : "blob";
      }
      json() {
        return "json";
      }
      jsonb() {
        return "json";
      }
      // Modifiers
      // ------
      defaultTo(value) {
        if (value === null || value === void 0) {
          return;
        }
        if ((this.type === "json" || this.type === "jsonb") && isObject(value)) {
          return `default ('${JSON.stringify(value)}')`;
        }
        const defaultVal = super.defaultTo.apply(this, arguments);
        if (this.type !== "blob" && this.type.indexOf("text") === -1) {
          return defaultVal;
        }
        return "";
      }
      unsigned() {
        return "unsigned";
      }
      comment(comment) {
        if (comment && comment.length > 255) {
          this.client.logger.warn(
            "Your comment is longer than the max comment length for MySQL"
          );
        }
        return comment && `comment '${comment.replace(commentEscapeRegex, "\\'")}'`;
      }
      first() {
        return "first";
      }
      after(column) {
        return `after ${this.formatter.wrap(column)}`;
      }
      collate(collation) {
        return collation && `collate '${collation}'`;
      }
      checkRegex(regex, constraintName) {
        return this._check(
          `${this.formatter.wrap(
            this.getColumnName()
          )} REGEXP ${this.client._escapeBinding(regex)}`,
          constraintName
        );
      }
      increments(options = { primaryKey: true }) {
        return "int unsigned not null" + // In MySQL autoincrement are always a primary key. If you already have a primary key, we
        // initialize this column as classic int column then modify it later in table compiler
        (this.tableCompiler._canBeAddPrimaryKey(options) ? " auto_increment primary key" : "");
      }
      bigincrements(options = { primaryKey: true }) {
        return "bigint unsigned not null" + // In MySQL autoincrement are always a primary key. If you already have a primary key, we
        // initialize this column as classic int column then modify it later in table compiler
        (this.tableCompiler._canBeAddPrimaryKey(options) ? " auto_increment primary key" : "");
      }
    };
    ColumnCompiler_MySQL.prototype.bigint = "bigint";
    ColumnCompiler_MySQL.prototype.mediumint = "mediumint";
    ColumnCompiler_MySQL.prototype.smallint = "smallint";
    module2.exports = ColumnCompiler_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/schema/mysql-viewcompiler.js
var require_mysql_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/mysql/schema/mysql-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler = require_viewcompiler();
    var ViewCompiler_MySQL = class extends ViewCompiler {
      constructor(client, viewCompiler) {
        super(client, viewCompiler);
      }
      createOrReplace() {
        this.createQuery(this.columns, this.selectQuery, false, true);
      }
    };
    module2.exports = ViewCompiler_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/schema/mysql-viewbuilder.js
var require_mysql_viewbuilder = __commonJS({
  "node_modules/knex/lib/dialects/mysql/schema/mysql-viewbuilder.js"(exports2, module2) {
    "use strict";
    var ViewBuilder = require_viewbuilder();
    var ViewBuilder_MySQL = class extends ViewBuilder {
      constructor() {
        super(...arguments);
      }
      checkOption() {
        this._single.checkOption = "default_option";
      }
      localCheckOption() {
        this._single.checkOption = "local";
      }
      cascadedCheckOption() {
        this._single.checkOption = "cascaded";
      }
    };
    module2.exports = ViewBuilder_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql/index.js
var require_mysql = __commonJS({
  "node_modules/knex/lib/dialects/mysql/index.js"(exports2, module2) {
    "use strict";
    var defer = require_defer();
    var map = require_map();
    var { promisify } = require("util");
    var Client = require_client();
    var Transaction = require_transaction3();
    var QueryBuilder = require_mysql_querybuilder();
    var QueryCompiler = require_mysql_querycompiler();
    var SchemaCompiler = require_mysql_compiler();
    var TableCompiler = require_mysql_tablecompiler();
    var ColumnCompiler = require_mysql_columncompiler();
    var { makeEscape } = require_string();
    var ViewCompiler = require_mysql_viewcompiler();
    var ViewBuilder = require_mysql_viewbuilder();
    var Client_MySQL = class extends Client {
      _driver() {
        return require("mysql");
      }
      queryBuilder() {
        return new QueryBuilder(this);
      }
      queryCompiler(builder, formatter) {
        return new QueryCompiler(this, builder, formatter);
      }
      schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      viewCompiler() {
        return new ViewCompiler(this, ...arguments);
      }
      viewBuilder() {
        return new ViewBuilder(this, ...arguments);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      transaction() {
        return new Transaction(this, ...arguments);
      }
      wrapIdentifierImpl(value) {
        return value !== "*" ? `\`${value.replace(/`/g, "``")}\`` : "*";
      }
      // Get a raw connection, called by the `pool` whenever a new
      // connection needs to be added to the pool.
      acquireRawConnection() {
        return new Promise((resolver, rejecter) => {
          const connection = this.driver.createConnection(this.connectionSettings);
          connection.on("error", (err) => {
            connection.__knex__disposed = err;
          });
          connection.connect((err) => {
            if (err) {
              connection.removeAllListeners();
              return rejecter(err);
            }
            resolver(connection);
          });
        });
      }
      // Used to explicitly close a connection, called internally by the pool
      // when a connection times out or the pool is shutdown.
      async destroyRawConnection(connection) {
        try {
          const end = promisify((cb) => connection.end(cb));
          return await end();
        } catch (err) {
          connection.__knex__disposed = err;
        } finally {
          defer(() => connection.removeAllListeners());
        }
      }
      validateConnection(connection) {
        return connection.state === "connected" || connection.state === "authenticated";
      }
      // Grab a connection, run the query via the MySQL streaming interface,
      // and pass that through to the stream we've sent back to the client.
      _stream(connection, obj, stream, options) {
        if (!obj.sql) throw new Error("The query is empty");
        options = options || {};
        const queryOptions = Object.assign({ sql: obj.sql }, obj.options);
        return new Promise((resolver, rejecter) => {
          stream.on("error", rejecter);
          stream.on("end", resolver);
          const queryStream = connection.query(queryOptions, obj.bindings).stream(options);
          queryStream.on("error", (err) => {
            rejecter(err);
            stream.emit("error", err);
          });
          queryStream.pipe(stream);
        });
      }
      // Runs the query on the specified connection, providing the bindings
      // and any other necessary prep work.
      _query(connection, obj) {
        if (!obj || typeof obj === "string") obj = { sql: obj };
        if (!obj.sql) throw new Error("The query is empty");
        return new Promise(function(resolver, rejecter) {
          if (!obj.sql) {
            resolver();
            return;
          }
          const queryOptions = Object.assign({ sql: obj.sql }, obj.options);
          connection.query(
            queryOptions,
            obj.bindings,
            function(err, rows, fields) {
              if (err) return rejecter(err);
              obj.response = [rows, fields];
              resolver(obj);
            }
          );
        });
      }
      // Process the response as returned from the query.
      processResponse(obj, runner) {
        if (obj == null) return;
        const { response } = obj;
        const { method } = obj;
        const rows = response[0];
        const fields = response[1];
        if (obj.output) return obj.output.call(runner, rows, fields);
        switch (method) {
          case "select":
            return rows;
          case "first":
            return rows[0];
          case "pluck":
            return map(rows, obj.pluck);
          case "insert":
            return [rows.insertId];
          case "del":
          case "update":
          case "counter":
            return rows.affectedRows;
          default:
            return response;
        }
      }
      async cancelQuery(connectionToKill) {
        const conn = await this.acquireRawConnection();
        try {
          return await this._wrappedCancelQueryCall(conn, connectionToKill);
        } finally {
          await this.destroyRawConnection(conn);
          if (conn.__knex__disposed) {
            this.logger.warn(`Connection Error: ${conn.__knex__disposed}`);
          }
        }
      }
      _wrappedCancelQueryCall(conn, connectionToKill) {
        return this._query(conn, {
          sql: "KILL QUERY ?",
          bindings: [connectionToKill.threadId],
          options: {}
        });
      }
    };
    Object.assign(Client_MySQL.prototype, {
      dialect: "mysql",
      driverName: "mysql",
      _escapeBinding: makeEscape(),
      canCancelQuery: true
    });
    module2.exports = Client_MySQL;
  }
});

// node_modules/knex/lib/dialects/mysql2/transaction.js
var require_transaction4 = __commonJS({
  "node_modules/knex/lib/dialects/mysql2/transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    var debug = require_src()("knex:tx");
    var Transaction_MySQL2 = class extends Transaction {
      query(conn, sql, status, value) {
        const t = this;
        const q = this.trxClient.query(conn, sql).catch((err) => {
          if (err.code === "ER_SP_DOES_NOT_EXIST") {
            this.trxClient.logger.warn(
              "Transaction was implicitly committed, do not mix transactions and DDL with MySQL (#805)"
            );
            return;
          }
          status = 2;
          value = err;
          t._completed = true;
          debug("%s error running transaction query", t.txid);
        }).then(function(res) {
          if (status === 1) t._resolver(value);
          if (status === 2) {
            if (value === void 0) {
              if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
                t._resolver();
                return;
              }
              value = new Error(`Transaction rejected with non-error: ${value}`);
            }
            t._rejecter(value);
            return res;
          }
        });
        if (status === 1 || status === 2) {
          t._completed = true;
        }
        return q;
      }
    };
    module2.exports = Transaction_MySQL2;
  }
});

// node_modules/knex/lib/dialects/mysql2/index.js
var require_mysql2 = __commonJS({
  "node_modules/knex/lib/dialects/mysql2/index.js"(exports2, module2) {
    "use strict";
    var Client_MySQL = require_mysql();
    var Transaction = require_transaction4();
    var Client_MySQL2 = class extends Client_MySQL {
      transaction() {
        return new Transaction(this, ...arguments);
      }
      _driver() {
        return require("mysql2");
      }
      initializeDriver() {
        try {
          this.driver = this._driver();
        } catch (e) {
          let message = `Knex: run
$ npm install ${this.driverName}`;
          const nodeMajorVersion = process.version.replace(/^v/, "").split(".")[0];
          if (nodeMajorVersion <= 12) {
            message += `@3.2.0`;
            this.logger.error(
              "Mysql2 version 3.2.0 is the latest version to support Node.js 12 or lower."
            );
          }
          message += ` --save`;
          this.logger.error(`${message}
${e.message}
${e.stack}`);
          throw new Error(`${message}
${e.message}`);
        }
      }
      validateConnection(connection) {
        return connection && !connection._fatalError && !connection._protocolError && !connection._closing && !connection.stream.destroyed;
      }
    };
    Object.assign(Client_MySQL2.prototype, {
      // The "dialect", for reference elsewhere.
      driverName: "mysql2"
    });
    module2.exports = Client_MySQL2;
  }
});

// node_modules/knex/lib/dialects/oracle/utils.js
var require_utils3 = __commonJS({
  "node_modules/knex/lib/dialects/oracle/utils.js"(exports2, module2) {
    "use strict";
    var NameHelper = class {
      constructor(oracleVersion) {
        this.oracleVersion = oracleVersion;
        const versionParts = oracleVersion.split(".").map((versionPart) => parseInt(versionPart));
        if (versionParts[0] > 12 || versionParts[0] === 12 && versionParts[1] >= 2) {
          this.limit = 128;
        } else {
          this.limit = 30;
        }
      }
      generateCombinedName(logger, postfix, name, subNames) {
        const crypto = require("crypto");
        if (!Array.isArray(subNames)) subNames = subNames ? [subNames] : [];
        const table = name.replace(/\.|-/g, "_");
        const subNamesPart = subNames.join("_");
        let result = `${table}_${subNamesPart.length ? subNamesPart + "_" : ""}${postfix}`.toLowerCase();
        if (result.length > this.limit) {
          logger.warn(
            `Automatically generated name "${result}" exceeds ${this.limit} character limit for Oracle Database ${this.oracleVersion}. Using base64 encoded sha1 of that name instead.`
          );
          result = crypto.createHash("sha1").update(result).digest("base64").replace("=", "");
        }
        return result;
      }
    };
    function wrapSqlWithCatch(sql, errorNumberToCatch) {
      return `begin execute immediate '${sql.replace(/'/g, "''")}'; exception when others then if sqlcode != ${errorNumberToCatch} then raise; end if; end;`;
    }
    function ReturningHelper(columnName) {
      this.columnName = columnName;
    }
    ReturningHelper.prototype.toString = function() {
      return `[object ReturningHelper:${this.columnName}]`;
    };
    function isConnectionError(err) {
      return [
        "DPI-1010",
        // not connected
        "DPI-1080",
        // connection was closed by ORA-%d
        "ORA-03114",
        // not connected to ORACLE
        "ORA-03113",
        // end-of-file on communication channel
        "ORA-03135",
        // connection lost contact
        "ORA-12514",
        // listener does not currently know of service requested in connect descriptor
        "ORA-00022",
        // invalid session ID; access denied
        "ORA-00028",
        // your session has been killed
        "ORA-00031",
        // your session has been marked for kill
        "ORA-00045",
        // your session has been terminated with no replay
        "ORA-00378",
        // buffer pools cannot be created as specified
        "ORA-00602",
        // internal programming exception
        "ORA-00603",
        // ORACLE server session terminated by fatal error
        "ORA-00609",
        // could not attach to incoming connection
        "ORA-01012",
        // not logged on
        "ORA-01041",
        // internal error. hostdef extension doesn't exist
        "ORA-01043",
        // user side memory corruption
        "ORA-01089",
        // immediate shutdown or close in progress
        "ORA-01092",
        // ORACLE instance terminated. Disconnection forced
        "ORA-02396",
        // exceeded maximum idle time, please connect again
        "ORA-03122",
        // attempt to close ORACLE-side window on user side
        "ORA-12153",
        // TNS'not connected
        "ORA-12537",
        // TNS'connection closed
        "ORA-12547",
        // TNS'lost contact
        "ORA-12570",
        // TNS'packet reader failure
        "ORA-12583",
        // TNS'no reader
        "ORA-27146",
        // post/wait initialization failed
        "ORA-28511",
        // lost RPC connection
        "ORA-56600",
        // an illegal OCI function call was issued
        "NJS-024",
        "NJS-003"
      ].some(function(prefix) {
        return err.message.indexOf(prefix) === 0;
      });
    }
    module2.exports = {
      NameHelper,
      isConnectionError,
      wrapSqlWithCatch,
      ReturningHelper
    };
  }
});

// node_modules/knex/lib/dialects/oracle/schema/internal/trigger.js
var require_trigger = __commonJS({
  "node_modules/knex/lib/dialects/oracle/schema/internal/trigger.js"(exports2, module2) {
    "use strict";
    var { NameHelper } = require_utils3();
    var Trigger = class {
      constructor(oracleVersion) {
        this.nameHelper = new NameHelper(oracleVersion);
      }
      renameColumnTrigger(logger, tableName, columnName, to) {
        const triggerName = this.nameHelper.generateCombinedName(
          logger,
          "autoinc_trg",
          tableName
        );
        const sequenceName = this.nameHelper.generateCombinedName(
          logger,
          "seq",
          tableName
        );
        return `DECLARE PK_NAME VARCHAR(200); IS_AUTOINC NUMBER := 0; BEGIN  EXECUTE IMMEDIATE ('ALTER TABLE "${tableName}" RENAME COLUMN "${columnName}" TO "${to}"');  SELECT COUNT(*) INTO IS_AUTOINC from "USER_TRIGGERS" where trigger_name = '${triggerName}';  IF (IS_AUTOINC > 0) THEN    SELECT cols.column_name INTO PK_NAME    FROM all_constraints cons, all_cons_columns cols    WHERE cons.constraint_type = 'P'    AND cons.constraint_name = cols.constraint_name    AND cons.owner = cols.owner    AND cols.table_name = '${tableName}';    IF ('${to}' = PK_NAME) THEN      EXECUTE IMMEDIATE ('DROP TRIGGER "${triggerName}"');      EXECUTE IMMEDIATE ('create or replace trigger "${triggerName}"      BEFORE INSERT on "${tableName}" for each row        declare        checking number := 1;        begin          if (:new."${to}" is null) then            while checking >= 1 loop              select "${sequenceName}".nextval into :new."${to}" from dual;              select count("${to}") into checking from "${tableName}"              where "${to}" = :new."${to}";            end loop;          end if;        end;');    end if;  end if;END;`;
      }
      createAutoIncrementTrigger(logger, tableName, schemaName) {
        const tableQuoted = `"${tableName}"`;
        const tableUnquoted = tableName;
        const schemaQuoted = schemaName ? `"${schemaName}".` : "";
        const constraintOwner = schemaName ? `'${schemaName}'` : "cols.owner";
        const triggerName = this.nameHelper.generateCombinedName(
          logger,
          "autoinc_trg",
          tableName
        );
        const sequenceNameUnquoted = this.nameHelper.generateCombinedName(
          logger,
          "seq",
          tableName
        );
        const sequenceNameQuoted = `"${sequenceNameUnquoted}"`;
        return `DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE ${schemaQuoted}${sequenceNameQuoted}');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = ${constraintOwner}  AND cols.table_name = '${tableUnquoted}';  execute immediate ('create or replace trigger ${schemaQuoted}"${triggerName}"  BEFORE INSERT on ${schemaQuoted}${tableQuoted}  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select ${schemaQuoted}${sequenceNameQuoted}.nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from ${schemaQuoted}${tableQuoted}        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END;`;
      }
      renameTableAndAutoIncrementTrigger(logger, tableName, to) {
        const triggerName = this.nameHelper.generateCombinedName(
          logger,
          "autoinc_trg",
          tableName
        );
        const sequenceName = this.nameHelper.generateCombinedName(
          logger,
          "seq",
          tableName
        );
        const toTriggerName = this.nameHelper.generateCombinedName(
          logger,
          "autoinc_trg",
          to
        );
        const toSequenceName = this.nameHelper.generateCombinedName(
          logger,
          "seq",
          to
        );
        return `DECLARE PK_NAME VARCHAR(200); IS_AUTOINC NUMBER := 0; BEGIN  EXECUTE IMMEDIATE ('RENAME "${tableName}" TO "${to}"');  SELECT COUNT(*) INTO IS_AUTOINC from "USER_TRIGGERS" where trigger_name = '${triggerName}';  IF (IS_AUTOINC > 0) THEN    EXECUTE IMMEDIATE ('DROP TRIGGER "${triggerName}"');    EXECUTE IMMEDIATE ('RENAME "${sequenceName}" TO "${toSequenceName}"');    SELECT cols.column_name INTO PK_NAME    FROM all_constraints cons, all_cons_columns cols    WHERE cons.constraint_type = 'P'    AND cons.constraint_name = cols.constraint_name    AND cons.owner = cols.owner    AND cols.table_name = '${to}';    EXECUTE IMMEDIATE ('create or replace trigger "${toTriggerName}"    BEFORE INSERT on "${to}" for each row      declare      checking number := 1;      begin        if (:new."' || PK_NAME || '" is null) then          while checking >= 1 loop            select "${toSequenceName}".nextval into :new."' || PK_NAME || '" from dual;            select count("' || PK_NAME || '") into checking from "${to}"            where "' || PK_NAME || '" = :new."' || PK_NAME || '";          end loop;        end if;      end;');  end if;END;`;
      }
    };
    module2.exports = Trigger;
  }
});

// node_modules/knex/lib/dialects/oracle/schema/oracle-compiler.js
var require_oracle_compiler = __commonJS({
  "node_modules/knex/lib/dialects/oracle/schema/oracle-compiler.js"(exports2, module2) {
    "use strict";
    var SchemaCompiler = require_compiler();
    var utils = require_utils3();
    var Trigger = require_trigger();
    var SchemaCompiler_Oracle = class extends SchemaCompiler {
      constructor() {
        super(...arguments);
      }
      // Rename a table on the schema.
      renameTable(tableName, to) {
        const trigger = new Trigger(this.client.version);
        const renameTable = trigger.renameTableAndAutoIncrementTrigger(
          this.client.logger,
          tableName,
          to
        );
        this.pushQuery(renameTable);
      }
      // Check whether a table exists on the query.
      hasTable(tableName) {
        this.pushQuery({
          sql: "select TABLE_NAME from USER_TABLES where TABLE_NAME = " + this.client.parameter(tableName, this.builder, this.bindingsHolder),
          output(resp) {
            return resp.length > 0;
          }
        });
      }
      // Check whether a column exists on the schema.
      hasColumn(tableName, column) {
        const sql = `select COLUMN_NAME from ALL_TAB_COLUMNS where TABLE_NAME = ${this.client.parameter(
          tableName,
          this.builder,
          this.bindingsHolder
        )} and COLUMN_NAME = ${this.client.parameter(
          column,
          this.builder,
          this.bindingsHolder
        )}`;
        this.pushQuery({ sql, output: (resp) => resp.length > 0 });
      }
      dropSequenceIfExists(sequenceName) {
        const prefix = this.schema ? `"${this.schema}".` : "";
        this.pushQuery(
          utils.wrapSqlWithCatch(
            `drop sequence ${prefix}${this.formatter.wrap(sequenceName)}`,
            -2289
          )
        );
      }
      _dropRelatedSequenceIfExists(tableName) {
        const nameHelper = new utils.NameHelper(this.client.version);
        const sequenceName = nameHelper.generateCombinedName(
          this.client.logger,
          "seq",
          tableName
        );
        this.dropSequenceIfExists(sequenceName);
      }
      dropTable(tableName) {
        const prefix = this.schema ? `"${this.schema}".` : "";
        this.pushQuery(`drop table ${prefix}${this.formatter.wrap(tableName)}`);
        this._dropRelatedSequenceIfExists(tableName);
      }
      dropTableIfExists(tableName) {
        this.dropObject(tableName, "table");
      }
      dropViewIfExists(viewName) {
        this.dropObject(viewName, "view");
      }
      dropObject(objectName, type) {
        const prefix = this.schema ? `"${this.schema}".` : "";
        let errorCode = -942;
        if (type === "materialized view") {
          errorCode = -12003;
        }
        this.pushQuery(
          utils.wrapSqlWithCatch(
            `drop ${type} ${prefix}${this.formatter.wrap(objectName)}`,
            errorCode
          )
        );
        this._dropRelatedSequenceIfExists(objectName);
      }
      refreshMaterializedView(viewName) {
        return this.pushQuery({
          sql: `BEGIN DBMS_MVIEW.REFRESH('${this.schemaNameRaw ? this.schemaNameRaw + "." : ""}${viewName}'); END;`
        });
      }
      dropMaterializedView(viewName) {
        this._dropView(viewName, false, true);
      }
      dropMaterializedViewIfExists(viewName) {
        this.dropObject(viewName, "materialized view");
      }
    };
    module2.exports = SchemaCompiler_Oracle;
  }
});

// node_modules/knex/lib/dialects/oracle/schema/oracle-columnbuilder.js
var require_oracle_columnbuilder = __commonJS({
  "node_modules/knex/lib/dialects/oracle/schema/oracle-columnbuilder.js"(exports2, module2) {
    "use strict";
    var ColumnBuilder = require_columnbuilder();
    var toArray = require_toArray();
    var ColumnBuilder_Oracle = class extends ColumnBuilder {
      constructor() {
        super(...arguments);
      }
      // checkIn added to the builder to allow the column compiler to change the
      // order via the modifiers ("check" must be after "default")
      checkIn() {
        this._modifiers.checkIn = toArray(arguments);
        return this;
      }
    };
    module2.exports = ColumnBuilder_Oracle;
  }
});

// node_modules/lodash/noop.js
var require_noop2 = __commonJS({
  "node_modules/lodash/noop.js"(exports2, module2) {
    "use strict";
    function noop() {
    }
    module2.exports = noop;
  }
});

// node_modules/lodash/_createSet.js
var require_createSet = __commonJS({
  "node_modules/lodash/_createSet.js"(exports2, module2) {
    "use strict";
    var Set2 = require_Set();
    var noop = require_noop2();
    var setToArray = require_setToArray();
    var INFINITY = 1 / 0;
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    module2.exports = createSet;
  }
});

// node_modules/lodash/_baseUniq.js
var require_baseUniq = __commonJS({
  "node_modules/lodash/_baseUniq.js"(exports2, module2) {
    "use strict";
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var cacheHas = require_cacheHas();
    var createSet = require_createSet();
    var setToArray = require_setToArray();
    var LARGE_ARRAY_SIZE = 200;
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    module2.exports = baseUniq;
  }
});

// node_modules/lodash/uniq.js
var require_uniq = __commonJS({
  "node_modules/lodash/uniq.js"(exports2, module2) {
    "use strict";
    var baseUniq = require_baseUniq();
    function uniq(array) {
      return array && array.length ? baseUniq(array) : [];
    }
    module2.exports = uniq;
  }
});

// node_modules/knex/lib/dialects/oracle/schema/internal/incrementUtils.js
var require_incrementUtils = __commonJS({
  "node_modules/knex/lib/dialects/oracle/schema/internal/incrementUtils.js"(exports2, module2) {
    "use strict";
    var Trigger = require_trigger();
    function createAutoIncrementTriggerAndSequence(columnCompiler) {
      const trigger = new Trigger(columnCompiler.client.version);
      columnCompiler.pushAdditional(function() {
        const tableName = this.tableCompiler.tableNameRaw;
        const schemaName = this.tableCompiler.schemaNameRaw;
        const createTriggerSQL = trigger.createAutoIncrementTrigger(
          this.client.logger,
          tableName,
          schemaName
        );
        this.pushQuery(createTriggerSQL);
      });
    }
    module2.exports = {
      createAutoIncrementTriggerAndSequence
    };
  }
});

// node_modules/knex/lib/dialects/oracle/schema/oracle-columncompiler.js
var require_oracle_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracle/schema/oracle-columncompiler.js"(exports2, module2) {
    "use strict";
    var uniq = require_uniq();
    var Raw = require_raw();
    var ColumnCompiler = require_columncompiler();
    var {
      createAutoIncrementTriggerAndSequence
    } = require_incrementUtils();
    var { toNumber } = require_helpers();
    var ColumnCompiler_Oracle = class extends ColumnCompiler {
      constructor() {
        super(...arguments);
        this.modifiers = ["defaultTo", "checkIn", "nullable", "comment"];
      }
      increments(options = { primaryKey: true }) {
        createAutoIncrementTriggerAndSequence(this);
        return "integer not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
      bigincrements(options = { primaryKey: true }) {
        createAutoIncrementTriggerAndSequence(this);
        return "number(20, 0) not null" + (this.tableCompiler._canBeAddPrimaryKey(options) ? " primary key" : "");
      }
      floating(precision) {
        const parsedPrecision = toNumber(precision, 0);
        return `float${parsedPrecision ? `(${parsedPrecision})` : ""}`;
      }
      double(precision, scale) {
        return `number(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
      }
      decimal(precision, scale) {
        if (precision === null) return "decimal";
        return `decimal(${toNumber(precision, 8)}, ${toNumber(scale, 2)})`;
      }
      integer(length) {
        return length ? `number(${toNumber(length, 11)})` : "integer";
      }
      enu(allowed) {
        allowed = uniq(allowed);
        const maxLength = (allowed || []).reduce(
          (maxLength2, name) => Math.max(maxLength2, String(name).length),
          1
        );
        this.columnBuilder._modifiers.checkIn = [allowed];
        return `varchar2(${maxLength})`;
      }
      datetime(without) {
        return without ? "timestamp" : "timestamp with time zone";
      }
      timestamp(without) {
        return without ? "timestamp" : "timestamp with time zone";
      }
      bool() {
        this.columnBuilder._modifiers.checkIn = [[0, 1]];
        return "number(1, 0)";
      }
      varchar(length) {
        return `varchar2(${toNumber(length, 255)})`;
      }
      // Modifiers
      // ------
      comment(comment) {
        const columnName = this.args[0] || this.defaults("columnName");
        this.pushAdditional(function() {
          this.pushQuery(
            `comment on column ${this.tableCompiler.tableName()}.` + this.formatter.wrap(columnName) + " is '" + (comment || "") + "'"
          );
        }, comment);
      }
      checkIn(value) {
        if (value === void 0) {
          return "";
        } else if (value instanceof Raw) {
          value = value.toQuery();
        } else if (Array.isArray(value)) {
          value = value.map((v) => `'${v}'`).join(", ");
        } else {
          value = `'${value}'`;
        }
        return `check (${this.formatter.wrap(this.args[0])} in (${value}))`;
      }
    };
    ColumnCompiler_Oracle.prototype.tinyint = "smallint";
    ColumnCompiler_Oracle.prototype.smallint = "smallint";
    ColumnCompiler_Oracle.prototype.mediumint = "integer";
    ColumnCompiler_Oracle.prototype.biginteger = "number(20, 0)";
    ColumnCompiler_Oracle.prototype.text = "clob";
    ColumnCompiler_Oracle.prototype.time = "timestamp with time zone";
    ColumnCompiler_Oracle.prototype.bit = "clob";
    ColumnCompiler_Oracle.prototype.json = "clob";
    module2.exports = ColumnCompiler_Oracle;
  }
});

// node_modules/knex/lib/dialects/oracle/schema/oracle-tablecompiler.js
var require_oracle_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracle/schema/oracle-tablecompiler.js"(exports2, module2) {
    "use strict";
    var utils = require_utils3();
    var TableCompiler = require_tablecompiler();
    var helpers = require_helpers();
    var Trigger = require_trigger();
    var { isObject } = require_is();
    var TableCompiler_Oracle = class extends TableCompiler {
      constructor() {
        super(...arguments);
      }
      addColumns(columns, prefix) {
        if (columns.sql.length > 0) {
          prefix = prefix || this.addColumnsPrefix;
          const columnSql = columns.sql;
          const alter = this.lowerCase ? "alter table " : "ALTER TABLE ";
          let sql = `${alter}${this.tableName()} ${prefix}`;
          if (columns.sql.length > 1) {
            sql += `(${columnSql.join(", ")})`;
          } else {
            sql += columnSql.join(", ");
          }
          this.pushQuery({
            sql,
            bindings: columns.bindings
          });
        }
      }
      // Compile a rename column command.
      renameColumn(from, to) {
        const tableName = this.tableName().slice(1, -1);
        const trigger = new Trigger(this.client.version);
        return this.pushQuery(
          trigger.renameColumnTrigger(this.client.logger, tableName, from, to)
        );
      }
      compileAdd(builder) {
        const table = this.formatter.wrap(builder);
        const columns = this.prefixArray("add column", this.getColumns(builder));
        return this.pushQuery({
          sql: `alter table ${table} ${columns.join(", ")}`
        });
      }
      // Adds the "create" query to the query sequence.
      createQuery(columns, ifNot, like) {
        const columnsSql = like && this.tableNameLike() ? " as (select * from " + this.tableNameLike() + " where 0=1)" : " (" + columns.sql.join(", ") + this._addChecks() + ")";
        const sql = `create table ${this.tableName()}${columnsSql}`;
        this.pushQuery({
          // catch "name is already used by an existing object" for workaround for "if not exists"
          sql: ifNot ? utils.wrapSqlWithCatch(sql, -955) : sql,
          bindings: columns.bindings
        });
        if (this.single.comment) this.comment(this.single.comment);
        if (like) {
          this.addColumns(columns, this.addColumnsPrefix);
        }
      }
      // Compiles the comment on the table.
      comment(comment) {
        this.pushQuery(`comment on table ${this.tableName()} is '${comment}'`);
      }
      dropColumn() {
        const columns = helpers.normalizeArr.apply(null, arguments);
        this.pushQuery(
          `alter table ${this.tableName()} drop (${this.formatter.columnize(
            columns
          )})`
        );
      }
      _indexCommand(type, tableName, columns) {
        const nameHelper = new utils.NameHelper(this.client.version);
        return this.formatter.wrap(
          nameHelper.generateCombinedName(
            this.client.logger,
            type,
            tableName,
            columns
          )
        );
      }
      primary(columns, constraintName) {
        let deferrable;
        if (isObject(constraintName)) {
          ({ constraintName, deferrable } = constraintName);
        }
        deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
        const primaryCols = columns;
        let incrementsCols = [];
        if (this.grouped.columns) {
          incrementsCols = this._getIncrementsColumnNames();
          if (incrementsCols) {
            incrementsCols.forEach((c) => {
              if (!primaryCols.includes(c)) {
                primaryCols.unshift(c);
              }
            });
          }
        }
        this.pushQuery(
          `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
            primaryCols
          )})${deferrable}`
        );
      }
      dropPrimary(constraintName) {
        constraintName = constraintName ? this.formatter.wrap(constraintName) : this.formatter.wrap(this.tableNameRaw + "_pkey");
        this.pushQuery(
          `alter table ${this.tableName()} drop constraint ${constraintName}`
        );
      }
      index(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        this.pushQuery(
          `create index ${indexName} on ${this.tableName()} (` + this.formatter.columnize(columns) + ")"
        );
      }
      dropIndex(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("index", this.tableNameRaw, columns);
        this.pushQuery(`drop index ${indexName}`);
      }
      unique(columns, indexName) {
        let deferrable;
        if (isObject(indexName)) {
          ({ indexName, deferrable } = indexName);
        }
        deferrable = deferrable ? ` deferrable initially ${deferrable}` : "";
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        this.pushQuery(
          `alter table ${this.tableName()} add constraint ${indexName} unique (` + this.formatter.columnize(columns) + ")" + deferrable
        );
      }
      dropUnique(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("unique", this.tableNameRaw, columns);
        this.pushQuery(
          `alter table ${this.tableName()} drop constraint ${indexName}`
        );
      }
      dropForeign(columns, indexName) {
        indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand("foreign", this.tableNameRaw, columns);
        this.pushQuery(
          `alter table ${this.tableName()} drop constraint ${indexName}`
        );
      }
    };
    TableCompiler_Oracle.prototype.addColumnsPrefix = "add ";
    TableCompiler_Oracle.prototype.alterColumnsPrefix = "modify ";
    module2.exports = TableCompiler_Oracle;
  }
});

// node_modules/knex/lib/dialects/oracle/index.js
var require_oracle = __commonJS({
  "node_modules/knex/lib/dialects/oracle/index.js"(exports2, module2) {
    "use strict";
    var { ReturningHelper } = require_utils3();
    var { isConnectionError } = require_utils3();
    var Client = require_client();
    var SchemaCompiler = require_oracle_compiler();
    var ColumnBuilder = require_oracle_columnbuilder();
    var ColumnCompiler = require_oracle_columncompiler();
    var TableCompiler = require_oracle_tablecompiler();
    var Client_Oracle = class extends Client {
      schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
      }
      columnBuilder() {
        return new ColumnBuilder(this, ...arguments);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      // Return the database for the Oracle client.
      database() {
        return this.connectionSettings.database;
      }
      // Position the bindings for the query.
      positionBindings(sql) {
        let questionCount = 0;
        return sql.replace(/\?/g, function() {
          questionCount += 1;
          return `:${questionCount}`;
        });
      }
      _stream(connection, obj, stream, options) {
        if (!obj.sql) throw new Error("The query is empty");
        return new Promise(function(resolver, rejecter) {
          stream.on("error", (err) => {
            if (isConnectionError(err)) {
              connection.__knex__disposed = err;
            }
            rejecter(err);
          });
          stream.on("end", resolver);
          const queryStream = connection.queryStream(
            obj.sql,
            obj.bindings,
            options
          );
          queryStream.pipe(stream);
          queryStream.on("error", function(error) {
            rejecter(error);
            stream.emit("error", error);
          });
        });
      }
      // Formatter part
      alias(first, second) {
        return first + " " + second;
      }
      parameter(value, builder, formatter) {
        if (value instanceof ReturningHelper && this.driver) {
          value = new this.driver.OutParam(this.driver.OCCISTRING);
        } else if (typeof value === "boolean") {
          value = value ? 1 : 0;
        }
        return super.parameter(value, builder, formatter);
      }
    };
    Object.assign(Client_Oracle.prototype, {
      dialect: "oracle",
      driverName: "oracle"
    });
    module2.exports = Client_Oracle;
  }
});

// node_modules/knex/lib/dialects/oracle/query/oracle-querycompiler.js
var require_oracle_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracle/query/oracle-querycompiler.js"(exports2, module2) {
    "use strict";
    var compact = require_compact();
    var identity = require_identity();
    var isEmpty = require_isEmpty();
    var isPlainObject = require_isPlainObject();
    var reduce = require_reduce();
    var QueryCompiler = require_querycompiler();
    var { ReturningHelper } = require_utils3();
    var { isString } = require_is();
    var components = [
      "comments",
      "columns",
      "join",
      "where",
      "union",
      "group",
      "having",
      "order",
      "lock"
    ];
    var QueryCompiler_Oracle = class extends QueryCompiler {
      constructor(client, builder, formatter) {
        super(client, builder, formatter);
        const { onConflict } = this.single;
        if (onConflict) {
          throw new Error(".onConflict() is not supported for oracledb.");
        }
        this.first = this.select;
      }
      // Compiles an "insert" query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        let insertValues = this.single.insert || [];
        let { returning } = this.single;
        if (!Array.isArray(insertValues) && isPlainObject(this.single.insert)) {
          insertValues = [this.single.insert];
        }
        if (returning && !Array.isArray(returning)) {
          returning = [returning];
        }
        if (Array.isArray(insertValues) && insertValues.length === 1 && isEmpty(insertValues[0])) {
          return this._addReturningToSqlAndConvert(
            `insert into ${this.tableName} (${this.formatter.wrap(
              this.single.returning
            )}) values (default)`,
            returning,
            this.tableName
          );
        }
        if (isEmpty(this.single.insert) && typeof this.single.insert !== "function") {
          return "";
        }
        const insertData = this._prepInsert(insertValues);
        const sql = {};
        if (isString(insertData)) {
          return this._addReturningToSqlAndConvert(
            `insert into ${this.tableName} ${insertData}`,
            returning
          );
        }
        if (insertData.values.length === 1) {
          return this._addReturningToSqlAndConvert(
            `insert into ${this.tableName} (${this.formatter.columnize(
              insertData.columns
            )}) values (${this.client.parameterize(
              insertData.values[0],
              void 0,
              this.builder,
              this.bindingsHolder
            )})`,
            returning,
            this.tableName
          );
        }
        const insertDefaultsOnly = insertData.columns.length === 0;
        sql.sql = "begin " + insertData.values.map((value) => {
          let returningHelper;
          const parameterizedValues = !insertDefaultsOnly ? this.client.parameterize(
            value,
            this.client.valueForUndefined,
            this.builder,
            this.bindingsHolder
          ) : "";
          const returningValues = Array.isArray(returning) ? returning : [returning];
          let subSql = `insert into ${this.tableName} `;
          if (returning) {
            returningHelper = new ReturningHelper(returningValues.join(":"));
            sql.outParams = (sql.outParams || []).concat(returningHelper);
          }
          if (insertDefaultsOnly) {
            subSql += `(${this.formatter.wrap(
              this.single.returning
            )}) values (default)`;
          } else {
            subSql += `(${this.formatter.columnize(
              insertData.columns
            )}) values (${parameterizedValues})`;
          }
          subSql += returning ? ` returning ROWID into ${this.client.parameter(
            returningHelper,
            this.builder,
            this.bindingsHolder
          )}` : "";
          subSql = this.formatter.client.positionBindings(subSql);
          const parameterizedValuesWithoutDefault = parameterizedValues.replace("DEFAULT, ", "").replace(", DEFAULT", "");
          return `execute immediate '${subSql.replace(/'/g, "''")}` + (parameterizedValuesWithoutDefault || returning ? "' using " : "") + parameterizedValuesWithoutDefault + (parameterizedValuesWithoutDefault && returning ? ", " : "") + (returning ? "out ?" : "") + ";";
        }).join(" ") + "end;";
        if (returning) {
          sql.returning = returning;
          sql.returningSql = `select ${this.formatter.columnize(returning)} from ` + this.tableName + " where ROWID in (" + sql.outParams.map((v, i) => `:${i + 1}`).join(", ") + ") order by case ROWID " + sql.outParams.map((v, i) => `when CHARTOROWID(:${i + 1}) then ${i}`).join(" ") + " end";
        }
        return sql;
      }
      // Update method, including joins, wheres, order & limits.
      update() {
        const updates = this._prepUpdate(this.single.update);
        const where = this.where();
        let { returning } = this.single;
        const sql = `update ${this.tableName} set ` + updates.join(", ") + (where ? ` ${where}` : "");
        if (!returning) {
          return sql;
        }
        if (!Array.isArray(returning)) {
          returning = [returning];
        }
        return this._addReturningToSqlAndConvert(sql, returning, this.tableName);
      }
      // Compiles a `truncate` query.
      truncate() {
        return `truncate table ${this.tableName}`;
      }
      forUpdate() {
        return "for update";
      }
      forShare() {
        this.client.logger.warn(
          "lock for share is not supported by oracle dialect"
        );
        return "";
      }
      // Compiles a `columnInfo` query.
      columnInfo() {
        const column = this.single.columnInfo;
        const table = this.client.customWrapIdentifier(this.single.table, identity);
        const sql = `select * from xmltable( '/ROWSET/ROW'
      passing dbms_xmlgen.getXMLType('
      select char_col_decl_length, column_name, data_type, data_default, nullable
      from all_tab_columns where table_name = ''${table}'' ')
      columns
      CHAR_COL_DECL_LENGTH number, COLUMN_NAME varchar2(200), DATA_TYPE varchar2(106),
      DATA_DEFAULT clob, NULLABLE varchar2(1))`;
        return {
          sql,
          output(resp) {
            const out = reduce(
              resp,
              function(columns, val) {
                columns[val.COLUMN_NAME] = {
                  type: val.DATA_TYPE,
                  defaultValue: val.DATA_DEFAULT,
                  maxLength: val.CHAR_COL_DECL_LENGTH,
                  nullable: val.NULLABLE === "Y"
                };
                return columns;
              },
              {}
            );
            return column && out[column] || out;
          }
        };
      }
      select() {
        let query = this.with();
        const statements = components.map((component) => {
          return this[component]();
        });
        query += compact(statements).join(" ");
        return this._surroundQueryWithLimitAndOffset(query);
      }
      aggregate(stmt) {
        return this._aggregate(stmt, { aliasSeparator: " " });
      }
      // for single commands only
      _addReturningToSqlAndConvert(sql, returning, tableName) {
        const res = {
          sql
        };
        if (!returning) {
          return res;
        }
        const returningValues = Array.isArray(returning) ? returning : [returning];
        const returningHelper = new ReturningHelper(returningValues.join(":"));
        res.sql = sql + " returning ROWID into " + this.client.parameter(returningHelper, this.builder, this.bindingsHolder);
        res.returningSql = `select ${this.formatter.columnize(
          returning
        )} from ${tableName} where ROWID = :1`;
        res.outParams = [returningHelper];
        res.returning = returning;
        return res;
      }
      _surroundQueryWithLimitAndOffset(query) {
        let { limit } = this.single;
        const { offset } = this.single;
        const hasLimit = limit || limit === 0 || limit === "0";
        limit = +limit;
        if (!hasLimit && !offset) return query;
        query = query || "";
        if (hasLimit && !offset) {
          return `select * from (${query}) where rownum <= ${this._getValueOrParameterFromAttribute(
            "limit",
            limit
          )}`;
        }
        const endRow = +offset + (hasLimit ? limit : 1e13);
        return "select * from (select row_.*, ROWNUM rownum_ from (" + query + ") row_ where rownum <= " + (this.single.skipBinding["offset"] ? endRow : this.client.parameter(endRow, this.builder, this.bindingsHolder)) + ") where rownum_ > " + this._getValueOrParameterFromAttribute("offset", offset);
      }
    };
    module2.exports = QueryCompiler_Oracle;
  }
});

// node_modules/knex/lib/dialects/oracledb/utils.js
var require_utils4 = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/utils.js"(exports2, module2) {
    "use strict";
    var Utils = require_utils3();
    var { promisify } = require("util");
    var stream = require("stream");
    function BlobHelper(columnName, value) {
      this.columnName = columnName;
      this.value = value;
      this.returning = false;
    }
    BlobHelper.prototype.toString = function() {
      return "[object BlobHelper:" + this.columnName + "]";
    };
    function readStream(stream2, type) {
      return new Promise((resolve, reject) => {
        let data = type === "string" ? "" : Buffer.alloc(0);
        stream2.on("error", function(err) {
          reject(err);
        });
        stream2.on("data", function(chunk) {
          if (type === "string") {
            data += chunk;
          } else {
            data = Buffer.concat([data, chunk]);
          }
        });
        stream2.on("end", function() {
          resolve(data);
        });
      });
    }
    var lobProcessing = function(stream2) {
      const oracledb = require("oracledb");
      let type;
      if (stream2.type) {
        if (stream2.type === oracledb.BLOB) {
          type = "buffer";
        } else if (stream2.type === oracledb.CLOB) {
          type = "string";
        }
      } else if (stream2.iLob) {
        if (stream2.iLob.type === oracledb.CLOB) {
          type = "string";
        } else if (stream2.iLob.type === oracledb.BLOB) {
          type = "buffer";
        }
      } else {
        throw new Error("Unrecognized oracledb lob stream type");
      }
      if (type === "string") {
        stream2.setEncoding("utf-8");
      }
      return readStream(stream2, type);
    };
    function monkeyPatchConnection(connection, client) {
      if (connection.executeAsync) {
        return;
      }
      connection.commitAsync = function() {
        return new Promise((commitResolve, commitReject) => {
          this.commit(function(err) {
            if (err) {
              return commitReject(err);
            }
            commitResolve();
          });
        });
      };
      connection.rollbackAsync = function() {
        return new Promise((rollbackResolve, rollbackReject) => {
          this.rollback(function(err) {
            if (err) {
              return rollbackReject(err);
            }
            rollbackResolve();
          });
        });
      };
      const fetchAsync = promisify(function(sql, bindParams, options, cb) {
        options = options || {};
        options.outFormat = client.driver.OUT_FORMAT_OBJECT || client.driver.OBJECT;
        if (!options.outFormat) {
          throw new Error("not found oracledb.outFormat constants");
        }
        if (options.resultSet) {
          connection.execute(
            sql,
            bindParams || [],
            options,
            function(err, result) {
              if (err) {
                if (Utils.isConnectionError(err)) {
                  connection.close().catch(function(err2) {
                  });
                  connection.__knex__disposed = err;
                }
                return cb(err);
              }
              const fetchResult = { rows: [], resultSet: result.resultSet };
              const numRows = 100;
              const fetchRowsFromRS = function(connection2, resultSet, numRows2) {
                resultSet.getRows(numRows2, function(err2, rows) {
                  if (err2) {
                    if (Utils.isConnectionError(err2)) {
                      connection2.close().catch(function(err3) {
                      });
                      connection2.__knex__disposed = err2;
                    }
                    resultSet.close(function() {
                      return cb(err2);
                    });
                  } else if (rows.length === 0) {
                    return cb(null, fetchResult);
                  } else if (rows.length > 0) {
                    if (rows.length === numRows2) {
                      fetchResult.rows = fetchResult.rows.concat(rows);
                      fetchRowsFromRS(connection2, resultSet, numRows2);
                    } else {
                      fetchResult.rows = fetchResult.rows.concat(rows);
                      return cb(null, fetchResult);
                    }
                  }
                });
              };
              fetchRowsFromRS(connection, result.resultSet, numRows);
            }
          );
        } else {
          connection.execute(
            sql,
            bindParams || [],
            options,
            function(err, result) {
              if (err) {
                if (Utils.isConnectionError(err)) {
                  connection.close().catch(function(err2) {
                  });
                  connection.__knex__disposed = err;
                }
                return cb(err);
              }
              return cb(null, result);
            }
          );
        }
      });
      connection.executeAsync = function(sql, bindParams, options) {
        return fetchAsync(sql, bindParams, options).then(async (results) => {
          const closeResultSet = () => {
            return results.resultSet ? promisify(results.resultSet.close).call(results.resultSet) : Promise.resolve();
          };
          const lobs = [];
          if (results.rows) {
            if (Array.isArray(results.rows)) {
              for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows[i];
                for (const column in row) {
                  if (row[column] instanceof stream.Readable) {
                    lobs.push({ index: i, key: column, stream: row[column] });
                  }
                }
              }
            }
          }
          try {
            for (const lob of lobs) {
              results.rows[lob.index][lob.key] = await lobProcessing(lob.stream);
            }
          } catch (e) {
            await closeResultSet().catch(() => {
            });
            throw e;
          }
          await closeResultSet();
          return results;
        });
      };
    }
    Utils.BlobHelper = BlobHelper;
    Utils.monkeyPatchConnection = monkeyPatchConnection;
    module2.exports = Utils;
  }
});

// node_modules/knex/lib/dialects/oracledb/query/oracledb-querycompiler.js
var require_oracledb_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/query/oracledb-querycompiler.js"(exports2, module2) {
    "use strict";
    var clone = require_clone();
    var each = require_each();
    var isEmpty = require_isEmpty();
    var isPlainObject = require_isPlainObject();
    var Oracle_Compiler = require_oracle_querycompiler();
    var ReturningHelper = require_utils4().ReturningHelper;
    var BlobHelper = require_utils4().BlobHelper;
    var { isString } = require_is();
    var {
      columnize: columnize_
    } = require_wrappingFormatter();
    var Oracledb_Compiler = class extends Oracle_Compiler {
      // Compiles an "insert" query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        const self2 = this;
        const outBindPrep = this._prepOutbindings(
          this.single.insert,
          this.single.returning
        );
        const outBinding = outBindPrep.outBinding;
        const returning = outBindPrep.returning;
        const insertValues = outBindPrep.values;
        if (Array.isArray(insertValues) && insertValues.length === 1 && isEmpty(insertValues[0])) {
          const returningFragment = this.single.returning ? " (" + this.formatter.wrap(this.single.returning) + ")" : "";
          return this._addReturningToSqlAndConvert(
            "insert into " + this.tableName + returningFragment + " values (default)",
            outBinding[0],
            this.tableName,
            returning
          );
        }
        if (isEmpty(this.single.insert) && typeof this.single.insert !== "function") {
          return "";
        }
        const insertData = this._prepInsert(insertValues);
        const sql = {};
        if (isString(insertData)) {
          return this._addReturningToSqlAndConvert(
            "insert into " + this.tableName + " " + insertData,
            outBinding[0],
            this.tableName,
            returning
          );
        }
        if (insertData.values.length === 1) {
          return this._addReturningToSqlAndConvert(
            "insert into " + this.tableName + " (" + this.formatter.columnize(insertData.columns) + ") values (" + this.client.parameterize(
              insertData.values[0],
              void 0,
              this.builder,
              this.bindingsHolder
            ) + ")",
            outBinding[0],
            this.tableName,
            returning
          );
        }
        const insertDefaultsOnly = insertData.columns.length === 0;
        sql.returning = returning;
        sql.sql = "begin " + insertData.values.map(function(value, index) {
          const parameterizedValues = !insertDefaultsOnly ? self2.client.parameterize(
            value,
            self2.client.valueForUndefined,
            self2.builder,
            self2.bindingsHolder
          ) : "";
          let subSql = "insert into " + self2.tableName;
          if (insertDefaultsOnly) {
            subSql += " (" + self2.formatter.wrap(self2.single.returning) + ") values (default)";
          } else {
            subSql += " (" + self2.formatter.columnize(insertData.columns) + ") values (" + parameterizedValues + ")";
          }
          let returningClause = "";
          let intoClause = "";
          let usingClause = "";
          let outClause = "";
          each(value, function(val) {
            if (!(val instanceof BlobHelper)) {
              usingClause += " ?,";
            }
          });
          usingClause = usingClause.slice(0, -1);
          outBinding[index].forEach(function(ret) {
            const columnName = ret.columnName || ret;
            returningClause += self2.formatter.wrap(columnName) + ",";
            intoClause += " ?,";
            outClause += " out ?,";
            if (ret instanceof BlobHelper) {
              return self2.formatter.bindings.push(ret);
            }
            self2.formatter.bindings.push(new ReturningHelper(columnName));
          });
          returningClause = returningClause.slice(0, -1);
          intoClause = intoClause.slice(0, -1);
          outClause = outClause.slice(0, -1);
          if (returningClause && intoClause) {
            subSql += " returning " + returningClause + " into" + intoClause;
          }
          subSql = self2.formatter.client.positionBindings(subSql);
          const parameterizedValuesWithoutDefaultAndBlob = parameterizedValues.replace(/DEFAULT, /g, "").replace(/, DEFAULT/g, "").replace("EMPTY_BLOB(), ", "").replace(", EMPTY_BLOB()", "");
          return "execute immediate '" + subSql.replace(/'/g, "''") + (parameterizedValuesWithoutDefaultAndBlob || value ? "' using " : "") + parameterizedValuesWithoutDefaultAndBlob + (parameterizedValuesWithoutDefaultAndBlob && outClause ? "," : "") + outClause + ";";
        }).join(" ") + "end;";
        sql.outBinding = outBinding;
        if (returning[0] === "*") {
          sql.returningSql = function() {
            return "select * from " + self2.tableName + " where ROWID in (" + this.outBinding.map(function(v, i) {
              return ":" + (i + 1);
            }).join(", ") + ") order by case ROWID " + this.outBinding.map(function(v, i) {
              return "when CHARTOROWID(:" + (i + 1) + ") then " + i;
            }).join(" ") + " end";
          };
        }
        return sql;
      }
      with() {
        const undoList = [];
        if (this.grouped.with) {
          for (const stmt of this.grouped.with) {
            if (stmt.recursive) {
              undoList.push(stmt);
              stmt.recursive = false;
            }
          }
        }
        const result = super.with();
        for (const stmt of undoList) {
          stmt.recursive = true;
        }
        return result;
      }
      _addReturningToSqlAndConvert(sql, outBinding, tableName, returning) {
        const self2 = this;
        const res = {
          sql
        };
        if (!outBinding) {
          return res;
        }
        const returningValues = Array.isArray(outBinding) ? outBinding : [outBinding];
        let returningClause = "";
        let intoClause = "";
        returningValues.forEach(function(ret) {
          const columnName = ret.columnName || ret;
          returningClause += self2.formatter.wrap(columnName) + ",";
          intoClause += "?,";
          if (ret instanceof BlobHelper) {
            return self2.formatter.bindings.push(ret);
          }
          self2.formatter.bindings.push(new ReturningHelper(columnName));
        });
        res.sql = sql;
        returningClause = returningClause.slice(0, -1);
        intoClause = intoClause.slice(0, -1);
        if (returningClause && intoClause) {
          res.sql += " returning " + returningClause + " into " + intoClause;
        }
        res.outBinding = [outBinding];
        if (returning[0] === "*") {
          res.returningSql = function() {
            return "select * from " + self2.tableName + " where ROWID = :1";
          };
        }
        res.returning = returning;
        return res;
      }
      _prepOutbindings(paramValues, paramReturning) {
        const result = {};
        let params = paramValues || [];
        let returning = paramReturning || [];
        if (!Array.isArray(params) && isPlainObject(paramValues)) {
          params = [params];
        }
        if (returning && !Array.isArray(returning)) {
          returning = [returning];
        }
        const outBinding = [];
        each(params, function(values, index) {
          if (returning[0] === "*") {
            outBinding[index] = ["ROWID"];
          } else {
            outBinding[index] = clone(returning);
          }
          each(values, function(value, key) {
            if (value instanceof Buffer) {
              values[key] = new BlobHelper(key, value);
              const blobIndex = outBinding[index].indexOf(key);
              if (blobIndex >= 0) {
                outBinding[index].splice(blobIndex, 1);
                values[key].returning = true;
              }
              outBinding[index].push(values[key]);
            }
            if (value === void 0) {
              delete params[index][key];
            }
          });
        });
        result.returning = returning;
        result.outBinding = outBinding;
        result.values = params;
        return result;
      }
      _groupOrder(item, type) {
        return super._groupOrderNulls(item, type);
      }
      update() {
        const self2 = this;
        const sql = {};
        const outBindPrep = this._prepOutbindings(
          this.single.update || this.single.counter,
          this.single.returning
        );
        const outBinding = outBindPrep.outBinding;
        const returning = outBindPrep.returning;
        const updates = this._prepUpdate(this.single.update);
        const where = this.where();
        let returningClause = "";
        let intoClause = "";
        if (isEmpty(updates) && typeof this.single.update !== "function") {
          return "";
        }
        outBinding.forEach(function(out) {
          out.forEach(function(ret) {
            const columnName = ret.columnName || ret;
            returningClause += self2.formatter.wrap(columnName) + ",";
            intoClause += " ?,";
            if (ret instanceof BlobHelper) {
              return self2.formatter.bindings.push(ret);
            }
            self2.formatter.bindings.push(new ReturningHelper(columnName));
          });
        });
        returningClause = returningClause.slice(0, -1);
        intoClause = intoClause.slice(0, -1);
        sql.outBinding = outBinding;
        sql.returning = returning;
        sql.sql = "update " + this.tableName + " set " + updates.join(", ") + (where ? " " + where : "");
        if (outBinding.length && !isEmpty(outBinding[0])) {
          sql.sql += " returning " + returningClause + " into" + intoClause;
        }
        if (returning[0] === "*") {
          sql.returningSql = function() {
            let sql2 = "select * from " + self2.tableName;
            const modifiedRowsCount = this.rowsAffected.length || this.rowsAffected;
            let returningSqlIn = " where ROWID in (";
            let returningSqlOrderBy = ") order by case ROWID ";
            for (let i = 0; i < modifiedRowsCount; i++) {
              if (this.returning[0] === "*") {
                returningSqlIn += ":" + (i + 1) + ", ";
                returningSqlOrderBy += "when CHARTOROWID(:" + (i + 1) + ") then " + i + " ";
              }
            }
            if (this.returning[0] === "*") {
              this.returning = this.returning.slice(0, -1);
              returningSqlIn = returningSqlIn.slice(0, -2);
              returningSqlOrderBy = returningSqlOrderBy.slice(0, -1);
            }
            return sql2 += returningSqlIn + returningSqlOrderBy + " end";
          };
        }
        return sql;
      }
      _jsonPathWrap(extraction) {
        return `'${extraction.path || extraction[1]}'`;
      }
      // Json functions
      jsonExtract(params) {
        return this._jsonExtract(
          params.singleValue ? "json_value" : "json_query",
          params
        );
      }
      jsonSet(params) {
        return `json_transform(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )}, set ${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )} = ${this.client.parameter(
          params.value,
          this.builder,
          this.bindingsHolder
        )})`;
      }
      jsonInsert(params) {
        return `json_transform(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )}, insert ${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )} = ${this.client.parameter(
          params.value,
          this.builder,
          this.bindingsHolder
        )})`;
      }
      jsonRemove(params) {
        const jsonCol = `json_transform(${columnize_(
          params.column,
          this.builder,
          this.client,
          this.bindingsHolder
        )}, remove ${this.client.parameter(
          params.path,
          this.builder,
          this.bindingsHolder
        )})`;
        return params.alias ? this.client.alias(jsonCol, this.formatter.wrap(params.alias)) : jsonCol;
      }
      whereJsonPath(statement) {
        return this._whereJsonPath("json_value", statement);
      }
      whereJsonSupersetOf(statement) {
        throw new Error(
          "Json superset where clause not actually supported by Oracle"
        );
      }
      whereJsonSubsetOf(statement) {
        throw new Error(
          "Json subset where clause not actually supported by Oracle"
        );
      }
      onJsonPathEquals(clause) {
        return this._onJsonPathEquals("json_value", clause);
      }
    };
    module2.exports = Oracledb_Compiler;
  }
});

// node_modules/knex/lib/dialects/oracledb/schema/oracledb-tablecompiler.js
var require_oracledb_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/schema/oracledb-tablecompiler.js"(exports2, module2) {
    "use strict";
    var TableCompiler_Oracle = require_oracle_tablecompiler();
    var TableCompiler_Oracledb = class extends TableCompiler_Oracle {
      constructor(client, tableBuilder) {
        super(client, tableBuilder);
      }
      _setNullableState(column, isNullable) {
        const nullability = isNullable ? "NULL" : "NOT NULL";
        const sql = `alter table ${this.tableName()} modify (${this.formatter.wrap(
          column
        )} ${nullability})`;
        return this.pushQuery({
          sql
        });
      }
    };
    module2.exports = TableCompiler_Oracledb;
  }
});

// node_modules/knex/lib/dialects/oracledb/schema/oracledb-columncompiler.js
var require_oracledb_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/schema/oracledb-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler_Oracle = require_oracle_columncompiler();
    var { isObject } = require_is();
    var ColumnCompiler_Oracledb = class extends ColumnCompiler_Oracle {
      constructor() {
        super(...arguments);
        this.modifiers = ["defaultTo", "nullable", "comment", "checkJson"];
        this._addCheckModifiers();
      }
      datetime(withoutTz) {
        let useTz;
        if (isObject(withoutTz)) {
          ({ useTz } = withoutTz);
        } else {
          useTz = !withoutTz;
        }
        return useTz ? "timestamp with local time zone" : "timestamp";
      }
      timestamp(withoutTz) {
        let useTz;
        if (isObject(withoutTz)) {
          ({ useTz } = withoutTz);
        } else {
          useTz = !withoutTz;
        }
        return useTz ? "timestamp with local time zone" : "timestamp";
      }
      checkRegex(regex, constraintName) {
        return this._check(
          `REGEXP_LIKE(${this.formatter.wrap(
            this.getColumnName()
          )},${this.client._escapeBinding(regex)})`,
          constraintName
        );
      }
      json() {
        this.columnBuilder._modifiers.checkJson = [
          this.formatter.columnize(this.getColumnName())
        ];
        return "varchar2(4000)";
      }
      jsonb() {
        return this.json();
      }
      checkJson(column) {
        return `check (${column} is json)`;
      }
    };
    ColumnCompiler_Oracledb.prototype.time = "timestamp with local time zone";
    ColumnCompiler_Oracledb.prototype.uuid = ({ useBinaryUuid = false } = {}) => useBinaryUuid ? "raw(16)" : "char(36)";
    module2.exports = ColumnCompiler_Oracledb;
  }
});

// node_modules/knex/lib/dialects/oracledb/schema/oracledb-viewcompiler.js
var require_oracledb_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/schema/oracledb-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler = require_viewcompiler();
    var ViewCompiler_Oracledb = class extends ViewCompiler {
      constructor(client, viewCompiler) {
        super(client, viewCompiler);
      }
      createOrReplace() {
        this.createQuery(this.columns, this.selectQuery, false, true);
      }
      createMaterializedView() {
        this.createQuery(this.columns, this.selectQuery, true);
      }
    };
    module2.exports = ViewCompiler_Oracledb;
  }
});

// node_modules/knex/lib/dialects/oracledb/schema/oracledb-viewbuilder.js
var require_oracledb_viewbuilder = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/schema/oracledb-viewbuilder.js"(exports2, module2) {
    "use strict";
    var ViewBuilder = require_viewbuilder();
    var ViewBuilder_Oracledb = class extends ViewBuilder {
      constructor() {
        super(...arguments);
      }
      checkOption() {
        this._single.checkOption = "default_option";
      }
    };
    module2.exports = ViewBuilder_Oracledb;
  }
});

// node_modules/knex/lib/dialects/oracledb/transaction.js
var require_transaction5 = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    var { timeout, KnexTimeoutError } = require_timeout();
    var debugTx = require_src()("knex:tx");
    var supportedIsolationLevels = ["read committed", "serializable"];
    var isIsolationLevelEnabled = false;
    module2.exports = class Oracle_Transaction extends Transaction {
      // disable autocommit to allow correct behavior (default is true)
      begin(conn) {
        if (this.isolationLevel) {
          if (isIsolationLevelEnabled) {
            if (!supportedIsolationLevels.includes(this.isolationLevel)) {
              this.client.logger.warn(
                "Oracle only supports read committed and serializable transactions, ignoring the isolation level param"
              );
            } else {
              return this.query(conn, `SET TRANSACTION ${this.isolationLevel}`);
            }
          } else {
            this.client.logger.warn(
              "Transaction isolation is not currently supported for Oracle"
            );
          }
        }
        return Promise.resolve();
      }
      async commit(conn, value) {
        this._completed = true;
        try {
          await conn.commitAsync();
          this._resolver(value);
        } catch (err) {
          this._rejecter(err);
        }
      }
      release(conn, value) {
        return this._resolver(value);
      }
      rollback(conn, err) {
        this._completed = true;
        debugTx("%s: rolling back", this.txid);
        return timeout(conn.rollbackAsync(), 5e3).catch((e) => {
          if (!(e instanceof KnexTimeoutError)) {
            return Promise.reject(e);
          }
          this._rejecter(e);
        }).then(() => {
          if (err === void 0) {
            if (this.doNotRejectOnRollback) {
              this._resolver();
              return;
            }
            err = new Error(`Transaction rejected with non-error: ${err}`);
          }
          this._rejecter(err);
        });
      }
      savepoint(conn) {
        return this.query(conn, `SAVEPOINT ${this.txid}`);
      }
      async acquireConnection(config3, cb) {
        const configConnection = config3 && config3.connection;
        const connection = configConnection || await this.client.acquireConnection();
        try {
          connection.__knexTxId = this.txid;
          connection.isTransaction = true;
          return await cb(connection);
        } finally {
          debugTx("%s: releasing connection", this.txid);
          connection.isTransaction = false;
          try {
            await connection.commitAsync();
          } catch (err) {
            this._rejecter(err);
          } finally {
            if (!configConnection) {
              await this.client.releaseConnection(connection);
            } else {
              debugTx("%s: not releasing external connection", this.txid);
            }
          }
        }
      }
    };
  }
});

// node_modules/knex/lib/dialects/oracledb/index.js
var require_oracledb = __commonJS({
  "node_modules/knex/lib/dialects/oracledb/index.js"(exports2, module2) {
    "use strict";
    var each = require_each();
    var flatten = require_flatten();
    var isEmpty = require_isEmpty();
    var map = require_map();
    var Formatter = require_formatter();
    var QueryCompiler = require_oracledb_querycompiler();
    var TableCompiler = require_oracledb_tablecompiler();
    var ColumnCompiler = require_oracledb_columncompiler();
    var {
      BlobHelper,
      ReturningHelper,
      monkeyPatchConnection
    } = require_utils4();
    var ViewCompiler = require_oracledb_viewcompiler();
    var ViewBuilder = require_oracledb_viewbuilder();
    var Transaction = require_transaction5();
    var Client_Oracle = require_oracle();
    var { isString } = require_is();
    var { outputQuery, unwrapRaw } = require_wrappingFormatter();
    var { compileCallback } = require_formatterUtils();
    var Client_Oracledb = class extends Client_Oracle {
      constructor(config3) {
        super(config3);
        if (this.version) {
          this.version = parseVersion(this.version);
        }
        if (this.driver) {
          process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || 1;
          process.env.UV_THREADPOOL_SIZE = parseInt(process.env.UV_THREADPOOL_SIZE) + this.driver.poolMax;
        }
      }
      _driver() {
        const client = this;
        const oracledb = require("oracledb");
        client.fetchAsString = [];
        if (this.config.fetchAsString && Array.isArray(this.config.fetchAsString)) {
          this.config.fetchAsString.forEach(function(type) {
            if (!isString(type)) return;
            type = type.toUpperCase();
            if (oracledb[type]) {
              if (type !== "NUMBER" && type !== "DATE" && type !== "CLOB" && type !== "BUFFER") {
                this.logger.warn(
                  'Only "date", "number", "clob" and "buffer" are supported for fetchAsString'
                );
              }
              client.fetchAsString.push(oracledb[type]);
            }
          });
        }
        return oracledb;
      }
      queryCompiler(builder, formatter) {
        return new QueryCompiler(this, builder, formatter);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      viewBuilder() {
        return new ViewBuilder(this, ...arguments);
      }
      viewCompiler() {
        return new ViewCompiler(this, ...arguments);
      }
      formatter(builder) {
        return new Formatter(this, builder);
      }
      transaction() {
        return new Transaction(this, ...arguments);
      }
      prepBindings(bindings) {
        return map(bindings, (value) => {
          if (value instanceof BlobHelper && this.driver) {
            return { type: this.driver.BLOB, dir: this.driver.BIND_OUT };
          } else if (value instanceof ReturningHelper && this.driver) {
            return { type: this.driver.STRING, dir: this.driver.BIND_OUT };
          } else if (typeof value === "boolean") {
            return value ? 1 : 0;
          }
          return value;
        });
      }
      // Checks whether a value is a function... if it is, we compile it
      // otherwise we check whether it's a raw
      parameter(value, builder, formatter) {
        if (typeof value === "function") {
          return outputQuery(
            compileCallback(value, void 0, this, formatter),
            true,
            builder,
            this
          );
        } else if (value instanceof BlobHelper) {
          formatter.bindings.push(value.value);
          return "?";
        }
        return unwrapRaw(value, true, builder, this, formatter) || "?";
      }
      // Get a raw connection, called by the `pool` whenever a new
      // connection needs to be added to the pool.
      acquireRawConnection() {
        return new Promise((resolver, rejecter) => {
          const oracleDbConfig = this.connectionSettings.externalAuth ? { externalAuth: this.connectionSettings.externalAuth } : {
            user: this.connectionSettings.user,
            password: this.connectionSettings.password
          };
          oracleDbConfig.connectString = resolveConnectString(
            this.connectionSettings
          );
          if (this.connectionSettings.prefetchRowCount) {
            oracleDbConfig.prefetchRows = this.connectionSettings.prefetchRowCount;
          }
          if (this.connectionSettings.stmtCacheSize !== void 0) {
            oracleDbConfig.stmtCacheSize = this.connectionSettings.stmtCacheSize;
          }
          this.driver.fetchAsString = this.fetchAsString;
          this.driver.getConnection(oracleDbConfig, (err, connection) => {
            if (err) {
              return rejecter(err);
            }
            monkeyPatchConnection(connection, this);
            resolver(connection);
          });
        });
      }
      // Used to explicitly close a connection, called internally by the pool
      // when a connection times out or the pool is shutdown.
      destroyRawConnection(connection) {
        return connection.release();
      }
      // Handle oracle version resolution on acquiring connection from pool instead of connection creation.
      // Must do this here since only the client used to create a connection would be updated with version
      // information on creation. Poses a problem when knex instance is cloned since instances share the
      // connection pool while having their own client instances.
      async acquireConnection() {
        const connection = await super.acquireConnection();
        this.checkVersion(connection);
        return connection;
      }
      // In Oracle, we need to check the version to dynamically determine
      // certain limits. If user did not specify a version, get it from the connection.
      checkVersion(connection) {
        if (this.version) {
          return this.version;
        }
        const detectedVersion = parseVersion(connection.oracleServerVersionString);
        if (!detectedVersion) {
          throw new Error(
            this.version === null ? "Invalid Oracledb version number format passed to knex. Unable to successfully auto-detect as fallback. Please specify a valid oracledb version." : "Unable to detect Oracledb version number automatically. Please specify the version in knex configuration."
          );
        }
        this.version = detectedVersion;
        return detectedVersion;
      }
      // Runs the query on the specified connection, providing the bindings
      // and any other necessary prep work.
      _query(connection, obj) {
        if (!obj.sql) throw new Error("The query is empty");
        const options = Object.assign({}, obj.options, { autoCommit: false });
        if (obj.method === "select") {
          options.resultSet = true;
        }
        return connection.executeAsync(obj.sql, obj.bindings, options).then(async function(response) {
          let outBinds = flatten(response.outBinds);
          obj.response = response.rows || [];
          obj.rowsAffected = response.rows ? response.rows.rowsAffected : response.rowsAffected;
          if (obj.method === "raw" && outBinds.length > 0) {
            return {
              response: outBinds
            };
          }
          if (obj.method === "update") {
            const modifiedRowsCount = obj.rowsAffected.length || obj.rowsAffected;
            const updatedObjOutBinding = [];
            const updatedOutBinds = [];
            const updateOutBinds = (i) => function(value, index) {
              const OutBindsOffset = index * modifiedRowsCount;
              updatedOutBinds.push(outBinds[i + OutBindsOffset]);
            };
            for (let i = 0; i < modifiedRowsCount; i++) {
              updatedObjOutBinding.push(obj.outBinding[0]);
              each(obj.outBinding[0], updateOutBinds(i));
            }
            outBinds = updatedOutBinds;
            obj.outBinding = updatedObjOutBinding;
          }
          if (!obj.returning && outBinds.length === 0) {
            if (!connection.isTransaction) {
              await connection.commitAsync();
            }
            return obj;
          }
          const rowIds = [];
          let offset = 0;
          for (let line = 0; line < obj.outBinding.length; line++) {
            const ret = obj.outBinding[line];
            offset = offset + (obj.outBinding[line - 1] ? obj.outBinding[line - 1].length : 0);
            for (let index = 0; index < ret.length; index++) {
              const out = ret[index];
              await new Promise(function(bindResolver, bindRejecter) {
                if (out instanceof BlobHelper) {
                  const blob = outBinds[index + offset];
                  if (out.returning) {
                    obj.response[line] = obj.response[line] || {};
                    obj.response[line][out.columnName] = out.value;
                  }
                  blob.on("error", function(err) {
                    bindRejecter(err);
                  });
                  blob.on("finish", function() {
                    bindResolver();
                  });
                  blob.write(out.value);
                  blob.end();
                } else if (obj.outBinding[line][index] === "ROWID") {
                  rowIds.push(outBinds[index + offset]);
                  bindResolver();
                } else {
                  obj.response[line] = obj.response[line] || {};
                  obj.response[line][out] = outBinds[index + offset];
                  bindResolver();
                }
              });
            }
          }
          if (obj.returningSql) {
            const response2 = await connection.executeAsync(
              obj.returningSql(),
              rowIds,
              { resultSet: true }
            );
            obj.response = response2.rows;
          }
          if (connection.isTransaction) {
            return obj;
          }
          await connection.commitAsync();
          return obj;
        });
      }
      // Process the response as returned from the query.
      processResponse(obj, runner) {
        const { response } = obj;
        if (obj.output) {
          return obj.output.call(runner, response);
        }
        switch (obj.method) {
          case "select":
            return response;
          case "first":
            return response[0];
          case "pluck":
            return map(response, obj.pluck);
          case "insert":
          case "del":
          case "update":
          case "counter":
            if (obj.returning && !isEmpty(obj.returning) || obj.returningSql) {
              return response;
            } else if (obj.rowsAffected !== void 0) {
              return obj.rowsAffected;
            } else {
              return 1;
            }
          default:
            return response;
        }
      }
      processPassedConnection(connection) {
        this.checkVersion(connection);
        monkeyPatchConnection(connection, this);
      }
    };
    Client_Oracledb.prototype.driverName = "oracledb";
    function parseVersion(versionString) {
      try {
        const versionParts = versionString.split(".").slice(0, 2);
        versionParts.forEach((versionPart, idx) => {
          versionParts[idx] = versionPart.replace(/\D$/, "");
        });
        const version = versionParts.join(".");
        return version.match(/^\d+\.?\d*$/) ? version : null;
      } catch (err) {
        return null;
      }
    }
    function resolveConnectString(connectionSettings) {
      if (connectionSettings.connectString) {
        return connectionSettings.connectString;
      }
      if (!connectionSettings.port) {
        return connectionSettings.host + "/" + connectionSettings.database;
      }
      return connectionSettings.host + ":" + connectionSettings.port + "/" + connectionSettings.database;
    }
    module2.exports = Client_Oracledb;
  }
});

// node_modules/knex/lib/dialects/pgnative/index.js
var require_pgnative = __commonJS({
  "node_modules/knex/lib/dialects/pgnative/index.js"(exports2, module2) {
    "use strict";
    var Client_PG = require_postgres();
    var Client_PgNative = class extends Client_PG {
      constructor(...args) {
        super(...args);
        this.driverName = "pgnative";
        this.canCancelQuery = true;
      }
      _driver() {
        return require("pg").native;
      }
      _stream(connection, obj, stream, options) {
        if (!obj.sql) throw new Error("The query is empty");
        const client = this;
        return new Promise((resolver, rejecter) => {
          stream.on("error", rejecter);
          stream.on("end", resolver);
          return client._query(connection, obj).then((obj2) => obj2.response).then(({ rows }) => rows.forEach((row) => stream.write(row))).catch(function(err) {
            stream.emit("error", err);
          }).then(function() {
            stream.end();
          });
        });
      }
      async cancelQuery(connectionToKill) {
        try {
          return await this._wrappedCancelQueryCall(null, connectionToKill);
        } catch (err) {
          this.logger.warn(`Connection Error: ${err}`);
          throw err;
        }
      }
      _wrappedCancelQueryCall(emptyConnection, connectionToKill) {
        return new Promise(function(resolve, reject) {
          connectionToKill.native.cancel(function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(true);
          });
        });
      }
    };
    module2.exports = Client_PgNative;
  }
});

// node_modules/knex/lib/dialects/redshift/transaction.js
var require_transaction6 = __commonJS({
  "node_modules/knex/lib/dialects/redshift/transaction.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction();
    module2.exports = class Redshift_Transaction extends Transaction {
      begin(conn) {
        const trxMode = [
          this.isolationLevel ? `ISOLATION LEVEL ${this.isolationLevel}` : "",
          this.readOnly ? "READ ONLY" : ""
        ].join(" ").trim();
        if (trxMode.length === 0) {
          return this.query(conn, "BEGIN;");
        }
        return this.query(conn, `BEGIN ${trxMode};`);
      }
      savepoint(conn) {
        this.trxClient.logger("Redshift does not support savepoints.");
        return Promise.resolve();
      }
      release(conn, value) {
        this.trxClient.logger("Redshift does not support savepoints.");
        return Promise.resolve();
      }
      rollbackTo(conn, error) {
        this.trxClient.logger("Redshift does not support savepoints.");
        return Promise.resolve();
      }
    };
  }
});

// node_modules/knex/lib/dialects/redshift/query/redshift-querycompiler.js
var require_redshift_querycompiler = __commonJS({
  "node_modules/knex/lib/dialects/redshift/query/redshift-querycompiler.js"(exports2, module2) {
    "use strict";
    var QueryCompiler = require_querycompiler();
    var QueryCompiler_PG = require_pg_querycompiler();
    var identity = require_identity();
    var {
      columnize: columnize_
    } = require_wrappingFormatter();
    var QueryCompiler_Redshift = class extends QueryCompiler_PG {
      truncate() {
        return `truncate ${this.tableName.toLowerCase()}`;
      }
      // Compiles an `insert` query, allowing for multiple
      // inserts using a single query statement.
      insert() {
        const sql = QueryCompiler.prototype.insert.apply(this, arguments);
        if (sql === "") return sql;
        this._slightReturn();
        return {
          sql
        };
      }
      // Compiles an `update` query, warning on unsupported returning
      update() {
        const sql = QueryCompiler.prototype.update.apply(this, arguments);
        this._slightReturn();
        return {
          sql
        };
      }
      // Compiles an `delete` query, warning on unsupported returning
      del() {
        const sql = QueryCompiler.prototype.del.apply(this, arguments);
        this._slightReturn();
        return {
          sql
        };
      }
      // simple: if trying to return, warn
      _slightReturn() {
        if (this.single.isReturning) {
          this.client.logger.warn(
            "insert/update/delete returning is not supported by redshift dialect"
          );
        }
      }
      forUpdate() {
        this.client.logger.warn("table lock is not supported by redshift dialect");
        return "";
      }
      forShare() {
        this.client.logger.warn(
          "lock for share is not supported by redshift dialect"
        );
        return "";
      }
      forNoKeyUpdate() {
        this.client.logger.warn("table lock is not supported by redshift dialect");
        return "";
      }
      forKeyShare() {
        this.client.logger.warn(
          "lock for share is not supported by redshift dialect"
        );
        return "";
      }
      // Compiles a columnInfo query
      columnInfo() {
        const column = this.single.columnInfo;
        let schema = this.single.schema;
        const table = this.client.customWrapIdentifier(this.single.table, identity);
        if (schema) {
          schema = this.client.customWrapIdentifier(schema, identity);
        }
        const sql = "select * from information_schema.columns where table_name = ? and table_catalog = ?";
        const bindings = [
          table.toLowerCase(),
          this.client.database().toLowerCase()
        ];
        return this._buildColumnInfoQuery(schema, sql, bindings, column);
      }
      jsonExtract(params) {
        let extractions;
        if (Array.isArray(params.column)) {
          extractions = params.column;
        } else {
          extractions = [params];
        }
        return extractions.map((extraction) => {
          const jsonCol = `json_extract_path_text(${columnize_(
            extraction.column || extraction[0],
            this.builder,
            this.client,
            this.bindingsHolder
          )}, ${this.client.toPathForJson(
            params.path || extraction[1],
            this.builder,
            this.bindingsHolder
          )})`;
          const alias = extraction.alias || extraction[2];
          return alias ? this.client.alias(jsonCol, this.formatter.wrap(alias)) : jsonCol;
        }).join(", ");
      }
      jsonSet(params) {
        throw new Error("Json set is not supported by Redshift");
      }
      jsonInsert(params) {
        throw new Error("Json insert is not supported by Redshift");
      }
      jsonRemove(params) {
        throw new Error("Json remove is not supported by Redshift");
      }
      whereJsonPath(statement) {
        return this._whereJsonPath(
          "json_extract_path_text",
          Object.assign({}, statement, {
            path: this.client.toPathForJson(statement.path)
          })
        );
      }
      whereJsonSupersetOf(statement) {
        throw new Error("Json superset is not supported by Redshift");
      }
      whereJsonSubsetOf(statement) {
        throw new Error("Json subset is not supported by Redshift");
      }
      onJsonPathEquals(clause) {
        return this._onJsonPathEquals("json_extract_path_text", clause);
      }
    };
    module2.exports = QueryCompiler_Redshift;
  }
});

// node_modules/knex/lib/dialects/redshift/schema/redshift-columnbuilder.js
var require_redshift_columnbuilder = __commonJS({
  "node_modules/knex/lib/dialects/redshift/schema/redshift-columnbuilder.js"(exports2, module2) {
    "use strict";
    var ColumnBuilder = require_columnbuilder();
    var ColumnBuilder_Redshift = class extends ColumnBuilder {
      constructor() {
        super(...arguments);
      }
      // primary needs to set not null on non-preexisting columns, or fail
      primary() {
        this.notNullable();
        return super.primary(...arguments);
      }
      index() {
        this.client.logger.warn(
          "Redshift does not support the creation of indexes."
        );
        return this;
      }
    };
    module2.exports = ColumnBuilder_Redshift;
  }
});

// node_modules/knex/lib/dialects/redshift/schema/redshift-columncompiler.js
var require_redshift_columncompiler = __commonJS({
  "node_modules/knex/lib/dialects/redshift/schema/redshift-columncompiler.js"(exports2, module2) {
    "use strict";
    var ColumnCompiler_PG = require_pg_columncompiler();
    var ColumnCompiler = require_columncompiler();
    var ColumnCompiler_Redshift = class extends ColumnCompiler_PG {
      constructor() {
        super(...arguments);
      }
      // Types:
      // ------
      bit(column) {
        return column.length !== false ? `char(${column.length})` : "char(1)";
      }
      datetime(without) {
        return without ? "timestamp" : "timestamptz";
      }
      timestamp(without) {
        return without ? "timestamp" : "timestamptz";
      }
      // Modifiers:
      // ------
      comment(comment) {
        this.pushAdditional(function() {
          this.pushQuery(
            `comment on column ${this.tableCompiler.tableName()}.` + this.formatter.wrap(this.args[0]) + " is " + (comment ? `'${comment}'` : "NULL")
          );
        }, comment);
      }
    };
    ColumnCompiler_Redshift.prototype.increments = ({ primaryKey = true } = {}) => "integer identity(1,1)" + (primaryKey ? " primary key" : "") + " not null";
    ColumnCompiler_Redshift.prototype.bigincrements = ({
      primaryKey = true
    } = {}) => "bigint identity(1,1)" + (primaryKey ? " primary key" : "") + " not null";
    ColumnCompiler_Redshift.prototype.binary = "varchar(max)";
    ColumnCompiler_Redshift.prototype.blob = "varchar(max)";
    ColumnCompiler_Redshift.prototype.enu = "varchar(255)";
    ColumnCompiler_Redshift.prototype.enum = "varchar(255)";
    ColumnCompiler_Redshift.prototype.json = "varchar(max)";
    ColumnCompiler_Redshift.prototype.jsonb = "varchar(max)";
    ColumnCompiler_Redshift.prototype.longblob = "varchar(max)";
    ColumnCompiler_Redshift.prototype.mediumblob = "varchar(16777218)";
    ColumnCompiler_Redshift.prototype.set = "text";
    ColumnCompiler_Redshift.prototype.text = "varchar(max)";
    ColumnCompiler_Redshift.prototype.tinyblob = "varchar(256)";
    ColumnCompiler_Redshift.prototype.uuid = ColumnCompiler.prototype.uuid;
    ColumnCompiler_Redshift.prototype.varbinary = "varchar(max)";
    ColumnCompiler_Redshift.prototype.bigint = "bigint";
    ColumnCompiler_Redshift.prototype.bool = "boolean";
    ColumnCompiler_Redshift.prototype.double = "double precision";
    ColumnCompiler_Redshift.prototype.floating = "real";
    ColumnCompiler_Redshift.prototype.smallint = "smallint";
    ColumnCompiler_Redshift.prototype.tinyint = "smallint";
    module2.exports = ColumnCompiler_Redshift;
  }
});

// node_modules/knex/lib/dialects/redshift/schema/redshift-tablecompiler.js
var require_redshift_tablecompiler = __commonJS({
  "node_modules/knex/lib/dialects/redshift/schema/redshift-tablecompiler.js"(exports2, module2) {
    "use strict";
    var has = require_has();
    var TableCompiler_PG = require_pg_tablecompiler();
    var TableCompiler_Redshift = class extends TableCompiler_PG {
      constructor() {
        super(...arguments);
      }
      index(columns, indexName, options) {
        this.client.logger.warn(
          "Redshift does not support the creation of indexes."
        );
      }
      dropIndex(columns, indexName) {
        this.client.logger.warn(
          "Redshift does not support the deletion of indexes."
        );
      }
      // TODO: have to disable setting not null on columns that already exist...
      // Adds the "create" query to the query sequence.
      createQuery(columns, ifNot, like) {
        const createStatement = ifNot ? "create table if not exists " : "create table ";
        const columnsSql = " (" + columns.sql.join(", ") + this._addChecks() + ")";
        let sql = createStatement + this.tableName() + (like && this.tableNameLike() ? " (like " + this.tableNameLike() + ")" : columnsSql);
        if (this.single.inherits)
          sql += ` like (${this.formatter.wrap(this.single.inherits)})`;
        this.pushQuery({
          sql,
          bindings: columns.bindings
        });
        const hasComment = has(this.single, "comment");
        if (hasComment) this.comment(this.single.comment);
        if (like) {
          this.addColumns(columns, this.addColumnsPrefix);
        }
      }
      primary(columns, constraintName) {
        const self2 = this;
        constraintName = constraintName ? self2.formatter.wrap(constraintName) : self2.formatter.wrap(`${this.tableNameRaw}_pkey`);
        if (columns.constructor !== Array) {
          columns = [columns];
        }
        const thiscolumns = self2.grouped.columns;
        if (thiscolumns) {
          for (let i = 0; i < columns.length; i++) {
            let exists = thiscolumns.find(
              (tcb) => tcb.grouping === "columns" && tcb.builder && tcb.builder._method === "add" && tcb.builder._args && tcb.builder._args.indexOf(columns[i]) > -1
            );
            if (exists) {
              exists = exists.builder;
            }
            const nullable = !(exists && exists._modifiers && exists._modifiers["nullable"] && exists._modifiers["nullable"][0] === false);
            if (nullable) {
              if (exists) {
                return this.client.logger.warn(
                  "Redshift does not allow primary keys to contain nullable columns."
                );
              } else {
                return this.client.logger.warn(
                  "Redshift does not allow primary keys to contain nonexistent columns."
                );
              }
            }
          }
        }
        return self2.pushQuery(
          `alter table ${self2.tableName()} add constraint ${constraintName} primary key (${self2.formatter.columnize(
            columns
          )})`
        );
      }
      // Compiles column add. Redshift can only add one column per ALTER TABLE, so core addColumns doesn't work.  #2545
      addColumns(columns, prefix, colCompilers) {
        if (prefix === this.alterColumnsPrefix) {
          super.addColumns(columns, prefix, colCompilers);
        } else {
          prefix = prefix || this.addColumnsPrefix;
          colCompilers = colCompilers || this.getColumns();
          for (const col of colCompilers) {
            const quotedTableName = this.tableName();
            const colCompiled = col.compileColumn();
            this.pushQuery({
              sql: `alter table ${quotedTableName} ${prefix}${colCompiled}`,
              bindings: []
            });
          }
        }
      }
    };
    module2.exports = TableCompiler_Redshift;
  }
});

// node_modules/knex/lib/dialects/redshift/schema/redshift-compiler.js
var require_redshift_compiler = __commonJS({
  "node_modules/knex/lib/dialects/redshift/schema/redshift-compiler.js"(exports2, module2) {
    "use strict";
    var SchemaCompiler_PG = require_pg_compiler();
    var SchemaCompiler_Redshift = class extends SchemaCompiler_PG {
      constructor() {
        super(...arguments);
      }
    };
    module2.exports = SchemaCompiler_Redshift;
  }
});

// node_modules/knex/lib/dialects/redshift/schema/redshift-viewcompiler.js
var require_redshift_viewcompiler = __commonJS({
  "node_modules/knex/lib/dialects/redshift/schema/redshift-viewcompiler.js"(exports2, module2) {
    "use strict";
    var ViewCompiler_PG = require_pg_viewcompiler();
    var ViewCompiler_Redshift = class extends ViewCompiler_PG {
      constructor(client, viewCompiler) {
        super(client, viewCompiler);
      }
    };
    module2.exports = ViewCompiler_Redshift;
  }
});

// node_modules/knex/lib/dialects/redshift/index.js
var require_redshift = __commonJS({
  "node_modules/knex/lib/dialects/redshift/index.js"(exports2, module2) {
    "use strict";
    var Client_PG = require_postgres();
    var map = require_map();
    var Transaction = require_transaction6();
    var QueryCompiler = require_redshift_querycompiler();
    var ColumnBuilder = require_redshift_columnbuilder();
    var ColumnCompiler = require_redshift_columncompiler();
    var TableCompiler = require_redshift_tablecompiler();
    var SchemaCompiler = require_redshift_compiler();
    var ViewCompiler = require_redshift_viewcompiler();
    var Client_Redshift = class extends Client_PG {
      transaction() {
        return new Transaction(this, ...arguments);
      }
      queryCompiler(builder, formatter) {
        return new QueryCompiler(this, builder, formatter);
      }
      columnBuilder() {
        return new ColumnBuilder(this, ...arguments);
      }
      columnCompiler() {
        return new ColumnCompiler(this, ...arguments);
      }
      tableCompiler() {
        return new TableCompiler(this, ...arguments);
      }
      schemaCompiler() {
        return new SchemaCompiler(this, ...arguments);
      }
      viewCompiler() {
        return new ViewCompiler(this, ...arguments);
      }
      _driver() {
        return require("pg");
      }
      // Ensures the response is returned in the same format as other clients.
      processResponse(obj, runner) {
        const resp = obj.response;
        if (obj.output) return obj.output.call(runner, resp);
        if (obj.method === "raw") return resp;
        if (resp.command === "SELECT") {
          if (obj.method === "first") return resp.rows[0];
          if (obj.method === "pluck") return map(resp.rows, obj.pluck);
          return resp.rows;
        }
        if (resp.command === "INSERT" || resp.command === "UPDATE" || resp.command === "DELETE") {
          return resp.rowCount;
        }
        return resp;
      }
      toPathForJson(jsonPath, builder, bindingsHolder) {
        return jsonPath.replace(/^(\$\.)/, "").split(".").map(
          function(v) {
            return this.parameter(v, builder, bindingsHolder);
          }.bind(this)
        ).join(", ");
      }
    };
    Object.assign(Client_Redshift.prototype, {
      dialect: "redshift",
      driverName: "pg-redshift"
    });
    module2.exports = Client_Redshift;
  }
});

// node_modules/knex/lib/dialects/index.js
var require_dialects = __commonJS({
  "node_modules/knex/lib/dialects/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getDialectByNameOrAlias = void 0;
    var { resolveClientNameWithAliases } = require_helpers();
    var dbNameToDialectLoader = Object.freeze({
      "better-sqlite3": () => require_better_sqlite3(),
      cockroachdb: () => require_cockroachdb(),
      mssql: () => require_mssql(),
      mysql: () => require_mysql(),
      mysql2: () => require_mysql2(),
      oracle: () => require_oracle(),
      oracledb: () => require_oracledb(),
      pgnative: () => require_pgnative(),
      postgres: () => require_postgres(),
      redshift: () => require_redshift(),
      sqlite3: () => require_sqlite3()
    });
    function getDialectByNameOrAlias(clientName) {
      const resolvedClientName = resolveClientNameWithAliases(clientName);
      const dialectLoader = dbNameToDialectLoader[resolvedClientName];
      if (!dialectLoader) {
        throw new Error(`Invalid clientName given: ${clientName}`);
      }
      return dialectLoader();
    }
    exports2.getDialectByNameOrAlias = getDialectByNameOrAlias;
  }
});

// node_modules/knex/lib/knex-builder/internal/config-resolver.js
var require_config_resolver = __commonJS({
  "node_modules/knex/lib/knex-builder/internal/config-resolver.js"(exports2, module2) {
    "use strict";
    var Client = require_client();
    var { SUPPORTED_CLIENTS } = require_constants();
    var parseConnection = require_parse_connection();
    var { getDialectByNameOrAlias } = require_dialects();
    function resolveConfig(config3) {
      let Dialect;
      let resolvedConfig;
      const parsedConfig = typeof config3 === "string" ? Object.assign(parseConnection(config3), arguments[2]) : config3;
      if (arguments.length === 0 || !parsedConfig.client && !parsedConfig.dialect) {
        Dialect = Client;
      } else if (typeof parsedConfig.client === "function") {
        Dialect = parsedConfig.client;
      } else {
        const clientName = parsedConfig.client || parsedConfig.dialect;
        if (!SUPPORTED_CLIENTS.includes(clientName)) {
          throw new Error(
            `knex: Unknown configuration option 'client' value ${clientName}. Note that it is case-sensitive, check documentation for supported values.`
          );
        }
        Dialect = getDialectByNameOrAlias(clientName);
      }
      if (typeof parsedConfig.connection === "string") {
        resolvedConfig = Object.assign({}, parsedConfig, {
          connection: parseConnection(parsedConfig.connection).connection
        });
      } else {
        resolvedConfig = Object.assign({}, parsedConfig);
      }
      return {
        resolvedConfig,
        Dialect
      };
    }
    module2.exports = {
      resolveConfig
    };
  }
});

// node_modules/knex/lib/knex-builder/Knex.js
var require_Knex = __commonJS({
  "node_modules/knex/lib/knex-builder/Knex.js"(exports2, module2) {
    "use strict";
    var Client = require_client();
    var QueryBuilder = require_querybuilder();
    var QueryInterface = require_method_constants();
    var makeKnex = require_make_knex();
    var { KnexTimeoutError } = require_timeout();
    var { resolveConfig } = require_config_resolver();
    var SchemaBuilder = require_builder();
    var ViewBuilder = require_viewbuilder();
    var ColumnBuilder = require_columnbuilder();
    var TableBuilder = require_tablebuilder();
    function knex2(config3) {
      const { resolvedConfig, Dialect } = resolveConfig(...arguments);
      const newKnex = makeKnex(new Dialect(resolvedConfig));
      if (resolvedConfig.userParams) {
        newKnex.userParams = resolvedConfig.userParams;
      }
      return newKnex;
    }
    knex2.Client = Client;
    knex2.KnexTimeoutError = KnexTimeoutError;
    knex2.QueryBuilder = {
      extend: function(methodName, fn) {
        QueryBuilder.extend(methodName, fn);
        QueryInterface.push(methodName);
      }
    };
    knex2.SchemaBuilder = {
      extend: function(methodName, fn) {
        SchemaBuilder.extend(methodName, fn);
      }
    };
    knex2.ViewBuilder = {
      extend: function(methodName, fn) {
        ViewBuilder.extend(methodName, fn);
      }
    };
    knex2.ColumnBuilder = {
      extend: function(methodName, fn) {
        ColumnBuilder.extend(methodName, fn);
      }
    };
    knex2.TableBuilder = {
      extend: function(methodName, fn) {
        TableBuilder.extend(methodName, fn);
      }
    };
    module2.exports = knex2;
  }
});

// node_modules/knex/lib/index.js
var require_lib = __commonJS({
  "node_modules/knex/lib/index.js"(exports2, module2) {
    "use strict";
    var Knex2 = require_Knex();
    module2.exports = Knex2;
  }
});

// node_modules/knex/knex.js
var require_knex = __commonJS({
  "node_modules/knex/knex.js"(exports2, module2) {
    "use strict";
    var knex2 = require_lib();
    knex2.knex = knex2;
    knex2.default = knex2;
    module2.exports = knex2;
  }
});

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_cookie = __toESM(require("@fastify/cookie"));

// src/routes/transactions.ts
var import_zod2 = require("zod");
var import_node_crypto = require("crypto");

// src/database.ts
var import_knex = __toESM(require_knex());

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success == false) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/database.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env not found");
}
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/middleware/check-session-id-exists.ts
async function checkSessionIdExists(request, reply) {
  const sessionId = request.cookies.sessionId;
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized."
    });
  }
}

// src/routes/transactions.ts
async function transactionsRoutes(app2) {
  app2.get(
    "/",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex("transactions").where("session_id", sessionId).select();
      return { transactions };
    }
  );
  app2.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const getTransactionParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getTransactionParamsSchema.parse(
        request.params
      );
      const { sessionId } = request.cookies;
      const transaction = await knex("transactions").where({
        id,
        session_id: sessionId
      }).first();
      return { transaction };
    }
  );
  app2.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const { sessionId } = request.cookies;
      const summary = await knex("transactions").where({
        session_id: sessionId
      }).sum("amount", { as: "amount" }).first();
      return { summary };
    }
  );
  app2.post("/", async (request, reply) => {
    const createTransactionBodySchema = import_zod2.z.object({
      title: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(["credit", "debit"])
    });
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );
    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = (0, import_node_crypto.randomUUID)();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      });
    }
    await knex("transactions").insert({
      id: (0, import_node_crypto.randomUUID)(),
      title,
      amount: type == "credit" ? amount : amount * -1,
      session_id: sessionId
    });
    return reply.status(201).send();
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.addHook("preHandler", async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`);
});
app.register(transactionsRoutes, {
  prefix: "transactions"
});

// src/server.ts
app.listen({
  port: env.PORT
}).then(() => {
  console.log("HTTP Server Running!");
});
