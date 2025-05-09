import React, { useState, useEffect } from "react";
import classnames from "classnames";

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
};

const calculatePercentageComplete = (
    value: number,
    min: number,
    max: number
) => {
    return ((value - min) / (max - min)) * 100;
};

export const Range = ({
    onChange,
    namespace,
    className,
    trackKey,
    min = 0,
    max = 100,
    value = 50,
    step,
    label
}: RangeOptions) => {
    const rangeId = `${namespace}-slider__range--${trackKey}`;

    const [percentageComplete, setPercentageComplete] = useState(
        calculatePercentageComplete(value, min, max)
    );
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        setPercentageComplete(calculatePercentageComplete(value, min, max));
    }, [value, min, max]);

    const handleFocus = () => setFocus(true);

    const handleBlur = () => setFocus(false);

    return (
        <div className={classnames(namespace, className)}>
            <label className={`${namespace}-label`} htmlFor={rangeId}>
                <span className={`${namespace}-label-inner`}>{label}</span>
            </label>
            <div
                className={classnames(`${namespace}-slider__wrapper`, {
                    ["focused"]: focus
                })}
            >
                <div className={`${namespace}-slider__replacement`}>
                    <div className={`${namespace}-slider__background`}></div>
                    <div
                        className={`${namespace}-slider__indicator`}
                        style={{ width: `${percentageComplete}%` }}
                    ></div>
                    <div
                        className={`${namespace}-slider__playhead`}
                        style={{ left: `${percentageComplete}%` }}
                    ></div>
                </div>
                <input
                    className={`${namespace}-slider__range`}
                    id={rangeId}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={onChange}
                    {...(step && { step })}
                />
            </div>
        </div>
    );
};
