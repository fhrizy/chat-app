import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http_post, http_get } from "../../components/helper/axios";

const state = {
  contacts: [],
};
const initialState = state;

export const getContacts = createAsyncThunk(
  "contact/get-contacts",
  async (data, { rejectWithValue }) => {
    try {
      return await http_get(`/get-contacts`, true, data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const findUser = createAsyncThunk(
  "contact/find-user",
  async (data, { rejectWithValue }) => {
    try {
      return await http_get(`/find-user`, true, data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const addContact = createAsyncThunk(
  "contact/add-contact",
  async (data, { rejectWithValue }) => {
    try {
      return await http_post(`/add-contact`, true, data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    ADDCONTACT: (state, action) => {
      state.contacts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contacts = action.payload.data;
    });
  },
});

export const { ADDCONTACT } = contactSlice.actions;
export const selectContacts = (state) => state.contact.contacts;

export default contactSlice.reducer;
