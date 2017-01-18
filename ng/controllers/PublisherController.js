app.controller('PublishersController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.publishers = [];
    $scope.pageNum = 1;
    $scope.totalPublishers = 0;
    $scope.setActiveMenu('publishers');

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
