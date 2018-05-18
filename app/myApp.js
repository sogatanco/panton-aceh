var app = angular.module("myApp", ["ngRoute","hc.marked","infinite-scroll", "angular.filter"]);
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "src/home.html",
        controller : "main"
    }) 
    .when("/:author/:permlink",{
      templateUrl:"src/post.html",
      controller:"post"
    })
});
app.controller("main", function($scope) {  
  $scope.post=[]; 
    function compare(a,b) {
        if (a.time < b.time)
          return -1;
        if (a.time > b.time)
          return 1;
        return 0;
      } 
    steem.api.getAccountVotes('pantoen-aceh', function (err, resp) {
        if (err) console.log(err)
        resp.sort(compare);
        resp.reverse();
        let promises = resp.map(r => {
            const autper = r.authorperm.split('/', 2);
            return steem.api.getContentAsync(autper[0], autper[1])
                    .then((result) => {
                        return result
                    });
        })
        Promise.all(promises)
          .then(results => {
            $scope.post=results.slice(0,5);
            $scope.getMoreData = function () {
              $scope.post=results.slice(0,$scope.post.length+5);
              console.log($scope.post.length)
          }
            $scope.$apply(); 
          })
          .catch(e => {
            console.error(e);
          })
          
    })
    
  });

  app.controller("post", function($scope, $location, $routeParams){
    $scope.author=$routeParams.author;
    steem.api.getContent($routeParams.author, $routeParams.permlink, function (err, result){
        $scope.post=result;
        $scope.$apply();
    });
  });
  




