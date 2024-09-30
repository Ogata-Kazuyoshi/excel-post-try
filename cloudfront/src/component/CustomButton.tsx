import {MouseEventHandler, ReactNode} from "react";

type Props = {
    children: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export const CustomButton = (
    {
        children,
        onClick
    }:Props
) => {
    return <>
    <button onClick={onClick}>
        {children}
    </button>
    </>
}    