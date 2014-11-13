/**
 *
 * @param pointCount 开销的顶点数目
 * @constructor
 */
var VsObject = function()
{
    var self = this;
}

/**
 * 初始化，点初始位置的计算应该在这一步
 * @private
 */
VsObject.prototype._init = function()
{
    var self = this;

    self.matrix = self.game.matrix;
    self.vpMatrix = self.game.vpMatrix;

    self.ptCount = 0;   //顶点数目
    self.ptIndexCount = 0;  //顶点索引数目
    self.ptStart = 0;   //顶点缓存的开始位置
    self.ptIndexStart = 0;  //顶点索引缓存开始的位置

    self.vp = [];           //顶点
    self.vc = [];           //颜色
    self.pi = [];           //顶点索引

    self.mMatrix = self.matrix.identity(self.matrix.create());  //模型变换矩阵
    self.countMatrix = self.mMatrix;    //一帧的变换矩阵

    self.children = [];     //子对象

    self.parent = null;     //没有父对象

    self._createBuffer();
}

/**
 * 创建缓存数据
 */
VsObject.prototype._createBuffer = function()
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
    self.ptIndexCount = ptIndexCount;
}

/**
 * 绘制图形
 */
VsObject.prototype.draw = function()
{
    var self = this;
    self.changeVP();
    self.game.refreshBuffer(self);
    // 使用索引进行绘图
    self.game.gl.drawElements(self.game.gl.LINES, self.ptCount*2, self.game.gl.UNSIGNED_SHORT, 0);
    self.drawChildren();
}


/**
 * 绘制对象的子对象
 */
VsObject.prototype.drawChildren = function()
{
    var self = this;
    for(var key in self.children)
    {
        var child = self.children[key];
        child.draw();
    }
}

/**
 * 模型在运行时的变换都在此发生
 */
VsObject.prototype.activate = function()
{
    var self = this;
    return self.mMatrix;
}

/**
 * 改变视图投影矩阵
 */
VsObject.prototype.changeVP = function()
{
    var self = this;
    var mMatrix = self.activate();

    //新建一份数据，不影响模型本身的模型变化矩阵
    var tMatrix = self.matrix.create();
    self.matrix.copy(mMatrix, tMatrix);

    var tmpObj = self;
    while(tmpObj.parent)
    {
        var tmpObj = tmpObj.parent;
        self.matrix.multiply(tMatrix, tmpObj.countMatrix, tMatrix);
    }

    //记录自身这一帧的模型变化矩阵的总体
    self.countMatrix = tMatrix;

    var mvpMatrix = self.matrix.create();
    self.matrix.multiply(self.vpMatrix, tMatrix, mvpMatrix);
    //向uniformLocation中传入坐标变换矩阵
    self.game.gl.uniformMatrix4fv(self.game.uniLocation, false, mvpMatrix);
}

VsObject.prototype.move = function(vec3)
{
    var self = this;
    var tMatrix = self.matrix.create();
    self.matrix.translate(self.mMatrix, vec3, tMatrix);
    self.mMatrix = tMatrix;
}

VsObject.prototype.rotate = function(angle, vec3)
{
    var self = this;
    var tMatrix = self.matrix.create();
    self.matrix.rotate(self.mMatrix, angle, vec3, tMatrix);
    self.mMatrix = tMatrix;
}

/**
 * 给对象添加子对象
 * @param child
 */
VsObject.prototype.add = function(child)
{
    var self = this;
    self.children[self.children.length] = child;
    child.parent = self;
}
