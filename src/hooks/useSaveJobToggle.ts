import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { jobsService } from "../services/jobs.service";

// Shared by any hook that holds its own list of jobs (useJobs, useCompany,
// ...) and needs to persist a save/unsave toggle without duplicating the
// auth check and API call in each one. Returns the new `saved` value on
// success, or `null` if the visitor was redirected to log in instead —
// callers should treat `null` as "no local state change to make."
export const useSaveJobToggle = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return async (jobId: string, currentlySaved: boolean): Promise<boolean | null> => {
    if (!isAuthenticated) {
      navigate("/login");
      return null;
    }

    if (currentlySaved) {
      await jobsService.unsave(jobId);
    } else {
      await jobsService.save(jobId);
    }

    return !currentlySaved;
  };
};
