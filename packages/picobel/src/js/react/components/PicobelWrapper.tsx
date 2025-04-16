import { PicobelProvider, usePicobel } from "../core/provider";

import Picobel, { type PicobelProps } from "./Picobel";

const PicobelWrapper = (props: PicobelProps) => {
    const picobelContext = usePicobel();

    if (!picobelContext) {
        return (
            <PicobelProvider>
                <Picobel {...props} />
            </PicobelProvider>
        );
    }

    return <Picobel {...props} />;
};

export default PicobelWrapper;
