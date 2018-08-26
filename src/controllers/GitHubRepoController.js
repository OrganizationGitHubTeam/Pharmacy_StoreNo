var app = angular.module("ecommerceApp");

app.controller('GitHubRepoController', ['$scope', 'GitHubService', function($scope, GitHubService) {
   
    function loadOrganiztion() {
        GitHubService.getOrganization().then(function(response) {
            $scope.datas.repositoryUrl = response.data[0].repos_url;
            $scope.datas.url = response.data[0].url;
            
            loadRepository();
            loadTeams();
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadRepository() {
        console.log($scope.datas.repositoryUrl);
        GitHubService.getAllrepository($scope.datas.repositoryUrl).then(function(response) {
            $scope.datas.repositoryCount = response.data.length;
            $scope.datas.repositoryData = response.data;
            angular.forEach(response.data, function(value, key) {
                var data = {
                    label : value.name,
                    value : value.size
                }

                $scope.datas.repostorySizeArray.push(data);
            });
            console.log($scope.datas.repostorySizeArray);
            loadRelease();
            loadPiChart();
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadRelease() {
        $scope.datas.releaseData = [];
    var promises = [];
    angular.forEach($scope.datas.repositoryData, function(value, key) {
        promises.push(GitHubService.getDevMasterReleaseDate(value.url).then(function(responseRepo) {
            var dataToOperate = [];
            var dataJson = {
                'repoName' : value.name,
                'masterArray' : [],
                'devArray' : [] 
            }

            angular.forEach(responseRepo.data, function(value, key) {
                if(value.target_commitish == 'master') {
                    dataJson.masterArray.push(value);
                } else {
                    dataJson.devArray.push(value);
                }
            });

            $scope.datas.releaseData.push(dataJson);
        }, function(error) {

        }));
    });
    Promise.all(promises).then(() => {
        jsonDataToProcess = [];
        angular.forEach($scope.datas.releaseData, function(value, key) {
            var latestMasterArray =  _.sortBy(value.masterArray, ['published_at']);
            var latestDevArray =  _.sortBy(value.devArray, ['published_at']);

            var valueOfMaster = latestMasterArray[latestMasterArray.length - 1];
            var valueOfDev = latestDevArray[latestDevArray.length - 1];

            if(valueOfMaster) {
                valueOfMaster.published_at = moment.utc(valueOfMaster.published_at).format('YYYY-MMM-DD HH:mm');
            }

            if(valueOfDev) {
                valueOfDev.published_at = moment.utc(valueOfDev.published_at).format('YYYY-MMM-DD HH:mm');
            }

            var dataValue = {
                'repoName' : value.repoName,
                'latestMaster' : valueOfMaster,
                'latestDev' : valueOfDev
            }

            jsonDataToProcess.push(dataValue);
        });

        $scope.datas.finalReleaseData = jsonDataToProcess;
        $scope.$apply();
    });
        
    }

    function loadTeams() {
        GitHubService.getTeams($scope.datas.url).then(function(response) {
            $scope.datas.teamCount = response.data.length;
        }, function(error) {
            swal("Something Went wrong", "Check your internet connection", "error");
        });
    }

    function loadPiChart() {
        Morris.Donut({
            element: 'donut-example',
            colors: ['#8E44AD', '#E7505A', '#9A12B3', '#3fb618', '#2AB4C0', '#C5BF66'],
            data: $scope.datas.repostorySizeArray
        });
    }

    function init() {
        $scope.datas = {
            repositoryUrl : '',
            repositoryCount : 0,
            repositoryData : [],
            releaseData : [],
            finalReleaseData : [],
            jsonDataToProcess : [],
            url: '',
            teamCount : 0,
            repostorySizeArray : [],
            masterJson : [],
            devJson : []
        };

        loadOrganiztion();
    }
    init();
}]);
