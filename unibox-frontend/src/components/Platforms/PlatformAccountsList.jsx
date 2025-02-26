// File: src/components/Platforms/PlatformAccountsList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformAccounts } from "../../redux/actions/accountActions";
import PlatformAccountItem from "./PlatformAccountItem";
import NewAccountButton from "./NewAccountButton";
import "./PlatformAccountsList.css";

const PlatformAccountsList = () => {
  const dispatch = useDispatch();
  const { accounts, loading, error } = useSelector((state) => state.account);
  const { platforms } = useSelector((state) => state.platform);

  useEffect(() => {
    dispatch(fetchPlatformAccounts());
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

  if (loading) {
    return <div className="loading-spinner">Loading platform accounts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="platform-accounts-list">
      <h2>Platform Accounts</h2>

      {platforms.map((platform) => (
        <div key={platform._id} className="platform-section">
          <h3 className="platform-name">{platform.name}</h3>

          {accountsByPlatform[platform._id]?.length > 0 ? (
            <div className="accounts-grid">
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
            <div className="no-accounts">
              <p>No accounts for this platform</p>
              <NewAccountButton platform={platform} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlatformAccountsList;
