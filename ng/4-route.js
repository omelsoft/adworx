var app =  angular.module('adWorxApp', ['ngRoute', 'ngTable', 'angularUtils.directives.dirPagination']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/partners', {
            templateUrl: 'templates/Partners.html',
            controller: 'PartnerController'
        }).
        when('/publishers', {
            templateUrl: 'templates/Publishers.html',
            controller: 'PublishersController'
        }).
        when('/reports', {
            templateUrl: 'templates/Reports.html',
            controller: 'ReportsController'
        }).
        when('/placements', {
            templateUrl: 'templates/Placements.html',
            controller: 'PlacementsController'
        }).        
        when('/sites', {
            templateUrl: 'templates/Sites.html',
            controller: 'SitesController'
        }).
        when('/overview', {
            templateUrl: 'templates/Overview.html',
            controller: 'OverviewController'
        }).        
        when('/pubPartners', {
            templateUrl: '/app/templates/PubPartner.html',
            controller: 'PubPartnersController'
        }).
        when('/pubSites', {
            templateUrl: '/app/templates/PubSites.html',
            controller: 'PubSitesController'
        }).
        when('/pubPlacements', {
            templateUrl: '/app/templates/PubPlacements.html',
            controller: 'PubPlacementsController'
        }). 
        when('/pubReports', {
            templateUrl: '/app/templates/PubReports.html',
            controller: 'PubReportsController'
        }).                       
        otherwise({
            redirectTo: '/reports'
        });
    }
]);