import React from "react";
import bannerBg from "../../assets/images/banner-bg.png";

interface PageBannerProps {
    pageTitle: string;
    pageSubTitle?: string;
    bannerBackground?: string;
}

const PageBanner = ({
    pageTitle,
    pageSubTitle,
    bannerBackground,
}: PageBannerProps) => {
    return (
        <section
            className="relative bg-slate-50 bg-cover bg-center h-[400px]"
            style={{
                backgroundImage: `url(${bannerBackground ?? bannerBg})`,
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative flex flex-col justify-center items-center h-full">
                <h2 className="text-center font-bold text-5xl text-white">{pageTitle}</h2>
                {pageSubTitle && <p className="text-white text-center mt-2">{pageSubTitle}</p>}
            </div>
        </section>
    );
};

export default PageBanner;