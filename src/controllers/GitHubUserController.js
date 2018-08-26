var app = angular.module("ecommerceApp");

app.controller('GitHubUserController', ['$scope', 'GitHubService', function ($scope, GitHubService) {

  function loadOrganiztion() {
    GitHubService.getOrganization().then(function (response) {
      $scope.datas.url = response.data[0].url;
      loadMembers();
    }, function (error) {
      swal("Something Went wrong", "Check your internet connection", "error");
    });
  }

  function loadMembers() {
    GitHubService.getUser($scope.datas.url).then(function (response) {
        $scope.datas.uesrCount = response.data.length;
        $scope.datas.membersData = response.data;
        loadMembersRole();
    }, function (error) {
      swal("Something Went wrong", "Check your internet connection", "error");
    });
  }

  function loadMembersRole() {

    var totalDeveloper = 0;
    var totalAdmin = 0;
    angular.forEach($scope.datas.membersData, function(value, key) {
        GitHubService.getUserRole($scope.datas.url, value.login).then(function (response) {
          var data = {
            userName : value.login,
            role : response.data.role
          }

          $scope.datas.usersRole.push(data);
          
          if(response.data.role == 'admin') {
            totalAdmin++;
            localStorage.setItem('totalAdmin', totalAdmin);
          } else {
            totalDeveloper++;
            localStorage.setItem('totalDeveloper', totalDeveloper);
          }
        }, function (error) {
          
        });
      });

      $scope.datas.totalAdmin = parseInt(localStorage.getItem('totalAdmin'));
      $scope.datas.totalDeveloper = parseInt(localStorage.getItem('totalDeveloper'));
      loadPieChart();
  }

  function loadPieChart() {
    Morris.Donut({
      element: 'donut-example',
      colors: ['#9A12B3', '#2AB4C0'],
      data: [
        { label: "Admin", value: parseInt($scope.datas.totalAdmin) },
        { label: "Developer", value: parseInt($scope.datas.totalDeveloper) }
      ]
    });
  }

  function init() {
    $scope.datas = {
      url: '',
      uesrCount : 0,
      membersData : [],
      totalDeveloper : 0,
      totalAdmin : 0,
      usersRole : []
    };

    loadOrganiztion();
  }

  init();
}]);
