import userRoute from './user.route.js'

export default (app) => {
  app.use('/user', userRoute);
};