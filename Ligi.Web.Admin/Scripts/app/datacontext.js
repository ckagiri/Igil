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
                    underlyingArray = _.filter(underlyingArray, function (o) {
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
            EntitySet = function(getFunction, mapper, nullo, updateFunction, deleteFunction) {
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
                    },
                    deleteData = function (entity, callbacks) {
                        return $.Deferred(function(def) {
                            if (!deleteFunction) {
                                logger.error('deleteData method not implemented');
                                if (callbacks && callbacks.error) {
                                    callbacks.error();
                                }
                                def.reject();
                                return;
                            }
                            deleteFunction({
                                success: function(response) {
                                    removeById(entity.id());
                                    logger.success(config.toasts.savedData);
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
                            }, entity.id());
                        }).promise();
                    };

                return {
                    mapDtoToContext: mapDtoToContext,
                    add: add,
                    getAllLocal: getAllLocal,
                    getLocalById: getLocalById,
                    getData: getData,
                    removeById: removeById,
                    updateData: updateData,
                    deleteData: deleteData
                };
            },

            leagues = new EntitySet(dataservice.league.getLeagues, modelmapper.league, model.League.Nullo, dataservice.league.updateLeague, dataservice.league.deleteLeague),
            seasons = new EntitySet(dataservice.season.getSeasons, modelmapper.season, model.Season.Nullo, dataservice.season.updateSeason, dataservice.season.deleteSeason),
            teams = new EntitySet(dataservice.team.getTeams, modelmapper.team, model.Team.Nullo, dataservice.team.updateTeam, dataservice.team.deleteTeam),
            seasonTeams = new EntitySet(dataservice.seasonteam.getAllSeasonTeams, modelmapper.seasonteam, model.SeasonTeam.Nullo),
            fixtures = new EntitySet(dataservice.fixture.getFixtures, modelmapper.fixture, model.Fixture.Nullo, dataservice.fixture.updateFixture, dataservice.fixture.deleteFixture),
            relationships = new Relationships.Relationships(leagues, seasons, teams, seasonTeams);
        
        seasons.getTeamsBySeasonId = function (seasonId) {
            return relationships.getLocalTeamsBySeasonId(seasonId);
        };

        leagues.getSeasonsByLeagueId = function(leagueId) {
            return relationships.getLocalSeasonsByLeagueId(leagueId);
        };

        fixtures.getFixtureById = function (id, callbacks, forceRefresh) {
            return $.Deferred(function (def) {
                var fixture = fixtures.getLocalById(id);
                if (fixture.isNullo || forceRefresh) {
                    dataservice.fixture.getFixture({
                        success: function (dto) {
                            fixture = fixtures.mapDtoToContext(dto);
                            if (callbacks && callbacks.success) { callbacks.success(fixture); }
                            def.resolve(dto);
                        },
                        error: function (response) {
                            logger.error('oops! could not retrieve session ' + id);
                            if (callbacks && callbacks.error) { callbacks.error(response); }
                            def.reject(response);
                        }
                    },
                    id);
                }
                else {
                    if (callbacks && callbacks.success) { callbacks.success(fixture); }
                    def.resolve(fixture);
                }
            }).promise();
        };

        fixtures.addData = function(fixtureModel, callbacks) {
            var fixtureModelJson = ko.toJSON(fixtureModel);

            return $.Deferred(function(def) {
                dataservice.fixture.addFixture({
                    success: function(dto) {
                        if (!dto) {
                            logger.error(config.toasts.errorSavingData);
                            if (callbacks && callbacks.error) {
                                callbacks.error();
                            }
                            def.reject();
                            return;
                        }
                        var newFixture = modelmapper.fixture.fromDto(dto);
                        fixtures.add(newFixture);
                        logger.success(config.toasts.savedData);

                        if (callbacks && callbacks.success) {
                            callbacks.success(newFixture);
                        }
                        def.resolve(dto);
                    },
                    error: function(response) {
                        logger.error(config.toasts.errorSavingData);
                        if (callbacks && callbacks.error) {
                            callbacks.error();
                        }
                        def.reject(response);
                        return;
                    }
                }, fixtureModelJson);
            }).promise();
        };

        teams.getTeamById = function (id, callbacks, forceRefresh) {
            return $.Deferred(function (def) {
                var team = teams.getLocalById(id);
                if (team.isNullo || forceRefresh) {
                    dataservice.team.getTeam({
                        success: function (dto) {
                            team = teams.mapDtoToContext(dto);
                            if (callbacks && callbacks.success) { callbacks.success(team); }
                            def.resolve(dto);
                        },
                        error: function (response) {
                            logger.error('oops! could not retrieve team ' + id);
                            if (callbacks && callbacks.error) { callbacks.error(response); }
                            def.reject(response);
                        }
                    },
                    id);
                }
                else {
                    if (callbacks && callbacks.success) { callbacks.success(team); }
                    def.resolve(team);
                }
            }).promise();
        };

        teams.addData = function (teamModel, callbacks) {
            var teamModelJson = ko.toJSON(teamModel);

            return $.Deferred(function (def) {
                dataservice.team.addTeam({
                    success: function (dto) {
                        if (!dto) {
                            logger.error(config.toasts.errorSavingData);
                            if (callbacks && callbacks.error) { callbacks.error(); }
                            def.reject();
                            return;
                        }
                        var newTeam = modelmapper.team.fromDto(dto);
                        teams.add(newTeam); 
                        logger.success(config.toasts.savedData);
                        teamModel.dirtyFlag().reset();
                        
                        if (callbacks && callbacks.success) { callbacks.success(newTeam); }
                        def.resolve(dto);
                    },
                    error: function (response) {
                        logger.error(config.toasts.errorSavingData);
                        if (callbacks && callbacks.error) { callbacks.error(); }
                        def.reject(response);
                        return;
                    }
                }, teamModelJson);
            }).promise();
        };
        
        var datacontext = {
            leagues: leagues,
            seasons: seasons,
            teams: teams,
            seasonTeams: seasonTeams,
            fixtures: fixtures,
            relationships:  relationships
        };
        
        model.setDataContext(datacontext);

        return datacontext;
});