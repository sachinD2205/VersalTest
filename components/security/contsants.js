export const options = [
  {
    label: "Option A",
    value: "Option A",
  },
  {
    label: "Option B",
    value: "Option B",
  },
  {
    label: "Option C",
    value: "Option C",
  },
];

export const priorityList = [
  {
    label: "Emergency Visit",
    value: "Emergency Visit",
  },
  {
    label: "Department Visit",
    value: "Department Visit",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const employeeNames = [
  {
    label: "Kishor Hegade",
    value: "Kishor Hegade",
  },
  {
    label: "Vijay Narkhede",
    value: "Vijay Narkhede",
  },
  {
    label: "Suraj Sontakke",
    value: "Suraj Sontakke",
  },
];

export const zoneNames = [
  {
    label: "Malwadi",
    value: "Malwadi",
  },
  {
    label: "Pandhare Vasti",
    value: "Pandhare Vasti",
  },
  {
    label: "Kate Vasti",
    value: "Kate Vasti",
  },
];

export const buildingNames = [
  {
    label: "Amanora towers",
    value: "Amanora towers",
  },
  {
    label: "Flora Towers",
    value: "Flora Towers",
  },
  {
    label: "Dream homes",
    value: "Dream homes",
  },
];

export const wardNames = [
  {
    label: "Ward 23",
    value: "Ward 23",
  },
  {
    label: "Ward 52",
    value: "Ward 52",
  },
  {
    label: "ward 53",
    value: "ward 53",
  },
];

export const floorNames = [
  {
    label: "Floor 1",
    value: "Floor 1",
  },
  {
    label: "Floor 2",
    value: "Floor 2",
  },
  {
    label: "Floor 3",
    value: "Floor 3",
  },
];

export const vehicleTypes = [
  "Jeep",
  "Taxi",
  "Bus",
  // {
  //   label: "Jeep",
  //   value: "Jeep",
  // },
  // {
  //   label: "Taxi",
  //   value: "Taxi",
  // },
  // {
  //   label: "Bus",
  //   value: "Bus",
  // },
];

export const vehicleDriverNames = [
  {
    label: "Kishor Hegade",
    value: "Kishor Hegade",
  },
  {
    label: "Vijay Narkhede",
    value: "Vijay Narkhede",
  },
  {
    label: "Suraj Sontakke",
    value: "Suraj Sontakke",
  },
];

export function createVisitorEntryReportData(
  search,
  from_date,
  to_date,
  visitor_name,
  department_name,
  to_whoom_want_to_meet,
  meeting_reason,
  priority,
  mobile_number,
  visitor_out,
  visitor_visited_count,
) {
  return {
    search,
    from_date,
    to_date,
    visitor_name,
    department_name,
    to_whoom_want_to_meet,
    meeting_reason,
    priority,
    mobile_number,
    visitor_out,
    visitor_visited_count,
  };
}

export function createMaterialInOutReportData(
  search,
  from_date,
  to_date,
  department_name,
  material_name,
  material_count,
  mobile_number,
  material_in_out,
) {
  return {
    search,
    from_date,
    to_date,
    department_name,
    material_name,
    material_count,
    mobile_number,
    material_in_out,
  };
}

export function createVehicleEntryReportData(
  search,
  from_date,
  to_date,
  vehicle_type,
  vehicle_number,
  mobile_number,
  vehicle_driver_name,
  security_gaurd_name,
  private_vehicle_name,
  private_driver_name,
  vehicle_destination,
  licence_number,
  km_to_travel,
) {
  return {
    search,
    from_date,
    to_date,
    vehicle_type,
    vehicle_number,
    mobile_number,
    vehicle_driver_name,
    security_gaurd_name,
    private_vehicle_name,
    private_driver_name,
    vehicle_destination,
    licence_number,
    km_to_travel,
  };
}

export function createKeyIssueEntryReportData(
  search,
  from_date,
  to_date,
  department_name,
  security_gaurd_name,
  key_issue,
  key_recieve,
  mobile_number,
) {
  return {
    search,
    from_date,
    to_date,
    department_name,
    security_gaurd_name,
    key_issue,
    key_recieve,
    mobile_number,
  };
}

export const visitorEntryReportrows = [
  createVisitorEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "kishor",
    "department",
    "ganesh",
    "enquiry",
    "department visit",
    "98199180",
    "--",
    "2",
  ),
  createVisitorEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "kishor",
    "department",
    "ganesh",
    "enquiry",
    "department visit",
    "98199180",
    "--",
    "2",
  ),
  createVisitorEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "kishor",
    "department",
    "ganesh",
    "enquiry",
    "department visit",
    "98199180",
    "--",
    "2",
  ),
  createVisitorEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "kishor",
    "department",
    "ganesh",
    "enquiry",
    "department visit",
    "98199180",
    "--",
    "2",
  ),
  createVisitorEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "kishor",
    "department",
    "ganesh",
    "enquiry",
    "department visit",
    "98199180",
    "--",
    "2",
  ),
];
export const materialEntryReportrows = [
  createMaterialInOutReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "material",
    "2",
    "98199180",
    "--",
  ),
  createMaterialInOutReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "material",
    "2",
    "98199180",
    "--",
  ),
  createMaterialInOutReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "material",
    "2",
    "98199180",
    "--",
  ),
  createMaterialInOutReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "material",
    "2",
    "98199180",
    "--",
  ),
  createMaterialInOutReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "material",
    "2",
    "98199180",
    "--",
  ),
];

export const vehicleEntryReportrows = [
  createVehicleEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "van",
    "MH12AK91**",
    "Kishor",
    "98199180",
    "Ganesh",
    "SUV",
    "Suraj",
    "Mumbai",
    "GSF98199109",
    "98",
  ),
  createVehicleEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "van",
    "MH12AK91**",
    "Kishor",
    "98199180",
    "Ganesh",
    "SUV",
    "Suraj",
    "Mumbai",
    "GSF98199109",
    "98",
  ),
  createVehicleEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "van",
    "MH12AK91**",
    "Kishor",
    "98199180",
    "Ganesh",
    "SUV",
    "Suraj",
    "Mumbai",
    "GSF98199109",
    "98",
  ),
  createVehicleEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "van",
    "MH12AK91**",
    "Kishor",
    "98199180",
    "Ganesh",
    "SUV",
    "Suraj",
    "Mumbai",
    "GSF98199109",
    "98",
  ),
  createVehicleEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "van",
    "MH12AK91**",
    "Kishor",
    "98199180",
    "Ganesh",
    "SUV",
    "Suraj",
    "Mumbai",
    "GSF98199109",
    "98",
  ),
];

export const keyIssueEntryReportrows = [
  createKeyIssueEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "Ganesh",
    "issue",
    "recieve",
    "8879178198",
  ),
  createKeyIssueEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "Ganesh",
    "issue",
    "recieve",
    "8879178198",
  ),
  createKeyIssueEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "Ganesh",
    "issue",
    "recieve",
    "8879178198",
  ),
  createKeyIssueEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "Ganesh",
    "issue",
    "recieve",
    "8879178198",
  ),
  createKeyIssueEntryReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "department",
    "Ganesh",
    "issue",
    "recieve",
    "8879178198",
  ),
];

export function createNightDeptReportData(
  search,
  from_date,
  to_date,
  ward_name,
  department_name,
  floor,
  security_gaurd,
  department_open_close,
  light_on_off,
  fan_on_off,
  presense_people_count,
  presense_people_name,
  remark,
) {
  return {
    search,
    from_date,
    to_date,
    ward_name,
    department_name,
    floor,
    security_gaurd,
    department_open_close,
    light_on_off,
    fan_on_off,
    presense_people_count,
    presense_people_name,
    remark,
  };
}

export const nightDeptReportrows = [
  createNightDeptReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "32",
    "ganesh",
    "open",
    "on",
    "off",
    "2",
    "kishor, ganesh",
    "good",
  ),
  createNightDeptReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "32",
    "ganesh",
    "open",
    "on",
    "off",
    "2",
    "kishor, ganesh",
    "good",
  ),
  createNightDeptReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "32",
    "ganesh",
    "open",
    "on",
    "off",
    "2",
    "kishor, ganesh",
    "good",
  ),
  createNightDeptReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "32",
    "ganesh",
    "open",
    "on",
    "off",
    "2",
    "kishor, ganesh",
    "good",
  ),
  createNightDeptReportData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "32",
    "ganesh",
    "open",
    "on",
    "off",
    "2",
    "kishor, ganesh",
    "good",
  ),
];

export function createSecurityGaurdDutyChartData(
  search,
  from_date,
  to_date,
  ward_name,
  department_name,
  location,
  designation,
  month,
  shift_type,
) {
  return {
    search,
    from_date,
    to_date,
    ward_name,
    department_name,
    location,
    designation,
    month,
    shift_type,
  };
}

export const securityGaurdDutyChartrows = [
  createSecurityGaurdDutyChartData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "Malwadi",
    "Manager",
    "June",
    "Night",
  ),
  createSecurityGaurdDutyChartData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "Malwadi",
    "Manager",
    "June",
    "Night",
  ),
  createSecurityGaurdDutyChartData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "Malwadi",
    "Manager",
    "June",
    "Night",
  ),
  createSecurityGaurdDutyChartData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "Malwadi",
    "Manager",
    "June",
    "Night",
  ),
  createSecurityGaurdDutyChartData(
    "--",
    "13/11/2019",
    "14/11/2019",
    "ward 25",
    "department",
    "Malwadi",
    "Manager",
    "June",
    "Night",
  ),
];
