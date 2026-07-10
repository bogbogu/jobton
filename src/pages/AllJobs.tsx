import PageBanner from '../components/ui/PageBanner'
import Jobs from '../features/Jobs/components/Jobs'

const AllJobs = () => {
    return (
        <>
            <PageBanner pageTitle='Explore Online Jobs' pageSubTitle='Discover verified online jobs from anywhere.' />
            <Jobs />
        </>
    )
}

export default AllJobs