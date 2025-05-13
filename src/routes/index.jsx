import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Default from '../Default'
import Home from '../pages/Home'
import Search from '../pages/Search'
import MyPage from '../pages/MyPage'
import SignupPage from '../pages/SignupPage'
import catAuthImg from '../assets/고양이측면책.png'
import AuthLayout from '../layout/AuthLayout'

const router = createBrowserRouter([
    {
        element: <Default />,
        children: [
            {
                path: '/',
                element: <Home />,
            },

            {
                path: '/search',
                element: <Search />,
            },
            {
                path: '/myPage',
                element: <MyPage />,
            },
        ],
    },
    {
        element: <AuthLayout title="회원가입" image={catAuthImg} />, // 회원가입 페이지에서는 signUpImage
        children: [
            {
                path: '/signup',
                element: <SignupPage />,
            },
        ],
    },
])

export default function Router() {
    return <RouterProvider router={router} />
}
