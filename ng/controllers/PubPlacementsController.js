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
        $scope.setActiveMenu('placements');
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
