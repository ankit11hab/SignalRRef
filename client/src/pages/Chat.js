import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';

const Chat = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get('name');
  const roomId = params.get('roomId');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState(null);

  const buildConnector = () => {
    const connection = new signalR.HubConnectionBuilder()
                                  .withUrl("http://localhost:5123/chat")
                                  .configureLogging(signalR.LogLevel.Information)
                                  // .withAutomaticReconnect()
                                  .build();
    setConnection(connection);
  }

  const startConnection = async () => {
    if(connection) {
      try {
          await connection.start();
          console.log("SignalR Connected");
      } catch (err) {
          console.log("Connection failed: ", err);
      }
    }
  }

  const joinRoom = async () => {
    if(name == null || roomId == null) {
      console.log("Name or RoomId is null");
      return;
    }
    if(connection && connection._connectionStarted) {
      try {
        await connection.invoke("JoinRoom", name, roomId);
        console.log("Room joined");
      } catch (err) {
          console.log("Joining failed: ", err);
      }
    }
  }

  const receiveMessage = () => {
    connection.on("ReceiveMessage", (sender, message) => {
      let msg = message;
      if (sender) {
          msg = sender + ": " + message;
      }
      setMessages((messages) => [...messages, msg ]);
    });
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if(newMessage && connection && connection._connectionStarted) {
      try {
        await connection.invoke("SendMessage", name, roomId, newMessage);
        setNewMessage("");
      } catch (err) {
        console.error('Message send failed: ', err);
      }
    }
  }

  useEffect(() => {
    buildConnector();
  }, []);

  useEffect(() => {
    async function initialize() {
      await startConnection();
      if(connection && connection._connectionStarted) {
        await joinRoom();
        await receiveMessage();
      }
    }
    initialize();
  }, [connection])

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      <div>
        {messages.map((msg, index)=>(
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chat;