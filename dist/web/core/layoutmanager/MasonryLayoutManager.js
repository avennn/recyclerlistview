"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LayoutManager_1 = require("./LayoutManager");
var MasonryLayoutManager = /** @class */ (function (_super) {
    __extends(MasonryLayoutManager, _super);
    function MasonryLayoutManager(windowSize, numOfColumn, getTypeCallback, setDimensionCallback, _isHorizontal, // NOTE: horizontal orientation currently unsupported
    cachedLayouts) {
        if (_isHorizontal === void 0) { _isHorizontal = false; }
        var _this = _super.call(this) || this;
        _this.numOfColumn = numOfColumn;
        _this.getTypeCallback = getTypeCallback;
        _this.setDimensionCallback = setDimensionCallback;
        _this.totalHeight = 0;
        _this.totalWidth = 0;
        _this.xStartArray = new Array(numOfColumn);
        for (var i = 0; i < numOfColumn; i++) {
            _this.xStartArray[i] = (i / numOfColumn) * windowSize.width;
        }
        // starts empty or from cache
        _this.layouts = cachedLayouts ? cachedLayouts : [];
        return _this;
    }
    MasonryLayoutManager.prototype.getContentDimension = function () {
        return { height: this.totalHeight, width: this.totalWidth };
    };
    MasonryLayoutManager.prototype.getLayouts = function () {
        return this.layouts;
    };
    MasonryLayoutManager.prototype.overrideLayout = function (index, dim) {
        var layout = this.layouts[index];
        if (layout) {
            layout.isOverridden = true;
            layout.width = dim.width;
            layout.height = dim.height;
        }
        return true;
    };
    // NOTE: This method could be called multiple times.
    MasonryLayoutManager.prototype.relayoutFromIndex = function (startIndex, itemCount) {
        var lowestColumnIdx = 0;
        var startVal = this.layouts[startIndex];
        if (startVal) {
            this.totalHeight = startVal.y;
            lowestColumnIdx = startVal.columnIdx
                ? startVal.columnIdx
                : this.getColumnOf(startVal);
        }
        var lowestColumnArray = this.getPrevLowestColumns(startIndex);
        var oldItemCount = this.layouts.length;
        var itemDim = { height: 0, width: 0 };
        var itemRect;
        var oldLayout;
        var itemY;
        for (var i = startIndex; i < itemCount; i++) {
            oldLayout = this.layouts[i];
            var layoutType = this.getTypeCallback(i);
            if (oldLayout &&
                oldLayout.isOverridden &&
                oldLayout.type === layoutType) {
                itemDim.height = oldLayout.height;
                itemDim.width = oldLayout.width;
            }
            else {
                this.setDimensionCallback(layoutType, itemDim, i);
            }
            itemY = lowestColumnArray[lowestColumnIdx];
            if (i > oldItemCount - 1) {
                this.layouts.push({
                    type: layoutType,
                    x: this.xStartArray[lowestColumnIdx],
                    y: itemY,
                    width: itemDim.width,
                    height: itemDim.height,
                    columnIdx: lowestColumnIdx,
                });
            }
            else {
                // NOTE: This relayout-modify phase is only executed if:
                // - forceNonDeterministicRendering=true. or,
                // - forceNonDeterministicRendering=false, but checkDimensionDiscrepancy() return true.
                itemRect = this.layouts[i];
                itemRect.type = layoutType;
                itemRect.x = this.xStartArray[lowestColumnIdx];
                itemRect.y = itemY;
                itemRect.width = itemDim.width;
                itemRect.height = itemDim.height;
                itemRect.columnIdx = lowestColumnIdx;
            }
            // now that this column has been filled, update its height
            lowestColumnArray[lowestColumnIdx] = itemY + itemDim.height;
            // and find another lowest column
            lowestColumnIdx = this.findIndexOfLowestValue(lowestColumnArray);
            this.totalHeight = this.findHighestValue(lowestColumnArray);
        }
    };
    MasonryLayoutManager.prototype.getColumnOf = function (layout) {
        var xpos = this.xStartArray;
        for (var i = xpos.length - 1; i >= 0; i--) {
            if (layout.x >= xpos[i]) {
                return i;
            }
        }
        return -1;
    };
    /**
     * For each column, get position of layout item that lowest than current index.
     *
     * TODO: This uses exhaustive search. Use more efficient structure & algorithm later.
     */
    MasonryLayoutManager.prototype.getPrevLowestColumns = function (curIdx) {
        var lowestColumnArray = new Array(this.numOfColumn).fill(Number.MAX_SAFE_INTEGER);
        var curLayout = this.layouts[curIdx];
        if (!curLayout) {
            return lowestColumnArray.fill(0);
        }
        // for each column
        for (var columnIdx = 0; columnIdx < this.xStartArray.length; columnIdx++) {
            // if current layout is on this column
            if (columnIdx === curLayout.columnIdx) {
                // special, previous is y, not y+height
                lowestColumnArray[columnIdx] = curLayout.y;
                // search other column
                continue;
            }
            // for all previous layouts
            for (var layoutIdx = curIdx - 1; layoutIdx >= 0; layoutIdx--) {
                var prevlayout = this.layouts[layoutIdx];
                if (prevlayout.columnIdx === columnIdx) {
                    lowestColumnArray[columnIdx] =
                        prevlayout.y + prevlayout.height;
                    // current column stop on this layout
                    break;
                }
            }
            // if no previous layouts found in this column
            if (lowestColumnArray[columnIdx] === Number.MAX_SAFE_INTEGER) {
                lowestColumnArray[columnIdx] = 0;
            }
        }
        return lowestColumnArray;
    };
    // TODO: This uses brute force search. Use efficient sort & search algorithm later.
    MasonryLayoutManager.prototype.findIndexOfLowestValue = function (array) {
        var lowest = Number.MAX_SAFE_INTEGER;
        var lowestIdx = -1;
        for (var i = 0; i < array.length; i++) {
            var n = array[i];
            if (n < lowest) {
                lowest = n;
                lowestIdx = i;
            }
        }
        return lowestIdx;
    };
    // TODO: This uses brute force search. Use efficient sort & search algorithm later.
    MasonryLayoutManager.prototype.findHighestValue = function (array) {
        var highest = 0;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var n = array_1[_i];
            if (n === Number.MAX_SAFE_INTEGER) {
                continue;
            }
            if (n > highest) {
                highest = n;
            }
        }
        return highest;
    };
    return MasonryLayoutManager;
}(LayoutManager_1.LayoutManager));
exports.MasonryLayoutManager = MasonryLayoutManager;
//# sourceMappingURL=MasonryLayoutManager.js.map