LigiAdmin.module('Entities', function (Entities, App, Backbone, Marionette, $, _) {
    Entities.Movie = Entities.Model.extend({
        
    });
    
    Entities.MoviesCollection = Entities.Collection.extend({
        model: Entities.Movie,
        
        parse: function (resp) {
            return resp.movies;
        }
    });
    
    API = {
        getMovies: function(url, params) {
            var movies;
            if (params == null) {
                params = {};
            }
            _.defaults(params, {
                apikey: "gc7f42dts5ve6xjzavh2vgqj",
                country: "us"
            });
            movies = new Entities.MoviesCollection;
            movies.url = "http://api.rottentomatoes.com/api/public/v1.0/" + url + ".json?callback=?";
            movies.fetch({
                reset: true,
                data: params
            });
            return movies;
        }
    };
    App.reqres.setHandler("movie:rental:entities", function() {
        return API.getMovies("lists/dvds/top_rentals", {
            limit: 20
        });
    });
    App.reqres.setHandler("search:movie:entities", function(searchTerm) {
        return API.getMovies("movies", {
            q: $.trim(searchTerm)
        });
    });
    App.reqres.setHandler("theatre:movie:entities", function() {
        return API.getMovies("lists/movies/in_theaters", {
            page_limit: 10,
            page: 1
        });
    });
    App.reqres.setHandler("upcoming:movie:entities", function() {
        return API.getMovies("lists/movies/upcoming", {
            page_limit: 10,
            page: 1
        });
    });
});
    
   // API = {
        //getMovies: function () {
        //    return new Entities.MoviesCollection([
        //      {
        //          title: "Foo",
        //          year: 2013,
        //          mpaa_rating: "R",
        //          runtime: 180,
        //          ratings: {
        //              critics_score: 100
        //          },
        //          release_dates: {
        //              theater: "2013-07-12"
        //          }
        //      }, {
        //          title: "Bar",
        //          year: 2012,
        //          mpaa_rating: "PG",
        //          runtime: 160,
        //          ratings: {
        //              critics_score: 92
        //          },
        //          release_dates: {
        //              theater: "2013-07-13"
        //          }
        //      }, {
        //          title: "Baz",
        //          year: 2011,
        //          mpaa_rating: "G",
        //          runtime: 200,
        //          ratings: {
        //              critics_score: 87
        //          },
        //          release_dates: {
        //              theater: "2013-07-14"
        //          }
        //      }
        //    ]);
        //}
        
       
    
// Use this in your browser's console to initialize a JSONP request to see the API in action.
// $.getJSON("http://api.rottentomatoes.com/api/public/v1.0/movies.json?callback=?", {apikey: "vzjnwecqq7av3mauck2238uj", q: "shining"})
