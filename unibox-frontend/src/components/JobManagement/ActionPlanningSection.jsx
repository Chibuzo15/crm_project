// File: src/components/JobManagement/ActionPlanningSection.jsx
import React from "react";
import JobPostingPlatform from "./JobPostingPlatform";
import ScoutingPlatform from "./ScoutingPlatform";
import "./ActionPlanningSection.css";

const ActionPlanningSection = ({
  platforms,
  accounts,
  actionPlan,
  onJobPostingChange,
  onAccountChange,
  onScoutingChange,
}) => {
  const jobPostingPlatforms = platforms.filter(
    (p) => p.type === "job-posting" || p.type === "both"
  );
  const scoutingPlatforms = platforms.filter(
    (p) => p.type === "scouting" || p.type === "both"
  );

  return (
    <div className="action-planning-container">
      {jobPostingPlatforms.length > 0 && (
        <div className="job-posting-platforms">
          <h4>Job-Posting Platforms</h4>

          {actionPlan.jobPosting.platforms
            .filter((p) =>
              jobPostingPlatforms.some(
                (platform) => platform._id === p.platform
              )
            )
            .map((platformPlan) => {
              const platform = platforms.find(
                (p) => p._id === platformPlan.platform
              );
              const platformAccounts = accounts.filter(
                (acc) => acc.platform === platform._id
              );

              return (
                <JobPostingPlatform
                  key={platform._id}
                  platform={platform}
                  accounts={platformAccounts}
                  platformPlan={platformPlan}
                  onPlatformChange={(changes) =>
                    onJobPostingChange(platform._id, changes)
                  }
                  onAccountChange={(accountId, changes) =>
                    onAccountChange(platform._id, accountId, changes)
                  }
                />
              );
            })}
        </div>
      )}

      {scoutingPlatforms.length > 0 && (
        <div className="scouting-platforms">
          <h4>Chatting / Scouting Platforms</h4>

          {actionPlan.scouting.platforms
            .filter((p) =>
              scoutingPlatforms.some((platform) => platform._id === p.platform)
            )
            .map((platformPlan) => {
              const platform = platforms.find(
                (p) => p._id === platformPlan.platform
              );

              return (
                <ScoutingPlatform
                  key={platform._id}
                  platform={platform}
                  platformPlan={platformPlan}
                  onPlatformChange={(changes) =>
                    onScoutingChange(platform._id, changes)
                  }
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ActionPlanningSection;
