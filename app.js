const express = require('express')
const db = require('./utils/db.js')
const multer = require('multer')
const upload = multer({ dest: './web/uploads/' })
const app = express()
app.use(express.static('./web/'));

/**
 *  parse application/x-www-form-urlencoded
 *  body-parse 已被弃用
*/
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// 2.1 登录接口编写
app.post('/login', (res, req) => {
    let { userName, passWord } = res.body
    if (userName == 'Raymond' && passWord == '123') {
        req.send({
            code: 200,
            msg: '登录成功'
        })
    } else {
        req.send({
            code: 400,
            msg: '用户名或密码有误'
        })
    }
})

//2.2 获取英雄列表接口编写
app.get('/list', (res, req) => {
    let heroList = db.getHeros()
    req.send({
        code: 200,
        msg: '获取成功',
        data: heroList
    })
})

//2.3 新增英雄接口编写
app.post('/add', upload.single('icon'), (res, req) => {
    if (!res.body.name || !res.body.skill || !res.file) {
        req.send({
            code: 400,
            msg: '参数错误'
        })
        return
    }

    let { name, skill } = res.body
    let icon = res.file.filename
    let isOk = db.addHero({ name, skill, icon })
    if (isOk) {
        req.send({
            code: 200,
            msg: '新增成功'
        })
    } else {
        req.send({
            code: 401,
            msg: '参数错误'
        })
    }
})

//2.4 删除接口编写
app.post('/delete', (res, req) => {
    let heroId = res.body.id
    let isOk = db.deleteHeroById(heroId)
    if (isOk) {
        req.send({
            code: 200,
            msg: '删除成功'
        })
    } else {
        req.send({
            code: 401,
            msg: '参数错误'
        })
    }
})

//2.5 查询单个英雄详情接口
app.get('/search', (res, req) => {
    let isOK = db.getHeroById(res.query.id)
    if (isOK == null) {
        req.send({
            code: 500,
            msg: '参数错误',
            data: null
        })
    } else {
        req.send({
            code: 200,
            msg: '查询成功',
            data: isOK
        })
    }
})

// 2.6  修改英雄接口
app.post('/edit', upload.single('icon'), (res, req) => {
    if (!res.body.id || !res.body.name || !res.body.skill ) {
        req.send({
            code: 500,
            msg: '参数错误'
        })
        return
    }
    let { id, name, skill,} = res.body
    let icon = undefined;
    // b1.如果 上传了文件
    if (res.file != undefined) {
        icon = res.file.filename; // 上传后在服务器端随机生成的文件名字
    }
    let isOK = db.editHero({id, name, skill, icon})
    if(isOK) {
        req.send({
            code: 200,
            msg: '修改成功'
        })
    } else {
        req.send({
            code: 500,
            msg: '修改失败'
        })  
    }
})

app.listen(3747, err => {
    if (err == null) {
        console.log('启动成功~3747')
    } else {
        console.log('启动失败~3747')
    }
})