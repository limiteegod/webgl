/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsSquare = function(config){
    var self = this;
    VsObject.call(self);
    self.vp = config.vp;
    self.tc = config.tc;
    self.texAddr = config.texAddr;
}
VsSquare.prototype = new VsObject();

/**
 * 创建缓存数据
 */
VsSquare.prototype._createBuffer = function()
{
    var self = this;
    pi = self.pi;

    console.log(self.vp);
    /*self.vp = [
        1.0, 0.0, 1.0,
        -1.0, 0.0, 1.0,
        -1.0, 0.0, -1.0,
        1.0, 0.0, -1.0
    ]*/

    self.vc = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ]

    self.pi = [
        2,1,0,
        2,0,3
    ]

    self.ptCount = self.vp.length/3;

    self.ptIndexCount = self.pi.length;

    self.tex = self.game.gl.createTexture();
    self.createTexture(self.texAddr);
}

/**
 * 绘制图形
 */
VsSquare.prototype.draw = function()
{
    var self = this;
    self.changeVP();
    self.game.refreshBuffer(self);
    self.game.gl.drawElements(self.game.gl.TRIANGLES, self.ptIndexCount, self.game.gl.UNSIGNED_SHORT, 0);
}