import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./store/userInfoSlice";
import EmployeesSlice from "./store/pages/EmployeesSlice";
import PostsSlice from "./store/pages/PostsSlice";
import ProjectsSlice from "./store/pages/ProjectsSlice";
import ChannelsSlice from "./store/pages/ChannelsSlice";
import ClientsSlice from "./store/pages/ClientsSlice";
import StatusSlice from "./store/pages/StatusSlice";
import ClientHistorySlice from "./store/pages/ClientHistorySlice";
import ClientCommentsSlice from "./store/pages/ClientCommentsSlice";
import DeletedClientsSlice from "./store/pages/DelectedClientsSlice";
import OverviewSlice from "./store/pages/OverviewSlice";
import ImportRegistrySlice from "./store/pages/ImportRegistrySlice";
import ExportRegistrySlice from "./store/pages/ExportRegistrySlice";

export default configureStore({
  reducer: {
    userInfo: userInfoSlice,
    posts: PostsSlice,
    projects: ProjectsSlice,
    employees: EmployeesSlice,
    channels: ChannelsSlice,
    clients: ClientsSlice,
    deletedClients: DeletedClientsSlice,
    status: StatusSlice,
    clientHistory: ClientHistorySlice,
    clientComments: ClientCommentsSlice,
    overview: OverviewSlice,
    importRegistry: ImportRegistrySlice,
    exportRegistry: ExportRegistrySlice,
  },
});
