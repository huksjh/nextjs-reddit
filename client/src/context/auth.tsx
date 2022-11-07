import { createContext, useContext, useReducer } from "react";
import { User } from "../types";

interface State {
    authenticated: boolean;
    user: User | undefined;
    loading: boolean;
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true,
});

const DispatchContext = createContext<any>(null);

interface Action {
    type: string;
    payload: any;
}

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case "LOGIN":
            return {
                ...state,
                authenticated: true,
                user: payload,
            };
            break;
        case "LOGOUT":
            return {
                ...state,
                authenticated: false,
                user: null,
            };
            break;
        case "STOP_LOADING":
            return {
                ...state,
                loading: false,
            };
            break;
        default:
            throw new Error(`Unknown action type: ${type}`);
            break;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        authenticated: false,
        user: null,
        loading: false,
    });
    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({ type, payload });
    };
    return;
    <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>;
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispath = () => useContext(DispatchContext);
