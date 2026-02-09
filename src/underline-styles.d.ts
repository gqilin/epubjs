/**
 * TypeScript definitions for UnderlineStyleManager
 */

declare module "underline-styles" {
  interface UnderlineData {
    [key: string]: any;
    styleType?: string;
    customClass?: string;
    timestamp?: string;
  }

  interface StyleConfig {
    stroke?: string;
    "stroke-width"?: string;
    "stroke-opacity"?: string;
    "stroke-dasharray"?: string;
    "stroke-linecap"?: string;
    [key: string]: string | undefined;
  }

  interface UnderlineReference {
    cfiRange: string;
    styleType: string;
    className: string;
    styles: StyleConfig;
    data: UnderlineData;
    reference: any;
  }

  interface AddResult {
    cfiRange: string;
    styleType: string;
    className: string;
    reference: any;
  }

  interface BatchRangeItem {
    cfiRange: string;
    styleType?: string;
    data?: UnderlineData;
    callback?: (event: Event) => void;
    customStyles?: StyleConfig;
  }

  class UnderlineStyleManager {
    /**
     * Initialize the UnderlineStyleManager
     * @param rendition Epub.js Rendition instance
     */
    constructor(rendition: any);

    /**
     * Add an underline
     * @param cfiRange EpubCFI range
     * @param styleType Style type (solid, dashed, dotted, double, wavy, bold, thin)
     * @param data Associated data object
     * @param callback Click callback function
     * @param customStyles Custom style overrides
     */
    add(
      cfiRange: string,
      styleType?: string,
      data?: UnderlineData,
      callback?: ((event: Event) => void) | null,
      customStyles?: StyleConfig
    ): AddResult;

    /**
     * Remove an underline
     * @param cfiRange EpubCFI range
     * @param styleType Style type (optional)
     */
    remove(cfiRange: string, styleType?: string | null): void;

    /**
     * Update an underline style
     * @param cfiRange EpubCFI range
     * @param newStyleType New style type
     * @param customStyles Custom style overrides
     */
    update(
      cfiRange: string,
      newStyleType?: string,
      customStyles?: StyleConfig
    ): AddResult;

    /**
     * Get all underlines
     */
    getAll(): UnderlineReference[];

    /**
     * Get underlines by specific CFI range
     * @param cfiRange EpubCFI range
     */
    getByRange(cfiRange: string): UnderlineReference[];

    /**
     * Register a custom style preset
     * @param styleName Style name
     * @param styleConfig Style configuration
     */
    registerStyle(styleName: string, styleConfig: StyleConfig): void;

    /**
     * Add multiple underlines at once
     * @param ranges Array of range items
     */
    addBatch(ranges: BatchRangeItem[]): AddResult[];

    /**
     * Clear all underlines
     */
    clear(): void;

    /**
     * Get all available style names
     */
    getAvailableStyles(): string[];

    /**
     * Get configuration of specific style
     * @param styleName Style name
     */
    getStyleConfig(styleName: string): StyleConfig | null;
  }

  export default UnderlineStyleManager;
}

declare module "underline-styles-examples" {
  import UnderlineStyleManager from "underline-styles";

  interface AnnotationItem {
    text: string;
    note?: string;
    color?: string;
    style?: string;
    tags?: string[];
    timestamp?: string;
    [key: string]: any;
  }

  interface ExportedAnnotations {
    bookId: string;
    annotations: any[];
    exportDate: string;
  }

  class AdvancedAnnotationSystem {
    constructor(rendition: any);

    addAnnotation(cfiRange: string, annotationData: AnnotationItem): any;
    getAllAnnotations(): AnnotationItem[];
    removeAnnotation(cfiRange: string): void;
    updateAnnotationStyle(cfiRange: string, newStyle: string): void;
    showAnnotationDetail(annotation: AnnotationItem): void;
  }

  function basicExample(rendition: any): UnderlineStyleManager;
  function customStyleExample(rendition: any): UnderlineStyleManager;
  function batchOperationExample(rendition: any): UnderlineStyleManager;
  function integrateWithRendition(rendition: any): AdvancedAnnotationSystem;

  export {
    basicExample,
    AdvancedAnnotationSystem,
    customStyleExample,
    batchOperationExample,
    integrateWithRendition,
    UnderlineStyleManager
  };
}
