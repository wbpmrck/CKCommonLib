/*
作者： kaicui
依赖： Jquery
使用说明：
sliderInner应当有一个父元素div，该div需要设置overflow:hidden
sliderInner需设置宽度，要求其宽度必须足够容纳所有的滚动元素和滚动间隔元素横排展示
sliderInner里面的元素在初始化状态下，应当是从第一个开始显示在可见区域内：
1:你可以指定一定的初始化margin-left，来制作一些偏移效果，但是请确保保证第一个元素仍然在可视范围内，因为这会影响插件对可视区域的把握
调用setHorizontalSlider之后，会返回一个操作对象，使用该对象可以进行各种操作和设置
并且会给所有被移动的元素进行编号，使用api可以获取这些编号
-----------------------------------
版本历史：
2012年6月26日10:05:35      代码重构
1、修改所有对外API首字母小写

2012年3月17日14:50:40      API增强
1、给RollLeft和RollRight方法增加回调函数
2、添加API:GetViewPortHeadIndex().获取SectionB之后的一位元素的Index(在整个元素链中的下标).


2012年3月15日22:13:27      API增强

1   修改RollLeft和RollRight方法参数，可传入负数，负数代表向相反方向移动
2   添加API,可以传入一个jquery对象元素，返回该元素到可见元素链表的首个元素的位移量


2012年3月15日10:13:27      修改循环功能实现思路
1、改变了插件使用的限制，原先使用插件，必须保证要 滚动的元素个数至少是可视区域+1，现在可以减少到与可视区域个数一致即可。
并且支持一次性滚动元素的个数=所有元素的个数
2、在初始化的时候：
a)将容器div先移出
b)将要显示的元素复制3份出来，分别加在原来元素的左右两侧:如图：
TotalList
--------------------------------------------------------
|                                                      |
在总列表中编号：
(A1~A4)          (B1~B4)         (C1~C4)         (D1~D4)
SectionA       SectionB         List            Tail
（无宽度）     
1,2,3,4        1,2,3,4          1,2,3,4         1,2,3,4             状态：初始化

状态：左移一步
1,2,3,4,1      2,3,4,1          2,3,4,1         2,3,4                1:SectionB.Min(1).PopLeft(1).PushRight(1);SectionA.PushRight(1);
//最小化左侧元素，实现左移
2,3,4,1        2,3,4,1          2,3,4,1         2,3,4,1                1:SectionA.CutLeft(1);TotalList.AddTail(1);   //将SectionA左侧元素移到队尾
状态：右移一步
2,3,4          1,2,3,4          1,2,3,4         1,2,3,4,1           SectionA.Max(1);//将A中最右侧的1最大化，实现右移
SectionB.PushLeft(SectionA.PopRight(1)).PopRight(1);//将A最右侧元素交给B，B把自己最右侧元素推出
1,2,3,4        1,2,3,4          1,2,3,4         1,2,3,4             SectionA.PushLeft(TotalList.PopTail(1));

以上所有的数据结构：SectionA,B,TotalList,每个操作，都会对具体DOM元素进行操作
其中:SectionA的push方法，会把DOM元素最小化加进来，已经最小化的不操作

定义节点元素Node{
ID:[编号，比如A1~An,B1~Bn,C1~Cn,D1~Dn]
Status:[Normal,MinSize]//表示外形状态
DOMele:[DOM object]//关联的DOM元素
NormalSize:function(){}//将元素恢复原始大小
MinSize:function(){}//将元素最小化
}

c)修改容器div的margin-left,为整个一组元素的宽度的负数形式。（这样看上去就像没加一样）
d)外部需要传入对元素进行缩减和恢复的处理对象，比如
object MiniMize{ width: 0 ,paddingLeft:0,paddingRight:0} ;
object Normal{width: 116 ,paddingLeft:10,paddingRight:10 };
如果不传入，则插件自动默认读取这几个属性，并保存
3、每次移动过后，判断元素减少的一边（移动方向的反面）的元素个数如果少于N,则 元素都将缩放为0的元素移动到另外一边。也就是说始终保持可视区域左侧有n个元素

4、在缩减宽度的时候，需要注意：
a)元素有可能有padding来布局横向间距，所以在设置宽度的时候，同时也要把padding缩减。同样，恢复的时候也要把padding恢复


2012年3月14日  16:11:48      添加循环功能：
1、并不是每次滚动都修改DOM元素
2、每次当滚动到边界的时候，判断需要补位的时候，从左侧或者右侧，砍掉视图区域以外的部分进行补位
3、添加了数据结构保存整个链条的首尾节点，以及可视区域的首尾节点
4、每次滚动之前，先检查本次滚动是否需要改变dom结构补位，如果需要，补位后再滚动

2012年3月12日  9:14:12      版本创建
//////////////////////////////////////////////////////////////////*/

var MyUI = (function (my) {
    return my;
} (MyUI || {}))

MyUI.Slider = (function (my) {
    //节点类构造函数区域
    function _ClassNode(id, status, ele, originSize, minsize) {
        this.ID = id;
        this.Status = status;
        this.JQDomEle = ele;
        var _self = this; //jquery异步回调会修改函数的调用对象，导致对this指针引用出问题

        //从DOM中移出自己
        this.Detach = function () {
            this.JQDomEle.detach();
        };
        //把自己加到DOM容器的尾部
        this.InsertToContainerTail = function () {
            this._container.append(this.JQDomEle);
        };
        //把自己加到DOM容器的头部
        this.InsertToContainerHead = function () {
            this._container.prepend(this.JQDomEle);
        };
        //将自身大小最小化
        this.Minimize = function (duration, callback) {
            if (this.Status == 1) {
                if (!duration) {
                    this.JQDomEle.css(this.MinSize);
                    _self.Status = 0;
                }
                else
                    this.JQDomEle.animate(this.MinSize, duration, function () {
                        _self.Status = 0;
                        if (callback)
                            callback();
                    });
            }
        };
        //将自身大小最大化
        this.Maximize = function (duration, callback) {
            if (this.Status == 0) {
                if (!duration) {
                    this.JQDomEle.css(this.NormalSize);
                    _self.Status = 1;
                }
                else
                    this.JQDomEle.animate(this.NormalSize, duration, function () {
                        _self.Status = 1;
                        if (callback)
                            callback();
                    });
            }
        };
    };
    _ClassNode.prototype.NormalSize = {};   //所有节点的初始化大小属性
    _ClassNode.prototype.MinSize = {};      //所有节点的最小化大小属性
    _ClassNode.prototype._container = {}; //所有节点都共存于一个容器内

    var _setHorizontalSliderRolling = function (
    sliderInner, //包含要滑动的元素的div
    sliderItem, //要滑动的元素
    itemWidth, //被滚动的元素的宽度
    speed, //滑动速度，单位ms,表示在多少秒内完成滑动
    miniFormat, //sliderItem元素的最小化格式对象，指定了让一个元素消失需要设置的格式目标值，如：{width: 0 ,paddingLeft:0,paddingRight:0}
    normalFormat//指定了sliderItem元素的正常大小格式，如：{width: 116 ,paddingLeft:10,paddingRight:10 };
    ) {
        sliderInner = (typeof sliderInner == 'string' ? $(sliderInner) : sliderInner);
        sliderItem = (typeof sliderItem == 'string' ? $(sliderItem) : sliderItem); //sliderItem保存着原始的元素列表

        _ClassNode.prototype._container = sliderInner;

        var containerParent = $(sliderInner.parent()); //容器的父容器
        var containerSlibing = $(sliderInner.next()); //容器的下一个节点（如果为空，则还原容器的时候，直接插在父容器下面）

        var itemCount = sliderItem.length; //滚动元素个数
        var marginLeftOrigin = parseInt(sliderInner.css('marginLeft')); //获取初始位移
        if (itemWidth == 0) {
            itemWidth = parseInt(sliderItem.css("width")) + parseInt(sliderItem.css("paddingLeft")) + parseInt(sliderItem.css("paddingRight"));
        }
        var marginUpdated = marginLeftOrigin - itemCount * itemWidth;
        //获取必要信息
        if (!normalFormat) {
            normalFormat = {
                width: sliderItem.width(),
                paddingLeft: parseInt(sliderItem.css('paddingLeft')),
                paddingRight: parseInt(sliderItem.css('paddingRight'))
            };
        }

        _ClassNode.prototype.NormalSize = normalFormat;   //所有节点的初始化大小属性
        _ClassNode.prototype.MinSize = miniFormat;      //所有节点的最小化大小属性
        //构建核心数据结构
        //1:拷贝滑动元素
        var itemsSectionA = sliderItem.clone(true);
        var itemsSectionB = sliderItem.clone(true);
        var itemsSectionTail = sliderItem.clone(true);
        //2:移出容器
        sliderInner.detach();
        sliderItem.detach();
        //3:添加TotalList【所有节点实体集合】
        var TotalList = {
            NodeList: [],
            Add: function (ele) {
                this.NodeList.push(ele);
                ele.InsertToContainerTail();
            },
            //将节点链条左侧的元素转移到右侧
            CutHeadToTail: function (count) {
                for (var i = 0; i < count; i++) {
                    var node = this.NodeList.shift();
                    this.NodeList.push(node); //完成逻辑上的操作
                    node.Detach();
                    node.Maximize(); //右侧元素不能是隐藏的
                    node.InsertToContainerTail(); //完成DOM上的操作
                }
            },
            //将节点链条右侧的元素转移到左侧
            CutTailToHead: function (count) {
                for (var i = 0; i < count; i++) {
                    var node = this.NodeList.pop();
                    this.NodeList.unshift(node); //完成逻辑上的操作
                    node.Detach();
                    node.Minimize(); //左侧是SectionA,只能保存无大小的元素
                    node.InsertToContainerHead(); //完成DOM上的操作
                }
            }
        };

        var index = 0;
        itemsSectionA.each(function (i) {
            $(this).attr("slideID", index);
            var node = new _ClassNode(index++, 1, $(this), normalFormat, miniFormat);
            node.Minimize();
            TotalList.Add(node);
        });
        itemsSectionB.each(function (i) {
            $(this).attr("slideID", index);
            var node = new _ClassNode(index++, 1, $(this), normalFormat, miniFormat);
            TotalList.Add(node);
        });
        sliderItem.each(function (i) {
            $(this).attr("slideID", index);
            var node = new _ClassNode(index++, 1, $(this), normalFormat, miniFormat);
            TotalList.Add(node);
        });
        itemsSectionTail.each(function (i) {
            $(this).attr("slideID", index);
            var node = new _ClassNode(index++, 1, $(this), normalFormat, miniFormat);
            TotalList.Add(node);
        });
        //4:定义操作对象：SectionA[专门保存无宽度节点，用于右移],B[保存有宽度节点，用于左移]
        var SectionA = {
            HeadID: 0,
            TailID: (itemCount - 1),
            //将链内节点大小最大化
            MAX: function (n, newspeed, finishedback) {
                var count = n;
                for (var i = this.TailID; count > 0; count--, i--) {
                    var node = TotalList.NodeList[i];
                    if (count == 1) {
                        node.Maximize(newspeed, function () {
                            TotalList.CutTailToHead(n); //动画执行完之后，将尾部的元素移到首部
                            if (finishedback)
                                finishedback();

                        });
                    }
                    else {
                        node.Maximize(newspeed);
                    }
                }
            }
        };
        var SectionB = {
            HeadID: itemCount,
            TailID: (2 * itemCount - 1),
            //将链内节点大小最小化
            MIN: function (n, newspeed, finishedback) {
                var count = n;
                for (var i = this.HeadID; count > 0; count--, i++) {
                    var node = TotalList.NodeList[i];
                    if (count == 1) {
                        node.Minimize(newspeed, function () {
                            TotalList.CutHeadToTail(n); //动画执行完之后，将首部的元素移到尾部
                            if (finishedback)
                                finishedback();
                        });
                    }
                    else {
                        node.Minimize(newspeed);
                    }
                }
            }

        };
        //5:还原容器
        sliderInner.css("marginLeft", marginUpdated);
        if (containerSlibing.length > 0) {
            sliderInner.insertBefore(containerSlibing);
        }
        else {
            containerParent.append(sliderInner);
        }

        var isRolling = false; //控制多次滚动行为不能同时发生
        var SliderObject = {

            Speed: speed, //可修改项：滑动速度

            //api:获取当前滚动插件是否可用，如果不可用，很可能是没有满足设置条件，或者一屏显示元素个数超过了滚动元素个数
            IsEnable: function () {
                //                return showCount < itemCount; deldete by kaicui 2012年3月16日 16:58:38 之前有限制，现在无限滚动无限制
                return true;
            },
            //api:获取被滑动的元素集合[原始的元素]
            GetSlideItems: function () {
                return sliderItem;
            },
            //api:获取逻辑视图的整个元素链条
            GetLogicAllItemChain: function () {
                return TotalList;
            },
            //api:获取逻辑视图的SectionA
            GetLogicSectionA: function () {
                return SectionA;
            },
            //api:获取逻辑视图的SectionB
            GetLogicSectionB: function () {
                return SectionB;
            },
            //api:获取可视区域的第一个元素的下标
            GetViewPortHeadIndex: function () {
                return itemCount * 2;
            },
            //api:获取指定元素到首部的位移
            GetDistanceToViewportHead: function (ele) {
                var thisID = parseInt($(ele).attr("slideid"));
                var viewHead = TotalList.NodeList[itemCount * 2].ID;
                if (thisID >= viewHead) {
                    return (thisID - viewHead);
                }
                else {
                    return ((itemCount * 4 - viewHead) + (thisID - 0));
                }
            },
            //api:向左侧滑动。可指定滑动个数
            //返回是否滑动成功
            RollLeft: function (count, callback) {
                var countAbs = Math.abs(count);
                if (isRolling || !this.IsEnable() || countAbs < 1) {
                    return false;
                }
                if (count < 0)
                    this.RollRight(countAbs, callback);

                isRolling = true;
                SectionB.MIN(count, this.Speed, function () {
                    isRolling = false;
                    if (callback)
                        callback();
                });
                return true;
            },
            //api:向右侧滑动。可指定滑动个数
            //返回是否滑动成功
            RollRight: function (count, callback) {
                var countAbs = Math.abs(count);
                if (isRolling || !this.IsEnable() || countAbs < 1) {
                    return false;
                }
                if (count < 0)
                    this.RollLeft(countAbs, callback);
                isRolling = true;
                SectionA.MAX(count, this.Speed, function () {
                    isRolling = false;
                    if (callback)
                        callback();
                });
                return true;
            }
        };
        //返回Slider对象，提供api
        return SliderObject;
    };
    var _setHorizontalSlider = function (
    sliderInner, //包含要滑动的元素的div
    sliderItem, //要滑动的元素
    itemWidth, //被滚动的元素的宽度
    speed, //滑动速度，单位ms,表示在多少秒内完成滑动
    showCount//一屏展示的元素个数(即使元素有部分偏移出视野，也算一个元素)
    ) {
        sliderInner = (typeof sliderInner == 'string' ? $(sliderInner) : sliderInner);
        sliderItem = (typeof sliderItem == 'string' ? $(sliderItem) : sliderItem); //sliderItem保存着原始的元素列表
        //给元素编号
        sliderItem.each(function (i) {
            $(this).data('dataBound', { 'index': i }); //每个元素都保存了自己在该列表中的索引号
        });

        var itemCount = sliderItem.length; //滚动元素个数
        if (itemWidth == 0) {
            itemWidth = parseInt(sliderItem.css("width")) + parseInt(sliderItem.css("paddingLeft")) + parseInt(sliderItem.css("paddingRight"));
        }
        var marginLeftOrigin = parseInt(sliderInner.css('marginLeft')); //获取初始位移
        var marginLeft = marginLeftOrigin; //当前位移=初始位移
        var marginLeftOffset = -(itemWidth);
        var marginLeftMax = marginLeftOrigin + (itemCount - showCount) * marginLeftOffset;

        var isRolling = false; //控制多次滚动行为不能同时发生
        var totalHeadTail = { head: $(sliderItem[0]), tail: $(sliderItem[itemCount - 1]) }; //元素在DOM中的首部（左侧）和尾部（右侧）
        var viewportHeadTail = { head: $(sliderItem[0]), tail: $(sliderItem[showCount - 1]) }; //元素在可视区域中的首部（左侧）和尾部（右侧）
        //内部函数：获取左侧2个id之间的连续id，返回数组(如：6,7,8,0,1,2,3,4的情况，传入6（队首）,2（左边界）,返回[6,7,8,0,1,2])
        var _getConSeqLeft = function (no1, no2) {
            var ar = [];
            if (no1 < no2) {
                for (var i = no1; i <= no2; i++) {
                    ar.push(i);
                }
            }
            else if (no1 > no2) {
                ar = _getConSeqLeft(no1, itemCount - 1).concat(_getConSeqLeft(0, no2));
            }
            else {
            }
            return ar;
        };
        //内部函数：用于判断在当前模式下，向指定方向进行滚动是否可行。如果可行，返回当前最大允许滚动的个数，以及是否需要cut，不可行，返回0
        //返回对象：{maxCount:int,needCut:bool}
        var _checkRollEnable = function (target, count) {
            //默认不循环，则直接判断边界
            if (target == "left") {
                //左移：看队尾情况，返回 视图队尾~元素队尾 的间隔元素数量
                var space = _getConSeqLeft(_getItemSeqNo(viewportHeadTail.tail), _getItemSeqNo(totalHeadTail.tail)).length - 1;
                space = space < 0 ? 0 : space;
                return { maxCount: space, needCut: false };
            }
            else {
                //右移：看队首情况，返回  视图队首~元素队首 的间隔元素数量
                var space = _getConSeqLeft(_getItemSeqNo(totalHeadTail.head), _getItemSeqNo(viewportHeadTail.head)).length - 1;
                space = space < 0 ? 0 : space;
                return { maxCount: space, needCut: false };
            }
        };
        //获取被滚动的元素排序号[rollEle:元素的jquery对象或者id]
        var _getItemSeqNo = function (rollEle) {
            rollEle = (typeof rollEle == 'string' ? $(rollEle) : rollEle);
            return rollEle.data('dataBound').index;
        };
        //更新可视区域首尾元素。根据当前移动的方向和移动的个数
        var _updateViewport = function (moved, target) {
            if (moved < 1) {
                return;
            }
            else {
                //左移的情况
                if (target == "left") {
                    var nowHeadID = __getRealID(_getItemSeqNo(viewportHeadTail.head) + moved);
                    var nowTailID = __getRealID(_getItemSeqNo(viewportHeadTail.tail) + moved);
                    viewportHeadTail.head = $(sliderItem[nowHeadID]);
                    viewportHeadTail.tail = $(sliderItem[nowTailID]);
                }
                else {
                    var nowHeadID = __getRealID(_getItemSeqNo(viewportHeadTail.head) - moved);
                    var nowTailID = __getRealID(_getItemSeqNo(viewportHeadTail.tail) - moved);
                    viewportHeadTail.head = $(sliderItem[nowHeadID]);
                    viewportHeadTail.tail = $(sliderItem[nowTailID]);
                }
            }
            //内部工具函数：根据计算出的id,返回其真实的ID
            function __getRealID(id) {
                var realid = 0;
                if (id > itemCount - 1) {
                    realid = id % itemCount;
                    return realid;
                }
                else if (id < 0) {
                    realid = -(id % itemCount);
                    return __getRealID(realid);
                }
                else {
                    return id;
                }
            }
        };
        var SliderObject = {

            Speed: speed, //可修改项：滑动速度

            //api:获取当前滚动插件是否可用，如果不可用，很可能是没有满足设置条件，或者一屏显示元素个数超过了滚动元素个数
            IsEnable: function () {
                return showCount < itemCount;
            },
            //api:获取被滑动的元素集合
            GetItems: function () {
                return sliderItem;
            },
            //api:获取视野内元素首尾节点信息
            GetViewport: function () {
                return {
                    head: {
                        id: _getItemSeqNo(viewportHeadTail.head),
                        ele: viewportHeadTail.head
                    },
                    tail: {
                        id: _getItemSeqNo(viewportHeadTail.tail),
                        ele: viewportHeadTail.tail
                    }
                };
            },
            //api:获取元素链条的首尾节点信息
            GetItemChain: function () {
                return {
                    head: {
                        id: _getItemSeqNo(totalHeadTail.head),
                        ele: totalHeadTail.head
                    },
                    tail: {
                        id: _getItemSeqNo(totalHeadTail.tail),
                        ele: totalHeadTail.tail
                    }
                };
            },
            //api:获取被滚动的元素排序号[rollEle:元素的jquery对象或者id]
            GetItemSeqNo: function (rollEle) {
                return _getItemSeqNo(rollEle);
            },

            //api:获取滑动元素容器(真正进行滑动的元素)
            GetContainer: function () {
                return sliderInner;
            },
            //api:向左侧滑动。可指定滑动个数
            //返回是否滑动成功
            RollLeft: function (count) {
                if (isRolling || !this.IsEnable() || count < 1) {
                    return false;
                }
                isRolling = true;
                //判断当前能否继续向左滚动
                var canRoll = _checkRollEnable("left", count);
                //无法继续滚动
                if (canRoll.maxCount < count) {
                    isRolling = false;
                    return false;
                }
                //可以继续滚动，查看是否需要改变DOM
                else if (canRoll.needCut) {
                    _cutLeft(); //需要改变的话，就剪切左边补位到右边
                }
                //                if (marginLeft <= marginLeftMax) {
                //                    isRolling = false;
                //                    return false;
                //                };
                marginLeft += count * marginLeftOffset;
                sliderInner.animate({ marginLeft: marginLeft }, this.Speed, function () {
                    //更新可视区域队首队尾
                    _updateViewport(count, "left");
                    //blabla
                    isRolling = false;
                });
                return true;
            },
            //api:向右侧滑动。可指定滑动个数
            //返回是否滑动成功
            RollRight: function (count) {
                if (isRolling || !this.IsEnable() || count < 1) {
                    return false;
                }
                isRolling = true;
                //判断当前能否继续向右滚动
                var canRoll = _checkRollEnable("right", count);
                //无法继续滚动
                if (canRoll.maxCount < count) {
                    isRolling = false;
                    return false;
                }
                //可以继续滚动，查看是否需要改变DOM
                else if (canRoll.needCut) {
                    _cutRight(); //需要改变的话，就剪切右边补位到左边
                }
                //                if (marginLeft >= marginLeftOrigin) {
                //                    isRolling = false;
                //                    return false;
                //                };
                marginLeft -= count * marginLeftOffset;
                sliderInner.animate({ marginLeft: marginLeft }, this.Speed, function () {
                    //更新可视区域队首队尾
                    _updateViewport(count, "right");
                    //blabla
                    isRolling = false;
                });
                return true;
            }
        };
        //返回Slider对象，提供api
        return SliderObject;
    };
    //初始化循环滚动的组件
    my.setHorizontalSliderRolling = function (param) {
        return _setHorizontalSliderRolling(
    param.sliderInner || "#sliderInner",
    param.sliderItem || "#sliderItem",
    param.itemWidth || 0,
    param.speed || 500,
    param.miniFormat || { width: 0, paddingLeft: 0, paddingRight: 0 },
    param.normalFormat || undefined)
    };

    //初始化不可循环滚动的组件
    my.setHorizontalSlider = function (param) {
        return _setHorizontalSlider(
    param.sliderInner || "#sliderInner",
    param.sliderItem || "#sliderItem",
    param.itemWidth || 0,
    param.speed || 500,
    param.showCount || 0)
    };
    return my;
} (MyUI.Slider || {}))