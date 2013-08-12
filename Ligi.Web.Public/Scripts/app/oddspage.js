define('oddspage',['underscore','ko', 'hangcheng', 'total-goals', 'bus'],
function(_, ko, Hangcheng, Totalgoals, bus) {
    var MatchOdds = function (fixture, oddsType, oddsFor) {
        var self = this,
            form = { },
            tip;
        var homeTeam = fixture.homeTeam().name();
        var awayTeam = fixture.awayTeam().name();
        self.isHomeOdds = ko.observable(false);
        self.isAwayOdds = ko.observable(false);
        self.isOverOdds = ko.observable(false);
        self.isUnderOdds = ko.observable(false);
        self.fixture = fixture;
        if (oddsType == "hangcheng") {
            self.oddsType = 1;
            if (oddsFor == "home") {
                self.oddsPick = 1;
                self.symbol = self.fixture.homeAsianHandicap() > 0 ? "+" : "";
                self.isHomeOdds(true);
                self.oddsDesc = homeTeam + " (" + self.symbol + self.fixture.homeAsianHandicap() + ")";
                form.selection = homeTeam;
                form.allScenarios = true;
                form.handicap = self.fixture.homeAsianHandicap();
                form.s_handicap = self.fixture.homeAsianHandicap().toFixed(2);
                tip = new Hangcheng.Init(form).output;
                self.tip = ko.observable(tip);
            } else {
                self.oddsPick = 2;
                self.isAwayOdds(true);
                self.symbol = self.fixture.awayAsianHandicap() > 0 ? "+" : "";
                self.oddsDesc = awayTeam + " (" + self.symbol + self.fixture.awayAsianHandicap() + ")";
                form.selection = awayTeam;
                form.allScenarios = true;
                form.handicap = self.fixture.awayAsianHandicap();
                form.s_handicap = self.fixture.awayAsianHandicap().toFixed(2);
                tip = new Hangcheng.Init(form).output;
                self.tip = ko.observable(tip);
            }
        } else if (oddsType == "totalgoals") {
            self.oddsType = 2;
            self.s = self.fixture.totalGoalsHandicap() != 1 ? "s" : "";
            if (oddsFor == "over") {
                self.oddsPick = 3;
                self.isOverOdds(true);
                self.oddsDesc = "Over " + self.fixture.totalGoalsHandicap() + " goal" + self.s;
                form.selection = "over";
                form.allScenarios = true;
                form.handicap = self.fixture.totalGoalsHandicap();
                form.s_handicap = self.fixture.totalGoalsHandicap().toFixed(2);
                tip = new Totalgoals.Init(form).output;
                self.tip = ko.observable(tip);
            } else {
                self.oddsPick = 4;
                self.isUnderOdds(true);
                self.oddsDesc = "Under " + self.fixture.totalGoalsHandicap() + " goal" + self.s;
                form.selection = "under";
                form.allScenarios = true;
                form.handicap = -(self.fixture.totalGoalsHandicap());
                form.s_handicap = self.fixture.totalGoalsHandicap().toFixed(2);
                tip = new Totalgoals.Init(form).output;
                self.tip = ko.observable(tip);
            }
        }
        self.handicap = form.handicap;
    },
    BetItem = function(oddsItem) {
        var self = this;
        var price = 1.95;
        self.wager = ko.observable();
        self.betType = oddsItem.oddsType;
        self.betPick = oddsItem.oddsPick;
        self.fixtureId = oddsItem.fixture.id();
        self.startOfWeek = oddsItem.fixture.startOfWeek();
        self.endOfWeek = oddsItem.fixture.endOfWeek();
        self.matchDescShort = oddsItem.fixture.matchShort();
        self.fixtureKickOff = oddsItem.fixture.kickOff();
        self.handicap = oddsItem.handicap;
        self.pickDesc = ko.computed({
            read: function () {
                if (self.betType == 1) {
                    if (self.betPick == 1) {
                        return oddsItem.oddsDesc;
                    }
                    if (self.betPick = 2) {
                        return oddsItem.oddsDesc;

                    }
                }
                if (self.betType == 2) {
                    if (self.betPick == 3) {
                        return oddsItem.oddsDesc;
                    }
                    if (self.betPick = 4) {
                        return oddsItem.oddsDesc;
                    }
                }
                return "";
            },
            deferEvaluation: true
        });
        self.subtotal = ko.computed(function() {
            return self.wager() ? parseInt("0" + self.wager(), 10) : 0;
        });
        self.possiblePayout = ko.computed(function () {
            return self.wager() ? price * parseInt("0" + self.wager(), 10) : 0;
        });
        self.wager.subscribe(function () {
            
        });
        return self;
    },
    Betslip = function() {
        var self = this;
        self.items = ko.observableArray();
        self.add = function (oddsItem) {
            var match =
                ko.utils.arrayFirst(self.items(), function (item) {
                    var id = item.fixtureId == oddsItem.fixture.id();
                    var type = item.betType == oddsItem.oddsType; var pick = item.betPick == oddsItem.oddsPick;
                    return id && type && pick;
                });
            if (!match) {
                self.items.push(new BetItem(oddsItem));
            }
        },
        self.remove = function(item) {
            self.items.remove(item);
        },
        self.submit = function() {
        },
       self.totalStake= ko.computed(function () {
            var total = 0;
            $.each(self.items(), function () { total += this.subtotal(); });
            return total;
        });
        self.maxPayout = ko.computed(function () {
            var total = 0;
            $.each(self.items(), function () { total += this.possiblePayout(); });
            return total;
        });
        (function () {
            bus.data.subscribe("betslip.success", function (data) {
                var items = self.items(),
                    len = items.length;
                for (var i = 0; i < len; i++) {
                    var bet = _.find(self.items(), function(item) {
                        return _.any(data, function(n) {
                            return n.betType === item.betType &&
                                n.betPick && item.betPick && n.handicap === item.handicap;
                        });
                    });
                    self.items.remove(bet);
                    console.log(bet);
                }
            });
            bus.data.subscribe("betslip.error", function (data) {
                console.log(data);
            });
        })();
        return self;
    };
    return {
        MatchOdds: MatchOdds,
        BetSlip: Betslip
    };
});

