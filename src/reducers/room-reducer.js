
const initalState = {
  data:{},
}

const roomReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'UPDATE_ROOM':
      const { you, data } = action.payload;
      return {...state, you, data };
    default:
      return state;
  }
};
export default roomReducer;
