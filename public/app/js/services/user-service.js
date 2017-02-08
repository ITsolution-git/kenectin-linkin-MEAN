app.service('user', ['$http', '$window','GlobalConstants', 'auth', '$q', function($http, $window,  GlobalConstants, auth, $q) {
    var service = {};

    service.getUser = function(id) {
        return $http.get(GlobalConstants.APIBASEPATH + 'api/user/' + id)
            .then(function(response) {
                if (response.data.result === 0) {
                    return response.data.data;
                } else {
                    throw response.data;
                }
            });
    };

    service.getPosts = function(id) {
        return $http.get(GlobalConstants.APIBASEPATH + 'api/user/' + id + '/getPosts')
            .then(function(response) {
                if (response.data.result === 0) {
                    return response.data.data;
                } else {
                    throw response.data;
                }
            });
    };

    service.addPost = function(id, post) {
        return $http.post(GlobalConstants.APIBASEPATH + 'api/user/' + id + '/addPost',{
            title: post.title,
            content: post.content
        })
            .then(function(response) {
                if (response.data.result === 0) {
                    return response.data.data;
                } else {
                    throw response.data;
                }
            });
    };
    service.saveUserBasic = function(user) {
        return $http.put(GlobalConstants.APIBASEPATH + 'api/user/' + auth.getId())
            .then(function(response) {
                if (response.data.result === 0) {
                    service.setUserinfo(response.data);
                    return response.data.data;
                } else {
                    throw response.data;
                }
            })
    };
    service.setUserinfo = function(data){
        service.user =  data;
    }
    service.getUserinfo = function() {
        if(!service.user)
            return service.getUser();
        else{
            return service.user;
        }
    }
    return service;
}])