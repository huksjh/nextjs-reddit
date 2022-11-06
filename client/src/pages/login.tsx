import Link from "next/link";
import React, { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const handleSubmit = (event: FormEvent) => {
        event?.preventDefault();
    };
    return (
        <div className="bg-white">
            <div className="flex flex-col items-center justify-center h-screen p-6">
                <div className="w-10/12 mx-auto md:w-96">
                    <h1 className="mb-2 text-lg font-bold">로그인</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup type="text" placeholder="Email" value={email} setValue={setEmail} error={errors.email} />
                        <InputGroup type="password" placeholder="Password" value={password} setValue={setPassword} error={errors.password} />
                        <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded ">
                            로그인
                        </button>
                    </form>
                    <small className="font-bold">
                        아직 회원이 이닌가요?
                        <Link href="/register">
                            <a className="ml-1 text-blue-500 uppercase">회원가입</a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;