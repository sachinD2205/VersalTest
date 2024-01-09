import { useSelector } from "react-redux";
import { useRouter } from "next/router";

//! Sachin_Durge 😵‍💫

// language
export function useLanguage() {
  const language = useSelector((state) => state?.labels?.language);
  return language;
}

// user
export function useUser() {
  const user = useSelector((state) => state?.user?.user);
  return user;
}

// logged In User (via local storage)
export function useLoggedInUser() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  return loggedInUser;
}

// logged In User (via Redux)
export function useApplicantType() {
  const loggedInUser = useSelector((state) => {
    if (state?.user?.user?.userDao?.cfcUser) {
      return 2;
    } else if (state?.user?.user?.userDao?.deptUser) {
      return 3;
    } else {
      return 1;
    }
  });
  return loggedInUser;
}

// Token
export function useGetToken() {
  const token = useSelector((state) => state?.user?.user?.token);
  return token;
}

// useMainDashboardRoute
export function useMainDashboardRoute() {
  const router = useRouter();

  useSelector((state) => {
    if (state?.user?.user?.userDao?.cfcUser) {
      router.push("/CFC_Dashboard");
    } else if (state?.user?.user?.userDao?.deptUser) {
      router.push("/DepartmentDashboard/dashboardV1");
    } else {
      router.push("/dashboard");
    }
  });
}

// useHawkerDashboardRoute
export function useHawkerDashboardRoute() {
  const router = useRouter();

  useSelector((state) => {
    if (state?.user?.user?.userDao?.cfcUser) {
      router.push("/CFC_Dashboard");
    } else if (state?.user?.user?.userDao?.deptUser) {
      router.push("/streetVendorManagementSystem/dashboards");
    } else {
      router.push("/dashboard");
    }
  });
}

// useHawkerDashboardRoute
export function useSportDashboardRoute() {
  const router = useRouter();

  useSelector((state) => {
    if (state?.user?.user?.userDao?.cfcUser) {
      router.push("/CFC_Dashboard");
    } else if (state?.user?.user?.userDao?.deptUser) {
      router.push("/sportsPortal/dashboard");
    } else {
      router.push("/dashboard");
    }
  });
}

//!

export function useGetLoggedInUserDetails() {
  const loogedInUser = useSelector((state) => state?.user?.user);
  return loogedInUser;
}

export function useDecryptedKeys() {
  const secretKeys = {
    upload: "passphraseaaaaaaaaupload",
    discard: "passphraseaaaaaaadiscard",
    preview: "passphraseaaaaaaapreview",
  };

  return secretKeys;
}



// useHawkerDashboardRoute
// export function usePropertyTaxDashboardRoute() {
//   const router = useRouter();
//   useSelector((state) => {
//     if (state?.user?.user?.userDao?.cfcUser) {
//       router.push("/CFC_Dashboard");
//     } else if (state?.user?.user?.userDao?.deptUser) {
//       router.push("/sportsPortal/dashboard");
//     } else {
//       router.push("/dashboard");
//     }
//   });
// }


// useGetSelectedMenuFromDrawer
export function useGetSelectedMenuFromDrawer() {
  const selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  return selectedMenu
}