app.controller('EditProfileCtrl', ['$scope', '$http', 'GlobalConstants', 'auth', 'Upload', '$state',
  	function ($scope, $http, GlobalConstants, auth, Upload, $state) {
        $scope.saveBasicinfo = function(){
            $http.put(GlobalConstants.APIBASEPATH + 'api/user/' + auth.getId() + '/basicinfo',
                $scope.user)
                .then(function(response) {
                    if (response.data.result === 0) {
                        var data = response.data.data; 

                        for(var key in data) {
                            $scope.user[key] = data[key];
                        }
                        $state.go('app.soc-dashboard');
                    } else {
                   	 	$scope.errorMessage = response.data.data;
                    }
                });
        }
        $scope.upload = function (file) {
	        Upload.upload({
	            url: GlobalConstants.APIBASEPATH + 'api/user/' + auth.getId() + '/uploaduserimg',
	            data: {file: file}
	        }).then(function (resp) {
	            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);

                var data = resp.data.data;
                for(var key in data) {
                    $scope.user[key] = data[key];
                }
	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	        }, function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        });
	    };
  }]);
