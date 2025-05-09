import React from "react";
export interface PicobelProps {
    src: string;
    id?: string;
    className?: string;
    theme?: string;
    children?: React.ReactNode;
    title?: string;
    artist?: string;
}
export declare const Picobel: React.FC<PicobelProps>;
export default Picobel;
