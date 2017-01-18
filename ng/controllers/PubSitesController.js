app.controller('PubSitesController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.sites = [];
    $scope.publishers = [];
    $scope.pageNum = 1;
    $scope.totalSites = 0;
    $scope.setActiveMenu('sites');

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
