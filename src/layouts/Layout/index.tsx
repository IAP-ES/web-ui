import { Outlet } from 'react-router-dom'
import Navbar from '../Layout/Navbar'

const CleanLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export { CleanLayout }
