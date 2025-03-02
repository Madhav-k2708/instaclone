import { createSlice } from "@reduxjs/toolkit";

const rtmSclie = createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotification:[],
    },
    reducers:{
        // actions
        setLikeNotification:(state,action) => {
            if (action.payload.type === 'like') {
                state.likeNotification.push(action.payload)                                 
            }else if (action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId)                          

            }
        },
    }
}); 
export const {setLikeNotification,} = rtmSclie.actions;
export default rtmSclie.reducer;