app.controller('SidebarController', ['$scope', function($scope) {

    $scope.activeMenu = function(menu) {
        return menu;
        console.log(menu);
    };
}]);
