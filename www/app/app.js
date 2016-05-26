/// <reference path="../typings/main.d.ts" />
/// <reference path="../typings/index.d.ts" />
var app = angular.module("localizationApp", []);
app.service('LanguageService', ['$q', '$http', function ($q, $http) {
        var cultures = [
            new Culture('it-IT', 'Italiano'),
            new Culture('en-US', 'English')
        ];
        return new LanguageService($q, $http, cultures, '/static/labels.json');
    }]);

var Culture = (function () {
    function Culture(_code, _description) {
        this._code = _code;
        this._description = _description;
    }
    Object.defineProperty(Culture.prototype, "code", {
        get: function () { return this._code; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Culture.prototype, "description", {
        get: function () { return this._description; },
        enumerable: true,
        configurable: true
    });
    return Culture;
}());



var LanguageService = (function () {
    function LanguageService($q, $http, _cultures, _labelsUrl) {
        this.$q = $q;
        this.$http = $http;
        this._cultures = _cultures;
        this._labelsUrl = _labelsUrl;
        this._cultures = this._cultures || new Array();
        if (0 === this._cultures.length) {
            this._cultures.push(new Culture('en-US', 'English'));
        }
        this._selectedCulture = this._cultures[0];
    }
    Object.defineProperty(LanguageService.prototype, "currentCulture", {
        get: function () {
            return this._selectedCulture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageService.prototype, "registeredCultures", {
        get: function () {
            return this._cultures;
        },
        enumerable: true,
        configurable: true
    });
    LanguageService.prototype.setCurrent = function (culture) {
        this._selectedCulture = culture || this._cultures[0];
    };
    LanguageService.prototype.getLabel = function (key) {
        var defer = this.$q.defer(), me = this;
        if (!this._labels || 0 === this._labels.length) {
            this.loadLabels().then(function () {
                defer.resolve(me.getLabelText(key));
            });
        }
        else {
            defer.resolve(this.getLabelText(key));
        }
        return defer.promise;
    };
    LanguageService.prototype.getLabels = function (keys) {
        var defer = this.$q.defer(), me = this, labels = new Array();
        keys = keys || [];
        if (!this._labels || 0 === this._labels.length) {
            this.loadLabels().then(function () {
                for (var i = 0; i != keys.length; ++i) {
                    labels.push(me.getLabelText(keys[i]));
                }
                defer.resolve(labels);
            });
        }
        else {
            for (var i = 0; i != keys.length; ++i) {
                labels.push(me.getLabelText(keys[i]));
            }
            defer.resolve(labels);
        }
        return defer.promise;
    };
    LanguageService.prototype.loadLabels = function () {
        var me = this;
        return this.$http.get(this._labelsUrl).then(function (response) {
            if (!response || 200 != response.status || !response.data) {
                return;
            }
            me._labels = {};
            var data = response.data;
            for (var code in data) {
                me._labels[code] = data[code];
            }
        });
    };
    LanguageService.prototype.getLabelText = function (key) {
        if (!key || "" === key.trim()) {
            return "";
        }
        var cultureLabels = this._labels[this._selectedCulture.code];
        if (!cultureLabels) {
            return key;
        }
        return cultureLabels[key];
    };
    return LanguageService;
}());

var LanguageController = (function () {
    function LanguageController(languageService) {
        this.languageService = languageService;
        this._cultures = null;
        this._cultures = languageService.registeredCultures;
    }
    Object.defineProperty(LanguageController.prototype, "cultures", {
        get: function () { return this._cultures; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageController.prototype, "currentCulture", {
        get: function () {
            return this.languageService.currentCulture;
        },
        set: function (val) {
            console.log('setting culture to: ' + val.description);
            this.languageService.setCurrent(val);
        },
        enumerable: true,
        configurable: true
    });
    LanguageController.$inject = ["LanguageService"];
    return LanguageController;
}());
app.controller("LanguageController", LanguageController);

var MainController = (function () {
    function MainController($scope, languageService) {
        this.$scope = $scope;
        this.languageService = languageService;
        this._title = '';
        this._description = '';
        var me = this;
        $scope.$watch(function () { return languageService.currentCulture; }, function (data) {
            console.log('culture changed to: ' + data.description);
            me.readLabels();
        }, true);
        this.readLabels();
    }
    MainController.prototype.readLabels = function () {
        var labelKeys = [
            'MAIN_TITLE', 'MAIN_DESCRIPTION'
        ];
        var me = this;
        this.languageService.getLabels(labelKeys).then(function (results) {
            me._title = results[0];
            me._description = results[1];
        });
    };
    Object.defineProperty(MainController.prototype, "title", {
        get: function () { return this._title; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainController.prototype, "description", {
        get: function () { return this._description; },
        enumerable: true,
        configurable: true
    });
    MainController.$inject = ["$scope", "LanguageService"];
    return MainController;
}());
app.controller("MainController", MainController);

//# sourceMappingURL=maps/app.js.map
