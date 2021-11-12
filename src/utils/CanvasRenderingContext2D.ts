export {};
declare global {
    interface CanvasRenderingContext2D {
        imageSmoothingEnabled: boolean; //standard
        mozImageSmoothingEnabled: boolean; //Firefox
        oImageSmoothingEnabled: boolean; //Opera
        webkitImageSmoothingEnabled: boolean; //Safari
        msImageSmoothingEnabled: boolean; //IE

        setImageSmoothing(value: boolean): void;

        disableImageSmoothing(): void;

        enableImageSmoothing(): void;
    }
}

CanvasRenderingContext2D.prototype.setImageSmoothing = function (value: boolean): void {
    this.imageSmoothingEnabled = value;
    this.mozImageSmoothingEnabled = value;
    this.oImageSmoothingEnabled = value;
    this.webkitImageSmoothingEnabled = value;
    this.msImageSmoothingEnabled = value;
};

/**
 * Disable smoothing feature of canvas context for use a clear dot image
 * @url https://github.com/niklasvh/html2canvas/issues/576#issuecomment-316739410
 */
CanvasRenderingContext2D.prototype.disableImageSmoothing = function (): void {
    this.setImageSmoothing(false);
};
CanvasRenderingContext2D.prototype.enableImageSmoothing = function (): void {
    this.setImageSmoothing(true);
};