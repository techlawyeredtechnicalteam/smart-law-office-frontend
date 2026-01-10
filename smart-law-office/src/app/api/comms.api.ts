import api from "./api";

// Communications API
export const messagesApi = {
  // fetch all message threads
  getThreads: async () => api.get("/messages/threads"),

  // send a private message
  sendPrivateMessage: (data: { recipientId: string; content: string }) =>
    api.post("/messages/private", data),

  // post: send a message to a room or case
  sendRoomMessge: (data: { roomId: string; content: string }) =>
    api.post("/messages/room", data),

  // put: update
  updateMessage: (id: string, data: { content: string }) =>
    api.put(`/messages/${id}`, data),

  // delete
  deleteMessage: (id: string) => api.delete(`/messages/${id}`)
};
