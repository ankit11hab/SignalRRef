using Microsoft.AspNetCore.SignalR;

namespace Rps.Api;

public class ChatHub : Hub
{
    public async Task JoinGlobalChat(string name)
    {
        await Clients.All
            .SendAsync("ReceiveMessage", "admin", $"{name} has joined");
    }

    public async Task JoinRoom(string name, string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.OthersInGroup(roomId)
            .SendAsync("ReceiveMessage", "Admin", $"{name} has joined in {roomId}");
    }

    public async Task SendMessage(string name, string roomId, string message)
    {
        await Clients.Group(roomId)
            .SendAsync("ReceiveMessage", name, message);
    }
}
