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
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _const = __webpack_require__(10);

	var _const2 = _interopRequireDefault(_const);

	var _utils = __webpack_require__(2);

	var _message = __webpack_require__(25);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function ($) {
	  var decodeData = decodeURIComponent(atob(location.search.substr(1)));
	  var data = JSON.parse(decodeData);

	  $(function () {
	    showNotification(data);
	  });

	  function showNotification(data) {
	    var message = new _message.Message({
	      config: _const2.default,
	      id: data.id,
	      title: data.title,
	      subTitle: data.subTitle,
	      icon: data.icon,
	      showHide: data.showHide,
	      showResize: data.showResize,
	      source: data.source,
	      size: data.size,
	      buttons: data.buttons.map(function (id) {
	        return {
	          id: id,
	          label: (0, _utils.getI18N)(id),
	          labelMin: (0, _utils.getI18N)(id + '_min', id)
	        };
	      }),
	      props: data.props
	    });

	    message.on('copyAppStoreLink', function () {
	      (0, _utils.copyTextToClipboard)(_const2.default['appStore_' + (0, _utils.getBrowser)()]);
	    });
	  }
	})(jQuery);

/***/ }),

/***/ 2:
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

/***/ 10:
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

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Message = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Message = exports.Message = function () {
	  function Message(options) {
	    _classCallCheck(this, Message);

	    this.template = $('#message-template').html();
	    this.message = this.render({ options: options });

	    return $(this);
	  }

	  _createClass(Message, [{
	    key: 'render',
	    value: function render(_ref) {
	      var _this = this;

	      var options = _ref.options;

	      var message = $(this.template).addClass('' + options.size).appendTo('body');

	      if (options.icon) {
	        message.find('.message-icon').html('<img src="' + options.icon + '">').removeClass('hidden');
	      }

	      if (options.title) {
	        message.find('.message-title').html(options.title).removeClass('hidden');
	      }

	      if (options.subTitle) {
	        message.find('.message-subtitle').html(options.subTitle).removeClass('hidden');
	      }

	      if (options.showHide) {
	        message.find('.message-hide').removeClass('hidden');
	      }

	      if (options.showResize) {
	        message.find('.message-resize').removeClass('hidden');
	      }

	      if (options.buttons.length) {
	        var buttons = message.find('.message-buttons').removeClass('hidden');

	        options.buttons.forEach(function (button) {
	          var btn = $('<div data-id="' + button.id + '" data-label="' + button.label + '" data-label-min="' + button.labelMin + '"></div>');

	          btn.on('click', function (e) {
	            var id = $(e.target).data('id');

	            parent.postMessage({ action: 'pb-message-btn-click', id: id, source: options.source, toastId: options.id }, '*');

	            _this.prevntBrowserBlock({ id: button.id, options: options });
	          });

	          btn.addClass('tooltip').data('tooltip', button.id + '_TT').data('tooltip-delay', 1500);

	          buttons.append(btn);
	        });
	      }

	      if (options.props.showStars) {
	        var stars = message.find('.message-stars').removeClass('hidden');
	        var hint = message.find('.stars-hint');

	        message.addClass('rating');

	        stars.on('mouseenter', 'span', function (e) {
	          var msg = (0, _utils.getI18N)('NTF_Stars_' + $(e.target).data('score'));

	          hint.html(msg);
	        });

	        stars.on('mouseleave', 'span', function (e) {
	          hint.html('');
	        });

	        stars.on('click', 'span', function (e) {
	          var score = $(e.target).data('score');

	          parent.postMessage({ action: 'pb-message-rating', score: score, source: options.source, toastId: options.id }, '*');
	        });
	      }

	      if (options.props.showShare) {
	        var share = message.find('.message-share').removeClass('hidden');

	        message.addClass('share');

	        share.on('click', 'span', function (e) {
	          var media = $(e.target).data('media');
	          var position = e.target.getBoundingClientRect();

	          //due to security reasons copy link must be inside the iframe
	          if (media == 'link') {
	            $(_this).trigger('copyAppStoreLink');
	          } else {
	            _this.prevntBrowserBlock(media);
	          }

	          parent.postMessage({ action: 'pb-message-share', media: media, position: { left: position.left, top: position.top }, toastId: options.id }, '*');
	        });
	      }

	      this.initEvents({ message: message, options: options });
	      this.initButtons({ message: message, options: options });
	      this.initTooltips({ message: message, options: options });

	      parent.postMessage({ action: 'pb-message-display', source: options.source, toastId: options.id }, '*');

	      return message;
	    }
	  }, {
	    key: 'initEvents',
	    value: function initEvents(_ref2) {
	      var _this2 = this;

	      var message = _ref2.message,
	          options = _ref2.options;

	      message.on('click', 'div[data-id]', function (e) {
	        parent.postMessage({ action: 'pb-message-close', triggerEvent: false, quickClose: true, toastId: options.id }, '*');
	      });

	      message.on('click', '.message-close', function () {
	        parent.postMessage({ action: 'pb-message-close', triggerEvent: true, source: options.source, toastId: options.id }, '*');
	      });

	      message.on('click', '.message-resize', function () {
	        options.size = options.size == 'maximized' ? 'minimized' : 'maximized';

	        message.toggleClass('maximized minimized');

	        _this2.initButtons({ message: message, options: options });
	        parent.postMessage({ action: 'message-resize', resize: options.size, toastId: options.id }, '*');
	      });

	      message.on('click', '.message-hide', function () {
	        parent.postMessage({ action: 'message-hide', toastId: options.id }, '*');
	      });
	    }
	  }, {
	    key: 'initButtons',
	    value: function initButtons(_ref3) {
	      var message = _ref3.message,
	          options = _ref3.options;

	      message.find('.message-buttons > div').each(function (i, btn) {
	        btn = $(btn);

	        btn.html(btn.data(options.size == 'maximized' ? 'label' : 'labelMin'));
	      });
	    }
	  }, {
	    key: 'initTooltips',
	    value: function initTooltips(_ref4) {
	      var message = _ref4.message,
	          options = _ref4.options;

	      message.find('.tooltip').each(function (i, btn) {
	        btn = $(btn);
	        var tooltip = btn.data('tooltip');
	        var tooltipDelay = btn.data('tooltip-delay') * 1;
	        var hoverTimeout = void 0;

	        btn.on('mouseover', function (e) {
	          hoverTimeout = setTimeout(function () {
	            var position = e.target.getBoundingClientRect();
	            var xCenter = position.left + e.target.offsetWidth / 2;
	            var yCenter = position.bottom;

	            parent.postMessage({ action: 'pb-message-tooltip-over', position: { xCenter: xCenter, yCenter: yCenter }, id: tooltip, toastId: options.id }, '*');
	          }, tooltipDelay);
	        }).on('mouseleave', function () {
	          clearTimeout(hoverTimeout);

	          parent.postMessage({ action: 'pb-message-tooltip-out', toastId: options.id }, '*');
	        });
	      });
	    }
	  }, {
	    key: 'prevntBrowserBlock',
	    value: function prevntBrowserBlock(_ref5) {
	      var id = _ref5.id,
	          options = _ref5.options;

	      var args = [];

	      switch (id) {
	        case 'allowOnce':
	        case 'allowAlways':
	          args = options.props.winArgs;
	          break;

	        case 'twitter':
	          args = [options.config.twitter_share_link, 'poper_share', 'width=730,height=260,top=150,left=' + (screen.availWidth / 2 - 365)];
	          break;

	        case 'facebook':
	          args = [options.config.facebook_share_link, 'poper_share', 'width=730,height=360,top=150,left=' + (screen.availWidth / 2 - 365)];
	          break;

	        default:
	          return;
	          break;
	      }

	      //if url doesn't have http in the beginning we need to add
	      if (!/^https?\:/.test(args[0]) && !/^about:blank/i.test(args[0])) {
	        //url can start with //site.com or just site.com
	        args[0] = 'http:' + (/^\/\//.test(args[0]) ? '' : '//') + args[0];
	      }

	      //in firefox you can't open a new tab directly with external url (don't know why, seems like FF bug)
	      //so we need to open a local html url and do a redirect
	      if (/firefox/i.test(navigator.userAgent)) {
	        args[0] = 'firefox/ff-open.html?u=' + encodeURIComponent(args[0]);
	      }

	      window.open(args[0] || '', args[1] || '', args[2] || '');
	    }
	  }]);

	  return Message;
	}();

/***/ })

/******/ });