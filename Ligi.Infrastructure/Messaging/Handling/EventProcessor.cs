using Ligi.Core.Events;
using Ligi.Core.Messaging;
using Ligi.Infrastructure.Serialization;

namespace Ligi.Infrastructure.Messaging.Handling
{
    public class EventProcessor : MessageProcessor, IEventHandlerRegistry
    {
        private readonly EventDispatcher _messageDispatcher;

        public EventProcessor(IMessageReceiver receiver, ITextSerializer serializer)
            : base(receiver, serializer)
        {
            _messageDispatcher = new EventDispatcher();
        }

        public void Register(IEventHandler eventHandler)
        {
            _messageDispatcher.Register(eventHandler);
        }

        protected override void ProcessMessage(object payload, string correlationId)
        {
            var @event = (IEvent)payload;
            _messageDispatcher.DispatchMessage(@event, null, correlationId, "");
        }
    }
}
