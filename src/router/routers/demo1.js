export default [
  {
    path: '/demo1',
    name: 'demo1',
    component: 'Main',
    meta: {
      permission: 'demo1',
      title: 'demo1'
    },
    children: [
      {
        path: 'list',
        name: 'demo1_list',
        component: 'JumpSubmenu',
        meta: {
          permission: 'demo1_list',
          isSubmenu: true,
          icon: '',
          title: 'demo1_list'
        },
        children: [
          {
            path: 'item1',
            name: 'demo1_list_item1',
            component: 'demo1/list/item1',
            meta: {
              permission: 'demo1_list_item1',
              icon: '',
              title: 'demo1_item1'
            }
          },
          {
            path: 'item2',
            name: 'demo1_list_item2',
            component: 'demo1/list/item2',
            meta: {
              permission: 'demo1_list_item2',
              icon: '',
              title: 'demo1_item2'
            }
          }
        ]
      }
    ]
  }
]
