const 
  Router = require('koa-router'),
  router = new Router(),
  Message = require('./Message');

router.get('/', async ctx => {
  ctx.body = await Message.find({});
});

router.get('/user/:id', async ctx => {
  ctx.body = 'get messages for user';
});

router.get('/conversation/:id', async ctx => {
  ctx.body = 'get messages for conversation';
});

router.delete('/', async ctx => {
  await Message.remove({});
  ctx.body = 'all messages deleted';
});

module.exports = router.routes();