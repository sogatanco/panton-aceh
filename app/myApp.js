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
    .when("/pujangga",{
      templateUrl:"src/pujangga.html",
      controller:"pujangga"
    })
    .when("/:author",{
      templateUrl:"src/profil.html",
      controller:"profil"
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
            $scope.tema=results;
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

  app.controller("pujangga", function($scope) {  
    $scope.pujangga=[]; 
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
              $scope.pujangga=results;
              $scope.pujangga1=results.slice(0,4);
              $scope.getMoreData=function(){
                $scope.pujangga1=results;
              }
              $scope.$apply(); 
            })
            .catch(e => {
              console.error(e);
            })        
      })   
    }); 


    app.controller("profil", function($scope, $location, $routeParams){
      $scope.author=$routeParams.author;
      $scope.posts=[];
      //query to get followcount
      steem.api.getFollowCount($scope.author, function(err, result) {
        $scope.follow=result;
        $scope.$apply();
      });
      //get post by author
      function compare(a,b) {
        if (a.time < b.time)
          return -1;
        if (a.time > b.time)
          return 1;
        return 0;
      }
      steem.api.getAccountVotes('pantoen-aceh', function (err, result) {
        const oneaccount=result.filter(x=>x.authorperm.startsWith($scope.author))
        oneaccount.sort(compare);
        oneaccount.reverse();
        let promises = oneaccount.map(r => {
                    const autper = r.authorperm.split('/', 2);
                    return steem.api.getContentAsync(autper[0], autper[1])
                            .then((result) => {
                                return result
                            });
                });
        Promise.all(promises)
          .then(results => {
            $scope.postoriginal=results;
            $scope.posts=$scope.postoriginal.slice(0,5)
            $scope.getMoreData = function () {
              $scope.posts=results.slice(0,$scope.posts.length+5);
          }
            $scope.$apply(); 
          })
          .catch(e => {
              console.error(e);
          })         
      })
    });
  




