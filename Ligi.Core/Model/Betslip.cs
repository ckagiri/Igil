using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ligi.Core.Model
{
    public class Betslip
    {
        public Guid SeasonId { get; set; }
        public List<BetItem> BetItems { get; set; }
    }
}
