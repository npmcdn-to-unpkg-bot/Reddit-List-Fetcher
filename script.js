// Code goes here
var app = angular.module('redditListFetcher', []);


app.controller('MainController', ['$scope', 'getListService', function($scope, getListService) {

    var url = "https://www.reddit.com/r/" + $scope.subRedditName + ".json";

    $scope.submitForm = function() {
        var subRedditName = $scope.subRedditName;
        $scope.fetchedLists = '';
        // check to make sure the form is completely valid
        if ($scope.RedditForm.$valid) {

            getListService.getSubRedditData(subRedditName, function(fetchedLists) {
                $scope.fetchedLists = fetchedLists;
                
                if ($scope.fetchedLists !== '')
                {
                  $scope.toggle=false;
                }
                
                else
                {
                  $scope.toggle=true;
                }
                
            });
        }
    };
}]);


app.controller('ListController', ['$scope', '$filter', function($scope, $filter) {
    
    
    var createdDate = $filter('date')($scope.list.data.created_utc * 1000, 'short') ;
    var then = moment(createdDate, 'MM/DD/YYYY HH:mm')
    var now = moment(new Date(), 'MM/DD/YYYY HH:mm');
    
    var duration = moment.duration(now.diff(then));
    var hours = Math.floor(duration.asHours());
    var years = Math.floor(duration.asYears());
    var months = Math.floor(duration.asMonths());
    
    if (years > 0 )
    {
      $scope.timeSinceCreated = years + ' year' ;
    }
    else
    {
      
    if (months >= 1)  
    {
      
      if (months == 1)
      {
        var monthss = 'month';
        $scope.timeSinceCreated = months + months ;
      }
      else
      {
        monthss = 'months';
        $scope.timeSinceCreated = months + months ;
        
      }
    }
    
      else
      {
      if (hours > 24){
      
          if (hours > 48) 
          {
            var days ='days';
          
          }
          else
          {
             days ='day';
          
          }
           $scope.timeSinceCreated = Math.floor(hours/24) + ' '+ days;
      } 
    
      else
      {
      
        if (hours > 1)
        {
          var hourss = 'hours';
        
        }
        else
        {
          hourss = 'hour';
        }
      
        $scope.timeSinceCreated = hours + ' '+  hourss;
      }
    }
  }

}]);


// To get the list from JSON data
app.service('getListService', ['$http', function($http) {
    this.getSubRedditData = function(subRedditName, callback) {
        $http.get("https://www.reddit.com/r/" + subRedditName + ".json")
            .success(function(result) {
                callback(result.data.children);
            })
            .error(function(data, status) {
                callback('');
            })
    }
}]);