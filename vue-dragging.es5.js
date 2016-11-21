/*!
 * Awe-dnd v0.3.0
 * (c) 2016 Awe <hilongjw@gmail.com>
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.install = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = require('es6-map');

var DragData = function () {
    function DragData() {
        _classCallCheck(this, DragData);

        this.data = {};
    }

    _createClass(DragData, [{
        key: 'new',
        value: function _new(key) {
            if (!this.data[key]) {
                this.data[key] = {
                    className: '',
                    Current: {
                        index: 0,
                        item: null,
                        el: null
                    },
                    List: [],
                    EL_MAP: new Map()
                };
            }
            return this.data[key];
        }
    }, {
        key: 'get',
        value: function get(key) {
            return this.data[key];
        }
    }]);

    return DragData;
}();

var $dragging = {
    listeners: {
        dragged: []
    },
    $on: function $on(event, func) {
        this.listeners[event].push(func);
    },
    $once: function $once(event, func) {
        var vm = this;
        function on() {
            vm.$off(event, on);
            func.apply(vm, arguments);
        }
        this.$on(event, on);
    },
    $off: function $off(event, func) {
        if (!func) {
            this.listeners[event] = [];
            return;
        }
        this.listeners[event].$remove(func);
    },
    $emit: function $emit(event, context) {
        this.listeners[event].forEach(function (func) {
            func(context);
        });
    }
};

var _ = {
    on: function on(el, type, fn) {
        el.addEventListener(type, fn);
    },
    off: function off(el, type, fn) {
        el.removeEventListener(type, fn);
    },
    addClass: function addClass(el, cls) {
        if (arguments.length < 2) {
            el.classList.add(cls);
        } else {
            for (var i = 1, len = arguments.length; i < len; i++) {
                el.classList.add(arguments[i]);
            }
        }
    },
    removeClass: function removeClass(el, cls) {
        if (arguments.length < 2) {
            el.classList.remove(cls);
        } else {
            for (var i = 1, len = arguments.length; i < len; i++) {
                el.classList.remove(arguments[i]);
            }
        }
    }
};

var vueDragging = function (Vue, options) {
    var isPreVue = Vue.version.split('.')[0] === '1';
    var dragData = new DragData();

    function handleDragStart(e) {
        var el = getBlockEl(e.target);
        var key = el.getAttribute('drag_group');
        var DDD = dragData.new(key);
        var item = DDD.EL_MAP.get(el);
        var index = DDD.List.indexOf(item);

        _.addClass(el, 'dragging');

        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text', JSON.stringify(item));
        }

        DDD.Current = {
            index: index,
            item: item,
            el: el
        };
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDragEnter(e) {
        var el = void 0;
        if (e.type === 'touchmove') {
            e.stopPropagation();
            e.preventDefault();
            el = getOverElementFromTouch(e);
            el = getBlockEl(el);
        } else {
            el = getBlockEl(e.target);
        }

        if (!el) return;

        var key = el.getAttribute('drag_group');
        var DDD = dragData.new(key);

        if (!DDD.Current.el || !DDD.Current.item) return;

        if (el === DDD.Current.el) return;

        var item = DDD.EL_MAP.get(el);
        var indexTo = DDD.List.indexOf(item);
        var indexFrom = DDD.List.indexOf(DDD.Current.item);

        swapArrayElements(DDD.List, indexFrom, indexTo);

        DDD.Current.index = indexTo;

        $dragging.$emit('dragged', {
            draged: DDD.Current.item,
            to: item,
            value: DDD.value
        });
    }

    function handleDragLeave(e) {
        _.removeClass(e.target, 'drag-over', 'drag-enter');
    }

    function handleDrag(e) {}

    function handleDragEnd(e) {
        _.removeClass(getBlockEl(e.target), 'dragging', 'drag-over', 'drag-enter');
    }

    function handleDrop(e) {
        e.preventDefault();
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    }

    function getBlockEl(el) {
        if (!el) return;
        while (el.parentNode) {
            if (el.getAttribute('drag_block')) {
                return el;
                break;
            } else {
                el = el.parentNode;
            }
        }
    }

    function swapArrayElements(items, indexFrom, indexTo) {
        var item = items[indexTo];
        if (isPreVue) {
            items.$set(indexTo, items[indexFrom]);
            items.$set(indexFrom, item);
        } else {
            Vue.set(items, indexTo, items[indexFrom]);
            Vue.set(items, indexFrom, item);
        }
        return items;
    }

    function getOverElementFromTouch(e) {
        var touch = e.touches[0];
        var el = document.elementFromPoint(touch.clientX, touch.clientY);
        return el;
    }

    function addDragItem(el, binding, vnode) {
        var item = binding.value.item;
        var list = binding.value.list;

        var DDD = dragData.new(binding.value.group);

        DDD.value = binding.value;
        DDD.List = list;
        DDD.className = binding.value.className;
        DDD.EL_MAP.set(el, item);

        el.setAttribute('draggable', 'true');
        el.setAttribute('drag_group', binding.value.group);
        el.setAttribute('drag_block', binding.value.group);

        _.on(el, 'dragstart', handleDragStart);
        _.on(el, 'dragenter', handleDragEnter);
        _.on(el, 'dragover', handleDragOver);
        _.on(el, 'drag', handleDrag);
        _.on(el, 'dragleave', handleDragLeave);
        _.on(el, 'dragend', handleDragEnd);
        _.on(el, 'drop', handleDrop);

        _.on(el, 'touchstart', handleDragStart);
        _.on(el, 'touchmove', handleDragEnter);
        _.on(el, 'touchend', handleDragEnd);
    }

    function removeDragItem(el, binding, vnode) {
        var DDD = dragData.new(binding.value.group);
        DDD.EL_MAP.delete(el);

        _.off(el, 'dragstart', handleDragStart);
        _.off(el, 'dragenter', handleDragEnter);
        _.off(el, 'dragover', handleDragOver);
        _.off(el, 'drag', handleDrag);
        _.off(el, 'dragleave', handleDragLeave);
        _.off(el, 'dragend', handleDragEnd);
        _.off(el, 'drop', handleDrop);

        _.off(el, 'touchstart', handleDragStart);
        _.off(el, 'touchmove', handleDragEnter);
        _.off(el, 'touchend', handleDragEnd);
    }

    Vue.prototype.$dragging = $dragging;

    if (!isPreVue) {
        Vue.directive('dragging', {
            bind: addDragItem,
            unbind: removeDragItem
        });
    } else {
        Vue.directive('dragging', {
            update: function update(newValue, oldValue) {
                addDragItem(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue,
                    oldValue: oldValue
                });
            },
            unbind: function unbind(newValue, oldValue) {
                removeDragItem(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue ? newValue : { group: this.el.getAttribute('drag_group') },
                    oldValue: oldValue
                });
            }
        });
    }
}

return vueDragging;

})));
