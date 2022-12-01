import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http_get, http_post } from "../../components/helper/axios";

const state = {
  rooms: [],
};
const initialState = state;

export const getRooms = createAsyncThunk(
  "chat/get-rooms",
  async (data, { rejectWithValue }) => {
    try {
      return await http_get(`/get-rooms`, true);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const actionRoom = createAsyncThunk(
  "chat/action-room",
  async (data, { rejectWithValue }) => {
    try {
      return await http_post(`/action-room/${data.key}`, true, {
        roomId: data.roomId,
      });
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    UPDATEROOMS: (state, action) => {
      const list = state.rooms;
      const data = action.payload.data;
      let newMessage = list.filter((room) => room.id === data.id);
      if (newMessage.length !== 0) {
        if (action.payload.name === data.name) {
          newMessage[0] = {
            id: data.id,
            active: data.active,
            name: data.lastMessage.name,
            lastMessage: data.lastMessage,
            members: data.members,
            type: data.type,
          };
        } else {
          newMessage[0] = data;
        }
        let newRooms = list.map(
          (o) => newMessage.find((n) => n.id === o.id) || o
        );
        state.rooms = newRooms;
      } else {
        state.rooms.push(data);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.fulfilled, (state, action) => {
        state.rooms = action.payload.data;
      })
      .addCase(actionRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(
          (room) => room.id !== action.meta.arg.roomId
        );
      });
  },
});

export const { UPDATEROOMS } = chatSlice.actions;
export const selectRooms = (state) => state.chat.rooms;

export default chatSlice.reducer;
