using System;

namespace Ligi.MessageProcessor
{
    class Program
    {
        static void Main(string[] args)
        {
            // Cleanup default EF DB initializers.
            DatabaseSetup.Initialize();

            using (var processor = new LigiProcessor(false))
            {
                processor.Start();

                Console.WriteLine("Host started");
                Console.WriteLine("Press enter to finish");
                Console.ReadLine();

                processor.Stop();
            }
        }
    }
}
