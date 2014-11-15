var VsGame = function(id)
{
    var self = this;
    self.ptBufferSize = 1024;   //初始化时，申请1024个点的缓存
    self.ptIndexBufferSize = 3096;   //初始化时，顶点索引，申请3096个点的缓存

    // canvas对象获取
    var c = document.getElementById(id);
    c.width = window.innerWidth - 4;
    c.height = window.innerHeight - 4;
    self.width = c.width;
    self.height = c.height;

    //视图及投影矩阵
    self.matrix = new matIV();
    self._createVP();

    //webgl的context获取
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //设置上下文
    self.gl = gl;
    //顶点着色器和片段着色器的生成
    self.vShader = self._createShader('vs');
    self.fShader = self._createShader('fs');
    //程序对象的生成和连接
    self._createProgram();

    self.fcount = 0;    //全局计数器

    //uniformLocation的获取
    self.uniLocation = self.gl.getUniformLocation(self.program, 'mvpMatrix');
    self.texLocation  = self.gl.getUniformLocation(self.program, 'texture');

    self.hasTc = self.gl.getUniformLocation(self.program, 'hasTc');
    self.vHasTc = self.gl.getUniformLocation(self.program, 'vHasTc');

    //存放所有游戏对象
    self.objs = [];

    self.gl.activeTexture(self.gl.TEXTURE0);
}

/**
 * 添加一个对象到游戏中
 * @param obj
 */
VsGame.prototype.add = function(obj)
{
    var self = this;
    self.objs[self.objs.length] = obj;
}

/**
 * 启动程序
 */
VsGame.prototype.run = function(cb)
{
    var self = this;
    self.frame();
}

/**
 * 程序的帧
 */
VsGame.prototype.frame = function()
{
    var self = this;
    // 设定canvas初始化的颜色
    self.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 设定canvas初始化时候的深度
    self.gl.clearDepth(1.0);
    // canvas的初始化
    self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);
    //绘制每一个对象
    for(var i = 0; i < self.objs.length; i++)
    {
        var obj = self.objs[i];
        obj.draw();
    }
    //context的刷新
    self.gl.flush();
    self.fcount++;  //帧计数器
}

/**
 * 初始化游戏的视图投影矩阵
 * @private
 */
VsGame.prototype._createVP = function()
{
    var self = this;
    // matIV对象生成
    var matrix = self.matrix;
    // 各种矩阵的生成和初始化
    var vMatrix = matrix.identity(matrix.create());
    var pMatrix = matrix.identity(matrix.create());
    // 视图变换坐标矩阵
    matrix.lookAt([0.0, 0.0, 4.0], [0, 0, 0], [0, 1, 0], vMatrix);
    // 投影坐标变换矩阵
    //matrix.perspective(90, self.width/self.height, 0.1, 100, pMatrix);

    //这样设置之后，长和宽的虚拟长度都一样
    matrix.perspective(90, 1.0, 0.1, 100, pMatrix);

    //视图和投影矩阵不变，所以先缓存起来
    var vpMatrix = matrix.identity(matrix.create());
    matrix.multiply(pMatrix, vMatrix, vpMatrix);
    self.vpMatrix = vpMatrix;
}

VsGame.prototype.refreshBuffer = function(obj)
{
    var self = this;
    // attributeLocation的获取
    var attLocation = [];
    attLocation[attLocation.length] = self.gl.getAttribLocation(self.program, 'position');
    attLocation[attLocation.length] = self.gl.getAttribLocation(self.program, 'color');

    // 将元素数attribute保存到数组中
    var attStride = [];
    attStride[attStride.length] = 3;
    attStride[attStride.length] = 4;

    //生成VBO
    var position_vbo = self._createVbo(obj.vp);
    var color_vbo = self._createVbo(obj.vc);
    var vbos = [position_vbo, color_vbo];

    //如果有纹理
    if(obj.tc && obj.tex)
    {
        self.gl.uniform1i(self.hasTc, 1);
        self.gl.uniform1i(self.vHasTc, 1);

        attLocation[attLocation.length] = self.gl.getAttribLocation(self.program, 'textureCoord');
        attStride[attStride.length] = 2;
        var vTextureCoord = self._createVbo(obj.tc);
        vbos[vbos.length] = vTextureCoord;


        self.gl.bindTexture(self.gl.TEXTURE_2D, obj.tex);
    }
    else
    {
        self.gl.uniform1i(self.hasTc, 0);
        self.gl.uniform1i(self.vHasTc, 0);
    }

    self._bindVbo(vbos, attLocation, attStride);
    //生成IBO
    var ibo = self._createIbo(obj.pi);
    // IBO进行绑定并添加
    self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, ibo);
}


/**
 * 创建着色器对象
 * @param id
 * @returns {*}
 * @private
 */
VsGame.prototype._createShader = function(id)
{
    var self = this;
    // 用来保存着色器的变量
    var shader;
    // 根据id从HTML中获取指定的script标签
    var scriptElement = document.getElementById(id);
    // 如果指定的script标签不存在，则返回
    if(!scriptElement){return;}
    // 判断script标签的type属性
    switch(scriptElement.type){
        // 顶点着色器的时候
        case 'x-shader/x-vertex':
            shader = self.gl.createShader(self.gl.VERTEX_SHADER);
            break;
        // 片段着色器的时候
        case 'x-shader/x-fragment':
            shader = self.gl.createShader(self.gl.FRAGMENT_SHADER);
            break;
        default :
            return;
    }
    // 将标签中的代码分配给生成的着色器
    self.gl.shaderSource(shader, scriptElement.text);
    // 编译着色器
    self.gl.compileShader(shader);
    // 判断一下着色器是否编译成功
    if(self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)){ // 编译成功，则返回着色器
        return shader;
    }else{  // 编译失败，弹出错误消息
        alert(self.gl.getShaderInfoLog(shader));
    }
}

/**
 * 创建程序对象
 * @param vs
 * @param fs
 * @returns {*}
 * @private
 */
VsGame.prototype._createProgram = function()
{
    var self = this;
    // 程序对象的生成
    var program = self.gl.createProgram();
    // 向程序对象里分配着色器
    self.gl.attachShader(program, self.vShader);
    self.gl.attachShader(program, self.fShader);
    // 将着色器连接
    self.gl.linkProgram(program);
    // 判断着色器的连接是否成功
    if(self.gl.getProgramParameter(program, self.gl.LINK_STATUS))
    {    // 成功的话，将程序对象设置为有效
        self.gl.useProgram(program);
        self.program = program; // 返回程序对象
    }else{  // 如果失败，弹出错误信息
        alert(self.gl.getProgramInfoLog(program));
    }
}

// 生成VBO的函数
VsGame.prototype._createVbo = function(data)
{
    var self = this;
    // 生成缓存对象
    var vbo = self.gl.createBuffer();
    // 绑定缓存
    self.gl.bindBuffer(self.gl.ARRAY_BUFFER, vbo);
    // 向缓存中写入数据
    self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array(data), self.gl.STATIC_DRAW);
    // 将绑定的缓存设为无效
    self.gl.bindBuffer(self.gl.ARRAY_BUFFER, null);
    // 返回生成的VBO
    return vbo;
}

/**
 * 快捷绑定多个vbo的方法
 */
VsGame.prototype._bindVbo = function(vbos, locations, attr)
{
    var self = this;
    for(var key in vbos)
    {
        self.gl.bindBuffer(self.gl.ARRAY_BUFFER, vbos[key]);
        self.gl.enableVertexAttribArray(locations[key]);
        self.gl.vertexAttribPointer(locations[key], attr[key], self.gl.FLOAT, false, 0, 0);
    }
}

//IBO的生成函数
VsGame.prototype._createIbo = function(data)
{
    var self = this;
    // 生成缓存对象
    var ibo = self.gl.createBuffer();
    // 绑定缓存
    self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, ibo);
    // 向缓存中写入数据
    self.gl.bufferData(self.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), self.gl.STATIC_DRAW);
    // 将缓存的绑定无效化
    self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, null);
    // 返回生成的IBO
    return ibo;
}

VsGame.prototype.newObject = function(type, args)
{
    var self = this;
    var obj = new type(args);
    obj.game = self;
    obj._init();
    return obj;
}