app.controller('PlacementsController', ['dataFactory', '$scope', '$http', 'NgTableParams', function(dataFactory, $scope, $http, NgTableParams) {
    $scope.setActiveMenu('placements');
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
