var app = angular.module('carlsonCoder',
    [
        'ui.router',
        'ngSanitize',
        'ngFileUpload',
        'ui.tinymce',
        'carlsoncoder.controllers',
        'carlsoncoder.filters',
        'carlsoncoder.directives',
        'carlsoncoder.factories',
        'carlsoncoder.injectors'
    ]
);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state(
                'home',
                {
                    url: '/',
                    templateUrl: 'templates/home.html',
                    controller: 'MainController',
                    resolve: {
                        blogPostPromise: ['blogposts', function(blogposts) {
                            return blogposts.getAll();
                        }]
                    }
                })
            .state(
                'specificBlogPost',
                {
                    url: '/blog/{fullLinkPath}',
                    templateUrl: 'templates/blogentry.html',
                    controller: 'MainController',
                    resolve: {
                        blogPostPromise: ['blogposts', function(blogposts) {
                            return blogposts.getAll();
                        }]
                    }
                })
            .state(
                'about',
                {
                    url: '/about',
                    templateUrl: 'templates/about.html',
                    controller: 'AboutController',
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'coolsites',
                {
                    url: '/coolsites',
                    templateUrl: 'templates/coolsites.html',
                    controller: 'CoolSitesController',
                    resolve: {
                        coolSitePromise: ['coolsites', function(coolsites) {
                            return coolsites.getAll();
                        }]
                    },
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'archives',
                {
                    url: '/archives',
                    templateUrl: 'templates/archives.html',
                    controller: 'ArchivesController',
                    resolve: {
                        blogPostPromise: ['blogposts', function(blogposts) {
                            return blogposts.getAll();
                        }]
                    },
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'archivesSearch',
                {
                    url: '/archives/tag/{tagName}',
                    templateUrl: 'templates/archives.html',
                    controller: 'ArchivesController',
                    resolve: {
                        blogPostPromise: ['blogposts', function(blogposts) {
                            return blogposts.getAll();
                        }]
                    },
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'admin',
                {
                    url: '/admin',
                    templateUrl: 'templates/admin/admin.html',
                    controller: 'AdminController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }],
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'newblogpost',
                {
                    url: '/admin/newblogpost',
                    templateUrl: 'templates/admin/newblogpost.html',
                    controller: 'AdminController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }],
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'setcolor',
                {
                    url: '/admin/setcolor',
                    templateUrl: 'templates/admin/setcolor.html',
                    controller: 'AdminController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }],
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'uploadpicture',
                {
                    url: '/admin/uploadpicture',
                    templateUrl: 'templates/admin/uploadpicture.html',
                    controller: 'AdminController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }],
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'viewpictures',
                {
                    url: '/admin/viewpictures',
                    templateUrl: 'templates/admin/viewpictures.html',
                    controller: 'AdminController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }],
                    resolve: {
                        imagesPromise: ['images', function(images) {
                            return images.getAll();
                        }]
                    },
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'previewblogpost',
                {
                    url: '/admin/validateblogpost',
                    templateUrl: 'templates/admin/previewblogpost.html',
                    controller: 'AdminController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (!auth.isLoggedIn())
                        {
                            $state.go('login');
                        }
                    }],
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                })
            .state(
                'login',
                {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'NavigationController',
                    onEnter: ['$state', 'auth', function($state, auth) {
                        if (auth.isLoggedIn())
                        {
                            $state.go('home');
                        }
                    }],
                    onExit: ['$rootScope', function($rootScope) {
                        $rootScope.currentPageNumber = 0;
                    }]
                });

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('tokenInjector');
        $httpProvider.interceptors.push('loadingStatusInjector');
}]);