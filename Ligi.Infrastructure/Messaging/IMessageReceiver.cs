using System;

namespace Ligi.Infrastructure.Messaging
{
    public interface IMessageReceiver
    {
        event EventHandler<MessageReceivedEventArgs> MessageReceived;
        void Start();
        void Stop();
    }
}
