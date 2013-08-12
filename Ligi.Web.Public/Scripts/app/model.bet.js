define('model.bet', ['ko'],
    function (ko) {
        var Bet = function() {
            var self = this;
            self.id = ko.observable();
            self.seasonId = ko.observable();
            self.fixtureId = ko.observable();
            self.betType = ko.observable();
            self.handicap = ko.observable();
            self.betPick = ko.observable();
            self.stake = ko.observable();
            self.payout = ko.observable();
            self.profit = ko.observable();
            self.userId = ko.observable();
            self.bookieId = ko.observable();
            self.timeStamp = ko.observable();
            self.betResult = ko.observable();
            self.timeStampFull = ko.computed(function () {
                return self.timeStamp() ? moment(self.timeStamp()).format('DD-MMM-YYYY hh:mm') : '';
            });
            self.pickDesc = ko.computed({
                read: function () {
                    if (self.betType() === 1) {
                        var plus = self.handicap() > 0 ? "+" : "";
                        if (self.betPick() === 1) {
                            return self.fixture().homeTeam().name() + " (" + plus + self.handicap() + ")";
                        }
                        if (self.betPick() === 2) {
                            return self.fixture().awayTeam().name() + " (" + plus + self.handicap() + ")";
                        }
                    }
                    if (self.betType() === 2) {
                        var s = self.handicap() !== 1 ? "s" : "";
                        if (self.betPick() === 3) {
                            return "over " + self.handicap() + " goal" + s;
                        }
                        if (self.betPick() === 4) {
                            return "under " + self.handicap() + " goal" + s;
                        }
                    }
                    return "";
                },
                deferEvaluation: true
            });
            self.betResultDesc = ko.computed({
                read: function () {
                    if (self.betResult() === 0) {
                        if (self.payout() === 0)
                            return "pending";
                        else return "void";
                    }
                    else if (self.betResult() === 1) {
                        return "win";
                    }
                    else if (self.betResult() === 2) {
                        return "half-win";
                    }
                    else if (self.betResult() === 3) {
                        return "push";
                    }
                    else if (self.betResult() === 4) {
                        return "lose";
                    } else if (self.betResult() === 5) {
                        return "half-lose";
                    }
                    return "";
                },
                deferEvaluation: true
            });
            return self;
        };

        Bet.Nullo = new Bet()
            .id(0)
            .seasonId(0)
            .fixtureId(0)
            .betType(0)
            .handicap(0)
            .betPick(0)
            .stake(0)
            .payout(0)
            .profit(0)
            .userId(0)
            .bookieId(0)
            .timeStamp(new Date(2010, 1, 1, 1, 0, 0, 0))
            .betResult();
    
        var _dc = null;
        Bet.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        Bet.prototype = function () {
            var dc = Bet.datacontext,
                fixture = function() {
                    return dc().fixtures.getLocalById(this.fixtureId());
                };
            return {
                isNullo: false,
                fixture: fixture,
            };
        }();

        return Bet;
 });