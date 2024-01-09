import homeLabels from './labels/common/homeLabels'
import loginLabels from './labels/common/loginLabels'
import dashboardlabels from './labels/common/dashboardLabels'
import profileLabels from './labels/common/profileLabels'
import forbiddenAccessLabels from './labels/common/errorLabels'

import tpLabels from './labels/modules/tpLabels'
import cfcLabels from './labels/modules/cfcLabels'
import fbsLabels from './labels/modules/fbsLabels'
import hmsLabels from './labels/modules/hmsLabels'
import lcLabels from './labels/modules/lcLabels'
import mrLabels from './labels/modules/mrLabels'
import msLabels from './labels/modules/msLabels'
import ptaxLabels from './labels/modules/ptaxLabels'
import spLabels from './labels/modules/spLabels'
import sslLabels from './labels/modules/sslLabels'
import gmLabels from './labels/modules/gmLabels'
import ebpLabels from './labels/modules/ebpLabels'
import bsupLabels from './labels/modules/bsupLabels'
import vmsLabels from './labels/modules/vmsLabels'
import lmLabels from './labels/modules/lmLabels'
import slumLabels from './labels/modules/slumLabels'
import smLabels from './labels/modules/smLabels'
import schoolLabels from './labels/modules/schoolLabels'
import nrmsLabels from './labels/modules/nrmsLabels'
import rtiLabels from './labels/modules/rtiLabels'
import slbLabels from './labels/modules/slbLabels'
import pabbmLabels from './labels/modules/pabbmLabels'
import roadExcavationLabels from './labels/modules/roadExcavation'
import cfc_Labels from './labels/modules/cfc_labels'
import wtLabels from './labels/modules/wtLabels'

let newLabels = {
  //common
  home: homeLabels,
  login: loginLabels,
  dashboard: dashboardlabels,
  dashboardV3: dashboardlabels,
  CompleteProfile: profileLabels,
  403: forbiddenAccessLabels,
  404: forbiddenAccessLabels,
  500: forbiddenAccessLabels,

  //modules
  townPlanning: tpLabels,
  common: cfcLabels,
  FireBrigadeSystem: fbsLabels,
  streetVendorManagementSystem: hmsLabels,
  waterTax: wtLabels,
  LegalCase: lcLabels,
  marriageRegistration: mrLabels,
  grievanceMonitoring: gmLabels,
  municipalSecretariatManagement: msLabels,
  propertyTax: ptaxLabels,
  sportsPortal: spLabels,
  skySignLicense: sslLabels,
  ElectricBillingPayment: ebpLabels,
  BsupNagarvasthi: bsupLabels,
  veterinaryManagementSystem: vmsLabels,
  lms: lmLabels,
  SlumBillingManagementSystem: slumLabels,
  sm: smLabels,
  school: schoolLabels,
  RTIOnlineSystem: rtiLabels,
  Slb: slbLabels,
  PublicAuditorium: pabbmLabels,
  newsRotationManagementSystem: nrmsLabels,
  roadExcavation: roadExcavationLabels,
  CFC: cfc_Labels,
  // for cfc dashboard we use the dashboardlabels
  CFC_Dashboard: dashboardlabels,
}

export default newLabels
