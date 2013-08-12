define('model.weekaccount', ['ko'],
    function (ko) {
        var WeekAccount = function() {
            var self = this;
            self.id = ko.observable();
            self.seasonId = ko.observable();
            self.credit = ko.observable();
            self.balance = ko.observable();
            self.available = ko.observable();
            self.totalStake = ko.observable();
            self.totalPayout = ko.observable();
            self.profit = ko.observable();
            self.startDate = ko.observable();
            self.endDate = ko.observable();
            self.isNullo = ko.observable(false);
            return self;
        };
        
        WeekAccount.Nullo = new WeekAccount()
            .id(0)
            .seasonId(0)
            .credit(0)
            .balance(0)
            .totalStake(0)
            .totalPayout(0)
            .profit(0)
            .startDate(new Date(1900, 1, 1, 1, 0, 0, 0))
            .endDate(new Date(1900, 1, 1, 1, 0, 0, 0))
            .isNullo(true);

        return WeekAccount;
});