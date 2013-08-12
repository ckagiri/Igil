define('model.season',
    ['ko', 'config'],
    function (ko, config) {
        var Season = function () {
            var self = this;
            self.id = ko.observable();
            self.name = ko.observable().extend({ required: true });
            self.startDate = ko.observable().extend({ required: true });
            self.endDate = ko.observable().extend({ required: true });
            self.leagueId = ko.observable();

            self.seasonHash = ko.computed(function () {
                return config.hashes.seasons + '/' + self.id();
            });

            self.dirtyFlag = new ko.DirtyFlag([
                self.name,
                self.startDate,
                self.endDate]);

            self.startDateShort = ko.computed(function() {
                return self.startDate() ? (moment(self.startDate()).format('DD-MMM-YYYY')) : '';
            }, self);
            
            self.startDateFull = ko.computed(function () {
                return self.startDate() ? (moment(self.startDate()).format('dddd, MMM Do, YYYY')) : '';
            }, self);
            
            self.endDateShort = ko.computed(function () {
                return self.endDate() ? (moment(self.endDate()).format('DD-MMM-YYYY')) : '';
            }, self);
            
            self.endDateFull = ko.computed(function () {
                return self.endDate() ? (moment(self.endDate()).format('dddd, MMM Do, YYYY')) : '';
            }, self);

            self.teams = ko.computed({
                read: function () {
                    return self.id() ? Season.datacontext().seasons.getTeamsBySeasonId(self.id()) : [];
                },

                deferEvaluation: true
            });

            return self;
        };

        Season.Nullo = new Season()
            .id(0)
            .name('Not a Season')
            .startDate(new Date(1900, 1, 1, 1, 0, 0, 0))
            .endDate(new Date(1900, 1, 1, 1, 0, 0, 0));
        Season.Nullo.isNullo = true;
        Season.Nullo.dirtyFlag().reset();

        var _dc = null;
        Season.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        Season.prototype = function() {
            var dc = Season.datacontext,
                league = function() {
                    return dc().leagues.getLocalById(this.leagueId());
                };
            return {
                isNullo: false,
                league: league
            };
        }();

        return Season;
});