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
            self.homeAsianHandicapBind = ko.computed({
                read: function () {
                    var homeCap = self.homeAsianHandicap(),
                        awayCap = self.awayAsianHandicap();
                    if (homeCap + awayCap !== 0) {
                        return "";
                    } else {
                        return homeCap;
                    }
                },
                write: function (value) {
                    var homeCap, awayCap, cap;
                    cap = parseFloat(value, 10);
                    if (!cap && cap !== 0) {
                        awayCap = homeCap = -1;
                    } else {
                        homeCap = cap,
                        awayCap = -homeCap;
                    }
                    self.homeAsianHandicap(homeCap);
                    self.awayAsianHandicap(awayCap);
                }
            });
            self.awayAsianHandicapBind = ko.computed({
                read: function () {
                    var homeCap = self.homeAsianHandicap(),
                        awayCap = self.awayAsianHandicap();
                    if (homeCap + awayCap !== 0) {
                        return "";
                    } else {
                        return awayCap;
                    }
                },
                write: function (value) {
                    var homeCap, awayCap, cap;
                    cap = parseFloat(value, 10);
                    if (!cap && cap !== 0) {
                        awayCap = homeCap = -1;
                    } else {
                        awayCap = cap,
                        homeCap = -awayCap;
                    }
                    self.awayAsianHandicap(awayCap);
                    self.homeAsianHandicap(homeCap);
                },
                deferEvaluation: true
            });
            self.totalGoalsHandicapBind = ko.computed({
                read: function () {
                    var goalsCap = self.totalGoalsHandicap();
                    if (goalsCap === 0) {
                        return "";
                    } else {
                        return goalsCap;
                    }
                },
                write: function (value) {
                    var goalsCap, cap;
                    cap = parseFloat(value, 10);
                    if (!cap) {
                        goalsCap = 0;
                    } else {
                        goalsCap = parseFloat(value, 10);
                    }
                    self.totalGoalsHandicap(goalsCap);
                },
                deferEvaluation: true
            });
            self.homeScoreBind = ko.computed({
                read: function () {
                        return self.homeScore();
                },
                write: function (value) {
                    var score = parseInt(value, 10);
                    if (!score && score !== 0) {
                        self.homeScore(0);
                    } else {
                        self.homeScore(score);
                    }
                },
                deferEvaluation: true
            });
            self.awayScoreBind = ko.computed({
                read: function () {
                        return self.awayScore();
                },
                write: function (value) {
                    var score = parseInt(value, 10);
                    if (!score && score !== 0) {
                        self.awayScore(0);
                    } else {
                        self.awayScore(score);
                    }
                },
                deferEvaluation: true
            });
            self.startOfWeek = ko.observable();
            self.endOfWeek = ko.observable();
            self.matchStatuses = [
                { key: 0, name: "Pending" },
                { key: 1, name: "InProgress" },
                { key: 2, name: "Played" },
                { key: 3, name: "Cancelled" },
                { key: 4, name: "Abandoned" },
                { key: 5, name: "PostPoned" }
            ],
            self.fixtureHash = ko.computed(function () {
                return config.hashes.fixtures + '/' + self.id();
            });
            self.kickOffBind = ko.computed({
                read: function() {
                    return new Date(self.kickOff());
                },
                write: function(value) {
                    self.kickOff(value);
                },
                deferEvaluation: true
            });
            self.kickOffDateOnly = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('DD-MMM-YYYY') : '';
            });
            self.kickOffFull = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('DD-MMM-YYYY hh:mm') : '';
            });
            self.kickOffShort = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('MMM Do hh:mm') : '';
            });
            self.kickOffMidi = ko.computed(function () {
                return self.kickOff() ? moment(self.kickOff()).format('ddd MMM DD, hh:mm') : '';
            });
            self.match = ko.computed({
                read: function() {
                    return  self.homeTeam().name() + ' v ' + self.awayTeam().name();
                },
                
                deferEvaluation: true
            });
            self.hangCheng = ko.computed({
                read: function () {
                    if (self.homeAsianHandicap() + self.awayAsianHandicap() !== 0)
                        return "N/A";
                    else 
                        return self.homeAsianHandicap() > self.awayAsianHandicap()
                            ? self.homeAsianHandicap() + ' : 0' : '0 : ' + self.awayAsianHandicap();
                },

                deferEvaluation: true
            });
            self.totalGoals = ko.computed({
                read: function () {
                    if (self.totalGoalsHandicap() === 0)
                        return "N/A";
                    else
                        return self.totalGoalsHandicap();
                },

                deferEvaluation: true
            });
            self.score = ko.computed({
                read: function () {
                    var text = "";
                    if (self.matchStatus() === 0) {
                        text = "pending";
                        if (self.homeScore() !== 0 && self.awayScore() !== 0) {
                            text = "*pending*";
                        }
                    } 
                    else if (self.matchStatus() === 1) {
                        text = '*'+self.homeScore() + ' - ' + self.awayScore()+"*";
                    }
                    else if (self.matchStatus() === 1 || self.matchStatus() === 2) {
                        text = self.homeScore() + ' - ' + self.awayScore();
                    }
                    else if (self.matchStatus() == 3){
                        text = "c - c";
                    }
                    else if (self.matchStatus() == 4) {
                        text = "a - a";
                    }
                    else if (self.matchStatus() == 5) {
                        text = "p - p";
                    }
                    return text;
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
            self.isNullo = false;
            self.dirtyFlag = new ko.DirtyFlag([
                self.homeTeamId,
                self.awayTeamId,
                self.kickOff,
                self.homeScore,
                self.awayScore,
                self.homeAsianHandicap,
                self.awayAsianHandicap,
                self.totalGoalsHandicap,
                self.matchStatus
            ]);
            return self;
        };
        Fixture.Nullo = new Fixture()
            .id(0)
            .kickOff(new Date(1900, 1, 1, 1, 0, 0, 0))
            .homeAsianHandicap(-1)
            .awayAsianHandicap(-1)
            .totalGoalsHandicap(-1)
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