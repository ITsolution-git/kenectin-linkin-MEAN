app.service('auth', ['$http', '$window','GlobalConstants', '$q', function($http, $window,  GlobalConstants, $q) {
    var service = {};


    service.signup = function(user) {
        return $http.post(GlobalConstants.APIBASEPATH + 'api/auth/signup', {
                username: user.name,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password
            })
            .then(function(response) {
                if (response.data.result === 0) {
                    return response.data;
                } else {
                    throw response.data;
                }
            })
    };
    service.login = function(email, pass) {
        return $http.post(GlobalConstants.APIBASEPATH + 'api/auth/login', {
            
                email: email,
                password: pass
            })
            .then(function(response) {
                if (response.data.result === 0) {
                    return response.data.data;
                } else {
                    throw response.data.data;
                }
            })
            .then(function(info) {
                var user = info.userinfo;
                user.token = info.token;
                service.setUserInfo(user);
                return info;
            })
    };
    service.setUserInfo = function(user) {
        if ($window.localStorage) {
            $window.localStorage.setItem('userInfo', angular.toJson(user));
        }
        service.info = user;
    };

    service.getUserInfo = function() {
        if (!service.info && $window.localStorage) {
            service.info = angular.fromJson($window.localStorage.getItem('userInfo'));
        }
        return service.info;
    };

    service.getToken = function(){
        var info = this.getUserInfo();
        return info?info.token:"";
    };

    service.getId = function(){
        var info = this.getUserInfo();
        return info?info._id:"";
    };

    service.isAuthenticated = function() {
        var info = this.getUserInfo();
        return info && info.token;
    };


    service.logout = function() {
        service.setUserInfo({});
    };
    return service;
}])