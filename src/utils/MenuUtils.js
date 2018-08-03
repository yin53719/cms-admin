import lazyLoading from './lazyLoading'
export default (routers, data) => {
  generaMenu(routers, data)
}
function generaMenu(routers, data) {
    data.forEach((item) => {
      var menu = Object.assign({}, item)   
       menu.component = lazyLoading(menu.component)
      if (item.children && item.children.length>0) {
        menu.children = []
        generaMenu(menu.children, item.children)
      }
      routers.push(menu)
    })

}