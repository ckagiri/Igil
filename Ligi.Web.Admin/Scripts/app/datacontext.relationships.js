define('datacontext.relationships',
    ['jquery', 'underscore', 'ko'],
    function($, _, ko) {
        var Relationships = function(leagues, seasons, teams, ssnTeams) {
            var seasonsByLeague, teamsBySeason,
                refreshSeasonsByLeague = function() {
                    seasonsByLeague = _.reduce(seasons.getAllLocal(), function (memo, s) {
                        var leagueId = s.leagueId();
                        memo[leagueId] = memo[leagueId] || [];
                        memo[leagueId].push(seasons.getLocalById(s.id()));
                        return memo;
                    }, { });
                },
                refreshTeamsBySeason = function () {
                    teamsBySeason = _.reduce(ssnTeams.getAllLocal(), function (memo, n) {
                        var seasonId = n.seasonId();
                        memo[seasonId] = memo[seasonId] || [];
                        memo[seasonId].push(teams.getLocalById(n.teamId()));
                        return memo;
                    }, { });
                },
                refreshLocal = function() {
                    refreshSeasonsByLeague();
                    refreshTeamsBySeason();
                },
                getLocalSeasonsByLeagueId = function (leagueId) {
                    var leagueSeasons,
                        results = !!leagueId && !!(leagueSeasons = seasonsByLeague[leagueId]) ? leagueSeasons.slice() : [];
                    return results;
                },
                getLocalTeamsBySeasonId = function (seasonId) {
                    var seasonTeams,
                        results = !!seasonId && !!(seasonTeams = teamsBySeason[seasonId]) ? seasonTeams.slice() : [];
                    return results;
                },
                init = function () {
                    refreshLocal();
                };
            init();
            return {
                refreshLocal: refreshLocal,
                getLocalSeasonsByLeagueId: getLocalSeasonsByLeagueId,
                getLocalTeamsBySeasonId: getLocalTeamsBySeasonId
            };
        };
        return {
            Relationships: Relationships
        };
    });