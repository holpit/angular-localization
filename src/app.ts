/// <reference path="../typings/main.d.ts" />
/// <reference path="../typings/index.d.ts" />

var app = angular.module("localizationApp", []);

app.service('LanguageService', ['$q', '$http', function($q, $http){
    let cultures = [
       new Culture('it-IT', 'Italiano'),
       new Culture('en-US', 'English')
    ];
    return new LanguageService($q, $http, cultures, '/static/labels.json'); 
}]);