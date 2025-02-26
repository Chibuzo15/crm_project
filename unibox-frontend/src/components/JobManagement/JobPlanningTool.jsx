// File: src/components/JobManagement/JobPlanningTool.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobTypes } from "../../redux/actions/jobTypeActions";
import { fetchPlatforms } from "../../redux/actions/platformActions";
import { fetchPlatformAccounts } from "../../redux/actions/accountActions";
import JobTypeSelector from "./JobTypeSelector";
import ActionPlanningSection from "./ActionPlanningSection";
import "./JobPlanningTool.css";

const JobPlanningTool = () => {
  const dispatch = useDispatch();
  const { jobTypes, loading: jobTypesLoading } = useSelector(
    (state) => state.jobType
  );
  const { platforms, loading: platformsLoading } = useSelector(
    (state) => state.platform
  );
  const { accounts, loading: accountsLoading } = useSelector(
    (state) => state.account
  );

  const [selectedJobType, setSelectedJobType] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [actionPlan, setActionPlan] = useState({
    jobPosting: {
      platforms: [],
    },
    scouting: {
      platforms: [],
    },
  });

  // Load necessary data
  useEffect(() => {
    dispatch(fetchJobTypes());
    dispatch(fetchPlatforms());
    dispatch(fetchPlatformAccounts());
  }, [dispatch]);

  // Handle job type selection
  const handleJobTypeSelect = (jobType) => {
    setSelectedJobType(jobType);
    setJobTitle(jobType.title);

    // Initialize action plan based on available platforms
    const newActionPlan = {
      jobPosting: {
        platforms: platforms
          .filter((p) => p.type === "job-posting" || p.type === "both")
          .map((platform) => ({
            platform: platform._id,
            accounts: accounts
              .filter((acc) => acc.platform === platform._id)
              .map((acc) => ({
                account: acc._id,
                date: new Date(),
                recurring: false,
                recurringDays: 7,
              })),
          })),
      },
      scouting: {
        platforms: platforms
          .filter((p) => p.type === "scouting" || p.type === "both")
          .map((platform) => ({
            platform: platform._id,
            newChatsPerDay: 5,
            goalLeads: 10,
          })),
      },
    };

    setActionPlan(newActionPlan);
  };

  // Handle changes to job posting platforms
  const handleJobPostingChange = (platformId, changes) => {
    setActionPlan((prevPlan) => ({
      ...prevPlan,
      jobPosting: {
        ...prevPlan.jobPosting,
        platforms: prevPlan.jobPosting.platforms.map((p) =>
          p.platform === platformId ? { ...p, ...changes } : p
        ),
      },
    }));
  };

  // Handle changes to account settings for job posting
  const handleAccountChange = (platformId, accountId, changes) => {
    setActionPlan((prevPlan) => ({
      ...prevPlan,
      jobPosting: {
        ...prevPlan.jobPosting,
        platforms: prevPlan.jobPosting.platforms.map((p) =>
          p.platform === platformId
            ? {
                ...p,
                accounts: p.accounts.map((acc) =>
                  acc.account === accountId ? { ...acc, ...changes } : acc
                ),
              }
            : p
        ),
      },
    }));
  };

  // Handle changes to scouting platforms
  const handleScoutingChange = (platformId, changes) => {
    setActionPlan((prevPlan) => ({
      ...prevPlan,
      scouting: {
        ...prevPlan.scouting,
        platforms: prevPlan.scouting.platforms.map((p) =>
          p.platform === platformId ? { ...p, ...changes } : p
        ),
      },
    }));
  };

  // Save the action plan
  const handleSavePlan = () => {
    // This would dispatch an action to save the plan to the backend
    console.log("Saving action plan:", {
      jobType: selectedJobType?._id,
      jobTitle,
      actionPlan,
    });

    // Example dispatch (implementation would depend on your Redux structure)
    // dispatch(saveActionPlan({
    //   jobType: selectedJobType?._id,
    //   jobTitle,
    //   actionPlan
    // }));
  };

  const isLoading = jobTypesLoading || platformsLoading || accountsLoading;

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="job-planning-tool">
      <h2>Job Planning Tool</h2>

      <div className="job-planning-section">
        <h3>1. Select Job Type</h3>
        <JobTypeSelector
          jobTypes={jobTypes}
          selectedJobType={selectedJobType}
          onSelect={handleJobTypeSelect}
        />

        {selectedJobType && (
          <>
            <div className="job-title-section">
              <h3>2. Job Title</h3>
              <input
                type="text"
                className="job-title-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter job title"
              />
            </div>

            <div className="action-planning-section">
              <h3>3. Action Planning</h3>

              <ActionPlanningSection
                platforms={platforms}
                accounts={accounts}
                actionPlan={actionPlan}
                onJobPostingChange={handleJobPostingChange}
                onAccountChange={handleAccountChange}
                onScoutingChange={handleScoutingChange}
              />

              <div className="save-plan-section">
                <button
                  className="save-plan-button"
                  onClick={handleSavePlan}
                  disabled={!jobTitle}
                >
                  Save Plan
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JobPlanningTool;
