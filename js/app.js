app = angular.module('wizardApp', [
	'ui.router',
    'ui.date',
	'wizardApp.controllers'
	]);
app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/wizard/step1');

        $stateProvider
          .state('wizard', {
            abstract: true,
            url: '/wizard',
            template: '<div>\
              <div ui-view></div>\
              </div>'
          })
          .state('wizard.step1', {
            url: '/step1',
            templateUrl: 'wizard/step1.html',
            controller: ['$rootScope', '$scope', '$state',
                function($rootScope, $scope, $state) {
                    $scope.$watch('step1.$valid', function (valid) {
                        $rootScope.step_2_validity["wizard.step1"] = valid;
                    });
                }]
          })
          .state('wizard.step2', {
            url: '/step2',
            templateUrl: 'wizard/step2.html',
            controller: ['$rootScope', '$scope', '$state',
                function($rootScope, $scope, $state) {
                    $scope.$watch('step2.$valid', function (valid) {
                        $rootScope.step_2_validity["wizard.step2"] = valid;
                    });
                }]
          })
          .state('wizard.step3', {
            url: '/step3',
            templateUrl: 'wizard/step3.html',
            controller: ['$rootScope', '$scope', '$state',
                function($rootScope, $scope, $state) {
                    $scope.$watch('step3.$valid', function (valid) {
                        $rootScope.step_2_validity["wizard.step3"] = valid;
                    });
                }]
          })
          .state('wizard.finish', {
            url: '/finish',
            templateUrl: 'wizard/step4.html',
            controller: function($scope) {
              $scope.signup();
            }
          })
    }]);

app.directive('match',['$parse', function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
}]);

angular.module('wizardApp.controllers', [])
.controller('WizardSignupController', ['$rootScope', '$scope', '$state',
    function($rootScope, $scope, $state) {
        $scope.user = {};
        $rootScope.step_2_validity = {"wizard": true, "wizard.step1": false, "wizard.step2": false, "wizard.step3": false};
        $rootScope.step_2_previous = {"wizard.step1": "wizard", "wizard.step2": "wizard.step1", "wizard.step3": "wizard.step2", "wizard.finish": "wizard.step3"}

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if (fromState.name.length > 0 && !$rootScope.step_2_validity[$rootScope.step_2_previous[toState.name]]) {
                    console.log(fromState);
                    console.log(toState);
                    event.preventDefault();
                }
            });

        $scope.signup = function() {
            console.log($scope.user); // submit data from $scope.user model
        };

        $scope.is_available_state = function(state_name){
            return $rootScope.step_2_validity[$rootScope.step_2_previous[state_name]]
        };

        $scope.is_current_state = function(name) {
            return ($state.$current.name == name) ? 'current' : '';
        };
    }]);
