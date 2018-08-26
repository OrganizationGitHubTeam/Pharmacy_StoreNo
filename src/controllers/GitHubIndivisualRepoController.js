var app = angular.module("ecommerceApp");

app.controller('GitHubIndivisualRepoController', ['$scope', 'GitHubService', function($scope, GitHubService) {
    function loadOrganiztion() {
        GitHubService.getOrganization().then(function(response) {
            $scope.datas.repositoryUrl = response.data[0].repos_url;
            $scope.datas.url = response.data[0].url;
            $scope.datas.organization = response.data[0].login;
            loadRepository();
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadRepository() {
        GitHubService.getAllrepository($scope.datas.repositoryUrl).then(function(response) {
            $scope.datas.repositoryData = response.data;
            $scope.datas.repoSelected = $scope.datas.repositoryData[0];
            loadCommitDate();
            loadMembers();
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadCommitDate() {
        GitHubService.getLastCommit($scope.datas.organization, $scope.datas.repoSelected.name).then(function(response) {
            var shortCommitData = _.sortBy(response.data, ['commit.committer.date']);
             var date = shortCommitData[response.data.length - 1].commit.committer.date;
             $scope.lastCommitDate = moment.utc(date).format('YYYY-MMM-DD HH:mm');
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadMembers() {
        GitHubService.getMembersUrlForRepo($scope.datas.organization, $scope.datas.repoSelected.name).then(function(response) {
            $scope.membersUrl = _.replace(response.data[0].members_url, '{/member}', '');
            loadIndivisualMember();
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadIndivisualMember() {
        GitHubService.getMembersForRepo($scope.membersUrl).then(function(response) {
            $scope.datas.members = [];
            angular.forEach(response.data, function(value, key) {
                var datas = {
                    imageUrl : value.avatar_url,
                    userName : value.login
                }

                $scope.datas.members.push(datas);
            });

        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });

        console.log($scope.datas.members);
    }
    
    function init() {
        $scope.datas = {
            repositoryUrl : '',
            repositoryData : [],
            organization : '',
            url: '',
            repoSelected: '',
            members : []
        };

        loadOrganiztion();
    }
    init();

    $scope.selectRepository = function() {
        loadCommitDate();
        loadMembers();
    }
}]);
