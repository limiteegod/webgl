/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsHouse = function(vsGame){
    var self = this;
    self.game = vsGame;
    self._init();
}

for(var key in VsObject.prototype)
{
    VsHouse.prototype[key] = VsObject.prototype[key];
}

/**
 * 创建缓存数据
 */
VsHouse.prototype._createBuffer = function()
{
    var self = this;
    pi = self.pi;

    self.vp = [
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 0.0, 0.0,

        0.0, 0.0, -1.0,
        0.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 0.0, -1.0
    ]

    self.vc = [
        1.00, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        1.00, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ]

    self.pi = [
        2, 1, 0,
        0, 3, 2,

        4, 5, 6,
        6, 7, 4,

        0, 1, 5,
        5, 4, 0,

        5, 1, 2,
        2, 6, 5,

        6, 2, 3,
        3, 7, 6
    ]

    self.ptCount = self.vp.length/3;

    self.ptIndexCount = self.pi.length;
}

/**
 * 绘制图形
 */
VsHouse.prototype.draw = function()
{
    var self = this;
    self.changeVP();
    self.game.refreshBuffer(self);
    self.game.gl.drawElements(self.game.gl.TRIANGLES, self.ptIndexCount, self.game.gl.UNSIGNED_SHORT, 0);
}

/**
 * 模型变换都在此发生
 */
VsHouse.prototype.change = function(matrix)
{
    var self = this;
    if(matrix == undefined)
    {
        return;
    }
    var tMatrix = self.matrix.create();
    self.matrix.multiply(matrix, self.mMatrix, tMatrix);
    self.mMatrix = tMatrix;
}