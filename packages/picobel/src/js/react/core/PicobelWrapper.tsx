import Picobel, { type PicobelProps } from "./Picobel";
import { PicobelProvider, usePicobel } from "./provider";

const PicobelWrapper = (props: PicobelProps) => {
    const picobelContext = usePicobel();

    if (!picobelContext) {
        return (
            <PicobelProvider theme={props.theme}>
                <Picobel {...props} />
            </PicobelProvider>
        );
    }

    return <Picobel {...props} />;
};

export default PicobelWrapper;
