// File: src/components/JobManagement/JobPostingPlatform.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./JobPostingPlatform.css";

const JobPostingPlatform = ({
  platform,
  accounts,
  platformPlan,
  onPlatformChange,
  onAccountChange,
}) => {
  const handleAccountDateChange = (accountId, date) => {
    onAccountChange(accountId, { date });
  };

  const handleAccountRecurringChange = (accountId, recurring) => {
    onAccountChange(accountId, { recurring });
  };

  const handleAccountRecurringDaysChange = (accountId, days) => {
    onAccountChange(accountId, { recurringDays: parseInt(days, 10) });
  };

  return (
    <div className="job-posting-platform">
      <h5>{platform.name}</h5>

      <div className="post-new-job">
        <h6>Post new job proposal</h6>

        {platformPlan.accounts.map((accountPlan) => {
          const account = accounts.find((a) => a._id === accountPlan.account);

          if (!account) return null;

          return (
            <div key={account._id} className="account-plan">
              <div className="account-info">
                <span>Account: {account.username}</span>
              </div>

              <div className="account-date">
                <label>Post Date:</label>
                <DatePicker
                  selected={new Date(accountPlan.date)}
                  onChange={(date) =>
                    handleAccountDateChange(account._id, date)
                  }
                  className="date-picker"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="account-recurring">
                <label>
                  <input
                    type="checkbox"
                    checked={accountPlan.recurring}
                    onChange={(e) =>
                      handleAccountRecurringChange(
                        account._id,
                        e.target.checked
                      )
                    }
                  />
                  Recurring?
                </label>

                {accountPlan.recurring && (
                  <div className="recurring-days">
                    <label>Every:</label>
                    <select
                      value={accountPlan.recurringDays}
                      onChange={(e) =>
                        handleAccountRecurringDaysChange(
                          account._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobPostingPlatform;
