import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import authReducer from "../reducers/auth";
import channelReducer from "../reducers/channels";
import postReducer from "../reducers/posts";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            channels: channelReducer,
            posts: postReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );

    return store;
}
