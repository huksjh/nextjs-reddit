import { createContext, useContext, useReducer } from "react";
import { User } from "../types";

interface State {
    authenticated: boolean; // 사용자 인증 true, false
    user: User | undefined; // user 사용자 정보, User <- src/types.tsx 에서 불러옴
    loading: boolean; // 로딩 표시 true, false
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
        default:
            throw new Error(`Unknown action type: ${type}`);
            break;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // reducer 별도 함수로 빼서 로그인 관련  switch 처리
    const [state, defaultDispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true,
    });
    // console.log(state);
    const dispatch = (type: string, payload: any) => {
        defaultDispatch({ type, payload });
    };
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    );
};

// 다른 컴포넌트에서 쉽게 StateContext value와  DispatchContext value 를 사용할수있게 export 해주기
export const useAuthState = () => useContext(StateContext);
export const useAuthDispath = () => useContext(DispatchContext);
