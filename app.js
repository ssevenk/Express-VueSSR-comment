const fs = require('fs')
const Vue = require('vue')
const express = require('express')
const renderer = require('vue-server-renderer').createRenderer()
const app = express()
const bodyParser=require('body-parser')
var commondata = [
  {
    name: '苏轼',
    content: '一蓑烟雨任平生'
  },
  {
    name: '李白',
    content: '十步杀一人'
  }
]

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

function red(dataVue, res) {
  renderer.renderToString(dataVue, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.setHeader('Content-Type', 'text/html;charset=utf-8')
    res.end(html)
  })
}

app.use('/public', express.static('/public'))

  .get('/', function (req, res) {
    var dataVue = new Vue({
      data: {
        comments: commondata
      },
      template: fs.readFileSync('./views/index.html', 'utf-8')
    })
    red(dataVue, res)
  }
  )

  .get('/index', function (req, res) {
    var dataVue = new Vue({
      data: {
        comments: commondata
      },
      template: fs.readFileSync('./views/index.html', 'utf-8')
    })
    red(dataVue, res)
  }
  )

  .get('/write', function (req, res) {
    var dataVue = new Vue({
      data: {
        comments: commondata
      },
      template: fs.readFileSync('./views/write.html', 'utf-8')
    })
    red(dataVue, res)
  }
  )

  .get('/pinglun', function (req, res) {
    commondata.unshift(req.query)
    // res.statusCode=302
    // res.setHeader('Location','/')
    res.redirect('/')
  })

  .use('/public/', express.static('/public/'))

  //如果把3000改成80，那么直接127.0.0.1就可以访问，因为80是默认端口
  .listen(5000, function () {
    console.log('服务器已经启动,通过http://127.0.0.1:5000来访问');
  })