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
var LayoutProvider_1 = require("./LayoutProvider");
var MasonryLayoutManager_1 = require("../layoutmanager/MasonryLayoutManager");
var MasonryLayoutProvider = /** @class */ (function (_super) {
    __extends(MasonryLayoutProvider, _super);
    function MasonryLayoutProvider(numOfColumn, getTypeCallback, setDimensionCallback) {
        var _this = _super.call(this) || this;
        _this.numOfColumn = numOfColumn;
        _this.getTypeCallback = getTypeCallback;
        _this.setDimensionCallback = setDimensionCallback;
        return _this;
    }
    MasonryLayoutProvider.prototype.newLayoutManager = function (renderWindowSize, isHorizontal, cachedLayouts) {
        return new MasonryLayoutManager_1.MasonryLayoutManager(renderWindowSize, this.numOfColumn, this.getTypeCallback, this.setDimensionCallback, isHorizontal, cachedLayouts);
    };
    MasonryLayoutProvider.prototype.getLayoutTypeForIndex = function (index) {
        return this.getTypeCallback(index);
    };
    MasonryLayoutProvider.prototype.checkDimensionDiscrepancy = function (dimension, type, index) {
        var dimension1 = dimension;
        var tempDim = { height: 0, width: 0 };
        this.setDimensionCallback(type, tempDim, index);
        return (dimension1.height !== tempDim.height ||
            dimension1.width !== tempDim.width);
    };
    return MasonryLayoutProvider;
}(LayoutProvider_1.BaseLayoutProvider));
exports.MasonryLayoutProvider = MasonryLayoutProvider;
//# sourceMappingURL=MasonryLayoutProvider.js.map