'use strict';

app.controller('FindFriendCtrl', ['$scope', '$http', '$state', 'auth', 'user', 'GlobalConstants',
    function($scope, $http, $state, auth, user, GlobalConstants) {
    $scope.currentUser = {};
    $scope.currentPagedUsers = {};

    function reloadData(){
        user.pagedUsers(auth.getId(), $scope.pager)
        .then(function(data){
            $scope.currentPagedUsers = data.users;
            $scope.pager.page = parseInt(data.page);
            $scope.pager.item_per_page = parseInt(data.item_per_page);
            $scope.pager.query = data.query;
            $scope.pager.total = parseInt(data.total);
            $scope.pager.page_array = $scope.pager.pages();
            $scope.loadingFollow = false;
        })
        .catch(function(err) {
            console.log(err);
        })
    }
    $scope.loadingFollow = false;
    $scope.pager = {
        page : 0,
        total : 0,
        item_per_page: 5,
        page_count: 0,
        query: "",
        page_array: [],
        nextPage : function(){
            if(this.page >= 0){
                this.page++;
                reloadData();
            }
        },
        previousPage: function(){
            if(this.page <= this.total/this.item_per_page){
                this.page--;
                reloadData();
            }
        },  
        showPage: function(p){
            this.page = p;
            reloadData();
        },
        pages: function(){
            var res = [];
            for (var i = 0; i <= this.total/this.item_per_page ; i++) {
                res.push(i+1);
            }
            return res;
        },
        changeQuery: function(){
            reloadData();
        }
    };
    user.getUser(auth.getId())
    .then(function(data){
        $scope.currentUser = data; 
        reloadData();
    })
    $scope.follow = function(whom){
        $scope.loadingFollow = true;

        user.follow($scope.currentUser._id, whom)
        .then(function(data){
            $scope.currentUser = data;
            reloadData();
        })
    };

    $scope.unfollow = function(whom){        
        $scope.loadingFollow = true;

        user.unfollow($scope.currentUser._id, whom)
        .then(function(data){
            $scope.currentUser = data;
            reloadData();
        })
    }
  }]);       