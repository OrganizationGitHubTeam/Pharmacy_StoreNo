var app = angular.module("ecommerceApp");

app.service('GitHubService', ['$http', 'globalUrl', function ($http, globalUrl) {

    this.getOrganization = function() {
        return $http({
            url : globalUrl.BASE_GITHUB_URL + '/user/orgs?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getAllrepository = function (repoUrl) {
        console.log(repoUrl);
        return $http({
            url: repoUrl
        });
    }

    this.getDevMasterReleaseDate = function(url) {
        return $http({
            url: url + '/releases?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getTeams = function(url) {
        console.log(url);
        return $http({
            url: url + '/teams?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getUser = function(url) {
        return $http({
            url : url + '/members?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getUserRole = function(url, userName) {
        return $http({
            url : url + '/memberships/' + userName + '?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getLastCommit = function(organizationName, repoName) {
        return $http({
            url : globalUrl.BASE_GITHUB_URL + '/repos/' + organizationName + '/' + repoName + '/commits' + '?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getMembersUrlForRepo = function(organizationName, repoName) {
        return $http({
            url : globalUrl.BASE_GITHUB_URL + '/repos/' + organizationName + '/' + repoName + '/teams' + '?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }

    this.getMembersForRepo = function(memberUrl) {
        return $http({
            url : memberUrl + '?access_token=' + globalUrl.GITHUB_PRIVATE_KEY
        });
    }
}]);
