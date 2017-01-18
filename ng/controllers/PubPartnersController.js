app.controller('PubPartnersController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.publishers = [];
    $scope.pageNum = 1;
    $totalPublishers = 0;
    $scope.setActiveMenu('partners');

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
