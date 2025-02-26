import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobTypes } from "../../store/jobTypeSlice";
import { fetchPlatforms } from "../../store/platformSlice";
import { fetchPlatformAccounts } from "../../store/accountSlice";
import JobTypeSelector from "./JobTypeSelector";
import ActionPlanningSection from "./ActionPlanningSection";

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

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Job Planning Tool
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              1. Select Job Type
            </h3>
            <JobTypeSelector
              jobTypes={jobTypes}
              selectedJobType={selectedJobType}
              onSelect={handleJobTypeSelect}
            />
          </div>

          {selectedJobType && (
            <>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  2. Job Title
                </h3>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter job title"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  3. Action Planning
                </h3>

                <ActionPlanningSection
                  platforms={platforms}
                  accounts={accounts}
                  actionPlan={actionPlan}
                  onJobPostingChange={handleJobPostingChange}
                  onAccountChange={handleAccountChange}
                  onScoutingChange={handleScoutingChange}
                />

                <div className="mt-6 flex justify-end">
                  <button
                    className={`px-6 py-2 rounded-md text-white font-medium
                      ${
                        !jobTitle
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
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
      )}
    </div>
  );
};

export default JobPlanningTool;
