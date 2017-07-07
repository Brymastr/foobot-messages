const Router = require('koa-router');
const router = new Router({
  prefix: '/messages'
});

router.get('/', async ctx => {
  ctx.body = 'get messages for user?';
});

router.post('/', async ctx => {
  ctx.body = `create a new message over http. Although I don't know why this would be done.`;
});

module.exports = router.routes();