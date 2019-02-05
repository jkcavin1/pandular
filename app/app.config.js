angular.
    module('pandaApp').
    config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
                when('/', {
                    template: '<panda-canvas></panda-canvas>'
                }).
                when('/code-editor', {
                    template: '<code-editor></code-editor>'
                }).
                otherwise('/');
        }
]);
