using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Itenso.TimePeriod;
using NUnit.Framework;
using System.Globalization;

namespace Ligi.ConsoleManager
{
    public class Program
    {
        private DateTime _workingPeriodStartDate;
        private DateTime _workingPeriodEndDate;

        private enum PeriodSelectType
        {
            Previous,
            Current,
            Next,
        }

        private struct WeekRange
        {
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
        }

        private WeekRange GetWeekRange(DateTime workingPeriodStart)
        {
            var culture = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            var uiculture = (CultureInfo)CultureInfo.CurrentUICulture.Clone();

            culture.DateTimeFormat.FirstDayOfWeek = DayOfWeek.Monday;
            uiculture.DateTimeFormat.FirstDayOfWeek = DayOfWeek.Monday;

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = uiculture; 



            CalendarTimeRange week = new Week(workingPeriodStart);

            //var workingPeriodStartDate = week.FirstDayStart;

            //var workingWeek = new Week(workingPeriodStartDate);

            //var timeRange = workingWeek.AddWeeks(0);

            return new WeekRange
                       {
                           Start = week.Start,
                           End = week.End
                       };
        }

        [Test]
        public void gets_correct_week_range()
        {
            
        }

        [Test]
        public void Main()
        {
            var culture = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            var uiculture = (CultureInfo)CultureInfo.CurrentUICulture.Clone();

            culture.DateTimeFormat.FirstDayOfWeek = DayOfWeek.Monday;
            uiculture.DateTimeFormat.FirstDayOfWeek = DayOfWeek.Monday;

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = uiculture;


            var date = DateTime.Now;
            var range = GetWeekRange(date);
            var x = range.Start;
            var y = range.End;

            var datex = new Week(date).FirstDayOfWeek;
            var datey = new Week(date).LastDayOfWeek;
            //var z = weeksss.
            var ggg = 18;
            var hhh = 7;
            var kkk = ggg/hhh;

            var iwiqs = ((datey - datex).Days / 7) + 1;
            var wiqs = new Weeks(datex, iwiqs).GetWeeks();
            
            ResetWorkingPeriod();
            var periodSelectType = PeriodSelectType.Current;
            int offset = 0;

            var currentWeek = new Week(_workingPeriodStartDate);

            SetWorkingPeriod(currentWeek.AddWeeks(0));
            SetWorkingPeriod(currentWeek.AddWeeks(-1));
            SetWorkingPeriod(currentWeek.AddWeeks(1));

            var month = new Month();
            var firstWeekOfMonth = new Week(month.FirstDayStart);

            var weeks = new Weeks(firstWeekOfMonth.FirstDayStart, 5).GetWeeks().ToList();
            weeks.ForEach(week =>
                              {
                                  if (!week.OverlapsWith(month))
                                      weeks.Remove(week);
                              });

           
            //.Select(n => n. ).Where(n => n.GetRelation( ));
        }

        private void ResetWorkingPeriod()
        {
            CalendarTimeRange currentTimeRange = new Week();
            _workingPeriodStartDate = currentTimeRange.FirstDayStart;
            _workingPeriodEndDate = currentTimeRange.LastDayStart;
        }

        private void SetWorkingPeriod(ITimePeriod timeRange)
        {
            _workingPeriodStartDate = timeRange.Start;
            _workingPeriodEndDate = timeRange.End;

        }
    }
}
