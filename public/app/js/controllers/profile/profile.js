app.controller('ProfileCtrl', ['$scope', '$http', '$stateParams','GlobalConstants', 'user', 'auth',
  function ($scope, $http, $stateParams,GlobalConstants, user, auth) {
    $scope.currentUser = {};
    $scope.currentPosts = {};
    $scope.currentPost = {title:"", content:""};

    $scope.canPost = (auth.getId() == $stateParams.id);
    user.getUser($stateParams.id)
    .then(function(data){
        for(var key in data) {
            $scope.currentUser[key] = data[key];
        }
    })
    user.getPosts($stateParams.id)
    .then(function(data){
        $scope.currentPosts = data; 
    })

    $scope.addPost = function(){
		user.addPost($stateParams.id, $scope.currentPost)
		.then(function(data){
		    $scope.currentPosts.push(data); 
            $scope.currentPost = {title:"", content:""};
		})
    }
  }]);
