const Router = require('koa-router');
const router = new Router();

router.get('/', async ctx => {
  ctx.body = 'get messages';
});

router.get('/user/:id', async ctx => {
  ctx.body = 'get messages for user';
});

router.get('/conversation/:id', async ctx => {
  ctx.body = 'get messages for conversation';
});

module.exports = router.routes();