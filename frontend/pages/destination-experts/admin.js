import React, { useContext } from 'react'
import AppContext from '../../src/features/AppContext'
import NotPrivileged from '../../src/patterns/NotPrivileged'
import DXDashboard from '../../src/features/DestinationExpert/DXDashboard'
import LoadingGif from '../../src/patterns/LoadingGif'

const index = () => {
    const { profile } = useContext(AppContext)
    if (!profile) return <LoadingGif />;
    return (
        <>
            {["Admin", "SuperAdmin"].includes(profile?.user_type?.name) ? <DXDashboard /> : <NotPrivileged />}
        </>
    )
}

export default index