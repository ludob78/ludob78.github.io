const initialState={

}
const reducer=(state=initialState,action)=>{
    if(action.type==="ToggleActivate"){
        return {
            ...state,
            
        }
    }
    return state;
}
export default reducer