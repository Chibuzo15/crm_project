import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL for API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create API with RTK Query
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // If token exists, add authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Platform",
    "PlatformAccount",
    "JobType",
    "JobPosting",
    "Chat",
    "Message",
    "Auth",
  ],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    // Users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "User", id: _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Platforms
    getPlatforms: builder.query({
      query: () => "/platforms",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Platform", id: _id })),
              { type: "Platform", id: "LIST" },
            ]
          : [{ type: "Platform", id: "LIST" }],
    }),

    getPlatformById: builder.query({
      query: (id) => `/platforms/${id}`,
      providesTags: (result, error, id) => [{ type: "Platform", id }],
    }),

    createPlatform: builder.mutation({
      query: (platformData) => ({
        url: "/platforms",
        method: "POST",
        body: platformData,
      }),
      invalidatesTags: [{ type: "Platform", id: "LIST" }],
    }),

    updatePlatform: builder.mutation({
      query: ({ id, platformData }) => ({
        url: `/platforms/${id}`,
        method: "PUT",
        body: platformData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Platform", id },
        { type: "Platform", id: "LIST" },
      ],
    }),

    deletePlatform: builder.mutation({
      query: (id) => ({
        url: `/platforms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Platform", id },
        { type: "Platform", id: "LIST" },
      ],
    }),

    // Platform Accounts
    getPlatformAccounts: builder.query({
      query: (params) => ({
        url: "/accounts",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "PlatformAccount",
                id: _id,
              })),
              { type: "PlatformAccount", id: "LIST" },
            ]
          : [{ type: "PlatformAccount", id: "LIST" }],
    }),

    getPlatformAccountById: builder.query({
      query: (id) => `/accounts/${id}`,
      providesTags: (result, error, id) => [{ type: "PlatformAccount", id }],
    }),

    createPlatformAccount: builder.mutation({
      query: (accountData) => ({
        url: "/accounts",
        method: "POST",
        body: accountData,
      }),
      invalidatesTags: [{ type: "PlatformAccount", id: "LIST" }],
    }),

    updatePlatformAccount: builder.mutation({
      query: ({ id, accountData }) => ({
        url: `/accounts/${id}`,
        method: "PUT",
        body: accountData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlatformAccount", id },
        { type: "PlatformAccount", id: "LIST" },
      ],
    }),

    deletePlatformAccount: builder.mutation({
      query: (id) => ({
        url: `/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PlatformAccount", id },
        { type: "PlatformAccount", id: "LIST" },
      ],
    }),

    // Job Types
    getJobTypes: builder.query({
      query: (params) => ({
        url: "/job-types",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "JobType", id: _id })),
              { type: "JobType", id: "LIST" },
            ]
          : [{ type: "JobType", id: "LIST" }],
    }),

    searchJobTypes: builder.query({
      query: (query) => ({
        url: "/job-types/search",
        params: { q: query },
      }),
      providesTags: [{ type: "JobType", id: "SEARCH" }],
    }),

    getJobTypeById: builder.query({
      query: (id) => `/job-types/${id}`,
      providesTags: (result, error, id) => [{ type: "JobType", id }],
    }),

    createJobType: builder.mutation({
      query: (jobTypeData) => ({
        url: "/job-types",
        method: "POST",
        body: jobTypeData,
      }),
      invalidatesTags: [
        { type: "JobType", id: "LIST" },
        { type: "JobType", id: "SEARCH" },
      ],
    }),

    updateJobType: builder.mutation({
      query: ({ id, jobTypeData }) => ({
        url: `/job-types/${id}`,
        method: "PUT",
        body: jobTypeData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JobType", id },
        { type: "JobType", id: "LIST" },
        { type: "JobType", id: "SEARCH" },
      ],
    }),

    deleteJobType: builder.mutation({
      query: (id) => ({
        url: `/job-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "JobType", id },
        { type: "JobType", id: "LIST" },
        { type: "JobType", id: "SEARCH" },
      ],
    }),

    getJobTypeChatsByJobTypeId: builder.query({
      query: (jobTypeId) => `/job-types/${jobTypeId}/chats`,
      providesTags: (result, error, jobTypeId) => [
        { type: "JobType", id: jobTypeId, subtype: "Chats" },
      ],
    }),

    getJobTypeJobPostingsByJobTypeId: builder.query({
      query: (jobTypeId) => `/job-types/${jobTypeId}/job-postings`,
      providesTags: (result, error, jobTypeId) => [
        { type: "JobType", id: jobTypeId, subtype: "JobPostings" },
      ],
    }),

    // Job Postings
    getJobPostings: builder.query({
      query: (params) => ({
        url: "/job-postings",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "JobPosting", id: _id })),
              { type: "JobPosting", id: "LIST" },
            ]
          : [{ type: "JobPosting", id: "LIST" }],
    }),

    getJobPostingById: builder.query({
      query: (id) => `/job-postings/${id}`,
      providesTags: (result, error, id) => [{ type: "JobPosting", id }],
    }),

    createJobPosting: builder.mutation({
      query: (jobPostingData) => ({
        url: "/job-postings",
        method: "POST",
        body: jobPostingData,
      }),
      invalidatesTags: [
        { type: "JobPosting", id: "LIST" },
        { type: "JobType", id: "LIST", subtype: "JobPostings" },
      ],
    }),

    updateJobPosting: builder.mutation({
      query: ({ id, jobPostingData }) => ({
        url: `/job-postings/${id}`,
        method: "PUT",
        body: jobPostingData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JobPosting", id },
        { type: "JobPosting", id: "LIST" },
      ],
    }),

    updateJobPostingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/job-postings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JobPosting", id },
        { type: "JobPosting", id: "LIST" },
      ],
    }),

    scheduleJobPosting: builder.mutation({
      query: ({ id, scheduleData }) => ({
        url: `/job-postings/${id}/schedule`,
        method: "POST",
        body: scheduleData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JobPosting", id },
        { type: "JobPosting", id: "LIST" },
      ],
    }),

    deleteJobPosting: builder.mutation({
      query: (id) => ({
        url: `/job-postings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "JobPosting", id },
        { type: "JobPosting", id: "LIST" },
        { type: "JobType", id: "LIST", subtype: "JobPostings" },
      ],
    }),

    getJobPostingChats: builder.query({
      query: (jobPostingId) => `/job-postings/${jobPostingId}/chats`,
      providesTags: (result, error, jobPostingId) => [
        { type: "JobPosting", id: jobPostingId, subtype: "Chats" },
      ],
    }),

    getJobPostingStatistics: builder.query({
      query: (jobPostingId) => `/job-postings/${jobPostingId}/statistics`,
      providesTags: (result, error, jobPostingId) => [
        { type: "JobPosting", id: jobPostingId, subtype: "Statistics" },
      ],
    }),

    getUpworkJobProposals: builder.query({
      query: (accountId) => ({
        url: "/job-postings/upwork/proposals",
        params: { accountId },
      }),
      providesTags: [{ type: "JobPosting", id: "UpworkProposals" }],
    }),

    syncUpworkJobProposal: builder.mutation({
      query: (data) => ({
        url: "/job-postings/upwork/sync",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "JobPosting", id: "UpworkProposals" },
        { type: "JobPosting", id: "LIST" },
      ],
    }),

    // Chat endpoints
    getChats: builder.query({
      query: (params = {}) => ({
        url: "/chats",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Chat", id: _id })),
              { type: "Chat", id: "LIST" },
            ]
          : [{ type: "Chat", id: "LIST" }],
    }),

    getChatById: builder.query({
      query: (id) => `/chats/${id}`,
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    createChat: builder.mutation({
      query: (chatData) => ({
        url: "/chats",
        method: "POST",
        body: chatData,
      }),
      invalidatesTags: [{ type: "Chat", id: "LIST" }],
    }),

    updateChat: builder.mutation({
      query: ({ id, chatData }) => ({
        url: `/chats/${id}`,
        method: "PUT",
        body: chatData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Chat", id },
        { type: "Chat", id: "LIST" },
      ],
    }),

    markChatAsRead: builder.mutation({
      query: (id) => ({
        url: `/chats/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Chat", id },
        { type: "Chat", id: "LIST" },
      ],
    }),

    starChat: builder.mutation({
      query: (id) => ({
        url: `/chats/${id}/star`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Chat", id },
        { type: "Chat", id: "LIST" },
      ],
    }),

    // Message endpoints
    getMessages: builder.query({
      query: (chatId) => `/chats/${chatId}/messages`,
      providesTags: (result, error, chatId) => [
        { type: "Message", id: `LIST-${chatId}` },
      ],
    }),

    sendMessage: builder.mutation({
      query: ({ chatId, content }) => ({
        url: `/chats/${chatId}/messages`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Message", id: `LIST-${chatId}` },
        { type: "Chat", id: chatId },
      ],
    }),

    sendMessageWithAttachment: builder.mutation({
      query: ({ chatId, content, attachments }) => {
        const formData = new FormData();
        formData.append("content", content);

        if (attachments && attachments.length > 0) {
          attachments.forEach((attachment) => {
            if (attachment.file) {
              formData.append("attachments", attachment.file);
            }
          });
        }

        return {
          url: `/chats/${chatId}/messages/attachment`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Message", id: `LIST-${chatId}` },
        { type: "Chat", id: chatId },
      ],
    }),

    markMessagesAsRead: builder.mutation({
      query: (chatId) => ({
        url: `/chats/${chatId}/messages/read`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, chatId) => [
        { type: "Chat", id: chatId },
      ],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  //Auth
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  // Users
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Platforms
  useGetPlatformsQuery,
  useGetPlatformByIdQuery,
  useCreatePlatformMutation,
  useUpdatePlatformMutation,
  useDeletePlatformMutation,

  // Platform Accounts
  useGetPlatformAccountsQuery,
  useGetPlatformAccountByIdQuery,
  useCreatePlatformAccountMutation,
  useUpdatePlatformAccountMutation,
  useDeletePlatformAccountMutation,

  // Job Types
  useGetJobTypesQuery,
  useSearchJobTypesQuery,
  useGetJobTypeByIdQuery,
  useCreateJobTypeMutation,
  useUpdateJobTypeMutation,
  useDeleteJobTypeMutation,
  useGetJobTypeChatsByJobTypeIdQuery,
  useGetJobTypeJobPostingsByJobTypeIdQuery,

  // Job Postings
  useGetJobPostingsQuery,
  useGetJobPostingByIdQuery,
  useCreateJobPostingMutation,
  useUpdateJobPostingMutation,
  useUpdateJobPostingStatusMutation,
  useScheduleJobPostingMutation,
  useDeleteJobPostingMutation,
  useGetJobPostingChatsQuery,
  useGetJobPostingStatisticsQuery,
  useGetUpworkJobProposalsQuery,
  useSyncUpworkJobProposalMutation,

  // Chat hooks
  useGetChatsQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useMarkChatAsReadMutation,
  useStarChatMutation,

  // Message hooks
  useGetMessagesQuery,
  useSendMessageMutation,
  useSendMessageWithAttachmentMutation,
  useMarkMessagesAsReadMutation,
} = api;
