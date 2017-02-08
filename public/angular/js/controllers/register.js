'use strict';

// signup controller
app.controller('RegisterFormController', ['$scope', '$http', '$state', 'auth', function($scope, $http, $state, auth) {
    $scope.user = {};
    $scope.authError = null;
    $scope.register = function() {
        $scope.authError = null;
        // Try to create
        auth.signup($scope.user.name, $scope.user.email, $scope.user.password)
            .then(function(data) {
                console.log(data);
            })
            .catch(function() {
                $scope.authError = 'Server Error';
            })
    };
}]);