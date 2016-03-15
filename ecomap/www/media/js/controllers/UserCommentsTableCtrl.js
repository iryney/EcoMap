app.controller('UserCommentsTableCtrl', ['$scope', '$http', '$state', '$cookies', '$window',
  function($scope, $http, $state, $cookies, $window) {
    $scope.sortType = 'id'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchFish = '';
    $scope.user_id = $cookies.get('id');
    $scope.ShowAdminInfo = false;
    $scope.showSubComments = false;
    $scope.searchNick = null;
    $scope.selectCountObj = {
      '1': '5',
      '2': '10',
      '3': '15',
      '4': '20'
    }
    $scope.selectCount = {
      'selected': '5'
    }

    $scope.getStatus = function(status) {
      var statuses = {
        'Unsolved': 'Не вирішено',
        'Solved': 'Вирішено'
      };
      return statuses[status];
    };

    $scope.loadComments = function() {
      $scope.msg = msg;
      $scope.fromPage = 1;
      $scope.bigCurrentPage = 1;
      $scope.commentsLength = $scope.selectCount['selected'];
      $scope.bigTotalItems = $scope.commentsLength / $scope.selectCount['selected'] * 10;
      $scope.$watch('bigCurrentPage', function(newValue, oldValue) {
      var stepCount = $scope.selectCount['selected']
      if ($scope.searchNick){
          $scope.ShowAdminInfo = ($cookies.get('role')!=='user');
          $http({
          method: 'GET',
          url: '/api/search_users_comments',
          params: {
            nickname: $scope.searchNick, 
            per_page: $scope.selectCount['selected'],
            offset: $scope.selectCount['selected'] * newValue - stepCount
          }
          }).then(function successCallback(response) {
            $scope.comments = response.data[0];
            $scope.commentsCount = response.data[1][0]['total_comments_count'];
            $scope.commentsLength = response.data[1][0]['total_comments_count'];
            $scope.bigTotalItems = $scope.commentsLength / $scope.selectCount['selected'] * 10;
           })
        } else if ($cookies.get('role')!=='user'){
          $http({
            method: 'GET',
            url: 'api/all_users_comments',
            params: {
              per_page: $scope.selectCount['selected'],
              offset: $scope.selectCount['selected'] * newValue - stepCount,
            }
          }).then(function successCallback(response) {
            $scope.comments = response.data[0];
            $scope.commentsCount = response.data[1][0]['total_comments_count'];
            $scope.commentsLength = response.data[1][0]['total_comments_count'];
            $scope.bigTotalItems = $scope.commentsLength / $scope.selectCount['selected'] * 10;
            $scope.ShowAdminInfo = true;
          })
        } else {
          $http({
            method: 'GET',
            url: 'api/user_comments/' + $scope.user_id,
            params: {
              per_page: $scope.selectCount['selected'],
              offset: $scope.selectCount['selected'] * newValue - stepCount,
            }
            }).then(function successCallback(response) {
              $scope.comments = response.data[0];
              $scope.commentsCount = response.data[1][0]['total_comments_count'];
              $scope.commentsLength = response.data[1][0]['total_comments_count'];
              $scope.bigTotalItems = $scope.commentsLength / $scope.selectCount['selected'] * 10;
            })
        }
      })
    };

    $scope.loadComments();
    $scope.loadSubComments = function(parent_id) {
       $scope.ShowAdminInfo = ($cookies.get('role')!=='user');
       $http({
        method: 'GET',
        url: '/api/problem_subcomments/' + parent_id
        }).then(function successCallback(response) {
            $scope.subcomments = response.data[0];
        })
        if(!$scope.subcomment_parent || $scope.subcomment_parent === parent_id) {
            $scope.showSubComments = $scope.showSubComments ? false: true;
        }
        if($scope.showSubComments === false && $scope.subcomment_parent !== parent_id) {
            $scope.showSubComments = true;
        }
        $scope.subcomment_parent = parent_id;
    }

    $scope.deleteComment = function(comment_id, parent_id) {
       $http({
          method: 'DELETE',
          url: '/api/delete_comment',
          params: {
            'comment_id': comment_id
          }
          }).then(function successCallback(response) {
              $scope.msg.deleteSuccess('коментаря');
        })

        $scope.$watch('bigCurrentPage', function(newValue, oldValue) {
        var stepCount = $scope.selectCount['selected']
        if($cookies.get('role')!=='user') {
          $http({
            method: 'GET',
            url: 'api/all_users_comments',
            params: {
              per_page: $scope.selectCount['selected'],
              offset: $scope.selectCount['selected'] * newValue - stepCount,
            }
            }).then(function successCallback(response) {
              if (parent_id) {
                $scope.showSubComments = false;
                $scope.loadSubComments(parent_id);
              }
              $scope.comments = response.data[0];
              $scope.commentsCount = response.data[1][0]['total_comments_count'];
              $scope.commentsLength = response.data[1][0]['total_comments_count'];
              $scope.bigTotalItems = $scope.commentsLength / $scope.selectCount['selected'] * 10;  
          })
        } else {
          $http({
            method: 'GET',
            url: 'api/user_comments/' + $scope.user_id,
            params: {
              per_page: $scope.selectCount['selected'],
              offset: $scope.selectCount['selected'] * newValue - stepCount,
            }
            }).then(function successCallback(response) {
              if (parent_id) {
                $scope.showSubComments = false;
                $scope.loadSubComments(parent_id);
              }
              $scope.comments = response.data[0];
              $scope.commentsCount = response.data[1][0]['total_comments_count'];
              $scope.commentsLength = response.data[1][0]['total_comments_count'];
              $scope.bigTotalItems = $scope.commentsLength / $scope.selectCount['selected'] * 10;         
          })
        }
      })
    }

    $scope.triggerDetailModal = function(problem_id) {
        var url = '/#/detailedProblem/' + problem_id;
        window.open(url, '_blank');
    }
  }
]);
