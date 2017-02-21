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
    $scope.currentComment = {};
    $scope.showReplyBoxon = "";
    $scope.showReply = function(postId){
        $scope.showReplyBoxon = postId;
        $scope.currentComment.post_id = postId;
        $scope.content = "";
    }
    $scope.addComment = function(){
        user.addComment($scope.currentComment)
        .then(function(data){
            for (var i = 0; i < $scope.myFeeds.length; i++) {
                if($scope.myFeeds[i]._id == $scope.showReplyBoxon){
                    $scope.myFeeds[i].comments.push(data);
                }
            }
            $scope.showReplyBoxon = "";
        })  
    }


}]);
