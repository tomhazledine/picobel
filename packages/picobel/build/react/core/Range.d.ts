import React from "react";
type RangeOptions = {
    namespace: string;
    min: number;
    max: number;
    className?: string;
    value: number;
    step?: number | boolean;
    trackKey?: string;
    label?: string | HTMLElement;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
};
export declare const Range: ({ onChange, namespace, className, trackKey, min, max, value, step, label, children }: RangeOptions) => any;
export {};
