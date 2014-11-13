/**
 *
 * @constructor
 */
var VsAxis = function(){
    var self = this;
    console.log("init VsAxis......................");
    VsObject.call(self);
}
VsAxis.prototype = new VsObject();

/**
 * 创建缓存数据
 */
VsAxis.prototype._createBuffer = function()
{
    var self = this;
    pi = self.pi;
    var count = 0;

    self.vp = [
        -3.9, 0.0, 0.0,
        3.9, 0.0, 0.0,
        0.0, -3.9, 0.0,
        0.0, 3.9, 0.0
    ]

    self.vc = [
        0.5, 1.0, 0.0, 1.0,
        0.5, 1.0, 0.0, 1.0,
        0.5, 1.0, 0.0, 1.0,
        0.5, 1.0, 0.0, 1.0
    ]

    self.pi = [
        0, 1,
        2, 3
    ]

    self.ptCount = 4;

    self.ptIndexCount = 4;
}

/**
 * 绘制图形
 */
VsAxis.prototype.draw = function()
{
    var self = this;
    self.changeVP();
    self.game.refreshBuffer(self);
    self.game.gl.drawElements(self.game.gl.LINES, self.ptIndexCount, self.game.gl.UNSIGNED_SHORT, 0);
}