import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformAccounts } from "../../store/accountSlice";
import { fetchPlatforms } from "../../store/platformSlice";
import PlatformAccountItem from "./PlatformAccountItem";
import NewAccountButton from "./NewAccountButton";

const PlatformAccountsList = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error } = useSelector((state) => state.account);
  const { platforms } = useSelector((state) => state.platform);

  useEffect(() => {
    dispatch(fetchPlatformAccounts());
    dispatch(fetchPlatforms());
  }, [dispatch]);

  // Group accounts by platform
  const accountsByPlatform = accounts.reduce((acc, account) => {
    const platformId = account.platform;
    if (!acc[platformId]) {
      acc[platformId] = [];
    }
    acc[platformId].push(account);
    return acc;
  }, {});

  if (loading && !accounts.length) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Platform Accounts
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Platform Accounts
        </h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Platform Accounts
      </h2>

      <div className="space-y-8">
        {platforms.map((platform) => (
          <div key={platform._id} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              {platform.name}
            </h3>

            {accountsByPlatform[platform._id]?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accountsByPlatform[platform._id].map((account) => (
                  <PlatformAccountItem
                    key={account._id}
                    account={account}
                    platform={platform}
                  />
                ))}
                <NewAccountButton platform={platform} />
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
                <p className="text-gray-500 mb-4">
                  No accounts for this platform
                </p>
                <NewAccountButton platform={platform} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformAccountsList;
