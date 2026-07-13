import { useEffect, useMemo, useState } from "react";
import { freelancers } from "../../../constants/freelancers";

export const useFreelancersService = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<number | null>(
    freelancers[0]?.id ?? null
  );

  const categories = useMemo(() => {
    const values = Array.from(new Set(freelancers.map((freelancer) => freelancer.category)));
    return ["All", ...values];
  }, []);

  const filteredFreelancers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return freelancers.filter((freelancer) => {
      const matchesCategory = category === "All" || freelancer.category === category;
      const matchesQuery =
        q.length === 0 ||
        freelancer.name.toLowerCase().includes(q) ||
        freelancer.role.toLowerCase().includes(q) ||
        freelancer.location.toLowerCase().includes(q) ||
        freelancer.skills.some((skill) => skill.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  useEffect(() => {
    if (filteredFreelancers.length === 0) {
      setSelectedFreelancerId(null);
      return;
    }

    const selectedStillExists = filteredFreelancers.some(
      (freelancer) => freelancer.id === selectedFreelancerId
    );

    if (!selectedStillExists) {
      setSelectedFreelancerId(filteredFreelancers[0].id);
    }
  }, [filteredFreelancers, selectedFreelancerId]);

  const selectedFreelancer = useMemo(
    () => filteredFreelancers.find((freelancer) => freelancer.id === selectedFreelancerId) ?? null,
    [filteredFreelancers, selectedFreelancerId]
  );

  return {
    query,
    setQuery,
    category,
    setCategory,
    categories,
    filteredFreelancers,
    selectedFreelancer,
    selectedFreelancerId,
    setSelectedFreelancerId,
  };
};
