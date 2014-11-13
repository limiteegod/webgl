/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsAxis = function(vsGame){
    var self = this;
    self.game = vsGame;
    self._init();
}

for(var key in VsObject.prototype)
{
    VsAxis.prototype[key] = VsObject.prototype[key];
}

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