var app = angular.module("ecommerceApp", [
      "ui.router", 'ui.bootstrap'
]);


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$sceProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $sceProvider) {

      $sceProvider.enabled(false);
      $urlRouterProvider.otherwise('/repository');

      $stateProvider
            .state('github-repo', {
                  url: "/repository",
                  templateUrl: "src/views/github-repository.html",
                  controller: "GitHubRepoController"
            })

            .state('github-users', {
                  url: "/users",
                  templateUrl: "src/views/github-users.html",
                  controller: "GitHubUserController"
            })

            .state('github-indivisual-repo', {
                  url: "/indivisual",
                  templateUrl: "src/views/github-indivisual-repo.html",
                  controller: "GitHubIndivisualRepoController"
            })

      $locationProvider.html5Mode(true);


}]).run();