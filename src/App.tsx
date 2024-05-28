import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewVideo from "./video/NewVideo";
import VideoList from "./video/VideoList";
import VideoDetails from "./video/VideoDetails";
import Navigator from "./components/Navigator";
import { AddIcon } from "@chakra-ui/icons";

const router = createBrowserRouter([
  {
    path: "/new",
    element: (
      <Navigator title="Post a new video">
        <NewVideo />
      </Navigator>
    ),
  },
  {
    path: "/",
    element: (
      <Navigator
        title="Your videos"
        link="/new"
        linkTitle="Post a video"
        linkIcon={<AddIcon />}
      >
        <VideoList />
      </Navigator>
    ),
  },
  {
    path: "/videos/:id",
    element: (
      <VideoDetails />
    ),
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
