'use strict';

// signup controller
app.controller('RegisterFormController', ['$scope', '$http', '$state', 'auth', function($scope, $http, $state, auth) {
    $scope.reguser = {};
    $scope.authError = null;
    $scope.register = function() {
        $scope.authError = null;
        // Try to create
        auth.signup($scope.reguser)
            .then(function(data) {
                $state.go('access.login');
            })
            .catch(function() {
                $scope.authError = 'Server Error';
            })
    };
}]);