/**
 * Created by haoguo on 17/7/4.
 */
jQuery(function ($) {
    var $editor=$('#editor');
    var editor = {
        init: function () {
            this.bindEvent();
        },
        getSelection:function(){
            //获取选择区域的对象
            var userSelection;
            if (window.getSelection) { //现代浏览器
                userSelection = window.getSelection();
            } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
                userSelection = document.selection.createRange();
            }
            return userSelection;
        },
        changeRange:function(selectionObject){
            //获取w3c规范的range
            //大部分浏览器使用getRangeAt(0)即可获取w3c range对象,为了兼容其它的浏览器,所以用程序创建range对象
            if (selectionObject.getRangeAt)
                return selectionObject.getRangeAt(0);
            else { // 较老版本Safari!
                var range = document.createRange();
                range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
                range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
                return range;
            }
        },
        setCaretEnd:function(){
            var _this=this;
            var obj = $('#editor')[0];
            var chdLen = obj.childNodes.length;
            var lastNode = obj.childNodes[chdLen - 1];

            var range = document.createRange();

            $('#editor')[0].focus();
            if (chdLen == 0) {
                range.setStart(obj, 0);
                range.setEnd(obj, 0);
            } else {
                if (lastNode.nodeType == 3) {
                    range.setStart(lastNode, lastNode.length);
                    range.setEnd(lastNode, lastNode.length);
                } else {
                    range.setStart(obj, chdLen);
                    range.setEnd(obj, chdLen);
                }
            }
            var sel = _this.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        },
        bindEvent: function () {
            var _this=this;
            $editor.bind('mouseup',function(){
              // _this.getRange();
            });
            $('.j-change').bind('click',function(){
                var sel=_this.getSelection();
                if(sel.rangeCount==0){
                    //页面刚加载出来时rangeCount==0,发生点击事件时==1,用户通常只能选择一个范围,gecko允许选择多个
                    _this.setCaretEnd();
                    document.execCommand('insertHTML', false, 'ok');
                }else{
                    console.log(_this.changeRange(sel));
                    document.execCommand('insertHTML', false, 'ok');
                }
            });
        }
    };
    editor.init();
});