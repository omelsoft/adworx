app.controller('PartnerController', ['dataFactory', '$scope', '$http', function(dataFactory, $scope, $http) {
    $scope.partners = [];
    $scope.pageNumber = 1;
    $scope.libraryTemp = {};
    $scope.totalItemsTemp = {};
    $scope.totalItems = 0;
    $scope.setActiveMenu('partners');

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
