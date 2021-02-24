import { Dimension } from '../dependencies/LayoutProvider';
import { LayoutManager, Layout } from './LayoutManager';
export declare type GetTypeCallbackFn = (index: number) => string | number;
export declare type SetDimensionCallbackFn = (type: string | number, dim: Dimension, index: number) => void;
export declare class MasonryLayoutManager extends LayoutManager {
    private layouts;
    private numOfColumn;
    private getTypeCallback;
    private setDimensionCallback;
    private totalHeight;
    private totalWidth;
    private xStartArray;
    constructor(windowSize: Dimension, numOfColumn: number, getTypeCallback: GetTypeCallbackFn, setDimensionCallback: SetDimensionCallbackFn, _isHorizontal?: boolean, // NOTE: horizontal orientation currently unsupported
    cachedLayouts?: Layout[]);
    getContentDimension(): Dimension;
    getLayouts(): Layout[];
    overrideLayout(index: number, dim: Dimension): boolean;
    relayoutFromIndex(startIndex: number, itemCount: number): void;
    private getColumnOf;
    /**
     * For each column, get position of layout item that lowest than current index.
     *
     * TODO: This uses exhaustive search. Use more efficient structure & algorithm later.
     */
    private getPrevLowestColumns;
    private findIndexOfLowestValue;
    private findHighestValue;
}
