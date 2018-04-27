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

	__webpack_require__(1);

	var _utils = __webpack_require__(2);

	var _PBStorageSync = __webpack_require__(3);

	var _PBStorageSync2 = _interopRequireDefault(_PBStorageSync);

	var _const = __webpack_require__(10);

	var _const2 = _interopRequireDefault(_const);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	$(function () {
		var tabId = void 0,
		    tabUrl = void 0,
		    host = void 0;
		var whitelist = void 0,
		    defaultWhitelist = void 0;
		var timer = void 0;
		var statsOpen = false;

		//load all settings
		_PBStorageSync2.default.many(_PBStorageSync2.default.pb_fullWhitelist, _PBStorageSync2.default.pb_detectOverlays, _PBStorageSync2.default.pb_tabswithoverlay, _PBStorageSync2.default.pb_overlaylist, _PBStorageSync2.default.pb_numOfBlocks, _PBStorageSync2.default.pb_defaultWhitelist, _PBStorageSync2.default.pb_whitelist, _PBStorageSync2.default.pb_pause).get().then(function (settings) {
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
				var tab = tabs[0];

				tabId = tab.id;
				tabUrl = tab.url;
				host = new URL(tabUrl).host;
				whitelist = settings.pb_whitelist || [];
				defaultWhitelist = settings.pb_defaultWhitelist || [];

				var isDefaultWhiteListed = (0, _utils.isDomainInList)(host, defaultWhitelist);
				var isWhiteListed = (0, _utils.isDomainInList)(host, settings.pb_fullWhitelist);

				chrome.browserAction.getBadgeText({ tabId: tab.id }, function (result) {
					var resultMsg = $('#result-msg');
					var count = result ? result * 1 : 0;
					var rnd = Math.ceil(Math.random() * 5);
					var message = (0, _utils.getI18N)(count ? 'PP_XPopupsBlocked_' + rnd : 'PP_NoPopupsBlocked');

					if (count) {
						resultMsg.addClass('found-msg');
						resultMsg.find('.msg').html((0, _utils.getI18N)('PP_PopupsFound' + (count == 1 ? '_X1' : '')));
					} else {
						resultMsg.addClass('not-found-msg');
						resultMsg.find('.msg').html((0, _utils.getI18N)('PP_PopupsNotFound'));
					}

					$('.url').html(host);

					$('#count').addClass(count ? 'found' : 'not-found').html(message + '<span>' + (count || '') + '</span>');
				});

				$('#pauseSwitch').data('is-active', !settings.pb_pause);

				//set on/off state
				if (settings.pb_pause) {
					$('#container').addClass('off');
				}

				if (isWhiteListed) {
					$('#container').addClass('white-listed ' + (isDefaultWhiteListed ? 'internal' : ''));
				}

				sendGoogleAnalyticsEvent('Shown');
			});
		});

		$('html').addClass((0, _utils.getBrowser)());

		//# on/off button
		$('#pauseSwitch').on('click', function () {
			var paused = $(this).data('is-active');

			_PBStorageSync2.default.pb_pause.set(paused);

			setPausedMode(paused);
			sendGoogleAnalyticsEvent(paused ? 'Power_off' : 'Power_on', host);

			chrome.runtime.sendMessage({ name: 'createIconContextMenu', paused: paused });
			chrome.tabs.query({}, function (tabs) {
				$.each(tabs, function (i, tab) {
					chrome.tabs.sendMessage(tab.id, { name: 'toggleFunction', toggle: !paused });
				});
			});
			//so set the chrome icon too
			chrome.browserAction.setIcon({ path: paused ? '/images/icon128_g.png' : '/images/icon128.png' });

			if (paused) {
				sendToBackground('KeenIO', { event: 'switch-off:popup', post: { 'domain': host, 'url': tabUrl } });
			}
		});

		//# stop block pops/overs button
		$('#allow-pops').on('click', function () {
			sendGoogleAnalyticsEvent('Allow_popups', host);

			whitelist.push(host);
			_PBStorageSync2.default.pb_whitelist.set(whitelist);

			(0, _utils.updateWhitelist)(_PBStorageSync2.default);
			setWhiteListMode(true);

			chrome.tabs.sendMessage(tabId, { name: 'toggleFunction', toggle: false });
		});

		//# start block pops/overs button
		$('#block-pops').on('click', function () {
			sendGoogleAnalyticsEvent('Block_popups', host);

			whitelist.splice(whitelist.indexOf(host), 1);
			_PBStorageSync2.default.pb_whitelist.set(whitelist);

			(0, _utils.updateWhitelist)(_PBStorageSync2.default);
			setWhiteListMode(false);

			chrome.tabs.sendMessage(tabId, { name: 'toggleFunction', toggle: true });
		});

		$('#whitelist-block-pops').on('click', function () {
			var list = [];

			sendGoogleAnalyticsEvent('Block_popups_whitelist', host);

			defaultWhitelist = defaultWhitelist.filter(function (item) {
				return !(0, _utils.isDomainInList)(host, [item]);
			});

			_PBStorageSync2.default.pb_defaultWhitelist.set(defaultWhitelist);

			setWhiteListMode(false);

			chrome.tabs.sendMessage(tabId, { name: 'toggleFunction', toggle: true });
		});

		//# did we miss one?
		$('#report-button').on('click', function () {
			var el = $(this);
			var footer = $('#footer');
			var isOpen = footer.data('state') == 'open';
			var state = isOpen ? '' : 'open';
			var bottom = isOpen ? 0 : 138;

			$.when(footer.data({ state: state }).animate({
				bottom: bottom
			})).then(function () {
				el.toggleClass('hvr-icon-bob').toggleClass('hvr-icon-hang').addClass('paused');
			});

			sendGoogleAnalyticsEvent('Did_we_miss_one_up', host);
		});

		$('#report-button').on('mouseenter', function () {
			$(this).removeClass('paused');
		});

		//# report a popup
		$('#report-pop').on('click', function () {
			sendGoogleAnalyticsEvent('Report_popup', host);

			sendToBackground('reportPopup', { url: tabUrl, host: host, message: 'Report Site' });
			sendToBackground('KeenIO', { event: 'report-pop-not-blocked', post: { 'domain': host, 'url': tabUrl } });

			setTimeout(window.close, 500);
		});

		//# block overlay once
		$('#report-over').on('click', function () {
			sendGoogleAnalyticsEvent('Remove_overlay', host);
			sendToBackground('KeenIO', { event: 'remove-overlay:popup', post: { 'domain': host, 'url': tabUrl } });

			(0, _utils.sendToActiveTab)('manual-remove-overlay', { source: 'menu' });

			setTimeout(window.close, 50);
		});

		//# menu button
		$('#menu-button').on('click', function () {
			var container = $('#container');

			if (!container.is('.off')) {
				sendGoogleAnalyticsEvent('ThreeDotsMenu');

				$(this).addClass('on');
				$('#menu').show();
			}
		});

		$(document).on('click', function (e) {
			var target = $(e.target);
			var menuButton = $('#menu-button');
			var menu = $('#menu');

			if (!target.is(menuButton)) {
				menuButton.removeClass('on');
				menu.hide();
			}
		});

		//# stats button
		$('#menu .stats').on('click', function () {
			if (!statsOpen) {
				sendGoogleAnalyticsEvent('ThreeDotsMenu_Stats');
				resetStatsBar();

				_PBStorageSync2.default.pb_totalBlocksByType.get().then(function (blocks) {
					setStatsTotals(blocks);

					$('#main-stats').off('transitionend').on('transitionend', function () {
						setTimeout(function () {
							setStatsBars(blocks);
						}, 250);
					}).addClass('on');
				});

				statsOpen = true;
			}
		});

		//#close stats
		$('#stats-close').on('click', function () {
			$('#main-stats').removeClass('on');

			statsOpen = false;
		});

		//# settings button
		$('#menu .options').on('click', function () {
			var container = $('#container');

			if (!container.is('.off')) {
				sendGoogleAnalyticsEvent('ThreeDotsMenu_Options');

				chrome.tabs.create({ url: 'options.htm' });

				window.close(); //in firefox the window doesn't closed by itself
			}
		});

		//# menu
		$('#menu > li').on('click', function (e) {
			var action = e.target.className;
			var container = $('.message-container.' + action);

			if (container.length) {
				sendGoogleAnalyticsEvent('ThreeDotsMenu_' + action);

				container.show();
			}
		});

		//# messages
		$('.message-container .close').on('click', function (e) {
			return $(e.target).closest('.message-container').hide();
		});

		//# rating
		$('#rating > li').on('click', function (e) {
			var el = $(e.target);
			var rate = el.data('rate') * 1;

			if (rate <= 4) {
				chrome.tabs.create({ url: _const2.default.contact_page });
			} else {
				chrome.tabs.create({ url: _const2.default['extension_review_page_' + (0, _utils.getBrowser)()] });
			}

			sendGoogleAnalyticsEvent('Rating', rate);

			window.close(); //in firefox the window doesn't closed by itself
		});

		//# share
		$('#share > li').on('click', function (e) {
			var el = $(e.target);
			var position = el.offset();
			var media = el.data('media');

			switch (media) {
				case 'link':
					(0, _utils.copyTextToClipboard)(_const2.default['appStore_' + (0, _utils.getBrowser)()]);

					$('#pb-link-copied-message').remove();
					var msg = $('<div id="pb-link-copied-message">' + (0, _utils.getI18N)('PP_Share_LinkCopied') + '</div>').css({
						top: position.top + 35,
						left: position.left - 28
					}).appendTo('body').show().animate({
						opacity: 1
					}, 250);

					setTimeout(function () {
						return msg.animate({
							opacity: 0
						}, 250, function () {
							return msg.remove();
						});
					}, 2000);
					break;

				case 'twitter':
					window.open(_const2.default.twitter_share_link, 'poper_share', 'width=730,height=300,top=150,left=' + (screen.availWidth / 2 - 365));
					break;

				case 'facebook':
					window.open(_const2.default.facebook_share_link, 'poper_share', 'width=730,height=360,top=150,left=' + (screen.availWidth / 2 - 365));
					break;
			}

			sendGoogleAnalyticsEvent('Share', media);
		});

		//# chrome://extensions link, must be opened using JS
		$('#open-extensions').on('click', function () {
			chrome.tabs.create({ url: 'chrome://extensions' });
		});

		//# tooltip
		$('[data-tooltip]').on('mouseenter', function () {
			var el = $(this);
			var message = (0, _utils.getI18N)(el.data('tooltip'));
			var tooltip = $('#tooltip');
			var delay = el.data('tooltip-delay') != undefined ? el.data('tooltip-delay') * 1 : 1500;
			var flex = !!el.data('tooltip-flex');

			timer = setTimeout(function () {
				tooltip.find('.st-content').html(message);
				tooltip.css({ top: 0, left: 5, width: flex ? 'auto' : '95%' }).show();

				var elOffset = el.offset();
				var elWidth = el.outerWidth();
				var ttWidth = tooltip.outerWidth();
				var ttHeight = void 0,
				    ttTop = void 0,
				    ttLeft = void 0;
				var arrowLeft = void 0;

				ttHeight = tooltip.outerHeight();
				ttTop = elOffset.top - ttHeight - 8;
				ttLeft = flex ? Math.max(5, elOffset.left + elWidth / 2 - ttWidth / 2) : 5;

				arrowLeft = elOffset.left - ttLeft + elWidth / 2 - 7;

				tooltip.find('.st-arrow').css({ left: arrowLeft });
				tooltip.css({ top: ttTop, left: ttLeft }).addClass('active');
			}, delay);
		});

		$('[data-tooltip]').on('mouseleave', function () {
			var tooltip = $('#tooltip');

			if (timer) {
				clearTimeout(timer);
			}

			tooltip.removeClass('active').hide();
		});

		$('[data-translate]').each(function () {
			var el = $(this);

			el.html((0, _utils.getI18N)(el.data('translate')));
		});

		function setPausedMode(isActive) {
			var container = $('#container');
			var btn = $('#pauseSwitch');

			if (isActive) {
				container.addClass('off');
				btn.data('is-active', false).addClass('off');
			} else {
				container.removeClass("off");
				btn.data('is-active', true).removeClass('off');
			}
		}

		function setWhiteListMode(isWhiteListed) {
			var container = $('#container');

			if (isWhiteListed) {
				container.addClass('white-listed');
			} else {
				container.removeClass('white-listed');
			}
		}

		function setStatsTotals(blocks) {
			blocks = blocks || {};

			var overlays = blocks.overlay || 0;
			var tabs = blocks.tab || 0;
			var wins = blocks.win || 0;
			var total = overlays + tabs + wins;
			var secondsSaved = total * 3;

			$('#stats-total-blocked').html(total);
			$('#stats-total-saved').html(toHHMMSS(secondsSaved));
		}

		function setStatsBars(blocks) {
			blocks = blocks || {};

			var maxBarHeight = 80;
			var overlays = blocks.overlay || 0;
			var tabs = blocks.tab || 0;
			var wins = blocks.win || 0;
			var max = Math.max.apply(Math, [overlays, tabs, wins]);
			var oversBarH = Math.round(100 / (max / overlays) * maxBarHeight / 100);
			var tabsBarH = Math.round(100 / (max / tabs) * maxBarHeight / 100);
			var winsBarH = Math.round(100 / (max / wins) * maxBarHeight / 100);
			var barOverlays = $('#bar-overlays');
			var barOverlaysCount = barOverlays.parent().find('.block-count');
			var barTabs = $('#bar-tabs');
			var barTabsCount = barTabs.parent().find('.block-count');
			var barWindows = $('#bar-windows');
			var barWindowsCount = barWindows.parent().find('.block-count');

			barOverlays.animate({ height: oversBarH }, {
				duration: 1000,
				easing: 'easeOutQuad',
				progress: function progress(a, b, c) {
					var oversCount = Math.round(100 / (1 / b) * overlays / 100);
					var tabsCount = Math.round(100 / (1 / b) * tabs / 100);
					var winsCount = Math.round(100 / (1 / b) * wins / 100);

					barOverlaysCount.html(oversCount);
					barTabsCount.html(tabsCount);
					barWindowsCount.html(winsCount);
				}
			});

			barTabs.animate({ height: tabsBarH }, {
				duration: 1000,
				easing: 'easeOutQuad'
			});

			barWindows.animate({ height: winsBarH }, {
				duration: 1000,
				easing: 'easeOutQuad'
			});
		}

		function resetStatsBar() {
			var barOverlays = $('#bar-overlays');
			var barOverlaysCount = barOverlays.parent().find('.block-count');
			var barTabs = $('#bar-tabs');
			var barTabsCount = barTabs.parent().find('.block-count');
			var barWindows = $('#bar-windows');
			var barWindowsCount = barWindows.parent().find('.block-count');

			barOverlays.css({ height: 0 });
			barTabs.css({ height: 0 });
			barWindows.css({ height: 0 });

			barOverlaysCount.html(0);
			barTabsCount.html(0);
			barWindowsCount.html(0);
		}

		/*
	  send message to background to send google analytics event
	  sometimes we do not need the label
	 
	  */
		function sendGoogleAnalyticsEvent(action, label) {
			chrome.runtime.sendMessage({ name: "trackEvent", category: "Main_menu", action: action, label: label });
		}

		function sendToBackground(name, data) {
			chrome.runtime.sendMessage({ name: name, data: data || '' });
		}

		function toHHMMSS(sec_num) {
			var hours = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - hours * 3600) / 60);
			var seconds = sec_num - hours * 3600 - minutes * 60;

			return hours + 'h ' + minutes + 'm ' + seconds + 's';
		}

		$.easing['easeOutQuad'] = function (p) {
			return 1 - function (p) {
				return Math.pow(p, 2);
			}(1 - p);
		};
	});

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

/***/ })
/******/ ]);