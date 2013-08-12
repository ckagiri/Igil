﻿using System.Collections.Generic;

namespace Ligi.Infrastructure.Messaging
{
    public interface IMessageSender
    {
        void Send(Message message);
        void Send(IEnumerable<Message> messages);
    }
}
