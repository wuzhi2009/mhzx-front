import { createBrowserRouter, Navigate } from "react-router-dom";
import App from '../App';
import Admin from "../pages/Admin";
import DengMi from "../pages/DengMi";
import Doc from "../pages/Doc";
import Freund from "../pages/Freund";
import Fund from "../pages/Fund";
import IndexPage from "../pages/IndexPage";
import Info from "../pages/Info";
import KeJu from "../pages/KeJu";
import Login from "../pages/Login";
import My from "../pages/My";
import User from "../pages/User";
import ZhuCe from "../pages/ZhuCe";

const routers = createBrowserRouter([
    {
        index: true,
        element: <Navigate to="/index" />
    },
    {
        path: '',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/index" />
            },
            {
                path: 'index',
                element: <IndexPage />
            },
            {
                path: 'fund',
                element: <Fund />
            },
            {
                path: 'dengmi',
                element: <DengMi />
            },
            {
                path: 'admin',
                element: <Admin />
            },
            {
                path: 'doc/:docId',
                element: <Doc />
            },
            {
                path: 'ke-ju/:type',
                element: <KeJu />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'my',
                element: <My />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/index/my/user" />
                    },
                    {
                        path: 'user',
                        element: <User />
                    },
                    {
                        path: 'info',
                        element: <Info />
                    },
                    {
                        path: 'freund',
                        element: <Freund />
                    }
                ]
            },
        ]
    },
    {
        path: '/zhu-ce',
        element: <ZhuCe />
    }
])

export default routers;