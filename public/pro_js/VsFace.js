/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsFace = function(){
    var self = this;
    VsObject.call(self);
    self._selfInit();
}

VsFace.prototype = new VsObject();

VsFace.prototype._selfInit = function()
{
    var self = this;
    self.angle = 0.0;
}

/**
 * 创建缓存数据
 */
VsFace.prototype._createBuffer = function()
{
    var self = this;
    pi = self.pi;
    var count = 0;

    self.vp = [
        4.0, 0.0, 4.0,
        -4.0, 0.0, 4.0,
        -4.0, 0.0, -4.0,
        4.0, 0.0, -4.0
    ]

    self.vc = [
        0.56, 0.56, 0.157, 1.0,
        0.56, 0.56, 0.157, 1.0,
        0.56, 0.56, 0.157, 1.0,
        0.56, 0.56, 0.157, 1.0
    ]

    self.pi = [
        2, 1, 0,
        0, 3, 2
    ]

    self.ptCount = 4;

    self.ptIndexCount = 6;
}

//face.rotate(Math.PI/(180*5), [0.0, 1.0, 0.0]);
//face.move([0.0, 0.0, -2.82]);

/**
 * 模型在运行时的变换都在此发生
 */
VsFace.prototype.activate = function()
{
    var self = this;
    self.angle += 0.001;
    var tMatrix = self.matrix.create();
    self.matrix.translate(self.mMatrix, [0.0, 0.0, -2.82], tMatrix);
    self.matrix.rotate(tMatrix, self.angle, [0.0, 1.0, 0.0], tMatrix);
    return tMatrix;
}

/**
 * 绘制图形
 */
VsFace.prototype.draw = function()
{
    var self = this;
    self.changeVP();
    self.game.refreshBuffer(self);
    self.game.gl.drawElements(self.game.gl.TRIANGLES, 6, self.game.gl.UNSIGNED_SHORT, 0);
    self.drawChildren();
}