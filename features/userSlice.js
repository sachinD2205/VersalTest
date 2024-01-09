import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user: null,
    menu: null,
    usersDepartmentDashboardData: null,
    usersCitizenDashboardData: null,
    usersCitizenDashboardData: null,
    citizenDashboardTabsValue: 1,
    selectedApplicationId: "",
    selectedNotice: [],
    selectedServiceId: null,

    selectedNoticeAttachmentToSend: [],
    selectedNoticeHistoryToSend: [],
    selectedConcernDeptUserListToSend: [],
    selectedParawisePoints: [],
    applicationName: "",
    entryConnectionData: {},
    approvalOfNews: [],
    topupData: null,

    selectedBreadcrumbApplication: null,
  },
  reducers: {
    validate: (state) => {
      state.isLoggedIn = false;
    },

    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = [];
      state.isLoggedIn = false;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setUsersDepartmentDashboardData: (state, action) => {
      state.usersDepartmentDashboardData = action.payload;
    },
    setUsersCitizenDashboardData: (state, action) => {
      state.usersCitizenDashboardData = action.payload;
    },
    setCitizenDashboardTabsValue: (state, action) => {
      state.citizenDashboardTabsValue = action.payload;
    },
    setSelectedApplicationId: (state, action) => {
      state.selectedApplicationId = action.payload;
    },
    setSelectedNoticeAttachmentToSend: (state, action) => {
      state.selectedNoticeAttachmentToSend = action.payload;
    },
    setSelectedNoticeHistoryToSend: (state, action) => {
      state.selectedNoticeHistoryToSend = action.payload;
    },
    setSelectedConcernDeptUserListToSend: (state, action) => {
      state.selectedConcernDeptUserListToSend = action.payload;
    },
    setSelectedParawisePoints: (state, action) => {
      state.selectedParawisePoints = action.payload;
    },
    setSelectedNotice: (state, action) => {
      state.selectedNotice = action.payload;
    },
    setApplicationName: (state, action) => {
      state.applicationName = action.payload;
    },
    setNewEntryConnection: (state, action) => {
      state.entryConnectionData = action.payload;
    },
    setApprovalOfNews: (state, action) => {
      state.approvalOfNews = action.payload;
    },
    // selectedServiceId
    setSelectedServiceId: (state, action) => {
      state.selectedServiceId = action.payload;
    },
    setTopupData: (state, action) => {
      state.topupData = action.payload;
    },
    setSelectedBreadcrumbApplication: (state, action) => {
      state.selectedBreadcrumbApplication = action.payload;
    },
  },
});

export const {
  setMenu,
  login,
  logout,
  setUsersDepartmentDashboardData,
  setUsersCitizenDashboardData,
  setCitizenDashboardTabsValue,
  setSelectedApplicationId,
  setSelectedNotice,
  setSelectedServiceId,
  setSelectedNoticeAttachmentToSend,
  setSelectedNoticeHistoryToSend,
  setSelectedConcernDeptUserListToSend,
  setSelectedParawisePoints,
  setApplicationName,
  setNewEntryConnection,
  setApprovalOfNews,
  setTopupData,
  setSelectedBreadcrumbApplication,
} = userSlice.actions;

export default userSlice;
