/**
 * TreeMap chart module.
 *
 * Parts of the functionality used in this module are taken from D3.js library
 * (https://d3js.org/)
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYChart, XYChartDataItem } from "./XYChart";
import { registry } from "../../core/Registry";
import { DictionaryTemplate, DictionaryDisposer } from "../../core/utils/Dictionary";
import { ValueAxis } from "../axes/ValueAxis";
import { TreeMapSeries } from "../series/TreeMapSeries";
import { ColorSet } from "../../core/utils/ColorSet";
import { MouseCursorStyle } from "../../core/interaction/Mouse";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[TreeMap]].
 *
 * @see {@link DataItem}
 */
var TreeMapDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(TreeMapDataItem, _super);
    /**
     * Constructor
     */
    function TreeMapDataItem() {
        var _this = _super.call(this) || this;
        /**
         * Required for squarify functionality.
         *
         * @ignore Exclude from docs
         * @type {TreeMapDataItem[]}
         */
        _this.rows = [];
        _this.className = "TreeMapDataItem";
        _this.values.value = {};
        _this.values.x0 = {};
        _this.values.y0 = {};
        _this.values.x1 = {};
        _this.values.y1 = {};
        _this.hasChildren.children = true;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(TreeMapDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            var value = this.values["value"].value;
            if (!$type.isNumber(value)) {
                value = 0;
                if (this.children) {
                    $iter.each(this.children.iterator(), function (child) {
                        if ($type.isNumber(child.value)) {
                            value += child.value;
                        }
                    });
                }
            }
            return value;
        },
        /**
         * Numeric value of the item.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("value", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "percent", {
        get: function () {
            if (this.parent) {
                return this.value / this.parent.value * 100;
            }
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "x0", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.values.x0.value;
        },
        /**
         * Item's X position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  X
         */
        set: function (value) {
            this.setValue("x0", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "x1", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.values.x1.value;
        },
        /**
         * Item's X position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  X
         */
        set: function (value) {
            this.setValue("x1", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "y0", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.values.y0.value;
        },
        /**
         * Item's Y position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  Y
         */
        set: function (value) {
            this.setValue("y0", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "y1", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.values.y1.value;
        },
        /**
         * Item's Y position.
         *
         * @ignore Exclude from docs
         * @todo Description (review)
         * @param {number}  value  Y
         */
        set: function (value) {
            this.setValue("y1", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "name", {
        /**
         * @return {string} Name
         */
        get: function () {
            return this.properties.name;
        },
        /**
         * Item's name.
         *
         * @param {string}  name  Name
         */
        set: function (name) {
            this.setProperty("name", name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "children", {
        /**
         * @return {OrderedListTemplate<TreeMapDataItem>} Item's children
         */
        get: function () {
            return this.properties.children;
        },
        /**
         * A list of item's sub-children.
         *
         * Having children means that the TreeMap chat will automatically be
         * "drillable". Clicking on an item with children will zoom to the item, then
         * display its children.
         *
         * Treemap can have any level of nesting.
         *
         * @param {OrderedListTemplate<TreeMapDataItem>}  children  Item's children
         */
        set: function (children) {
            this.setProperty("children", children);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "level", {
        /**
         * Depth level in the treemap hierarchy.
         *
         * The top-level item will have level set at 0. Its children will have
         * level 1, and so on.
         *
         * @readonly
         * @return {number} Level
         */
        get: function () {
            if (!this.parent) {
                return 0;
            }
            else {
                return this.parent.level + 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "color", {
        /**
         * @return {Color} Color
         */
        get: function () {
            var color = this.properties.color;
            if (color == undefined) {
                if (this.parent) {
                    color = this.parent.color;
                }
            }
            if (color == undefined) {
                if (this.component) {
                    color = this.component.colors.getIndex(this.component.colors.step * this.index);
                }
            }
            return color;
        },
        /**
         * Item's color.
         *
         * If not set, will use parent's color, or, if that is not set either,
         * automatically assigned color from chart's color set. (`chart.colors`)
         *
         * @param {Color}  value  Color
         */
        set: function (value) {
            this.setProperty("color", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMapDataItem.prototype, "series", {
        get: function () {
            return this._series;
        },
        /**
         * series of data item
         * @todo: proper descrition
         */
        set: function (series) {
            if (this._series) {
                this.component.series.removeValue(this._series);
                this._series.dispose();
            }
            this._series = series;
            this._disposers.push(series);
        },
        enumerable: true,
        configurable: true
    });
    return TreeMapDataItem;
}(XYChartDataItem));
export { TreeMapDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a TreeMap chart.
 *
 * @see {@link ITreeMapEvents} for a list of available Events
 * @see {@link ITreeMapAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/treemap/} for documentation
 */
var TreeMap = /** @class */ (function (_super) {
    tslib_1.__extends(TreeMap, _super);
    /**
     * Constructor
     */
    function TreeMap() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * An algorithm used to divide area into squares based on their value.
         *
         * Available options: squarify (default), binaryTree, slice, dice, sliceDice.
         *
         * ```TypeScript
         * chart.layoutAlgorithm = chart.sliceDice;
         * ```
         * ```JavaScript
         * chart.layoutAlgorithm = chart.sliceDice;
         * ```
         * ```JSON
         * {
         *   // ...
         *   "layoutAlgorithm": "sliceDice",
         *   // ...
         * }
         * ```
         *
         * @see {@link https://www.amcharts.com/docs/v4/chart-types/treemap/#Area_division_methods} For more info and examples.
         * @default squarify
         * @type {function}
         */
        _this.layoutAlgorithm = _this.squarify;
        /**
         * Is the chart zoomable?
         *
         * If the chart is `zoomable`, and items have sub-items, the chart will
         * drill-down to sub-items when click on their parent item.
         *
         * @default true
         * @type {boolean}
         */
        _this.zoomable = true;
        _this.className = "TreeMap";
        _this.maxLevels = 2;
        _this.currentLevel = 0;
        _this.colors = new ColorSet();
        _this.sorting = "descending";
        // create two value axes for the chart
        var xAxis = _this.xAxes.push(new ValueAxis());
        xAxis.title.disabled = true;
        xAxis.strictMinMax = true;
        var xRenderer = xAxis.renderer;
        xRenderer.inside = true;
        xRenderer.labels.template.disabled = true;
        xRenderer.ticks.template.disabled = true;
        xRenderer.grid.template.disabled = true;
        xRenderer.axisFills.template.disabled = true;
        xRenderer.minGridDistance = 100;
        xRenderer.line.disabled = true;
        xRenderer.baseGrid.disabled = true;
        //xRenderer.inversed = true;
        var yAxis = _this.yAxes.push(new ValueAxis());
        yAxis.title.disabled = true;
        yAxis.strictMinMax = true;
        var yRenderer = yAxis.renderer;
        yRenderer.inside = true;
        yRenderer.labels.template.disabled = true;
        yRenderer.ticks.template.disabled = true;
        yRenderer.grid.template.disabled = true;
        yRenderer.axisFills.template.disabled = true;
        yRenderer.minGridDistance = 100;
        yRenderer.line.disabled = true;
        yRenderer.baseGrid.disabled = true;
        yRenderer.inversed = true;
        // shortcuts
        _this.xAxis = xAxis;
        _this.yAxis = yAxis;
        var template = new TreeMapSeries();
        _this.seriesTemplates = new DictionaryTemplate(template);
        _this._disposers.push(new DictionaryDisposer(_this.seriesTemplates));
        _this._disposers.push(template);
        _this.zoomOutButton.events.on("hit", function () {
            _this.zoomToChartDataItem(_this._homeDataItem);
        }, undefined, false);
        _this.seriesTemplates.events.on("insertKey", function (event) {
            event.newValue.isTemplate = true;
        }, undefined, false);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(TreeMap.prototype, "navigationBar", {
        /**
         * Returns navigationBar if it is added to a chart
         */
        get: function () {
            return this._navigationBar;
        },
        /**
         * A navigation bar used to show "breadcrumb" control, indicating current
         * drill-down path.
         *
         * @type {NavigationBar}
         */
        set: function (navigationBar) {
            var _this = this;
            if (this._navigationBar != navigationBar) {
                this._navigationBar = navigationBar;
                navigationBar.parent = this;
                navigationBar.toBack();
                navigationBar.links.template.events.on("hit", function (event) {
                    var dataItem = event.target.dataItem.dataContext;
                    _this.zoomToChartDataItem(dataItem);
                    _this.createTreeSeries(dataItem);
                }, undefined, true);
                this._disposers.push(navigationBar);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates chart's data.
     *
     * @ignore Exclude from docs
     */
    TreeMap.prototype.validateData = function () {
        this.series.clear();
        _super.prototype.validateData.call(this);
        if (this._homeDataItem) {
            this._homeDataItem.dispose();
        }
        var homeDataItem = this.dataItems.template.clone(); // cant' use createDataItem here!
        this._homeDataItem = homeDataItem;
        $iter.each(this.dataItems.iterator(), function (dataItem) {
            dataItem.parent = homeDataItem;
        });
        homeDataItem.children = this.dataItems;
        homeDataItem.x0 = 0;
        homeDataItem.y0 = 0;
        homeDataItem.name = this._homeText;
        var maxX = 1000;
        var maxY = (maxX * this.pixelHeight / this.pixelWidth) || 1000;
        homeDataItem.x1 = maxX;
        homeDataItem.y1 = maxY;
        this.xAxis.min = 0;
        this.xAxis.max = maxX;
        this.yAxis.min = 0;
        this.yAxis.max = maxY;
        this.layoutItems(homeDataItem);
        this.createTreeSeries(homeDataItem);
    };
    /**
     * Layouts and sizes all items according to their value and
     * `layoutAlgorithm`.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Parent data item
     */
    TreeMap.prototype.layoutItems = function (parent, sorting) {
        if (parent) {
            var children = parent.children;
            if (!sorting) {
                sorting = this.sorting;
            }
            if (sorting == "ascending") {
                children.values.sort(function (a, b) {
                    return a.value - b.value;
                });
            }
            if (sorting == "descending") {
                children.values.sort(function (a, b) {
                    return b.value - a.value;
                });
            }
            this.layoutAlgorithm(parent);
            for (var i = 0, len = children.length; i < len; i++) {
                var node = children.getIndex(i);
                if (node.children) {
                    this.layoutItems(node);
                }
            }
        }
    };
    /**
     * Creates and returns a new treemap series.
     *
     * @todo Description
     * @param {TreeMapDataItem}  dataItem  Data item to create series out of
     */
    TreeMap.prototype.createTreeSeries = function (dataItem) {
        var _this = this;
        this._tempSeries = [];
        var navigationData = [dataItem];
        // create parent series and navigation data
        var parentDataItem = dataItem.parent;
        while (parentDataItem != undefined) {
            this.initSeries(parentDataItem);
            navigationData.push(parentDataItem);
            parentDataItem = parentDataItem.parent;
        }
        navigationData.reverse();
        if (this.navigationBar) {
            this.navigationBar.data = navigationData;
        }
        // create series and children series
        this.createTreeSeriesReal(dataItem);
        // add those which are not in the list
        $array.each(this._tempSeries, function (series) {
            if (_this.series.indexOf(series) == -1) {
                _this.series.push(series);
            }
            series.zIndex = series.level;
        });
    };
    /**
     * [createTreeSeriesReal description]
     *
     * @todo Description
     * @param {TreeMapDataItem} dataItem [description]
     */
    TreeMap.prototype.createTreeSeriesReal = function (dataItem) {
        if (dataItem.children) {
            var level = dataItem.level;
            if (level < this.currentLevel + this.maxLevels) {
                this.initSeries(dataItem);
                for (var i = 0; i < dataItem.children.length; i++) {
                    var child = dataItem.children.getIndex(i);
                    if (child.children) {
                        this.createTreeSeriesReal(child);
                    }
                }
            }
        }
    };
    /**
     * @ignore
     * Overriding, as tree map series are created on the fly all the time
     */
    TreeMap.prototype.seriesAppeared = function () {
        return true;
    };
    /**
     * Initializes the treemap series.
     *
     * @todo Description
     * @param {TreeMapDataItem}  dataItem  Chart data item
     */
    TreeMap.prototype.initSeries = function (dataItem) {
        var _this = this;
        if (!dataItem.series) {
            var series = void 0;
            var template = this.seriesTemplates.getKey(dataItem.level.toString());
            if (template) {
                series = template.clone();
            }
            else {
                series = this.series.create();
            }
            series.name = dataItem.name;
            series.parentDataItem = dataItem;
            dataItem.series = series;
            var level = dataItem.level;
            series.level = level;
            var dataContext = dataItem.dataContext;
            if (dataContext) {
                series.config = dataContext.config;
            }
            this.dataUsers.removeValue(series); // series do not use data directly, that's why we remove it
            series.data = dataItem.children.values;
            series.fill = dataItem.color;
            series.columnsContainer.hide(0);
            series.bulletsContainer.hide(0);
            series.columns.template.adapter.add("fill", function (fill, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var treeMapDataItem = dataItem.treeMapDataItem;
                    if (treeMapDataItem) {
                        target.fill = treeMapDataItem.color;
                        target.adapter.remove("fill"); //@todo: make it possible adapters applied once?
                        return treeMapDataItem.color;
                    }
                }
            });
            if (this.zoomable && (dataItem.level > this.currentLevel || (dataItem.children && dataItem.children.length > 0))) {
                series.columns.template.cursorOverStyle = MouseCursorStyle.pointer;
                if (this.zoomable) {
                    series.columns.template.events.on("hit", function (event) {
                        var seriesDataItem = event.target.dataItem;
                        if (dataItem.level > _this.currentLevel) {
                            _this.zoomToChartDataItem(seriesDataItem.treeMapDataItem.parent);
                        }
                        else {
                            _this.zoomToSeriesDataItem(seriesDataItem);
                        }
                    }, this, undefined);
                }
            }
        }
        this._tempSeries.push(dataItem.series);
    };
    /**
     * Toggles bullets so that labels that belong to current drill level are
     * shown.
     *
     * @param {number}  duration  Animation duration (ms)
     */
    TreeMap.prototype.toggleBullets = function (duration) {
        var _this = this;
        // hide all series which are not in tempSeries
        $iter.each(this.series.iterator(), function (series) {
            if (_this._tempSeries.indexOf(series) == -1) {
                //series.hideReal(duration);
                series.columnsContainer.hide();
                series.bulletsContainer.hide(duration);
            }
            else {
                //series.showReal(duration);
                series.columnsContainer.show();
                series.bulletsContainer.show(duration);
                if (series.level < _this.currentLevel) {
                    series.bulletsContainer.hide(duration);
                }
            }
        });
    };
    /**
     * Zooms to particular item in series.
     *
     * @param {TreeMapSeriesDataItem}  dataItem  Data item
     */
    TreeMap.prototype.zoomToSeriesDataItem = function (dataItem) {
        this.zoomToChartDataItem(dataItem.treeMapDataItem);
    };
    /**
     * Zooms to particular item.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  dataItem  Data item
     */
    TreeMap.prototype.zoomToChartDataItem = function (dataItem) {
        var _this = this;
        if (dataItem && dataItem.children) {
            this.xAxis.zoomToValues(dataItem.x0, dataItem.x1);
            this.yAxis.zoomToValues(dataItem.y0, dataItem.y1);
            this.currentLevel = dataItem.level;
            this.currentlyZoomed = dataItem;
            this.createTreeSeries(dataItem);
            var rangeChangeAnimation = this.xAxis.rangeChangeAnimation || this.yAxis.rangeChangeAnimation;
            if (rangeChangeAnimation && !rangeChangeAnimation.isFinished()) {
                this._dataDisposers.push(rangeChangeAnimation);
                rangeChangeAnimation.events.once("animationended", function () {
                    _this.toggleBullets();
                });
            }
            else {
                this.toggleBullets();
            }
        }
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    TreeMap.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("TreeMap chart");
        }
        //this.homeText = this.language.translate("Home");
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {XYSeriesDataItem} Data Item
     */
    TreeMap.prototype.createDataItem = function () {
        return new TreeMapDataItem();
    };
    Object.defineProperty(TreeMap.prototype, "maxLevels", {
        /**
         * @return {number} Maximum drill-down level
         */
        get: function () {
            return this.getPropertyValue("maxLevels");
        },
        /**
         * Maximum drill-down levels the chart will allow going to.
         *
         * If set, the chart will not drill-down further, even if there are sub-items
         * available.
         *
         * Set to `1` to disable drill down functionality.
         *
         * @param {number}  value  Maximum drill-down level
         */
        set: function (value) {
            this.setPropertyValue("maxLevels", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMap.prototype, "currentLevel", {
        /**
         * @return {number} Current level
         */
        get: function () {
            return this.getPropertyValue("currentLevel");
        },
        /**
         * Current drill-down level the chart is at.
         *
         * @param {number}  value  Current level
         */
        set: function (value) {
            this.setPropertyValue("currentLevel", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeMap.prototype, "sorting", {
        get: function () {
            return this.getPropertyValue("sorting");
        },
        /**
         * Sorting direction of treemap items.
         *
         * Available options: "none", "ascending", and "descending" (default).
         *
         * @default "descending"
         * @param {"none" | "ascending" | "descending"} value [description]
         */
        set: function (value) {
            this.setPropertyValue("sorting", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a new series of the suitable type.
     *
     * @return {this} new series
     */
    TreeMap.prototype.createSeries = function () {
        return new TreeMapSeries();
    };
    Object.defineProperty(TreeMap.prototype, "homeText", {
        /**
         * @return {string} Home text
         */
        get: function () {
            return this._homeText;
        },
        /**
         * A text displayed on the "home" button which is used to go back to level 0
         * after drill into sub-items.
         *
         * @param {string}  value  Home text
         */
        set: function (value) {
            this._homeText = value;
            if (this._homeDataItem) {
                this._homeDataItem.name = this._homeText;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    TreeMap.prototype.processConfig = function (config) {
        if (config) {
            // Instantiate layout algorithm
            if ($type.hasValue(config["layoutAlgorithm"]) && $type.isString(config["layoutAlgorithm"])) {
                switch (config["layoutAlgorithm"]) {
                    case "squarify":
                        config["layoutAlgorithm"] = this.squarify;
                        break;
                    case "binaryTree":
                        config["layoutAlgorithm"] = this.binaryTree;
                        break;
                    case "slice":
                        config["layoutAlgorithm"] = this.slice;
                        break;
                    case "dice":
                        config["layoutAlgorithm"] = this.dice;
                        break;
                    case "sliceDice":
                        config["layoutAlgorithm"] = this.sliceDice;
                        break;
                    default:
                        delete config["layoutAlgorithm"];
                        break;
                }
            }
            // Set type for navigation bar
            if ($type.hasValue(config.navigationBar) && !$type.hasValue(config.navigationBar.type)) {
                config.navigationBar.type = "NavigationBar";
            }
            _super.prototype.processConfig.call(this, config);
        }
    };
    /**
     * Measures the size of container and informs its children of how much size
     * they can occupy, by setting their relative `maxWidth` and `maxHeight`
     * properties.
     *
     * @ignore Exclude from docs
     */
    TreeMap.prototype.validateLayout = function () {
        _super.prototype.validateLayout.call(this);
        this.layoutItems(this.currentlyZoomed);
    };
    /**
     * Validates (processes) data items.
     *
     * @ignore Exclude from docs
     */
    TreeMap.prototype.validateDataItems = function () {
        _super.prototype.validateDataItems.call(this);
        this.layoutItems(this._homeDataItem);
        $iter.each(this.series.iterator(), function (series) {
            series.validateRawData();
        });
        this.zoomToChartDataItem(this._homeDataItem);
    };
    /**
     * ==========================================================================
     * TREEMAP LAYOUT FUNCTIONS
     * ==========================================================================
     * @hidden
     */
    /**
     * The functions below are from D3.js library (https://d3js.org/)
     *
     * --------------------------------------------------------------------------
     * Copyright 2017 Mike Bostock
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice,
     *    this list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright
     *    notice,this list of conditions and the following disclaimer in the
     *    documentation and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its
     *    contributors may be used to endorse or promote products derived from
     *    this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     * --------------------------------------------------------------------------
     * @hidden
     */
    /**
     * Treemap layout algorithm: binaryTree.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.binaryTree = function (parent) {
        var nodes = parent.children, i, n = nodes.length, sum, sums = new Array(n + 1);
        for (sums[0] = sum = i = 0; i < n; ++i) {
            sums[i + 1] = sum += nodes.getIndex(i).value;
        }
        partition(0, n, parent.value, parent.x0, parent.y0, parent.x1, parent.y1);
        function partition(i, j, value, x0, y0, x1, y1) {
            if (i >= j - 1) {
                var node = nodes.getIndex(i);
                node.x0 = x0, node.y0 = y0;
                node.x1 = x1, node.y1 = y1;
                return;
            }
            var valueOffset = sums[i], valueTarget = (value / 2) + valueOffset, k = i + 1, hi = j - 1;
            while (k < hi) {
                var mid = k + hi >>> 1;
                if (sums[mid] < valueTarget)
                    k = mid + 1;
                else
                    hi = mid;
            }
            if ((valueTarget - sums[k - 1]) < (sums[k] - valueTarget) && i + 1 < k)
                --k;
            var valueLeft = sums[k] - valueOffset, valueRight = value - valueLeft;
            if ((x1 - x0) > (y1 - y0)) {
                var xk = (x0 * valueRight + x1 * valueLeft) / value;
                partition(i, k, valueLeft, x0, y0, xk, y1);
                partition(k, j, valueRight, xk, y0, x1, y1);
            }
            else {
                var yk = (y0 * valueRight + y1 * valueLeft) / value;
                partition(i, k, valueLeft, x0, y0, x1, yk);
                partition(k, j, valueRight, x0, yk, x1, y1);
            }
        }
    };
    /**
     * Treemap layout algorithm: slice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.slice = function (parent) {
        var x0 = parent.x0;
        var x1 = parent.x1;
        var y0 = parent.y0;
        var y1 = parent.y1;
        var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (y1 - y0) / parent.value;
        while (++i < n) {
            node = nodes.getIndex(i), node.x0 = x0, node.x1 = x1;
            node.y0 = y0, node.y1 = y0 += node.value * k;
        }
    };
    /**
     * Treemap layout algorithm: dice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.dice = function (parent) {
        var x0 = parent.x0;
        var x1 = parent.x1;
        var y0 = parent.y0;
        var y1 = parent.y1;
        var nodes = parent.children, node, i = -1, n = nodes.length, k = parent.value && (x1 - x0) / parent.value;
        while (++i < n) {
            node = nodes.getIndex(i), node.y0 = y0, node.y1 = y1;
            node.x0 = x0, node.x1 = x0 += node.value * k;
        }
    };
    /**
     * Treemap layout algorithm: slideDice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.sliceDice = function (parent) {
        parent.level & 1 ? this.slice(parent) : this.dice(parent);
    };
    /**
     * Treemap layout algorithm: squarify.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    TreeMap.prototype.squarify = function (parent) {
        var ratio = (1 + Math.sqrt(5)) / 2;
        var x0 = parent.x0;
        var x1 = parent.x1;
        var y0 = parent.y0;
        var y1 = parent.y1;
        var nodes = parent.children;
        var nodeValue;
        var i0 = 0;
        var i1 = 0;
        var n = nodes.length;
        var dx;
        var dy;
        var value = parent.value;
        var sumValue;
        var minValue;
        var maxValue;
        var newRatio;
        var minRatio;
        var alpha;
        var beta;
        while (i0 < n) {
            dx = x1 - x0, dy = y1 - y0;
            // Find the next non-empty node.
            do
                sumValue = nodes.getIndex(i1++).value;
            while (!sumValue && i1 < n);
            minValue = maxValue = sumValue;
            alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
            beta = sumValue * sumValue * alpha;
            minRatio = Math.max(maxValue / beta, beta / minValue);
            // Keep adding nodes while the aspect ratio maintains or improves.
            for (; i1 < n; ++i1) {
                sumValue += nodeValue = nodes.getIndex(i1).value;
                if (nodeValue < minValue) {
                    minValue = nodeValue;
                }
                if (nodeValue > maxValue) {
                    maxValue = nodeValue;
                }
                beta = sumValue * sumValue * alpha;
                newRatio = Math.max(maxValue / beta, beta / minValue);
                if (newRatio > minRatio) {
                    sumValue -= nodeValue;
                    break;
                }
                minRatio = newRatio;
            }
            // Position and record the row orientation.
            var row = this.dataItems.template.clone();
            row.value = sumValue;
            row.dice = dx < dy;
            row.children = nodes.slice(i0, i1);
            row.x0 = x0;
            row.y0 = y0;
            row.x1 = x1;
            row.y1 = y1;
            if (row.dice) {
                row.y1 = value ? y0 += dy * sumValue / value : y1;
                this.dice(row);
            }
            else {
                row.x1 = value ? x0 += dx * sumValue / value : x1, y1;
                this.slice(row);
            }
            value -= sumValue, i0 = i1;
        }
    };
    /**
     * [handleDataItemValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    TreeMap.prototype.handleDataItemValueChange = function (dataItem) {
        this.invalidateDataItems();
    };
    /**
     * Setups the legend to use the chart's data.
     */
    TreeMap.prototype.feedLegend = function () {
        var legend = this.legend;
        if (legend) {
            var legendData_1 = [];
            $iter.each(this.series.iterator(), function (series) {
                if (series.level == 1) {
                    legendData_1.push(series);
                }
            });
            legend.dataFields.name = "name";
            legend.itemContainers.template.propertyFields.disabled = "hiddenInLegend";
            legend.data = legendData_1;
        }
    };
    /**
     * @ignore
     */
    TreeMap.prototype.disposeData = function () {
        _super.prototype.disposeData.call(this);
        this._homeDataItem = undefined;
        this.series.clear();
        if (this.navigationBar) {
            this.navigationBar.disposeData();
        }
        this.xAxis.disposeData();
        this.yAxis.disposeData();
    };
    return TreeMap;
}(XYChart));
export { TreeMap };
/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["TreeMap"] = TreeMap;
//# sourceMappingURL=TreeMap.js.map