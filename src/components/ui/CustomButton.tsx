import React from "react";

type ButtonProps = {
    title: string;
    onClick: () => void;
    icon?: React.ReactNode;
    loader?: boolean;
    style?: string; // tailwind or custom class
    disabled?: boolean;
};

const CustomButton: React.FC<ButtonProps> = ({
    title,
    onClick,
    icon,
    loader = false,
    style = "",
    disabled = false,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loader}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium 
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
                  hover:bg-blue-700 h-[40px] ${style}`}
        >
            {loader ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    <span>{title}</span>
                </>
            )}
        </button>
    );
};

export default CustomButton;
