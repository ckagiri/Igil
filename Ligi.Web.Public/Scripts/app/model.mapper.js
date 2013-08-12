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
                fromDto: function(dto, item) {
                    item = item || new model.Team().id(dto.id);
                    item.name(dto.name)
                        .homeGround(dto.homeGround)
                        .code(dto.code);
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
                fromDto: function(dto, item) {
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
                        .startOfWeek(dto.startOfWeek)
                        .endOfWeek(dto.endOfWeek);
                    item.dirtyFlag().reset();
                    return item;
                }
            },
            weekaccount = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function(dto, item) {
                    item = item || new model.WeekAccount().id(dto.id);
                    item.seasonId(dto.seasonId)
                        .credit(dto.credit)
                        .balance(dto.balance)
                        .available(dto.available)
                        .totalStake(dto.totalStake)
                        .totalPayout(dto.totalPayout)
                        .profit(dto.profit)
                        .startDate(dto.startDate)
                        .endDate(dto.endDate);
                    return item;
                }
            },
            bet = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function(dto, item) {
                    item = item || new model.Bet().id(dto.id);
                    item.seasonId(dto.seasonId)
                        .fixtureId(dto.fixtureId)
                        .betType(dto.betType)
                        .handicap(dto.handicap)
                        .betPick(dto.betPick)
                        .stake(dto.stake)
                        .payout(dto.payout)
                        .profit(dto.profit)
                        .userId(dto.userId)
                        .bookieId(dto.bookieId)
                        .timeStamp(dto.timeStamp)
                        .betResult(dto.betResult);
                    return item;
                }
            },
            weekleader = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function(dto, item) {
                    item = item || new model.WeekLeader().id(dto.id);
                    item.userId(dto.userId)
                        .userName(dto.userName)
                        .seasonId(dto.seasonId)
                        .totalPayout(dto.totalPayout)
                        .totalStake(dto.totalStake)
                        .profit(dto.profit)
                        .startDate(dto.startDate)
                        .endDate(dto.endDate);
                    return item;
                }
            },
            monthleader = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function(dto, item) {
                    item = item || new model.MonthLeader().id(dto.id);
                    item.userId(dto.userId)
                        .userName(dto.userName)
                        .seasonId(dto.seasonId)
                        .totalPayout(dto.totalPayout)
                        .totalStake(dto.totalStake)
                        .profit(dto.profit)
                        .year(dto.year)
                        .month(dto.month);
                    return item;
                }
            },
            seasonleader = {
                getDtoId: function(dto) { return dto.id; },
                fromDto: function(dto, item) {
                    item = item || new model.SeasonLeader().id(dto.id);
                    item.userId(dto.userId)
                        .userName(dto.userName)
                        .seasonId(dto.seasonId)
                        .totalPayout(dto.totalPayout)
                        .totalStake(dto.totalStake)
                        .profit(dto.profit);
                    return item;
                }
            };
        return {
            league: league,
            season: season,
            team: team,
            seasonteam: seasonteam,
            fixture: fixture,
            weekaccount: weekaccount,
            bet: bet,
            weekleader: weekleader,
            monthleader: monthleader,
            seasonleader: seasonleader
        };
    });