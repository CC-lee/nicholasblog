const Home = r => require.ensure([], () => r(require('pages/Home.vue')), 'group-home')
const Front = r => require.ensure([], () => r(require('pages/Front.vue')), 'group-front')
const About = r => require.ensure([], () => r(require('pages/about/About.vue')), 'group-about')
const Tags = r => require.ensure([], () => r(require('pages/tags/Tags.vue')), 'group-tags')
const Article = r => require.ensure([], () => r(require('pages/article/Article.vue')), 'group-article')
const MessageBoard = r => require.ensure([], () => r(require('pages/messageboard/Messagebaord/MessageBoard.vue')), 'group-message')
const Message = r => require.ensure([], () => r(require('pages/messageboard/Message/Message.vue')), 'group-message')
const Album = r => require.ensure([], () => r(require('pages/album/Album/Album.vue')), 'group-album')
const Image = r => require.ensure([], () => r(require('pages/album/Image/Image.vue')), 'group-album')
const Shop = r => require.ensure([], () => r(require('pages/shop/Shop/Shop.vue')), 'group-shop')
const ShopCart = r => require.ensure([], () => r(require('pages/shop/Shopcart/ShopCart.vue')), 'group-shop')
const Item = r => require.ensure([], () => r(require('pages/shop/Item/Item.vue')), 'group-user')
const UseRreg = r => require.ensure([], () => r(require('pages/user/UserReg/UseRreg.vue')), 'group-user')
const UserLogin = r => require.ensure([], () => r(require('pages/user/UserLogin/UserLogin.vue')), 'group-user')
const UserAccount = r => require.ensure([], () => r(require('pages/user/UserAccount/UserAccount.vue')), 'group-user')
const UserPassword = r => require.ensure([], () => r(require('pages/user/UserPassword/UserPassword.vue')), 'group-user')
const UserNotify = r => require.ensure([], () => r(require('pages/user/UserNotify/UserNotify.vue')), 'group-user')
const UserOrderList = r => require.ensure([], () => r(require('pages/user/UserOrderList/UserOrderList.vue')), 'group-user')
const UserOrder = r => require.ensure([], () => r(require('pages/user/UserOrder/UserOrder.vue')), 'group-user')
const NotFound = r => require.ensure([], () => r(require('pages/NotFound.vue')), 'group-notfound')
const inBrowser = typeof window !== 'undefined'
import store from '../store'
import execlib from '../lib/execlib'

const frontverify = (to, from, next) => {
  const token = store.getters['global/getToken'] || !inBrowser
  const userjwt = localStorage.getItem(execlib.tokenName);
  if (!token && !userjwt) {
    next('/userLogin')
  } else {
    next()
  }
}

var routerA = [
  {
    path: '/',
    component: Front, // 这是文章页
    hidden: true,
    children: [
      { path: '', redirect: 'home', meta: { auth: false, title: '主页 -- Nicholas Lee\'s Blog' } },
      { path: 'home', component: Home, meta: { auth: false, title: '主页 -- Nicholas Lee\'s Blog' } }, // 主页
      { path: 'tags', component: Tags, name: 'tags', meta: { auth: false, scrollToTop: true, title: '标签 -- Nicholas Lee\'s Blog' } }, // 分类页
      { path: 'tags/:id', component: Tags, name: 'tagsarticles', meta: { auth: false, scrollToTop: false, title: '标签 -- Nicholas Lee\'s Blog' } }, // 分类选择页
      { path: 'search/tags/:text', name: 'tagsearch', component: Tags, meta: { auth: false, scrollToTop: true, title: '标签搜索 -- Nicholas Lee\'s Blog' } },
      { path: 'article/:id', component: Article, meta: { auth: false, scrollToTop: true, title: '文章' } }, // 文章页
      { path: 'search/article', redirect: 'home', component: Home, meta: { auth: false, scrollToTop: true, title: '搜索结果' } }, // 文章页
      { path: 'search/article/:text', name: 'articlesearch', component: Home, meta: { auth: false, scrollToTop: true, title: '搜索结果' } }, // 文章页
      { path: 'search/messageboard', redirect: { name: 'messageboard' }, meta: { auth: false, scrollToTop: true, title: '搜索结果' } }, // 留言搜索页
      { path: 'search/messageboard/:text', name: 'messagesearch', component: MessageBoard, meta: { auth: false, scrollToTop: true, title: '搜索结果' } }, // 留言搜索页
      {
        path: 'messageboard',
        component: MessageBoard,
        name: 'messageboard',
        meta: { auth: false, scrollToTop: true, title: '留言板 -- Nicholas Lee\'s Blog' },
        children: [
          { path: ':id', component: Message, meta: { auth: false, scrollToTop: true, title: '留言' } }, // 留言页
        ]
      }, // 留言板页
      {
        path: 'album',
        component: Album,
        meta: { auth: false, scrollToTop: true, title: '相册 -- Nicholas Lee\'s Blog' },
        children: [
          { path: ':id', component: Image, meta: { auth: false, scrollToTop: true, title: '图片' } },
        ]
      }, // 相册页
      { path: 'shop', component: Shop, meta: { auth: false, scrollToTop: true, title: '商店 -- Nicholas Lee\'s Blog' } }, // 商店页
      { path: 'shop/:id', component: Item, meta: { auth: false, scrollToTop: true, title: '商品' } }, // 商品页
      { path: 'shopcart', component: ShopCart, meta: { auth: false, scrollToTop: true, title: '购物车 -- Nicholas Lee\'s Blog' } }, // 购物车页
      { path: 'about', component: About, meta: { auth: false, title: '关于我 -- Nicholas Lee\'s Blog' } }, // 关于我
      { path: 'user/:userId/', redirect: 'user/:userId/userAccount', meta: { auth: false, title: '用户' } },
      { path: 'user/:userId/userAccount', component: UserAccount, meta: { auth: false, title: '账号资料' }, hidden: true, beforeEnter: frontverify },
      { path: 'user/:userId/userPassword', component: UserPassword, meta: { auth: false, title: '修改密码' }, hidden: true, beforeEnter: frontverify },
      { path: 'user/:userId/userNotify', component: UserNotify, meta: { auth: false, title: '用户通知' }, hidden: true, beforeEnter: frontverify },
      { path: 'user/:userId/shopCart', component: ShopCart, meta: { auth: false, title: '购物车' }, hidden: true, beforeEnter: frontverify },
      { path: 'user/:userId/userOrderList', component: UserOrderList, meta: { auth: false, title: '购物订单' }, hidden: true, beforeEnter: frontverify },
      { path: 'user/:userId/userOrderList/:orderId', component: UserOrder, meta: { auth: false, title: '订单' }, hidden: true, beforeEnter: frontverify }
    ]
  }
]

var routerB = [
  { path: '/userReg', component: UseRreg, meta: { auth: false, title: '注册 -- Nicholas Lee\'s Blog' }, hidden: true },
  { path: '/userLogin', component: UserLogin, meta: { auth: false, title: '登录 -- Nicholas Lee\'s Blog' }, hidden: true },
  { path: '*', component: NotFound, hidden: true }
]

var routes = routerA.concat(routerB)

export default routes
