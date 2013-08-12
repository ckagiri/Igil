define('model.mapper',
['model'],
    function (model) {
        var league = {
            getDtoId: function(dto) { return dto.id; },
            fromDto: function(dto, item) {
                item = item || new model.League().id(dto.id);
                item.name(dto.name)
                    .code(dto.code);
                item.dirtyFlag().reset();
                return item;
            }
        },
            season = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function(dto, item) {
                    item = item || new model.Season().id(dto.id);
                    item.name(dto.name)
                        .startDate(dto.startDate)
                        .endDate(dto.endDate)
                        .leagueId(dto.leagueId);
                    item.dirtyFlag().reset();
                    return item;
                }
            },
            team = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Team().id(dto.id);
                    item.name(dto.name)
                        .homeGround(dto.homeGround)
                        .code(dto.code)
                        .tags(dto.tags);
                    item.dirtyFlag().reset();
                    return item;
                }
            },
            seasonteam = {
                getDtoId: function(dto) {
                    return model.SeasonTeam.makeId(dto.seasonId, dto.teamId);
                },
                fromDto: function(dto, item) {
                    item = item || new model.SeasonTeam();
                    item.seasonId(dto.seasonId)
                        .teamId(dto.teamId);
                    return item;
                }
            },
            fixture = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Fixture().id(dto.id);
                    item.seasonId(dto.seasonId)
                        .homeTeamId(dto.homeTeamId)
                        .awayTeamId(dto.awayTeamId)
                        .venue(dto.venue)
                        .kickOff(dto.kickOff)
                        .matchStatus(dto.matchStatus)
                        .homeScore(dto.homeScore)
                        .awayScore(dto.awayScore)
                        .homeAsianHandicap(dto.homeAsianHandicap)
                        .awayAsianHandicap(dto.awayAsianHandicap)
                        .totalGoalsHandicap(dto.totalGoalsHandicap)
                        .startOfWeek(moment(dto.startOfWeek).format('DD-MMM-YYYY'))
                        .endOfWeek(moment(dto.endOfWeek).format('DD-MMM-YYYY'));
                    item.dirtyFlag().reset();
                    return item;
                }
            };
        return {
            league: league,
            season: season,
            team: team,
            seasonteam: seasonteam,
            fixture: fixture
        };
    });