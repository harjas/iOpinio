// angular.module is a global place for creating, registering and retrieving Angular modules
// 'iOpinio' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'iOpinio.services' is found in services.js
// 'iOpinio.controllers' is found in controllers.js
ionic.Platform.ready();
angular.module('iOpinio', ['ionic', 'iOpinio.services', 'iOpinio.controllers'])


    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            })

            .state('loginPage', {
                url: '/loginPage',
                templateUrl: 'templates/loginPage.html',
                controller: 'loginPageCtrl'
            })

            .state('registerPage', {
                url: '/registerPage',
                templateUrl: 'templates/registerPage.html',
                controller: 'registerPageCtrl'
            })

            .state('createPoll', {
                url: '/createPoll',
                templateUrl: 'templates/createPoll.html',
                controller: 'createPollCtrl'
            })

            .state('sendToPage', {
                url:'/sendToPage',
                templateUrl: 'templates/sendToPage.html',
                controller: 'sendToPageCtrl'
            })

            .state('contactsPage', {
                url:'/contactsPage',
                templateUrl: 'templates/contactsPage.html',
                controller: 'contactsPageCtrl'
            })

            .state('mainCarousel',{
                url: '/mainCarousel',
                templateUrl: 'templates/mainCarousel.html',
                controller: 'mainCarouselCtrl'
            })

            .state('feedPage', {
                url:'/feedPage',
                templateUrl: 'templates/feedPage.html',
                controller: 'feedPageCtrl'
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');

    });
