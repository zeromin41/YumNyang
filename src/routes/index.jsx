import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Default from "../Default";
import Home from "../pages/Home";
import Search from "../pages/Search";
import MyPage from "../pages/MyPage";

const router = createBrowserRouter([
    {
        element : <Default />,
        children : [
            {
                path : "/",
                element : <Home />
            },
            {
                path : "/search",
                element : <Search />
            },
            {
                path : "/myPage",
                element : <MyPage />
            }
        ]
    }
]);

export default function Router() {
    return <RouterProvider router={router} />;
}