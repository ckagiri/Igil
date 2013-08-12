define('model.bet', ['ko'],
    function (ko) {
        var Bet = function() {
            var self = this;
            self.id = ko.observable();
            self.fixtureId = ko.observable();
            self.betType = ko.observable();
            self.handicap = ko.observable();
            self.betPick = ko.observable();
            self.wager = ko.observable();
            self.stake = ko.observable();
            self.payout = ko.observable();
            self.timeStamp = ko.observable();
            return self;
        };

        Bet.Nullo = new Bet()
            .id(0)
            .fixtureId(0)
            .betType(0)
            .handicap(0)
            .betPick(0)
            .wager(0)
            .stake(0)
            .payout(0)
            .timeStamp(new Date(1900, 1, 1, 1, 0, 0, 0));

        return Bet;
 });