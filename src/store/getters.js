const getters = {
  app: state => state.app,
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.manager.token, 
  manager: state => state.manager.manager,
  myPlatformList: state => state.app.myPlatformList,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  currentClassMate: state => state.class.currentClassMate

}
export default getters
