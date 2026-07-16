import classnames from "classnames";
import React, { useState } from "react";

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

const calculatePercentageComplete = (
    value: number,
    min: number,
    max: number
) => {
    // Guard the empty range (e.g. duration still 0/NaN before the audio's
    // metadata loads): 0/0 is NaN, which would end up as `width: NaN%`.
    if (max - min === 0 || !Number.isFinite(max - min)) return 0;
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
    label,
    children
}: RangeOptions) => {
    const rangeId = `${namespace}-slider__range--${trackKey}`;

    // Derived from props — computed during render. Mirroring this into
    // state with a syncing effect (the old approach) costs an extra
    // render per update and can flash a stale value.
    const percentageComplete = calculatePercentageComplete(value, min, max);
    const [focus, setFocus] = useState(false);

    const handleFocus = () => setFocus(true);

    const handleBlur = () => setFocus(false);

    return (
        <div className={classnames(namespace, className)}>
            <label className={`${namespace}-label`} htmlFor={rangeId}>
                <span className={`${namespace}-label-inner`}>{label}</span>
            </label>
            <div
                className={classnames(`${namespace}-slider__wrapper`, {
                    ["focus"]: focus
                })}
            >
                <div
                    className={classnames(`${namespace}-slider__replacement`, {
                        ["focus"]: focus
                    })}
                >
                    <div className={`${namespace}-slider__background`}></div>
                    {children}
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
