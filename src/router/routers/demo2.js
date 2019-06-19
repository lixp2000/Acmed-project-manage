export default [
  {
    path: '/demo2',
    name: 'demo2',
    component: 'Main',
    meta: {
      permission: 'demo2',
      title: 'demo2'
    },
    children: [
      {
        path: 'item1',
        name: 'demo2_item1',
        component: 'demo2/item1',
        meta: {
          permission: 'demo2_item1',
          icon: '',
          title: 'demo2_item1'
        }
      },
      {
        path: 'item2',
        name: 'demo2_item2',
        component: 'demo2/item2',
        meta: {
          permission: 'demo2_item2',
          icon: '',
          title: 'demo2_item2'
        }
      }
    ]
  }
]
