define('datacontext', 
    ['jquery', 'underscore', 'ko', 'model', 'model.mapper', 'dataservice', 'config', 'utils', 'datacontext.relationships'],
    function ($, _, ko, model, modelmapper, dataservice, config, utils, Relationships) {
        var logger = config.logger,
            itemsToArray = function(items, observableArray, filter, sortFunction) {
                // Maps the memo to an observableArray, 
                // then returns the observableArray
                if (!observableArray) return;

                // Create an array from the memo object
                var underlyingArray = utils.mapMemoToArray(items);

                if (filter) {
                    underlyingArray = _.filter(underlyingArray, function(o) {
                        var match = filter.predicate(filter, o);
                        return match;
                    });
                }
                if (sortFunction) {
                    underlyingArray.sort(sortFunction);
                }
                //logger.info('Fetched, filtered and sorted ' + underlyingArray.length + ' records');
                observableArray(underlyingArray);
            },
            mapToContext = function(dtoList, items, results, mapper, filter, sortFunction) {
                // Loop through the raw dto list and populate a dictionary of the items
                items = _.reduce(dtoList, function(memo, dto) {
                    var id = mapper.getDtoId(dto);
                    var existingItem = items[id];
                    memo[id] = mapper.fromDto(dto, existingItem);
                    return memo;
                }, { });
                itemsToArray(items, results, filter, sortFunction);
                //logger.success('received with ' + dtoList.length + ' elements');
                return items; // must return these
            },
            EntitySet = function(getFunction, mapper, nullo, updateFunction) {
                var items = { },
                    // returns the model item produced by merging dto into context
                    mapDtoToContext = function(dto) {
                        var id = mapper.getDtoId(dto);
                        var existingItem = items[id];
                        items[id] = mapper.fromDto(dto, existingItem);
                        return items[id];
                    },
                    add = function(newObj) {
                        items[newObj.id()] = newObj;
                    },
                    removeById = function(id) {
                        delete items[id];
                    },
                    getLocalById = function(id) {
                        // This is the only place we set to NULLO
                        return !!id && !!items[id] ? items[id] : nullo;
                    },
                    getAllLocal = function() {
                        return utils.mapMemoToArray(items);
                    },
                    getData = function(options) {
                        return $.Deferred(function(def) {
                            var results = options && options.results,
                                sortFunction = options && options.sortFunction,
                                filter = options && options.filter,
                                forceRefresh = options && options.forceRefresh,
                                param = options && options.param,
                                getFunctionOverride = options && options.getFunctionOverride;

                            getFunction = getFunctionOverride || getFunction;

                            // If the internal items object doesnt exist, 
                            // or it exists but has no properties, 
                            // or we force a refresh
                            if (forceRefresh || !items || !utils.hasProperties(items)) {
                                getFunction({
                                    success: function(dtoList) {
                                        items = mapToContext(dtoList, items, results, mapper, filter, sortFunction);
                                        def.resolve(results);
                                    },
                                    error: function(response) {
                                        logger.error(config.toasts.errorGettingData);
                                        def.reject();
                                    }
                                }, param);
                            } else {
                                itemsToArray(items, results, filter, sortFunction);
                                def.resolve(results);
                            }
                        }).promise();
                    },
                    updateData = function(entity, callbacks) {

                        var entityJson = ko.toJSON(entity);

                        return $.Deferred(function(def) {
                            if (!updateFunction) {
                                logger.error('updateData method not implemented');
                                if (callbacks && callbacks.error) {
                                    callbacks.error();
                                }
                                def.reject();
                                return;
                            }

                            updateFunction({
                                success: function(response) {
                                    logger.success(config.toasts.savedData);
                                    entity.dirtyFlag().reset();
                                    if (callbacks && callbacks.success) {
                                        callbacks.success();
                                    }
                                    def.resolve(response);
                                },
                                error: function(response) {
                                    logger.error(config.toasts.errorSavingData);
                                    if (callbacks && callbacks.error) {
                                        callbacks.error();
                                    }
                                    def.reject(response);
                                    return;
                                }
                            }, entityJson);
                        }).promise();
                    };

                return {
                    mapDtoToContext: mapDtoToContext,
                    add: add,
                    getAllLocal: getAllLocal,
                    getLocalById: getLocalById,
                    getData: getData,
                    removeById: removeById,
                    updateData: updateData
                };
            },
            leagues = new EntitySet(dataservice.league.getLeagues, modelmapper.league, model.League.Nullo, dataservice.league.updateLeague),
            seasons = new EntitySet(dataservice.season.getSeasons, modelmapper.season, model.Season.Nullo, dataservice.season.updateSeason),
            teams = new EntitySet(dataservice.team.getTeams, modelmapper.team, model.Team.Nullo, dataservice.team.updateTeam),
            seasonTeams = new EntitySet(dataservice.seasonteam.getAllSeasonTeams, modelmapper.seasonteam, model.SeasonTeam.Nullo),
            fixtures = new EntitySet(dataservice.fixture.getFixtures, modelmapper.fixture, model.Fixture.Nullo, dataservice.fixture.updateFixture),
            weekaccounts = new EntitySet(dataservice.lookup.getWeekAccount, modelmapper.weekaccount, model.WeekAccount.Nullo),
            relationships = new Relationships.Relationships(leagues, seasons, teams, seasonTeams),
            bets = new EntitySet(dataservice.bets.getBets, modelmapper.bet, model.Bet.Nullo),
            weekleaderboard = new EntitySet(dataservice.leaderboard.getWeekLeaderBoard, modelmapper.weekleader, model.WeekLeader.Nullo),
            monthleaderboard = new EntitySet(dataservice.leaderboard.getMonthLeaderBoard, modelmapper.monthleader, model.MonthLeader.Nullo),
            seasonleaderboard = new EntitySet(dataservice.leaderboard.getSeasonLeaderBoard, modelmapper.seasonleader, model.SeasonLeader.Nullo),
            getCurrentWeek = function(options, callbacks) {
                return $.Deferred(function(def) {
                    var currentWeek = options && options.results;
                    dataservice.lookup.getCurrentWeek(
                        {
                            success: function(dto) {
                                currentWeek.startDate(dto.startDate);
                                currentWeek.endDate(dto.endDate);
                                if (callbacks && callbacks.success) {
                                    callbacks.success(currentWeek);
                                }
                                def.resolve(dto);
                            },
                            error: function(response) {
                                logger.error('oops! could not retrieve current week-range');
                                if (callbacks && callbacks.error) {
                                    callbacks.error(response);
                                }
                                def.reject(response);
                            }
                        });
                });
            },
            getMonthWeeks = function(options, callbacks) {
                var param = options && options.param;
                dataservice.lookup.getMonthWeeks(
                    {
                        success: function (dto) {
                            if (callbacks && callbacks.success) {
                                callbacks.success(dto);
                            }
                        },
                        error: function(response) {
                            logger.error('oops! could not retrieve current week-range');
                            if (callbacks && callbacks.error) {
                                callbacks.error(response);
                            }
                        }
                    },
                    param);
            };

        seasons.getTeamsBySeasonId = function (seasonId) {
            return relationships.getLocalTeamsBySeasonId(seasonId);
        };

        leagues.getSeasonsByLeagueId = function(leagueId) {
            return relationships.getLocalSeasonsByLeagueId(leagueId);
        };

        seasons.getSeasonWeeks = function(seasonId, callbacks) {
            return $.Deferred(function (def) {
                var season = seasons.getLocalById(seasonId);
                if (season.weeks().length === 0) {
                    dataservice.lookup.getSeasonWeeks(
                        {
                            success: function(dto) {
                                season.weeks(dto);
                                if (callbacks && callbacks.success) {
                                    callbacks.success(season);
                                }
                                def.resolve(season);
                            },
                            error: function(response) {
                                logger.error('oops! could not retrieve season weeks for ' + seasonId);
                                if (callbacks && callbacks.error) {
                                    callbacks.error(response);
                                }
                                def.reject(response);
                            }
                        },
                        seasonId
                    );
                } else {
                    if (callbacks && callbacks.success) {
                        callbacks.success(season);
                    }
                    def.resolve(season);
                }
            }).promise();
        };

        weekaccounts.getWeekAccount = function (startDate, endDate, callbacks, forceRefresh) {
            var accounts, weekaccount, test;
            return $.Deferred(function (def) {
                accounts = weekaccounts.getAllLocal();
                weekaccount =
                    _.find(weekaccounts.getAllLocal(), function(acc) {
                        test = moment(acc.startDate()).format('DD-MMM-YYYY') ===
                            moment(startDate).format('DD-MMM-YYYY');
                        return test;
                    });
                if (!weekaccount || weekaccount.isNullo() || forceRefresh) {
                    dataservice.lookup.getWeekAccount(
                        {
                            success: function (dto) {
                                weekaccount = weekaccounts.mapDtoToContext(dto);
                                if (callbacks && callbacks.success) { callbacks.success(weekaccount); }
                                def.resolve(weekaccount);
                            },
                            error: function (response) {
                                logger.error('oops! could not retrieve week acount for ' + startDate + ' ' + endDate);
                                if (callbacks && callbacks.error) { callbacks.error(response); }
                                def.reject(response);
                            }
                        },
                        startDate,
                        endDate
                    );
                } else {
                    if (callbacks && callbacks.success) { callbacks.success(weekaccount); }
                    def.resolve(weekaccount);
                }
            }).promise();
        };

        weekaccounts.updateWeekAccount = function (data, callbacks) {
            var acc, test, obj;
            acc = _.find(weekaccounts.getAllLocal(), function(wa) {
                test = moment(wa.startDate()).format('DD-MMM-YYYY') ===
                    moment(data.startDate).format('DD-MMM-YYYY');
                return test;
            });
            obj = {
                id: acc ? acc.id() : data.id,
                credit: data.credit,
                balance: data.balance,
                available: data.available,
                totalStake: data.totalStake,
                totalPayout: data.totalPayout,
                profit: data.profit,
                startDate: data.startDate,
                endDate: data.endDate
            };
            weekaccounts.mapDtoToContext(obj);
            logger.success("Week Account Updated");
        };

        fixtures.upsertFixture = function(dto, callbacks) {
            fixtures.mapDtoToContext(dto);
            logger.success("Fixture Upserted");
        };

        bets.upsertBet = function(data, callbacks) {
            var betsArr = ko.observableArray();
            bets.getData({results: betsArr});
            bets.mapDtoToContext(data);
            logger.success("Bet Processed");
        };

        bets.submitBets = function(options, callbacks) {
            return $.Deferred(function(def) {
                var items = options && options.betItems,
                    seasonId = options && options.seasonId,
                    betItems = [],
                    betslip = {};
                $.each(items, function (i, item) {
                    var data = {
                        fixtureId: item.fixtureId,
                        betType: item.betType,
                        betPick: item.betPick,
                        handicap: item.handicap,
                        fixtureKickOff: item.fixtureKickOff,
                        wager: item.wager(),
                        startOfWeek: item.startOfWeek,
                        endOfWeek: item.endOfWeek
                    };
                    betItems.push(data);
                });
                betslip.seasonId = seasonId;
                betslip.betItems = betItems;
                dataservice.bets.submitBets(
                    {
                        success: function (dto) {
                            logger.success("Betslip Submitted Succesfully");
                            if (callbacks && callbacks.success) {
                                callbacks.success(dto);
                            }
                            def.resolve(betItems);
                        },
                        error: function(response) {
                            logger.error('oops! could not submit betslip');
                            if (callbacks && callbacks.error) {
                                callbacks.error(response);
                            }
                            def.reject(betItems);
                        }
                    }, ko.toJSON(betslip));
            });
        };
     
        var datacontext = {
            currentWeek: getCurrentWeek,
            monthWeeks: getMonthWeeks,
            leagues: leagues,
            seasons: seasons,
            teams: teams,
            seasonTeams: seasonTeams,
            bets: bets,
            relationships: relationships,
            fixtures: fixtures,
            weekaccounts: weekaccounts,
            weekleaderboard: weekleaderboard,
            monthleaderboard: monthleaderboard,
            seasonleaderboard: seasonleaderboard
        };
        
        model.setDataContext(datacontext);

        return datacontext;
});