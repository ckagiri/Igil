using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ligi.Core.Events;
using Ligi.Core.Events.Contracts;

namespace Ligi.Core.Processes
{
    public class BookieProcessRouter : 
        IEventHandler<BetslipSubmitted>,
        IEventHandler<BetsProcessed>,
        IEventHandler<SeasonAccountUpdated>
    {
        private readonly Func<IProcessManagerDataContext<BookieProcess>> _contextFactory;

        public BookieProcessRouter(Func<IProcessManagerDataContext<BookieProcess>> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public void Handle(BetslipSubmitted @event)
        {
            using (var context = _contextFactory.Invoke())
            {
                var p = context.Find(x => x.BookieId == @event.BookieId);
                if (p == null)
                {
                    p = new BookieProcess();
                }
                p.Handle(@event);
                context.Save(p);
            }
        }

        public void Handle(BetsProcessed @event)
        {
            using (var context = _contextFactory.Invoke())
            {
                var p = context.Find(x => x.BookieId == @event.SourceId);
                if (p != null)
                {
                    p.Handle(@event);
                    context.Save(p);
                }
                else
                {
                    Trace.TraceError("Failed to locate the process for bookie with id {0}.", @event.SourceId);
                }
            }
        }

        public void Handle(SeasonAccountUpdated @event)
        {
            using (var context = _contextFactory.Invoke())
            {
                var p = context.Find(x => x.BookieId == @event.BookieId);
                if (p != null)
                {
                    p.Handle(@event);
                    context.Save(p);
                }
                else
                {
                    Trace.TraceError("Failed to locate the process for bookie with id {0}.", @event.SourceId);
                }
            }  
        }
    }
}
