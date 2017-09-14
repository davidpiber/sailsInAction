angular.module('brushfire_videosPage', [])
.config(['$sceDelegateProvider', function($sceDelegateProvider) {
$sceDelegateProvider.resourceUrlWhitelist([
  'self',
  '*://www.youtube.com/**'
]);
}]);

angular.module('brushfire_videosPage').controller('PageCtrl', [
'$scope', '$http',
function($scope, $http) {
  $scope.videosLoading = true;

  $scope.submitVideosError = false;

  // Get the existing videos.
  // $http.get('/video')
  //   .then(function onSuccess(sailsResponse) {
  //     $scope.videos = sailsResponse.data;
  //   })
  //   .catch(function onError(sailsResponse) {

  //     if (sailsResponse.data.status === '404') {
  //       return;
  //     }

  //     console.log("An unexpected error occurred: " + sailsResponse.data.statusText);

  //   })
  //   .finally(function eitherWay() {
  //     $scope.videosLoading = false;
  //   });

  io.socket.get('/video', function whenServerResponds(data, JWR){
    $scope.videosLoading = false;
    if(JWR.statusCode >= 400) {
      $scope.submitVideosError = true;
      console.log('somethin bad happened!');
      reurn;
    }
    $scope.videos = data;
    $scope.$apply();
  });

  io.socket.on('video', function whenAVideoIsCreatedUpdatedOrDestroyed(event) {
    $scope.videos.unshift({
      title: event.data.title,
      src: event.data.src
    });
    $scope.$apply();
  });

  $scope.submitNewVideo = function() {

    // A little "spin-lock" to prevent double-submission
    // (because disabling the submit button still allows double-posts
    //  if a user hits the ENTER key to submit the form multiple times.)
    if ($scope.busySubmittingVideo) {
      return;
    }

    // Harvest the data out of the form
    // (thanks to ng-model, it's already in the $scope object)
    var _newVideo = {
      title: $scope.newVideoTitle,
      src: $scope.newVideoSrc,
    };

    // create placeholder anchor element
    var parser = document.createElement('a');

    // assign url to parser.href
    parser.href = _newVideo.src

    // Use the indexOf parser.search as the first argument and length of
    // parser.search as the second argument of parser.search.substring
    // The result is the YouTube ID --> LfOWehvvuo0
    var youtubeID = parser.search.substring(parser.search.indexOf("=") + 1, parser.search.length);

    _newVideo.src = 'https://www.youtube.com/embed/' + youtubeID;



    // First, show a loading state
    // (also disables form submission)
    $scope.busySubmittingVideo = true;

    $http.post('/video', {
      title: _newVideo.title,
      src: _newVideo.src
    })
    .then(function onSuccess(sailsResponse) {
      $scope.videos.unshift(_newVideo);
    })
    .catch(function onError(sailsResponse) {
      console.log("An unexpected error occurred: " + sailsResponse.data.statusText);
    })
    .finally(function eitherWay() {
      $scope.busySubmittingVideo = false;
      $scope.newVideoTitle = '';
      $scope.newVideoSrc = '';
    });
  };
}
]);