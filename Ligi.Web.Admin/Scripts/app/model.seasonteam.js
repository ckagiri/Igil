define('model.seasonteam',
    ['ko'],
    function(ko) {
        var _dc = null,
            SeasonTeam = function() {
                var self = this;
                self.seasonId = ko.observable();
                self.teamId = ko.observable();
                self.isNullo = false;
                return self;
            };
        
        SeasonTeam.makeId = function (seasonId, teamId) {
            return (seasonId + ',' + teamId);
        },

        SeasonTeam.Nullo = new SeasonTeam()
            .seasonId(0)
            .teamId(0);
        SeasonTeam.Nullo.isNullo = true;

        return SeasonTeam;
    });

