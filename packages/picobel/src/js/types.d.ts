export type Component = string;

export type ComponentGroup = Component | ComponentGroup[];

export type Options = {
    context?: Document | HTMLElement;
    theme?: string;
    preload?: boolean;
    components?: ComponentGroup[];
};
