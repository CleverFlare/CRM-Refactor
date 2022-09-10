import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./store/userInfoSlice";
import EmployeesSlice from "./store/pages/EmployeesSlice";
import PostsSlice from "./store/pages/PostsSlice";
import ProjectsSlice from "./store/pages/ProjectsSlice";
import ChannelsSlice from "./store/pages/ChannelsSlice";
import ClientsSlice from "./store/pages/ClientsSlice";

export default configureStore({
  reducer: {
    userInfo: userInfoSlice,
    posts: PostsSlice,
    projects: ProjectsSlice,
    employess: EmployeesSlice,
    channels: ChannelsSlice,
    clients: ClientsSlice,
  },
});
