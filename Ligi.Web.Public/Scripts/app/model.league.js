define('model.league',
    ['ko', 'config'],
    function (ko, config) {
        var League = function () {
            var self = this;
            self.id = ko.observable();
            self.name = ko.observable().extend({ required: true });
            self.code = ko.observable().extend({ required: true });

            self.leagueHash = ko.computed(function () {
                return config.hashes.leagues + '/' + self.id();
            });

            self.dirtyFlag = new ko.DirtyFlag([
                self.name,
                self.code]);
            
            self.seasons = ko.computed({
                read: function () {
                    return self.id() ? League.datacontext().leagues.getSeasonsByLeagueId(self.id()) : [];
                },

                deferEvaluation: true
            });

            return self;
        };

        League.Nullo = new League()
            .id(0)
            .name('Not a League')
            .code('');
        League.Nullo.isNullo = true;
        League.Nullo.dirtyFlag().reset();

        var _dc = null;
        League.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        return League;
});