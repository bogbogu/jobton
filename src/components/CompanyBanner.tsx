interface CompanyBannerProps {
    companyName?: string,
    domain: string,
    className?: string,
}

const CompanyBanner = ({
    companyName,
    domain,
    className
}: CompanyBannerProps) => {
    const companyBanner = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    if (domain) {

    }

    return (
        <>
            <img
                src={companyBanner}
                alt={companyName}
                className={`flex flex-row ${className}`}
            />
        </>
    )
}

export default CompanyBanner