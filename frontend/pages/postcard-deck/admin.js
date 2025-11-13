import React, { useContext } from 'react'
import AppContext from '../../src/features/AppContext'
import NotPrivileged from '../../src/patterns/NotPrivileged'
import DXDashboard from '../../src/features/DestinationExpert/DXDashboard'
import LoadingGif from '../../src/patterns/LoadingGif'
import DeckDashboard from '../../src/features/PostcardDeck/DeckDashboard'

const index = () => {
    const { profile } = useContext(AppContext)
    if (!profile) return <LoadingGif />;
    return (
        <>
            {["Admin", "SuperAdmin", "DestinationExpert"].includes(profile?.user_type?.name) ? <DeckDashboard /> : <NotPrivileged />}
        </>
    )
}

export default index