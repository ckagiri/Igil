define('hangcheng',
function() {
    var Init = function (form) {
        var selection = form.selection,
            allScenarios = form.allScenarios,
            odds = 1.95,
            s_handicap = form.s_handicap,
            //wager = form.wager,
            //homeScore = form.homeScore,
            //awayScore = form.awayScore,
            handicap = form.handicap,
            mod = handicap * 4 % 2,
            diff,
            output = "";
        var pendingOutput = "Bet " + selection + ".";
        var ending = s_handicap.substr((s_handicap.length - 2), 2); // ?? math refactor
        var diffScenarios = new Array();
        if (ending == 50) {
            diffScenarios[0] = Math.floor(handicap);
            diffScenarios[1] = Math.floor(handicap) + 1;
        } else if (ending == 00) {
            diffScenarios[0] = handicap - 1;
            diffScenarios[1] = handicap;
            diffScenarios[2] = handicap + 1;
        } else {
            diffScenarios[0] = Math.round(handicap) - 1;
            diffScenarios[1] = Math.round(handicap);
            diffScenarios[2] = Math.round(handicap) + 1;
        }

        if (allScenarios) {
            // Possible Bet Outcomes
            for (var i = 0; i < diffScenarios.length; i++) {
                if (diffScenarios[i] == 0) {
                    pendingOutput = pendingOutput + " If the match ends in a draw,";
                    if (i == 0) {
                        pendingOutput = pendingOutput + " or they win,";
                    }
                    if (i == (diffScenarios.length - 1)) {
                        pendingOutput = pendingOutput + " or they lose,";
                    }
                    pendingOutput = pendingOutput + " ";
                } else if (diffScenarios[i] < 0) {
                    pendingOutput = pendingOutput + " If they win by " + Math.abs(diffScenarios[i]) + " goal";
                    if (Math.abs(diffScenarios[i]) != 1) {
                        pendingOutput = pendingOutput + "s";
                    }
                    if (i == 0) {
                        pendingOutput = pendingOutput + " or more";
                    }
                    if (i == (diffScenarios.length - 1)) {
                        if (Math.abs(diffScenarios[i]) != 1) {
                            pendingOutput = pendingOutput + " or less, draw or lose";
                        } else {
                            pendingOutput = pendingOutput + ", draw or lose";
                        }
                    }
                    pendingOutput = pendingOutput + ", ";
                } else {
                    pendingOutput = pendingOutput + " If they lose by " + diffScenarios[i] + " goal";
                    if (diffScenarios[i] != 1) {
                        pendingOutput = pendingOutput + "s";
                    }
                    if (i == 0) {
                        if (diffScenarios[i] != 1) {
                            pendingOutput = pendingOutput + " or less, draw or win";
                        } else {
                            pendingOutput = pendingOutput + ", draw or win";
                        }
                    }
                    if (i == (diffScenarios.length - 1)) {
                        pendingOutput = pendingOutput + " or more";
                    }
                    pendingOutput = pendingOutput + ", ";
                }
                switch (determineResult(-diffScenarios[i], handicap, mod)) {
                case "Win":
                    pendingOutput = pendingOutput + "your stake is multiplied by 1.95.";
                    break;
                case "Half Win":
                    pendingOutput = pendingOutput + "half your stake is refunded, the other is multiplied by 1.95.";
                    break;
                case "Lose":
                    pendingOutput = pendingOutput + "you lose your stake.";
                    break;
                case "Half Lose":
                    pendingOutput = pendingOutput + "half your stake is refunded, the other half you lose.";
                    break;
                case "Push":
                    pendingOutput = pendingOutput + "your stake is refunded.";
                    break;
                default:
                }
            }
            output = pendingOutput;
        } else {
            // Calculate for specific scoreline 
            if (selection == "home" || selection == "chelsea") {
                diff = homeScore - awayScore;
            } else {
                diff = awayScore - homeScore;
            }
            diff = -diff; // to make compatible with all outcomes usage
            pendingOutput = ""; // Bet Outcome		
            pendingOutput = pendingOutput + displayOutput(selection, odds, handicap, mod, wager, diff);
            output = pendingOutput;
        }
        //console.log(output);
        return {
            output: output
        };
    };

    function determinePayout(diff, handicap, mod, odds, wager) {
        var payout;
        if (mod == 0) {
            if ((diff + handicap) > 0) {
                payout = wager + (wager * (odds - 1));
            } else if ((diff + handicap) == 0) {
                payout = wager;
            } else {
                payout = 0;
            }
        } else {
            var compareUp = (diff + handicap) + 0.25;
            var compareDown = (diff + handicap) - 0.25;
            if ((compareUp > 0) && (compareDown > 0)) {
                payout = wager + (wager * (odds - 1));
            } else if ((compareUp < 0) && (compareDown < 0)) {
                payout = 0;
            } else if ((compareUp > 0) && (compareDown == 0)) {
                payout = wager + (0.5 * (wager * (odds - 1)));
            } else {
                payout = wager / 2;
            }
        }
        return payout.toFixed(2);
    }

    function determineResult(diff, handicap, mod) {
        if (mod == 0) {
            if ((diff + handicap) > 0) {
                return "Win";
            } else if ((diff + handicap) == 0) {
                return "Push";
            } else {
                return "Lose";
            }
        } else {
            var compareUp = diff + handicap + 0.25;
            var compareDown = diff + handicap - 0.25;
            if ((compareUp > 0) && (compareDown > 0)) {
                return "Win";
            } else if ((compareUp < 0) && (compareDown < 0)) {
                return "Lose";
            } else if ((compareUp > 0) && (compareDown == 0)) {
                return "Half Win";
            } else {
                return "Half Lose";
            }
        }
    }

    function displayOutput(selection, odds, handicap, mod, wager, diff) {
        var pendingOutput = "";
        diff = -diff;
        if (mod == 0) {
            pendingOutput = pendingOutput + "Result: " + determineResult(diff, handicap, mod);
            pendingOutput = pendingOutput + " Payout: " + determinePayout(diff, handicap, mod, odds, wager);
            pendingOutput = pendingOutput + " Profit: " + (determinePayout(diff, handicap, mod, odds, wager) - wager.toFixed(2)).toFixed(2);
        } else {
            var h_handicap = new Array(),
                h_result = new Array(),
                h_payout = new Array(),
                h_profit = new Array(),
                h_mod = new Array(),
                h_wager;

            h_handicap[0] = handicap + 0.25;
            h_handicap[1] = handicap - 0.25;

            h_mod[0] = (h_handicap[0] * 4) % 2;
            h_mod[1] = (h_handicap[1] * 4) % 2;

            h_wager = wager / 2;

            h_result[0] = determineResult(diff, h_handicap[0], h_mod[0]);
            h_result[1] = determineResult(diff, h_handicap[1], h_mod[1]);
            h_result[2] = determineResult(diff, handicap, mod);

            h_payout[0] = determinePayout(diff, h_handicap[0], h_mod[0], odds, h_wager);
            h_payout[1] = determinePayout(diff, h_handicap[1], h_mod[1], odds, h_wager);
            h_payout[2] = determinePayout(diff, handicap, mod, odds, wager);

            h_profit[0] = h_payout[0] - h_wager;
            h_profit[1] = h_payout[1] - h_wager;
            h_profit[2] = h_payout[2] - wager;

            pendingOutput = pendingOutput + "Half Bets & Overall Bets";
            pendingOutput = pendingOutput + " Handicap: " + h_handicap[0] + ", " + h_handicap[1] + ", " + handicap;
            pendingOutput = pendingOutput + " Wager: " + h_wager.toFixed(2) + ", " + h_wager.toFixed(2) + ", " + wager.toFixed(2);
            pendingOutput = pendingOutput + " Result: " + h_result[0] + ", " + h_result[1] + ", " + h_result[2];
            pendingOutput = pendingOutput + " Payout: " + h_payout[0] + ", " + h_payout[1] + ", " + h_payout[2];
            pendingOutput = pendingOutput + " Profit: " + h_profit[0].toFixed(2) + ", " + h_profit[1].toFixed(2) + ", " + h_profit[2].toFixed(2);
        }
        return pendingOutput;
    }

    return {
        Init: Init
    };
});


