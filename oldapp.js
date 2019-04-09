//未使用express,使用的原生写法

const http = require('http')
const fs = require('fs')
const Vue = require('vue')
const server = http.createServer()
const renderer = require('vue-server-renderer').createRenderer()
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

server.on('request', function (req, res) {
  var parseObj=require('url').parse(req.url,true)
  var pathname=parseObj.pathname
  str = `.${pathname}`
  console.log(pathname)
  if (pathname === '/' || pathname === '/index') str = './views/index.html'
  if (pathname === '/write') str = './views/write.html'
  console.log(str)
  if (str.match(/html$/)) {
    var dataVue = new Vue({
      data: {
        comments: commondata
      },
      template: fs.readFileSync(str, 'utf-8')
    })
    renderer.renderToString(dataVue, (err, html) => {
      if (err) {
        res.status(500).end('Internal Server Error')
        return
      }
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.end(html)
    })
  }
  else {
    if (pathname==='/pinglun')
    {
      commondata.unshift(parseObj.query)
      res.statusCode=302
      res.setHeader('Location','/')
    }
    fs.readFile(str, function (err, data) {
      if (err) {
        return res.end("404")
      }
      else return res.end(data)
    })
  }
})

//如果把3000改成80，那么直接127.0.0.1就可以访问，因为80是默认端口
server.listen(80, function () {
  console.log('服务器已经启动,通过http://127.0.0.1来访问');
})