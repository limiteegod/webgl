/***
 * 个人使用，操作4*4矩阵的操作
 * @constructor
 */

var MyMatrix = function(){};

/**
 * 初始化一个4*4的矩阵
 */
MyMatrix.prototype.unit = function()
{
    var self = this;
    var array = new Float32Array(16);
    array[0] = 1; array[1] = 0; array[2] = 0; array[3] = 0;
    array[4] = 0; array[5] = 1; array[6] = 0; array[7] = 0;
    array[8] = 0; array[9] = 0; array[10] = 1; array[11] = 0;
    array[12] = 0; array[13] = 0; array[14] = 0; array[15] = 0;
}

/**
 * 获得一个空的矩阵
 */
MyMatrix.prototype.getEmpty = function()
{
    return new Float32Array(16);
}

/**
 * 矩阵相乘并把结果返回
 * @param a44
 * @param b44
 */
MyMatrix.prototype.multiply = function(a44, b44, t44)
{
    var self = this;
    if(t44 == undefined)
    {
        t44 = self.getEmpty();
    }
    //第一行
    t44[0] = a44[0]*b44[0] + a44[1]*b44[4] + a44[2]*b44[8] + a44[3]*b44[12];
    t44[1] = a44[0]*b44[1] + a44[1]*b44[5] + a44[2]*b44[9] + a44[3]*b44[13];
    t44[2] = a44[0]*b44[2] + a44[1]*b44[6] + a44[2]*b44[10] + a44[3]*b44[14];
    t44[3] = a44[0]*b44[3] + a44[1]*b44[7] + a44[2]*b44[11] + a44[3]*b44[15];

    //第二行
    t44[4] = a44[4]*b44[0] + a44[5]*b44[4] + a44[6]*b44[8] + a44[7]*b44[12];
    t44[5] = a44[4]*b44[1] + a44[5]*b44[5] + a44[6]*b44[9] + a44[7]*b44[13];
    t44[6] = a44[4]*b44[2] + a44[5]*b44[6] + a44[6]*b44[10] + a44[7]*b44[14];
    t44[7] = a44[4]*b44[3] + a44[5]*b44[7] + a44[6]*b44[11] + a44[7]*b44[15];

    //第三行
    t44[8] = a44[8]*b44[0] + a44[9]*b44[4] + a44[10]*b44[8] + a44[11]*b44[12];
    t44[9] = a44[8]*b44[1] + a44[9]*b44[5] + a44[10]*b44[9] + a44[11]*b44[13];
    t44[10] = a44[8]*b44[2] + a44[9]*b44[6] + a44[10]*b44[10] + a44[11]*b44[14];
    t44[11] = a44[8]*b44[3] + a44[9]*b44[7] + a44[10]*b44[11] + a44[11]*b44[15];

    //第四行
    t44[12] = a44[12]*b44[0] + a44[13]*b44[4] + a44[14]*b44[8] + a44[15]*b44[12];
    t44[13] = a44[12]*b44[1] + a44[13]*b44[5] + a44[14]*b44[9] + a44[15]*b44[13];
    t44[14] = a44[12]*b44[2] + a44[13]*b44[6] + a44[14]*b44[10] + a44[15]*b44[14];
    t44[15] = a44[12]*b44[3] + a44[13]*b44[7] + a44[14]*b44[11] + a44[15]*b44[15];
    return t44;
}

/**
 * 在vec4的约定下，在各个维度进行大小变化
 * @param mMatrix
 * @param vec4
 * @param t44
 */
MyMatrix.prototype.scale = function(mMatrix, vec4, t44)
{
    var self = this;
    if(t44 == undefined)
    {
        t44 = self.getEmpty();
    }
    //第一行，所有的元素都乘x
    t44[0] = mMatrix[0]*vec4[0];
    t44[1] = mMatrix[1]*vec4[0];
    t44[2] = mMatrix[2]*vec4[0];
    t44[3] = mMatrix[3]*vec4[0];

    //第二行，所有的元素都乘y
    t44[4] = mMatrix[4]*vec4[1];
    t44[5] = mMatrix[5]*vec4[1];
    t44[6] = mMatrix[6]*vec4[1];
    t44[7] = mMatrix[7]*vec4[1];

    //第三行，所有的元素都乘z
    t44[8] = mMatrix[8]*vec4[2];
    t44[9] = mMatrix[9]*vec4[2];
    t44[10] = mMatrix[10]*vec4[2];
    t44[11] = mMatrix[11]*vec4[2];

    //第四行，所有的元素都乘1
    t44[12] = mMatrix[12];
    t44[13] = mMatrix[13];
    t44[14] = mMatrix[14];
    t44[15] = mMatrix[15];
    return t44;
}

/**
 * 移动
 * @param mMatrix
 * @param vec4
 * @param t44
 * @returns {*}
 */
MyMatrix.prototype.translate = function(mMatrix, vec4, t44)
{
    var self = this;
    if(t44 == undefined)
    {
        t44 = self.getEmpty();
    }
    //第一行，所有的元素都不变
    t44[0] = mMatrix[0];
    t44[1] = mMatrix[1];
    t44[2] = mMatrix[2];
    t44[3] = mMatrix[3];

    //第二行，所有的元素都不变
    t44[4] = mMatrix[4];
    t44[5] = mMatrix[5];
    t44[6] = mMatrix[6];
    t44[7] = mMatrix[7];

    //第三行，所有的元素都不变
    t44[8] = mMatrix[8];
    t44[9] = mMatrix[9];
    t44[10] = mMatrix[10];
    t44[11] = mMatrix[11];

    //第四行
    t44[12] = mMatrix[0]*vec4[0] + mMatrix[4]*vec4[1] + mMatrix[8]*vec4[2] + mMatrix[12];
    t44[13] = mMatrix[1]*vec4[0] + mMatrix[5]*vec4[1] + mMatrix[9]*vec4[2] + mMatrix[13];
    t44[14] = mMatrix[2]*vec4[0] + mMatrix[6]*vec4[1] + mMatrix[10]*vec4[2] + mMatrix[14];
    t44[15] = mMatrix[3]*vec4[0] + mMatrix[7]*vec4[1] + mMatrix[11]*vec4[2] + mMatrix[15];
    return t44;
}






