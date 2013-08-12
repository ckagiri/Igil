define('model.fixture',
    ['ko', 'config'],
    function (ko, config) {
        var Fixture = function () {
            var self = this;
            self.id = ko.observable();
            self.seasonId = ko.observable();
            self.homeTeamId = ko.observable();
            self.awayTeamId = ko.observable();
            self.venue = ko.observable();
            self.kickOff = ko.observable();
            self.matchStatus = ko.observable();
            self.homeScore = ko.observable();
            self.awayScore = ko.observable();
            self.homeAsianHandicap = ko.observable();
            self.awayAsianHandicap = ko.observable();
            self.totalGoalsHandicap = ko.observable();
            self.startOfWeek = ko.observable();
            self.endOfWeek = ko.observable();
            self.odds = ko.observableArray();
            self.hasHangCheng = ko.observable(false);
            self.hasTotalGoals = ko.observable(false);
            self.isPublished = ko.observable();
            
            self.fixtureHash = ko.computed(function () {
                return config.hashes.fixtures + '/' + self.id();
            });

            self.kickOffDateOnly = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('DD-MMM-YYYY') : '';
            });
            self.kickOffFull = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('DD-MMM-YYYY hh:mm') : '';
            });
            self.kickOffShort = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('ddd MMM DD, hh:mm') : '';
            });
            self.kickOffShortDate = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('ddd MMM DD') : '';
            });
            self.match = ko.computed({
                read: function () {
                    if (self.matchStatus() !== 0) {
                        return self.homeTeam().name() + ' ' + self.homeScore() + ' - ' +
                            self.awayTeam().name() + ' ' + self.awayScore();
                    } else {
                        return self.homeTeam().name() + ' v ' + self.awayTeam().name();
                    }
                },
                
                deferEvaluation: true
            });
            self.matchShort = ko.computed({
                read: function () {
                    return self.homeTeam().code() + ' v ' + self.awayTeam().code();
                },

                deferEvaluation: true
            });
            self.hangCheng = ko.computed({
                read: function () {
                    return self.homeAsianHandicap() > self.awayAsianHandicap()
                        ? self.homeAsianHandicap() + ' : 0' : '0 : ' + self.awayAsianHandicap();
                },

                deferEvaluation: true
            });
            
            self.totalGoals = ko.computed({
                read: function () {
                    return self.totalGoalsHandicap();
                },

                deferEvaluation: true
            });
            
            self.score = ko.computed({
                read: function () {
                    return self.homeScore() + ' - ' + self.awayScore();
                },

                deferEvaluation: true
            });

            self.league = ko.computed({
                read: function() {
                    return self.season().league();
                },

                deferEvaluation: true
            });
            
            self.leagueSeason = ko.computed({
                read: function () {
                    var season = self.season();
                    return season.league().name() + '  ' + season.name();
                },

                deferEvaluation: true
            });
            self.isActive = ko.computed({
                read: function () {
                    return self.matchStatus() === 0;
                },

                deferEvaluation: true
            });

            self.isNullo = false;
            
            self.dirtyFlag = new ko.DirtyFlag([
                self.homeTeamId,
                self.awayTeamId,
                self.kickOff]);

            return self;
        };

        Fixture.Nullo = new Fixture()
            .id(0)
            .kickOff(new Date(1900, 1, 1, 1, 0, 0, 0))
            .homeAsianHandicap(-1)
            .awayAsianHandicap(-1)
            .totalGoalsHandicap(0)
            .startOfWeek(new Date(1900, 1, 1, 1, 0, 0, 0))
            .endOfWeek(new Date(1900, 1, 1, 1, 0, 0, 0));
        Fixture.Nullo.isNullo = true;
        Fixture.Nullo.dirtyFlag().reset();

        var _dc = null;
        Fixture.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        Fixture.prototype = function() {
            var dc = Fixture.datacontext,
                homeTeam = function() {
                    return dc().teams.getLocalById(this.homeTeamId());
                },
                awayTeam = function() {
                    return dc().teams.getLocalById(this.awayTeamId());
                },
                season = function () {
                    return dc().seasons.getLocalById(this.seasonId());
                };
            return {
                isNullo: false,
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                season: season
            };
        }();

        return Fixture;
    });