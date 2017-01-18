app.controller('SitesController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.sites = [];
    $scope.publishers = [];
    $scope.pageNum = 1;
    $scope.totalSites = 0;
    $scope.setActiveMenu('sites');

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
