app.controller('MainController', ['$scope', function($scope) {
    $scope.$on('LOAD', function() {
        $scope.loading = true;
    });
    $scope.$on('UNLOAD', function() {
        $scope.loading = false;
    });

    $scope.activeMenu = '';
    $scope.setActiveMenu = function(menu) {
        $scope.activeMenu = menu;
        console.log(menu);
    };

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
