'use strict';

app.controller('LoginFormController', ['$scope', '$http', '$state', 'auth', 'user',function($scope, $http, $state, auth, user) {
    $scope.loginuser = {};
    $scope.authError =   null;
    $scope.login = function() {
        $scope.authError = null;
        // Try to create
        auth.login($scope.loginuser.email, $scope.loginuser.password)
            .then(function(data) {
                user.getUser(auth.getId())
                .then(function(data){
                    for(var key in data) {
                        $scope.user[key] = data[key];
                    }
                    $state.go('app.soc-dashboard');
                })
            })
            .catch(function(err) {
                auth.setUserInfo({});
                $scope.authError = err.data;
            })
    };
  }]);       