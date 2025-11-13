// pages/somePage.js (e.g., pages/index.js if needed)
import React from 'react'

const Index = () => {
    return <div>Redirecting...</div> // Optional fallback
}

export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: '/',
            permanent: false, // Use false for temporary redirects (307)
        },
    }
}

export default Index
