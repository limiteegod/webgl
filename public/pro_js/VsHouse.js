/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsHouse = function(){
    var self = this;
    VsObject.call(self);
}

VsHouse.prototype = new VsObject();

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
        1.0, 0.0, 0.0
    ]

    self.vc = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ]

    self.pi = [
        0, 3, 1,
        1, 3, 2
    ]

    self.ptCount = self.vp.length/3;

    self.ptIndexCount = self.pi.length;

    //纹理坐标
    self.tc = [
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0
    ];

    self.tex = self.game.gl.createTexture();
    self.createTexture("texture.png");
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