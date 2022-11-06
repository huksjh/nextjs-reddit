import React from "react";
import cls from "classnames";

interface InputGroupProps {
    className?: string;
    type?: string;
    value?: string;
    placeholder?: string;
    error: string | undefined;
    setValue: (str: string) => void;
}
const InputGroup: React.FC<InputGroupProps> = ({ className = "mb-2", type = "text", placeholder = "", value, error, setValue }) => {
    return (
        <div className={className}>
            <input
                type={type}
                style={{ minWidth: 300 }}
                placeholder={placeholder}
                value={value}
                className={cls(`w-full p-3 translate duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white `, {
                    "border-red-500": error,
                })}
                onChange={(e) => setValue(e.target.value)}
            />
            <small className="font-medium text-red-600">{error}</small>
        </div>
    );
};

export default InputGroup;
