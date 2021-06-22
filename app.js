const express = require('express')
const db = require('./utils/db.js')
const multer = require('multer')
const upload = multer({ dest: './web/uploads/' })
const app = express()

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
    if (userName === 'Raymond' && passWord === '123') {
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

app.listen(3747, err => {
    if (err == null) {
        console.log('启动成功~3747')
    } else {
        console.log('启动失败~3747')
    }
})