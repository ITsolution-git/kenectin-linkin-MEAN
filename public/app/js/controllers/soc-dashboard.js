app.controller('DashboardCtrl', ['$scope', '$http', 'auth', '$state', 'user',
  function ($scope, $http, auth, $state, user) {
    // $http.get('data/soc-media.json').success(function(data) {
    //   $scope.medias = data;

    // });
    $scope.myFeeds = [];
    user.getUser(auth.getId())
    .then(function(data){
        $scope.user = data; 
    })
    .catch(function(err){
        alert(err.data)
    });
    if(!auth.isAuthenticated())
    	$state.go('access.login');
    
    user.getFeed(auth.getId())
    .then(function(data){
        $scope.myFeeds = data;
    })  
}]);
