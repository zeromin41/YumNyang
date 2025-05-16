import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Default from '../Default'
import Home from '../pages/Home'
import Search from '../pages/Search'
import MyPage from '../pages/MyPage'
import SignupPage from '../pages/SignupPage'
import catAuthImg from '../assets/고양이측면책.png'
import catWithdrawImg from '../assets/고양이눈물.png'
import AuthLayout from '../layout/AuthLayout'
import LoginPage from '../pages/LoginPage'
import WithDrawPage from '../pages/WithDrawPage'
import RecipeDetailPage from '../pages/RecipeDetailPage'

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
                path: '/mypage',
                element: <MyPage />,
            },
            {
                path: '/recipe/:recipeId',
                element: <RecipeDetailPage />,
            },
        ],
    },
    {
        element: <AuthLayout title="회원가입" image={catAuthImg} />,
        children: [
            {
                path: '/signup',
                element: <SignupPage />,
            },
        ],
    },
    {
        element: <AuthLayout title="로그인" image={catAuthImg} />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
    {
        element: <AuthLayout title="회원탈퇴" image={catWithdrawImg} />,
        children: [
            {
                path: '/withdraw',
                element: <WithDrawPage />,
            },
        ],
    },
])

export default function Router() {
    return <RouterProvider router={router} />
}
