import { useTrackState } from "../core/useTrackState";
import { Range } from "../core/Range";

export const Volume = ({
    trackKey: providedTrackKey,
    className
}: {
    trackKey?: string;
    className?: string;
}) => {
    const { valid, trackState, trackKey, context } = useTrackState({
        trackKey: providedTrackKey,
        name: "Volume"
    });

    if (!valid) return null;

    const handleDurationChange = e => {
        const volume = Number(e.target.value);
        if (isNaN(volume)) return;
        context.setVolume(trackKey, volume);
    };

    return (
        <Range
            label="Volume"
            className={className}
            onChange={handleDurationChange}
            namespace={`${trackState.namespace}__volume`}
            min={0}
            max={1}
            step={0.01}
            value={trackState.muted ? 0 : trackState.volume}
        />
    );
};

// export const volume = (namespace, key) => {
//     const volume_label_wrapper = createElement(
//         "span",
//         `${namespace}__volume-label-inner`
//     );
//     const volume_label = createElement(
//         "span",
//         `${namespace}__volume-label-key`
//     );
//     volume_label.innerHTML = "Volume ";
//     volume_label_wrapper.appendChild(volume_label);
//     const volume_value = createElement(
//         "span",
//         `${namespace}__volume-label-value`
//     );
//     volume_value.innerHTML = "10";
//     volume_label_wrapper.appendChild(volume_value);

//     const volume_slider = buildSlider({
//         namespace: `${namespace}__volume`,
//         min: 0,
//         max: 1,
//         value: 1,
//         step: 0.1,
//         index: key,
//         label: volume_label_wrapper
//     });
//     return volume_slider;
// };
