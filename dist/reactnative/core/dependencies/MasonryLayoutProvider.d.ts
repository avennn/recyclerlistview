import { BaseLayoutProvider, Dimension } from './LayoutProvider';
import { Layout, LayoutManager } from '../layoutmanager/LayoutManager';
import { GetTypeCallbackFn, SetDimensionCallbackFn } from '../layoutmanager/MasonryLayoutManager';
export declare class MasonryLayoutProvider extends BaseLayoutProvider {
    private numOfColumn;
    private getTypeCallback;
    private setDimensionCallback;
    constructor(numOfColumn: number, getTypeCallback: GetTypeCallbackFn, setDimensionCallback: SetDimensionCallbackFn);
    newLayoutManager(renderWindowSize: Dimension, isHorizontal?: boolean | undefined, cachedLayouts?: Layout[] | undefined): LayoutManager;
    getLayoutTypeForIndex(index: number): string | number;
    checkDimensionDiscrepancy(dimension: Dimension, type: string | number, index: number): boolean;
}
