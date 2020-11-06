
const initalState = {
  you: undefined,
  data: {},
}

const roomReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'UPDATE_ROOM':
      const { you, data } = action.payload;
      return {
        you: you || state.you,
        data: data || state.data
      };
    default:
      return state;
  }
};
export default roomReducer;
