import { useState } from "react";
import PageBanner from "../../../components/ui/PageBanner";
import JobDetail from "../../Jobs/components/JobDetail";
import { useJobs } from "../../../hooks/useJobs";
import type { Job } from "../../../hooks/useJobs";

const HireFreelancers = () => {
  const { jobs } = useJobs();
  const [selectedJob] = useState<Job | null>(jobs[0] ?? null);

  return (
    <>
      <PageBanner pageTitle="Hire Freelancers From Nigeria" />
      {selectedJob && <JobDetail job={selectedJob} />}
    </>
  );
};

export default HireFreelancers;
