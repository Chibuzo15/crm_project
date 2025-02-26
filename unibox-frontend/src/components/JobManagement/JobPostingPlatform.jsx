import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h5 className="text-lg font-medium text-gray-900 mb-3">
        {platform.name}
      </h5>

      <div className="space-y-4">
        <div>
          <h6 className="font-medium text-gray-700 mb-2">
            Post new job proposal
          </h6>

          {platformPlan.accounts.length > 0 ? (
            <div className="space-y-4">
              {platformPlan.accounts.map((accountPlan) => {
                const account = accounts.find(
                  (a) => a._id === accountPlan.account
                );

                if (!account) return null;

                return (
                  <div key={account._id} className="bg-gray-50 p-3 rounded-md">
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">
                        Account:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {account.username}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Post Date:
                        </label>
                        <DatePicker
                          selected={new Date(accountPlan.date)}
                          onChange={(date) =>
                            handleAccountDateChange(account._id, date)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          dateFormat="yyyy-MM-dd"
                        />
                      </div>

                      <div>
                        <div className="flex items-center h-full pt-5">
                          <input
                            type="checkbox"
                            id={`recurring-${account._id}`}
                            checked={accountPlan.recurring}
                            onChange={(e) =>
                              handleAccountRecurringChange(
                                account._id,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`recurring-${account._id}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Recurring?
                          </label>

                          {accountPlan.recurring && (
                            <div className="ml-4">
                              <select
                                value={accountPlan.recurringDays}
                                onChange={(e) =>
                                  handleAccountRecurringDaysChange(
                                    account._id,
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              >
                                <option value="7">7 days</option>
                                <option value="14">14 days</option>
                                <option value="30">30 days</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              No accounts available for this platform
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostingPlatform;
