import PageBanner from "../components/ui/PageBanner";
import About from "../features/About/components/About";

const AboutPage = () => {
  return (
    <>
      <PageBanner
        pageTitle="About Jobton"
        pageSubTitle="Connecting top talent with companies that value their work."
      />
      <About />
    </>
  );
};

export default AboutPage;
