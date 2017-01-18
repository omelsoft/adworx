/* AdWorxApp - v1.0.0 -  2017-01-17 10:01:14 */
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

app.factory('dataFactory', ['$http', function($http) {
  var myService = {
    httpRequest: function(url,method,params,dataPost,upload) {
      var passParameters = {};
      passParameters.url = url;
      if (typeof method == 'undefined'){
        passParameters.method = 'GET';
      }else{
        passParameters.method = method;
      }
      if (typeof params != 'undefined'){
        passParameters.params = params;
        passParameters.params = params;
      }
      if (typeof dataPost != 'undefined'){
        passParameters.data = dataPost;
      }
      if (typeof upload != 'undefined'){
         passParameters.upload = upload;
      }
      var promise = $http(passParameters).then(function (response) {
        if(typeof response.data == 'string' && response.data != 1){
          if(response.data.substr('loginMark')){
              location.reload();
              return;
          }
          $.gritter.add({
            title: 'Application',
            text: response.data
          });
          return false;
        }
        if(response.data.jsMessage){
          $.gritter.add({
            title: response.data.jsTitle,
            text: response.data.jsMessage
          });
        }
        return response.data;
      },function(){
        $.gritter.add({
          title: 'Application',
          text: 'An error occured while processing your request.'
        });
      });
      return promise;
    }
  };
  return myService;
}]);

function apiModifyTable(originalData,id,response){
    angular.forEach(originalData, function (item,key) {
        if(item.id == id){
            originalData[key] = response;
        }
    });
    return originalData;
}

(function(){
	
	$('.txtedit').each(function(){
		var input = $(this).val();
		$(this).on('keyup', function(){
			$(this).val(input.replace(/,/g, ''));
		});
	});

})();

app.controller('MainController', ['$scope', function($scope) {
    $scope.$on('LOAD', function() {
        $scope.loading = true;
    });
    $scope.$on('UNLOAD', function() {
        $scope.loading = false;
    });

    $scope.sortKey = 'id';
    $scope.sort = function(key) {
        $scope.sortKey = key;
        $scope.reverse = !$scope.reverse;
    }

    $scope.sortReportKey = '';
    $scope.sortReport = function(key) {
        $scope.sortReportKey = key;
        $scope.reverseReport = !$scope.reverseReport;
    }
}]);


app.controller('OverviewController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.data = [];
    $scope.reports = [];
    $scope.metric = 'Revenue';
    $scope.metrics = ['eCPM', 'Impressions', 'Revenue'];
    $scope.overall = {
        ecpm: 0,
        impressions: 0,
        revenue: 0
    };
    $scope.filter = {
        'site': '',
        'siteId': 0,
        'partner': '',
        'placement': '',
        'placementId': 0,
        'placementBySite': [],
        'placementByPartner': [],
        'placementFiltered': [],
        'filteredSite': false,
        'filteredPartner': false
    };
    $scope.activeMenu = 'reports';

    init();

    function init() {
        rangeFilter();
        initReportFilters();
        generateReports();
    }

    function initReportFilters() {
        var filter = $scope.filter;

        filter.site = 'All Sites';
        filter.partner = 'All Partners';
        filter.placement = 'Overall';

        dataFactory.httpRequest('app/../reporting/reportFilters/' + $scope.pubId).then(function(filters) {
            $scope.filters = filters;
        });
    }

    $scope.filterBySite = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (index != undefined && id != undefined) {
            filter.site = $scope.filters.sites[index]['siteName'];

            $scope.filter.placementBySite = [];

            if (filter.partnerId) {
                filter.placementBySite = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id && (placements[placement]['partnerId']) == filter.partnerId) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.siteId = id;
            filter.placement = 'Overall';
            filter.filteredSite = true;

            filterBySite($scope.pubId, filter.siteId, filter.placementId, $scope.filter.range);

        } else {
            filter.site = 'All Sites';
            $scope.filter.placementBySite = [];
            filter.siteId = '';
            filter.filteredSite = false;
            generateReports();
        }

        console.log(filter);
    }

    function filterBySite(pubid, siteid, placementid, range) {
        dataFactory.httpRequest('app/../reporting/generateReport/' + pubid + '/' + siteid + '/' + placementid + '/' + range).then(function(response) {
            $scope.data = response;
            $scope.reports = response.reports;
            console.log(response);
            defaultPropertiesGraph(response);
        });
    }

    $scope.filterByPartner = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (index != undefined && id != undefined) {
            filter['partner'] = $scope.filters.partners[index]['name'];

            $scope.filter.placementByPartner = [];

            if (filter.siteId) {
                filter.placementByPartner = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if (placements[placement]['partnerId'] == id && (placements[placement]['siteId']) == filter.siteId) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }

            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['partnerId']) == id) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.partnerId = id;
            filter.placement = 'Overall';
            filter.filteredPartner = true;

        } else {
            filter.partner = 'All Partners';
            $scope.filter.placementByPartner = [];
            filter.partnerId = '';
            filter.filteredPartner = false;
        }
        // console.log(filter);
    }

    $scope.filterByPlacement = function(placement) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (placement != undefined) {
            filter['placement'] = placement['placementName'];

            $scope.filter.placementId = placement['placementId'];

        } else {
            filter['placement'] = 'All Placements';
            filter.placementId = '';
        }
        // console.log(placement);
    }

    $scope.filterByRange = function(range, start, end) {
        $scope.filter.range = range;
        console.log($scope.filter.siteId);
        if ($scope.filter.siteId) {
            filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range);
        } else {
            generateReports();
        }
    }

    function rangeFilter() {
        var ranges = [
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Last 7 Days',
            'Last 14 Days',
            'Last 30 Days',
            'Last 60 Days',
            'Last Month',
            'This Month',
            'Custom'
        ];
        $scope.filter.ranges = ranges;
        $scope.filter.range = 'Last 30 Days';
    }

    function generateReports() {
        dataFactory.httpRequest('app/../reporting/display/' + $scope.pubId + '/' + $scope.filter.range).then(function(data) {
            $scope.data = data;
            $scope.reports = data.reports;
            defaultPropertiesGraph(data);
        });
    }

    function prepareReports() {
        var data = $scope.reports;
        var reports = [],
            count = 0;

        for (var report in data) {
            count = count + 1;
            reports[count] = data[report];
        }
        if (count <= 1) {
            var report = reports[1];
            plotData(report);
        } else {
            plotData(data, count, true);
        }
    }

    $scope.filterByMetric = function(metric) {
        $scope.metric = metric;
        defaultPropertiesGraph($scope.data);
    }

    function defaultPropertiesGraph(data) {

        $scope.property = [];

        var p = $scope.property;
        var reports = data.reports;
        var property = [];
        var properties = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertyData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var partnerData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertySeries = [];
        var propertyYAxis = [];

        for (var sites in reports) {
            p.push(sites);
        }

        if (p.length) {

            for (var i = 0; i < p.length; i++) {
                // Iterate tru each property
                property[p[i]] = {
                    site: p[i],
                    partners: reports[p[i]]
                }
            }
            console.log(property);
        }

        for (var site in property) {
            var partners = property[site].partners;
            var date = [],
                impressions = [],
                ecpm = [],
                revenue = [];

            for (var partner in partners) {
                var r = partners[partner];

                for (var d = 0; d < r.date.length; d++) {

                    var imps = parseFloat(r.impressions[d]),
                        rev = roundToTwo(parseFloat(r.revenue[d]));

                    date[d] = r.date[d];
                    impressions[d] = (parseFloat(impressions[d]) ? parseFloat(impressions[d]) : 0) + parseFloat(imps);
                    revenue[d] = roundToTwo((parseFloat(revenue[d]) ? roundToTwo(parseFloat(revenue[d])) : 0) + roundToTwo(rev));

                    var cpm = parseFloat(revenue[d]) / (parseFloat(impressions[d]) / 1000);
                    ecpm[d] = isNaN(parseFloat(cpm)) ? 0 : roundToTwo(parseFloat(cpm));

                }

                partnerData.date.push(date);
                partnerData.ecpm.push(ecpm);
                partnerData.impressions.push(impressions);
                partnerData.revenue.push(revenue);

            }

            propertyData.date.push(date);
            propertyData.ecpm.push(ecpm);
            propertyData.impressions.push(impressions);
            propertyData.revenue.push(revenue);

        }

        var propData = [],
            idx = 0;

        for (var ps in property) {
            propData.push({
                site: ps,
                date: propertyData.date[idx],
                data: {
                    'ecpm': propertyData.ecpm[idx],
                    'impressions': propertyData.impressions[idx],
                    'revenue': propertyData.revenue[idx],
                    overall: {
                        revenue: parseFloat(propertyData.revenue[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0).toFixed(2)),
                        impressions: propertyData.impressions[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0)
                    }
                }
            });
            idx = idx + 1;
        }

        $scope.overall = {
            revenue: 0,
            impressions: 0,
            ecpm: 0
        }

        for (var series in propData) {

            switch ($scope.metric) {
                case 'Revenue':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'spline',
                        yAxis: 1,
                        data: propData[series].data.revenue,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'eCPM':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'spline',
                        yAxis: 1,
                        data: propData[series].data.ecpm,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'Impressions':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'spline',
                        yAxis: 1,
                        data: propData[series].data.impressions,
                        tooltip: {
                            valuePrefix: ''
                        }
                    });
                    break;
            }

            var or = propData[series].data.overall.revenue,
                oi = parseFloat(propData[series].data.overall.impressions);

            $scope.overall.revenue = parseFloat($scope.overall.revenue) ? parseFloat($scope.overall.revenue) + or : or;
            $scope.overall.impressions = parseFloat($scope.overall.impressions) ? parseFloat($scope.overall.impressions + oi) : oi;

            var oe = parseFloat(roundToTwo(isNaN($scope.overall.revenue / ($scope.overall.impressions / 1000)) ? 0 : $scope.overall.revenue / ($scope.overall.impressions / 1000)));
            $scope.overall.ecpm = oe;

        }
        console.log($scope.overall);

        switch ($scope.metric) {
            case 'Revenue':
                propertyYAxis.push({ // Primary yAxis
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'Revenue',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true

                });
                break;

            case 'eCPM':
                propertyYAxis.push({ // Secondary yAxis
                    gridLineWidth: 0,
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: 'eCPM',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
                });
                break;

            case 'Impressions':
                propertyYAxis.push({ // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Impressions',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true
                });
                break;
        }

        var range = $scope.filter.range;
        var site = $scope.filter.site;
        var metric = $scope.metric;

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: site
            },
            subtitle: {
                text: range
            },
            xAxis: [{
                categories: propData[0].date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: metric,
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                }
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 55,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: propertySeries,
            credits: {
                enabled: false
            }
        });
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    function plotData(report, count, overall) {

        var date = [],
            impressions = [],
            ecpm = [],
            revenue = [];
        if (overall == true && count >= 2) {

            for (var r in report) {
                p = report[r];
                for (var i = 0; i < p.date.length; i++) {
                    date[i] = p.date[i];
                    impressions[i] = (Number(impressions[i]) ? Number(impressions[i]) : 0) + Number(p.impressions[i]);
                    revenue[i] = (Number(revenue[i]) ? Number(revenue[i]) : 0) + Number(p.revenue[i]);
                    ecpm[i] = Number(revenue[i] / (impressions[i] / 1000));
                }
            }

            // report.title = ['Overall'];
            // report.subTitle = ['Year To Date'];
            // console.log(report);
        } else {
            // console.log(report);
            for (var i = 0; i < report.date.length; i++) {
                date[i] = report.date[i];
                impressions[i] = Number(report.impressions[i]);
                ecpm[i] = Number(report.ecpm[i]);
                revenue[i] = Number(report.revenue[i]);
            }
        }

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: report.title
            },
            subtitle: {
                text: report.subTitle
            },
            xAxis: [{
                categories: date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '$ {value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: 'Earnings',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'eCPM',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '$ {value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }

            }, { // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Impressions',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 55,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'eCPM',
                type: 'spline',
                yAxis: 1,
                data: ecpm,
                tooltip: {
                    valuePrefix: '$ '
                }
            }, {
                name: 'Impressions',
                type: 'spline',
                yAxis: 2,
                data: impressions,
                marker: {
                    enabled: true
                },
                tooltip: {
                    valueSuffix: ''
                }

            }, {
                name: 'Earnings',
                type: 'spline',
                data: revenue,
                tooltip: {
                    valuePrefix: '$ '
                }
            }]
        });
    }

}]);


app.controller('PartnerController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.partners = [];
    $scope.pageNumber = 1;
    $scope.libraryTemp = {};
    $scope.totalItemsTemp = {};
    $scope.totalItems = 0;
    $scope.activeMenu = 'partners';

    getPartners(1);
    $scope.pageChanged = function(newPage) {
        getPartners(newPage);
    };

    function getPartners(pageNumber) {
        $scope.$emit('LOAD');
        dataFactory.httpRequest('partners/?page=' + pageNumber).then(function(data) {
            $scope.partners = data.data;
            $scope.totalItems = data.total;
            $scope.pageNumber = pageNumber;
            $scope.$emit('UNLOAD');
        });
    }
    $scope.searchDB = function() {
        if ($scope.searchText.length >= 3) {
            if ($.isEmptyObject($scope.libraryTemp)) {
                $scope.libraryTemp = $scope.partners;
                $scope.totalItemsTemp = $scope.totalItems;
                $scope.partners = {};
            }
            getPartners(1);
        } else {
            if (!$.isEmptyObject($scope.libraryTemp)) {
                $scope.partners = $scope.libraryTemp;
                $scope.totalItems = $scope.totalItemsTemp;
                $scope.libraryTemp = {};
            }
        }
    }
    $scope.addPartner = function() {
        var partner = $scope.form;
        dataFactory.httpRequest('partnersCreate/?name=' + partner['name'] + '&alias=' + partner['alias'] + '&url=' + partner['partnerSite']).then(function(data) {
            $scope.partners.push(data);
            getPartners(1);
            $(".modal").modal("hide");
        });
    }
    $scope.editPartner = function(id) {
        console.log(id);
        dataFactory.httpRequest('partnersEdit/' + id).then(function(data) {
            $scope.form = data;
        });
    }
    $scope.updatePartner = function() {
        dataFactory.httpRequest('partnersUpdate/' + $scope.form.id, 'PUT', {}, $scope.form).then(function(data) {
            $(".modal").modal("hide");
            $scope.partners = apiModifyTable($scope.partners, data.id, data);
        });
    }
    $scope.removePartner = function(partner, index) {
        var result = confirm("Are you sure delete this item?", "Delete");
        if (result) {
            dataFactory.httpRequest('partnersDelete/' + partner.id, 'DELETE').then(function(data) {
                $scope.partners.splice(index, 1);
                getPartners(1);
            });
        }
    }
    $scope.reset = function() {
        $scope.form = [];
    }
}]);


app.controller('PlacementsController', ['dataFactory', '$scope', '$http', 'NgTableParams', function(dataFactory, $scope, $http, NgTableParams) {

    $scope.totalPlacements = [];

    init();
    $scope.pageChanged = function(newPage) {
        if ($scope.filteredBySite && !$scope.filteredByPartner) {
            $scope.pageNum = newPage;
            $scope.filterBySite($scope.filter.indexSite, $scope.siteId);
        } else if ($scope.filteredBySite && $scope.filteredByPartner) {
            $scope.pageNum = newPage;
            $scope.filterByPartner($scope.filter.indexPartner, $scope.partnerId);
        } else {
            getPlacements(newPage, $scope.pubId);
            $scope.pageNum = newPage;
        }
    };

    function getPlacements(pageNum, pubId) {
        $scope.filter.placementName = '';
        $scope.reportViewed = false;
        $scope.$emit('LOAD');
        dataFactory.httpRequest('app/../pubplacements/?page=' + pageNum + '&pubId=' + pubId).then(function(data) {
            $scope.pubPlacements = data.pubPlacements;
            $scope.totalPlacements = data.total;
            $scope.$emit('UNLOAD');
            console.log(data.pubPlacements);
        });
    }

    function init() {
        $scope.pageNum = 1;
        $scope.pageReport = 1;
        $scope.filter = {
            indexSite: 0,
            indexPartner: 0,
            site: 'All Sites',
            partner: 'All Partners',
            partnerAlias: '',
            placementName: ''
        };
        $scope.siteId = 0;
        $scope.partnerId = 0;
        $scope.filteredBySite = 0;
        $scope.filteredByPartner = 0;
        $scope.cell = [];
        $scope.rows = {
            data: [],
            selected: {},
            partner: '',
            index: 0
        };
        $scope.reportViewed = false;
        $scope.activeMenu = 'placements';
        getPlacements(1, $scope.pubId);
        initData();
    }

    function initData() {
        dataFactory.httpRequest('app/../initPlacementsData/' + $scope.pubId).then(function(data) {
            $scope.pubSites = data.pubSites;
            $scope.pubPartners = data.pubPartners;
            console.log($scope.pubPartners);
        });
    }

    $scope.filterBySite = function(index, id) {
        if (index != undefined && id != undefined) {
            $scope.siteId = id;
            $scope.filter.site = $scope.pubSites[index].siteName;
            $scope.filter.indexSite = index;
            $scope.filter.placementName = '';
            $scope.filteredBySite = 1;

            $scope.totalReports = 0;
            $scope.dataReports = {};
            $scope.reportViewed = false;
            $scope.$emit('LOAD');
            dataFactory.httpRequest('app/../publishers/pubPlacementsBySite/?page=' + $scope.pageNum + '&siteId=' + $scope.siteId + '&partnerId=' + $scope.partnerId + '&pubId=' + $scope.pubId).then(function(data) {
                $scope.pubPlacements = data.pubPlacements;
                $scope.totalPlacements = data.total;
                $scope.$emit('UNLOAD');
                console.log(data);
            });

        } else {
            init();
        }
    }

    $scope.filterByPartner = function(index, id) {
        if (index != undefined && id != undefined) {
            $scope.partnerId = id;
            $scope.filter.partnerAlias = $scope.pubPartners[index].alias;
            $scope.filter.partner = $scope.pubPartners[index].name;
            $scope.filter.indexPartner = index;
            $scope.filter.placementName = '';
            $scope.filteredByPartner = 1;

            $scope.totalReports = 0;
            $scope.dataReports = {};
            $scope.reportViewed = false;
            $scope.$emit('LOAD');
            dataFactory.httpRequest('app/../publishers/pubPlacementsByPartner/?page=' + $scope.pageNum + '&siteId=' + $scope.siteId + '&partnerId=' + $scope.partnerId + '&pubId=' + $scope.pubId).then(function(data) {
                $scope.pubPlacements = data.pubPlacements;
                $scope.totalPlacements = data.total;
                $scope.$emit('LOAD');
                console.log(data);
            });
        } else {
            $scope.pageNum = 1;
            $scope.filter.partner = 'All Partners';
            $scope.filter.partnerAlias = '';
            $scope.partnerId = 0;
            $scope.filteredBySite = 1;
            $scope.filteredByPartner = 0;
            $scope.filterBySite($scope.filter.indexSite, $scope.siteId);
        }
    }

    $scope.pageReportChange = function(newPage) {
        $scope.pageReport = newPage;
        var q = {
            alias: $scope.partner,
            id: $scope.placementid
        }
        $scope.viewReportsByPlacement(q);
    }

    $scope.viewReportsByPlacement = function(data) {
        $scope.reportViewed = true;
        $scope.partner = data.alias;
        $scope.placementid = data.id;

        $scope.$emit('LOAD');
        dataFactory.httpRequest('app/../publishers/viewReportsByPlacement/?page=' + $scope.pageReport + '&partner=' + data.alias + '&placementId=' + data.id).then(function(data) {
            $scope.totalReports = data.reports.total;
            $scope.dataReports = data.reports.data;
            $scope.$emit('UNLOAD');
            // console.log($scope.dataReports);
        });
        $scope.filter.placementName = data.placementName;
    }

}]);


app.controller('PublishersController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.publishers = [];
    $scope.pageNum = 1;
    $scope.totalPublishers = 0;
    $scope.activeMenu = 'publishers';

    $scope.pageChanged = function(newPage) {
        getPublishers(newPage);
    };

    getPublishers(1);

    function getPublishers(pageNum) {
        $scope.$emit('LOAD');
        dataFactory.httpRequest('publishers/?page=' + pageNum).then(function(data) {
            $scope.publishers = data.publishers;
            $scope.totalPublishers = data.total;
            $scope.$emit('UNLOAD');
        });
    }
}]);


app.controller('PubPartnersController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.publishers = [];
    $scope.pageNum = 1;
    $totalPublishers = 0;
    $scope.activeMenu = 'partners';

    $scope.pageChanged = function(newPage) {
        getPubPartners(newPage, $scope.pubId);
        $scope.pageNum = newPage;
    };

    getPubPartners(1, $scope.pubId);

    function getPubPartners(pageNum, pubId) {
        $scope.$emit('LOAD');
        dataFactory.httpRequest('/app/pub/pubpartners/?page=' + pageNum + '&pubId=' + pubId).then(function(data) {
            $scope.pubPartners = data.pubPartners;
            $scope.totalPartners = data.total;
            $scope.$emit('UNLOAD');
            console.log(data);
        });
    }

    $scope.updateStatus = function(data) {
        $scope.$emit('LOAD');
        dataFactory.httpRequest('/app/pub/updatePartnerStatus/?page=' + $scope.pageNum + '&pubId=' + data.pubId + '&partnerId=' + data.partnerId + '&status=' + data.status).then(function(response) {
            $scope.pubPartners = response.pubPartners;
            $scope.$emit('UNLOAD');
        });
    }
}]);


app.controller('PubPlacementsController', ['dataFactory', '$scope', '$http', 'NgTableParams', function(dataFactory, $scope, $http, NgTableParams) {

    $scope.totalPlacements = [];

    init();

    function init() {
        $scope.pageNum = 1;
        $scope.pageReport = 1;
        $scope.filter = {
            site: 'All Sites',
            indexSite: 0,
            indexPartner: 0,
            partner: 'All Partners',
            partnerAlias: '',
            placementName: '',
            ranges: rangeFilter(),
            range: 'Last 30 Days',
            start: null,
            end: null,
            limit: 7,
            rowsPerPage: [7, 15, 30, 60, 90, 'All']

        };
        rangeFilter();
        $scope.siteId = 0;
        $scope.partnerId = 0;
        $scope.filteredBySite = 0;
        $scope.filteredByPartner = 0;
        $scope.selectedPlacement = {};
        $scope.cell = [];
        $scope.rows = {
            data: [],
            selected: {},
            partner: '',
            index: 0
        };
        $scope.search = {
            placements: [],
            placement: ''
        };
        $scope.placementFilter = {
            siteName: '',
            name: '',
            placementName: ''
        };
        $scope.reportViewed = false;
        $scope.editMode = 0;
        $scope.add = 0;
        $scope.activeMenu = 'placements';
        allPlacements();
        initData();
    }

    function rangeFilter() {
        var ranges = [
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Last 7 Days',
            'Last 14 Days',
            'Last 30 Days',
            'Last 60 Days',
            'Last Month',
            'This Month'
        ];
        return ranges;
    }

    // Initializes filters. Get sites and active ad partners.
    function initData() {
        dataFactory.httpRequest('/app/pub/initPlacementsData/' + $scope.pubId).then(function(data) {
            $scope.pubSites = data.pubSites;
            $scope.pubPartners = data.pubPartners;
        });
    }

    $scope.pageChanged = function(newPage) {
        if ($scope.filteredBySite && !$scope.filteredByPartner) {
            $scope.pageNum = newPage;
            $scope.filterBySite($scope.filter.indexSite, $scope.siteId);
        } else if ($scope.filteredBySite && $scope.filteredByPartner) {
            $scope.pageNum = newPage;
            $scope.filterByPartner($scope.filter.indexPartner, $scope.partnerId);
        } else {
            getPlacements(newPage, $scope.pubId);
            $scope.pageNum = newPage;
        }
    };

    function allPlacements() {
        dataFactory.httpRequest('/app/pub/allplacements', 'POST', {
            pubId: $scope.pubId
        }).then(function(data) {
            $scope.search.placements = data;
        });
    }

    $scope.addPlacement = function() {
        var p = $scope.placement;
        var data = {
            pubId: $scope.pubId,
            name: p['placementName'],
            siteId: p['siteId'],
            partnerId: p['partnerId']
        };
        dataFactory.httpRequest('/app/pub/addNewPlacement', 'POST', data).then(function(data) {
            $scope.pubPlacements = data.pubPlacements;
            $scope.totalPlacements = data.total;
            getPlacements($scope.pageNum, $scope.pubId);
            $scope.placement = [];
            $(".modal").modal("hide");
        });
    }

    $scope.filterSite = function(site) {
        $scope.placementFilter.siteName = site;
        if (site != '') $scope.filteredBySite = 1;

        $scope.totalReports = 0;
        $scope.dataReports = [];
        $scope.reportViewed = false;
    }

    $scope.filterBySite = function(index, id) {
        if (index != undefined && id != undefined) {
            $scope.siteId = id;
            $scope.filter.site = $scope.pubSites[index].siteName;
            $scope.filter.indexSite = index;
            $scope.filter.placementName = '';
            $scope.filteredBySite = 1;

            $scope.totalReports = 0;
            $scope.dataReports = {};
            $scope.reportViewed = false;

            $scope.$emit('LOAD');
            var filter = {
                page: $scope.pageNum,
                pubId: $scope.pubId,
                siteId: $scope.siteId,
                partnerId: $scope.partnerId
            };
            dataFactory.httpRequest('/app/pub/pubPlacementsBySite', 'POST', filter).then(function(data) {
                $scope.pubPlacements = data.pubPlacements;
                $scope.totalPlacements = data.total;
                $scope.$emit('UNLOAD');
                console.log(data);
            });

        } else {
            init();
        }
    }

    $scope.filterPartner = function(partner) {
        $scope.placementFilter.name = partner;
        if (partner != '') $scope.filteredByPartner = 1;

        $scope.totalReports = 0;
        $scope.dataReports = [];
        $scope.reportViewed = false;
    }

    $scope.filterByPartner = function(index, id) {
        if (index != undefined && id != undefined) {
            $scope.partnerId = id;
            $scope.filter.partnerAlias = $scope.pubPartners[index].alias;
            $scope.filter.partner = $scope.pubPartners[index].name;
            $scope.filter.indexPartner = index;
            $scope.filter.placementName = '';
            $scope.filteredByPartner = 1;

            $scope.totalReports = 0;
            $scope.dataReports = {};
            $scope.reportViewed = false;
            $scope.$emit('LOAD');
            var filter = {
                page: $scope.pageNum,
                pubId: $scope.pubId,
                siteId: $scope.siteId,
                partnerId: $scope.partnerId
            };
            dataFactory.httpRequest('/app/pub/pubPlacementsByPartner', 'POST', filter).then(function(data) {
                $scope.pubPlacements = data.pubPlacements;
                $scope.totalPlacements = data.total;
                $scope.$emit('UNLOAD');
                console.log(data);
            });
        } else {
            $scope.pageNum = 1;
            $scope.filter.partner = 'All Partners';
            $scope.filter.partnerAlias = '';
            $scope.partnerId = 0;
            $scope.filteredBySite = 1;
            $scope.filteredByPartner = 0;
            $scope.filterBySite($scope.filter.indexSite, $scope.siteId);
        }
    }

    $scope.resetPlacementFilter = function() {
        $scope.placementFilter.placementName = '';

    }

    $scope.pageReportChange = function(newPage) {
        $scope.pageReport = newPage;
        var q = {
            alias: $scope.partner,
            id: $scope.placementid
        }
        $scope.viewReportsByPlacement(q);
    }

    $scope.viewReportsByPlacement = function(data) {
        $scope.reportViewed = true;
        $scope.partner = data.alias;
        $scope.placementid = data.id;
        $scope.selectedPlacement = data;

        $scope.$emit('LOAD');
        var filter = {
            data: {
                page: $scope.pageReport,
                partner: data.alias,
                placementId: data.id,
                range: $scope.filter.range,
                start: $scope.filter.start,
                end: $scope.filter.end,
                limit: $scope.filter.limit
            }
        };

        dataFactory.httpRequest('/app/pub/viewReportsByPlacement', 'POST', filter).then(function(data) {
            $scope.totalReports = data.reports.total;
            $scope.dataReports = data.reports.data;
            $scope.$emit('UNLOAD');
            // console.log($scope.dataReports);
        });
        $scope.filter.placementName = data.placementName;
    }

    $scope.filterByRange = function(range) {
        $scope.filter.range = range;
        if (range == 'Custom' && $scope.filter.start == null && $scope.filter.end == null) return;
        $scope.viewReportsByPlacement($scope.selectedPlacement);
    }

    $scope.filterByRangeCustom = function(range) {
        $scope.filter.range = range;
        $scope.viewReportsByPlacement($scope.selectedPlacement);
    }

    $scope.filterByRangeLimit = function(limit) {
        $scope.filter.limit = limit;
        $scope.viewReportsByPlacement($scope.selectedPlacement);
    }

    $scope.editRow = function(row, index) {

        $scope.rows.data = angular.copy(row);
        $scope.rows.selected = angular.copy(row);
        $scope.rows.partner = $scope.partner;
        $scope.rows.index = index;
        $scope.editMode = 1;
    }

    $scope.saveRow = function() {
        $scope.dataReports[$scope.rows.index] = $scope.rows.data;
        dataFactory.httpRequest('/app/pub/updateReportByPlacement', 'GET', $scope.rows).then(function(data) {
            $scope.dataReports[$scope.rows.index] = data;
        });
        $scope.editMode = 0;
        $scope.rows.selected = {};
    }
    $scope.editAll = function() {

        $scope.rows.data = angular.copy($scope.dataReports);
        $scope.rows.selected = angular.copy($scope.dataReports);
        $scope.rows.partner = $scope.partner;
        $scope.editMode = 2;
        console.log($scope.rows);
    }

    $scope.saveAll = function() {
        var allData = {
            data: {
                data: $scope.rows.data
            },
            partner: $scope.partner
        };
        $scope.dataReports = $scope.rows.data;
        dataFactory.httpRequest('/app/pub/updateReportByPlacement', 'POST', allData).then(function(data) {
            $scope.dataReports = data;
        });
        $scope.editMode = 0;
        $scope.rows.selected = {};
        console.log($scope.rows);
    }

    $scope.cancelEdit = function() {
        $scope.add = 0;
        $scope.editMode = 0;
        $scope.rows.data = [];
        $scope.rows.selected = {};
    }

    $scope.addNewReport = function() {
        $scope.add = 1;
        console.log($scope.add);
    }

    $scope.saveNewReport = function(data) {
        $scope.rows.new.pubId = $scope.pubId;
        $scope.rows.new.placementid = $scope.placementid;
        console.log(data);
        var report = {
            data: $scope.rows.new,
            partner: $scope.partner
        }

        dataFactory.httpRequest('/app/reporting/addNewReport', 'POST', report);

        var q = {
            alias: $scope.partner,
            id: $scope.placementid
        }
        $scope.viewReportsByPlacement(q);

        $scope.add = 0;
        $scope.rows.new = {};
    }

    $scope.cancelReport = function() {
        $scope.add = 0;
    }

}]);

app.filter('placementFilter', [function($filter) {
    return function(inputArray, searchCriteria, txnType) {
        if (!angular.isDefined(searchCriteria) || searchCriteria == '') {
            return inputArray;
        }
        var data = [];
        angular.forEach(inputArray, function(item) {
            if (item.txnType == txnType) {
                if (item.payee.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) != -1) {
                    data.push(item);
                }
            }
        });
        return data;
    };
}]);


app.controller('PubReportsController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {

    $scope.data = [];
    $scope.reports = [];
    $scope.metric = 'Revenue';
    $scope.metrics = ['eCPM', 'Impressions', 'Revenue'];
    $scope.overall = {
        ecpm: 0,
        impressions: 0,
        revenue: 0
    };
    $scope.filter = {
        'site': '',
        'siteId': 0,
        'partner': '',
        'placement': '',
        'placementId': 0,
        'placementBySite': [],
        'placementByPartner': [],
        'placementFiltered': [],
        'filteredSite': false,
        'filteredPartner': false,
        'start': null,
        'end': null
    };
    $scope.activeMenu = 'reports';

    init();

    function init() {
        rangeFilter();
        initReportFilters();
        generateReports(null, null);
    }

    function initReportFilters() {
        var filter = $scope.filter;

        filter.site = 'All Sites';
        filter.partner = 'All Partners';
        filter.placement = 'Overall';

        $scope.$emit('LOAD');
        dataFactory.httpRequest('/app/reporting/reportFilters/' + $scope.pubId).then(function(filters) {
            $scope.filters = filters;
            $scope.$emit('UNLOAD');
        });
    }

    $scope.filterBySite = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if ($scope.filter.range == 'Custom' && $scope.filter.start == null && $scope.filter.end == null) $scope.filter.range = 'Last 30 Days';

        if (index != undefined && id != undefined) {
            filter.site = $scope.filters.sites[index]['siteName'];

            $scope.filter.placementBySite = [];
            $scope.$emit('LOAD');
            if (filter.partnerId) {
                filter.placementBySite = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id && (placements[placement]['partnerId']) == filter.partnerId) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.siteId = id;
            filter.placement = 'Overall';
            filter.filteredSite = true;

            if ($scope.filter.start != null || $scope.filter.end != null) {
                filterBySite($scope.pubId, filter.siteId, filter.placementId, $scope.filter.range, $scope.filter.start, $scope.filter.end);
            } else {
                filterBySite($scope.pubId, filter.siteId, filter.placementId, $scope.filter.range, null, null);
            }

        } else {
            filter.site = 'All Sites';
            $scope.filter.placementBySite = [];
            filter.siteId = '';
            filter.filteredSite = false;

            if ($scope.filter.range == 'Custom' && $scope.filter.start == null && $scope.filter.end == null) return false;

            if ($scope.filter.start != null || $scope.filter.end != null) {
                generateReports($scope.filter.start, $scope.filter.end);
            } else {
                generateReports(null, null);
            }
        }
    }

    function filterBySite(pubid, siteid, placementid, range, start, end) {
        $scope.$emit('LOAD');
        var filters = {
            data: {
                pubId: pubid,
                siteId: siteid,
                placementId: placementid,
                range: range,
                start: start,
                end: end
            }
        };
        console.log(filters);
        dataFactory.httpRequest('/app/reporting/generateReport', 'POST', filters).then(function(response) {
            $scope.data = response;
            $scope.reports = response.reports;
            defaultPropertiesGraph(response);
            $scope.$emit('UNLOAD');
        });
    }

    $scope.filterByPartner = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (index != undefined && id != undefined) {
            filter['partner'] = $scope.filters.partners[index]['name'];

            $scope.filter.placementByPartner = [];

            if (filter.siteId) {
                filter.placementByPartner = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if (placements[placement]['partnerId'] == id && (placements[placement]['siteId']) == filter.siteId) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }

            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['partnerId']) == id) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.partnerId = id;
            filter.placement = 'Overall';
            filter.filteredPartner = true;

        } else {
            filter.partner = 'All Partners';
            $scope.filter.placementByPartner = [];
            filter.partnerId = '';
            filter.filteredPartner = false;
        }
        console.log(filter);
    }

    $scope.filterByPlacement = function(placement) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (placement != undefined) {
            filter['placement'] = placement['placementName'];

            $scope.filter.placementId = placement['placementId'];

        } else {
            filter['placement'] = 'All Placements';
            filter.placementId = '';
        }
        // console.log(placement);
    }

    $scope.filterByRange = function(range, start, end) {
        $scope.filter.range = range;
        $scope.filter.start = start;
        $scope.filter.end = end;

        if (range == 'Custom' && start == null && end == null) return false;

        if ($scope.filter.siteId) {
            if (range == 'Custom') {
                filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range, start, end);
            } else {
                if ($scope.filter.start != null || $scope.filter.end != null) {
                    filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range, $scope.filter.start, $scope.filter.end);
                } else {
                    filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range, null, null);
                }
            }
        } else {
            if (range == 'Custom') {
                generateReports(start, end);
            } else {
                if ($scope.filter.start != null || $scope.filter.end != null) {
                    generateReports($scope.filter.start, $scope.filter.end);
                } else {
                    generateReports(null, null);
                }

            }
        }
    }

    function rangeFilter() {
        var ranges = [
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Last 7 Days',
            'Last 14 Days',
            'Last 30 Days',
            'Last 60 Days',
            'Last Month',
            'This Month',
            'Custom'
        ];
        $scope.filter.ranges = ranges;
        $scope.filter.range = 'Last 30 Days';
    }

    $scope.applyCustomDate = function(range) {
        $scope.filterByRange($scope.filter.range, range.start, range.end);
    }

    function generateReports(start, end) {
        $scope.$emit('LOAD');
        var filters = {
            data: {
                pubId: $scope.pubId,
                range: $scope.filter.range,
                start: start,
                end: end
            }
        };
        dataFactory.httpRequest('/app/reporting/display', 'POST', filters).then(function(data) {
            $scope.data = data;
            console.log(data);
            // if (!data.reports.report['nodata']) {
            $scope.reports = data.reports;
            defaultPropertiesGraph(data);
            // }
            $scope.$emit('UNLOAD');
        });
    }

    function prepareReports() {
        var data = $scope.reports;
        var reports = [],
            count = 0;

        for (var report in data) {
            count = count + 1;
            reports[count] = data[report];
        }
        if (count <= 1) {
            var report = reports[1];
            plotData(report);
        } else {
            plotData(data, count, true);
        }
    }

    $scope.filterByMetric = function(metric) {
        $scope.metric = metric;
        defaultPropertiesGraph($scope.data);
    }

    function defaultPropertiesGraph(data) {
        $scope.$emit('LOAD');
        $scope.property = [];
        var p = $scope.property;
        var reports = data.reports;
        var property = [];
        var properties = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertyData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var partnerData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertySeries = [];
        var propertyYAxis = [];

        for (var sites in reports) {
            p.push(sites);
        }

        if (p.length) {

            for (var i = 0; i < p.length; i++) {
                // Iterate tru each property
                property[p[i]] = {
                    site: p[i],
                    partners: reports[p[i]]
                }
            }
            // console.log(property);
        }

        for (var site in property) {
            var partners = property[site].partners;
            var date = [],
                impressions = [],
                ecpm = [],
                revenue = [];

            for (var partner in partners) {
                var r = partners[partner];

                for (var d = 0; d < r.date.length; d++) {

                    var imps = parseFloat(r.impressions[d]),
                        rev = roundToTwo(parseFloat(r.revenue[d]));

                    date[d] = r.date[d];
                    impressions[d] = (parseFloat(impressions[d]) ? parseFloat(impressions[d]) : 0) + parseFloat(imps);
                    revenue[d] = roundToTwo((parseFloat(revenue[d]) ? roundToTwo(parseFloat(revenue[d])) : 0) + roundToTwo(rev));

                    var cpm = parseFloat(revenue[d]) / (parseFloat(impressions[d]) / 1000);
                    ecpm[d] = isNaN(parseFloat(cpm)) ? 0 : roundToTwo(parseFloat(cpm));

                }

                partnerData.date.push(date);
                partnerData.ecpm.push(ecpm);
                partnerData.impressions.push(impressions);
                partnerData.revenue.push(revenue);

            }

            propertyData.date.push(date);
            propertyData.ecpm.push(ecpm);
            propertyData.impressions.push(impressions);
            propertyData.revenue.push(revenue);

        }

        var propData = [],
            idx = 0;

        for (var ps in property) {
            propData.push({
                site: ps,
                date: propertyData.date[idx],
                data: {
                    'ecpm': propertyData.ecpm[idx],
                    'impressions': propertyData.impressions[idx],
                    'revenue': propertyData.revenue[idx],
                    overall: {
                        revenue: parseFloat(propertyData.revenue[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0).toFixed(2)),
                        impressions: propertyData.impressions[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0)
                    }
                }
            });
            idx = idx + 1;
        }
        // console.log(propData);

        $scope.overall = {
            revenue: 0,
            impressions: 0,
            ecpm: 0
        }

        for (var series in propData) {

            switch ($scope.metric) {
                case 'Revenue':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'areaspline',
                        yAxis: 1,
                        data: propData[series].data.revenue,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'eCPM':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'areaspline',
                        yAxis: 1,
                        data: propData[series].data.ecpm,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'Impressions':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'areaspline',
                        yAxis: 1,
                        data: propData[series].data.impressions,
                        tooltip: {
                            valuePrefix: ''
                        }
                    });
                    break;
            }

            var or = propData[series].data.overall.revenue,
                oi = parseFloat(propData[series].data.overall.impressions);

            $scope.overall.revenue = parseFloat($scope.overall.revenue) ? parseFloat($scope.overall.revenue) + or : or;
            $scope.overall.impressions = parseFloat($scope.overall.impressions) ? parseFloat($scope.overall.impressions + oi) : oi;

            var oe = parseFloat(roundToTwo(isNaN($scope.overall.revenue / ($scope.overall.impressions / 1000)) ? 0 : $scope.overall.revenue / ($scope.overall.impressions / 1000)));
            $scope.overall.ecpm = oe;

        }
        // console.log($scope.overall);

        switch ($scope.metric) {
            case 'Revenue':
                propertyYAxis.push({ // Primary yAxis
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'Revenue',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true

                });
                break;

            case 'eCPM':
                propertyYAxis.push({ // Secondary yAxis
                    gridLineWidth: 0,
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: 'eCPM',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
                });
                break;

            case 'Impressions':
                propertyYAxis.push({ // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Impressions',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true
                });
                break;
        }

        var range = ($scope.filter.range == 'Custom') ? 'Custom Range ( ' + $scope.filter.start + ' to ' + $scope.filter.end + ' )' : $scope.filter.range;
        var site = $scope.filter.site;
        var metric = $scope.metric;

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: range
            },
            xAxis: [{
                categories: propData[0].date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: metric,
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                }
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 25,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FAFAFA'
            },
            series: propertySeries,
            credits: {
                enabled: false
            }
        });
        $scope.$emit('UNLOAD');
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    function plotData(report, count, overall) {

        $scope.$emit('LOAD');
        var date = [],
            impressions = [],
            ecpm = [],
            revenue = [];
        if (overall == true && count >= 2) {

            for (var r in report) {
                p = report[r];
                for (var i = 0; i < p.date.length; i++) {
                    date[i] = p.date[i];
                    impressions[i] = (Number(impressions[i]) ? Number(impressions[i]) : 0) + Number(p.impressions[i]);
                    revenue[i] = (Number(revenue[i]) ? Number(revenue[i]) : 0) + Number(p.revenue[i]);
                    ecpm[i] = Number(revenue[i] / (impressions[i] / 1000));
                }
            }

            // report.title = ['Overall'];
            // report.subTitle = ['Year To Date'];
            // console.log(report);
        } else {
            // console.log(report);
            for (var i = 0; i < report.date.length; i++) {
                date[i] = report.date[i];
                impressions[i] = Number(report.impressions[i]);
                ecpm[i] = Number(report.ecpm[i]);
                revenue[i] = Number(report.revenue[i]);
            }
        }

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: report.title
            },
            subtitle: {
                text: report.subTitle
            },
            xAxis: [{
                categories: date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '$ {value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: 'Earnings',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'eCPM',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '$ {value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }

            }, { // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Impressions',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 55,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'eCPM',
                type: 'spline',
                yAxis: 1,
                data: ecpm,
                tooltip: {
                    valuePrefix: '$ '
                }
            }, {
                name: 'Impressions',
                type: 'spline',
                yAxis: 2,
                data: impressions,
                marker: {
                    enabled: true
                },
                tooltip: {
                    valueSuffix: ''
                }

            }, {
                name: 'Earnings',
                type: 'spline',
                data: revenue,
                tooltip: {
                    valuePrefix: '$ '
                }
            }]
        });
        $scope.$emit('UNLOAD');
    }

}]);


app.controller('PubSitesController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.sites = [];
    $scope.publishers = [];
    $scope.pageNum = 1;
    $scope.totalSites = 0;
    $scope.activeMenu = 'sites';

    $scope.pageChanged = function(newPage) {
        getPubPartners(newPage, $scope.pubId);
    };

    getPubPartners(1, $scope.pubId);

    function getPubPartners(pageNum, pubId) {
        $scope.$emit('LOAD');
        dataFactory.httpRequest('/app/pub/pubsites/?page=' + pageNum + '&pubId=' + pubId).then(function(data) {
            $scope.pubSites = data.pubSites;
            $scope.pageNumber = pageNum;
            $scope.totalSites = data.total;
            $scope.$emit('UNLOAD');
            console.log(data);
        });
    }

    $scope.addNewSite = function() {
        $scope.sites.pubId = $scope.pubId;
        var data = $scope.sites;
        $scope.$emit('LOAD');
        dataFactory.httpRequest('/app/pub/addNewSite/?pubId=' + data['pubId'] + '&siteName=' + data['siteName'] + '&siteUrl=' + data['siteUrl']).then(function(response) {
            $scope.sites.push(response);
            $scope.$emit('UNLOAD');
            $(".modal").modal("hide");
        });
    }
}]);


app.controller('ReportsController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.data = [];
    $scope.reports = [];
    $scope.metric = 'Revenue';
    $scope.metrics = ['eCPM', 'Impressions', 'Revenue'];
    $scope.overall = {
        ecpm: 0,
        impressions: 0,
        revenue: 0
    };
    $scope.filter = {
        'site': '',
        'siteId': 0,
        'partner': '',
        'placement': '',
        'placementId': 0,
        'placementBySite': [],
        'placementByPartner': [],
        'placementFiltered': [],
        'filteredSite': false,
        'filteredPartner': false,
        'start': null,
        'end': null
    };
    $scope.activeMenu = 'reports';
    // console.log($scope.metrics);

    init();

    function init() {
        rangeFilter();
        initReportFilters();
        generateReports(null, null);
    }

    function initReportFilters() {
        var filter = $scope.filter;

        filter.site = 'All Sites';
        filter.partner = 'All Partners';
        filter.placement = 'Overall';

        $scope.$emit('LOAD');
        dataFactory.httpRequest('/app/reporting/reportFilters/' + $scope.pubId).then(function(filters) {
            $scope.filters = filters;
            $scope.$emit('UNLOAD');
        });
    }

    $scope.filterBySite = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if ($scope.filter.range == 'Custom' && $scope.filter.start == null && $scope.filter.end == null) $scope.filter.range = 'Last 30 Days';

        if (index != undefined && id != undefined) {
            filter.site = $scope.filters.sites[index]['siteName'];

            $scope.filter.placementBySite = [];
            $scope.$emit('LOAD');
            if (filter.partnerId) {
                filter.placementBySite = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id && (placements[placement]['partnerId']) == filter.partnerId) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['siteId']) == id) {
                        filter.placementBySite.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.siteId = id;
            filter.placement = 'Overall';
            filter.filteredSite = true;

            if ($scope.filter.start != null || $scope.filter.end != null) {
                filterBySite($scope.pubId, filter.siteId, filter.placementId, $scope.filter.range, $scope.filter.start, $scope.filter.end);
            } else {
                filterBySite($scope.pubId, filter.siteId, filter.placementId, $scope.filter.range, null, null);
            }

        } else {
            filter.site = 'All Sites';
            $scope.filter.placementBySite = [];
            filter.siteId = '';
            filter.filteredSite = false;

            if ($scope.filter.range == 'Custom' && $scope.filter.start == null && $scope.filter.end == null) return false;

            if ($scope.filter.start != null || $scope.filter.end != null) {
                generateReports($scope.filter.start, $scope.filter.end);
            } else {
                generateReports(null, null);
            }
        }
    }

    function filterBySite(pubid, siteid, placementid, range, start, end) {
        $scope.$emit('LOAD');
        var filters = {
            data: {
                pubId: pubid,
                siteId: siteid,
                placementId: placementid,
                range: range,
                start: start,
                end: end
            }
        };
        console.log(filters);
        dataFactory.httpRequest('/app/reporting/generateReport', 'POST', filters).then(function(response) {
            $scope.data = response;
            $scope.reports = response.reports;
            defaultPropertiesGraph(response);
            $scope.$emit('UNLOAD');
        });
    }

    $scope.filterByPartner = function(index, id) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (index != undefined && id != undefined) {
            filter['partner'] = $scope.filters.partners[index]['name'];

            $scope.filter.placementByPartner = [];

            if (filter.siteId) {
                filter.placementByPartner = [],
                    filter.placementFiltered = [];

                for (placement in placements) {
                    if (placements[placement]['partnerId'] == id && (placements[placement]['siteId']) == filter.siteId) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }

            } else {
                filter.placementFiltered = [];
                for (placement in placements) {
                    if ((placements[placement]['partnerId']) == id) {
                        filter.placementByPartner.push(placements[placement]);
                        filter.placementFiltered.push(placements[placement]);
                    }
                }
            }

            filter.partnerId = id;
            filter.placement = 'Overall';
            filter.filteredPartner = true;

        } else {
            filter.partner = 'All Partners';
            $scope.filter.placementByPartner = [];
            filter.partnerId = '';
            filter.filteredPartner = false;
        }
        // console.log(filter);
    }

    $scope.filterByPlacement = function(placement) {
        var filter = $scope.filter;
        var placements = $scope.filters.placements;

        if (placement != undefined) {
            filter['placement'] = placement['placementName'];

            $scope.filter.placementId = placement['placementId'];

        } else {
            filter['placement'] = 'All Placements';
            filter.placementId = '';
        }
        // console.log(placement);
    }

    $scope.filterByRange = function(range, start, end) {
        $scope.filter.range = range;
        $scope.filter.start = start;
        $scope.filter.end = end;

        if (range == 'Custom' && start == null && end == null) return false;

        if ($scope.filter.siteId) {
            if (range == 'Custom') {
                filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range, start, end);
            } else {
                if ($scope.filter.start != null || $scope.filter.end != null) {
                    filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range, $scope.filter.start, $scope.filter.end);
                } else {
                    filterBySite($scope.pubId, $scope.filter.siteId, 'na', $scope.filter.range, null, null);
                }
            }
        } else {
            if (range == 'Custom') {
                generateReports(start, end);
            } else {
                if ($scope.filter.start != null || $scope.filter.end != null) {
                    generateReports($scope.filter.start, $scope.filter.end);
                } else {
                    generateReports(null, null);
                }

            }
        }
    }

    function rangeFilter() {
        var ranges = [
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Last 7 Days',
            'Last 14 Days',
            'Last 30 Days',
            'Last 60 Days',
            'Last Month',
            'This Month',
            'Custom'
        ];
        $scope.filter.ranges = ranges;
        $scope.filter.range = 'Last 30 Days';
    }

    $scope.applyCustomDate = function(range) {
        $scope.filterByRange($scope.filter.range, range.start, range.end);
    }

    function generateReports(start, end) {
        $scope.$emit('LOAD');
        var filters = {
            data: {
                pubId: $scope.pubId,
                range: $scope.filter.range,
                start: start,
                end: end
            }
        };
        dataFactory.httpRequest('/app/reporting/display', 'POST', filters).then(function(data) {
            $scope.data = data;
            $scope.reports = data.reports;
            defaultPropertiesGraph(data);
            $scope.$emit('UNLOAD');
        });
    }

    function prepareReports() {
        var data = $scope.reports;
        var reports = [],
            count = 0;

        for (var report in data) {
            count = count + 1;
            reports[count] = data[report];
        }
        if (count <= 1) {
            var report = reports[1];
            plotData(report);
        } else {
            plotData(data, count, true);
        }
    }

    $scope.filterByMetric = function(metric) {
        $scope.metric = metric;
        defaultPropertiesGraph($scope.data);
    }

    function defaultPropertiesGraph(data) {
        $scope.$emit('LOAD');
        $scope.property = [];
        var p = $scope.property;
        var reports = data.reports;
        var property = [];
        var properties = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertyData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var partnerData = {
            date: [],
            ecpm: [],
            impressions: [],
            revenue: []
        };
        var propertySeries = [];
        var propertyYAxis = [];

        for (var sites in reports) {
            p.push(sites);
        }

        if (p.length) {

            for (var i = 0; i < p.length; i++) {
                // Iterate tru each property
                property[p[i]] = {
                    site: p[i],
                    partners: reports[p[i]]
                }
            }
            // console.log(property);
        }

        for (var site in property) {
            var partners = property[site].partners;
            var date = [],
                impressions = [],
                ecpm = [],
                revenue = [];

            for (var partner in partners) {
                var r = partners[partner];

                for (var d = 0; d < r.date.length; d++) {

                    var imps = parseFloat(r.impressions[d]),
                        rev = roundToTwo(parseFloat(r.revenue[d]));

                    date[d] = r.date[d];
                    impressions[d] = (parseFloat(impressions[d]) ? parseFloat(impressions[d]) : 0) + parseFloat(imps);
                    revenue[d] = roundToTwo((parseFloat(revenue[d]) ? roundToTwo(parseFloat(revenue[d])) : 0) + roundToTwo(rev));

                    var cpm = parseFloat(revenue[d]) / (parseFloat(impressions[d]) / 1000);
                    ecpm[d] = isNaN(parseFloat(cpm)) ? 0 : roundToTwo(parseFloat(cpm));

                }

                partnerData.date.push(date);
                partnerData.ecpm.push(ecpm);
                partnerData.impressions.push(impressions);
                partnerData.revenue.push(revenue);

            }

            propertyData.date.push(date);
            propertyData.ecpm.push(ecpm);
            propertyData.impressions.push(impressions);
            propertyData.revenue.push(revenue);

        }

        var propData = [],
            idx = 0;

        for (var ps in property) {
            propData.push({
                site: ps,
                date: propertyData.date[idx],
                data: {
                    'ecpm': propertyData.ecpm[idx],
                    'impressions': propertyData.impressions[idx],
                    'revenue': propertyData.revenue[idx],
                    overall: {
                        revenue: parseFloat(propertyData.revenue[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0).toFixed(2)),
                        impressions: propertyData.impressions[idx].reduce(function(a, b) {
                            return a + b;
                        }, 0)
                    }
                }
            });
            idx = idx + 1;
        }
        // console.log(propData);

        $scope.overall = {
            revenue: 0,
            impressions: 0,
            ecpm: 0
        }

        for (var series in propData) {

            switch ($scope.metric) {
                case 'Revenue':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'areaspline',
                        yAxis: 1,
                        data: propData[series].data.revenue,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'eCPM':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'areaspline',
                        yAxis: 1,
                        data: propData[series].data.ecpm,
                        tooltip: {
                            valuePrefix: '$ '
                        }
                    });
                    break;

                case 'Impressions':
                    propertySeries.push({
                        name: propData[series].site,
                        type: 'areaspline',
                        yAxis: 1,
                        data: propData[series].data.impressions,
                        tooltip: {
                            valuePrefix: ''
                        }
                    });
                    break;
            }

            var or = propData[series].data.overall.revenue,
                oi = parseFloat(propData[series].data.overall.impressions);

            $scope.overall.revenue = parseFloat($scope.overall.revenue) ? parseFloat($scope.overall.revenue) + or : or;
            $scope.overall.impressions = parseFloat($scope.overall.impressions) ? parseFloat($scope.overall.impressions + oi) : oi;

            var oe = parseFloat(roundToTwo(isNaN($scope.overall.revenue / ($scope.overall.impressions / 1000)) ? 0 : $scope.overall.revenue / ($scope.overall.impressions / 1000)));
            $scope.overall.ecpm = oe;

        }
        // console.log($scope.overall);

        switch ($scope.metric) {
            case 'Revenue':
                propertyYAxis.push({ // Primary yAxis
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    title: {
                        text: 'Revenue',
                        style: {
                            color: Highcharts.getOptions().colors[2]
                        }
                    },
                    opposite: true

                });
                break;

            case 'eCPM':
                propertyYAxis.push({ // Secondary yAxis
                    gridLineWidth: 0,
                    labels: {
                        format: '$ {value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    title: {
                        text: 'eCPM',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }
                });
                break;

            case 'Impressions':
                propertyYAxis.push({ // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Impressions',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true
                });
                break;
        }

        var range = ($scope.filter.range == 'Custom') ? 'Custom Range ( ' + $scope.filter.start + ' to ' + $scope.filter.end + ' )' : $scope.filter.range;
        var site = $scope.filter.site;
        var metric = $scope.metric;

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: range
            },
            xAxis: [{
                categories: propData[0].date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: metric,
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[6]
                    }
                }
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 25,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FAFAFA'
            },
            series: propertySeries,
            credits: {
                enabled: false
            }
        });
        $scope.$emit('UNLOAD');
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    function plotData(report, count, overall) {

        $scope.$emit('LOAD');
        var date = [],
            impressions = [],
            ecpm = [],
            revenue = [];
        if (overall == true && count >= 2) {

            for (var r in report) {
                p = report[r];
                for (var i = 0; i < p.date.length; i++) {
                    date[i] = p.date[i];
                    impressions[i] = (Number(impressions[i]) ? Number(impressions[i]) : 0) + Number(p.impressions[i]);
                    revenue[i] = (Number(revenue[i]) ? Number(revenue[i]) : 0) + Number(p.revenue[i]);
                    ecpm[i] = Number(revenue[i] / (impressions[i] / 1000));
                }
            }

            // report.title = ['Overall'];
            // report.subTitle = ['Year To Date'];
            // console.log(report);
        } else {
            // console.log(report);
            for (var i = 0; i < report.date.length; i++) {
                date[i] = report.date[i];
                impressions[i] = Number(report.impressions[i]);
                ecpm[i] = Number(report.ecpm[i]);
                revenue[i] = Number(report.revenue[i]);
            }
        }

        Highcharts.chart('main-chart', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: report.title
            },
            subtitle: {
                text: report.subTitle
            },
            xAxis: [{
                categories: date,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '$ {value}',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: 'Earnings',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true

            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'eCPM',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '$ {value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                }

            }, { // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Impressions',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 55,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'eCPM',
                type: 'spline',
                yAxis: 1,
                data: ecpm,
                tooltip: {
                    valuePrefix: '$ '
                }
            }, {
                name: 'Impressions',
                type: 'spline',
                yAxis: 2,
                data: impressions,
                marker: {
                    enabled: true
                },
                tooltip: {
                    valueSuffix: ''
                }

            }, {
                name: 'Earnings',
                type: 'spline',
                data: revenue,
                tooltip: {
                    valuePrefix: '$ '
                }
            }]
        });
        $scope.$emit('UNLOAD');
    }

}]);


app.controller('SitesController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.sites = [];
    $scope.publishers = [];
    $scope.pageNum = 1;
    $scope.totalSites = 0;
    $scope.activeMenu = 'sites';

    $scope.pageChanged = function(newPage) {
        getSites(newPage, $scope.pubId);
    };

    getSites(1, $scope.pubId);

    function getSites(pageNum, pubId) {
        $scope.data = {
            page: pageNum,
            pubId: pubId
        };
        $scope.$emit('LOAD');
        dataFactory.httpRequest('app/../sites', 'GET', $scope.data).then(function(data) {
            $scope.pubSites = data.pubSites;
            $scope.pageNumber = pageNum;
            $scope.totalSites = data.total;
            $scope.$emit('UNLOAD');
            console.log(data);
        });
    }

    $scope.addNewSite = function() {
        $scope.sites.pubId = $scope.pubId;
        var data = $scope.sites;
        dataFactory.httpRequest('../../../addNewSite/?pubId=' + data['pubId'] + '&siteName=' + data['siteName'] + '&siteUrl=' + data['siteUrl']).then(function(response) {
            $scope.sites.push(response);
            $(".modal").modal("hide");
        });
    }
}]);
