
var app =  angular.module('app')
.factory('authInterceptor', ['$injector', function($injector) { 
  return {
    request: function(config) {
      var auth= $injector.get('auth');
      config.headers['x-access-token'] = auth.getToken();
      return config;
    },

    requestError: function(config) {
      return config;
    },

    response: function(res) {
      return res;
    },

    responseError: function(res) {
      return res;
    }
  }
}])
  .config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$httpProvider','$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,  $httpProvider,  $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.httpProvider = $httpProvider;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;

        $httpProvider.interceptors.push('authInterceptor');
    }

  ])
.run(function($http) {
  
})