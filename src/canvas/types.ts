type SupportedImageType = "png" | "jpeg" | "webp";

type ResizeOption = {
    dimension: "width" | "height";
    size: number;
};

type ImageOptions = {
	type?: SupportedImageType;
	quality?: number;
	resize?: ResizeOption
};

export type { SupportedImageType, ImageOptions, ResizeOption };
