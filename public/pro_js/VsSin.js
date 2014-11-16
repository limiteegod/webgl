/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsSin = function(){
    var self = this;
    VsObject.call(self);
}

VsSin.prototype = new VsObject();

/**
 * 创建缓存数据
 */
VsSin.prototype._createBuffer = function()
{
    var self = this;
    vp = self.vp;
    vc = self.vc;
    pi = self.pi;
    var count = 0;
    for(var i = -4*(Math.PI); i < 4*Math.PI;)
    {
        var x = i;
        var y = Math.sin(i);
        var z = 0.0;

        var vertexCount = count*3;
        vp[vertexCount] = x;
        vp[vertexCount + 1] = y;
        vp[vertexCount + 2] = z;

        var vcCount = count*4;
        vc[vcCount] = 1.0;
        vc[vcCount + 1] = 1.0;
        vc[vcCount + 2] = 0.0;
        vc[vcCount + 3] = 1.0;

        count++;
        i += 0.2;
    }
    self.ptCount = count;

    pi[0] = 0;
    var ptIndexCount = 1;
    for(var i = 0; i < count; i++)
    {
        pi[ptIndexCount] = i;
        ptIndexCount++;
        pi[ptIndexCount] = i;
        ptIndexCount++;
    }
    pi[ptIndexCount] = count - 1;
    ptIndexCount++;
    self.ptIndexCount = ptIndexCount;
}

/**
 * 绘制图形
 */
VsSin.prototype.draw = function()
{
    var self = this;
    self.changeVP();
    self.game.refreshBuffer(self);
    self.game.gl.drawElements(self.game.gl.LINES, self.ptIndexCount, self.game.gl.UNSIGNED_SHORT, 0);
}