define('filter.fixtures',
    ['ko','moment'],
    function (ko, moment) {
        var FixtureFilter = function () {
            var self = this;
            self.league = ko.observable();
            self.season = ko.observable();
            self.month = ko.observable();
            self.day = ko.observable();
            return self;
        };

        FixtureFilter.prototype = function () {
            var leagueTest = function (league, fixture) {
                if (!league)
                    return false;
                if (league.code() !== fixture.season().league().code())
                    return false;
                return true;
            },
                seasonTest = function (season, fixture) {
                    if (season && season.name() !== fixture.season().name())
                        return false;
                    return true;
                },
                monthTest = function (month, fixture) {
                    if (month && month !== moment(fixture.kickOff()).month() + 1)
                        return false;
                    return true;
                },
                predicate = function(self, fixture) {
                    var match = leagueTest(self.league(), fixture) 
                        && seasonTest(self.season(), fixture)
                        && monthTest(self.month(), fixture);
                    return match;
                };
            return {
                predicate: predicate
            };
        }();
        return FixtureFilter;
    });