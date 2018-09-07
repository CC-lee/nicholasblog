export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'article',
        data: {
          menu: {
            title: '文章',
            icon: 'ion-android-home',
            selected: false,
            expanded: true,
            order: 0
          }
        },
        children: [
          {
            path: 'articlemanage',
            data: {
              menu: {
                title: '文章管理',
                selected: false
              }
            }
          },
          {
            path: 'articlecreate',
            data: {
              menu: {
                title: '文章创建',
                selected: false
              }
            }
          }
        ]
      },
      {
        path: 'class',
        data: {
          menu: {
            title: '文章分类',
            icon: 'ion-pricetags',
            selected: false,
            expanded: true,
            order: 0,
          }
        },
        children: [
          {
            path: 'classmanage',
            data: {
              menu: {
                title: '分类管理',
              }
            }
          },
          {
            path: 'classcreate',
            data: {
              menu: {
                title: '分类创建',
              }
            }
          }
        ]
      },
      {
        path: 'message',
        data: {
          menu: {
            title: '留言',
            icon: 'ion-social-twitch',
            selected: false,
            expanded: true,
            order: 0,
          }
        },
        children: [
          {
            path: 'adminmessagemanage',
            data: {
              menu: {
                title: '管理者留言管理',
              }
            }
          },
          {
            path: 'adminmessagecreate',
            data: {
              menu: {
                title: '管理者留言创建',
              }
            }
          },
          {
            path: 'usermessagemanage',
            data: {
              menu: {
                title: '用户留言管理',
              }
            }
          }
        ]
      },
      {
        path: 'album',
        data: {
          menu: {
            title: '相册',
            icon: 'ion-social-instagram',
            selected: false,
            expanded: true,
            order: 0,
          }
        },
        children: [
          {
            path: 'albummanage',
            data: {
              menu: {
                title: '相册管理',
              }
            }
          },
          {
            path: 'imagecreate',
            data: {
              menu: {
                title: '图片创建',
              }
            }
          }
        ]
      },
      {
        path: 'shop',
        data: {
          menu: {
            title: '商店',
            icon: 'ion-ios-cart',
            selected: false,
            expanded: true,
            order: 0,
          }
        },
        children: [
          {
            path: 'shopmanage',
            data: {
              menu: {
                title: '商店管理',
              }
            }
          },
          {
            path: 'itemcreate',
            data: {
              menu: {
                title: '商品创建',
              }
            }
          }
        ]
      },
      {
        path: 'user',
        data: {
          menu: {
            title: '用户',
            icon: 'ion-person-stalker',
            selected: false,
            expanded: true,
            order: 0,
          }
        },
        children: [
          {
            path: 'usermanage',
            data: {
              menu: {
                title: '用户管理',
              }
            }
          },
          {
            path: 'orderlistmanage',
            data: {
              menu: {
                title: '用户订单管理',
              }
            }
          }
        ]
      }
    ]
  }
];
