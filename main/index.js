/**
 * Created by haoguo on 17/7/4.
 */
jQuery(function ($) {
    var $editor = $('#editor');
    var editor = {
        init: function () {
            this.bindEvent();
        },
        getSelection: function () {
            //获取选择区域的对象
            var userSelection;
            if (window.getSelection) { //现代浏览器
                userSelection = window.getSelection();
            } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
                userSelection = document.selection.createRange();
            }
            return userSelection;
        },
        changeRange: function (selectionObject) {
            //获取w3c规范的range
            //大部分浏览器使用getRangeAt(0)即可获取w3c range对象,为了兼容其它的浏览器,所以用程序创建range对象
            if (selectionObject.getRangeAt)
                return selectionObject.getRangeAt(0);
            else { // 较老版本Safari!
                var range = document.createRange();
                range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
                range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
                return range;
            }
        },
        setCaretEnd: function () {
            var _this = this;
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
            var _this = this;
            $('.j-editor-bar').bind('click',function(){
                return false;
            });
            $editor.bind('mouseup', function (event) {
                var barHeight=$('.j-editor-bar').height();
                var barWidth=$('.j-editor-bar').width();
                var range=_this.changeRange(_this.getSelection());
                console.log(range.getBoundingClientRect());
                if(range.endOffset!=range.startOffset){
                    /*     event = event || window.event;
                     //获得相对于body定位的横标值；

                     var x = event.clientX;
                     //获得相对于body定位的纵标值；
                     var y = event.clientY;*/
                    var offset=range.getBoundingClientRect();//获取选中范围的坐标
                    //若老浏览器不支持,可以使用span包围选区range.surroundContents(),然后Element.getBoundingClientRect()
                    var x=offset.left+offset.width/2-barWidth/2;
                    var y=offset.top-barHeight/2-10;
                    console.log(x+'/'+y);
                    $('.j-editor-bar').css({'top':y-barHeight/2,'left':x}).show();
                }else{
                    $('.j-editor-bar').hide();
                }

            });
            $('html,body').bind('click',function(){
                var range=_this.changeRange(_this.getSelection());
                if(range.endOffset==range.startOffset){
                    $('.j-editor-bar').hide();
                }
            });
            $('.j-bold').click(function(){
                document.execCommand("Bold",false,null);
                var selection=_this.getSelection();
                selection.removeAllRanges();//移除所选对象
                $('.j-editor-bar').hide();
            });
            $('.j-change').bind('click', function () {
                var sel = _this.getSelection();
                if (sel.rangeCount == 0) {
                    //页面刚加载出来时rangeCount==0,发生点击事件时==1,用户通常只能选择一个范围,gecko允许选择多个
                    _this.setCaretEnd();
                }
                //点击输入框后失去焦点
                var status = document.execCommand('insertHTML', false, 'ok');
                if (status) {
                    //如果生效了
                } else {
                    //若是没有生效设置焦点在最后
                    _this.setCaretEnd();
                    document.execCommand('insertHTML', false, 'ok');
                }
            });
        }
    };
    editor.init();
});