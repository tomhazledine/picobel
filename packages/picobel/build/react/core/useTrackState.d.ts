export declare const useTrackState: ({ trackKey: providedTrackKey, name }: {
    trackKey?: string;
    name: string;
}) => {
    valid: false;
    trackKey?: undefined;
    context?: undefined;
    trackState?: undefined;
} | {
    valid: true;
    trackKey: any;
    context: any;
    trackState: any;
};
